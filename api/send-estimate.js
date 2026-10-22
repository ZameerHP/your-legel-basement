// Vercel serverless endpoint for Yours Legal Basement estimate requests.
// Set only RESEND_API_KEY in Vercel. Keep sender and recipient configuration server-side.
const RESEND_ENDPOINT = "https://api.resend.com/emails";
const OWNER_EMAIL = "Yourslegalbasement@gmail.com";
const FROM_EMAIL = "Yours Legal Basement <website@yourslegalbasement.ca>";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function clean(value, maxLength = 2000) {
  return String(value ?? "").trim().slice(0, maxLength);
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Missing RESEND_API_KEY environment variable.");
    return res.status(500).json({ error: "Email service is not configured yet. Please call (437) 237-7704." });
  }

  const body = typeof req.body === "string" ? (() => {
    try { return JSON.parse(req.body); } catch { return {}; }
  })() : (req.body || {});

  const email = clean(body.email, 254);
  const phone = clean(body.phone, 80);
  const project = clean(body.project, 160);
  const city = clean(body.city, 160);
  const message = clean(body.message, 5000);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  if (!phone || !project || !city) {
    return res.status(400).json({ error: "Please complete the required fields and try again." });
  }

  const submittedAt = new Date().toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    dateStyle: "medium",
    timeStyle: "short"
  });

  const rows = [
    ["Client email", email],
    ["Phone", phone],
    ["Renovation type", project],
    ["City", city],
    ["Message", message || "No additional message provided"],
    ["Received", submittedAt + " (Toronto time)"]
  ];

  const htmlRows = rows.map(([label, value]) =>
    "<tr><th style=\"padding:10px 12px;text-align:left;vertical-align:top;background:#f5f5f5;border-bottom:1px solid #e5e5e5;white-space:nowrap\">" +
    escapeHtml(label) + "</th><td style=\"padding:10px 12px;border-bottom:1px solid #e5e5e5;white-space:pre-wrap;overflow-wrap:anywhere\">" +
    escapeHtml(value) + "</td></tr>"
  ).join("");

  try {
    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [OWNER_EMAIL],
        reply_to: email,
        subject: "New website estimate request — " + project + " (" + city + ")",
        html: "<div style=\"font-family:Arial,sans-serif;color:#171717;max-width:720px;margin:0 auto\">" +
          "<h1 style=\"font-size:22px;margin:0 0 8px\">New Estimate Request</h1>" +
          "<p style=\"margin:0 0 20px;color:#666\">A client submitted the Yours Legal Basement website form.</p>" +
          "<table style=\"width:100%;border-collapse:collapse;font-size:14px\"><tbody>" + htmlRows + "</tbody></table>" +
          "<p style=\"font-size:12px;color:#777;margin-top:18px\">Reply directly to this email to contact the client.</p></div>",
        text: rows.map(([label, value]) => label + ":\n" + value).join("\n\n")
      })
    });

    const result = await resendResponse.json().catch(() => ({}));
    if (!resendResponse.ok) {
      console.error("Resend API rejected estimate email:", resendResponse.status, result);
      return res.status(502).json({
        error: resendResponse.status === 403 || resendResponse.status === 422
          ? "The email provider could not send this message. Please call (437) 237-7704 while the sending domain is verified."
          : "Your request could not be emailed right now. Please try again or call (437) 237-7704."
      });
    }

    return res.status(200).json({ ok: true, id: result.id });
  } catch (error) {
    console.error("Estimate email request failed:", error);
    return res.status(502).json({ error: "Your request could not be emailed right now. Please try again or call (437) 237-7704." });
  }
};

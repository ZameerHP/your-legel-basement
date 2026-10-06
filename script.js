(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const progress = document.querySelector('.scroll-progress span');
  const year = document.querySelector('#year');
  year.textContent = new Date().getFullYear();

  menuToggle?.addEventListener('click', () => {
    const open = header.classList.toggle('menu-active');
    document.body.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    header.classList.remove('menu-active'); document.body.classList.remove('menu-open'); menuToggle.setAttribute('aria-expanded','false');
  }));

  const updateHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = `scaleX(${pct})`;
  };
  addEventListener('scroll', updateHeader, { passive:true });
  updateHeader();

  if (!prefersReduced && window.Lenis && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: .9 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    gsap.from('.hero-eyebrow', { y:22, opacity:0, duration:.8, delay:.15, ease:'power3.out' });
    gsap.from('.hero-title span', { yPercent:110, opacity:0, duration:1.15, stagger:.1, delay:.25, ease:'power4.out' });
    gsap.from('.hero-bottom', { y:35, opacity:0, duration:.9, delay:.55, ease:'power3.out' });
    gsap.from('.hero-stats > div', { y:20, opacity:0, duration:.7, stagger:.08, delay:.72, ease:'power3.out' });
    gsap.to('.hero-media img', { scale:1, ease:'none', scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true } });
    gsap.to('.hero-inner', { y:80, opacity:.35, ease:'none', scrollTrigger:{ trigger:'.hero', start:'45% top', end:'bottom top', scrub:true } });
    gsap.to('.orbit-one', { rotation:55, x:-70, ease:'none', scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true } });
    gsap.to('.orbit-two', { rotation:-80, y:70, ease:'none', scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true } });

    document.querySelectorAll('.reveal-up').forEach(el => gsap.from(el, { y:34, opacity:0, duration:.8, ease:'power3.out', scrollTrigger:{ trigger:el, start:'top 88%', once:true } }));
    document.querySelectorAll('.reveal-card').forEach(el => gsap.from(el, { y:55, opacity:0, scale:.985, duration:.9, ease:'power3.out', scrollTrigger:{ trigger:el, start:'top 88%', once:true } }));
    document.querySelectorAll('.reveal-scale').forEach(el => gsap.from(el, { scale:.78, rotation:-8, opacity:0, duration:1.05, ease:'power4.out', scrollTrigger:{ trigger:el, start:'top 83%', once:true } }));
    document.querySelectorAll('.reveal-lines').forEach(el => gsap.from(el, { y:50, opacity:0, duration:.95, ease:'power3.out', scrollTrigger:{ trigger:el, start:'top 90%', once:true } }));

    gsap.to('.fan-a', { y:-40, rotation:-12, x:-20, ease:'none', scrollTrigger:{ trigger:'.image-fan', start:'top bottom', end:'bottom top', scrub:true } });
    gsap.to('.fan-b', { y:28, rotation:-5, ease:'none', scrollTrigger:{ trigger:'.image-fan', start:'top bottom', end:'bottom top', scrub:true } });
    gsap.to('.fan-c', { y:-55, scale:1.04, ease:'none', scrollTrigger:{ trigger:'.image-fan', start:'top bottom', end:'bottom top', scrub:true } });
    gsap.to('.fan-d', { y:28, rotation:5, ease:'none', scrollTrigger:{ trigger:'.image-fan', start:'top bottom', end:'bottom top', scrub:true } });
    gsap.to('.fan-e', { y:-40, rotation:12, x:20, ease:'none', scrollTrigger:{ trigger:'.image-fan', start:'top bottom', end:'bottom top', scrub:true } });

    if (innerWidth > 720) {
      const gallery = document.querySelector('.horizontal-gallery');
      const track = document.querySelector('.gallery-track');
      const getDistance = () => Math.max(0, track.scrollWidth - innerWidth + innerWidth * .05);
      gsap.to(track, {
        x: () => -getDistance(), ease:'none',
        scrollTrigger:{ trigger:gallery, start:'top top', end:() => `+=${getDistance()}`, pin:true, scrub:1, invalidateOnRefresh:true }
      });
    }

    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width/2) * .12;
        const y = (e.clientY - r.top - r.height/2) * .15;
        gsap.to(btn,{x,y,duration:.25,ease:'power2.out'});
      });
      btn.addEventListener('mouseleave',()=>gsap.to(btn,{x:0,y:0,duration:.5,ease:'elastic.out(1,.4)'}));
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({behavior: prefersReduced ? 'auto':'smooth', block:'start'});
    });
  });

  const form = document.querySelector('#estimateForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = form.querySelector('.form-status');
    status.textContent = 'Thanks — your estimate request is ready. For immediate service, call (437) 237-7704.';
    form.querySelector('button').classList.add('submitted');
    form.querySelector('button span').textContent = 'Request Received';
  });
})();

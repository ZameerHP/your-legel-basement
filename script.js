(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const progress = document.querySelector('.scroll-progress span');
  const year = document.querySelector('#year');

  if (year) year.textContent = new Date().getFullYear();

  const closeMenu = () => {
    header?.classList.remove('menu-active');
    document.body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };

  menuToggle?.addEventListener('click', () => {
    const open = header?.classList.toggle('menu-active');
    document.body.classList.toggle('menu-open', Boolean(open));
    menuToggle.setAttribute('aria-expanded', String(Boolean(open)));
  });

  mobileMenu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

  const updateChrome = () => {
    header?.classList.toggle('scrolled', window.scrollY > 24);
    if (progress) {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress.style.transform = `scaleX(${Math.min(1, window.scrollY / max)})`;
    }
  };
  window.addEventListener('scroll', updateChrome, { passive: true });
  updateChrome();

  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({
      duration: 0.9,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1
    });
  }

  if (!reduced && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    gsap.from('.hero-eyebrow', { y: 14, opacity: 0, duration: .6, ease: 'power2.out' });
    gsap.from('.hero-title span', { yPercent: 105, opacity: 0, duration: .85, stagger: .06, delay: .08, ease: 'power3.out' });
    gsap.from('.hero-bottom', { y: 18, opacity: 0, duration: .7, delay: .18, ease: 'power2.out' });
    gsap.from('.hero-stats > div', { y: 10, opacity: 0, duration: .55, stagger: .05, delay: .25, ease: 'power2.out' });

    gsap.to('.hero-media img', {
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 }
    });

    document.querySelectorAll('.reveal-up,.reveal-card,.reveal-scale,.reveal-lines').forEach((el) => {
      gsap.from(el, {
        y: el.classList.contains('reveal-scale') ? 0 : 20,
        scale: el.classList.contains('reveal-scale') ? .96 : 1,
        opacity: 0,
        duration: .65,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
    });

    document.querySelectorAll('.magnetic').forEach((btn) => {
      if (window.matchMedia('(pointer:fine)').matches) {
        btn.addEventListener('mousemove', (e) => {
          const r = btn.getBoundingClientRect();
          gsap.to(btn, {
            x: (e.clientX - r.left - r.width / 2) * .06,
            y: (e.clientY - r.top - r.height / 2) * .08,
            duration: .2,
            ease: 'power2.out'
          });
        });
        btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: .3, ease: 'power2.out' }));
      }
    });
  } else if (lenis) {
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      closeMenu();
      if (lenis) lenis.scrollTo(target, { offset: -82, duration: .8 });
      else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });

  const form = document.querySelector('#estimateForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button');
    if (status) status.textContent = 'Thanks — your estimate request is ready. For immediate service, call (437) 237-7704.';
    if (button) {
      button.classList.add('submitted');
      const label = button.querySelector('span');
      if (label) label.textContent = 'Request Received';
    }
  });

  window.addEventListener('resize', () => {
    closeMenu();
    window.ScrollTrigger?.refresh();
  });
})();
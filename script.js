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

    const loader = document.querySelector('.page-loader');
    const launch = gsap.timeline({
      defaults:{ease:'power3.out'},
      onComplete:()=>{
        document.body.classList.remove('is-loading');
        loader?.classList.add('is-done');
      }
    });

    if(loader){
      launch
        .from('.loader-kicker',{y:10,opacity:0,duration:.35})
        .from('.loader-mark span',{x:-46,opacity:0,duration:.48},'-=.12')
        .from('.loader-mark strong',{x:52,opacity:0,duration:.52},'-=.38')
        .to('.loader-line i',{scaleX:1,duration:.58,ease:'power2.inOut'},'-=.2')
        .from('.loader-inner small',{opacity:0,y:6,duration:.26},'-=.24')
        .to('.loader-inner',{opacity:0,y:-10,duration:.38,delay:.12,ease:'power2.in'})
        .to(loader,{opacity:0,duration:.42,ease:'power2.out'})
        .set(loader,{visibility:'hidden'});
    }

    launch
      .from('.hero-media img',{scale:1.12,filter:'brightness(.68)',duration:1.45,ease:'power2.out'},loader?'-=.2':0)
      .from('.site-header',{y:-24,opacity:0,duration:.62},'-=1.08')
      .from('.hero-eyebrow',{x:-46,opacity:0,duration:.62},'-=.9')
      .from('.hero-proof',{x:42,opacity:0,duration:.58},'-=.58')
      .from('.hero-title span:first-child',{x:-72,opacity:0,rotate:.45,duration:.86},'-=.34')
      .from('.hero-title span:last-child',{x:76,opacity:0,rotate:-.45,duration:.9},'-=.72')
      .from('.hero-rule span',{scaleX:0,transformOrigin:'left',duration:.66},'-=.45')
      .from('.hero-rule i',{opacity:0,x:14,duration:.45},'-=.45')
      .from('.hero-copy-label',{x:-18,opacity:0,duration:.42},'-=.3')
      .from('.hero-bottom p',{x:-28,opacity:0,duration:.58},'-=.34')
      .from('.hero-trust-pill',{x:24,opacity:0,duration:.5},'-=.46')
      .from('.hero-ctas .button',{x:28,opacity:0,duration:.55,stagger:.07},'-=.4')
      .from('.hero-stats > div',{y:24,opacity:0,duration:.5,stagger:.09},'-=.26')
      .from('.scroll-cue',{opacity:0,y:-10,duration:.4},'-=.28');

    gsap.to('.hero-media img', {
      scale:1.025,
      yPercent:4,
      ease:'none',
      scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.7}
    });
    gsap.to('.hero-title span:first-child',{
      xPercent:-2.5,
      ease:'none',
      scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.7}
    });
    gsap.to('.hero-title span:last-child',{
      xPercent:2.5,
      ease:'none',
      scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:.7}
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
  } else {
    document.body.classList.remove('is-loading');
    document.querySelector('.page-loader')?.classList.add('is-done');
  }

  if (lenis && (!window.gsap || !window.ScrollTrigger || reduced)) {
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
  const projectPortfolio = {
    adrian: {
      title: 'Project Adrian',
      kicker: 'Complete lower-level renovation',
      description: 'A refined, bright lower level built around everyday living and entertaining. The project pairs a contemporary kitchen and bar with premium bathroom finishes, warm wood details and carefully integrated lighting.',
      meta: ['Kitchen & bar', 'Bathroom', 'Custom lighting', 'Finished lower level'],
      images: [
        {src:'assets/projects/adrian-01.png',alt:'Project Adrian kitchen and bar'},
        {src:'assets/projects/adrian-02.png',alt:'Project Adrian finished bathroom'}
      ]
    },
    thelma: {
      title: 'Project Thelma',
      kicker: 'Bathroom-focused finish',
      description: 'A sharp contemporary basement finish with a strong bathroom moment: large-format stone-look surfaces, a glass shower, crisp white millwork and layered lighting for a polished, high-contrast result.',
      meta: ['Bathroom', 'Glass shower', 'Stone-look surfaces', 'Lighting'],
      images: [
        {src:'assets/projects/thelma-01.png',alt:'Project Thelma black stone bathroom'},
        {src:'assets/projects/thelma-02.jpg',alt:'Project Thelma finished lower-level detail'}
      ]
    },
    long: {
      title: 'Project Long',
      kicker: 'Media lounge',
      description: 'A warm, comfortable media-focused basement built for long evenings in. Recessed lighting, wood flooring and an integrated entertainment wall turn the lower level into a relaxed gathering space.',
      meta: ['Media lounge', 'Entertainment wall', 'Recessed lighting', 'Wood flooring'],
      images: [
        {src:'assets/projects/long-01.jpg',alt:'Project Long media lounge'},
        {src:'assets/projects/long-02.jpg',alt:'Project Long finished basement'}
      ]
    },
    wainfleet: {
      title: 'Project Wainfleet',
      kicker: 'Dark cinema lounge',
      description: 'A dramatic basement lounge with a cinema-first mood. Deep charcoal finishes, a black ceiling, warm wood accents and a compact beverage area create a comfortable space that feels intentional rather than improvised.',
      meta: ['Cinema lounge', 'Dark finish palette', 'Beverage area', 'Feature lighting'],
      images: [
        {src:'assets/projects/wainfleet-01.jpg',alt:'Project Wainfleet dark cinema lounge'},
        {src:'assets/projects/wainfleet-02.jpg',alt:'Project Wainfleet entertainment basement'}
      ]
    },
    archdekin: {
      title: 'Project Archdekin',
      kicker: 'Feature wall detailing',
      description: 'A custom wall treatment developed through careful trim work, geometric framing and warm slatted-wood accents. The before-and-after views show the transition from build stage to a deep matte finished feature wall.',
      meta: ['Custom trim', 'Feature wall', 'Wood accents', 'Finish work'],
      images: [
        {src:'assets/projects/archdekin-01.jpg',alt:'Project Archdekin feature wall in progress'},
        {src:'assets/projects/archdekin-02.jpg',alt:'Project Archdekin finished black feature wall'}
      ]
    },
    yellowhammer: {
      title: 'Project Yellowhammer',
      kicker: 'Entertainment basement',
      description: 'A bold entertainment-driven lower level with a dark ceiling, integrated media wall, fireplace and blue accent lighting. The room is designed to feel immersive while still working as an everyday lounge.',
      meta: ['Media wall', 'Fireplace', 'Accent lighting', 'Lounge'],
      images: [
        {src:'https://drive.google.com/thumbnail?id=1VQD2Zvt582V3wbA8eO4kGgCsmnToCM3d&sz=w1600',alt:'Project Yellowhammer entertainment basement'},
        {src:'https://drive.google.com/thumbnail?id=1oC513vqD0nCuM1jBueqcGYMtIMVIPf3O&sz=w1600',alt:'Project Yellowhammer finished lower level'}
      ]
    }
  };

  const projectModal = document.querySelector('#projectModal');
  const projectModalTitle = document.querySelector('#projectModalTitle');
  const projectModalKicker = document.querySelector('#projectModalKicker');
  const projectModalDescription = document.querySelector('#projectModalDescription');
  const projectModalMeta = document.querySelector('#projectModalMeta');
  const projectModalGallery = document.querySelector('#projectModalGallery');
  let projectReturnFocus = null;

  const closeProjectModal = () => {
    if (!projectModal) return;
    projectModal.classList.remove('is-open');
    projectModal.setAttribute('aria-hidden','true');
    document.body.classList.remove('project-modal-open');
    projectModalGallery.innerHTML = '';
    projectReturnFocus?.focus?.();
  };

  const openProjectModal = (key, trigger) => {
    const project = projectPortfolio[key];
    if (!project || !projectModal) return;
    projectReturnFocus = trigger || null;
    projectModalTitle.textContent = project.title;
    projectModalKicker.textContent = project.kicker;
    projectModalDescription.textContent = project.description;
    projectModalMeta.innerHTML = project.meta.map((item,index)=>`<span><b>0${index+1}</b>${item}</span>`).join('');
    projectModalGallery.innerHTML = project.images.map((image,index)=>`<figure class="project-modal-image ${index===0?'project-modal-image-main':''}"><img src="${image.src}" alt="${image.alt}" loading="eager" referrerpolicy="no-referrer"></figure>`).join('');
    projectModal.classList.add('is-open');
    projectModal.setAttribute('aria-hidden','false');
    document.body.classList.add('project-modal-open');
    projectModal.querySelector('.project-modal-close')?.focus();
  };

  document.querySelectorAll('[data-project]').forEach(card=>{
    card.addEventListener('click',()=>openProjectModal(card.dataset.project,card));
  });
  projectModal?.querySelectorAll('[data-project-close]').forEach(button=>button.addEventListener('click',closeProjectModal));
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape' && projectModal?.classList.contains('is-open')) closeProjectModal();
  });

})();
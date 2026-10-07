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
    ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    const loader = document.querySelector('.page-loader');
    const unlockPage = () => {
      document.body.classList.remove('is-loading');
      loader?.classList.add('is-done');
    };
    const loaderFailSafe = window.setTimeout(unlockPage, 4500);
    const launch = gsap.timeline({
      defaults:{ease:'power3.out'},
      onComplete:()=>{
        window.clearTimeout(loaderFailSafe);
        unlockPage();
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
        .set(loader,{visibility:'hidden'})
        .call(()=>document.body.classList.remove('is-loading'));
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

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      document.body.classList.remove('is-loading');
      document.querySelector('.page-loader')?.classList.add('is-done');
    }
  });

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

  const instagramEmbed = document.querySelector('.instagram-embed[data-src]');
  if (instagramEmbed) {
    const loadInstagramEmbed = () => {
      if (instagramEmbed.src) return;
      instagramEmbed.src = instagramEmbed.dataset.src;
      instagramEmbed.removeAttribute('data-src');
    };

    if ('IntersectionObserver' in window) {
      const instagramObserver = new IntersectionObserver((entries, observer) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadInstagramEmbed();
          observer.disconnect();
        }
      }, { rootMargin: '500px 0px' });
      instagramObserver.observe(instagramEmbed);
    } else {
      loadInstagramEmbed();
    }
  }


  const drivePhoto = (id, alt, fallback) => ({
    src: `https://drive.google.com/thumbnail?id=${id}&sz=w1600`,
    alt,
    ...(fallback ? { fallback } : {})
  });

  const projectPortfolio = {
    adrian: {
      title: 'Project Adrian',
      kicker: 'Complete lower-level renovation',
      description: 'A refined, bright lower level built around everyday living and entertaining. The project pairs contemporary entertaining areas, premium finishes, warm details and carefully integrated lighting.',
      meta: ['10 project photos', 'Kitchen & bar', 'Bathroom', 'Finished lower level'],
      images: [
        drivePhoto('1XpfQWo0Qjw4t5pE8DYQHx-0AFuI6teR4','Project Adrian photo 1'),
        drivePhoto('1G-FqZ1FbeGqOVM5nrR_gW1PGIh-IuDUH','Project Adrian photo 2'),
        drivePhoto('1j9g4bVNxCIVGP7P6X3YdypQIU0QooAia','Project Adrian photo 3','assets/projects/adrian-01.png'),
        drivePhoto('1jpxt_528-H3_5ORFvOyPH9l599z90M7m','Project Adrian photo 4'),
        drivePhoto('1N1AtguvMx1BgxR0F3_yHc5GNQ8ZTSfhu','Project Adrian photo 5'),
        drivePhoto('1g1DhO6s_i1zeLumQ3pTruOYu53lAporu','Project Adrian photo 6'),
        drivePhoto('11kfGQwr4l2lZL-GjcMD4tVziJb4zAhlz','Project Adrian photo 7'),
        drivePhoto('14IWGjFBPlWZrIj5ofGs_itZUuhhRmt60','Project Adrian photo 8'),
        drivePhoto('15XMFUYjHIOnsNk6Ct6I1j01Xb_WCh2B_','Project Adrian photo 9','assets/projects/adrian-02.png'),
        drivePhoto('1D_3Dpz4sTjdfl1-WkFGn4ETaxchZoTWS','Project Adrian photo 10')
      ]
    },
    thelma: {
      title: 'Project Thelma',
      kicker: 'Bathroom-focused finish',
      description: 'A sharp contemporary basement finish with a strong bathroom moment, polished surfaces, crisp details and layered lighting across the completed lower level.',
      meta: ['8 project photos', 'Bathroom', 'Glass shower', 'Finished details'],
      images: [
        drivePhoto('1WtvBZfbhDgaVj_h0Q-5x46GeXJhBVZQS','Project Thelma photo 1','assets/projects/thelma-01.png'),
        drivePhoto('1eJmJG3WRa0C7Enpl0SXIIr8QbffI5EsK','Project Thelma photo 2'),
        drivePhoto('1trjGG75czrUbnUpmiGcVciW1JDnsQsLs','Project Thelma photo 3'),
        drivePhoto('1FHRknQ5LehPczRR84Qcag1l3CorjNkpV','Project Thelma photo 4'),
        drivePhoto('1Zv79dAYJPPxrKG7MqmCGcX73agZK5s8a','Project Thelma photo 5'),
        drivePhoto('16bgJ41HwQuev91poYhYZuybGDJAXtlMr','Project Thelma photo 6'),
        drivePhoto('1fo8YWnVIF5fSLFSsMSPP0gzu5CI0gAhi','Project Thelma photo 7','assets/projects/thelma-02.jpg'),
        drivePhoto('1ElOEGZEscA9lm1s263MK4IQbxRjXpr0Q','Project Thelma photo 8')
      ]
    },
    long: {
      title: 'Project Long',
      kicker: 'Media lounge',
      description: 'A warm, comfortable media-focused basement built for long evenings in. Recessed lighting, wood flooring and an integrated entertainment wall turn the lower level into a relaxed gathering space.',
      meta: ['4 project photos', 'Media lounge', 'Entertainment wall', 'Wood flooring'],
      images: [
        drivePhoto('1X2xtgBmiI8n9Pij0YpyRu6lW9G9_4i0q','Project Long photo 1','assets/projects/long-01.jpg'),
        drivePhoto('1OKsmP1dtKCVGYn6xNkG8EmDURChv9ew9','Project Long photo 2'),
        drivePhoto('1N_GibYDmQiw9QEUiZSFTVA-4lpBWHANn','Project Long photo 3'),
        drivePhoto('1YxpIR7thx42ArOZ6xO3_2ArKumpdMKoE','Project Long photo 4','assets/projects/long-02.jpg')
      ]
    },
    wainfleet: {
      title: 'Project Wainfleet',
      kicker: 'Dark cinema lounge',
      description: 'A dramatic basement lounge with a cinema-first mood. Deep finishes, warm accents and a compact beverage area create a comfortable space that feels intentional rather than improvised.',
      meta: ['8 project photos', 'Cinema lounge', 'Dark finish palette', 'Feature lighting'],
      images: [
        drivePhoto('1c6zPbCJSpnebF8cUuNDyn8_gfx9VDG73','Project Wainfleet photo 1'),
        drivePhoto('1_Xd1pxqL-_inuuN3S44yfl2Yz1M9ry5X','Project Wainfleet photo 2'),
        drivePhoto('1p96haQjpUIohjDAtYPGnLIxvnGoMK85L','Project Wainfleet photo 3'),
        drivePhoto('1tZAlkoIK7QM_j8u5KU01ypeRrGdq0M8u','Project Wainfleet photo 4'),
        drivePhoto('11Hr4ik3YvSfcV5h1_w84CPh28KH-a0m5','Project Wainfleet photo 5'),
        drivePhoto('1pKDNVZl5G2UclUmAK_TQb_foufk3oLxX','Project Wainfleet photo 6'),
        drivePhoto('1c-Xjvzhrkt5Gq6PTQuxnCM_ZdLKCOfrZ','Project Wainfleet photo 7','assets/projects/wainfleet-02.jpg'),
        drivePhoto('1t5DchMVzVhCp82yrEfKm20pRlrHI87n8','Project Wainfleet photo 8','assets/projects/wainfleet-01.jpg')
      ]
    },
    archdekin: {
      title: 'Project Archdekin',
      kicker: 'Feature wall detailing',
      description: 'A custom wall treatment developed through careful trim work, geometric framing and warm slatted-wood accents, shown from build stage through finished feature wall.',
      meta: ['2 project photos', 'Custom trim', 'Feature wall', 'Finish work'],
      images: [
        drivePhoto('1UF2EHqrIY7TxVDH7J2p99RagDmNZgHyo','Project Archdekin photo 1','assets/projects/archdekin-01.jpg'),
        drivePhoto('13eJbVCK8vqj6MS6-H3XyFhsEwFK49YRp','Project Archdekin photo 2','assets/projects/archdekin-02.jpg')
      ]
    },
    yellowhammer: {
      title: 'Project Yellowhammer',
      kicker: 'Entertainment basement',
      description: 'A bold entertainment-driven lower level with a dark ceiling, integrated media wall, fireplace and accent lighting, designed to feel immersive while still working as an everyday lounge.',
      meta: ['7 project photos', 'Media wall', 'Fireplace', 'Accent lighting'],
      images: [
        drivePhoto('1VQD2Zvt582V3wbA8eO4kGgCsmnToCM3d','Project Yellowhammer photo 1'),
        drivePhoto('1oC513vqD0nCuM1jBueqcGYMtIMVIPf3O','Project Yellowhammer photo 2'),
        drivePhoto('1yPbomcUDrDSdvgE99aUA1c2c0txuABzj','Project Yellowhammer photo 3'),
        drivePhoto('1WZC_h1495zHMMiHY-IxZ8dL5jga4ZCKs','Project Yellowhammer photo 4'),
        drivePhoto('1FwrPw0JNySOEqwYzSI3LflcNHW1d4Kfc','Project Yellowhammer photo 5'),
        drivePhoto('11Yro2KFgyAmZTXlkMgKoj0AWbmnWKfn3','Project Yellowhammer photo 6'),
        drivePhoto('1HljiKV9Kwi3SQ-ggiIlw7MLOYc6yyjO-','Project Yellowhammer photo 7')
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
    projectModalGallery.innerHTML = project.images.map((image,index)=>`<figure class="project-modal-image ${index===0?'project-modal-image-main':''}"><img src="${image.src}" alt="${image.alt}" loading="${index===0?'eager':'lazy'}" decoding="async" fetchpriority="${index===0?'high':'low'}" referrerpolicy="no-referrer" ${image.fallback?`onerror="this.onerror=null;this.src='${image.fallback}'"`:''}></figure>`).join('');
    projectModal.classList.add('is-open');
    projectModal.setAttribute('aria-hidden','false');
    document.body.classList.add('project-modal-open');
    projectModal.querySelector('.project-modal-close')?.focus();
  };

  const warmProject = (key) => {
    const project = projectPortfolio[key];
    if (!project || project._warmed) return;
    project._warmed = true;
    project.images.slice(0,2).forEach(item => {
      const preload = new Image();
      preload.decoding = 'async';
      preload.src = item.src;
    });
  };

  document.querySelectorAll('[data-project]').forEach(card=>{
    card.addEventListener('pointerenter',()=>warmProject(card.dataset.project),{passive:true});
    card.addEventListener('focus',()=>warmProject(card.dataset.project),{passive:true});
    card.addEventListener('click',()=>openProjectModal(card.dataset.project,card));
  });
  projectModal?.querySelectorAll('[data-project-close]').forEach(button=>button.addEventListener('click',closeProjectModal));
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape' && projectModal?.classList.contains('is-open')) closeProjectModal();
  });

})();
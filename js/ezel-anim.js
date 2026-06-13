/* EZEL — Animații la scroll pentru index.html.
   Necesită gsap + ScrollTrigger (încărcate înainte, din CDN).
   Funcționează împreună cu .fade-up și caruselele existente, fără să le strice. */
(function () {
  var root = document.documentElement;

  function init() {
    /* Fallback dur: dacă GSAP nu s-a încărcat (CDN căzut) sau .anim lipsește
       (mișcare redusă / fără JS) => scoatem .anim ca tot conținutul să fie vizibil.
       Nimic nu rămâne ascuns, zero impact SEO. */
    if (!window.gsap || !window.ScrollTrigger || !root.classList.contains('anim')) {
      root.classList.remove('anim');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    var EASE = 'power3.out';

    /* 1 + 7. HERO — intră la încărcare (e above-the-fold, nu îl legăm de scroll) */
    gsap.set('.hero-title', { opacity: 1 }); // siguranță, dacă rămâne clasa fade-up pe titlu
    gsap.timeline({ defaults: { ease: EASE } })
      .to('.hero-label',            { opacity: 1, y: 0, duration: 0.6 })
      .to('.hero-title .line-inner',{ y: '0%', duration: 0.9, stagger: 0.12 }, 0.05)
      .to('.hero-tagline',          { opacity: 1, y: 0, duration: 0.6 }, 0.45)
      .to('.hero-subtitle',         { opacity: 1, y: 0, duration: 0.7 }, 0.55)
      .to('.hero-actions',          { opacity: 1, y: 0, duration: 0.6 }, 0.70)
      .to('.hero-stats',            { opacity: 1, y: 0, duration: 0.6 }, 0.80);

    /* 3 + 5 + titluri/secțiuni: revelăm la scroll TOATE .fade-up din afara hero-ului.
       ScrollTrigger.batch le grupează pe cele care intră împreună => stagger natural
       pe carduri, recenzii, FAQ, headere etc. */
    var rest = gsap.utils.toArray('.fade-up').filter(function (el) {
      return !el.closest('.hero');
    });
    if (rest.length) {
      ScrollTrigger.batch(rest, {
        start: 'top 88%',
        once: true,
        onEnter: function (b) {
          gsap.to(b, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: EASE });
        }
      });
    }

    /* 4. GALERIE — fade + scale ușor */
    var gallery = gsap.utils.toArray('#galerie .gallery-item');
    if (gallery.length) {
      ScrollTrigger.batch(gallery, {
        start: 'top 90%',
        once: true,
        onEnter: function (b) {
          gsap.to(b, { opacity: 1, scale: 1, duration: 0.8, stagger: 0.08, ease: EASE });
        }
      });
    }

    /* 7. Cuvinte accentuate (italic) din titlurile de secțiune — wipe subtil */
    gsap.utils.toArray('.section-title em').forEach(function (em) {
      gsap.to(em, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: em, start: 'top 85%', once: true }
      });
    });

    /* 2. Contoare crescătoare (Despre) — fără reflow în paragraf */
    gsap.utils.toArray('[data-count-to]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count-to')) || 0;
      el.style.minWidth = String(Math.round(target)).length + 'ch'; // rezervă lățimea
      var o = { v: 0 };
      el.textContent = '0';
      gsap.to(o, {
        v: target,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onUpdate:   function () { el.textContent = Math.round(o.v).toLocaleString('ro-RO'); },
        onComplete: function () { el.textContent = target.toLocaleString('ro-RO'); }
      });
    });

    /* 6. PARTENERI — marquee infinit, fluid (înlocuiește caruselul pe această secțiune) */
    var track = document.querySelector('#parteneri .marquee__track');
    if (track && track.children.length) {
      track.innerHTML += track.innerHTML;        // dublăm logo-urile => buclă fără cusături
      var dist = track.scrollWidth / 2;
      gsap.to(track, { x: -dist, duration: dist / 45, ease: 'none', repeat: -1 }); // ~45px/s
    }

    /* Recalcul după ce se încarcă imaginile / fonturile */
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

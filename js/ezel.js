/* EZEL — meniu mobil + carusele (partajat pe toate paginile) */
(function () {
  function initNav() {
    var nav = document.querySelector('nav');
    var toggle = document.querySelector('.nav-toggle');
    if (!nav || !toggle) return;

    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Închide meniul' : 'Deschide meniul');
    });

    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Deschide meniul');
      });
    });
  }

  function initCarousels() {
    document.querySelectorAll('.carousel').forEach(function (carousel) {
      var track = carousel.querySelector('.carousel-track');
      if (!track) return;
      var prev = carousel.querySelector('.carousel-prev');
      var next = carousel.querySelector('.carousel-next');

      function step() { return Math.max(track.clientWidth * 0.85, 220); }
      function atEnd() { return track.scrollLeft + track.clientWidth >= track.scrollWidth - 4; }
      function atStart() { return track.scrollLeft <= 4; }

      function goNext() {
        if (atEnd()) track.scrollTo({ left: 0, behavior: 'smooth' });
        else track.scrollBy({ left: step(), behavior: 'smooth' });
      }
      function goPrev() {
        if (atStart()) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
        else track.scrollBy({ left: -step(), behavior: 'smooth' });
      }

      if (next) next.addEventListener('click', goNext);
      if (prev) prev.addEventListener('click', goPrev);

      var delay = parseInt(carousel.getAttribute('data-autoplay') || '0', 10);
      if (delay > 0) {
        var timer = null;
        function start() { stop(); timer = setInterval(goNext, delay); }
        function stop() { if (timer) { clearInterval(timer); timer = null; } }
        start();
        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
        track.addEventListener('touchstart', stop, { passive: true });
        track.addEventListener('touchend', start, { passive: true });
      }
    });
  }

  function init() { initNav(); initCarousels(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

(function(){
  // Navbar scroll state
  var nav = document.getElementById('siteNav');
  function onScroll(){
    if(window.scrollY > 40){ nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Lenis smooth momentum scroll
  var lenis = null;
  if (typeof Lenis !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    lenis = new Lenis({
      duration: 1.2,
      easing: function(t){ return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    function raf(time){
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', function(e){
      if(e.scroll > 40){ nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
    });
  }

  // Smooth scroll for anchor links with fixed navbar offset
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
    anchor.addEventListener('click', function(e){
      var href = this.getAttribute('href');
      if(!href || href === '#') return;
      var target = href === '#top' ? document.body : document.querySelector(href);
      if(!target) return;

      e.preventDefault();
      var navHeight = nav ? (window.innerWidth <= 560 ? 65 : 76) : 70;

      if(lenis){
        lenis.scrollTo(target, {
          offset: href === '#top' ? 0 : -navHeight,
          duration: 1.1,
        });
      } else {
        var topPos = href === '#top' ? 0 : target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: topPos,
          behavior: 'smooth'
        });
      }

      if(history.pushState && href !== '#top'){
        history.pushState(null, null, href);
      }
    });
  });

  // Mobile menu
  var burger = document.getElementById('burgerBtn');
  var menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    burger.addEventListener('click', function(){
      menu.classList.toggle('open');
      burger.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        menu.classList.remove('open');
        burger.classList.remove('open');
      });
    });
  }

  // Reveal on scroll
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.08, rootMargin:'0px 0px -30px 0px'});
  revealEls.forEach(function(el){ io.observe(el); });

  // Step sequential reveal (stagger children steps smoothly)
  var steps = document.querySelectorAll('.how-step, .t-step');
  var timelineIO = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var idx = Array.prototype.indexOf.call(steps, entry.target);
        setTimeout(function(){ entry.target.classList.add('in'); }, (idx % 4) * 120);
        timelineIO.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});
  steps.forEach(function(el){ timelineIO.observe(el); });

  // Transitions.dev Avatar Group Hover interaction
  var avatarRoots = document.querySelectorAll('[data-proto-avatars]');
  var docEl = document.documentElement;
  function readNum(name, fb) {
    var v = parseFloat(getComputedStyle(docEl).getPropertyValue(name));
    return isNaN(v) ? fb : v;
  }
  function readEase(name, fb) {
    var v = getComputedStyle(docEl).getPropertyValue(name).trim();
    return v || fb;
  }

  avatarRoots.forEach(function(root) {
    var avatars = Array.prototype.slice.call(root.querySelectorAll('.hero-avatar'));
    if (!avatars.length) return;

    function setShifts(activeIdx, phase) {
      var lift = readNum('--avatar-lift', -6);
      var falloff = readNum('--avatar-falloff', 0.45);
      var scale = readNum('--avatar-scale', 1.08);
      var ease = phase === 'out'
        ? readEase('--avatar-ease-out', 'cubic-bezier(0.34, 3.85, 0.64, 1)')
        : readEase('--avatar-ease-in', 'cubic-bezier(0.22, 1, 0.36, 1)');

      avatars.forEach(function(el, i) {
        el.style.transitionTimingFunction = ease;
        if (activeIdx == null) {
          el.style.setProperty('--shift', '0px');
          el.style.setProperty('--scale-active', '1');
          el.style.zIndex = '';
          return;
        }
        var d = Math.abs(i - activeIdx);
        el.style.setProperty(
          '--shift',
          (lift * Math.pow(falloff, d)).toFixed(3) + 'px'
        );
        el.style.setProperty(
          '--scale-active',
          i === activeIdx ? scale.toString() : '1'
        );
        el.style.zIndex = i === activeIdx ? '10' : (avatars.length - d).toString();
      });
    }

    avatars.forEach(function(el, i) {
      el.addEventListener('mouseenter', function() { setShifts(i, 'in'); });
    });
    root.addEventListener('mouseleave', function() { setShifts(null, 'out'); });
  });

  // Reviews Carousel (Auto-sliding, responsive sets, dot indicators, pause on hover, touch swipe)
  var reviewsCarousel = document.getElementById('reviewsCarousel');
  var reviewsTrack = document.getElementById('reviewsTrack');
  var reviewsDots = document.getElementById('reviewsDots');

  if (reviewsCarousel && reviewsTrack && reviewsDots) {
    var cards = reviewsTrack.querySelectorAll('.rev-card');
    var totalCards = cards.length;
    var currentPage = 0;
    var timer = null;
    var isPaused = false;

    function getCardsPerPage() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 960) return 2;
      return 3;
    }

    function getTotalPages() {
      return Math.ceil(totalCards / getCardsPerPage());
    }

    function updateCarousel(pageIndex) {
      var totalPages = getTotalPages();
      if (totalPages <= 0) return;
      currentPage = ((pageIndex % totalPages) + totalPages) % totalPages;

      var cardsPerPage = getCardsPerPage();
      var targetCardIndex = Math.min(currentPage * cardsPerPage, totalCards - 1);
      var targetCard = cards[targetCardIndex];

      if (targetCard && cards[0]) {
        var offset = targetCard.offsetLeft - cards[0].offsetLeft;
        reviewsTrack.style.transform = 'translateX(-' + offset + 'px)';
      }

      // Update dot active states
      var dotEls = reviewsDots.querySelectorAll('.reviews-dot');
      dotEls.forEach(function(dot, idx) {
        dot.classList.toggle('active', idx === currentPage);
      });
    }

    function renderDots() {
      reviewsDots.innerHTML = '';
      var totalPages = getTotalPages();
      for (var i = 0; i < totalPages; i++) {
        var dot = document.createElement('button');
        dot.className = 'reviews-dot' + (i === currentPage ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to review set ' + (i + 1));
        (function(idx) {
          dot.addEventListener('click', function() {
            updateCarousel(idx);
            resetTimer();
          });
        })(i);
        reviewsDots.appendChild(dot);
      }
    }

    function nextSlide() {
      updateCarousel(currentPage + 1);
    }

    function startTimer() {
      stopTimer();
      timer = setInterval(function() {
        if (!isPaused) {
          nextSlide();
        }
      }, 4500);
    }

    function stopTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function resetTimer() {
      startTimer();
    }

    // Hover pause
    reviewsCarousel.addEventListener('mouseenter', function() {
      isPaused = true;
    });
    reviewsCarousel.addEventListener('mouseleave', function() {
      isPaused = false;
    });

    // Touch Swipe support
    var touchStartX = 0;
    var touchEndX = 0;
    reviewsCarousel.addEventListener('touchstart', function(e) {
      if (e.touches && e.touches[0]) {
        touchStartX = e.touches[0].clientX;
        isPaused = true;
      }
    }, { passive: true });

    reviewsCarousel.addEventListener('touchend', function(e) {
      if (e.changedTouches && e.changedTouches[0]) {
        touchEndX = e.changedTouches[0].clientX;
        var diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 40) {
          if (diff < 0) {
            updateCarousel(currentPage + 1);
          } else {
            updateCarousel(currentPage - 1);
          }
          resetTimer();
        }
      }
      isPaused = false;
    }, { passive: true });

    // Handle resize
    var resizeTimeout = null;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        renderDots();
        updateCarousel(currentPage);
      }, 100);
    });

    // Initial setup
    renderDots();
    updateCarousel(0);
    startTimer();
  }
})();

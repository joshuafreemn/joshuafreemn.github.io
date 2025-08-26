document.addEventListener('DOMContentLoaded', function() {
    // Only initialize project cards if we're on the work page
    const projectStack = document.querySelector('.project-stack');
    if (!projectStack) return;
    if (window.matchMedia('(max-width: 600px)').matches) return; // skip desktop hover/touch on mobile

    const projectCards = document.querySelectorAll('.project-card');
    let activeCard = null;

    function resetCards() {
        projectCards.forEach(card => {
            card.classList.remove('active', 'shift-down');
        });
        activeCard = null;
    }

    function handleCardInteraction(card) {
        if (activeCard === card) {
            resetCards();
            return;
        }

        resetCards();
        
        // Activate clicked card
        card.classList.add('active');
        activeCard = card;

        // Move cards below the active card down
        let foundActive = false;
        projectCards.forEach(otherCard => {
            if (foundActive && otherCard !== card) {
                otherCard.classList.add('shift-down');
            }
            if (otherCard === card) {
                foundActive = true;
            }
        });
    }

    // Add event listeners to each card
    projectCards.forEach(card => {
        // For mouse users
        card.addEventListener('mouseenter', () => handleCardInteraction(card));
        
        // For touch devices
        card.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleCardInteraction(card);
        });
    });

    // Reset cards when mouse leaves the stack
    projectStack.addEventListener('mouseleave', resetCards);
});
// --- Mobile scroll-activated stacking (discrete, invisible scroll) ---
(function () {
  var mm = window.matchMedia('(max-width: 600px)');

  function setupMobileStack() {
    if (!mm.matches) return; // only on mobile

    var stack = document.querySelector('.project-stack');
    if (!stack) return;
    var cards = Array.prototype.slice.call(stack.querySelectorAll('.project-card'));
    if (!cards.length) return;

    // Prevent native scrolling inside the work area while we manage virtual steps
    var body = document.body;
    var work = document.querySelector('.workContentBlock');
    if (work) {
      work.style.overflow = 'hidden';
    }
    body.classList.add('noScroll');

    // Read overlap from CSS variable (fallback to 300px)
    var cs = getComputedStyle(stack);
    var overlapStr = cs.getPropertyValue('--overlap').trim();
    var overlap = parseFloat(overlapStr || '300');

    // Active index: 0..(cards.length-2). Last (bottom) card never becomes active
    var maxActive = Math.max(0, cards.length - 2);
    var activeIdx = 0; // first card active by default

    function applyActive(idx) {
      idx = Math.max(0, Math.min(maxActive, idx));
      if (idx === activeIdx) return;
      activeIdx = idx;
      cards.forEach(function (c, i) {
        c.classList.toggle('is-active', i === activeIdx);
      });
    }

    // Initialize state
    cards.forEach(function (c, i) { c.classList.toggle('is-active', i === 0); });

    // We treat scroll as discrete steps between cards. Accumulate deltas and step when threshold exceeded.
    var stepThreshold = overlap * 0.55; // how far the user must virtually scroll to step one card
    var accum = 0; // accumulated virtual scroll distance

    var raf = null;
    function scheduleApply() {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        // no-op: CSS transform is driven by `.is-active` — applyActive already toggles classes
      });
    }

    function stepBy(dir) {
      var next = activeIdx + dir;
      if (next < 0) next = 0;
      if (next > maxActive) next = maxActive;
      if (next !== activeIdx) {
        applyActive(next);
        scheduleApply();
      }
    }

    function onWheel(e) {
      // Only handle when the pointer is over the stack/work area; prevent native scroll
      if (!e.target.closest || !e.target.closest('.workContentBlock')) return;
      e.preventDefault();
      accum += e.deltaY;
      if (Math.abs(accum) >= stepThreshold) {
        var dir = accum > 0 ? 1 : -1;
        stepBy(dir);
        accum = 0;
      }
    }

    var touchStartY = 0;
    function onTouchStart(e) {
      if (!e.target.closest || !e.target.closest('.workContentBlock')) return;
      if (e.touches && e.touches.length) {
        touchStartY = e.touches[0].clientY;
        accum = 0;
      }
    }
    function onTouchMove(e) {
      if (!e.target.closest || !e.target.closest('.workContentBlock')) return;
      if (!e.cancelable) return;
      e.preventDefault();
      if (e.touches && e.touches.length) {
        var dy = touchStartY - e.touches[0].clientY; // swipe up -> positive
        accum += dy;
        touchStartY = e.touches[0].clientY;
        if (Math.abs(accum) >= stepThreshold) {
          var dir = accum > 0 ? 1 : -1;
          stepBy(dir);
          accum = 0;
        }
      }
    }

    // Keyboard support for testing on desktop emulation
    function onKey(e) {
      if (!mm.matches) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); stepBy(1); }
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); stepBy(-1); }
      else if (e.key === 'Home') { e.preventDefault(); applyActive(0); }
      else if (e.key === 'End') { e.preventDefault(); applyActive(maxActive); }
    }

    // Listeners
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKey, { passive: false });

    function teardown() {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKey);
      if (work) { work.style.overflow = ''; }
      body.classList.remove('noScroll');
      cards.forEach(function (c) { c.classList.remove('is-active'); });
    }

    function onChange() {
      if (!mm.matches) teardown();
    }
    mm.addEventListener('change', onChange);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileStack);
  } else {
    setupMobileStack();
  }
})();
document.addEventListener('DOMContentLoaded', function() {
  // Register GSAP plugin if available (avoid errors when CDN isn't added yet)
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Helper to create CodePen-like stacked scroll timeline
  function createStackTimeline({
    cardsSelector,   // ".project-card" or ".punchCard"
    trigger,         // element for ScrollTrigger trigger
    scroller,        // null for window, or ".workContentBlock"
    pin = true,
    scrub = true,
    endMultiplier = 6
  }) {
    if (!(window.gsap && window.ScrollTrigger)) return; // guard if GSAP not loaded

    const cards = gsap.utils.toArray(cardsSelector);
    if (!cards.length || !trigger) return;

    const offset = 30;      // small base offset between cards
    const time = 2;         // base timing like the CodePen
    const endDist = () => `+=${window.innerHeight * endMultiplier}`;

    return gsap.timeline({
      scrollTrigger: {
        trigger,
        scroller: scroller || undefined,
        start: "top top",
        end: endDist,
        scrub: !!scrub,
        pin: !!pin,
        pinSpacing: true,
        // Use transform pinning when we're inside a custom scroller
        pinType: scroller ? 'transform' : undefined,
        invalidateOnRefresh: true
        // markers: true,
      }
    })
    .from(cards, {
      y: (i) => window.innerHeight / 2 + (offset * i),
      duration: time / 2,
      stagger: time,
      ease: "power2.out"
    });
  }

  // Global resize handling for ScrollTrigger
  window.addEventListener('resize', () => {
    if (window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  });

  const isMobile = window.matchMedia('(max-width: 600px)').matches;

  if (isMobile) {
    // WORK (mobile) – uses internal scroller
    if (document.querySelector('.project-stack')) {
      // Important: pin the element inside the scroller, not the scroller itself
      const triggerEl = document.querySelector('.project-stack');

      // Optional CodePen-like base offset per card
      if (window.gsap) {
        const offset = 30;
        gsap.set('.card', {
          y: (index) => offset * index,
          transformOrigin: 'center top'
        });
      }

      createStackTimeline({
        cardsSelector: '.card', // use the new .card selector
        trigger: triggerEl,
        scroller: '.workContentBlock', // critical for mobile work page
        pin: true,
        scrub: true,
        endMultiplier: 6
      });
    }

    // SNAPSHOTS (mobile) – uses window scroller
    if (document.querySelector('.snapshotsContentBlock')) {
      const triggerEl = document.querySelector('.snapshotsContentBlock');
      createStackTimeline({
        cardsSelector: '.punchCard',
        trigger: triggerEl,
        scroller: null, // window
        pin: true,
        scrub: true,
        endMultiplier: 6
      });
    }

    // Done for mobile – don't run desktop hover/touch
    return;
  }

  // DESKTOP – keep existing hover/touch behavior for work.html exactly as is.
  // Only initialize project cards if we're on the work page
  const projectStack = document.querySelector('.project-stack');
  if (!projectStack) return;

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

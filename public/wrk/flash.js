gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

// Set initial z-index for proper stacking
gsap.set('.flashcard', {
  zIndex: (i) => i + 1.5,
  scale: 0.9,
  y: (i) => i === 0 ? 0 : 200 // First card at 0, subsequent cards 200px down
});

// Helper function for smooth scrolling
function smoothScroll(target) {
  gsap.to(window, {
    duration: 0.5,
    scrollTo: target,
    ease: "none"
  });
}

// Setup progress markers
const markers = document.querySelectorAll('.marker');
markers.forEach((marker, index) => {
  marker.addEventListener('click', () => {
    // Check if it's the home marker
    if (marker.classList.contains('home-marker')) {
      // Add a small delay before navigation to allow the click animation
      gsap.to(marker.querySelector('i'), {
        scale: 1.2,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          window.location.href = marker.getAttribute('href');
        }
      });
    } else {
      const targetCard = document.querySelectorAll('.flashcard')[index];
      smoothScroll(targetCard);
    }
  });
});

// Create animations for each flashcard
document.querySelectorAll('.flashcard').forEach((card, index) => {
  // Parallax effect for images
  const images = card.querySelectorAll('.img-placeholder');
  images.forEach(img => {
    gsap.to(img, {
      y: -30,
      ease: "none",
      scrollTrigger: {
        trigger: card,
        scrub: 0.1,
        start: "top bottom",
        end: "bottom top"
      }
    });
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: card,
      start: "top center",
      end: "bottom top-=120",
      scrub: true,
      toggleActions: "play none none reverse",
      onUpdate: (self) => {
        // Update progress markers
        const isActive = self.progress > 0 && self.progress < 1;
        markers[index].classList.toggle('active', isActive);
        
        // Handle home marker visibility based on last card
        const homeMarker = document.querySelector('.home-marker');
        if (index === markers.length - 2) { // Last regular marker
          homeMarker.classList.toggle('active', self.progress >= 0.8);
        }
      }
    }
  });

  tl.fromTo(card,
    {
      y: 50,
      opacity: 0.8
    },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power2.out"
    }
  );

  // Add exit animation
  gsap.to(card, {
    scrollTrigger: {
      trigger: card,
      start: "center top",
      end: "bottom top",
      scrub: true,
      onLeave: () => {
        gsap.to(card, {
          y: -30,
          opacity: 0.8,
          duration: 0.3,
          ease: "power1.in"
        });
      },
      onEnterBack: () => {
        gsap.to(card, {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power1.out"
        });
      }
    }
  });

  // Add hover animation
  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      scale: 0.93,
      duration: 0.15,
      ease: "none"
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      scale: 0.9,
      duration: 0.15,
      ease: "none"
    });
  });
});
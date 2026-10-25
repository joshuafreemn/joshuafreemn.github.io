document.addEventListener('DOMContentLoaded', function() {
  initProjectStack();
  initAboutCardStack();
});

// DESKTOP – keep existing hover/touch behavior for work.html exactly as is.
function initProjectStack() {
  const projectStack = document.querySelector('.project-stack');
  if (!projectStack) return;

  // Skip any scripting on touch devices so the stack behaves like a simple scroll.
  const prefersCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  if (prefersCoarsePointer) {
    return;
  }

  const projectCards = document.querySelectorAll('.project-card');

  projectStack.addEventListener('mouseleave', () => {
    projectCards.forEach(card => {
      card.classList.remove('active', 'shift-down');
    });
  });

  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      projectCards.forEach(otherCard => {
        otherCard.classList.toggle('active', otherCard === card);
        otherCard.classList.remove('shift-down');
      });
    });
  });
}

function initAboutCardStack() {
  const stackCards = document.querySelectorAll('.aboutStackCard, .cvStackCard');
  if (stackCards.length === 0) return;

  let highestZIndex = Array.from(stackCards).reduce((maxZIndex, card) => {
    const cardZIndex = Number.parseInt(window.getComputedStyle(card).zIndex, 10);
    return Number.isNaN(cardZIndex) ? maxZIndex : Math.max(maxZIndex, cardZIndex);
  }, 0);

  const bringToFront = card => {
    highestZIndex += 1;
    card.style.zIndex = String(highestZIndex);
  };

  stackCards.forEach(card => {
    card.addEventListener('click', () => {
      bringToFront(card);
    });

    card.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      event.preventDefault();
      bringToFront(card);
    });
  });
}

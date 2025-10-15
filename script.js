// DESKTOP – keep existing hover/touch behavior for work.html exactly as is.
document.addEventListener('DOMContentLoaded', function() {
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
});

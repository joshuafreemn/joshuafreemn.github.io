document.addEventListener('DOMContentLoaded', function() {
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
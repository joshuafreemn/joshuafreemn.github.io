


// This code selects the DOM element with the ID 'myElement' and adds a click event listener to it.
// When the element is clicked, it toggles the 'active' class on the element.
// If the 'active' class is currently present on the element, it is removed.
// If the 'active' class is not currently present on the element, it is added.

const project = document.querySelector('.project');

project.addEventListener('touchstart', function() {
  project.classList.add('hovered');
});

project.addEventListener('touchend', function() {
  project.classList.remove('hovered');
});

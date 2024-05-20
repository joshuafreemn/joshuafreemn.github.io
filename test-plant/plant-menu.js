 const toggleTag = document.querySelector("a.toggle-nav")
 const mainTag = document.querySelector("main")
 const navTag = document.querySelector("nav")

 toggleTag.addEventListener("click", function () {
    mainTag.classList.toggle("open")
    navTag.classList.toggle("open")

    if (mainTag.classList.contains("open")) {
        toggleTag.innerHTML = `<img src="test-plant/close.svg"/> Close` 
    } else (
        toggleTag.innerHTML = `<img src="test-plant/menu.svg"/> Menu`
    )
 })
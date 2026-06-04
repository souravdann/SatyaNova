/* =====================
   MOBILE MENU
===================== */

const hamburger =
document.querySelector(".hamburger");

const navLinks =
document.querySelector(".nav-links");

/* When user clicks menu */

hamburger.addEventListener("click", () => {

    navLinks.classList.toggle("active");

});
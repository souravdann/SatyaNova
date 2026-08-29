/* =====================================================================
   SOURAV DAN — PERSONAL LANDING PAGE
   script.js

   TABLE OF CONTENTS
   1. Mobile navigation (open/close hamburger menu)
   2. Smooth scrolling for in-page navigation links
   3. Close mobile menu after a nav item is clicked
   4. Reveal-on-scroll animations (IntersectionObserver)
   5. Back-to-top button
   6. Active nav link highlighting on scroll
   7. Hero code card "typing" effect
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------------
     1. MOBILE NAVIGATION — toggle the hamburger button and nav menu
  ------------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  function toggleMenu() {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    // Keep ARIA state in sync for screen readers
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  }

  hamburger.addEventListener('click', toggleMenu);

  /* -------------------------------------------------------------------
     2. SMOOTH SCROLLING — animate scrolling to in-page sections
     (CSS `scroll-behavior: smooth` already handles most browsers;
     this loop guarantees consistent behaviour and lets us close the
     mobile menu right when a link is used.)
  ------------------------------------------------------------------- */
  const allNavAnchors = document.querySelectorAll('a[href^="#"]');

  allNavAnchors.forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return; // ignore bare "#" links, if any

      event.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

      /* ---------------------------------------------------------------
         3. CLOSE MOBILE MENU after a navigation link is clicked
      --------------------------------------------------------------- */
      if (navLinks.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  /* -------------------------------------------------------------------
     4. REVEAL-ON-SCROLL ANIMATIONS
     Every element with the `.reveal` class starts hidden (see CSS).
     IntersectionObserver watches for it entering the viewport, then
     adds `.revealed` to trigger the fade/slide-in transition.
     Elements are only revealed once, then unobserved for performance.
  ------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // stop watching once revealed
        }
      });
    },
    {
      threshold: 0.15,       // trigger once 15% of the element is visible
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* -------------------------------------------------------------------
     5. BACK-TO-TOP BUTTON
     Shown once the user scrolls past one viewport height; clicking it
     scrolls smoothly back to the top of the page.
  ------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('backToTop');

  function handleScrollVisibility() {
    if (window.scrollY > window.innerHeight * 0.6) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleScrollVisibility, { passive: true });
  handleScrollVisibility(); // run once on load in case page is refreshed mid-scroll

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* -------------------------------------------------------------------
     6. ACTIVE NAV LINK HIGHLIGHTING
     As the user scrolls, highlight whichever section's nav link
     corresponds to the section currently in view.
  ------------------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkEls.forEach((link) => {
            link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /* -------------------------------------------------------------------
     7. HERO CODE CARD "TYPING" EFFECT
     Purely decorative: types out a short Python-flavoured snippet
     inside the hero's code card to reinforce the "Python developer"
     theme, then loops. Respects prefers-reduced-motion.
  ------------------------------------------------------------------- */
  const typedCodeEl = document.getElementById('typedCode');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const codeSnippet =
`class Developer:
    def __init__(self):
        self.name = "Sourav Dan"
        self.stack = ["Python", "AI", "Web"]
        self.curious = True

    def build(self):
        return "ideas -> code"`;

  if (typedCodeEl) {
    if (prefersReducedMotion) {
      // Skip the animation entirely and just show the full snippet
      typedCodeEl.textContent = codeSnippet;
    } else {
      let charIndex = 0;

      function typeNextChar() {
        if (charIndex <= codeSnippet.length) {
          typedCodeEl.textContent = codeSnippet.slice(0, charIndex);
          charIndex++;
          setTimeout(typeNextChar, 28); // typing speed in ms per character
        } else {
          // Pause at the end, then restart for a subtle looping effect
          setTimeout(() => {
            charIndex = 0;
            typeNextChar();
          }, 2600);
        }
      }

      typeNextChar();
    }
  }

});
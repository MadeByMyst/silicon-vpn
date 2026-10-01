/* SiliconVPN script.js
   Plain JavaScript, no libraries. The page works without it; this adds the
   mobile menu, a few gentle scroll effects and the FAQ animation. */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Header: white once scrolled, hides while scrolling down ---------- */

const header = document.querySelector(".site-header");
const siteNav = document.getElementById("site-nav");
let lastScrollY = window.scrollY;

function updateHeader() {
  const y = window.scrollY;
  const scrollingDown = y > lastScrollY;
  const menuIsOpen = siteNav.classList.contains("is-open");

  header.classList.toggle("is-scrolled", y > 8);
  header.classList.toggle("is-hidden", scrollingDown && y > 200 && !menuIsOpen);
  lastScrollY = y;
}

/* ---------- Hero photo drifts a little slower than the page ---------- */

const heroBg = document.querySelector(".hero-bg");
let parallaxTarget = 0;
let parallaxNow = 0;
let parallaxRunning = false;

function parallaxLoop() {
  parallaxNow += (parallaxTarget - parallaxNow) * 0.1; // ease towards the target
  heroBg.style.setProperty("--parallax", parallaxNow.toFixed(2));

  if (Math.abs(parallaxTarget - parallaxNow) > 0.1) {
    requestAnimationFrame(parallaxLoop);
  } else {
    parallaxRunning = false;
  }
}

function updateParallax() {
  if (!heroBg || reduceMotion) return;
  parallaxTarget = Math.min(window.scrollY, window.innerHeight) * 0.3;
  if (!parallaxRunning) {
    parallaxRunning = true;
    requestAnimationFrame(parallaxLoop);
  }
}

// Run the scroll work at most once per frame
let ticking = false;

window.addEventListener(
  "scroll",
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateHeader();
      updateParallax();
      ticking = false;
    });
  },
  { passive: true }
);

updateHeader();

/* ---------- Mobile menu ---------- */

const menuToggle = document.querySelector(".menu-toggle");

function setMenu(open) {
  if (open) header.classList.remove("is-hidden"); // keep the header in view while the menu is open
  header.classList.toggle("menu-is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  siteNav.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
}

menuToggle.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

// Close the menu after picking a link
siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
    setMenu(false);
    menuToggle.focus();
  }
});

// Close it if the screen grows past the mobile layout
window.matchMedia("(min-width: 861px)").addEventListener("change", (event) => {
  if (event.matches) setMenu(false);
});

/* ---------- Fade sections in as they scroll into view ---------- */

const revealItems = document.querySelectorAll(".reveal, .stagger");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

/* ---------- FAQ: smooth open and close, one answer at a time ---------- */

const faqItems = document.querySelectorAll(".faq-item");
const faqTiming = { duration: 500, easing: "cubic-bezier(0.16, 1, 0.3, 1)" };

function openFaq(item) {
  const answer = item.querySelector(".faq-answer");
  item.open = true;
  answer.animate(
    [
      { height: "0px", opacity: 0 },
      { height: `${answer.scrollHeight}px`, opacity: 1 },
    ],
    faqTiming
  );
}

function closeFaq(item) {
  const answer = item.querySelector(".faq-answer");
  item.classList.add("is-closing");
  const animation = answer.animate(
    [
      { height: `${answer.scrollHeight}px`, opacity: 1 },
      { height: "0px", opacity: 0 },
    ],
    faqTiming
  );
  animation.onfinish = () => {
    item.open = false;
    item.classList.remove("is-closing");
  };
}

faqItems.forEach((item) => {
  item.querySelector("summary").addEventListener("click", (event) => {
    if (reduceMotion) return; // let the browser open it instantly
    event.preventDefault();

    if (item.open && !item.classList.contains("is-closing")) {
      closeFaq(item);
    } else {
      faqItems.forEach((other) => {
        if (other !== item && other.open) closeFaq(other);
      });
      openFaq(item);
    }
  });
});

/* ---------- Plan buttons: SiliconVPN isn't real, so say so ---------- */

const toast = document.querySelector(".toast");
let toastTimer;

document.querySelectorAll(".js-demo").forEach((button) => {
  button.addEventListener("click", () => {
    toast.textContent = "SiliconVPN is a concept project, so there's nothing to download yet.";
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
  });
});

/* ---------- Keep the copyright year current ---------- */

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

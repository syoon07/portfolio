
document.documentElement.classList.add("js-ready");

const header = document.querySelector(".site-header");
const nav = document.querySelector(".site-nav");
const toggle = document.querySelector(".menu-toggle");

function updateHeader(){
  if(header) header.classList.toggle("scrolled", window.scrollY > 8);
}
updateHeader();
window.addEventListener("scroll", updateHeader, {passive:true});

if(toggle && nav){
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }));
}

const reveals = document.querySelectorAll(".reveal");
if("IntersectionObserver" in window){
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, {threshold: .08});
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add("visible"));
}

document.querySelectorAll("[data-carousel]").forEach(setupCarousel);

function setupCarousel(carousel){
  const track = carousel.querySelector(".carousel-track");
  const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
  const prevBtn = carousel.querySelector(".carousel-arrow.prev");
  const nextBtn = carousel.querySelector(".carousel-arrow.next");
  const dots = Array.from(carousel.querySelectorAll(".carousel-dot"));
  const current = carousel.querySelector(".current");
  let index = 0;
  let startX = 0;
  let deltaX = 0;
  let dragging = false;

  function render(){
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
    if(current) current.textContent = String(index + 1);
  }

  function goTo(i){
    index = (i + slides.length) % slides.length;
    render();
  }

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));

  carousel.setAttribute("tabindex", "0");
  carousel.addEventListener("keydown", (e) => {
    if(e.key === "ArrowLeft") goTo(index - 1);
    if(e.key === "ArrowRight") goTo(index + 1);
  });

  track.addEventListener("pointerdown", (e) => {
    dragging = true;
    startX = e.clientX;
    deltaX = 0;
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener("pointermove", (e) => {
    if(!dragging) return;
    deltaX = e.clientX - startX;
  });

  function endDrag(){
    if(!dragging) return;
    if(deltaX > 50) goTo(index - 1);
    else if(deltaX < -50) goTo(index + 1);
    dragging = false;
    deltaX = 0;
  }

  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
  render();
}

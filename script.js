/* === PUT YOUR PHOTO HERE ===
   Either keep the file at assets/profile.jpg, or paste a full image link
   (for example https://example.com/me.jpg) between the quotes. */
const PHOTO_URL = "assets/profile.jpg";

const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (id) => document.getElementById(id);

/* Photo: loads the image, then glides into the header corner on scroll */
const photo = $("photo"), pimg = $("pimg"), slot = $("slot"), dock = $("dock");
const CANDIDATES = [PHOTO_URL, "assets/profile.jpeg", "assets/profile.png", "assets/profile.webp", "profile.jpg", "profile.jpeg", "profile.png", "profile.webp"];
let k = -1;
function nextPhoto() {
  k++;
  if (k < CANDIDATES.length) pimg.src = CANDIDATES[k];
  else { console.warn("Photo not found. Save it as assets/profile.jpg"); pimg.remove(); }
}
pimg.onerror = nextPhoto;
if (!pimg.getAttribute("src")) nextPhoto();                      /* no src in the HTML */
else if (pimg.complete && !pimg.naturalWidth) nextPhoto();       /* src in the HTML already failed */
let S = null;
function measure() {
  const s = slot.getBoundingClientRect();
  S = { x: s.left + scrollX, y: s.top + scrollY, w: s.width };
  place();
}
function place() {
  if (!S) return;
  const d = dock.getBoundingClientRect();
  const D = Math.min(320, Math.max(180, S.y + S.w * 0.5));
  let p = Math.min(1, Math.max(0, scrollY / D));
  p = p * p * (3 - 2 * p);
  const lerp = (a, b) => a + (b - a) * p;
  const w = lerp(S.w, d.width);
  photo.style.width = photo.style.height = w + "px";
  photo.style.fontSize = w / 300 + "em";
  photo.style.transform = `translate(${lerp(S.x - scrollX, d.left)}px, ${lerp(S.y, d.top)}px)`;
}

/* Scroll progress bar and photo position */
function onScroll() {
  const h = document.documentElement;
  $("bar").style.width = (scrollY / (h.scrollHeight - innerHeight || 1)) * 100 + "%";
  place();
}
addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });
addEventListener("resize", measure);
addEventListener("load", measure);
measure();

/* Slide-in on scroll */
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.15 });
document.querySelectorAll("[data-rv]").forEach((el) => io.observe(el));

/* Project slider arrows */
const sl = $("slider");
const step = () => Math.min(sl.clientWidth, 580);
$("next").onclick = () => sl.scrollBy({ left: step(), behavior: calm ? "auto" : "smooth" });
$("prev").onclick = () => sl.scrollBy({ left: -step(), behavior: calm ? "auto" : "smooth" });

/* Rotating "currently building" line */
const words = ["multi-agent workflows", "MCP-based call agents", "RAG pipelines", "real-time voice AI", "the Agentic AI Job Hunter"];
const rot = $("rotate");
let wi = 0;
if (rot && !calm) setInterval(() => {
  rot.style.opacity = 0;
  setTimeout(() => { wi = (wi + 1) % words.length; rot.textContent = words[wi]; rot.style.opacity = 1; }, 300);
}, 2500);

/* Mobile menu */
const menu = $("menu"), nav = $("nav");
menu.onclick = () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", open);
  menu.textContent = open ? "Close" : "Menu";
  measure();
};
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
  nav.classList.remove("open"); menu.setAttribute("aria-expanded", false); menu.textContent = "Menu"; measure();
}));

/* Only one project dropdown open at a time (works in every browser) */
document.querySelectorAll("details.how").forEach((d) => d.addEventListener("toggle", () => {
  if (d.open) document.querySelectorAll("details.how[open]").forEach((o) => { if (o !== d) o.open = false; });
}));

/* Equal collapsed card heights; an opened card still grows on its own */
const cards = [...sl.querySelectorAll(".card")];
function equalize() {
  cards.forEach((c) => (c.style.minHeight = ""));
  if (getComputedStyle(sl).display !== "flex") return;
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const face = (c) => {
    const d = c.querySelector("details");
    return c.offsetHeight - (d.open ? d.offsetHeight - d.querySelector("summary").offsetHeight : 0);
  };
  const max = Math.max(...cards.map(face));
  cards.forEach((c) => (c.style.minHeight = max / rem + "rem"));
}
addEventListener("resize", equalize);
addEventListener("load", equalize);
if (document.fonts) document.fonts.ready.then(equalize);
equalize();

/* Project details as a carousel: each section or step is one labelled slide */
document.querySelectorAll("details.how").forEach((d) => {
  const slides = [];
  let cur = null;
  [...d.children].filter((e) => e.tagName !== "SUMMARY").forEach((e) => {
    if (e.tagName === "H4") { cur = { tag: e.textContent, nodes: [] }; slides.push(cur); }
    else if (e.tagName === "OL") {
      const all = [...e.children];
      all.forEach((li, n) => {
        const b = li.querySelector("b"), name = b ? b.textContent.replace(/\.$/, "") : "Step " + (n + 1);
        if (b) b.remove();
        slides.push({ tag: cur.tag + " · step " + (n + 1) + " of " + all.length, name, text: li.textContent.trim() });
      });
      cur.skip = true;
    } else if (cur) cur.nodes.push(e);
  });
  const list = slides.filter((x) => !x.skip);
  if (!list.length) return;
  [...d.children].forEach((e) => { if (e.tagName !== "SUMMARY") e.remove(); });
  const car = document.createElement("div");
  car.className = "car";
  car.innerHTML = '<div class="car-top"><span class="car-tag"></span><span class="car-n"></span></div><div class="car-body" aria-live="polite"></div><div class="car-nav"><button type="button" class="cb" aria-label="Previous">&lsaquo;</button><div class="dots"></div><button type="button" class="cb" aria-label="Next">&rsaquo;</button></div>';
  d.appendChild(car);
  const tag = car.querySelector(".car-tag"), num = car.querySelector(".car-n"), body = car.querySelector(".car-body"), dots = car.querySelector(".dots");
  const [prev, next] = car.querySelectorAll(".cb");
  let i = 0;
  list.forEach((x, n) => {
    const b = document.createElement("button");
    b.type = "button"; b.setAttribute("aria-label", "Go to " + (x.name || x.tag));
    b.onclick = () => render(n, n > i ? 1 : -1);
    dots.appendChild(b);
  });
  function render(n, dir, quiet) {
    i = (n + list.length) % list.length;
    const x = list[i];
    tag.textContent = x.tag; num.textContent = (i + 1) + " / " + list.length;
    body.innerHTML = "";
    if (x.name) { const h = document.createElement("h5"), p = document.createElement("p"); h.textContent = x.name; p.textContent = x.text; body.append(h, p); }
    else x.nodes.forEach((nd) => body.appendChild(nd.cloneNode(true)));
    [...dots.children].forEach((b, n) => b.setAttribute("aria-current", n === i));
    body.style.setProperty("--dir", dir || 1);
    body.style.animation = "none"; void body.offsetWidth;
    if (!quiet) body.style.animation = "";
  }
  function fit() {
    body.style.minHeight = "";
    let m = 0;
    list.forEach((x, n) => { render(n, 1, true); m = Math.max(m, body.offsetHeight); });
    body.style.minHeight = m / parseFloat(getComputedStyle(document.documentElement).fontSize) + "rem";
    render(0, 1);
  }
  prev.onclick = () => render(i - 1, -1);
  next.onclick = () => render(i + 1, 1);
  car.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") render(i - 1, -1); if (e.key === "ArrowRight") render(i + 1, 1); });
  let x0 = null;
  body.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  body.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 40) render(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
  d.addEventListener("toggle", () => { if (d.open) fit(); });
  render(0, 1, true);
});

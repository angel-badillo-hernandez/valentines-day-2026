// ====== Quick customization ======
const CUSTOM_TEXT = {
  headline: "Hey Yami 💗",
  message:
    "I made you a virtual Valentine's Day card because you are genuinely a wonderful person. " +
    "You're sweet, fun, and you make everything feel lighter.",
  note: "P.S. You look extra iconic in pink. 🌸",
  overlayTitle: "Yami said YES?! 💗✨",
  overlayBody: "You just made my whole day.\nHappy Valentine's Day, Yami 🌸"
};

// ====== Elements ======
const desk = document.getElementById("desk");
const drift = document.getElementById("drift");
const card = document.getElementById("card");
const confetti = document.getElementById("confetti");

const stickerLeft = document.getElementById("stickerLeft");
const stickerRight = document.getElementById("stickerRight");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const overlay = document.getElementById("overlay");
const closeOverlay = document.getElementById("closeOverlay");

// Lightbox elements
const insideLeftPhoto = document.getElementById("insideLeftPhoto");
const imgOverlay = document.getElementById("imgOverlay");
const imgOverlayEl = document.getElementById("imgOverlayEl");
const imgClose = document.getElementById("imgClose");

// ====== Apply custom text ======
document.getElementById("headline").textContent = CUSTOM_TEXT.headline;
document.getElementById("msg").textContent = CUSTOM_TEXT.message;
document.getElementById("note").textContent = CUSTOM_TEXT.note;
overlay.querySelector("h2").textContent = CUSTOM_TEXT.overlayTitle;
overlay.querySelector("p").textContent = CUSTOM_TEXT.overlayBody;

// ====== Bifold open/close ======
let isOpen = false;
function toggleCard(force){
  isOpen = (typeof force === "boolean") ? force : !isOpen;
  card.classList.toggle("open", isOpen);
  if (isOpen) burstHearts(18);
}

card.addEventListener("click", (e) => {
  const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
  if (tag === "button") return;
  toggleCard();
});

card.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleCard();
  }
});

// ====== Confetti hearts ======
function burstHearts(count = 16){
  const rect = confetti.getBoundingClientRect();
  const centerX = rect.width * 0.72;
  const baseY = rect.height * 0.75;

  const hearts = ["💗","💖","💞","✨","🌸"];
  for (let i = 0; i < count; i++){
    const el = document.createElement("div");
    el.className = "heart";
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    const x = centerX + (Math.random() * 160 - 80);
    const y = baseY + (Math.random() * 40 - 20);
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.animationDuration = (900 + Math.random() * 700) + "ms";
    el.style.fontSize = (16 + Math.random() * 14) + "px";

    confetti.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }
}

// ====== Yes / Not yet ======
let saidYes = false;

yesBtn.addEventListener("click", () => {
  if (!isOpen) toggleCard(true);
  burstHearts(26);
  saidYes = true;
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
});

closeOverlay.addEventListener("click", () => {
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
});

// gentle dodge
noBtn.addEventListener("mouseenter", () => {
  if (saidYes) return;
  const max = 18;
  const dx = (Math.random() * max * 2) - max;
  const dy = (Math.random() * max * 2) - max;
  noBtn.style.transform = `translate(${dx}px, ${dy}px)`;
});
noBtn.addEventListener("mouseleave", () => {
  noBtn.style.transform = "translate(0,0)";
});
noBtn.addEventListener("click", () => {
  if (!isOpen) toggleCard(true);
  document.getElementById("note").textContent = "That's okay 💗 I'm still happy you opened it.";
  burstHearts(10);
});

// ====== Parallax for big PNG stickers ======
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const isTouch = window.matchMedia("(pointer: coarse)").matches;

function onMove(clientX, clientY){
  const r = desk.getBoundingClientRect();
  const x = (clientX - r.left) / r.width;
  const y = (clientY - r.top) / r.height;

  const dx = (x - 0.5);
  const dy = (y - 0.5);

  const leftMax = isTouch ? 8 : 14;
  const rightMax = isTouch ? 10 : 18;

  const ltx = clamp(dx * leftMax, -leftMax, leftMax);
  const lty = clamp(dy * leftMax, -leftMax, leftMax);

  const rtx = clamp(dx * rightMax * -1, -rightMax, rightMax);
  const rty = clamp(dy * rightMax, -rightMax, rightMax);

  stickerLeft.style.transform  = `translate3d(${ltx}px, ${lty}px, 0) rotate(${ltx * 0.15}deg)`;
  stickerRight.style.transform = `translate3d(${rtx}px, ${rty}px, 0) rotate(${rtx * 0.12}deg)`;
}

window.addEventListener("mousemove", (e) => onMove(e.clientX, e.clientY), { passive:true });
window.addEventListener("touchmove", (e) => {
  if (!e.touches || !e.touches[0]) return;
  onMove(e.touches[0].clientX, e.touches[0].clientY);
}, { passive:true });

// ====== Drifting placeholders ======
const FLOATY_EMOJIS = ["🎮","🕹️","🐾","💗","✨","🌸","🧡","⭐","👑","💞"];

function makeFloaties(count = 18){
  drift.innerHTML = "";
  const w = window.innerWidth;
  const h = window.innerHeight;

  for (let i = 0; i < count; i++){
    const el = document.createElement("div");
    el.className = "floaty";
    el.innerHTML = `<span>${FLOATY_EMOJIS[i % FLOATY_EMOJIS.length]}</span>`;

    const startX = (-120 + Math.random() * (w * 0.6)) + "px";
    const startY = (h + Math.random() * 240) + "px";
    const endX   = (w + Math.random() * 280) + "px";
    const endY   = (-200 - Math.random() * 240) + "px";

    const dur = (10 + Math.random() * 12).toFixed(2) + "s";

    el.style.setProperty("--x0", startX);
    el.style.setProperty("--y0", startY);
    el.style.setProperty("--x1", endX);
    el.style.setProperty("--y1", endY);
    el.style.setProperty("--dur", dur);

    const scale = 0.75 + Math.random() * 0.8;
    el.style.width = (64 * scale) + "px";
    el.style.height = (46 * scale) + "px";
    el.style.opacity = (0.22 + Math.random() * 0.28).toFixed(2);
    el.style.borderRadius = (14 + Math.random() * 14) + "px";
    el.style.animationDelay = (-Math.random() * 18).toFixed(2) + "s";

    drift.appendChild(el);
  }
}

makeFloaties(20);
window.addEventListener("resize", () => makeFloaties(20));

// ====== Optional: fallback emoji if PNG sticker missing ======
function applyFallbackIfBroken(stickerEl, fallbackEmoji){
  const url = getComputedStyle(stickerEl).getPropertyValue("--img").trim();
  if (!url || url === "none") return;

  const match = url.match(/url\(['"]?(.*?)['"]?\)/i);
  const src = match ? match[1] : null;
  if (!src) return;

  const img = new Image();
  img.onerror = () => {
    stickerEl.classList.add("fallback");
    const el = stickerEl.querySelector(".img");
    el.style.background = "none";
    el.textContent = fallbackEmoji;
  };
  img.src = src;
}
applyFallbackIfBroken(stickerLeft, "💞");
applyFallbackIfBroken(stickerRight, "🎮");

// ====== Lightbox: tap to expand inside-left image ======
function getCssUrlVar(el, varName){
  const v = getComputedStyle(el).getPropertyValue(varName).trim();
  const match = v.match(/url\(['"]?(.*?)['"]?\)/i);
  return match ? match[1] : null;
}

function openImgOverlay(){
  if (!insideLeftPhoto) return;
  const src = getCssUrlVar(insideLeftPhoto, "--photo");
  if (!src) return;

  imgOverlayEl.src = src;
  imgOverlay.classList.add("show");
  imgOverlay.setAttribute("aria-hidden", "false");
}

function closeImgOverlay(){
  imgOverlay.classList.remove("show");
  imgOverlay.setAttribute("aria-hidden", "true");
  imgOverlayEl.src = "";
}

if (insideLeftPhoto){
  insideLeftPhoto.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent card from toggling
    openImgOverlay();
  });

  insideLeftPhoto.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      openImgOverlay();
    }
  });
}

imgClose.addEventListener("click", closeImgOverlay);

// tap outside modal closes it
imgOverlay.addEventListener("click", (e) => {
  if (e.target === imgOverlay) closeImgOverlay();
});

// escape closes it
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && imgOverlay.classList.contains("show")) closeImgOverlay();
});

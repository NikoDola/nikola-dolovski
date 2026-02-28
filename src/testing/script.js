const eyes = document.querySelectorAll(".eye");
let lastMouse = { x: 0, y: 0 };
let idleTimer = null;

document.addEventListener("mousemove", (e) => {
  lastMouse = { x: e.clientX, y: e.clientY };

  eyes.forEach((eye) => {
    const ball = eye.querySelector(".ball");
    const rect = eye.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = rect.width / 2 - ball.offsetWidth / 2;

    let x = dx;
    let y = dy;

    if (distance > maxRadius) {
      const angle = Math.atan2(dy, dx);
      x = Math.cos(angle) * maxRadius;
      y = Math.sin(angle) * maxRadius;
    }

    ball.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  });

  document.body.style.cursor = "default";
  document.querySelectorAll("*").forEach(el => el.style.cursor = "default");
  removeBeams();

  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(triggerIdleEffect, 1000);
});

function triggerIdleEffect() {
  document.body.style.cursor = "none";
  document.querySelectorAll("*").forEach(el => el.style.cursor = "none");

  eyes.forEach((eye) => {
    const ball = eye.querySelector(".ball");
    const rect = ball.getBoundingClientRect();
    shootBeam(rect.left + rect.width / 2, rect.top + rect.height / 2, lastMouse.x, lastMouse.y);
  });

  createFallingCursor(lastMouse.x, lastMouse.y);
}

function shootBeam(x1, y1, x2, y2) {
  const beam = document.createElement("div");
  beam.className = "beam";
  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  beam.style.width = "0px"; // start from 0
  beam.style.left = x1 + "px";
  beam.style.top = y1 + "px";
  beam.style.transform = `rotate(${angle}deg)`;
  document.body.appendChild(beam);

  // Animate beam growing to full length
  requestAnimationFrame(() => {
    beam.style.width = length + "px";
  });

  // Remove after animation
  setTimeout(() => {
    beam.remove();
  }, 300);
}

function removeBeams() {
  document.querySelectorAll(".beam").forEach(b => b.remove());
}

function createFallingCursor(x, y) {
  const cursorAnim = document.createElement("div");
  cursorAnim.className = "cursor-animation";
  cursorAnim.style.left = x + "px";
  cursorAnim.style.top = y + "px";
  document.body.appendChild(cursorAnim);

  setTimeout(() => {
    cursorAnim.remove();
    document.body.style.cursor = "default";
    document.querySelectorAll("*").forEach(el => el.style.cursor = "default");
  }, 800);
}
// Select the single eye element
const eye = document.querySelector(".eye")

// Select the pupil inside the eye
const ball = eye.querySelector(".ball")

// Store the last known mouse position
let lastMouse = { x: 0, y: 0 }

// Timer used to detect when the mouse stops moving (idle state)
let idleTimer = null

// Main mouse move listener
document.addEventListener("mousemove", (e) => {
  // Update last mouse position
  lastMouse = { x: e.clientX, y: e.clientY }

  // Get eye position & size relative to viewport
  const rect = eye.getBoundingClientRect()

  // Calculate center of the eye
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  // Calculate distance from mouse to eye center
  const dx = e.clientX - centerX
  const dy = e.clientY - centerY

  // Distance between mouse and eye center
  const distance = Math.sqrt(dx * dx + dy * dy)

  // Maximum movement radius of pupil inside the eye
  const maxRadius = rect.width / 2 - ball.offsetWidth / 2

  let x = dx
  let y = dy

  // Clamp pupil movement so it stays inside the eye
  if (distance > maxRadius) {
    const angle = Math.atan2(dy, dx)
    x = Math.cos(angle) * maxRadius
    y = Math.sin(angle) * maxRadius
  }

  // Move pupil toward mouse
  ball.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`

  // Restore cursor visibility
  document.body.style.cursor = "default"
  document.querySelectorAll("*").forEach(el => el.style.cursor = "default")

  // Remove any existing laser beams
  removeBeams()

  // Reset idle timer
  if (idleTimer) clearTimeout(idleTimer)
  idleTimer = setTimeout(triggerIdleEffect, 1000)
})


// Triggered when mouse is idle for 1 second
function triggerIdleEffect() {
  // Hide cursor
  document.body.style.cursor = "none"
  document.querySelectorAll("*").forEach(el => el.style.cursor = "none")

  // Fire beam from pupil toward last mouse position
  const rect = ball.getBoundingClientRect()

  shootBeam(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
    lastMouse.x,
    lastMouse.y
  )

  // Spawn falling cursor animation
  createFallingCursor(lastMouse.x, lastMouse.y)
}


// Creates and animates a laser beam
function shootBeam(x1, y1, x2, y2) {
  const beam = document.createElement("div")
  beam.className = "beam"

  // Distance between start and end point
  const length = Math.hypot(x2 - x1, y2 - y1)

  // Rotation angle toward cursor
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI)

  beam.style.width = "0px"
  beam.style.left = x1 + "px"
  beam.style.top = y1 + "px"
  beam.style.transform = `rotate(${angle}deg)`

  document.body.appendChild(beam)

  // Animate beam extending forward
  requestAnimationFrame(() => {
    beam.style.width = length + "px"
  })

  // Cleanup beam after animation
  setTimeout(() => {
    beam.remove()
  }, 300)
}


// Removes all beams instantly
function removeBeams() {
  document.querySelectorAll(".beam").forEach(b => b.remove())
}


// Creates falling cursor visual when idle
function createFallingCursor(x, y) {
  const cursorAnim = document.createElement("div")
  cursorAnim.className = "cursor-animation"

  cursorAnim.style.left = x + "px"
  cursorAnim.style.top = y + "px"

  document.body.appendChild(cursorAnim)

  // Cleanup and restore cursor
  setTimeout(() => {
    cursorAnim.remove()
    document.body.style.cursor = "default"
    document.querySelectorAll("*").forEach(el => el.style.cursor = "default")
  }, 800)
}
export const keyPressed: Record<string, boolean> = {}
document.addEventListener("keydown", (e) => {
  keyPressed[e.key] = true
})
document.addEventListener("keyup", (e) => {
  // keyPressed[e.key] = false;
  delete keyPressed[e.key]
})

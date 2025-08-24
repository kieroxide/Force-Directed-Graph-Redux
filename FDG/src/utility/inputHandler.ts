import type { Camera } from "../classes/Camera";

export function setupCameraControls(canvas: HTMLCanvasElement, camera: Camera) {
  let isDragging = false;
  
  canvas.addEventListener('mousedown', () => {
    isDragging = true;
  });
  
  canvas.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  canvas.addEventListener('mouseleave', () => {
    isDragging = false; // Stop dragging if mouse leaves canvas
  });
  
  canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        camera.panCamera(e.movementX, e.movementY);
    }
  });
}
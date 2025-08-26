import type { Camera } from "../classes/Camera";

export function setupCameraControls(canvas: HTMLCanvasElement, camera: Camera) {
    let isDragging = false;

    canvas.addEventListener("mousedown", () => {
        isDragging = true;
    });

    canvas.addEventListener("mouseup", () => {
        isDragging = false;
    });

    canvas.addEventListener("mouseleave", () => {
        isDragging = false; // Stop dragging if mouse leaves canvas
    });
    canvas.addEventListener("mousemove", (e) => {
        if (isDragging) {
            camera.pan(e.movementX, e.movementY);
        }
    });
    canvas.addEventListener("wheel", (e: WheelEvent) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
        camera.zoomAt(mouseX, mouseY, factor);
    });
}

import { Vec } from "./Vec";

export class Camera {
    pos: Vec;
    zoom: number;
    constructor() {
        this.pos = new Vec(0, 0);
        this.zoom = 1;
    }

    applyTransform(ctx: CanvasRenderingContext2D) {
        ctx.translate(this.pos.x, this.pos.y);
        ctx.scale(this.zoom, this.zoom);
    }

    pan(dx: number, dy: number) {
        this.pos.x += dx;
        this.pos.y += dy;
    }

    zoomAt(mouseX: number, mouseY: number, factor: number) {
        // Convert mouse to camera coordinates
        const camX = (mouseX - this.pos.x) / this.zoom;
        const camY = (mouseY - this.pos.y) / this.zoom;

        this.zoom *= factor;

        // Adjust offset to keep mouse point fixed
        this.pos.x = mouseX - camX * this.zoom;
        this.pos.y = mouseY - camY * this.zoom;
    }
}

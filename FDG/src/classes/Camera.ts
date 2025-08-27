import { Controls } from "../constants";
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
        this.pos.x += dx * Controls.MouseSpeedFactor;
        this.pos.y += dy * Controls.MouseSpeedFactor;
    }

    zoomAt(c_mouse: Vec, ws_mouse: Vec, factor: number) {
        this.zoom *= factor;

        // Adjust offset to keep mouse point fixed
        this.pos.x = c_mouse.x - ws_mouse.x * this.zoom;
        this.pos.y = c_mouse.y - ws_mouse.y * this.zoom;
    }
}

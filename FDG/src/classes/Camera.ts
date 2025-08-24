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

    panCamera(dx: number, dy: number) {
        this.pos.x += dx;
        this.pos.y += dy;
    }
}

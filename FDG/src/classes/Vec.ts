import type { Camera } from "./Camera";

export class Vec {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    canvasToWorld(camera: Camera) {
        // returns world space Vector/Coordinate from canvas space coord
        const worldX = (this.x - camera.pos.x) / camera.zoom;
        const worldY = (this.y - camera.pos.y) / camera.zoom;
        return new Vec(worldX, worldY);
    }
}

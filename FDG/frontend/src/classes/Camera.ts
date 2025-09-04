import { Controls } from "../../constants";
import { Vec } from "../graph/Vec";

export class Camera {
    private _pos: Vec;
    private _zoom: number;

    constructor() {
        this._pos = new Vec(0, 0);
        this._zoom = 1;
    }

    canvasToWorld(vector: Vec) {
        // returns world space Vector/Coordinate from canvas space coord
        const worldX = (vector.x - this._pos.x) / this._zoom;
        const worldY = (vector.y - this._pos.y) / this._zoom;
        return new Vec(worldX, worldY);
    }

    applyTransform(ctx: CanvasRenderingContext2D) {
        ctx.translate(this._pos.x, this._pos.y);
        ctx.scale(this._zoom, this._zoom);
    }

    pan(dx: number, dy: number) {
        this._pos.x += dx * Controls.MouseSpeedFactor;
        this._pos.y += dy * Controls.MouseSpeedFactor;
    }

    zoomAt(c_mouse: Vec, ws_mouse: Vec, factor: number) {
        this._zoom *= factor;

        // Adjust offset to keep mouse point fixed
        this._pos.x = c_mouse.x - ws_mouse.x * this._zoom;
        this._pos.y = c_mouse.y - ws_mouse.y * this._zoom;
    }
}

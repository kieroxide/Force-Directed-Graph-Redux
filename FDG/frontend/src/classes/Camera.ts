import { Vec } from "../graph/Vec";
import { Vertex } from "../graph/Vertex";

export class Camera {
    private static readonly MOUSE_SPEED_FACTOR = 1;
    private static readonly ZOOM_SCALE_FACTOR = 1.1;

    private _pos: Vec;
    private _zoom: number;
    private _cameraLockedVertex: Vertex | null;

    constructor() {
        this._pos = new Vec(0, 0);
        this._zoom = 1;
        this._cameraLockedVertex = null;
    }

    get cameraLockedVertex() {
        return this._cameraLockedVertex;
    }
    set cameraLockedVertex(vertex: Vertex | null) {
        this._cameraLockedVertex = vertex;
    }

    /**
     * Convert canvas coordinates to world coordinates.
     */
    canvasToWorld(vector: Vec) {
        const worldX = (vector.x - this._pos.x) / this._zoom;
        const worldY = (vector.y - this._pos.y) / this._zoom;
        return new Vec(worldX, worldY);
    }

    /**
     * Apply camera transform to the canvas context.
     */
    applyTransform(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        if (this._cameraLockedVertex) {
            const vertexPosition = this._cameraLockedVertex.pos;
            const vertexCamPosition = new Vec(
                canvas.width / 2 - vertexPosition.x * this._zoom,
                canvas.height / 2 - vertexPosition.y * this._zoom
            );
            this._pos = vertexCamPosition;
        }
        ctx.translate(this._pos.x, this._pos.y);
        ctx.scale(this._zoom, this._zoom);
    }

    /**
     * Move the camera by dx, dy.
     */
    pan(dx: number, dy: number) {
        this._pos.x += dx * Camera.MOUSE_SPEED_FACTOR;
        this._pos.y += dy * Camera.MOUSE_SPEED_FACTOR;
    }

    /**
     * Zoom in or out at a given mouse position.
     */
    zoomAt(c_mouse: Vec, ws_mouse: Vec, deltaY: number) {
        const factor = deltaY < 0 ? Camera.ZOOM_SCALE_FACTOR : 1 / Camera.ZOOM_SCALE_FACTOR;
        this._zoom *= factor;
        this._pos.x = c_mouse.x - ws_mouse.x * this._zoom;
        this._pos.y = c_mouse.y - ws_mouse.y * this._zoom;
    }
}

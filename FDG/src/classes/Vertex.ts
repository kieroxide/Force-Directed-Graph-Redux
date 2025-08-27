import { Vec } from "./Vec";
import { Edge } from "./Edge";
import { PHYSICS, RENDERING } from "../constants";
import { clamp, setFontSize } from "../utility/utils";
import type { Camera } from "./Camera";

export class Vertex {
    // Euclidean Data
    pos: Vec;
    vector: Vec;
    mass: number;

    // Generic Data
    name: string;
    type: string;
    textMass: number;
    releaseDate: string | undefined;
    edges: Array<Edge>;

    // Visual Label
    label: string;
    labelColour?: string;
    private _textWidth?: number;

    constructor(name: string, type: string, releaseDate: string | undefined) {
        this.pos = new Vec(200, 200);
        this.vector = new Vec(0, 0);
        this.mass = 1;
        this.textMass = 0;

        this.name = name;
        this.type = type;

        this.releaseDate = releaseDate;
        if (this.releaseDate === undefined) {
            this.releaseDate = "";
        }

        this.edges = [];

        this.label = this.name;
        this.labelColour = undefined;
    }

    // Method to update position of the Vertex using the vector's values. Also applies damping
    update() {
        this.pos.x += clamp(this.vector.x, PHYSICS.CLAMPS.MAX_SPEED);
        this.pos.y += clamp(this.vector.y, PHYSICS.CLAMPS.MAX_SPEED);

        this.vector.x *= PHYSICS.FORCES.DAMPING;
        this.vector.y *= PHYSICS.FORCES.DAMPING;
    }

    inBoundary(
        point: Vec,
        ctx: CanvasRenderingContext2D,
        camera: Camera
    ): boolean {
        const boundaries = this.getBoundaries(ctx);
        const ws_point = point.canvasToWorld(camera);

        const check_x =
            boundaries.left <= ws_point.x && ws_point.x <= boundaries.right;
        const check_y =
            boundaries.top <= ws_point.y && ws_point.y <= boundaries.bottom;
        return check_x && check_y;
    }

    getBoundaries(ctx: CanvasRenderingContext2D) {
        const _left = this.pos.x - this.getBoxWidth(ctx) / 2;
        const _right = this.pos.x + this.getBoxWidth(ctx) / 2;
        const _top = this.pos.y - this.getBoxHeight() / 2;
        const _bottom = this.pos.y + this.getBoxHeight() / 2;
        return { left: _left, right: _right, top: _top, bottom: _bottom };
    }

    getNeighbours(): Set<Vertex> {
        let neighbours = new Set<Vertex>();
        for (const edge of this.edges) {
            neighbours.add(edge.target);
            neighbours.add(edge.source);
        }
        return neighbours;
    }

    getOriginalMass() {
        // Made into function incase I add more factors for mass
        return this.edges.length;
    }

    getBoxWidth(ctx: CanvasRenderingContext2D, force: boolean = false) {
        let width =
            this.getTextWidth(ctx, force) + RENDERING.TEXT_BOX.PADDING_WIDTH;
        return width;
    }
    getBoxHeight() {
        const massFontSize =
            RENDERING.FONT.SIZE + this.getOriginalMass() * RENDERING.FONT.MASS_WEIGHT;

        return massFontSize + RENDERING.TEXT_BOX.PADDING_HEIGHT / 2;
    }
    getTextWidth(ctx: CanvasRenderingContext2D, force: boolean = false) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = RENDERING.FONT.FULL;
        if (force || this._textWidth === undefined) {
            this._textWidth = ctx.measureText(this.label).width;
        }
        return this._textWidth;
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Set text properties BEFORE measuring (important!)
        const massFontSize =
            RENDERING.FONT.SIZE + this.getOriginalMass() * RENDERING.FONT.MASS_WEIGHT;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.font = RENDERING.FONT.FULL;
        ctx.font = setFontSize(RENDERING.FONT.FULL, massFontSize);

        const metrics = ctx.measureText(this.label);
        const boxWidth = metrics.width + RENDERING.TEXT_BOX.PADDING_WIDTH / 2;
        const boxHeight = massFontSize + RENDERING.TEXT_BOX.PADDING_HEIGHT / 2;

        // Draw background box
        ctx.fillStyle = this.labelColour || "grey";
        ctx.fillRect(
            this.pos.x - boxWidth / 2,
            this.pos.y - boxHeight / 2,
            boxWidth,
            boxHeight
        );

        // Outline of Box
        ctx.strokeStyle = RENDERING.TEXT_BOX.BORDER_COLOR;
        ctx.lineWidth = RENDERING.TEXT_BOX.BORDER_WIDTH;
        ctx.strokeRect(
            this.pos.x - boxWidth / 2,
            this.pos.y - boxHeight / 2,
            boxWidth,
            boxHeight
        );

        // Draw text
        ctx.fillStyle = "black";
        ctx.fillText(this.label, this.pos.x, this.pos.y);
    }
}

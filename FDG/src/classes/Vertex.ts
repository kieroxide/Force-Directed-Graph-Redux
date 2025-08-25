import { Vec } from "./Vec";
import { Edge } from "./Edge";
import { randomNum } from "../utility/utils";
import { PHYSICS, RENDERING } from "../constants";

export class Vertex {
    // Euclidean Data
    pos: Vec;
    vector: Vec;

    // Generic Data
    name: string;
    type: string;
    releaseDate: string | undefined;
    edges: Array<Edge>;

    // Visual Label
    label: string;
    private _textWidth?: number;

    constructor(name: string, type: string, releaseDate: string | undefined) {
        this.pos = new Vec(randomNum(50, 150), randomNum(50, 150));
        this.vector = new Vec(0, 0);

        this.name = name;
        this.type = type;

        this.releaseDate = releaseDate;
        if (this.releaseDate === undefined) {
            this.releaseDate = "";
        }

        this.edges = [];

        this.label = this.name;
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

    // Method to update position of the Vertex using the vector's values. Also applies damping
    update() {
        this.pos.x += this.vector.x;
        this.pos.y += this.vector.y;

        this.vector.x *= PHYSICS.FORCES.DAMPING;
        this.vector.y *= PHYSICS.FORCES.DAMPING;
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Set text properties BEFORE measuring (important!)
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = RENDERING.FONT.FULL;

        const metrics = ctx.measureText(this.label);
        const padding = RENDERING.TEXT_BOX.PADDING;
        const boxWidth = metrics.width + padding * 2;
        const boxHeight = RENDERING.FONT.SIZE + padding * 2;


        // Draw background box
        ctx.fillStyle = RENDERING.TEXT_BOX.BACKGROUND_COLOR;
        ctx.fillRect(
            this.pos.x - boxWidth / 2,
            this.pos.y - boxHeight / 2,
            boxWidth,
            boxHeight
        );

        // Outline of Box
        ctx.fillStyle = RENDERING.TEXT_BOX.BORDER_COLOR;
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

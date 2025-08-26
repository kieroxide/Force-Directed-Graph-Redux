import { Vec } from "./Vec";
import { Edge } from "./Edge";
import { PHYSICS, RENDERING } from "../constants";
import { clamp } from "../utility/utils";

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
    labelColour?: string;
    private _textWidth?: number;

    constructor(name: string, type: string, releaseDate: string | undefined) {
        this.pos = new Vec(200, 200);
        this.vector = new Vec(0, 0);

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
    
    getNeighbours(): Set<Vertex> {
        let neighbours = new Set<Vertex>();
        for (const edge of this.edges) {
            neighbours.add(edge.target);
            neighbours.add(edge.source);
        }
        return neighbours;
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
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = RENDERING.FONT.FULL;

        const metrics = ctx.measureText(this.label);
        const padding = RENDERING.TEXT_BOX.PADDING;
        const boxWidth = metrics.width + padding * 2;
        const boxHeight = RENDERING.FONT.SIZE + padding * 2;

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

import { Vertex } from "./Vertex";

export class Edge {
    source: Vertex;
    target: Vertex;
    type: string;
    lineColour?: string;
    constructor(vertexA: Vertex, vertexB: Vertex, type: string) {
        this.source = vertexA;
        this.target = vertexB;
        this.type = type;

        vertexA.edges.push(this);
        vertexB.edges.push(this);
    }

    draw(ctx: CanvasRenderingContext2D) {
        const { source, target } = this;

        ctx.strokeStyle = this.lineColour || "#00000012";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(source.pos.x, source.pos.y);
        ctx.lineTo(target.pos.x, target.pos.y);
        ctx.stroke();
    }
}

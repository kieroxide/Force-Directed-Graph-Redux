import type { Graph } from "./Graph";
import { Vertex } from "./Vertex";

export class Edge {
    sourceId: string;
    sourceRef: Vertex;
    targetId: string;
    targetRef: Vertex;
    type: string;
    lineColour?: string;

    constructor(
        sourceID: string,
        targetID: string,
        type: string,
        graph: Graph
    ) {
        this.sourceId = sourceID;
        this.targetId = targetID;
        this.type = type;
        this.sourceRef = graph.getVertex(sourceID);
        this.targetRef = graph.getVertex(targetID);
        
        if (!this.sourceRef || !this.targetRef) {
            throw new Error(`Invalid vertex IDs: source=${sourceID}, target=${targetID}`);
        }
        
        this.sourceRef.edges.push(this);
        this.targetRef.edges.push(this);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.lineColour || "#00000012";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.sourceRef.pos.x, this.sourceRef.pos.y);
        ctx.lineTo(this.targetRef.pos.x, this.targetRef.pos.y);
        ctx.stroke();
    }
}

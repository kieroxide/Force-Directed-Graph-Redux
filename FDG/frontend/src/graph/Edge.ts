import type { Graph } from "./Graph.ts";
import { Vertex } from "./Vertex.ts";

export class Edge {
    private readonly _sourceId: string;
    private readonly _sourceRef: Vertex;
    get sourceRef() {
        return this._sourceRef;
    }

    private readonly _targetId: string;
    private readonly _targetRef: Vertex;
    get targetRef() {
        return this._targetRef;
    }

    private readonly _type: string;
    get type() {
        return this._type;
    }
    lineColour: string;

    constructor(sourceID: string, targetID: string, type: string, graph: Graph) {
        this._sourceId = sourceID;
        this._targetId = targetID;
        this._type = type;
        this.lineColour = "#000000"; // Default colour
        this._sourceRef = graph.getVertex(sourceID);
        this._targetRef = graph.getVertex(targetID);

        if (!this._sourceRef || !this._targetRef) {
            throw new Error(`Invalid vertex IDs: source=${sourceID}, target=${targetID}`);
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.lineColour || "#00000012";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this._sourceRef.pos.x, this._sourceRef.pos.y);
        ctx.lineTo(this._targetRef.pos.x, this._targetRef.pos.y);
        ctx.stroke();
    }
}

import type { Graph } from "./Graph.ts";
import { Vertex } from "./Vertex.ts";

export class Edge {
    private _sourceId: string;
    private _sourceRef: Vertex;
    private _targetId: string;
    private _targetRef: Vertex;
    private _type: string;
    private _lineColour: string;

    get sourceRef() {
        return this._sourceRef;
    }
    get targetRef() {
        return this._targetRef;
    }
    get lineColour() {
        return this._lineColour;
    }
    get type() {
        return this._type
    }
    public set lineColour(colour: string) {
        this._lineColour = colour;
    }

    constructor(sourceID: string, targetID: string, type: string, graph: Graph) {
        this._sourceId = sourceID;
        this._targetId = targetID;
        this._type = type;
        this._lineColour = "#000000"
        this._sourceRef = graph.getVertex(sourceID);
        this._targetRef = graph.getVertex(targetID);

        if (!this._sourceRef || !this._targetRef) {
            throw new Error(`Invalid vertex IDs: source=${sourceID}, target=${targetID}`);
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this._lineColour || "#00000012";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this._sourceRef.pos.x, this._sourceRef.pos.y);
        ctx.lineTo(this._targetRef.pos.x, this._targetRef.pos.y);
        ctx.stroke();
    }
}

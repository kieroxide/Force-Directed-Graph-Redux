import type { Graph } from "./Graph.ts";
import { Vertex } from "./Vertex.ts";
import { Vec } from "./Vec.ts";

export class Edge {
    private static readonly LINE_SIZE = 4;
    private static readonly ARROW_HEAD_SIZE = 30;
    private static readonly ARROW_HEAD_ANGLE = Math.PI / 6;

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
        ctx.fillStyle = this.lineColour;
        ctx.lineWidth = Edge.LINE_SIZE;
        this.drawArrow(ctx, this._sourceRef, this._targetRef);
    }

    getBoxIntersect(sourcePos: Vec, target: Vertex) {
        const halfWidth = target._cachedDimensions!.boxWidth / 2;
        const halfHeight = target._cachedDimensions!.boxHeight / 2;

        const dx = target.pos.x - sourcePos.x;
        const dy = target.pos.y - sourcePos.y;

        if (dx === 0 && dy === 0) return new Vec(target.pos.x, target.pos.y); // same point

        // Scale factors along each axis
        const scaleX = halfWidth / Math.abs(dx);
        const scaleY = halfHeight / Math.abs(dy);

        const scale = Math.min(scaleX, scaleY);

        return new Vec(target.pos.x - dx * scale, target.pos.y - dy * scale);
    }

    drawArrow(ctx: CanvasRenderingContext2D, sourceVertex: Vertex, targetVertex: Vertex) {
        const headLength = Edge.ARROW_HEAD_SIZE; // length of arrow head

        const source = sourceVertex.pos;
        const intersectTarget = this.getBoxIntersect(source, targetVertex);

        const dx = intersectTarget.x - source.x;
        const dy = intersectTarget.y - source.y;

        const angle = Math.atan2(dy, dx);

        // Move line endpoint back by headLength
        const lineEndX = intersectTarget.x - headLength * Math.cos(angle);
        const lineEndY = intersectTarget.y - headLength * Math.sin(angle);
        // Line
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(lineEndX, lineEndY);
        ctx.stroke();

        const arrowAngle = Edge.ARROW_HEAD_ANGLE;
        // Head
        ctx.beginPath();
        ctx.moveTo(intersectTarget.x, intersectTarget.y);
        ctx.lineTo(
            intersectTarget.x - headLength * Math.cos(angle + arrowAngle),
            intersectTarget.y - headLength * Math.sin(angle + arrowAngle)
        );
        ctx.lineTo(
            intersectTarget.x - headLength * Math.cos(angle - arrowAngle),
            intersectTarget.y - headLength * Math.sin(angle - arrowAngle)
        );
        ctx.lineTo(intersectTarget.x, intersectTarget.y);
        ctx.fill();
    }
}

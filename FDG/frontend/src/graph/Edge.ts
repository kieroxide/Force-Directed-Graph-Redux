import type { Graph } from "./Graph.ts";
import { Vertex } from "./Vertex.ts";
import { Vec } from "./Vec.ts";

export class Edge {
    private static readonly LINE_SIZE = 4;
    private static readonly ARROW_HEAD_SIZE = 30;
    private static readonly ARROW_HEAD_ANGLE = Math.PI / 6;
    private static readonly BIDIRECTIONAL_OFFSET = 20;

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

    private _isBidirectional: boolean;
    set isBiDirectional(isBiDirectional: boolean) {
        this._isBidirectional = isBiDirectional;
    }

    private readonly _type: string;
    get type() {
        return this._type;
    }
    lineColour: string;

    constructor(sourceID: string, targetID: string, type: string, graph: Graph, isBiDirectional: boolean = false) {
        this._sourceId = sourceID;
        this._targetId = targetID;
        this._isBidirectional = isBiDirectional;
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

        // avoid division by zero
        if (dx === 0 && dy === 0) return new Vec(target.pos.x, target.pos.y);

        // Scale factors along each axis
        const scaleX = halfWidth / Math.abs(dx);
        const scaleY = halfHeight / Math.abs(dy);

        const scale = Math.min(scaleX, scaleY);

        return new Vec(target.pos.x - dx * scale, target.pos.y - dy * scale);
    }

    /**
     * Draw an arrow from source to target vertex
     */
    drawArrow(ctx: CanvasRenderingContext2D, sourceVertex: Vertex, targetVertex: Vertex) {
        const source = sourceVertex.pos;
        // We draw to the box edge so arrow is not hidden
        const intersectTarget = this.getBoxIntersect(source, targetVertex);

        // Calculate direction vector to keep the arrow in correct orientation
        const dx = intersectTarget.x - source.x;
        const dy = intersectTarget.y - source.y;
        const angle = Math.atan2(dy, dx);

        // Calculate offset for bidirectional arrows so they dont overlap
        const offset = this.calculateBidirectionalOffset(dx, dy);

        const positions = this.calculateArrowPositions(source, intersectTarget, angle, offset);

        // Line
        ctx.beginPath();
        ctx.moveTo(positions.sourceX, positions.sourceY);
        ctx.lineTo(positions.endX, positions.endY);
        ctx.stroke();

        // Arrowhead
        this.drawArrowhead(ctx, positions.targetX, positions.targetY, angle);
    }

    /**
     * Calculate offset for bidirectional arrows
     */
    private calculateBidirectionalOffset(dx: number, dy: number): Vec {
        const offset = Edge.BIDIRECTIONAL_OFFSET;
        if (!this._isBidirectional) return new Vec(0, 0);

        const length = Math.sqrt(dx * dx + dy * dy);
        if (length === 0) return new Vec(0, 0);

        // Calculate perpendicular unit vector
        const perpX = -dy / length;
        const perpY = dx / length;

        // Apply offset
        return new Vec(perpX * offset, perpY * offset);
    }

    /**
     * Calculate all arrow positions with offset applied
     */
    private calculateArrowPositions(source: Vec, target: Vec, angle: number, offset: Vec) {
        // Move line endpoint back by headLength to leave room for arrowhead
        const lineEndX = target.x - Edge.ARROW_HEAD_SIZE * Math.cos(angle);
        const lineEndY = target.y - Edge.ARROW_HEAD_SIZE * Math.sin(angle);

        // Apply offset to all points
        return {
            sourceX: source.x + offset.x,
            sourceY: source.y + offset.y,
            targetX: target.x + offset.x,
            targetY: target.y + offset.y,
            endX: lineEndX + offset.x,
            endY: lineEndY + offset.y,
        };
    }

    /**
     * Draw the arrowhead at the specified position
     */
    private drawArrowhead(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number) {
        const headLength = Edge.ARROW_HEAD_SIZE;
        const arrowAngle = Edge.ARROW_HEAD_ANGLE;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - headLength * Math.cos(angle + arrowAngle), y - headLength * Math.sin(angle + arrowAngle));
        ctx.lineTo(x - headLength * Math.cos(angle - arrowAngle), y - headLength * Math.sin(angle - arrowAngle));
        ctx.closePath();
        ctx.fill();
    }
}

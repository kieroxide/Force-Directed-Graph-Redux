import type { Graph } from "./Graph.ts";
import type { Vertex } from "./Vertex.ts";
import { Vec } from "./Vec.ts";
import { RenderingUtility } from "../utility/RenderingUtility.ts";
import { GeometryUtility } from "../utility/GeometryUtility.ts";
import { FONT } from "../../constants/font.ts";
import { VertexUtility } from "../utility/VertexUtility.ts";
import { TextUtility } from "../utility/TextUtility.ts";

export class Edge {
    private static readonly LINE_SIZE = 4;
    private static readonly ARROW_HEAD_SIZE = 30;
    private static readonly ARROW_HEAD_ANGLE = Math.PI / 6;
    private static readonly BIDIRECTIONAL_OFFSET_SCALE = 20;

    private static readonly LABEL_DISTANCE_FROM_MIDPOINT = 20;
    private static readonly LABEL_PADDING = 40;
    private static readonly LABEL_MAX_FONT = 24;
    private static readonly LABEL_MIN_FONT = 12;

    private static readonly LABEL_COLOUR = "#2e2e2eff";

    private readonly _sourceId: string;
    private readonly _sourceRef: Vertex;

    private readonly _targetId: string;
    private readonly _targetRef: Vertex;

    private _isBidirectional: boolean;
    private _types: string[];
    edgeColour: string;

    constructor(sourceID: string, targetID: string, type: string, graph: Graph, isBiDirectional: boolean = false) {
        this._sourceId = sourceID;
        this._targetId = targetID;
        this._isBidirectional = isBiDirectional;
        this._types = [type];
        this.edgeColour = "#000000"; // Default colour
        this._sourceRef = graph.getVertex(sourceID);
        this._targetRef = graph.getVertex(targetID);

        if (!this._sourceRef || !this._targetRef) {
            throw new Error(`Invalid vertex IDs: source=${sourceID}, target=${targetID}`);
        }
    }

    get targetRef() {
        return this._targetRef;
    }

    get sourceRef() {
        return this._sourceRef;
    }

    set isBidirectional(isBidirectional: boolean) {
        this._isBidirectional = isBidirectional;
    }

    get mainType() {
        const MAIN_TYPE_INDEX = 0;
        return this.types[MAIN_TYPE_INDEX];
    }
    get types() {
        return this._types;
    }
    set types(type: string[]) {
        this._types = type;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.edgeColour || "#00000012";
        ctx.fillStyle = this.edgeColour;
        ctx.lineWidth = Edge.LINE_SIZE;
        this.drawArrow(ctx, this._sourceRef, this._targetRef);
        this.drawLabelText(ctx);
    }

    /**
     * Calculates and draws the edge's type property above/below the edge
     */
    drawLabelText(ctx: CanvasRenderingContext2D) {
        const source = this.sourceRef.pos;
        const target = this.targetRef.pos;

        // Ensures vertex box dimensions are correct in cache
        VertexUtility.ensureValidCache(ctx, this.sourceRef);
        VertexUtility.ensureValidCache(ctx, this.targetRef);

        // Gets the positions minus the box to avoid label being hidden by drawn box
        const sourceIntersect = GeometryUtility.getBoxIntersect(target, this.sourceRef);
        const targetIntersect = GeometryUtility.getBoxIntersect(source, this.targetRef);

        // Builds the label as multiple properties can be assigned to an edge
        let typeLabel = "";
        for (let i = 0; i < this._types.length; i++) {
            typeLabel += this._types[i];
            if (i != this._types.length - 1) {
                typeLabel += ", ";
            }
        }

        // Calculates the best font size for the edge based of vertex distance
        const padding = Edge.LABEL_PADDING;
        const distanceInbetween = GeometryUtility.distance(sourceIntersect, targetIntersect) - padding;
        const maxLabelWidth = distanceInbetween * 0.7;
        if (maxLabelWidth <= 0) return;

        const maxFont = Edge.LABEL_MAX_FONT;
        const minFont = Edge.LABEL_MIN_FONT;
        let fontSize = maxFont;
        while (fontSize > minFont) {
            ctx.font = `bold ${fontSize}px ${FONT.FAMILY}`;
            if (ctx.measureText(typeLabel).width <= maxLabelWidth) {
                break;
            }
            fontSize -= 1;
        }

        const labelMetrics = ctx.measureText(typeLabel);

        // If label is still too large, dont display it
        if (labelMetrics.width >= maxLabelWidth) {
            return;
        }

        // we want the midpoint of the source -> target
        const midpoint = GeometryUtility.getMidpoint(sourceIntersect, targetIntersect);

        // then we want the perpendicular angle + a static distance from midpoint
        let angle = GeometryUtility.lineAngle(source, target);
        const perpAngle = angle + Math.PI / 2;

        let distanceFromMidpoint = Edge.LABEL_DISTANCE_FROM_MIDPOINT + TextUtility.getTextHeight(labelMetrics) / 2;

        // Add extra offset if biDirectional
        if (this._isBidirectional) {
            distanceFromMidpoint += Edge.BIDIRECTIONAL_OFFSET_SCALE;
        }

        const textPos = new Vec(
            midpoint.x + distanceFromMidpoint * Math.cos(perpAngle),
            midpoint.y + distanceFromMidpoint * Math.sin(perpAngle)
        );

        // Detects if text is upside down and flips it
        if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
            angle += Math.PI;
        }

        // Minus the size of the arrowhead to avoid overlapping with arrowhead
        const dx = targetIntersect.x - source.x;
        const dy = targetIntersect.y - source.y;

        const arrowAngle = Math.atan2(dy, dx);
        const arrowLength = Edge.ARROW_HEAD_SIZE;
        const xArrowOffset = arrowLength * Math.cos(arrowAngle);
        const yArrowOffset = arrowLength * Math.sin(arrowAngle);

        textPos.x -= xArrowOffset;
        textPos.y -= yArrowOffset;

        // Draw text in same orientation of the edge
        ctx.save();
        ctx.translate(textPos.x, textPos.y);
        ctx.rotate(angle);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = Edge.LABEL_COLOUR;
        ctx.fillText(typeLabel, 0, 0);
        ctx.restore();
    }

    /**
     * Draw an arrow from source to target vertex
     */
    drawArrow(ctx: CanvasRenderingContext2D, sourceVertex: Vertex, targetVertex: Vertex) {
        const source = sourceVertex.pos;
        // We draw to the box edge so arrow is not hidden
        const intersectTarget = GeometryUtility.getBoxIntersect(source, targetVertex);

        // Calculate direction vector to keep the arrow in correct orientation

        const dx = intersectTarget.x - source.x;
        const dy = intersectTarget.y - source.y;
        const angle = Math.atan2(dy, dx);

        // Calculate offset for bidirectional arrows so they dont overlap
        let offset = new Vec(0, 0);
        if (this._isBidirectional) {
            offset = RenderingUtility.calculateBidirectionalOffset(dx, dy, Edge.BIDIRECTIONAL_OFFSET_SCALE);
        }

        const positions = RenderingUtility.calculateArrowPositions(
            source,
            intersectTarget,
            angle,
            offset,
            Edge.ARROW_HEAD_SIZE
        );

        // Line
        ctx.beginPath();
        ctx.moveTo(positions.sourceX, positions.sourceY);
        ctx.lineTo(positions.endX, positions.endY);
        ctx.stroke();

        // Arrowhead
        RenderingUtility.drawArrowhead(
            ctx,
            positions.targetX,
            positions.targetY,
            angle,
            Edge.ARROW_HEAD_SIZE,
            Edge.ARROW_HEAD_ANGLE
        );
    }
}

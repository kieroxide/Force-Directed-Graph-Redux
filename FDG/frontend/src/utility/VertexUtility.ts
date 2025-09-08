import { Vec } from "../graph/Vec";
import { Vertex } from "../graph/Vertex";
import { VERTEX_FONT } from "../../constants/font";
import { Camera } from "../classes/Camera";
import { CanvasUtility } from "./CanvasUtility";

export class VertexUtility {
    private static readonly BOX_PADDING = 15;

    private static readonly IMAGE_TEXT_GAP = 20;
    private static readonly IMAGE_SIZE_MULTIPLIER = 2.25;
    private static readonly MIN_IMAGE_SIZE = 40;

    private static readonly TYPE_FONT_SIZE_REDUCTION = 4;
    private static readonly MIN_TYPE_FONT_SIZE = 12;
    private static readonly TEXT_LINE_SPACING = 15;
    private static readonly TEXT_ONLY_BOX_EXTRA_HEIGHT = 80;

    

    /**
     * Checks if a point is within the vertex's boundary box
     */
    static pointInBoundary(point: Vec, ctx: CanvasRenderingContext2D, camera: Camera, vertex: Vertex): boolean {
        const boundaries = this.getBoundaries(ctx, vertex);
        const ws_point = camera.canvasToWorld(point);

        const check_x = boundaries.left <= ws_point.x && ws_point.x <= boundaries.right;
        const check_y = boundaries.top <= ws_point.y && ws_point.y <= boundaries.bottom;
        return check_x && check_y;
    }

    /**
     * Gets the boundary coordinates of the vertex's text box
     */
    static getBoundaries(ctx: CanvasRenderingContext2D, vertex: Vertex) {
        // Ensure vertex has calculated dimensions
        this.ensureValidCache(ctx, vertex);

        const _left = vertex.pos.x - vertex._cachedDimensions!.boxWidth / 2;
        const _right = vertex.pos.x + vertex._cachedDimensions!.boxWidth / 2;
        const _top = vertex.pos.y - vertex._cachedDimensions!.boxHeight / 2;
        const _bottom = vertex.pos.y + vertex._cachedDimensions!.boxHeight / 2;
        return { left: _left, right: _right, top: _top, bottom: _bottom };
    }

    /**
     * Returns all neighboring vertices connected by edges
     */
    static getNeighbours(vertex: Vertex): Set<Vertex> {
        let neighbours = new Set<Vertex>();
        for (const edge of vertex.connectedEdges) {
            neighbours.add(edge.targetRef);
            neighbours.add(edge.sourceRef);
        }
        return neighbours;
    }

    /**
     * Calculates the vertex's mass based on number of connections
     */
    static getOriginalMass(vertex: Vertex) {
        return vertex.connectedEdges.length;
    }

    /**
     *  Draws Vertex that only has text
     */
    static drawTextVertex(ctx: CanvasRenderingContext2D, vertex: Vertex) {
        const cache = vertex._cachedDimensions!;
       
        const lineHeight = cache.fontSize + VertexUtility.TEXT_LINE_SPACING;
        const labelY = vertex.pos.y - lineHeight / 2;
        const typeY = vertex.pos.y + lineHeight / 2;

        // Draw label text
        ctx.font = CanvasUtility.getFontString(VERTEX_FONT.FAMILY, cache.fontSize);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.fillText(vertex.label, vertex.pos.x, labelY);

        // Draw type text smaller
        const typeFontSize = Math.max(12, cache.fontSize - VertexUtility.TYPE_FONT_SIZE_REDUCTION);
        ctx.font = CanvasUtility.getFontString(VERTEX_FONT.FAMILY, typeFontSize);
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillText(vertex.type, vertex.pos.x, typeY);
    }

    /**
     *  Draws Vertex that has an image
     */
    static drawImageVertex(ctx: CanvasRenderingContext2D, vertex: Vertex) {
        const cache = vertex._cachedDimensions!;

        const imageX = vertex.pos.x - cache.boxWidth / 2 + cache.padding + cache.imgSize / 2;
        const imageY = vertex.pos.y;
        const textX = imageX + cache.imgSize / 2 + cache.gap;

        const lineHeight = cache.fontSize + VertexUtility.TEXT_LINE_SPACING;
        const labelY = vertex.pos.y - lineHeight / 2;
        const typeY = vertex.pos.y + lineHeight / 2;

        // Draw circular image
        ctx.save();
        ctx.beginPath();
        ctx.arc(imageX, imageY, cache.imgSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(
            vertex.img!,
            imageX - cache.imgSize / 2,
            imageY - cache.imgSize / 2,
            cache.imgSize,
            cache.imgSize
        );
        ctx.restore();

        // Draw image border
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.arc(imageX, imageY, cache.imgSize / 2, 0, Math.PI * 2);
        ctx.stroke();

        // Draw label text
        ctx.font = CanvasUtility.getFontString(VERTEX_FONT.FAMILY, cache.fontSize);
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.fillText(vertex.label, textX, labelY);

        // Draw type text in smaller font
        const typeFontSize = Math.max(12, cache.fontSize - VertexUtility.TYPE_FONT_SIZE_REDUCTION);
        ctx.font = CanvasUtility.getFontString(VERTEX_FONT.FAMILY, typeFontSize);
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillText(vertex.type, textX, typeY);
    }

    /**
     * **Calculates and caches vertex drawn dimensions
     */
    static calculateAndCacheDimensions(ctx: CanvasRenderingContext2D, vertex: Vertex, forceFontSize?: number) {
        const mass = this.getOriginalMass(vertex);
        const fontSize = forceFontSize || VERTEX_FONT.SIZE + mass * VERTEX_FONT.MASS_WEIGHT;
        const hasImage = (vertex.img && vertex.img.complete && vertex.img.naturalWidth > 0)!;

        // Measure text dimensions
        ctx.font = CanvasUtility.getFontString(VERTEX_FONT.FAMILY, fontSize);
        const labelMetrics = ctx.measureText(vertex.label);
        const labelWidth = labelMetrics.width;
        const labelHeight = labelMetrics.actualBoundingBoxAscent + labelMetrics.actualBoundingBoxDescent;

        const typeFontSize = Math.max(this.MIN_TYPE_FONT_SIZE, fontSize - this.TYPE_FONT_SIZE_REDUCTION);
        ctx.font = CanvasUtility.getFontString(VERTEX_FONT.FAMILY, typeFontSize);
        const typeMetrics = ctx.measureText(vertex.type);
        const typeWidth = typeMetrics.width;
        const typeHeight = typeMetrics.actualBoundingBoxAscent + typeMetrics.actualBoundingBoxDescent;

        const maxTextWidth = Math.max(labelWidth, typeWidth);
        const maxTextHeight = Math.max(labelHeight, typeHeight);

        // Calculate static layout dimensions
        let boxWidth: number, boxHeight: number, imgSize: number;

        if (hasImage) {
            // Profile card layout
            const totalTextHeight = labelHeight + typeHeight + this.TEXT_LINE_SPACING;
            imgSize = Math.max(this.MIN_IMAGE_SIZE, totalTextHeight * this.IMAGE_SIZE_MULTIPLIER);
            const contentWidth = imgSize + this.IMAGE_TEXT_GAP + maxTextWidth;
            const contentHeight = Math.max(imgSize, totalTextHeight);

            boxWidth = contentWidth + this.BOX_PADDING * 2;
            boxHeight = contentHeight + this.BOX_PADDING;
        } else {
            // Text-only layout
            imgSize = 0;
            boxWidth = maxTextWidth + this.BOX_PADDING * 2;
            boxHeight = labelHeight + typeHeight + this.BOX_PADDING + this.TEXT_ONLY_BOX_EXTRA_HEIGHT;
        }

        vertex._cachedDimensions = {
            // Text measurements
            labelWidth,
            labelHeight,
            typeWidth,
            typeHeight,
            maxTextWidth,
            maxTextHeight,

            // Layout measurements
            imgSize,
            boxWidth,
            boxHeight,

            // Spacing constants
            padding: this.BOX_PADDING,
            gap: this.IMAGE_TEXT_GAP,

            // Cache keys
            fontSize,
            label: vertex.label,
            type: vertex.type,
            hasImage,
        };
    }

    /**
     *  Checks if Cache is valid, recalculates if needed
     */
    static ensureValidCache(ctx: CanvasRenderingContext2D, vertex: Vertex) {
        const mass = this.getOriginalMass(vertex);
        const fontSize = VERTEX_FONT.SIZE + mass * VERTEX_FONT.MASS_WEIGHT;
        const hasImage = vertex.img && vertex.img.complete && vertex.img.naturalWidth > 0;

        const cache = vertex._cachedDimensions;

        if (
            !cache ||
            cache.fontSize !== fontSize ||
            cache.label !== vertex.label ||
            cache.type !== vertex.type ||
            cache.hasImage !== hasImage
        ) {
            this.calculateAndCacheDimensions(ctx, vertex, fontSize);
        }

        return vertex._cachedDimensions;
    }
}

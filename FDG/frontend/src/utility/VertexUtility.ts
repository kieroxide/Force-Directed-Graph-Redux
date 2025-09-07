import { Vec } from "../graph/Vec";
import { Vertex } from "../graph/Vertex";
import { VERTEX_FONT } from "../../constants/font";
import { Camera } from "../classes/Camera";

export class VertexUtility {
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
        const _left = vertex.pos.x - this.getBoxWidth(ctx, vertex) / 2;
        const _right = vertex.pos.x + this.getBoxWidth(ctx, vertex) / 2;
        const _top = vertex.pos.y - this.getBoxHeight(vertex) / 2;
        const _bottom = vertex.pos.y + this.getBoxHeight(vertex) / 2;
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
        // Made into function incase I add more factors for mass
        return vertex.connectedEdges.length;
    }

    /**
     * Calculates the width of the vertex's text box including padding
     */
    static getBoxWidth(ctx: CanvasRenderingContext2D, vertex: Vertex, force: boolean = false) {
        let width = this.getTextWidth(ctx, vertex, force) + vertex.TEXT_BOX.PADDING_WIDTH;
        return width;
    }

    /**
     * Calculates the height of the vertex's text box based on font size and mass
     */
    static getBoxHeight(vertex: Vertex) {
        const massFontSize =
            VERTEX_FONT.SIZE + this.getOriginalMass(vertex) * VERTEX_FONT.MASS_WEIGHT;

        return massFontSize + vertex.TEXT_BOX.PADDING_HEIGHT / 2;
    }

    /**
     * Measures and caches the pixel width of the vertex's text
     */
    static getTextWidth(ctx: CanvasRenderingContext2D, vertex: Vertex, force: boolean = false) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = VERTEX_FONT.FULL;
        if (force || vertex.textWidth === undefined) {
            vertex.textWidth = ctx.measureText(vertex.label).width;
        }
        return vertex.textWidth;
    }
}

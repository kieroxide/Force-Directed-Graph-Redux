import { Vertex } from "./Vertex";
import { Edge } from "./Edge";

export class Graph {
    ctx: CanvasRenderingContext2D;
    vertices: Record<string, Vertex>;
    edges: Array<Edge>;
    canvas: HTMLCanvasElement;

    constructor(
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
    ) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.vertices = {};
        this.edges = [];
    }

    simulate() {
        /** Main physics Loop: Simulates FDG physics */
        this.update();
    }

    update() {
        // Updates position using movement Vectors 
        for (const vertex of Object.values(this.vertices)) {
            vertex.update();
        }
    }

    draw() {
        this.edges.forEach((edge) => edge.draw(this.ctx));
        for (const vertex of Object.values(this.vertices)) {
            vertex.draw(this.ctx);
        }
    }
}

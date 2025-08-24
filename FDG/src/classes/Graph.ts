import { Vertex } from "./Vertex";
import { Edge } from "./Edge";
import { BACKGROUND_COLOUR } from "../main/main";

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
        /** Main Draw Loop:
         *      -Clears Background, Simulates FDG physics, Draws Vertices and Edges
         *  RAF function calls the method again at the speed of monitor refresh rate
         */
        this.ctx.fillStyle = BACKGROUND_COLOUR;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.update();
        this.draw();
        requestAnimationFrame(this.simulate.bind(this));
    }

    update() {
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

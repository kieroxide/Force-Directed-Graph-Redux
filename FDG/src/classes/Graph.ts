import { Vertex } from "./Vertex";
import { Edge } from "./Edge";
import { linearRepulsion } from "../forces/Repulsion";
import { springAttraction } from "../forces/Attraction";
import { bfsComponents, circlePoints, randomNiceColor } from "../utility/utils";
import { RENDERING } from "../constants";

export class Graph {
    ctx: CanvasRenderingContext2D;
    vertices: Record<string, Vertex>;
    edges: Array<Edge>;
    canvas: HTMLCanvasElement;

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.vertices = {};
        this.edges = [];
    }
    simulate() {
        /** Main physics Loop: Simulates FDG physics */
        linearRepulsion(this.ctx, this.getVertices());
        springAttraction(this.ctx, this.edges);
        this.update();
    }

    initVerticesPos() {
        const components = bfsComponents(this.getVertices());

        // Values for spacing disconnected components
        let offsetX = 0;

        for (const [_, layers] of components.entries()) {
            const centerX = offsetX + this.canvas.width / 2;
            const centerY = this.canvas.height / 2;

            // Iterate over each bfs layer
            for (const [level, nodes] of layers.entries()) {
                const radius =
                    (level + 1) * RENDERING.INIT_SETTINGS.INITIAL_RADIUS; // add 1 to avoid * by 0

                const positions = circlePoints(
                    centerX,
                    centerY,
                    radius,
                    nodes.length
                );

                for (let i = 0; i < nodes.length; i++) {
                    nodes[i].pos = positions[i];
                }
            }

            offsetX += 700; // shift next component to the right
        }
    }

    initVertexColour() {
        /** Assigns unique random colours to each vertex type */
        let colours = new Map<string, string>(); // type->colour

        // Iterates and assigns each vertex type a unique colour
        for (const vertex of this.getVertices()) {
            if (colours.has(vertex.type)) {
                vertex.labelColour = colours.get(vertex.type);
            } else {
                // Avoids directly equal colours
                do {
                    var colour = randomNiceColor();
                } while (new Set(colours.values()).has(colour));
                colours.set(vertex.type, colour);
                vertex.labelColour = colour;
            }
        }
    }
    initEdgeColour() {
        /** Assigns unique random colours to each edge type */
        let colours = new Map<string, string>(); // type->colour

        // Iterates and assigns each vertex type a unique colour
        for (const edge of this.edges) {
            if (colours.has(edge.type)) {
                edge.lineColour = colours.get(edge.type);
            } else {
                // Avoids directly equal colours
                do {
                    var colour = randomNiceColor();
                } while (new Set(colours.values()).has(colour));
                colours.set(edge.type, colour);
                edge.lineColour = colour;
            }
        }
    }

    getVertices(): Array<Vertex> {
        return Object.values(this.vertices);
    }

    update() {
        // Updates position using movement Vectors
        for (const vertex of this.getVertices()) {
            vertex.update();
        }
    }

    draw() {
        this.edges.forEach((edge) => edge.draw(this.ctx));
        for (const vertex of this.getVertices()) {
            vertex.draw(this.ctx);
        }
    }
}

import { Vertex } from "./Vertex";
import { Edge } from "./Edge";
import { repulsion } from "../forces/Repulsion";
import { centerAttraction, springAttraction } from "../forces/Attraction";
import { bfsComponents, circlePoints, randomNiceColor } from "../utility/utils";
import { RENDERING } from "../constants";
import { Vec } from "./Vec";

export class Graph {
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    vertices: Record<string, Vertex>;
    edges: Array<Edge>;
    component_origins: Set<Vertex>;
    selectedVertex?: Vertex;

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.vertices = {};
        this.edges = [];
        this.component_origins = new Set();
    }
    simulate() {
        /** Main physics Loop: Simulates FDG physics */
        repulsion(this.ctx, this.getVertices());
        springAttraction(this.ctx, this.edges);
        centerAttraction(this.component_origins, this.canvas)
        this.update();
    }

    setSelectedVertex(vertex: Vertex) {
        vertex.mass = Infinity; // Prevents Movement
        vertex.vector = new Vec(0, 0); // Kills velocity
        this.selectedVertex = vertex;
    }

    resetSelectedVertex() {
        this.selectedVertex!.mass = this.selectedVertex!.getOriginalMass();
        this.selectedVertex = undefined;
    }

    initVerticesPos() {
        const components = bfsComponents(this.getVertices());
        const numComponents = [...components.keys()].length;
        components.forEach(component => {
            this.component_origins.add(component.get(0)![0]);
        });
        // Gets comp origin positions to set them in a circular pattern around the center of canvas
        const comp_positions = circlePoints(
            this.canvas.width / 2,
            this.canvas.height / 2,
            200, // TODO: Radius calc function
            numComponents
        );

        // Values for spacing disconnected components
        for (const [key, layers] of components.entries()) {
            const comp_pos = comp_positions[key];
            const centerX = comp_pos!.x;
            const centerY = comp_pos!.y;

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

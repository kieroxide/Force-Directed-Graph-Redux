import { Vertex } from "./Vertex.ts";
import { Edge } from "./Edge";
import { Vec } from "./Vec";
import { Repulsion } from "../utility/Forces/Repulsion";
import { Attraction } from "../utility/Forces/Attraction";
import { GeometryUtility } from "../utility/GeometryUtility";
import { CanvasUtility } from "../utility/CanvasUtility";
import { RENDERING } from "../../constants";

export class Graph {
    private _vertexColours = new Map<string, string>();
    private _edgeColours = new Map<string, string>();
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;

    vertices: Record<string, Vertex>;
    edges: Array<Edge>;
    component_origins: Set<Vertex>;
    selectedVertex?: Vertex;
    lastClickedVertex?: Vertex;

    /** Creates a new graph with rendering context and canvas */
    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.vertices = {};
        this.edges = [];
        this.component_origins = new Set();
    }

    /** Gets vertex by ID */
    getVertex(id: string) {
        return this.vertices[id];
    }

    /** Checks if edge already exists between two vertices */
    private edgeExists(sourceId: string, targetId: string, property: string): boolean {
        return this.edges.some(
            (edge) =>
                (edge.sourceRef.id === sourceId && edge.targetRef.id === targetId && edge.type === property) ||
                (edge.sourceRef.id === targetId && edge.targetRef.id === sourceId && edge.type === property)
        );
    }

    /** Adds edge between vertices if it doesn't already exist */
    addEdge(sourceId: string, targetId: string, property: string): boolean {
        // Check if edge already exists
        if (this.edgeExists(sourceId, targetId, property)) {
            console.log(`Edge already exists: ${sourceId} -> ${targetId} (${property})`);
            return false;
        }

        const sourceVertex = this.getVertex(sourceId);
        const targetVertex = this.getVertex(targetId);

        if (!sourceVertex || !targetVertex) {
            console.error(`Cannot create edge: vertex not found`);
            return false;
        }
        const edge = new Edge(sourceId, targetId, property, this);
        sourceVertex.addNeighbour(edge);
        targetVertex.addNeighbour(edge);
        this.edges.push(edge);
        return true;
    }

    /** Runs physics simulation step (forces + movement) */
    simulate() {
        Repulsion.repulsion(this.ctx, this.getVertices());
        Attraction.springAttraction(this.ctx, this.edges);
        Attraction.centerAttraction(this.component_origins, this.canvas);
        this.update();
    }

    /** Sets vertex as selected and stops its movement */
    setSelectedVertex(vertex: Vertex) {
        vertex.vector = new Vec(0, 0); // Kills velocity
        vertex.selected = true;
        this.selectedVertex = vertex;
        this.lastClickedVertex = vertex;
    }

    /** Deselects currently selected vertex */
    resetSelectedVertex() {
        if (this.selectedVertex === undefined) {
            return;
        }
        this.selectedVertex.selected = false;
        this.selectedVertex = undefined;
    }

    /** Positions new vertices in circle around existing graph center */
    appendVerticesPos(new_vertices: Record<string, Vertex>) {
        // Gets all current Vertices midpoint
        let midpointsum = new Vec(0, 0);
        let numOfOldVertices = 0;
        for (const vertex of this.getVertices()) {
            if (!new_vertices[vertex.id]) {
                midpointsum = Vec.add(midpointsum, vertex.pos);
                numOfOldVertices++;
            }
        }
        let new_vertices_vals = Object.values(new_vertices);
        let midpoint = Vec.divideXY(midpointsum, numOfOldVertices);
        // Circles the new Vertices around the midpoint
        let positions = GeometryUtility.circlePoints(midpoint.x, midpoint.y, 200, new_vertices_vals.length);
        for (let i = 0; i < new_vertices_vals.length; i++) {
            new_vertices_vals[i].pos.x = positions[i].x;
            new_vertices_vals[i].pos.y = positions[i].y;
        }
    }

    /** Sets initial positions for all vertices in circular layouts */
    initVerticesPos(vertices = this.getVertices()) {
        const components = GeometryUtility.bfsComponents(vertices);
        const numComponents = [...components.keys()].length;
        components.forEach((component: Map<number, Vertex[]>) => {
            this.component_origins.add(component.get(0)![0]);
        });
        // Gets comp origin positions to set them in a circular pattern around the center of canvas
        const comp_positions = GeometryUtility.circlePoints(
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
                const radius = (level + 1) * RENDERING.INIT_SETTINGS.INITIAL_RADIUS; // add 1 to avoid * by 0

                const positions = GeometryUtility.circlePoints(centerX, centerY, radius, nodes.length);

                for (let i = 0; i < nodes.length; i++) {
                    nodes[i].pos.x = positions[i].x;
                    nodes[i].pos.y = positions[i].y;
                }
            }
        }
    }

    /** Assigns unique colors to vertex types */
    initVertexColour() {
        for (const vertex of this.getVertices()) {
            if (this._vertexColours.has(vertex.type)) {
                vertex.labelColour = this._vertexColours.get(vertex.type)!;
            } else {
                let colour: string;
                do {
                    colour = CanvasUtility.randomNiceColor();
                } while (new Set(this._vertexColours.values()).has(colour));
                this._vertexColours.set(vertex.type, colour);
                vertex.labelColour = colour;
            }
        }
    }

    /** Assigns unique colors to edge types */
    initEdgeColour() {
        for (const edge of this.edges) {
            if (this._edgeColours.has(edge.type)) {
                edge.lineColour = this._edgeColours.get(edge.type)!;
            } else {
                let colour: string;
                do {
                    colour = CanvasUtility.randomNiceColor();
                } while (new Set(this._vertexColours.values()).has(colour));
                this._edgeColours.set(edge.type, colour);
                edge.lineColour = colour;
            }
        }
    }

    /** Returns all vertices as array */
    getVertices(): Array<Vertex> {
        return Object.values(this.vertices);
    }

    /** Updates all vertex positions */
    update() {
        for (const vertex of this.getVertices()) {
            vertex.update();
        }
    }

    /** Renders all edges and vertices to canvas */
    draw() {
        this.edges.forEach((edge) => edge.draw(this.ctx));
        for (const vertex of this.getVertices()) {
            vertex.draw(this.ctx);
        }
    }

    /** Clears all graph data */
    clear() {
        this.vertices = {};
        this.edges = [];
        this.component_origins = new Set();
        this.selectedVertex = undefined;
    }
}

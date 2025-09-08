import { Vertex } from "./Vertex.ts";
import { Edge } from "./Edge";
import { Vec } from "./Vec";
import { Repulsion } from "../utility/Forces/Repulsion";
import { Attraction } from "../utility/Forces/Attraction";
import { GeometryUtility } from "../utility/GeometryUtility";
import { CanvasUtility } from "../utility/CanvasUtility";

export class Graph {
    private static readonly INITIAL_RADIUS = 100;
    
    private readonly _vertexColours = new Map<string, string>();
    private readonly _edgeColours = new Map<string, string>();
    private readonly _ctx: CanvasRenderingContext2D;
    private readonly _canvas: HTMLCanvasElement;

    private _vertices: Record<string, Vertex>;
    get vertices() {
        return this._vertices;
    }
    private _edges: Array<Edge>;
    get edges() {
        return this._edges;
    }
    private _componentOrigins: Set<Vertex>;

    private _selectedVertex?: Vertex;
    get selectedVertex() {
        return this._selectedVertex;
    }

    private _lastClickedVertex?: Vertex;
    get lastClickedVertex() {
        return this._lastClickedVertex;
    }

    /** Creates a new graph with rendering context and canvas */
    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this._ctx = ctx;
        this._canvas = canvas;
        this._vertices = {};
        this._edges = [];
        this._componentOrigins = new Set();
    }

    /** Gets vertex by ID */
    getVertex(id: string) {
        return this._vertices[id];
    }

    /** Checks if edge already exists between two vertices */
    private edgeExists(sourceId: string, targetId: string, property: string): boolean {
        return this._edges.some(
            (edge) =>
                (edge.sourceRef.id === sourceId && edge.targetRef.id === targetId && edge.type === property) ||
                (edge.sourceRef.id === targetId && edge.targetRef.id === sourceId && edge.type === property)
        );
    }

    /** Adds edge between vertices if it doesn't already exist */
    addEdge(sourceId: string, targetId: string, property: string): boolean {
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

        sourceVertex.connectedEdges.push(edge);
        targetVertex.connectedEdges.push(edge);
        this._edges.push(edge);

        return true;
    }

    /** Runs physics simulation step (forces + movement) */
    simulate() {
        Repulsion.repulsion(this.getVertices());
        Attraction.springAttraction(this._edges);
        Attraction.centerAttraction(this._componentOrigins, this._canvas);
        this.update();
    }

    /** Sets vertex as selected and stops its movement */
    setSelectedVertex(vertex: Vertex) {
        vertex.killVelocity();
        vertex.selected = true;
        this._selectedVertex = vertex;
        this._lastClickedVertex = vertex;
    }

    /** Deselects currently selected vertex */
    resetSelectedVertex() {
        if (this.selectedVertex === undefined) {
            return;
        }
        this.selectedVertex.selected = false;
        this._selectedVertex = undefined;
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
            this._componentOrigins.add(component.get(0)![0]);
        });
        // Gets comp origin positions to set them in a circular pattern around the center of canvas
        const comp_positions = GeometryUtility.circlePoints(
            this._canvas.width / 2,
            this._canvas.height / 2,
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
                const radius = (level + 1) * Graph.INITIAL_RADIUS; // add 1 to avoid * by 0

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
        for (const edge of this._edges) {
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
        return Object.values(this._vertices);
    }

    /** Updates all vertex positions */
    update() {
        for (const vertex of this.getVertices()) {
            vertex.update();
        }
    }

    /** Renders all edges and vertices to canvas */
    draw() {
        this._edges.forEach((edge) => edge.draw(this._ctx));
        for (const vertex of this.getVertices()) {
            vertex.draw(this._ctx);
        }
    }

    /** Clears all graph data */
    clear() {
        this._vertices = {};
        this._edges = [];
        this._componentOrigins = new Set();
        this._selectedVertex = undefined;
    }
}

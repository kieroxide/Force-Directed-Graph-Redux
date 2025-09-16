import { Vertex } from "./Vertex.ts";
import { Edge } from "./Edge";
import { Vec } from "./Vec";
import { Repulsion } from "../utility/Forces/Repulsion";
import { Attraction } from "../utility/Forces/Attraction";
import { GeometryUtility } from "../utility/GeometryUtility";
import { CanvasUtility } from "../utility/CanvasUtility";

export class Graph {
    private static readonly INITIAL_RADIUS = 100;

    private readonly _objectColours = new Map<string, string>();
    private readonly _ctx: CanvasRenderingContext2D;
    private readonly _canvas: HTMLCanvasElement;

    private _vertices: Record<string, Vertex>;
    private _edges: Array<Edge>;
    private _componentOrigins: Set<Vertex>;
    private _selectedVertex?: Vertex;
    private _lastClickedVertex?: Vertex;

    /** Creates a new graph with rendering context and canvas */
    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this._ctx = ctx;
        this._canvas = canvas;
        this._vertices = {};
        this._edges = [];
        this._componentOrigins = new Set();
    }

    get vertices() {
        return this._vertices;
    }
    get edges() {
        return this._edges;
    }

    get selectedVertex() {
        return this._selectedVertex;
    }

    get lastClickedVertex() {
        return this._lastClickedVertex;
    }

    /** Gets vertex by ID */
    getVertex(id: string) {
        return this._vertices[id];
    }

    /** Checks if edge already exists between two vertices */
    private edgeExists(sourceId: string, targetId: string, property: string): boolean {
        for (const edge of this.edges) {
            if (edge.sourceRef.id === sourceId && edge.targetRef.id === targetId) {
                for (const type of edge.types) {
                    if (property === type) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /** Checks if edge already exists between two vertices with different property*/
    private edgeExistsDifferentProperty(sourceId: string, targetId: string, property: string): boolean {
        for (const edge of this._edges) {
            const sameEdge = edge.sourceRef.id === sourceId && edge.targetRef.id === targetId;
            // Checks if the property is a new property
            if (sameEdge) {
                const types = edge.types;
                for (const type of types) {
                    if (type === property) {
                        return false;
                    }
                }
                edge.types.push(property);
                return true;
            }
        }
        return false;
    }

    /** Checks if edge already exists in opposite direction */
    private biDirectional(sourceId: string, targetId: string): Edge | undefined {
        for (const edge of this.edges) {
            if (edge.targetRef.id === sourceId && edge.sourceRef.id === targetId) {
                return edge;
            }
        }
        return undefined;
    }

    /** Adds edge between vertices if it doesn't already exist */
    addEdge(sourceId: string, targetId: string, property: string): boolean {
        // First check if exact same edge exists (same source, target, property)
        if (this.edgeExists(sourceId, targetId, property)) {
            return false; // Skip if exact duplicate
        }

        // Appends extra property to same edge if exists
        if (this.edgeExistsDifferentProperty(sourceId, targetId, property)) {
            return false;
        }

        const sourceVertex = this.getVertex(sourceId);
        const targetVertex = this.getVertex(targetId);

        if (!sourceVertex || !targetVertex) {
            console.error(`Cannot create edge: vertex not found`);
            return false;
        }

        // Checks and deals with bidirectional arrows
        const oppositeDirectionalEdge = this.biDirectional(sourceId, targetId);

        let isBiDirectional = false;
        if (oppositeDirectionalEdge) {
            oppositeDirectionalEdge.isBidirectional = true;
            isBiDirectional = true;
        }

        const edge = new Edge(sourceId, targetId, property, this, isBiDirectional);

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

        let midpoint;
        if (numOfOldVertices === 0) {
            midpoint = new Vec(this._canvas.width / 2, this._canvas.height / 2);
        } else {
            midpoint = Vec.divideXY(midpointsum, numOfOldVertices);
        }

        let new_vertices_vals = Object.values(new_vertices);
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
    /** Assigns unique colors to any object type */
    private assignUniqueColours<T>(
        items: Iterable<T>,
        getType: (item: T) => string,
        setColour: (item: T, colour: string) => void
    ) {
        for (const item of items) {
            const key = getType(item);
            if (this._objectColours.has(key)) {
                setColour(item, this._objectColours.get(key)!);
            } else {
                let colour: string;
                const usedColours = new Set(this._objectColours.values());
                do {
                    colour = CanvasUtility.randomNiceColor();
                } while (usedColours.has(colour));

                this._objectColours.set(key, colour);
                setColour(item, colour);
            }
        }
    }

    /** Assigns unique colors to vertex types */
    initVertexColour() {
        CanvasUtility.assignUniqueColours(
            this.getVertices(),
            this._objectColours,
            (v: Vertex) => v.type,
            (v, c) => (v.labelColour = c)
        );
    }

    /** Assigns unique colors to edge types */
    initEdgeColour() {
        CanvasUtility.assignUniqueColours(
            this._edges,
            this._objectColours,
            (v: Edge) => v.mainType,
            (v, c) => (v.edgeColour = c)
        );
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
        this._lastClickedVertex = undefined;
    }
}

import { Graph } from "../graph/Graph";
import { NetworkUtility } from "../utility/NetworkUtility";
import { Vertex } from "../graph/Vertex";

interface EntityData {
    label: string;
    type: string;
    image: string;
}

interface BackendResponse {
    status: string;
    data: {
        entities: Record<string, EntityData>;
        properties: Record<string, string>;
        relations: Record<string, Record<string, string[]>>; // sourceId -> propertyId -> [targetIds]
    };
}

export class GraphManager {
    private readonly _graph: Graph;
    get graph() {
        return this._graph;
    }

    private readonly _ctx: CanvasRenderingContext2D;
    get ctx(): CanvasRenderingContext2D {
        return this._ctx;
    }
    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this._ctx = ctx;
        this._graph = new Graph(ctx, canvas);
    }

    /**
     * Loads graph data from server and updates visualization
     */
    async fetchRelations(
        entityId: string | undefined,
        depth: number,
        relationLimit: number,
        append = false
    ): Promise<Graph> {
        try {
            if (!entityId) {
                return this._graph; // nothing to load
            }

            const backendResp: BackendResponse = await NetworkUtility.fetchGraphData(entityId, depth, relationLimit);
            this.parseAndAddToGraph(backendResp.data, append);
            return this._graph;
        } catch (error) {
            console.error("Error loading graph:", error);
            throw error;
        }
    }

    /**
     * Parses API response and adds entities/relations to the graph
     */
    private parseAndAddToGraph(data: BackendResponse["data"], append = false) {
        // Track existing vertices to compute new ones when appending
        const preExistingIds = new Set(Object.keys(this._graph.vertices));

        if (!append) {
            this._graph.clear();
        }

        // Add / merge vertices
        for (const [vertexId, entity] of Object.entries(data.entities)) {
            if (!this._graph.vertices[vertexId]) {
                this._graph.vertices[vertexId] = new Vertex(vertexId, entity.label, entity.type, entity.image, this._ctx);
            }
        }

        // Build edges from sourceId -> propertyId -> [targetIds]
        for (const [sourceId, propMap] of Object.entries(data.relations)) {
            for (const [propertyId, targetIds] of Object.entries(propMap)) {
                const propertyLabel = data.properties[propertyId] || propertyId; // fallback to ID

                for (const targetId of targetIds) {
                    const sourceVertex = this._graph.vertices[sourceId];
                    const targetVertex = this._graph.vertices[targetId];
                    if (!sourceVertex || !targetVertex) continue;
                    this._graph.addEdge(sourceId, targetId, propertyLabel);
                }
            }
        }

        // Positioning
        if (append) {
            const newVertices: Record<string, Vertex> = {};
            for (const id of Object.keys(this._graph.vertices)) {
                if (!preExistingIds.has(id)) {
                    newVertices[id] = this._graph.vertices[id];
                }
            }
            if (Object.keys(newVertices).length > 0) {
                this._graph.appendVerticesPos(newVertices);
            }
        } else {
            this._graph.initVerticesPos();
        }
        this._graph.initVertexColour();
        this._graph.initEdgeColour();
    }

    /**
     * Expands graph by fetching related entities for a vertex and appending to graph
     */
    async expandFromVertex(vertexId: string, depth: number, relationLimit: number = 5): Promise<Graph> {
        try {
            const backendResp: BackendResponse = await NetworkUtility.fetchGraphData(vertexId, depth, relationLimit);
            const append = true;
            this.parseAndAddToGraph(backendResp.data, append);
            return this._graph;
        } catch (error) {
            console.error("Error expanding graph:", error);
            throw error;
        }
    }

    /**
     * Clears the current graph
     */
    clearGraph(): void {
        this._graph.clear();
    }

    /**
     * Runs physics simulation step
     */
    simulate(): void {
        this._graph.simulate();
    }

    /**
     * Sets the selected vertex
     */
    setSelectedVertex(vertexId: string): void {
        const vertex = this._graph.getVertex(vertexId);
        if (vertex) {
            this._graph.setSelectedVertex(vertex);
        }
    }

    /**
     * Resets vertex selection
     */
    resetSelection(): void {
        this._graph.resetSelectedVertex();
    }

    /**
     * Gets all vertices in the graph
     */
    getVertices(): Record<string, any> {
        return this._graph.vertices;
    }

    /**
     * Gets all edges in the graph
     */
    getEdges(): Array<any> {
        return this._graph.edges;
    }

    /**
     * Checks if graph has any data
     */
    isEmpty(): boolean {
        return Object.keys(this._graph.vertices).length === 0;
    }
}

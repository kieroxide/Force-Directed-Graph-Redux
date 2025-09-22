import { Graph } from "../graph/Graph";
import { NetworkUtility } from "../utility/NetworkUtility";
import { Vertex } from "../graph/Vertex";
import type { Vec } from "../graph/Vec";
import { MathUtility } from "../utility/MathUtility";

interface EntityData {
    label: string;
    type: string;
    image: string;
    wikipedia: string;
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
    private readonly _ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this._ctx = ctx;
        this._graph = new Graph(ctx, canvas);
    }

    get graph() {
        return this._graph;
    }

    get ctx(): CanvasRenderingContext2D {
        return this._ctx;
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
    private parseAndAddToGraph(data: BackendResponse["data"], append = false, midpoint: Vec | undefined = undefined) {
        // Track existing vertices to compute new ones when appending
        const preExistingIds = new Set(Object.keys(this._graph.vertices));

        if (!append) {
            this._graph.clear();
        }

        // Add / merge vertices
        for (const [vertexId, entity] of Object.entries(data.entities)) {
            if (!this._graph.vertices[vertexId]) {
                this._graph.vertices[vertexId] = new Vertex(
                    vertexId,
                    entity.label,
                    entity.type,
                    entity.image,
                    entity.wikipedia,
                    this._ctx
                );
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
                this._graph.appendVerticesPos(newVertices, midpoint);
            }
        } else {
            this._graph.initVerticesPos();
        }
        this._graph.initVertexColour();
        this._graph.initEdgeColour();
    }

    /**
     * Expands all vertices in depth frontier up to relationGoal
     */
    async expandVertex(vertexToExpand: Vertex, graphManager: GraphManager, depth: number, relationGoal: number) {
        let expandedVertices = new Set<Vertex>();
        for (let currentDepth = 1; currentDepth < depth + 1; currentDepth++) {
            const depthSet = MathUtility.depthSearch(vertexToExpand, currentDepth);
            const currentFrontier = MathUtility.difference(depthSet, expandedVertices);

            for (const vertex of currentFrontier) {
                await graphManager.expandTillLimit(vertex, relationGoal);
                expandedVertices.add(vertex);
            }
        }
    }
    
    /**
     * Expands graph by fetching related entities for a vertex and appending to graph
     */
    private async appendVertexExpansion(vertexId: string, depth: number, relationLimit: number = 5): Promise<Graph> {
        try {
            const backendResp: BackendResponse = await NetworkUtility.fetchGraphData(vertexId, depth, relationLimit);
            const append = true;
            const vertex = this._graph.getVertex(vertexId);
            this.parseAndAddToGraph(backendResp.data, append, vertex.pos);
            return this._graph;
        } catch (error) {
            console.error("Error expanding graph:", error);
            throw error;
        }
    }

    /**
     * Expands a vertex until it reaches the entityGoal number of edges
     */
    private async expandTillLimit(vertex: Vertex, entityGoal: number) {
        vertex.expanding = true;
        let attempts = 0;
        let expandedRelationCount = 0;
        while (vertex.connectedEdges.length < entityGoal) {
            expandedRelationCount++;
            let numBeforeExpansion = vertex.connectedEdges.length;

            const depth = 1;
            await this.appendVertexExpansion(vertex.id, depth, entityGoal + expandedRelationCount);
            if (numBeforeExpansion === vertex.connectedEdges.length) {
                attempts += 1;
            }
            if (attempts === 10) {
                break;
            }
        }
        vertex.expanding = false;
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

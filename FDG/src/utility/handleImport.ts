import type { ObjGraphData } from "../objects/importedGraph";
import { Vertex } from "../classes/Vertex";
import { Graph } from "../classes/Graph";
import { Edge } from "../classes/Edge";

/**
 * Takes graph data in my custom format and instances the objects for the graph
 * @param graphData
 */
export function generate_graph_from_json(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, graphData: ObjGraphData) {
    let graph = new Graph(ctx, canvas);
    // Creates Vertex instances
    for (const [nodeName, nodeData] of Object.entries(graphData.nodes)) {
        // Some Vertex's are not games so they will not have a release date
        const releaseDate = nodeData.releaseDate ?? undefined;
        graph.vertices[nodeName] = new Vertex(
            nodeName,
            nodeData.type,
            releaseDate
        );
    }

    // Creates Edge instances
    for (const edgeData of graphData.edges) {
        const source = graph.vertices[edgeData.source];
        const target = graph.vertices[edgeData.target];
        // This if ensures the node is in the vertices array
        if (source && target) {
            graph.edges.push(new Edge(source, target, edgeData.type));
        }
    }
    return graph;
}

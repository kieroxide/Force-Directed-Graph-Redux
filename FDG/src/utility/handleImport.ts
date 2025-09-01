import { Vertex } from "../classes/Vertex";
import { Graph } from "../classes/Graph";
import { Edge } from "../classes/Edge";
import ENTITIES from "../../data/entities.json";
import RELATIONS from "../../data/relations.json";
import PROPERTIES from "../../data/properties.json";
import type { EntityMap, PropertyMap, RelationshipsMap } from "../objects/importedGraph";

/**
 * Takes graph data in my custom format and instances the objects for the graph
 * @param ctx - Canvas rendering context
 * @param canvas - HTML canvas element
 */
export function generateGraphFromJson(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
) {
    const entities: EntityMap = ENTITIES
    const relations: RelationshipsMap = RELATIONS
    const properties: PropertyMap = PROPERTIES
    let graph = new Graph(ctx, canvas);

    for (const [vertexID, vertexLabel] of Object.entries(entities)) {
        graph.vertices[vertexID] = new Vertex(vertexID, vertexLabel);
    }

    for (const [sourceId, propMap] of Object.entries(relations)) {
        for (const [propertyId, targetIds] of Object.entries(propMap)) {
            for (const targetId of targetIds) {
                graph.edges.push(new Edge(sourceId, targetId, properties[propertyId], graph));
            }
        }
    }
    return graph;
}

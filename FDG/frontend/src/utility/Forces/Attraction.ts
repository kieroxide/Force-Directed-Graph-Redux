import { Vertex } from "../../graph/Vertex";
import { Vec } from "../../graph/Vec";
import { Edge } from "../../graph/Edge";
import { VertexUtility } from "../VertexUtility";

export class Attraction {
    private static readonly SPRING: 0.025;
    private static readonly CENTRAL_SPRING: 0.075;
    private static readonly REST_LENGTH: 50;

    static centerAttraction(origins: Set<Vertex>, canvas: HTMLCanvasElement) {
        const canvasCenter = new Vec(canvas.width / 2, canvas.height / 2);

        origins.forEach((origin) => {
            if (origin.selected) return;
            const dx = canvasCenter.x - origin.pos.x;
            const dy = canvasCenter.y - origin.pos.y;

            origin.velocity.x += dx * Attraction.CENTRAL_SPRING;
            origin.velocity.y += dy * Attraction.CENTRAL_SPRING;
        });
    }

    static springAttraction(
        ctx: CanvasRenderingContext2D,
        edges: Array<Edge>,
        strength: number = Attraction.SPRING
    ) {
        for (const edge of edges) {
            const vertexA = edge.sourceRef;
            const vertexB = edge.targetRef;

            // calculates distance between centers of the vertices
            const dx = vertexB.pos.x - vertexA.pos.x;
            const dy = vertexB.pos.y - vertexA.pos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // avoid division by 0
            if (distance === 0) {
                continue;
            }

            // These are normalised directional vector components
            const normX = dx / distance;
            const normY = dy / distance;

            const width_offset =
                VertexUtility.getBoxWidth(ctx, vertexA) / 2 + VertexUtility.getBoxWidth(ctx, vertexB) / 2;

            const displacement = distance - (Attraction.REST_LENGTH + width_offset);
            const force = strength * displacement;

            // Pull two vertex's together
            if (!vertexA.selected) {
                vertexA.velocity.x += (force / VertexUtility.getOriginalMass(vertexA)) * normX;
                vertexA.velocity.y += (force / VertexUtility.getOriginalMass(vertexA)) * normY;
            }
            if (!vertexB.selected) {
                vertexB.velocity.x -= (force / VertexUtility.getOriginalMass(vertexB)) * normX;
                vertexB.velocity.y -= (force / VertexUtility.getOriginalMass(vertexB)) * normY;
            }
        }
    }
}

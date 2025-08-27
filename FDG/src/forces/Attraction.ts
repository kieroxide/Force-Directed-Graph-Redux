import type { Edge } from "../classes/Edge";
import type { Vertex } from "../classes/Vertex";
import { PHYSICS } from "../constants";
import { Vec } from "../classes/Vec";

export function centerAttraction(
    origins: Set<Vertex>,
    canvas: HTMLCanvasElement
) {
    const canvasCenter = new Vec(canvas.width / 2, canvas.height / 2);

    origins.forEach((origin) => {
        const dx = canvasCenter.x - origin.pos.x;
        const dy = canvasCenter.y - origin.pos.y;

        const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
        origin.vector.x += dx * dist * PHYSICS.FORCES.CENTRAL_SPRING;
        origin.vector.y += dy * dist * PHYSICS.FORCES.CENTRAL_SPRING;
    });
}

export function springAttraction(
    ctx: CanvasRenderingContext2D,
    edges: Array<Edge>,
    strength: number = PHYSICS.FORCES.SPRING
) {
    for (const edge of edges) {
        const vertexA = edge.source;
        const vertexB = edge.target;

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
            vertexA.getBoxWidth(ctx) / 2 + vertexB.getBoxWidth(ctx) / 2;
        const displacement =
            distance - (PHYSICS.FORCES.REST_LENGTH + width_offset);
        const force = strength * displacement;

        // Pull two vertex's together
        vertexA.vector.x += (force / vertexA.mass) * normX;
        vertexA.vector.y += (force / vertexA.mass) * normY;
        vertexB.vector.x -= (force / vertexB.mass) * normX;
        vertexB.vector.y -= (force / vertexB.mass) * normY;
    }
}

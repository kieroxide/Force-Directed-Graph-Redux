import { Vertex } from "../../graph/Vertex";
import { PHYSICS } from "../../../constants";
import { VertexUtility } from "../VertexUtility";

export class Repulsion {
    static repulsion(
        ctx: CanvasRenderingContext2D,
        vertices: Array<Vertex>,
        strength: number = PHYSICS.FORCES.COLOUMBS_LAW,
        exponent: number = 1
    ) {
        for (let i = 0; i < vertices.length; i++) {
            for (let j = i + 1; j < vertices.length; j++) {
                const vertexA = vertices[i];
                const vertexB = vertices[j];

                // Calculate distance
                const dx = vertexB.pos.x - vertexA.pos.x;
                const dy = vertexB.pos.y - vertexA.pos.y;
                const centerDistance = Math.sqrt(dx * dx + dy * dy);

                if (centerDistance === 0) continue; // Avoid division by zero

                const width_offset =
                    VertexUtility.getBoxWidth(ctx, vertexA) / 2 + VertexUtility.getBoxWidth(ctx, vertexB) / 2;

                const edgeDistance = Math.max(centerDistance - width_offset, 2);
                const force = strength / edgeDistance ** exponent;

                // Unit vector (direction)
                const unitX = dx / centerDistance;
                const unitY = dy / centerDistance;

                // Apply equal and opposite forces
                if (!vertexA.selected) {
                    vertexA.vector.x -= unitX * (force / VertexUtility.getOriginalMass(vertexA));
                    vertexA.vector.y -= unitY * (force / VertexUtility.getOriginalMass(vertexA));
                }
                if (!vertexB.selected) {
                    vertexB.vector.x += unitX * (force / VertexUtility.getOriginalMass(vertexB));
                    vertexB.vector.y += unitY * (force / VertexUtility.getOriginalMass(vertexB));
                }
            }
        }
    }
}

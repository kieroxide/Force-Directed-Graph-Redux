import { Vertex } from "../../graph/Vertex";
import { VertexUtility } from "../VertexUtility";

export class Repulsion {
    private static readonly STRENGTH = 1000;
    private static readonly REPULSION_CUTOFF = 1000;

    static repulsion(vertices: Array<Vertex>, strength: number = Repulsion.STRENGTH, exponent: number = 1) {
        for (let i = 0; i < vertices.length; i++) {
            for (let j = i + 1; j < vertices.length; j++) {
                const vertexA = vertices[i];
                const vertexB = vertices[j];

                // Calculate distance
                const dx = vertexB.pos.x - vertexA.pos.x;
                const dy = vertexB.pos.y - vertexA.pos.y;
                const centerDistance = Math.sqrt(dx * dx + dy * dy);

                if (centerDistance === 0) continue; // Avoid division by zero
                if (centerDistance >= Repulsion.REPULSION_CUTOFF) continue; // Skip far away nodes

                const width_offset = vertexA._cachedDimensions!.boxWidth / 2 + vertexB._cachedDimensions!.boxWidth / 2;

                const edgeDistance = Math.max(centerDistance - width_offset, 2);
                if (edgeDistance === 0) continue;
                const force = strength / edgeDistance ** exponent;

                // Unit vector (direction)
                const unitX = dx / centerDistance;
                const unitY = dy / centerDistance;

                // Apply equal and opposite forces
                if (!vertexA.selected) {
                    vertexA.velocity.x -= unitX * (force / VertexUtility.getOriginalMass(vertexA));
                    vertexA.velocity.y -= unitY * (force / VertexUtility.getOriginalMass(vertexA));
                }
                if (!vertexB.selected) {
                    vertexB.velocity.x += unitX * (force / VertexUtility.getOriginalMass(vertexB));
                    vertexB.velocity.y += unitY * (force / VertexUtility.getOriginalMass(vertexB));
                }
            }
        }
    }
}

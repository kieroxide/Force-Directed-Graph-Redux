import type { Vertex } from "../classes/Vertex";
import { PHYSICS } from "../constants";

// To debug the average forces a type of force exbits
let averageForce = 0;
let totalForce = 0;
let maxForce = 0;
let iterations = 0;

export function linearRepulsion(
    ctx: CanvasRenderingContext2D,
    vertices: Array<Vertex>,
    strength: number = PHYSICS.FORCES.coloumbs_law_const
) {
    for (let i = 0; i < vertices.length; i++) {
        for (let j = i + 1; j < vertices.length; j++) {
            iterations++;
            const vertexA = vertices[i];
            const vertexB = vertices[j];

            // Calculate distance
            const dx = vertexB.pos.x - vertexA.pos.x;
            const dy = vertexB.pos.y - vertexA.pos.y;
            const centerDistance = Math.sqrt(dx * dx + dy * dy);

            if (centerDistance === 0) continue; // Avoid division by zero

            const edgeDistance = Math.max(
                centerDistance -
                    vertexA.getTextWidth(ctx) / 2 -
                    vertexB.getTextWidth(ctx) / 2,
                2
            );

            const force = strength / edgeDistance; //* edgeDistance);

            totalForce += force;
            averageForce = totalForce / iterations;
            maxForce = Math.max(force, maxForce);
            console.log("Repulsion");
            console.log("Average Force: ", averageForce);
            console.log("Max Force: ", maxForce);
            console.log("\n");

            // Unit vector (direction)
            const unitX = dx / centerDistance;
            const unitY = dy / centerDistance;

            // Apply equal and opposite forces
            vertexA.vector.x -= unitX * force;
            vertexA.vector.y -= unitY * force;
            vertexB.vector.x += unitX * force;
            vertexB.vector.y += unitY * force;
        }
    }
}

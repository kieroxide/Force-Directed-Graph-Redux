import type { Edge } from "../classes/Edge";
import { PHYSICS } from "../constants";

// To debug the average forces a type of force exbits
let averageForce = 0;
let totalForce = 0;
let maxForce = 0;
let iterations = 0;

export function springAttraction(
    edges: Array<Edge>,
    strength: number = PHYSICS.FORCES.spring_const
) {
    for (const edge of edges) {
        iterations++;
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

        totalForce += strength;
        averageForce = totalForce / iterations;
        maxForce = Math.max(strength, maxForce);
        console.log("SPRING");
        console.log("Average Force: ", averageForce);
        console.log("Max Force: ", maxForce);
        console.log("\n");
        
        // These are normalised directional vector components
        const normX = dx / distance;
        const normY = dy / distance;

        const forceX = strength * normX;
        const forceY = strength * normY;

        // Pull them slightly toward each other
        vertexA.vector.x += forceX;
        vertexA.vector.y += forceY;
        vertexB.vector.x -= forceX;
        vertexB.vector.y -= forceY;
    }
}

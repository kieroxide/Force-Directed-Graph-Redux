import type { Edge } from "../../graph/Edge";
import { Vec } from "../../graph/Vec";
import { Vertex } from "../../graph/Vertex";
import { VertexUtility } from "../VertexUtility";
import { repulsion } from "../Forces/Rust/fdg_wasm/pkg/fdg_wasm";

export class Repulsion {
    private static readonly STRENGTH = 800;

    static repulsion(vertices: Array<Vertex>, strength: number = Repulsion.STRENGTH, exponent: number = 1) {
        for (let i = 0; i < vertices.length; i++) {
            for (let j = i + 1; j < vertices.length; j++) {
                const vertexA = vertices[i];
                const vertexB = vertices[j];

                const width_offset = vertexA._cachedDimensions!.boxWidth / 2 + vertexB._cachedDimensions!.boxWidth / 2;

                // Call the WASM function
                const result = repulsion(
                    strength,
                    vertexA.pos.x,
                    vertexA.pos.y,
                    vertexA.selected,
                    VertexUtility.getOriginalMass(vertexA),
                    vertexB.pos.x,
                    vertexB.pos.y,
                    vertexB.selected,
                    VertexUtility.getOriginalMass(vertexB),
                    width_offset,
                    exponent
                );

                // result is a JS array: [force1x, force1y, force2x, force2y]
                const [force1x, force1y, force2x, force2y] = result;
                
                // Apply the returned forces
                vertexA.velocity.x += force1x;
                vertexA.velocity.y += force1y;

                vertexB.velocity.x -= force2x;
                vertexB.velocity.y -= force2y;
            }
        }
    }
}

import { Vec } from "../classes/Vec";
import { Vertex } from "../classes/Vertex";
import { VertexUtility } from "./VertexUtility";

export class GeometryUtilities {
    /**
     * Creates evenly spaced points around a circle
     */
    static circlePoints(centerX: number, centerY: number, radius: number, numOfPoints = 100): Array<Vec> {
        const points = [];
        for (let i = 0; i < numOfPoints; i++) {
            const theta = (2 * Math.PI * i) / numOfPoints - Math.PI / 2;
            const x = centerX + radius * Math.cos(theta);
            const y = centerY + radius * Math.sin(theta);
            points.push(new Vec(x, y));
        }
        return points;
    }

    /**
     * Groups vertices into connected components using BFS, organized by distance from origin
     */
    static bfsComponents(vertices: Vertex[]): Map<number, Map<number, Vertex[]>> {
        const visited = new Set<Vertex>();
        const components = new Map<number, Map<number, Vertex[]>>(); // Map<componentID, <bfsLevel, Vertices>>
        let componentId = 0;

        for (const origin of vertices) {
            if (visited.has(origin)) continue;

            const layers = new Map<number, Vertex[]>();
            const queue: Array<{ vertex: Vertex; level: number }> = [];
            queue.push({ vertex: origin, level: 0 });
            visited.add(origin);

            while (queue.length > 0) {
                const { vertex: vertex, level } = queue.shift()!;

                // We need to create the level map if not exists
                if (!layers.has(level)) {
                    layers.set(level, []);
                }
                // Adds vertex to the level
                layers.get(level)!.push(vertex);

                // Adds all unvisited neighbours to the queue
                for (const neighbour of VertexUtility.getNeighbours(vertex)) {
                    // Visited guard to prevent cycles in the graph causing an infinite loop
                    if (!visited.has(neighbour)) {
                        visited.add(neighbour);
                        queue.push({ vertex: neighbour, level: level + 1 });
                    }
                }
            }

            components.set(componentId++, layers);
        }
        return components;
    }
}

import { Vec } from "../graph/Vec";
import { Vertex } from "../graph/Vertex";
import { VertexUtility } from "./VertexUtility";

export class GeometryUtility {
    /**
     * Returns angle of a line from the x-axis
     */
    static lineAngle(source: Vec, target: Vec): number {
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        return Math.atan2(dy, dx);
    }
    /**
     *  Returns midpoint between two points
     */
    static getMidpoint(pointA: Vec, pointB: Vec) {
        const xMid = (pointA.x + pointB.x) / 2;
        const yMid = (pointA.y + pointB.y) / 2;
        return new Vec(xMid, yMid);
    }
    /**
     *  Gets intersect from source point to vertex's boundary
     **/
    static getBoxIntersect(sourcePos: Vec, target: Vertex) {
        const halfWidth = target._cachedDimensions!.boxWidth / 2;
        const halfHeight = target._cachedDimensions!.boxHeight / 2;

        const dx = target.pos.x - sourcePos.x;
        const dy = target.pos.y - sourcePos.y;

        // avoid division by zero
        if (dx === 0 && dy === 0) return new Vec(target.pos.x, target.pos.y);

        // Scale factors along each axis
        const scaleX = halfWidth / Math.abs(dx);
        const scaleY = halfHeight / Math.abs(dy);

        const scale = Math.min(scaleX, scaleY);

        return new Vec(target.pos.x - dx * scale, target.pos.y - dy * scale);
    }
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

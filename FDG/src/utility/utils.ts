import { Vec } from "../classes/Vec";
import { Vertex } from "../classes/Vertex";
import { RENDERING } from "../constants";

export function browserToCanvas(canvas: HTMLCanvasElement, e: MouseEvent) {
    // Shifts browser mouse position to canvas position
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    return new Vec(mouseX, mouseY);
}

export function setFontSize(fontStr: string, newSizePx: number): string {
    // Regex matches the first number + 'px'
    return fontStr.replace(/(\d+)px/, `${newSizePx}px`);
}

export function resizeCanvas(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

export function randomNiceColor() {
    const hue =
        Math.floor(Math.random() * RENDERING.COLOURS.HUE_MAX) +
        RENDERING.COLOURS.HUE_MIN;
    const saturation =
        Math.floor(Math.random() * RENDERING.COLOURS.SATURATION_MAX) +
        RENDERING.COLOURS.SATURATION_MIN;
    const lightness =
        Math.floor(Math.random() * RENDERING.COLOURS.LIGHTNESS_MAX) +
        RENDERING.COLOURS.LIGHTNESS_MIN;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function clamp(val: number, absMaxVal: number) {
    return Math.max(-absMaxVal, Math.min(val, absMaxVal));
}

/** Initial starting position helper functions */

export function circlePoints(
    centerX: number,
    centerY: number,
    radius: number,
    numOfPoints = 100
): Array<Vec> {
    /**Returns equidistant points around circle with inputted midpoint and radius */
    const points = [];
    for (let i = 0; i < numOfPoints; i++) {
        const theta = (2 * Math.PI * i) / numOfPoints - Math.PI / 2;
        const x = centerX + radius * Math.cos(theta);
        const y = centerY + radius * Math.sin(theta);
        points.push(new Vec(x, y));
    }
    return points;
}

export function bfsComponents(
    vertices: Vertex[]
): Map<number, Map<number, Vertex[]>> {
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
            for (const neighbour of vertex.getNeighbours()) {
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

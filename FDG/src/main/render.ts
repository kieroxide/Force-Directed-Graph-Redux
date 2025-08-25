import type { Camera } from "../classes/Camera";
import type { Graph } from "../classes/Graph";
import { RENDERING } from "../constants";

export function render(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    camera: Camera,
    graph: Graph
) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = RENDERING.CANVAS.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    graph.simulate();

    ctx.save();
    camera.applyTransform(ctx);
    graph.draw();
    ctx.restore();

    requestAnimationFrame(() => render(ctx, canvas, camera, graph));
}

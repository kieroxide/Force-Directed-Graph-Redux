import type { Camera } from "../classes/Camera";
import type { Graph } from "../classes/Graph";

const BACKGROUND_COLOUR = "#000000ff";

export function render(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, camera: Camera, graph: Graph) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = BACKGROUND_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    graph.simulate();

    ctx.save();
    camera.applyTransform(ctx);
    graph.draw();
    ctx.restore(); 
    
    requestAnimationFrame(() => render(ctx, canvas, camera, graph));
}
import type { Camera } from "../classes/Camera";
import type { GraphManager } from "../classes/GraphManager";

export class RenderingUtility {
    private static readonly BACKGROUND_COLOR = "#3a3a3aff";

    static render(
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        camera: Camera,
        graphManager: GraphManager
    ) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = RenderingUtility.BACKGROUND_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save(); // save and restore to avoid transforms stacking
        camera.applyTransform(ctx);
        graphManager.graph.draw();
        ctx.restore();
    }
}

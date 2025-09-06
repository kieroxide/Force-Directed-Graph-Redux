import type { Camera } from "../classes/Camera";
import type { GraphManager } from "../classes/GraphManager";
import { RENDERING } from "../../constants";

export class RenderingUtility {
    static render(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, camera: Camera, graphManager: GraphManager){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = RENDERING.CANVAS.BACKGROUND_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        ctx.save(); // save and restore to avoid transforms stacking
        camera.applyTransform(ctx);
        graphManager.getGraph().draw();
        ctx.restore();
    }
}
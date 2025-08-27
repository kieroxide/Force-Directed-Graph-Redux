import type { Camera } from "../classes/Camera";
import type { Graph } from "../classes/Graph";
import { Controls } from "../constants";
import { browserToCanvas } from "./utils";

export function setupControls(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    camera: Camera,
    graph: Graph
) {
    let isDraggingCamera = false;

    canvas.addEventListener("mousedown", (e: MouseEvent) => {
        /**  Handles holding mouse click:
         * - Handles boundary check on clicking on vertices
         * - Handles dragging camera check
         */
        const mousePos = browserToCanvas(canvas, e);

        // Check if we clicked a vertex first
        for (const vertex of graph.getVertices()) {
            if (vertex.inBoundary(mousePos, ctx, camera)) {
                graph.setSelectedVertex(vertex);
                return;
            }
        }

        // If no vertex clicked, start camera drag
        isDraggingCamera = true;
    });

    window.addEventListener("mouseup", () => {
        // When mouse hold is ended, resets to unactive values
        isDraggingCamera = false;
        graph.resetSelectedVertex();
    });

    canvas.addEventListener("mouseleave", () => {
        // Stop dragging if mouse leaves canvas
        isDraggingCamera = false;
        graph.resetSelectedVertex();
    });

    canvas.addEventListener("mousemove", (e: MouseEvent) => {
        /** Switches between camera control and vertex dragging  */
        if (isDraggingCamera) {
            camera.pan(e.movementX, e.movementY);
        } else if (graph.selectedVertex !== undefined) {
            const vertex = graph.selectedVertex;

            const c_mouse = browserToCanvas(canvas, e);
            const ws_mouse = c_mouse.canvasToWorld(camera);
            vertex.pos.x = ws_mouse.x;
            vertex.pos.y = ws_mouse.y;
        }
    });

    canvas.addEventListener("wheel", (e: WheelEvent) => {
        /** For zooming in and out of the camera */
        e.preventDefault(); // prevents scrolling browser
        const c_mouse = browserToCanvas(canvas, e);
        const ms_mouse = c_mouse.canvasToWorld(camera);

        // decides whether to zoom it or out
        const factor =
            e.deltaY < 0
                ? Controls.ZoomScaleFactor
                : 1 / Controls.ZoomScaleFactor;

        camera.zoomAt(c_mouse, ms_mouse, factor);
    });
}

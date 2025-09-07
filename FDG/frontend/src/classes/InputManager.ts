import { Camera } from "../classes/Camera";
import { GraphManager } from "../classes/GraphManager";
import { CanvasUtility } from "../utility/CanvasUtility";
import { VertexUtility } from "../utility/VertexUtility";
import type { UIController } from "./UIController";

export class InputManager {
    private canvas: HTMLCanvasElement;
    private camera: Camera;
    private graphManager: GraphManager;
    private uiController: UIController;
    private isDraggingCamera = false;

    constructor(canvas: HTMLCanvasElement, camera: Camera, graphManager: GraphManager, uiController: UIController) {
        this.canvas = canvas;
        this.camera = camera;
        this.graphManager = graphManager;
        this.uiController = uiController;
        this.setupEventListeners();
    }

    private setupEventListeners() {
        this.canvas.addEventListener("contextmenu", (e) => this.handleRightClick(e)); // expand from vertex
        this.canvas.addEventListener("mousedown", (e) => this.handleMouseDown(e)); // dragging Camera/Vertex
        this.canvas.addEventListener("mousemove", (e) => this.handleMouseMove(e)); // ^^^^^^^^^^^^^^^^^^^^^^
        this.canvas.addEventListener("mouseup", () => this.handleMouseUp()); // ^^^^^^^^^^^^^^^^^^^^^^
        this.canvas.addEventListener("mouseleave", () => this.handleMouseLeave()); // ^^^^^^^^^^^^^^^^^^^^^^
        this.canvas.addEventListener("wheel", (e) => this.handleWheel(e)); // zooming in/out
    }

    private async handleRightClick(e: MouseEvent) {
        e.preventDefault();
        const graph = this.graphManager.graph;

        if (graph.lastClickedVertex) {
            const settings = this.uiController.getSettings();
            await this.graphManager.expandFromVertex(
                graph.lastClickedVertex.id,
                settings.depth,
                settings.relationLimit
            );
        }
    }

    private handleMouseDown(e: MouseEvent) {
        const mousePos = CanvasUtility.browserToCanvas(this.canvas, e);
        const graph = this.graphManager.graph;

        // Check vertices for selection
        for (const vertex of Object.values(graph.vertices)) {
            if (VertexUtility.pointInBoundary(mousePos, this.graphManager.ctx, this.camera, vertex)) {
                graph.setSelectedVertex(vertex);
                return;
            }
        }

        // Start camera drag if no vertex selected
        this.isDraggingCamera = true;
    }

    private handleMouseMove(e: MouseEvent) {
        if (this.isDraggingCamera) {
            this.camera.pan(e.movementX, e.movementY);
        } else {
            // Handle vertex dragging
            const graph = this.graphManager.graph;
            if (graph.selectedVertex) {
                const mousePos = CanvasUtility.browserToCanvas(this.canvas, e);
                const worldPos = this.camera.canvasToWorld(mousePos);
                // Update vertex position
                graph.selectedVertex.pos.x = worldPos.x;
                graph.selectedVertex.pos.y = worldPos.y;
            }
        }
    }

    private handleWheel(e: WheelEvent) {
        e.preventDefault();
        const mousePos = CanvasUtility.browserToCanvas(this.canvas, e);
        const worldMouse = this.camera.canvasToWorld(mousePos);

        const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
        this.camera.zoomAt(mousePos, worldMouse, factor);
    }

    private handleMouseUp() {
        this.isDraggingCamera = false;
        this.graphManager.graph.resetSelectedVertex();
    }

    private handleMouseLeave() {
        this.isDraggingCamera = false;
        this.graphManager.graph.resetSelectedVertex();
    }
}

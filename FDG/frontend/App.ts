import { Camera } from "./src/classes/Camera";
import { GraphManager } from "./src/classes/GraphManager";
import { UIController } from "./src/classes/UIController";
import { InputManager } from "./src/classes/InputManager";
import { CanvasUtility } from "./src/utility/CanvasUtility";
import { RenderingUtility } from "./src/utility/RenderingUtility";

class Application {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    
    private camera!: Camera;
    private graphManager!: GraphManager;
    private uiController!: UIController;
    private inputManager!: InputManager;

    constructor() {
        this.canvas = document.getElementById("graphCanvas") as HTMLCanvasElement;
        if (!this.canvas) {
            throw new Error("Canvas element with id 'graphCanvas' not found");
        }

        this.ctx = this.canvas.getContext("2d")!;
        if (!this.ctx) {
            throw new Error("Unable to get 2D context from canvas");
        }

        this.setupCanvas();
        this.initializeComponents();
        this.startRenderLoop();
    }

    private setupCanvas() {
        // Resize canvas to fit window
        CanvasUtility.resizeCanvas(this.canvas);

        // Handle window resize
        window.addEventListener("resize", () => {
            CanvasUtility.resizeCanvas(this.canvas);
        });
    }

    private initializeComponents() {
        // Initialize core systems
        this.camera = new Camera();
        this.graphManager = new GraphManager(this.ctx!, this.canvas);

        // Initialize UI and input managers
        this.uiController = new UIController(this.graphManager);
        this.inputManager = new InputManager(this.canvas, this.camera, this.graphManager,  this.uiController);
    }

    private startRenderLoop() {
        const gameLoop = () => {
            // Run physics simulation
            this.graphManager.simulate();

            // Render the graph
            RenderingUtility.render(this.ctx, this.canvas, this.camera, this.graphManager);

            // Continue loop
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Start application when page loads
window.onload = () => {
    try {
        new Application();
        console.log("Application started successfully");
    } catch (error) {
        console.error("Failed to start application:", error);
    }
};

import { Camera } from "./src/classes/Camera";
import { GraphManager } from "./src/classes/GraphManager";
import { UIController } from "./src/classes/UIController";
import { InputManager } from "./src/classes/InputManager";
import { CanvasUtility } from "./src/utility/CanvasUtility";
import { RenderingUtility } from "./src/utility/RenderingUtility";
import { NetworkUtility } from "./src/utility/NetworkUtility";
import initWasm from "./src/utility/Forces/Rust/fdg_wasm/pkg/fdg_wasm";

const frameQueue: Array<() => void> = [];

function processFrameQueue() {
    if (frameQueue.length > 0) {
        const task = frameQueue.shift();
        task && task();
    }
    requestAnimationFrame(processFrameQueue);
}
processFrameQueue();

/**
 * Main application class for initializing and running the force-directed graph visualizer.
 */
class Application {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;

    private camera!: Camera;
    private graphManager!: GraphManager;
    private uiController!: UIController;
    private inputManager!: InputManager;

    /** Constructs the Application and initializes the canvas and components. */
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

    /** Sets up the canvas size and resize event listener. */
    private setupCanvas() {
        // Resize canvas to fit window
        CanvasUtility.resizeCanvas(this.canvas);

        // Handle window resize
        window.addEventListener("resize", () => {
            CanvasUtility.resizeCanvas(this.canvas);
        });
    }

    /** Initializes core systems and UI/input managers. */
    private initializeComponents() {
        // Initialize core systems
        this.camera = new Camera();
        this.graphManager = new GraphManager(this.ctx!, this.canvas);

        // Initialize UI and input managers
        this.uiController = new UIController(this.graphManager);
        this.inputManager = new InputManager(this.canvas, this.camera, this.graphManager, this.uiController);
    }

    /** Starts the main render and simulation loop. */
    private async startRenderLoop() {
        // Flushed all previous data sent by previous instances out from the server
        // To prevent old data being merged with a new server request
        await NetworkUtility.flushSever(this.graphManager);

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

/**
 * Entry point: initializes WASM and starts the application on window load.
 */
window.onload = async () => {
    await initWasm();
    try {
        new Application();
    } catch (error) {
        // Failed to start application
    }
};

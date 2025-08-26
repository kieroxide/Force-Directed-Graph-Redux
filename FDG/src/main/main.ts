import { generate_graph_from_json } from "../utility/handleImport";
import { render } from "./render";
import { Camera } from "../classes/Camera";
import { setupCameraControls } from "../utility/inputHandler";
import { resizeCanvas } from "../utility/utils";

window.onload = () => {
    const canvas = document.getElementById("graphCanvas") as HTMLCanvasElement;
    if (!canvas) return;
    // Makes canvas fit window size and resizes when window changes
    resizeCanvas(canvas);
    window.addEventListener("resize", () => resizeCanvas(canvas));

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let graph = generate_graph_from_json(ctx, canvas);
    graph.initVerticesPos();
    graph.initVertexColour();
    graph.initEdgeColour();
    let camera = new Camera();
    setupCameraControls(canvas, camera);
    for(let i = 0; i < 1; i++){
        graph.simulate();
    }
    render(ctx, canvas, camera, graph);
};

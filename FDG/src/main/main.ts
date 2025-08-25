import { generate_graph_from_json } from "../utility/handleImport";
import { render } from "./render";
import { Camera } from "../classes/Camera";
import { setupCameraControls } from "../utility/inputHandler";

window.onload = () => {
    const canvas = document.getElementById("graphCanvas") as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let graph = generate_graph_from_json(ctx, canvas);
    let camera = new Camera();
    setupCameraControls(canvas, camera);

    render(ctx, canvas, camera, graph);
};

import { generate_graph_from_json } from "../utility/handleImport";
import GRAPHDATA from "../../data/games.json";
import type { ObjGraphData } from "../objects/importedGraph";

export const BACKGROUND_COLOUR = "#ffffffff";

window.onload = () => {
    const graphData: ObjGraphData = GRAPHDATA;

    const canvas = document.getElementById("graphCanvas") as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = BACKGROUND_COLOUR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let graph = generate_graph_from_json(ctx, canvas, graphData)
    graph.simulate();
};

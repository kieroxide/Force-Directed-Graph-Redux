import { Vec } from "./Vec";
import { Edge } from "./Edge";
import { randomNum } from "../utility/utils";

const DAMPING = 0.85;

export class Vertex {
    // Euclidean Data
    pos: Vec;
    vector: Vec;

    // Generic Data
    name: string;
    type: string;
    releaseDate: string | undefined;
    edges: Array<Edge>;

    // Visual Label
    label: string;

    constructor(name: string, type: string, releaseDate: string | undefined) {
        this.pos = new Vec(randomNum(50, 150), randomNum(50, 150));
        this.vector = new Vec(0, 0);

        this.name = name;
        this.type = type;

        this.releaseDate = releaseDate;
        if (this.releaseDate === undefined) {
            this.releaseDate = "";
        }

        this.edges = [];

        this.label = "".concat(
            this.name,
            "\n",
            this.type,
            "\n",
            this.releaseDate
        );
    }

    // Method to update position of the Vertex using the vector's values. Also applies damping
    update() {
        this.pos.x += this.vector.x;
        this.pos.y += this.vector.y;

        this.vector.x *= DAMPING;
        this.vector.y *= DAMPING;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.strokeText(this.label, this.pos.x, this.pos.y); // Outline
        ctx.fillStyle = "black";
        ctx.fillText(this.label, this.pos.x, this.pos.y); // Fill
    }
}

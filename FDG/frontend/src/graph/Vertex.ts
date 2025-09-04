import { Vec } from "./Vec";
import { Edge } from "./Edge";
import { RENDERING, PHYSICS } from "../../constants";
import { VertexUtility } from "../utility/VertexUtility";
import { MathUtility } from "../utility/MathUtility";
import { CanvasUtility } from "../utility/CanvasUtility";

export class Vertex {
    // Euclidean Data
    private _pos: Vec;
    private _vector: Vec;

    // Generic Data
    private _name: string;
    private _id: string;
    private _type: string;
    private _neighbours: Array<Edge>;

    // Visual Label
    private _label: string;
    private _TEXT_BOX: {
        PADDING_WIDTH: number;
        PADDING_HEIGHT: number;
        BORDER_COLOR: string;
        BORDER_WIDTH: number;
    };
    private _labelColour?: string;
    private _selected: boolean;
    private _textWidth?: number;

    set selected(isSelected: boolean) {
        this._selected = isSelected;
    }

    get labelColour(): string {
        return this._labelColour || "";
    }

    set labelColour(colour: string) {
        this._labelColour = colour;
    }

    get pos() {
        return this._pos;
    }
    get neighbours() {
        return this._neighbours;
    }
    set neighbours(neighbours_: Edge[]) {
        this._neighbours = neighbours_;
    }
    addNeighbour(edge: Edge) {
        this._neighbours.push(edge);
    }
    get TEXT_BOX() {
        return this._TEXT_BOX;
    }
    get textWidth() {
        return this._textWidth;
    }
    set textWidth(width: number | undefined) {
        this._textWidth = width;
    }
    get label() {
        return this._label;
    }
    get id() {
        return this._id;
    }
    get type() {
        return this._type;
    }
    get vector() {
        return this._vector;
    }
    set vector(vec: Vec) {
        this._vector = vec;
    }

    constructor(id: string, name: string, type: string = "") {
        this._pos = new Vec(200, 200);
        this._vector = new Vec(0, 0);
        this._id = id;
        this._name = name;
        this._type = type;
        this._selected = false;
        this._neighbours = [];

        this._label = this._name;
        this._labelColour = undefined;

        this._TEXT_BOX = {
            PADDING_WIDTH: 50,
            PADDING_HEIGHT: 70,
            BORDER_COLOR: "#000000ff",
            BORDER_WIDTH: 3,
        };
    }

    /**
     * Updates position of the Vertex using the vector's values. Also applies damping
     */
    update() {
        this._pos.x += MathUtility.clamp(this._vector.x, PHYSICS.CLAMPS.MAX_SPEED);
        this._pos.y += MathUtility.clamp(this._vector.y, PHYSICS.CLAMPS.MAX_SPEED);

        this._vector.x *= PHYSICS.FORCES.DAMPING;
        this._vector.y *= PHYSICS.FORCES.DAMPING;
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Calibrates font
        const massFontSize = RENDERING.FONT.SIZE + VertexUtility.getOriginalMass(this) * RENDERING.FONT.MASS_WEIGHT;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = CanvasUtility.getFontString(RENDERING.FONT.FAMILY, massFontSize);

        // Calculates boxWidth and Height. Could be cached
        const width = VertexUtility.getTextWidth(ctx, this);
        const boxWidth = width + this._TEXT_BOX.PADDING_WIDTH;
        const boxHeight = massFontSize + this._TEXT_BOX.PADDING_HEIGHT;

        // Draw background box
        ctx.fillStyle = this._labelColour || "grey";
        // Drawn where the box midpoint is the position vector
        ctx.fillRect(this._pos.x - boxWidth / 2, this._pos.y - boxHeight / 2, boxWidth, boxHeight);

        // Draw border
        if (this._selected) {
            ctx.strokeStyle = "#22fff0ff"; // White border when selected
            ctx.lineWidth = 4;
        } else {
            ctx.strokeStyle = this._TEXT_BOX.BORDER_COLOR;
            ctx.lineWidth = this._TEXT_BOX.BORDER_WIDTH;
        }
        ctx.strokeRect(this._pos.x - boxWidth / 2, this._pos.y - boxHeight / 2, boxWidth, boxHeight);

        // Draw text
        ctx.fillStyle = "#000000ff";
        ctx.fillText(this._label, this._pos.x, this._pos.y);
    }
}

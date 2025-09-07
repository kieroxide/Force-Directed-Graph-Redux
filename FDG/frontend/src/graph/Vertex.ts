import { Vec } from "./Vec";
import { Edge } from "./Edge";
import { VERTEX_FONT } from "../../constants/font";
import { VertexUtility } from "../utility/VertexUtility";
import { MathUtility } from "../utility/MathUtility";
import { CanvasUtility } from "../utility/CanvasUtility";

export class Vertex {
    private static readonly MAX_SPEED = 20;
    private static readonly DAMPING = 0.9;
    // Euclidean Data
    private readonly _pos: Vec;
    get pos() {
        return this._pos;
    }

    private _velocity: Vec;
    get velocity() {
        return this._velocity;
    }
    killVelocity() {
        this._velocity = new Vec(0, 0);
    }

    private readonly _connectedEdges: Array<Edge>;
    get connectedEdges() {
        return this._connectedEdges;
    }

    private _selected: boolean;
    set selected(isSelected: boolean) {
        this._selected = isSelected;
    }
    // Generic Data
    private readonly _name: string;

    private readonly _id: string;
    get id() {
        return this._id;
    }

    private readonly _type: string;
    get type() {
        return this._type;
    }

    // Visual Label
    private readonly _label: string;
    get label() {
        return this._label;
    }

    private readonly _TEXT_BOX: {
        readonly PADDING_WIDTH: number;
        readonly PADDING_HEIGHT: number;
        readonly BORDER_COLOR: string;
        readonly BORDER_WIDTH: number;
    };
    get TEXT_BOX() {
        return this._TEXT_BOX;
    }

    public textWidth?: number;
    labelColour?: string;

    constructor(id: string, name: string, type: string = "") {
        this._pos = new Vec(200, 200);
        this._velocity = new Vec(0, 0);
        this._id = id;
        this._name = name;
        this._type = type;
        this._selected = false;
        this._connectedEdges = [];

        this._label = this._name;
        this.labelColour = undefined;

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
        const MAX_SPEED = Vertex.MAX_SPEED;
        this._pos.x += MathUtility.clamp(this._velocity.x, -MAX_SPEED, MAX_SPEED);
        this._pos.y += MathUtility.clamp(this._velocity.y, -MAX_SPEED, MAX_SPEED);

        this._velocity.x *= Vertex.DAMPING;
        this._velocity.y *= Vertex.DAMPING;
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Calibrates font
        const massFontSize =
            VERTEX_FONT.SIZE + VertexUtility.getOriginalMass(this) * VERTEX_FONT.MASS_WEIGHT;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = CanvasUtility.getFontString(VERTEX_FONT.FAMILY, massFontSize);

        // Calculates boxWidth and Height. Could be cached
        const width = VertexUtility.getTextWidth(ctx, this);
        const boxWidth = width + this._TEXT_BOX.PADDING_WIDTH;
        const boxHeight = massFontSize + this._TEXT_BOX.PADDING_HEIGHT;

        // Draw background box
        ctx.fillStyle = this.labelColour || "grey";
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

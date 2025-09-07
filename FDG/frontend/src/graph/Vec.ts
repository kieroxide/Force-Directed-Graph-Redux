/**
 * 2D vector class for graph positioning and physics calculations
 */
export class Vec {
    x: number;
    y: number;

    /**
     * Creates a new 2D vector
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Adds two vectors together
     */
    static add(v1: Vec, v2: Vec) {
        return new Vec(v1.x + v2.x, v1.y + v2.y);
    }

    /**
     * Divides vector components by a scalar
     */
    static divideXY(v1: Vec, denom: number) {
        return new Vec(v1.x / denom, v1.y / denom);
    }
}

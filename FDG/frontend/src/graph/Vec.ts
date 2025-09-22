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
     * Subtracts 2nd vector from first
     */
    static subtract(vector: Vec, tosubtract: Vec) {
        return new Vec(vector.x - tosubtract.x, vector.y - tosubtract.y);
    }

    /**
     * Divides vector components by a scalar
     */
    static scalarDivide(v1: Vec, denom: number) {
        return new Vec(v1.x / denom, v1.y / denom);
    }

    static sqrt(vector: Vec) {
        return new Vec(Math.sqrt(vector.x), Math.sqrt(vector.y));
    }

    static distance(v1: Vec, v2: Vec) {
        const subtracted = Vec.subtract(v1, v2);
        const sum = subtracted.x + subtracted.y;
        return Math.sqrt(sum);
    }
}

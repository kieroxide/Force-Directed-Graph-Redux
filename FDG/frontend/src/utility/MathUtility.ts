export class MathUtility {
    /**
     * Clamps a value between a minimum and maximum
     */
    static clamp(value: number, min: number, max: number) {
        return Math.max(min, Math.min(value, max));
    }
}

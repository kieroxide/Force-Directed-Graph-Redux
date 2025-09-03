export class MathUtility {
    /**
     * Clamps a value between -absMaxVal and +absMaxVal
     */
    static clamp(val: number, absMaxVal: number) {
        return Math.max(-absMaxVal, Math.min(val, absMaxVal));
    }
}

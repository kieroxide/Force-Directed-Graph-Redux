export class TextUtility {
    /**
     * Calculates and returns text Height from textMetrics object
     */
    static getTextHeight(metrics: TextMetrics) {
        return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    }

    /**
     * Creates font string in a CSS font style
     */
    static getFontString(fontFamily: string, newSizePx: number): string {
        return `bold ${newSizePx}px ${fontFamily}`;
    }
}

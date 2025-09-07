import { Vec } from "../graph/Vec";

export class CanvasUtility {
    private static readonly COLOURS: {
        readonly HUE_MIN: 0,
        readonly HUE_MAX: 359,
        readonly SATURATION_MIN: 40,
        readonly SATURATION_MAX: 50,
        readonly LIGHTNESS_MIN: 40,
        readonly LIGHTNESS_MAX: 60,
    }
    
    /**
     * Generates a random HSL color with pleasant saturation/lightness
     */
    static randomNiceColor() {
        const hue = Math.floor(Math.random() * CanvasUtility.COLOURS.HUE_MAX) + CanvasUtility.COLOURS.HUE_MIN;
        const saturation =
            Math.floor(Math.random() * CanvasUtility.COLOURS.SATURATION_MAX) + CanvasUtility.COLOURS.SATURATION_MIN;
        const lightness = Math.floor(Math.random() * CanvasUtility.COLOURS.LIGHTNESS_MAX) + CanvasUtility.COLOURS.LIGHTNESS_MIN;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
    /**
     * Converts browser mouse coordinates to canvas coordinates
     */
    static browserToCanvas(canvas: HTMLCanvasElement, e: MouseEvent) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        return new Vec(mouseX, mouseY);
    }

    /**
     * Resizes canvas to fill the entire window
     */
    static resizeCanvas(canvas: HTMLCanvasElement) {
        canvas.width = window.innerWidth - 300;
        canvas.height = window.innerHeight;
    }

    /**
     * Changes font size in a CSS font string
     */
    static getFontString(fontStr: string, newSizePx: number): string {
        // Regex matches the first number + 'px'
        return fontStr.replace(/(\d+)px/, `${newSizePx}px`);
    }

}

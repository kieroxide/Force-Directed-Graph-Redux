import { RENDERING } from "../../constants";
import { Vec } from "../classes/Vec";

export class CanvasUtility {
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
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    /**
     * Changes font size in a CSS font string
     */
    static setFontSize(fontStr: string, newSizePx: number): string {
        // Regex matches the first number + 'px'
        return fontStr.replace(/(\d+)px/, `${newSizePx}px`);
    }

    /**
     * Generates a random HSL color with pleasant saturation/lightness
     */
    static randomNiceColor() {
        const hue = Math.floor(Math.random() * RENDERING.COLOURS.HUE_MAX) + RENDERING.COLOURS.HUE_MIN;
        const saturation =
            Math.floor(Math.random() * RENDERING.COLOURS.SATURATION_MAX) + RENDERING.COLOURS.SATURATION_MIN;
        const lightness = Math.floor(Math.random() * RENDERING.COLOURS.LIGHTNESS_MAX) + RENDERING.COLOURS.LIGHTNESS_MIN;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
}

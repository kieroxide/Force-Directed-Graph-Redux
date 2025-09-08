import { Vec } from "../graph/Vec";

export class CanvasUtility {
    private static readonly COLOURS = {
        HUE_MIN: 0,
        HUE_MAX: 359,
        SATURATION_MIN: 40,
        SATURATION_MAX: 50,
        LIGHTNESS_MIN: 40,
        LIGHTNESS_MAX: 60,
    };

    private static readonly PALETTE = [
        "#4F8A8B",
        "#FBD46D",
        "#F76B8A",
        "#A3D8F4",
        "#374785",
        "#24305E",
        "#70A1D7",
        "#F8E9A1",
        "#A1DE93",
        "#FFB6B9",
        "#6A0572",
        "#AB83A1",
        "#F67280",
        "#355C7D",
        "#C06C84",
    ];

    private static _paletteIndex = 0;

    static nextNiceColor() {
        const color = CanvasUtility.PALETTE[CanvasUtility._paletteIndex % CanvasUtility.PALETTE.length];
        CanvasUtility._paletteIndex++;
        return color;
    }

    /**
     * Generates a random HSL color with pleasant saturation/lightness
     */
    static randomNiceColor() {
        if (this.PALETTE.length >= this._paletteIndex){
            const hue = Math.floor(Math.random() * CanvasUtility.COLOURS.HUE_MAX) + CanvasUtility.COLOURS.HUE_MIN;
            const saturation =
                Math.floor(Math.random() * CanvasUtility.COLOURS.SATURATION_MAX) + CanvasUtility.COLOURS.SATURATION_MIN;
            const lightness =
                Math.floor(Math.random() * CanvasUtility.COLOURS.LIGHTNESS_MAX) + CanvasUtility.COLOURS.LIGHTNESS_MIN;
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        } else {
            return this.nextNiceColor()
        }
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
    static getFontString(fontFamily: string, newSizePx: number): string {
        return `bold ${newSizePx}px ${fontFamily}`;
    }
}

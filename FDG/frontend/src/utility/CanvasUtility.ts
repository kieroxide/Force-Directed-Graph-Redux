import { Vec } from "../graph/Vec";

export class CanvasUtility {
    private static readonly COLOURS = {
        HUE_MIN: 0,
        HUE_MAX: 359,
        SATURATION_MIN: 60,
        SATURATION_MAX: 80,
        LIGHTNESS_MIN: 30,
        LIGHTNESS_MAX: 45,
    };

    private static readonly PALETTE = [
        "#1d3557",
        "#e63946",
        "#457b9d",
        "#f4a261",
        "#2a9d8f",
        "#264653",
        "#e76f51",
        "#a8dadc",
        "#ffb703",
        "#6d597a",
        "#22223b",
        "#4b3f2a",
        "#43aa8b",
        "#f3722c",
        "#277da1",
    ];

    private static _paletteIndex = 0;

    static nextNiceColor() {
        const color = CanvasUtility.PALETTE[CanvasUtility._paletteIndex % CanvasUtility.PALETTE.length];
        CanvasUtility._paletteIndex++;
        return color;
    }

    /** Assigns unique colors to any object type */
    static assignUniqueColours<T>(
        items: Iterable<T>,
        setColours: Map<string, string>,
        getType: (item: T) => string,
        setColour: (item: T, colour: string) => void
    ) {
        for (const item of items) {
            const key = getType(item);
            if (setColours.has(key)) {
                setColour(item, setColours.get(key)!);
            } else {
                let colour: string;
                const usedColours = new Set(setColours.values());
                do {
                    colour = CanvasUtility.randomNiceColor();
                } while (usedColours.has(colour));

                setColours.set(key, colour);
                setColour(item, colour);
            }
        }
    }

    /**
     * Generates a random HSL color with pleasant saturation/lightness
     */
    static randomNiceColor() {
        if (this.PALETTE.length <= this._paletteIndex) {
            const hue = Math.floor(Math.random() * CanvasUtility.COLOURS.HUE_MAX) + CanvasUtility.COLOURS.HUE_MIN;
            const saturation =
                Math.floor(Math.random() * CanvasUtility.COLOURS.SATURATION_MAX) + CanvasUtility.COLOURS.SATURATION_MIN;
            const lightness =
                Math.floor(Math.random() * CanvasUtility.COLOURS.LIGHTNESS_MAX) + CanvasUtility.COLOURS.LIGHTNESS_MIN;
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        } else {
            return this.nextNiceColor();
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
}

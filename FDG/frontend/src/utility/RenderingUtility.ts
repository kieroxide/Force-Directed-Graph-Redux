import type { Camera } from "../classes/Camera";
import type { GraphManager } from "../classes/GraphManager";
import { Vec } from "../graph/Vec";

export class RenderingUtility {
    private static readonly BACKGROUND_COLOR = "#f5ecd7 ";
    static _paperPattern: CanvasPattern | null = null;

    static async loadPaperTexture(ctx: CanvasRenderingContext2D, scale: number = 1) {
        return new Promise<void>((resolve) => {
            const img = new window.Image();
            img.src = "/textures/paper_texture.jpg";
            img.onload = () => {
                // Create an offscreen canvas to scale the image
                const offCanvas = document.createElement("canvas");
                offCanvas.width = img.width * scale;
                offCanvas.height = img.height * scale;
                const offCtx = offCanvas.getContext("2d")!;
                offCtx.drawImage(img, 0, 0, offCanvas.width, offCanvas.height);

                RenderingUtility._paperPattern = ctx.createPattern(offCanvas, "repeat");
                resolve();
            };
            img.onerror = () => {
                resolve();
            };
        });
    }

    static render(
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        camera: Camera,
        graphManager: GraphManager
    ) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = RenderingUtility.BACKGROUND_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (RenderingUtility._paperPattern) {
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = RenderingUtility._paperPattern;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
        }

        ctx.save(); // save and restore to avoid transforms stacking
        camera.applyTransform(ctx, canvas);
        graphManager.graph.draw();
        ctx.restore();
    }

    /**
     * Calculate offset for bidirectional arrows
     */
    static calculateBidirectionalOffset(dx: number, dy: number, offsetScale: number): Vec {
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length === 0) return new Vec(0, 0);

        // Calculate perpendicular unit vector
        const perpX = -dy / length;
        const perpY = dx / length;

        // Apply offset
        return new Vec(perpX * offsetScale, perpY * offsetScale);
    }

    /**
     * Calculate all arrow positions with offset applied
     */
    static calculateArrowPositions(source: Vec, target: Vec, angle: number, offset: Vec, ArrowHeadSize: number) {
        // Move line endpoint back by headLength to leave room for arrowhead
        const lineEndX = target.x - ArrowHeadSize * Math.cos(angle);
        const lineEndY = target.y - ArrowHeadSize * Math.sin(angle);

        // Apply offset to all points
        return {
            sourceX: source.x + offset.x,
            sourceY: source.y + offset.y,
            targetX: target.x + offset.x,
            targetY: target.y + offset.y,
            endX: lineEndX + offset.x,
            endY: lineEndY + offset.y,
        };
    }

    /**
     * Draw the arrowhead at the specified position
     */
    static drawArrowhead(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        angle: number,
        arrowHeadSize: number,
        arrowHeadAngle: number
    ) {
        const headLength = arrowHeadSize;
        const arrowAngle = arrowHeadAngle;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - headLength * Math.cos(angle + arrowAngle), y - headLength * Math.sin(angle + arrowAngle));
        ctx.lineTo(x - headLength * Math.cos(angle - arrowAngle), y - headLength * Math.sin(angle - arrowAngle));
        ctx.closePath();
        ctx.fill();
    }
}

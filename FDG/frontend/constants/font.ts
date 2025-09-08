export const VERTEX_FONT = {
    SIZE: 20,
    FAMILY: "sans-serif",
    MASS_WEIGHT: 5,
    get FULL() {
        return `bold ${this.SIZE}px ${this.FAMILY}`;
    },
} as const;

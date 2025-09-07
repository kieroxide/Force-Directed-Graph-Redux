export const VERTEX_FONT = {
    SIZE: 20,
    FAMILY: "Arial",
    MASS_WEIGHT: 2,
    get FULL() {
        return `bold ${this.SIZE}px ${this.FAMILY}`;
    },
} as const;

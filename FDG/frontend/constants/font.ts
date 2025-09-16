export const FONT = {
    SIZE: 20,
    FAMILY: "sans-serif",
    MASS_WEIGHT: 3,
    get FULL() {
        return `bold ${this.SIZE}px ${this.FAMILY}`;
    },
} as const;

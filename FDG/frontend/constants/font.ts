export const FONT = {
    SIZE: 18,
    FAMILY: "Open Sans",
    MASS_WEIGHT: 1,
    get FULL() {
        return `bold ${this.SIZE}px ${this.FAMILY}`;
    },
} as const;

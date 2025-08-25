export const RENDERING = {
    FONT: {
        SIZE: 12,
        FAMILY: "Arial",
        get FULL() {
            return `${this.SIZE}px ${this.FAMILY}`;
        },
    },

    TEXT_BOX: {
        PADDING: 6,
        BACKGROUND_COLOR: "#ffffff",
        BORDER_COLOR: "#276100ff",
        BORDER_WIDTH: 1,
    },

    CANVAS: {
        BACKGROUND_COLOR: "#feffdaff",
    },
} as const;

export const PHYSICS = {
    FORCES: {
        coloumbs_law_const: 500,
        spring_const: 1,
        REST_LENGTH: 0,
        DAMPING: 0.85,
    },
} as const;

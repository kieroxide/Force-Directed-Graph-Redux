export const Controls = {
    MouseSpeedFactor: 1,
    ZoomScaleFactor: 1.1,
}

export const RENDERING = {
    FONT: {
        SIZE: 12,
        FAMILY: "Arial",
        MASS_WEIGHT: 2,
        get FULL() {
            return `bold ${this.SIZE}px ${this.FAMILY}`;
        },
    },

    TEXT_BOX: {
        PADDING_WIDTH: 50,
        PADDING_HEIGHT: 70,
        BORDER_COLOR: "#000000ff",
        BORDER_WIDTH: 3,
    },

    CANVAS: {
        BACKGROUND_COLOR: "#292929ff",
    },

    COLOURS: {
        HUE_MIN: 0,
        HUE_MAX: 359,
        SATURATION_MIN: 10,
        SATURATION_MAX: 30,
        LIGHTNESS_MIN: 50,
        LIGHTNESS_MAX: 50,
    },

    INIT_SETTINGS: {
        INITIAL_RADIUS: 100,
    },
} as const;

export const PHYSICS = {
    FORCES: {
        coloumbs_law_const: 1000,
        spring_const: 0.025,
        REST_LENGTH: 100,
        BOX_BUFFER: 10,
        DAMPING: 0.98,
    },
    CLAMPS: {
        MAX_SPEED: 10,
    },
} as const;

export const Controls = {
    MouseSpeedFactor: 1,
    ZoomScaleFactor: 1.1,
};

export const RENDERING = {
    FONT: {
        SIZE: 20,
        FAMILY: "Arial",
        MASS_WEIGHT: 2,
        get FULL() {
            return `bold ${this.SIZE}px ${this.FAMILY}`;
        },
    },

    CANVAS: {
        BACKGROUND_COLOR: "#292929ff",
    },

    COLOURS: {
        HUE_MIN: 0,
        HUE_MAX: 359,
        SATURATION_MIN: 40,
        SATURATION_MAX: 50,
        LIGHTNESS_MIN: 40,
        LIGHTNESS_MAX: 60,
    },

    INIT_SETTINGS: {
        INITIAL_RADIUS: 100,
    },
} as const;

export const PHYSICS = {
    FORCES: {
        COLOUMBS_LAW: 1000,
        SPRING: 0.025,
        CENTRAL_SPRING: 0.075,
        REST_LENGTH: 50,
        BOX_BUFFER: 10,
        DAMPING: 0.9,
    },
    CLAMPS: {
        MAX_SPEED: 20,
    },
} as const;

export function randomNum(min: number, max: number) {
    /** Returns a random number inbetween and inclusive of min and max params */
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

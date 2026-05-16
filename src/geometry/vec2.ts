// geometry/vec2.ts
// Lightweight 2D vector utilities used throughout the editor. Functions are
// implemented as pure functions returning new objects (immutability) which makes
// them safe to use in functional/reactive flows.
export type Vec2 = {
    x: number;
    y: number;
};

/**
 * Add two 2D vectors.
 * @param v1 - first vector
 * @param v2 - second vector
 * @returns a new Vec2 equal to v1 + v2
 */
export function add2(v1: Vec2, v2: Vec2) {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y,
    };
}

/**
 * Subtract one 2D vector from another (v1 - v2).
 * @param v1 - minuend vector
 * @param v2 - subtrahend vector
 * @returns the difference vector
 */
export function diff2(v1: Vec2, v2: Vec2) {
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y,
    };
}

/**
 * Compute Euclidean length of a 2D vector.
 * @param v - input vector
 * @returns length (non-negative number)
 */
export function magnitude2(v: Vec2) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

/**
 * Normalize a 2D vector. If the vector is zero-length the original vector
 * object is returned to avoid division by zero.
 * @param v - input vector
 * @returns unit vector (or original vector when length is zero)
 */
export function normalize2(v: Vec2): Vec2 {
    const mag = magnitude2(v);
    return mag === 0 ? v : {
        x: v.x / mag,
        y: v.y / mag,
    };
}

/**
 * Scale a 2D vector by a scalar.
 * @param v - input vector
 * @param k - scale factor
 * @returns scaled vector
 */
export function scale2(v: Vec2, k: number) {
    return {
        x: v.x * k,
        y: v.y * k,
    };
}

/**
 * Dot product of two 2D vectors.
 * @param v1 - first vector
 * @param v2 - second vector
 * @returns scalar dot product
 */
export function dot2(v1: Vec2, v2: Vec2) {
    return v1.x * v2.x + v1.y * v2.y;
}

/**
 * Return a vector perpendicular to `v`. Orientation is controlled by
 * the `clockwise` flag.
 * @param v - input vector
 * @param clockwise - when true returns the clockwise-perpendicular
 * @returns perpendicular vector
 */
export function perpendicular(v: Vec2, clockwise: boolean = false) {
    // noinspection JSSuspiciousNameCombination
    return clockwise ? { x: v.y, y: -v.x, } : { x: -v.y, y: v.x, };
}


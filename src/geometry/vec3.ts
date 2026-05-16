// geometry/vec3.ts
// Basic 3D vector operations used by curve sampling and mesh generation.
// All functions are pure and return new objects (no mutation) to keep code
// predictable in React/hook-based flows.
import type { Vec2 } from './vec2.ts';

export type Vec3 = {
    x: number;
    y: number;
    z: number;
};

/**
 * Create a Vec3 from a Vec2 by adding a Z component.
 * @param vec2 - 2D vector input
 * @param z - Z component
 * @returns new Vec3
 */
export function createVec3(vec2: Vec2, z: number): Vec3 {
    return {
        ...vec2,
        z: z,
    };
}

/**
 * Element-wise addition of 3D vectors.
 * @param v1 - first vector
 * @param v2 - second vector
 * @returns v1 + v2
 */
export function add3(v1: Vec3, v2: Vec3): Vec3 {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y,
        z: v1.z + v2.z,
    };
}

/**
 * Subtract v2 from v1 (v1 - v2).
 * @param v1 - minuend
 * @param v2 - subtrahend
 * @returns difference vector
 */
export function diff3(v1: Vec3, v2: Vec3): Vec3 {
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y,
        z: v1.z - v2.z,
    };
}

/**
 * Euclidean length of a 3D vector.
 * @param v - input vector
 * @returns length (non-negative)
 */
export function magnitude3(v: Vec3): number {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

/**
 * Normalize a 3D vector. Returns the original vector for zero-length input to
 * avoid NaNs.
 * @param v - input vector
 * @returns normalized vector or original when length is zero
 */
export function normalize3(v: Vec3): Vec3 {
    const mag = magnitude3(v);
    return mag === 0 ? v : {
        x: v.x / mag,
        y: v.y / mag,
        z: v.z / mag,
    };
}

/**
 * Scale a 3D vector by a scalar.
 * @param v - input vector
 * @param k - scale factor
 * @returns scaled vector
 */
export function scale3(v: Vec3, k: number): Vec3 {
    return {
        x: v.x * k,
        y: v.y * k,
        z: v.z * k,
    };
}

/**
 * Dot product of two 3D vectors.
 * @param v1 - first vector
 * @param v2 - second vector
 * @returns scalar dot product
 */
export function dot3(v1: Vec3, v2: Vec3): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

/**
 * Cross product (right-hand rule).
 * @param v1 - first vector
 * @param v2 - second vector
 * @returns cross product vector
 */
export function cross3(v1: Vec3, v2: Vec3): Vec3 {
    return {
        x: v1.y * v2.z - v1.z * v2.y,
        y: v1.z * v2.x - v1.x * v2.z,
        z: v1.x * v2.y - v1.y * v2.x,
    };
}

/**
 * Transform a vector between two orthonormal bases.
 * @param v - vector expressed in source basis
 * @param fromRight - source basis right vector
 * @param fromForward - source basis forward vector
 * @param fromUp - source basis up vector
 * @param toRight - target basis right vector
 * @param toForward - target basis forward vector
 * @param toUp - target basis up vector
 * @returns vector expressed in target basis
 */
export function convertCoordinateSystem3(
    v: Vec3,
    fromRight: Vec3, fromForward: Vec3, fromUp: Vec3,
    toRight: Vec3, toForward: Vec3, toUp: Vec3
): Vec3 {
    const localR = dot3(v, fromRight);
    const localF = dot3(v, fromForward);
    const localU = dot3(v, fromUp);

    return {
        x: toRight.x * localR + toForward.x * localF + toUp.x * localU,
        y: toRight.y * localR + toForward.y * localF + toUp.y * localU,
        z: toRight.z * localR + toForward.z * localF + toUp.z * localU,
    }
}
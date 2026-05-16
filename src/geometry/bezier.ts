// geometry/bezier.ts
// Cubic Bezier evaluation and derivative helpers for scalar, 2D and 3D values.
// Implemented as pure deterministic functions which are easy to test.
import type { Vec2 } from './vec2.ts';
import type { Vec3 } from './vec3.ts';

/**
 * Evaluate a 1D cubic Bézier curve at parameter t in [0,1].
 * Uses the standard Bernstein basis.
 * @param p0 - first control point (t=0)
 * @param p1 - second control point
 * @param p2 - third control point
 * @param p3 - fourth control point (t=1)
 * @param t - parameter in [0,1]
 * @returns interpolated scalar value
 */
export function cubicBezier(p0: number, p1: number, p2: number, p3: number, t: number): number {
    const u = 1 - t;

    // Standard Bernstein basis cubic polynomial
    return u * u * u * p0 +
        3 * u * u * t * p1 +
        3 * u * t * t * p2 +
        t * t * t * p3;
}

/**
 * Compute first derivative of a 1D cubic Bezier at parameter t.
 * Useful for tangent/velocity computations.
 * @param p0 - first control point
 * @param p1 - second control point
 * @param p2 - third control point
 * @param p3 - fourth control point
 * @param t - parameter in [0,1]
 * @returns derivative scalar value
 */
export function cubicBezierDerivative(p0: number, p1: number, p2: number, p3: number, t: number): number {
    const u = 1 - t;

    return 3 * u * u * (p1 - p0) +
        6 * u * t * (p2 - p1) +
        3 * t * t * (p3 - p2);
}

/**
 * 2D cubic Bezier evaluation (per-component delegation).
 * @param p0 - first 2D control point
 * @param p1 - second 2D control point
 * @param p2 - third 2D control point
 * @param p3 - fourth 2D control point
 * @param t - parameter in [0,1]
 * @returns interpolated 2D point
 */
export function cubicBezier2(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
    return {
        x: cubicBezier(p0.x, p1.x, p2.x, p3.x, t),
        y: cubicBezier(p0.y, p1.y, p2.y, p3.y, t),
    };
}

/**
 * 2D cubic Bezier derivative (per-component delegation).
 * @returns derivative vector (2D)
 */
export function cubicBezierDerivative2(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
    return {
        x: cubicBezierDerivative(p0.x, p1.x, p2.x, p3.x, t),
        y: cubicBezierDerivative(p0.y, p1.y, p2.y, p3.y, t),
    };
}

/**
 * 3D cubic Bezier evaluation (per-component delegation).
 * @returns interpolated 3D point
 */
export function cubicBezier3(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, t: number): Vec3 {
    return {
        x: cubicBezier(p0.x, p1.x, p2.x, p3.x, t),
        y: cubicBezier(p0.y, p1.y, p2.y, p3.y, t),
        z: cubicBezier(p0.z, p1.z, p2.z, p3.z, t),
    };
}

/**
 * 3D cubic Bezier derivative (per-component delegation).
 * @returns derivative vector (3D)
 */
export function cubicBezierDerivative3(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, t: number): Vec3 {
    return {
        x: cubicBezierDerivative(p0.x, p1.x, p2.x, p3.x, t),
        y: cubicBezierDerivative(p0.y, p1.y, p2.y, p3.y, t),
        z: cubicBezierDerivative(p0.z, p1.z, p2.z, p3.z, t),
    };
}
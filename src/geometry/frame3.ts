import type { CurveNode3 } from './curveNode';
import { cubicBezier, cubicBezier3, cubicBezierDerivative3 } from './bezier.ts';
import { cross3, normalize3, scale3, type Vec3 } from './vec3';

export type Frame3 = {
    position: Vec3;
    forward: Vec3;
    right: Vec3;
    up: Vec3;
}

export function sampleCurveSegmentFrames3(
    node1: CurveNode3, node2: CurveNode3,
    width1: number, width2: number,
    includeLast: boolean, resolution: number
): Frame3[] {
    const axs: Frame3[] = [];

    const steps = includeLast ? resolution : resolution - 1;

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;

        const position = cubicBezier3(node1.position, node1.tangentEnd2, node2.tangentEnd1, node2.position, t);
        const forward = normalize3(cubicBezierDerivative3(node1.position, node1.tangentEnd2, node2.tangentEnd1, node2.position, t));
        const right = cross3({ x: 0, y: 0, z: 1 }, forward);
        const up = cross3(forward, right);

        const width = cubicBezier(width1, width1, width2, width2, t);
        const rightScaled = scale3(right, width);

        axs.push({ position: position, forward: forward, right: rightScaled, up: up });
    }

    return axs;
}

export function sampleCurveFrames3(
    curveNodes: CurveNode3[], curveWidths: number[],
    closedPath: boolean, resolution: number
): Frame3[] {
    const axs: Frame3[] = [];

    const segmentsNumber = closedPath ? curveNodes.length : curveNodes.length - 1;

    for (let i = 0; i < segmentsNumber; i++) {
        const node1 = curveNodes[i];
        const node2 = curveNodes[(i + 1) % curveNodes.length];

        const width1 = curveWidths[i];
        const width2 = curveWidths[(i + 1) % curveWidths.length];

        const includeLast = i == segmentsNumber - 1 && !closedPath;

        axs.push(...sampleCurveSegmentFrames3(node1, node2, width1, width2, includeLast, resolution));
    }

    return axs;
}
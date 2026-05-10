import type { CurveNode2 } from './curveNode';
import { cubicBezier, cubicBezier2, cubicBezierDerivative2 } from './interpolation.ts';
import { normalize2, perpendicular, scale2, type Vec2 } from './vec2.ts';

export type Frame2 = {
    position: Vec2;
    forward: Vec2;
    right: Vec2;
}

export function sampleCurveSegment2(
    node1: CurveNode2, node2: CurveNode2,
    width1: number, width2: number,
    includeLast: boolean, resolution: number
): Frame2[] {
    const axs: Frame2[] = [];

    const steps = includeLast ? resolution : resolution - 1;

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;

        const position = cubicBezier2(node1.position, node1.tangentEnd2, node2.tangentEnd1, node2.position, t);
        const forward = normalize2(cubicBezierDerivative2(node1.position, node1.tangentEnd2, node2.tangentEnd1, node2.position, t));
        const right = perpendicular(forward);

        const width = cubicBezier(width1, width1, width2, width2, t);
        const rightScaled = scale2(right, width);

        axs.push({ position: position, forward: forward, right: rightScaled });
    }

    return axs;
}

export function sampleCurve2(
    curveNodes: CurveNode2[], curveWidths: number[],
    closedPath: boolean, resolution: number
): Frame2[] {
    const axs: Frame2[] = [];

    const segmentsNumber = closedPath ? curveNodes.length : curveNodes.length - 1;

    for (let i = 0; i < segmentsNumber; i++) {
        const node1 = curveNodes[i];
        const node2 = curveNodes[(i + 1) % curveNodes.length];

        const width1 = curveWidths[i];
        const width2 = curveWidths[(i + 1) % curveWidths.length];

        const includeLast = i == segmentsNumber - 1 && !closedPath;

        axs.push(...sampleCurveSegment2(node1, node2, width1, width2, includeLast, resolution));
    }

    return axs;
}
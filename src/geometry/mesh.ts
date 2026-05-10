import type { CurveNode3 } from './curveNode.ts';
import { sampleCurve3 } from './sampleCurve3';
import { type Vec2 } from './vec2.ts';
import { type Vec3 } from './vec3.ts';

export function generateSweepSurfaceMesh(
    curveNodes: CurveNode3[],
    curveWidths: number[],
    closedPath: boolean,
    profile: Vec2[],
    resolution: number,
    skipPoligonIdx?: number[]
) {
    const vertices: Vec3[] = [];
    const indices: number[] = [];

    const axs = sampleCurve3(curveNodes, curveWidths, closedPath, resolution);

    const lastAxesIdx = axs.length - 1;
    const lastCrossSectionVertexIdx = profile.length - 1;

    let vertexIdx = 0;

    for (let i = 0; i < axs.length; i++) {
        const ax = axs[i];
        for (let j = 0; j < profile.length; j++) {
            const pt = profile[j];

            vertices.push({
                x: ax.position.x + ax.right.x * pt.x + ax.up.x * pt.y,
                y: ax.position.y + ax.right.y * pt.x + ax.up.y * pt.y,
                z: ax.position.z + ax.right.z * pt.x + ax.up.z * pt.y,
            });

            const rightmostVertex = j == lastCrossSectionVertexIdx;
            const currentRowIsLast = i == lastAxesIdx;
            const nextRowIsFirst = currentRowIsLast && closedPath;

            if (
                !rightmostVertex
                && (skipPoligonIdx == null || !skipPoligonIdx.includes(j))
                && (!currentRowIsLast || closedPath)
            ) {
                const a = vertexIdx;
                const b = a + 1;
                const c = nextRowIsFirst ? j : a + profile.length;
                const d = c + 1;

                indices.push(a, c, b);
                indices.push(b, c, d);
            }

            if (rightmostVertex && nextRowIsFirst) break;

            vertexIdx++;
        }
    }

    return { vertices, indices };
}

export function generateRoadProfile(width: number, height: number) {
    const halfWidth = width / 2;
    const roadProfile: Vec2[] = [
        { x: -halfWidth, y: -height },
        { x: -halfWidth, y: 0 },
        { x: -halfWidth, y: 0 },
        { x: halfWidth, y: 0 },
        { x: halfWidth, y: 0 },
        { x: halfWidth, y: -height },
    ];
    const skipPoligonIdx: number[] = [1, 3];
    return { roadProfile, skipPoligonIdx };
}
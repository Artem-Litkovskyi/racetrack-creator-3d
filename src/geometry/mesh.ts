import type { CurveNode3 } from './curveNode.ts';
import { sampleCurveFrames3 } from './frame3';
import { type Vec2 } from './vec2.ts';
import { type Vec3 } from './vec3.ts';

export function generateSweepSurfaceMesh(
    curveNodes: CurveNode3[],
    curveWidths: number[],
    profile: Vec2[],
    resolution: number,
    closedPath: boolean,
    skipPolygonIdx?: number[]
) {
    const vertices: Vec3[] = [];
    const indices: number[] = [];

    const axs = sampleCurveFrames3(curveNodes, curveWidths, closedPath, resolution);

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
                && (skipPolygonIdx == null || !skipPolygonIdx.includes(j))
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
    const profile: Vec2[] = [
        { x: -halfWidth, y: -height },
        { x: -halfWidth, y: 0 },
        { x: -halfWidth, y: 0 },
        { x: halfWidth, y: 0 },
        { x: halfWidth, y: 0 },
        { x: halfWidth, y: -height },
    ];
    const skipPolygonIdx: number[] = [1, 3];
    return { profile, skipPolygonIdx };
}
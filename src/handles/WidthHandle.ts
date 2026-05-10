import type { DragContext, Handle } from './Handle.ts';
import { dot2, type Vec2 } from '../geometry/vec2.ts';

export function createWidthHandle(
    index: number,
    direction: Vec2,
    invert: boolean,
    updateWidth: (i: number, u: (prev: number) => number) => void,
): Handle {
    return {
        onDrag: (ctx: DragContext) => {
            const deltaProjection = dot2(ctx.delta, direction);
            updateWidth(index, (prev) => (
                Math.max(1, prev + (invert ? -deltaProjection : deltaProjection))
            ));
        }
    };
}
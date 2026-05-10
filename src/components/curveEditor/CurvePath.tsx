import React from 'react';
import type { CurveNode2 } from '../../geometry/curveNode.ts';
import { curveSegmentToPathCommands } from '../../utils/svg.ts';

interface CurvePathProps {
    className?: string;
    curveNode1: CurveNode2;
    curveNode2: CurveNode2;
    curveWidth1: number;
    curveWidth2: number;
    onMouseDown?: (e: React.MouseEvent<SVGElement>) => void;
}

export function CurvePath({ className, curveNode1, curveNode2, curveWidth1, curveWidth2, onMouseDown }: CurvePathProps) {
    const d = curveSegmentToPathCommands(curveNode1, curveNode2, curveWidth1, curveWidth2, 50);

    return (
        <path
            d={d}
            className={className}
            onMouseDown={(e) => {
                e.stopPropagation();
                onMouseDown?.(e);
            }}
        />
    )
}
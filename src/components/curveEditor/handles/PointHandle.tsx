import type { HandleProps } from './HandleProps.ts';

interface PointHandleProps extends HandleProps {
    label?: string;
}

export function PointHandle({ className, svgKey, label, origin, onMouseDown }: PointHandleProps) {
    return (
        <>
            <circle
                className={className}
                key={`${svgKey}-circle`}
                cx={origin.x}
                cy={origin.y}
                r={8}
                onMouseDown={(e) => {
                    e.stopPropagation();
                    onMouseDown(e);
                }}
            />

            <text
                className={className}
                key={`${svgKey}-text`}
                textAnchor='middle'
                dominantBaseline='middle'
                x={origin.x}
                y={origin.y + 1}
                fontSize={14}
            >
                {label}
            </text>
        </>
    )
}
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
                x={origin.x - 3.5}
                y={origin.y + 4.5}
                fontSize={14}
            >
                {label}
            </text>
        </>
    )
}
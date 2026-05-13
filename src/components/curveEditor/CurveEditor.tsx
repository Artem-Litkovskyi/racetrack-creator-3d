import React, { useEffect, useMemo, useState } from 'react';
import { Box, Fab, Tooltip } from '@mui/material';
import CropFreeIcon from '@mui/icons-material/CropFree';

import { ArmHandle } from './handles/ArmHandle.tsx'
import { ArrowUpHandle } from './handles/ArrowUpHandle.tsx';
import { PointHandle } from './handles/PointHandle.tsx'
import { RotateHorizontalHandle } from './handles/RotateHorizontalHandle.tsx';
import { CurvePath } from './CurvePath.tsx';

import { createPitchHandle } from '../../handles/PitchHandle.ts';
import { createPosXYHandle } from '../../handles/PosXYHandle.ts';
import { createPosZHandle } from '../../handles/PosZHandle.ts';
import { createTangentHandle } from '../../handles/TangentHandle.ts';
import { createWidthHandle } from '../../handles/WidthHandle.ts';
import { CurveEditorControlHints } from './CurveEditorControlHints.tsx';
import { CurveEditorGrid } from './CurveEditorGrid.tsx';

import { useHandleDrag } from '../../hooks/useHandleDrag.ts';
import { usePanZoom } from '../../hooks/usePanZoom.ts';
import { useProjectContext } from '../../hooks/useProjectContext.ts';

import { createCurveNode3, getCurveBoundingBox3 } from '../../geometry/curveNode.ts';
import { add2, diff2, normalize2, perpendicular, scale2 } from '../../geometry/vec2.ts';
import { createVec3 } from '../../geometry/vec3.ts';

import { curveWorldToSvg, getFitPanZoom, screenToWorld } from '../../utils/svg.ts';

export function CurveEditor() {
    const {
        project: { closedPath, roadWidths, curveNodes },
        selectedNode,
        setSelectedNode,
        updateRoadWidth,
        updateNode,
        addNode,
        removeNode,
    } = useProjectContext();

    const [svg, setSvg] = useState<SVGSVGElement | null>(null);

    // Pan and zoom handling
    const { panZoom, setPanZoom, bind: panZoomBind } = usePanZoom(svg);

    const fitToScreen = () => {
        if (!svg) return;
        const { min, max } = getCurveBoundingBox3(curveNodes);
        setPanZoom(getFitPanZoom(min.x, min.y, max.x, max.y, svg.clientWidth, svg.clientHeight, Math.max(...roadWidths)));
    }

    // Fit to screen on the first load
    useEffect(() => {
        if (!svg) return;
        fitToScreen();
    }, [svg]);

    // Coordinates convertion
    const convertedNodes = useMemo(() => {
        if (!svg) return curveNodes;
        return curveWorldToSvg(curveNodes, svg.clientHeight, panZoom);
    }, [curveNodes, svg, panZoom]);

    const convertedWidth = useMemo(() => {
        return roadWidths.map(w => w * panZoom.zoom);
    }, [roadWidths, panZoom.zoom]);

    const selectedRight =
        selectedNode != null
            ? normalize2(perpendicular(diff2(curveNodes[selectedNode].tangentEnd1, curveNodes[selectedNode].position)))
            : null;

    const selectedRightConverted =
        selectedNode != null
            ? normalize2(perpendicular(diff2(convertedNodes[selectedNode].tangentEnd1, convertedNodes[selectedNode].position)))
            : null;

    const selectedRightConvertedScaled =
        selectedNode != null && selectedRightConverted != null
            ? scale2(selectedRightConverted, roadWidths[selectedNode] * panZoom.zoom)
            : null;

    // Drag handling
    const { onHandleDragStart, bind: handleDragBind } = useHandleDrag(svg, panZoom);

    const onCanvasDragStart = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svg || e.button !== 0) return;

        const xy = screenToWorld(e.clientX, e.clientY, svg, panZoom);
        const z = curveNodes[curveNodes.length - 1].position.z;

        addNode(createCurveNode3(createVec3(xy, z)));
        setSelectedNode(curveNodes.length);
        onHandleDragStart(createTangentHandle(curveNodes.length, updateNode, 'tangentEnd2', true), e);
    }

    const onPathDragStart = (index: number, e: React.MouseEvent<SVGElement>) => {
        if (!svg) return;

        const xy = screenToWorld(e.clientX, e.clientY, svg, panZoom);
        const z = curveNodes[index - 1].position.z;

        addNode(createCurveNode3(createVec3(xy, z)), index);
        setSelectedNode(index);
        onHandleDragStart(createTangentHandle(index, updateNode, 'tangentEnd2', true), e);
    }

    // Key press handling
    const onKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
        if (e.key !== 'Backspace' && e.key !== 'Delete') return;
        if (curveNodes.length <= 2 || selectedNode == null) return;

        e.preventDefault();

        removeNode(selectedNode);
        setSelectedNode(null);
    }

    // Visual feedback
    const [handleOffsetY, setHandleOffsetY] = useState(0);
    const [posZHandleSelected, setPosZHandleSelected] = useState(false);

    const [handleRotation, setHandleRotation] = useState(0);
    const [pitchHandleSelected, setPitchHandleSelected] = useState(false);

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ position: 'relative', flex: 1 }}>
                <svg
                    ref={setSvg}
                    className={'curve-editor'}
                    tabIndex={0}
                    onKeyDown={onKeyDown}
                    onMouseDown={(e) => {
                        e.currentTarget.focus();
                        panZoomBind.onMouseDown(e);
                        onCanvasDragStart(e);
                    }}
                    onMouseMove={(e) => {
                        panZoomBind.onMouseMove(e);
                        handleDragBind.onMouseMove(e);
                    }}
                    onMouseUp={() => {
                        panZoomBind.onMouseUp();
                        handleDragBind.onMouseUp();
                        setPosZHandleSelected(false);
                        setPitchHandleSelected(false);
                    }}
                    onMouseLeave={() => {
                        panZoomBind.onMouseLeave();
                        handleDragBind.onMouseLeave();
                        setPosZHandleSelected(false);
                        setPitchHandleSelected(false);
                    }}
                    onWheel={panZoomBind.onWheel}
                    onContextMenu={(e) => e.preventDefault()}
                >
                    {svg && (
                        <CurveEditorGrid
                            className={'curve-editor-grid'}
                            canvasWidth={svg.clientWidth}
                            canvasHeight={svg.clientHeight}
                            panZoom={panZoom}
                            spacing={panZoom.zoom > 2 ? 10 : 100}
                        />
                    )}

                    {convertedNodes.slice(0, -1).map((n0, i) => (
                        <CurvePath
                            className={'curve-path'}
                            key={`section-${i}`}
                            curveNode1={n0}
                            curveNode2={convertedNodes[i+1]}
                            curveWidth1={convertedWidth[i]}
                            curveWidth2={convertedWidth[i+1]}
                            onMouseDown={(e) => onPathDragStart(i+1, e)}
                        />
                    ))}

                    {closedPath && (
                        <CurvePath
                            className={'curve-path closed'}
                            key={`section-${curveNodes.length - 1}`}
                            curveNode1={convertedNodes[curveNodes.length - 1]}
                            curveNode2={convertedNodes[0]}
                            curveWidth1={convertedWidth[curveNodes.length - 1]}
                            curveWidth2={convertedWidth[0]}
                            onMouseDown={(e) => onPathDragStart(curveNodes.length, e)}
                        />
                    )}

                    {convertedNodes.map((node, index) => (
                        <g key={index}>
                            {/* Z position label */}
                            {panZoom.zoom > 0.5 && (
                                <text
                                    className={'node-label'}
                                    key={`node-label-${index}`}
                                    x={node.position.x + 20}
                                    y={node.position.y + 5}
                                >
                                    height: {curveNodes[index].position.z.toFixed(1)}
                                </text>
                            )}

                            {/* Selected node */}
                            {index === selectedNode && selectedRight && selectedRightConvertedScaled && (
                                <>
                                    {/* Tangent handles */}
                                    <ArmHandle
                                        className={'tangent-handle'}
                                        svgKey={`tangent1-handle-${index}`}
                                        label={'1'}
                                        origin={node.position}
                                        end={node.tangentEnd1}
                                        onMouseDown={(e) => onHandleDragStart(
                                            createTangentHandle(index, updateNode, 'tangentEnd1'), e)}
                                    />

                                    <ArmHandle
                                        className={'tangent-handle'}
                                        svgKey={`tangent2-handle-${index}`}
                                        label={'2'}
                                        origin={node.position}
                                        end={node.tangentEnd2}
                                        onMouseDown={(e) => onHandleDragStart(
                                            createTangentHandle(index, updateNode, 'tangentEnd2'), e)}
                                    />

                                    {/* Road width handles */}
                                    <ArmHandle
                                        className={'width-handle'}
                                        svgKey={`width-handle1-${index}`}
                                        label={'w'}
                                        origin={node.position}
                                        end={add2(node.position, selectedRightConvertedScaled)}
                                        onMouseDown={(e) => onHandleDragStart(
                                            createWidthHandle(index, selectedRight, true, updateRoadWidth), e)}
                                    />

                                    <ArmHandle
                                        className={'width-handle'}
                                        svgKey={`width-handle2-${index}`}
                                        label={'w'}
                                        origin={node.position}
                                        end={diff2(node.position, selectedRightConvertedScaled)}
                                        onMouseDown={(e) => onHandleDragStart(
                                            createWidthHandle(index, selectedRight, false, updateRoadWidth), e)}
                                    />

                                    {/* Pos Z handle */}
                                    <ArrowUpHandle
                                        className={`pos-z-handle ${posZHandleSelected && 'selected'}`}
                                        svgKey={`pos-z-handle-${index}`}
                                        origin={node.position}
                                        offsetY={handleOffsetY}
                                        onMouseDown={(e) => onHandleDragStart(
                                            createPosZHandle(
                                                index, updateNode, 0.25,
                                                setHandleOffsetY, 0.1, 10,
                                                setPosZHandleSelected,
                                            ), e)}
                                    />

                                    {/* Pitch handle */}
                                    <RotateHorizontalHandle
                                        className={`pitch-handle ${pitchHandleSelected && 'selected'}`}
                                        svgKey={`pitch-handle-${index}`}
                                        origin={node.position}
                                        rotation={handleRotation}
                                        onMouseDown={(e) => onHandleDragStart(
                                            createPitchHandle(
                                                index, updateNode, 0.5,
                                                setHandleRotation, 0.5, 10,
                                                setPitchHandleSelected,
                                            ), e)}
                                    />
                                </>
                            )}

                            {/* Node circle */}
                            <PointHandle
                                className={`pos-xy-handle ${index === selectedNode ? 'selected' : ''}`}
                                svgKey={`pos-xy-handle-${index}`}
                                label={`${index + 1}`}
                                origin={node.position}
                                onMouseDown={(e) => onHandleDragStart(
                                    createPosXYHandle(index, setSelectedNode, updateNode), e)}
                            />
                        </g>
                    ))}
                </svg>

                <Tooltip title='Fit to Screen'>
                    <Fab
                        color='primary'
                        size='small'
                        sx={{ position: 'absolute', bottom: 16, right: 16 }}
                        onClick={fitToScreen}
                    >
                        <CropFreeIcon />
                    </Fab>
                </Tooltip>
            </Box>

            <CurveEditorControlHints zoom={panZoom.zoom} />
        </Box>
    );
}

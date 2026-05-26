import { Typography } from '@mui/material';

import { PanelSection } from '../MuiWrappers.tsx';
import { NumberInput } from '../inputs/NumberInput.tsx';
import { Vec3Input } from '../inputs/Vec3Input.tsx';

import { useProjectContext } from '../../hooks/useProjectContext.ts';

import {
    setNodePosition3,
    setCollinearTangentEnd3,
    getTangentPitch3,
    setCollinearTangentPitch3
} from '../../geometry/curveNode.ts';

export function NodeParamsSection() {
    const {
        project: { roadWidths, curveNodes },
        selectedNode,
        setRoadWidth,
        setNode,
    } = useProjectContext();

    const node = selectedNode != null ? curveNodes[selectedNode] : null;

    return (
        <PanelSection>
            <Typography variant='h6'>Selected Node</Typography>

            {selectedNode != null && node ? (
                <>
                    <Vec3Input
                        id={'node-position-input'}
                        label='Node Position'
                        value={node.position}
                        setValue={v => setNode(selectedNode, setNodePosition3(node, v))}
                    />

                    <Vec3Input
                        id={'tangent1-end-input'}
                        label='Tangent 1 End'
                        value={node.tangentEnd1}
                        setValue={v => setNode(selectedNode, setCollinearTangentEnd3(node, 'tangentEnd1', v))}
                    />

                    <Vec3Input
                        id={'tangent2-end-input'}
                        label='Tangent 2 End'
                        value={node.tangentEnd2}
                        setValue={v => setNode(selectedNode, setCollinearTangentEnd3(node, 'tangentEnd2', v))}
                    />

                    <NumberInput
                        id={'pitch-input'}
                        label='Pitch'
                        endAdornmentLabel='°'
                        minValue={-89}
                        maxValue={89}
                        value={getTangentPitch3(node)}
                        setValue={(v) => {
                            setNode(selectedNode, setCollinearTangentPitch3(node, v));
                        }}
                    />

                    <NumberInput
                        id={'road-width-input'}
                        label='Road Width'
                        minValue={1}
                        value={roadWidths[selectedNode]}
                        setValue={(v) => {
                            setRoadWidth(selectedNode, v)
                        }}
                    />
                </>
            ) : (
                <Typography variant='body2'>No node selected</Typography>
            )}
        </PanelSection>
    )
}
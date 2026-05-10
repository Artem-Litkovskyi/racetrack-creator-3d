import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { PanelSection } from '../MuiWrappers.tsx';
import { CustomInput } from '../inputs/CustomInput.tsx';
import { useProjectContext } from '../../hooks/useProjectContext.ts';

export function RoadParamsSection() {
    const {
        project: { closedPath, sideHeight },
        updateProject,
    } = useProjectContext();
    
    return (
        <PanelSection>
            <Typography variant='h6'>Road Parameters</Typography>

            <FormControlLabel
                label='Closed Path'
                sx={{ p: 0 }}
                control={<Checkbox
                    checked={closedPath}
                    onChange={(e) => {
                        updateProject('closedPath', Boolean(e.target.checked))
                    }}
                />}
            />

            <CustomInput
                label='Side Height'
                type='number'
                placeholder='0'
                value={sideHeight}
                onChange={(e) => {
                    updateProject('sideHeight', Math.max(0.25, Number(e.target.value)))
                }}
            />
        </PanelSection>
    )
}
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { PanelSection } from '../MuiWrappers.tsx';
import { NumberInput } from '../inputs/NumberInput.tsx';
import { useProjectContext } from '../../hooks/useProjectContext.ts';

export function RoadParamsSection() {
    const {
        project: { closedPath, profileHeight },
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

            <NumberInput
                id={'profile-height-input'}
                label='Profile Height'
                value={profileHeight}
                minValue={0.1}
                setValue={(v) => {
                    updateProject('profileHeight', v)
                }}
            />
        </PanelSection>
    )
}
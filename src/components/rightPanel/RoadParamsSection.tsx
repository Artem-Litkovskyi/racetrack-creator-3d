import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { PanelSection } from '../MuiWrappers.tsx';
import { CustomInput } from '../inputs/CustomInput.tsx';
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

            <CustomInput
                id={'profile-height-input'}
                label='Profile Height'
                type='number'
                placeholder='0'
                value={profileHeight}
                onChange={(e) => {
                    updateProject('profileHeight', Math.max(0, Number(e.target.value)))
                }}
            />
        </PanelSection>
    )
}
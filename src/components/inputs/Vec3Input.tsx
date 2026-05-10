import { FormGroup, FormLabel } from '@mui/material';
import { HorizontalBoxWithGap } from '../MuiWrappers.tsx';
import { CoordinateInput } from './CoordinateInput.tsx';
import type { Vec3 } from '../../geometry/vec3.ts';

interface Vec3InputProps {
    id: string,
    label?: string;
    value: Vec3;
    setValue: (value: Vec3) => void;
}

export function Vec3Input({ id, label, value, setValue }: Vec3InputProps) {
    return (
        <FormGroup>
            <FormLabel htmlFor={id} className='input-label'>{label}</FormLabel>

            <HorizontalBoxWithGap>
                <CoordinateInput id={id} label={'X:'} value={value.x} setValue={x => setValue({...value, x: x})} />
                <CoordinateInput id={`${id}-1`} label={'Y:'} value={value.y} setValue={y => setValue({...value, y: y})} />
                <CoordinateInput id={`${id}-2`} label={'Z:'} value={value.z} setValue={z => setValue({...value, z: z})} />
            </HorizontalBoxWithGap>
        </FormGroup>
    )
}
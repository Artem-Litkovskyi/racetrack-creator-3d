import { FormGroup, FormLabel } from '@mui/material';
import { HorizontalBoxWithGap } from '../MuiWrappers.tsx';
import { NumberInput } from './NumberInput.tsx';
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
            {label && (
                <FormLabel htmlFor={id} className='input-label'>
                    {label}
                </FormLabel>
            )}

            <HorizontalBoxWithGap>
                <NumberInput
                    id={id}
                    startAdornmentLabel={'X:'}
                    value={value.x}
                    setValue={x => setValue({...value, x: x})}
                />

                <NumberInput
                    id={`${id}-1`}
                    startAdornmentLabel={'Y:'}
                    value={value.y}
                    setValue={y => setValue({...value, y: y})}
                />

                <NumberInput
                    id={`${id}-2`}
                    startAdornmentLabel={'Z:'}
                    value={value.z}
                    setValue={z => setValue({...value, z: z})}
                />
            </HorizontalBoxWithGap>
        </FormGroup>
    )
}
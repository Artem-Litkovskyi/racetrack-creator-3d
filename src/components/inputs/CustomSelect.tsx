import { FormControl, FormLabel, type SelectProps, Select } from '@mui/material';

export function CustomSelect({ id, label, ...rest }: SelectProps) {
    return (
        <FormControl variant='standard'>
            <FormLabel htmlFor={id} className='input-label'>{label}</FormLabel>
            <Select id={id} {...rest} />
        </FormControl>
    )
}
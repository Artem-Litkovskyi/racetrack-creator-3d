import { FormGroup, FormLabel, TextField, type TextFieldProps } from '@mui/material';

export function CustomInput({ id, label, ...rest }: TextFieldProps) {
    return (
        <FormGroup>
            <FormLabel htmlFor={id} className='input-label'>{label}</FormLabel>
            <TextField id={id} {...rest} />
        </FormGroup>
    )
}
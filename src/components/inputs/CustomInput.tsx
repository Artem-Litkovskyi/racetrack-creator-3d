import React from 'react';
import { FormGroup, FormLabel, TextField, type TextFieldProps } from '@mui/material';

export function CustomInput({ id, label, ...rest }: TextFieldProps) {
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { type, value } = e.target;

        if (type !== 'number') return;
        if (value === '') return;

        e.target.value = value.replace(/^0+(?=\d)/, '');
    };

    return (
        <FormGroup>
            <FormLabel htmlFor={id} className='input-label'>{label}</FormLabel>
            <TextField id={id} onBlur={handleBlur} {...rest} />
        </FormGroup>
    )
}
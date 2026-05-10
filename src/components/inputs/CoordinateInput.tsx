import { InputAdornment, TextField, Typography } from '@mui/material';

interface CoordinateInputProps {
    id: string,
    label?: string;
    value: number;
    setValue: (value: number) => void;
}

export function CoordinateInput({ id, label, value, setValue }: CoordinateInputProps) {
    return (
        <TextField
            id={id}
            type='number'
            placeholder='0'
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment
                            position='start'
                            sx={{ transform: 'translateY(-3px)' }}
                        >
                            <Typography variant={'body2'}>
                                {label}
                            </Typography>
                        </InputAdornment>
                    ),
                },
            }}
        />
    )
}
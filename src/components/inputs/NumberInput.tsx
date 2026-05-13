import React, { useEffect, useState } from 'react';
import { FormGroup, FormLabel, InputAdornment, TextField, Typography } from '@mui/material';

export interface NumberInputProps {
    id: string;
    label?: string;

    startAdornmentLabel?: string;
    endAdornmentLabel?: string;

    minValue?: number;
    maxValue?: number;

    decimals?: number;

    value: number;
    setValue: (value: number) => void;
}

export function NumberInput(props: NumberInputProps) {
    const [textValue, setTextValue] = useState(String(props.value));

    // Sync external value
    useEffect(() => {
        setTextValue(String(props.value));
    }, [props.value]);

    const validateValue = (value: string) => {
        // Allow temporary editing states
        if (
            value === '' ||
            value === '-' ||
            value === '.' ||
            value === '-.'
        ) {
            return true;
        }

        // Valid signed float
        return /^-?\d*\.?\d*$/.test(value);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;

        if (!validateValue(value)) {
            return;
        }

        // Limit decimals
        if (props.decimals !== undefined) {
            const decimalPart = value.split('.')[1];

            if (
                decimalPart &&
                decimalPart.length > props.decimals
            ) {
                return;
            }
        }

        let normalizedValue = value;

        // Allow replacing initial 0 with "-"
        if (value === '0-') {
            normalizedValue = '-';
        }

        setTextValue(normalizedValue);

        // Don't update numeric value during incomplete states
        if (
            normalizedValue === '' ||
            normalizedValue === '-' ||
            normalizedValue === '.' ||
            normalizedValue === '-.'
        ) {
            return;
        }

        const parsed = Number(normalizedValue);

        if (!Number.isNaN(parsed)) {
            props.setValue(parsed);
        }
    };

    const handleBlur = () => {
        let value = textValue;

        // Reset invalid temporary states
        if (
            value === '' ||
            value === '-' ||
            value === '.' ||
            value === '-.'
        ) {
            value = String(props.value);
        }

        let numberValue = Number(value);

        if (Number.isNaN(numberValue)) {
            numberValue = props.value;
        }

        // Clamp
        if (props.minValue !== undefined) {
            numberValue = Math.max(
                props.minValue,
                numberValue
            );
        }

        if (props.maxValue !== undefined) {
            numberValue = Math.min(
                props.maxValue,
                numberValue
            );
        }

        // Round decimals
        if (props.decimals !== undefined) {
            numberValue = Number(
                numberValue.toFixed(props.decimals)
            );
        }

        props.setValue(numberValue);
        setTextValue(String(numberValue));
    };

    const inputSlotProps =
        props.startAdornmentLabel || props.endAdornmentLabel
            ? {
                input: {
                    startAdornment: props.startAdornmentLabel ? (
                        <InputAdornment
                            position='start'
                            sx={{ transform: 'translateY(-3px)' }}
                        >
                            <Typography variant={'body2'}>
                                {props.startAdornmentLabel}
                            </Typography>
                        </InputAdornment>
                    ) : undefined,

                    endAdornment: props.endAdornmentLabel ? (
                        <InputAdornment
                            position='end'
                            sx={{ transform: 'translateY(-3px)' }}
                        >
                            <Typography variant={'body2'}>
                                {props.endAdornmentLabel}
                            </Typography>
                        </InputAdornment>
                    ) : undefined,
                },
            }
            : undefined;

    return (
        <FormGroup>
            {props.label && (
                <FormLabel htmlFor={props.id} className='input-label'>
                    {props.label}
                </FormLabel>
            )}

            <TextField
                id={props.id}
                type='text'
                value={textValue}
                onChange={handleChange}
                onBlur={handleBlur}
                slotProps={inputSlotProps}
            />
        </FormGroup>
    );
}
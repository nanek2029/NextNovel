// this is a component where the left side of the input is a dropdown between greater than less than 
// and right side is a number input
// user can set an upper or lower limit 

import { useState } from 'react';
import { NumberInput, Select, Group, ComboboxChevron } from '@mantine/core';

export type FilterType = 'pages' | 'years';

interface NumberFilterInputProps {
    value?: number | string;
    type?: FilterType; // 'pages' | 'years'
    onChange?: (value: number | string) => void;
    operatorValue?: string;
    onOperatorChange?: (operator: string) => void;
    placeholder?: string;
}

export default function NumberRange({ type = 'pages', value = '', onChange, operatorValue = '>',
    onOperatorChange, placeholder 
}: NumberFilterInputProps) {
    const [internalOp, setInternalOp] = useState(operatorValue);
    const [internalVal, setInternalVal] = useState<number | string>(value);

    const handleOpChange = (val: string | null) => {
        const newOp = val || '>';
        setInternalOp(newOp);
        if (onOperatorChange) onOperatorChange(newOp);
    };

    const handleValChange = (val: number | string) => {
        setInternalVal(val);
        if (onChange) onChange(val);
    };

    const selectOptions =
    type === 'years'
      ? [
          { value: '>', label: 'After year' },
          { value: '<', label: 'Before year' },
        ]
      : [
          { value: '>', label: 'More than' },
          { value: '<', label: 'Less than' },
        ];

        const defaultPlaceholder =
            placeholder ?? (type === 'years' ? 'e.g. 2020' : 'e.g. 300');
            const minLimit = type === 'years' ? 0 : 0;

    return (
        <Group gap={0} wrap="nowrap" style={{ width: '100%', minWidth: 0 }}>
            {/*  dropdown on the left */}
            <Select
                data={selectOptions}
                value={internalOp}
                onChange={handleOpChange}
                allowDeselect={false}
                withCheckIcon={false}
                styles={{
                    input: {
                        borderWidth: '1.7px',
                        borderColor: '#54733e',
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        borderRight: 'none',
                        fontWeight: 400,
                        color: '#87B766',
                        backgroundColor: '#ffffff',
                        textAlign: 'left',
                    },
                    dropdown: {
                        borderColor: '#54733e',
                        borderWidth: '1.7px',
                    },
                    option: {
                        color: '#3A5B22',
                        '&[data-selected]': {
                            backgroundColor: '#87B766',
                            color: '#ffffff',
                        },
    
                    }
                }}
                style={{ width: '55%', flexShrink: 0 }}
            />

            {/* number input on right  */}
            <NumberInput
                placeholder={defaultPlaceholder}
                value={internalVal}
                min={minLimit}
                onChange={handleValChange}
                rightSection={<ComboboxChevron color="#3A5B22" style={{ opacity: 0.8 }} />}
                styles={{
                    input: {
                        borderWidth: '1.7px',
                        borderColor: '#54733e',
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        color: '#3A5B22',
                        fontWeight: 400,
                    },
                    control: {
                        borderColor: '#54733e',
                        color: '#3A5B22',
                        '&:hover': {
                        backgroundColor: '#f4f7f2',
                        },
                    }
                }}
                style={{ flex: 1, minWidth: 0 }}
            />
        </Group>
    );
}
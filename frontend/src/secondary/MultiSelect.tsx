import { useState } from 'react';
import { Checkbox, Combobox, Group, Input, Pill, PillsInput, useCombobox } from '@mantine/core';

// inspired by mantine's multi select component, but with checkboxes and pills for selected values
// https://mantine.dev/combobox/?e=MultiSelectCheckbox

interface MultiSelectProps {
  optionsList: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export default function MultiSelectCheckbox({ optionsList, selectedValues, onChange, placeholder = "Pick one or more values" }: MultiSelectProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const handleValueSelect = (val: string) => {
    const nextValue = selectedValues.includes(val) 
      ? selectedValues.filter((v) => v !== val) 
      : [...selectedValues, val];
    onChange(nextValue);
  };

  const handleValueRemove = (val: string) => {
    onChange(selectedValues.filter((v) => v !== val));
  };

  const values = selectedValues.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}
        radius="md" fw={500} size="md" style={{ backgroundColor: '#87B766', color: '#FFFFFF' }}>
      {item}
    </Pill>
  ));

  const options = optionsList.map((item) => (
    <Combobox.Option value={item} key={item} active={selectedValues.includes(item)}>
      <Group gap="sm">
        <Checkbox
          checked={selectedValues.includes(item)}
          onChange={() => {}}
          aria-hidden
          tabIndex={-1}
          color="#87B766"
          style={{ pointerEvents: 'none'}}
        />
        <span style={{ color: '#3A5B22' }}>{item}</span>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false} position="bottom" middlewares={{flip:false}}>
      <Combobox.DropdownTarget>
        <PillsInput pointer onClick={() => combobox.toggleDropdown()}
            styles={{
                input: {borderWidth: '1.7px', borderColor: '#54733e'},
            }}
        >
          <Pill.Group>
            {values.length > 0 ? (
              values
            ) : (
              <Input.Placeholder>{placeholder}</Input.Placeholder>
            )}
            <Combobox.EventsTarget>
              <PillsInput.Field
                type="hidden"
                onBlur={() => combobox.closeDropdown()}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && selectedValues.length > 0) {
                    event.preventDefault();
                    handleValueRemove(selectedValues[selectedValues.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>
      <Combobox.Dropdown style={{ borderColor: '#54733e', borderWidth: '1.7px' }}>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
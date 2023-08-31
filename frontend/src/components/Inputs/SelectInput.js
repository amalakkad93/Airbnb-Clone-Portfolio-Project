// SelectInput.js
import React from 'react';

export default function SelectInput({ value, options = [], placeholder, onChange, ...props }) {
    return (
      <select value={value} onChange={onChange} {...props}>
          <option value="">{placeholder}</option>
          {options.map((option) => (
              <option key={option.id} value={option.id}>{option.name}</option>
          ))}
      </select>
    );
}


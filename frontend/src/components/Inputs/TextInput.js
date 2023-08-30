import React from 'react';

export default function TextInput({
  id,
  value,
  onChange,
  ...props
}) {
  return (
    <input
      type="text"
      id={id}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}

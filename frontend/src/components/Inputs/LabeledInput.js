import React from 'react';
import FormError from './FormError';

function LabeledInput({ title, error, children }) {
  return (
    <div class="labeledInput-div">
        <FormError title={title} error={error} />
        {children}
    </div>
  );
}

export { LabeledInput };

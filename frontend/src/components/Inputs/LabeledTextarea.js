import React from 'react';
import FormError from './FormError';

function LabeledTextarea({ title, error, children }) {
  return (
    <div>
      <FormError title={title} error={error} />
      {children}
    </div>
  );
}

export { LabeledTextarea };

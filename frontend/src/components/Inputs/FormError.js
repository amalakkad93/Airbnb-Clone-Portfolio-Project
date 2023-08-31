
import React from 'react';

export default function FormError({ title, error }) {
  return (
    <div className="errors-p-tag">
        <p className="form-p-tag">{title}</p>
        {error && (<p className="errors">{error}</p>)}
    </div>
  );
}

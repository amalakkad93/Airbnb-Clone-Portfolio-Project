// import FormError from './FormError'
// import SelectInput from './SelectInput';

// export default function LabeledSelect({ title, error, ...props }) {
//   return (
//       <div>
//           <FormError title={title} error={error} />
//           <SelectInput {...props} />
//       </div>
//   );
// }

import React from 'react';
import FormError from './FormError';

function LabeledInput({ title, error, children }) {
  return (
    <div>
        <FormError title={title} error={error} />
        {children}
    </div>
  );
}

export { LabeledInput };

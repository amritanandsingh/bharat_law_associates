import React from 'react';
import './forms.css';

// Floating-label field. `as` may be 'input' | 'textarea' | 'select'.
const FormField = ({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  as = 'input',
  required = false,
  children,
  ...rest
}) => {
  const describedBy = error ? `${id}-error` : undefined;
  const shared = {
    id,
    value,
    required,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    onChange: (e) => onChange(e.target.value),
    placeholder: ' ',
    ...rest,
  };

  return (
    <div className={`field ${error ? 'field-error' : ''} field-${as}`}>
      {as === 'textarea' && <textarea rows={4} {...shared} />}
      {as === 'select' && <select {...shared}>{children}</select>}
      {as === 'input' && <input type={type} {...shared} />}
      <label htmlFor={id}>{label}</label>
      {error && (
        <p className="field-message" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;

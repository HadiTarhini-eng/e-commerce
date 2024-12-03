import React from 'react';

const InputField = ({
  type,
  title,
  placeholder,
  id,
  value,
  onChange,
  required = false,
  options = [],
  rows,
}) => {
  // Handle different input types
  switch (type) {
    case 'text':
    case 'number':
      return (
        <div>
          <label htmlFor={id} className="text-sm font-medium">
            {title}
          </label>
          <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      );

    case 'select':
      return (
        <div>
          <label htmlFor={id} className="text-sm font-medium">
            {title}
          </label>
          <select
            id={id}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">{placeholder}</option>
            {/* Safely check if options is an array and has items */}
            {Array.isArray(options) && options.length > 0 ? (
              options.map((option, idx) => (
                <option key={idx} value={option.title}>
                  {option.title}
                </option>
              ))
            ) : (
              <option disabled>No options available</option> // Fallback if options is not an array or empty
            )}
          </select>
        </div>
      );

    case 'textarea':
      return (
        <div>
          <label htmlFor={id} className="text-sm font-medium">
            {title}
          </label>
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            required={required}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      );

    default:
      return null;
  }
};

export default InputField;

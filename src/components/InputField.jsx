import React, { useState } from 'react';

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
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

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

    case 'password':
      return (
        <div>
          <label htmlFor={id} className="text-sm font-medium">
            {title}
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id={id}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              required={required}
              className="w-full px-3 py-2 border rounded"
            />
            {/* Toggle password visibility */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-sm text-gray-500 dark:text-gray-300"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
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
            {Array.isArray(options) && options.length > 0 ? (
              options.map((option, idx) => (
                <option key={idx} value={option.title}>
                  {option.title}
                </option>
              ))
            ) : (
              <option disabled>No options available</option>
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
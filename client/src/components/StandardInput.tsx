import React from 'react';

type StandardInputProps = {
  value: string;
  handleChange:
    | ((
        e:
          | React.ChangeEvent<HTMLInputElement>
          | React.ChangeEvent<HTMLTextAreaElement>
          | React.ChangeEvent<HTMLSelectElement>,
      ) => void)
    | ((e: React.ChangeEvent<HTMLInputElement>) => void);
  labelText: string;
  name: string;
  type?: string;
  autoComplete?: string;
  autoCapitalize?: string;
  required?: boolean;
};

function StandardInput(props: StandardInputProps) {
  const {
    value,
    handleChange,
    labelText,
    name,
    type,
    autoComplete,
    autoCapitalize,
    required,
  } = props;

  return (
    <>
      <label
        htmlFor={name}
        className="block text-gray-700 text-sm font-bold mb-3 dark:text-gray-dark"
      >
        {labelText}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        required={required}
      />
    </>
  );
}

StandardInput.defaultProps = {
  type: 'text',
  autoComplete: 'on',
  autoCapitalize: 'off',
  required: true,
};

export default StandardInput;

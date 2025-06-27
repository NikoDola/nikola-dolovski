// components/form/FormComponents.tsx
"use client";

type RadioGroupProps = {
  title: string;
  name: string;
  options: { value: string; label: string }[];
  currentValue: string;
  onChange: (value: string) => void;
};

export function RadioGroup({
  title,
  name,
  options,
  currentValue,
  onChange,
}: RadioGroupProps) {
  return (
    <div className="form-section">
      <h3 className="section-title">{title}</h3>
      <div className="radios-wrapper">
        {options.map((option) => (
          <label key={option.value} className="radio-wrapper">
            <input
              className="radio-input"
              type="radio"
              name={name}
              checked={currentValue === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className="radio-label">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

type CheckboxGroupProps = {
  title: string;
  options: string[];
  selectedOptions: string[];
  onChange: (options: string[]) => void;
};

export function CheckboxGroup({
  title,
  options,
  selectedOptions,
  onChange,
}: CheckboxGroupProps) {
  return (
    <div className="form-section">
      <h3 className="section-title">{title}</h3>
      <div className="checkboxes-wrapper">
        {options.map((option) => (
          <label key={option} className="checkbox-wrapper">
            <input
              className="checkbox-input"
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={(e) =>
                onChange(
                  e.target.checked
                    ? [...selectedOptions, option]
                    : selectedOptions.filter((o) => o !== option)
                )
              }
            />
            <span className="checkbox-label">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
"use client";

import { Controller } from "react-hook-form";

export const InputField = ({
  label,
  name,
  control,
  required = false,
  type = "text",
  placeholder = "",
  error = null,
  min,
  step,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            {...field}
            type={type}
            placeholder={placeholder}
            min={min}
            step={step}
            className={`px-4 py-2 border rounded-lg font-medium text-gray-900 placeholder:text-gray-400 transition-colors ${error
                ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              }`}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      )}
    />
  );
};

export const SelectField = ({
  label,
  name,
  control,
  options = [],
  required = false,
  placeholder = "",
  error = null,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            {...field}
            className={`px-4 py-2 border rounded-lg font-medium text-gray-900 transition-colors ${error
                ? "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                : "border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              }`}
          >
            <option value="">{placeholder || "Select option"}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      )}
    />
  );
};

export const CheckboxGroup = ({
  label,
  name,
  control,
  options = [],
  error = null,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-3">
            {label}
          </label>

          {/* ROW LAYOUT */}
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {options.map((option) => {
              const optionValue =
                typeof option === "string" ? option : option.label;
              const isChecked =
                Array.isArray(value) && value.includes(optionValue);

              return (
                <div key={optionValue} className="flex items-start">
                  <input
                    type="checkbox"
                    id={`${name}-${optionValue}`}
                    checked={isChecked}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...(value || []), optionValue]
                        : (value || []).filter((v) => v !== optionValue);
                      onChange(newValue);
                    }}
                    className=" w-4 h-4 accent-purple-600 cursor-pointer"
                  />

                  <label
                    htmlFor={`${name}-${optionValue}`}
                    className="ml-2 cursor-pointer flex flex-col"
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {optionValue}
                    </span>
                    {typeof option === "object" && option.description && (
                      <span className="text-xs text-gray-500">
                        {option.description}
                      </span>
                    )}
                  </label>
                </div>
              );
            })}
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      )}
    />
  );
};

export const SelectField = ({
    label,
    name,
    register,
    options,
    required,
    error,
}) => (
    <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 block">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
            {...register(name, {
                required: required ? required : false,
            })}
            className={`w-full px-4 py-3 sm:py-2.5 text-sm rounded-lg border-2 transition-all duration-200 focus:outline-none appearance-none bg-white cursor-pointer ${error
                    ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    : "border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }`}
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                paddingRight: "2.5rem",
            }}
        >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
        {error && (
            <p className="text-xs font-medium text-red-500">
                {error.message}
            </p>
        )}
    </div>
);
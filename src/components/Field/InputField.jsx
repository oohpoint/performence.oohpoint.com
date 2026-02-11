export const InputField = ({
    label,
    name,
    register,
    type = "text",
    placeholder,
    required,
    error,
    icon,
}) => (
    <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 block">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
            {icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    {icon}
                </div>
            )}
            <input
                type={type}
                placeholder={placeholder}
                {...register(name, {
                    required: required ? required : false,
                })}
                className={`w-full px-4 py-3 sm:py-2.5 text-sm rounded-lg border-2 transition-all duration-200 focus:outline-none ${icon ? "pl-12" : ""
                    } ${error
                        ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        : "border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    }`}
            />
        </div>
        {error && (
            <p className="text-xs font-medium text-red-500">
                {error.message}
            </p>
        )}
    </div>
);
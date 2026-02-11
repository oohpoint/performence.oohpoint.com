import React from "react";

const Card = ({
    title,
    value,
    icon: Icon,
    iconBg = "bg-indigo-50",
    iconColor = "text-indigo-600",
    cardClass = "",
    valueClass = "",
}) => {
    return (
        <div
            className={`bg-white rounded-2xl border border-slate-200 p-5  hover:shadow-sm transition ${cardClass}`}
        >
            <div className="flex flex-col items-start gap-4">
                {/* Icon */}
                <div
                    className={`h-9 w-9 rounded-lg flex items-center justify-center ${iconBg}`}
                >
                    {Icon && <Icon size={20} className={iconColor} />}
                </div>

                {/* Content */}
                <div>
                    <p className="text-[11px] font-bold tracking-normal text-slate-400 uppercase">
                        {title}
                    </p>
                    <p
                        className={` text-lg font-bold text-slate-900 ${valueClass}`}
                    >
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Card;

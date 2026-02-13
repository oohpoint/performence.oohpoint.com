const ProfileCard = ({ label, value, icon: Icon, trend, color, suffix = "" }) => {
    const colorMap = {
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        orange: "bg-orange-50 text-orange-600 border-orange-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        red: "bg-red-50 text-red-600 border-red-100",
        yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
        purple: "bg-purple-50 text-purple-600 border-purple-100",
        teal: "bg-teal-50 text-teal-600 border-teal-100",

    };

    return (
        <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
                </div>
                <div className="text-xl font-semibold text-slate-900 tabular-nums">{value}</div>
            </div>
            {/* {subValue && <div className="text-[11px] text-slate-400 mt-2">{subValue}</div>} */}
        </div>);
};

export default ProfileCard;
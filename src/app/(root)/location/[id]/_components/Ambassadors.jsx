import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    User,
    Phone,
    BookOpen,
    Plus,
    X,
    MapPin,
    MoreVertical,
    ChevronRight,
    Loader2
} from 'lucide-react';

// --- Sub-components for Production UI ---

const Badge = ({ children, variant = 'active' }) => {
    const variants = {
        active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        draft: 'bg-amber-50 text-amber-700 border-amber-100',
        inactive: 'bg-slate-50 text-slate-600 border-slate-100',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${variants[variant] || variants.inactive}`}>
            {children}
        </span>
    );
};

const CustomInput = ({ label, icon: Icon, error, ...props }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                {Icon && React.cloneElement(Icon, { size: 16 })}
            </div>
            <input
                {...props}
                className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm transition-all outline-none
          ${error ? 'border-red-500 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50'}`}
            />
        </div>
        {error && <p className="text-[11px] text-red-500 ml-1 font-medium">{error.message}</p>}
    </div>
);

// --- Main Component ---

const Ambassadors = ({ location }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            phoneNumber: '',
            course: '',
            year: 'First Year'
        }
    });

    const onSubmit = async (data, isDraft = false) => {
        try {
            setIsLoading(true);
            const payload = {
                locationId: location.id,
                name: data.name,
                phoneNumber: data.phoneNumber,
                course: data.course,
                year: data.year,
                status: isDraft ? "draft" : "active",
            };

            await fetch("/api/ambassadors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            await new Promise(resolve => setTimeout(resolve, 800));

            setIsModalOpen(false);
            reset();
        } catch (error) {
            console.error("Submission failed:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const ambassadors = location?.ambassador
        ? [{ id: location.id, ...location.ambassador }]
        : [];
    console.log(ambassadors)

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6 bg-slate-50 font-sans">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-black hover:bg-black text-white rounded-md text-sm font-bold transition-all active:scale-95 "
                >
                    <Plus size={18} />
                    <span>Add Ambassador</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {/* Table View (Hidden on small screens) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Ambassador</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Education</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Assigned</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {ambassadors.length > 0 ? (
                                ambassadors.map((amb) => (
                                    <tr key={amb.id} className="group hover:bg-indigo-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">

                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{amb.name}</p>
                                                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">ID: {amb.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-700 font-medium">{amb.course || '—'}</p>
                                            <p className="text-xs text-slate-500">{amb.year || 'N/A'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={amb.status}>{amb.status}</Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-md text-[11px] font-bold text-slate-600">
                                                <MapPin size={12} />
                                                {amb.assignedLocations || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-all">
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center opacity-40">
                                            <User size={48} className="mb-2 text-slate-300" />
                                            <p className="text-sm font-medium text-slate-500">No ambassadors listed yet</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Card View (Mobile only) */}
                <div className="md:hidden divide-y divide-slate-100">
                    {ambassadors.map((amb) => (
                        <div key={amb.id} className="p-4 space-y-3 active:bg-slate-50">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                                        {amb.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">{amb.name}</h3>
                                        <p className="text-xs text-slate-500">{amb.course} • {amb.year}</p>
                                    </div>
                                </div>
                                <Badge variant={amb.status}>{amb.status}</Badge>
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <div className="text-[10px] font-mono text-slate-400 uppercase">ID: {amb.id}</div>
                                <button className="text-indigo-600 text-xs font-bold flex items-center gap-1">
                                    Details <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Improved Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => !isLoading && setIsModalOpen(false)}
                    />

                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Add New Ambassador</h2>
                                <p className="text-xs text-slate-500">Fill in the representative details below.</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form
                            onSubmit={handleSubmit((data) => onSubmit(data, false))}
                            className="p-6 overflow-y-auto space-y-5"
                        >
                            <CustomInput
                                label="Full Name"
                                placeholder="John Doe"
                                icon={<User />}
                                error={errors.name}
                                {...register('name', { required: 'Name is required' })}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <CustomInput
                                    label="Phone Number"
                                    placeholder="9876543210"
                                    icon={<Phone />}
                                    error={errors.phoneNumber}
                                    {...register('phoneNumber', {
                                    })}
                                />
                                <CustomInput
                                    label="Course"
                                    placeholder="e.g. B.Tech"
                                    icon={<BookOpen />}
                                    error={errors.course}
                                    {...register('course', { required: 'Course is required' })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 ml-1">Current Year</label>
                                <Controller
                                    name="year"
                                    control={control}
                                    render={({ field }) => (
                                        <select
                                            {...field}
                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            {["First Year", "Second Year", "Third Year", "Final Year"].map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    )}
                                />
                            </div>

                            {/* Form Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-slate-100">
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    onClick={handleSubmit((data) => onSubmit(data, true))}
                                    className="flex-1 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all border border-slate-200 disabled:opacity-50"
                                >
                                    Save Draft
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-5 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        "Activate Account"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ambassadors;
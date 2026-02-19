"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
    Users,
    Search,
    SlidersHorizontal,
    X,
    MoreVertical,
    Eye,
    Pencil,
    UserMinus,
    MapPin,
    ShieldAlert,
    Phone,
    Mail,
    Building,
    UserCheck,
    GraduationCap,
    Loader2,
    AlertCircle,
    User,
    Clock
} from "lucide-react";
import Card from "@/components/Card";
import { useRouter } from "next/navigation";

const InternalActionMenu = ({ isOpen, actions, menuRef }) => {
    if (!isOpen) return null;
    return (
        <div
            ref={menuRef}
            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 animate-in fade-in zoom-in duration-100"
        >
            {actions.map((action, idx) => (
                <button
                    key={idx}
                    onClick={() => {
                        action.onClick();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${action.isDanger ? "text-red-600 hover:bg-red-50" : "text-gray-700 hover:bg-gray-50"
                        }`}
                >
                    <action.icon size={16} />
                    {action.label}
                </button>
            ))}
        </div>
    );
};

const InternalEmptyState = ({ title, description, action, type = "empty" }) => (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${type === 'error' ? 'bg-red-50' : 'bg-gray-50'}`}>
            {type === 'error' ? (
                <AlertCircle size={40} className="text-red-400" />
            ) : (
                <Users size={40} className="text-gray-300" />
            )}
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-gray-500 max-w-sm mt-2 mb-6">{description}</p>
        {action && (
            <button
                onClick={action.onClick}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
            >
                {action.label}
            </button>
        )}
    </div>
);

const InternalLoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 mt-4 font-medium">Synchronizing user directory...</p>
    </div>
);




export default function App() {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ total: 0, active: 0, students: 0, suspended: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [copied, setCopied] = useState(false);
    const router = useRouter();


    const menuRef = useRef(null);

    const [filters, setFilters] = useState({
        ageBand: [],
        gender: [],
        profession: [],
        city: [],
        campus: [],
        riskStatus: [],
    });

    const filterOptions = {
        ageBands: ["18-21", "22-25", "26-30", "31+"],
        genders: ["Male", "Female", "Non-binary", "Other"],
        professions: ["College Student", "Working Professional", "Freelancer", "Unemployed"],
        cities: ["Mumbai", "Delhi", "Bangalore", "Pune", "Noida", "Hyderabad"],
        riskStatuses: ["Active", "Suspended"]
    };


    const toggleBlockStatus = async (user) => {
        try {
            const res = await fetch("/api/users/block", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: user.id,
                    isBlocked: !user.isBlocked,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            // Optimistic UI update
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === user.id ? { ...u, isBlocked: !u.isBlocked } : u
                )
            );

            // Update stats instantly
            setStats((prev) => ({
                ...prev,
                active: !user.isBlocked ? prev.active - 1 : prev.active + 1,
                suspended: !user.isBlocked ? prev.suspended + 1 : prev.suspended - 1,
            }));

            setOpenMenuId(null);
        } catch (err) {
            console.error("Toggle Block Error:", err);
            alert("Failed to update user status.");
        }
    };


    /**
     * API FETCHING LOGIC WITH EXPONENTIAL BACKOFF
     */
    const fetchUsers = useCallback(async (retryCount = 0) => {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (searchQuery) params.append("q", searchQuery);

        Object.entries(filters).forEach(([key, values]) => {
            if (values.length > 0) params.append(key, values.join(","));
        });

        try {
            const response = await fetch(`/api/users?${params.toString()}`);

            if (!response.ok) {
                if (response.status >= 500 && retryCount < 3) {
                    const delay = Math.pow(2, retryCount) * 1000;
                    setTimeout(() => fetchUsers(retryCount + 1), delay);
                    return;
                }
                throw new Error("Failed to fetch users from server.");
            }

            const data = await response.json();
            const list = Array.isArray(data) ? data : data.users || [];
            setUsers(list);

            setStats({
                total: list.length,
                active: list.filter(u => !u.isBlocked).length,
                students: list.filter(u => u.lifeStage === "College Student").length,
                suspended: list.filter(u => u.isBlocked).length,
            });

        } catch (err) {
            console.error("User Fetch Error:", err);
            setError("We couldn't load the user list. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }, [searchQuery, filters]);

    useEffect(() => {
        // Debounce search/filter requests
        const timeout = setTimeout(() => {
            fetchUsers();
        }, 400);
        return () => clearTimeout(timeout);
    }, [fetchUsers]);

    // Handle clicking outside of action menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => {
            const current = prev[key];
            const newValues = current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
            return { ...prev, [key]: newValues };
        });
    };

    const clearAllFilters = () => {
        setFilters({ ageBand: [], gender: [], profession: [], city: [], campus: [], riskStatus: [] });
        setSearchQuery("");
    };




    return (
        <div className="in-h-screen bg-[#f9fafb] px-10 py-4 pt-6">


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <Card title="Total Registry" value={stats.total} icon={Users} />
                <Card title="Verified Active" value={stats.active} icon={UserCheck} />
                <Card title="Student Profiles" value={stats.students} icon={GraduationCap} />
                <Card title="System Suspensions" value={stats.suspended} icon={ShieldAlert} />
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by User ID, Email, or Phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all "
                    />
                </div>
                <button
                    onClick={() => setFilterPanelOpen(true)}
                    className={`flex items-center justify-center gap-2 px-6 py-3 border rounded-xl transition-all font-semibold text-sm  ${Object.values(filters).flat().length > 0
                        ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                >
                    <SlidersHorizontal size={18} />
                    Refine Search
                    {Object.values(filters).flat().length > 0 && (
                        <span className="ml-1 w-5 h-5 flex items-center justify-center bg-blue-600 text-white text-[10px] font-bold rounded-full animate-in zoom-in">
                            {Object.values(filters).flat().length}
                        </span>
                    )}
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200  overflow-hidden min-h-[500px] flex flex-col">
                {loading ? (
                    <InternalLoadingSpinner />
                ) : error ? (
                    <InternalEmptyState
                        type="error"
                        title="Connection Error"
                        description={error}
                        action={{ label: "Retry Connection", onClick: fetchUsers }}
                    />
                ) : users.length === 0 ? (
                    <InternalEmptyState
                        title="No Results Found"
                        description="We couldn't find any users matching those parameters. Try resetting your search."
                        action={{ label: "Reset All Filters", onClick: clearAllFilters }}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Identified User</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Demographics</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Primary Locale</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Risk Profile</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">lastLoginAt</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-blue-50/30 transition-all group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10">
                                                    {user.profilePicture ? <img src={user.profilePicture} alt="" className="w-full h-full rounded-full object-cover" /> : <User className="w-full h-full p-1 border-2 border-gray-400 text-gray-400 rounded-full object-cover" />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 flex items-center gap-2">
                                                        {user.name}
                                                        <span
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(user.id);
                                                                setCopied(true);
                                                                setTimeout(() => setCopied(false), 1500);
                                                            }}
                                                            className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-mono select-all cursor-pointer hover:bg-gray-200"
                                                        >
                                                            {copied ? "Copied!" : `#ID: ${user.id.slice(-6)}`}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 mt-1">
                                                        <span className="text-xs text-gray-400 flex items-center gap-1"><Mail size={12} /> {user.email}</span>
                                                        <span className="text-xs text-gray-400 flex items-center gap-1"><Phone size={12} /> {user.phoneNumber}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm text-gray-700 font-semibold">{user.lifeStage}</div>
                                            <div className="text-xs text-gray-400 mt-1">{user.gender} • {user.ageBand || user.age} yrs</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="text-sm text-gray-700 flex items-center gap-1.5 font-medium">
                                                    <MapPin size={14} className="text-blue-400" />
                                                    {user.address || "Unknown"}
                                                </div>
                                                <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                                                    <Building size={14} className="text-gray-300" />
                                                    {user.campus || "Regional Center"}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-tight border ${user.isBlocked
                                                ? "bg-red-50 text-red-600 border-red-100"
                                                : "bg-green-50 text-green-600 border-green-100"
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${user.isBlocked ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                                {user.isBlocked ? "SUSPENDED" : "ACTIVE"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="text-sm text-gray-600 flex items-center gap-1 font-semibold">
                                                <Clock size={16} className="text-red-600 " />
                                                {user.lastLoginAt
                                                    ? new Date(user.lastLoginAt).toLocaleString("en-IN", {
                                                        dateStyle: "medium",
                                                        timeStyle: "short",
                                                    })
                                                    : "30 days ago"}
                                            </div>

                                        </td>
                                        <td className="px-6 py-5  relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <MoreVertical size={20} />
                                            </button>
                                            <InternalActionMenu
                                                isOpen={openMenuId === user.id}
                                                menuRef={menuRef}
                                                actions={[
                                                    {
                                                        label: "View Profile",
                                                        icon: Eye,
                                                        onClick: () => {
                                                            setOpenMenuId(null);
                                                            router.push(`/users/${user.id}`);
                                                        }
                                                    },
                                                    {
                                                        label: user.isBlocked ? "Activate" : "Suspend",
                                                        icon: UserMinus,
                                                        onClick: () => toggleBlockStatus(user),
                                                        isDanger: !user.isBlocked
                                                    }
                                                ]}

                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>


            {/* Slide-over Filter Panel */}
            {filterPanelOpen && (
                <div className="fixed inset-0 z-[100] overflow-hidden">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setFilterPanelOpen(false)} />
                    <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l">

                        <div className="flex-1 overflow-y-auto p-6 space-y-10">
                            {/* Demographics Group */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <Users size={18} />
                                        <h3 className="text-xs font-black uppercase tracking-widest">Demographics</h3>
                                    </div>
                                    <button onClick={() => setFilterPanelOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-all">
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="space-y-6 pl-1">
                                    <FilterSection label="Age Band" options={filterOptions.ageBands} selected={filters.ageBand} onChange={(v) => handleFilterChange("ageBand", v)} />
                                    <FilterSection label="Gender" options={filterOptions.genders} selected={filters.gender} onChange={(v) => handleFilterChange("gender", v)} />
                                    <FilterSection label="Profession" options={filterOptions.professions} selected={filters.profession} onChange={(v) => handleFilterChange("profession", v)} />
                                </div>
                            </div>

                            {/* Location Group */}
                            <div className="space-y-4 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-indigo-600">
                                    <MapPin size={18} />
                                    <h3 className="text-xs font-black uppercase tracking-widest">Location</h3>
                                </div>
                                <div className="space-y-6 pl-1">
                                    <FilterSection label="Active City" options={filterOptions.cities} selected={filters.city} onChange={(v) => handleFilterChange("city", v)} />
                                </div>
                            </div>

                            {/* Risk Group */}
                            <div className="space-y-4 pt-6 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-red-600">
                                    <ShieldAlert size={18} />
                                    <h3 className="text-xs font-black uppercase tracking-widest">Risk & Security</h3>
                                </div>
                                <div className="flex flex-wrap gap-2 pl-1">
                                    {filterOptions.riskStatuses.map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleFilterChange("riskStatus", status)}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${filters.riskStatus.includes(status)
                                                ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-100"
                                                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t flex gap-4">
                            <button onClick={clearAllFilters} className="flex-1 py-3 border border-gray-200 bg-white rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                                Clear All
                            </button>
                            <button onClick={() => setFilterPanelOpen(false)} className="flex-1 py-3 bg-blue-600 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
                                Apply Selection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function FilterSection({ label, options, selected, onChange }) {
    return (
        <div>
            <label className="text-[10px] font-bold text-gray-400 block mb-3 uppercase tracking-widest">{label}</label>
            <div className="flex flex-wrap gap-2">
                {options.map(opt => (
                    <button
                        key={opt}
                        onClick={() => onChange(opt)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${selected.includes(opt)
                            ? "bg-blue-600 border-blue-600 text-white "
                            : "bg-white border-gray-100 text-gray-500 hover:border-gray-200 "
                            }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}
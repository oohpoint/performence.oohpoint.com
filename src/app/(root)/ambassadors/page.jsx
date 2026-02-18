"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
    Search,
    Filter,
    Eye,
    Pencil,
    MoreVertical,
    CheckCircle,
    Clock,
    Wallet,
    Trash,
    UserPlus,
    AlertCircle,
    MapPin,
    Phone,
    GraduationCap,
    Users,
    TrendingUp,
    Building2,
    UserCheck,
    Calendar
} from "lucide-react";
import Card from "@/components/Card";
import { useRouter } from "next/navigation";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

const BADGE_CONFIG = {
    active: {
        style: "bg-emerald-100 text-emerald-700 border-emerald-200",
        icon: CheckCircle
    },
    inactive: {
        style: "bg-slate-100 text-slate-600 border-slate-200",
        icon: null
    },
    "pre-activation": {
        style: "bg-amber-100 text-amber-700 border-amber-200",
        icon: Clock
    }
};

const Badge = ({ variant, children }) => {
    const config = BADGE_CONFIG[variant?.toLowerCase()] || BADGE_CONFIG.inactive;
    const Icon = config.icon;

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize inline-flex items-center gap-1.5 border ${config.style}`}>
            {Icon && <Icon size={10} />}
            {children}
        </span>
    );
};

const LoadingState = () => (
    <tr>
        <td colSpan={4} className="px-4 md:px-6 py-20 text-center text-slate-400">
            <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Loading ambassadors...</span>
            </div>
        </td>
    </tr>
);

const ErrorState = ({ error, onRetry }) => (
    <tr>
        <td colSpan={4} className="px-4 md:px-6 py-20 text-center text-rose-500">
            <div className="flex flex-col items-center gap-2">
                <AlertCircle size={32} />
                <span className="text-sm font-semibold">{error}</span>
                <button onClick={onRetry} className="text-xs underline text-indigo-600 mt-2 hover:text-indigo-700">
                    Retry
                </button>
            </div>
        </td>
    </tr>
);

const EmptyState = () => (
    <tr>
        <td colSpan={4} className="px-4 md:px-6 py-20 text-center text-slate-400">
            <div className="flex flex-col items-center gap-2 opacity-50">
                <Search size={32} />
                <span className="text-sm">No ambassadors found</span>
            </div>
        </td>
    </tr>
);

const ActionMenu = ({ isOpen, ambassador, onClose, onView, onEdit, onDelete }) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[40]" onClick={onClose} />
            <div className="absolute right-0 top-10 w-48 bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 z-[50] overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                <button
                    onClick={() => { onView(ambassador); onClose(); }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-yellow-600 transition-colors border-b border-slate-50"
                >
                    <Eye className="text-yellow-500" size={16} />
                    <span>View Profile</span>
                </button>
                <button
                    onClick={() => { onEdit(ambassador); onClose(); }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors border-b border-slate-50"
                >
                    <Pencil className="text-blue-500" size={16} />
                    <span>Edit Details</span>
                </button>
                <button
                    onClick={() => { onDelete(ambassador); onClose(); }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                    <Trash className="text-red-500" size={16} />
                    <span>Delete</span>
                </button>
            </div>
        </>
    );
};

const AmbassadorRow = ({ ambassador, onView, onEdit, onDelete, isMenuOpen, onToggleMenu }) => (
    <tr className="hover:bg-slate-50 transition-colors">
        <td className="px-3 md:px-6 py-3 md:py-4">
            <div onClick={() => onView(ambassador)} className="cursor-pointer">
                <p className="text-xs md:text-sm font-semibold text-slate-900">
                    {ambassador.ambassador?.name || "N/A"}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                    <Phone size={10} className="text-slate-400" />
                    <p className="text-[10px] md:text-[11px] text-slate-500">
                        {ambassador.ambassador?.phoneNumber || "No contact"}
                    </p>
                </div>
            </div>
        </td>
        <td className="px-3 md:px-6 py-3 md:py-4 hidden sm:table-cell">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-indigo-500 flex-shrink-0" />
                    <p className="text-xs md:text-sm text-slate-700 font-medium truncate max-w-[150px] md:max-w-[200px]" title={ambassador.location_name}>
                        {ambassador.location_name || "N/A"}
                    </p>
                </div>
                <div className="flex items-center gap-1.5">
                    <GraduationCap size={12} className="text-emerald-500 flex-shrink-0" />
                    <p className="text-[10px] md:text-xs text-slate-500 truncate max-w-[150px] md:max-w-[200px]">
                        {ambassador.ambassador?.course || "N/A"} • {ambassador.ambassador?.year || "N/A"}
                    </p>
                </div>
            </div>
        </td>
        <td className="px-3 md:px-6 py-3 md:py-4">
            <Badge variant={ambassador.ambassador?.status || "inactive"}>
                {ambassador.ambassador?.status || "inactive"}
            </Badge>
        </td>
        <td className="px-3 md:px-6 py-3 md:py-4">
            <div className="flex justify-end relative">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleMenu(ambassador.uniqueId);
                    }}
                    className={`p-2 rounded-lg transition-all ${isMenuOpen ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        }`}
                >
                    <MoreVertical size={18} />
                </button>
                <ActionMenu
                    isOpen={isMenuOpen}
                    ambassador={ambassador}
                    onClose={() => onToggleMenu(null)}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>
        </td>
    </tr>
);


export default function AmbassadorListView() {
    const [searchQuery, setSearchQuery] = useState("");
    const [ambassadors, setAmbassadors] = useState([]);
    const [locations, setLocations] = useState([]);
    const [filteredAmbassadors, setFilteredAmbassadors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [chartFilter, setChartFilter] = useState("weekly");
    const [chartData, setChartData] = useState([]);

    const router = useRouter();

    const fetchAmbassadors = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch("/api/location");
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const result = await response.json();

            const allAmbassadors = [];
            const allLocations = [];

            if (result.success && result.locations && Array.isArray(result.locations)) {
                result.locations.forEach((location) => {
                    allLocations.push(location);

                    if (location.ambassador && typeof location.ambassador === 'object') {
                        allAmbassadors.push({
                            uniqueId: `${location.id}_${location.ambassador.name}`,
                            location_id: location.id,
                            location_name: location.location_name,
                            city: location.city,
                            area: location.area,
                            location_type: location.location_type,
                            college_type: location.college_type,
                            ambassador: {
                                name: location.ambassador.name,
                                phoneNumber: location.ambassador.phoneNumber,
                                course: location.ambassador.course,
                                year: location.ambassador.year,
                                status: location.ambassador.status,
                                createdAt: location.ambassador.createdAt
                            }
                        });
                    }
                });
            }

            setAmbassadors(allAmbassadors);
            setLocations(allLocations);
            setFilteredAmbassadors(allAmbassadors);
            generateChartData(allAmbassadors, chartFilter);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message || "An error occurred while fetching ambassadors");
            setAmbassadors([]);
            setFilteredAmbassadors([]);
        } finally {
            setIsLoading(false);
        }
    }, [chartFilter]);

    const generateChartData = (ambassadorsList, filter) => {
        const now = new Date();
        let data = [];

        if (filter === "today") {
            // Hourly data for today
            for (let i = 23; i >= 0; i--) {
                const hour = new Date(now);
                hour.setHours(now.getHours() - i, 0, 0, 0);
                const count = ambassadorsList.filter(amb => {
                    if (!amb.ambassador.createdAt?.seconds) return false;
                    const created = new Date(amb.ambassador.createdAt.seconds * 1000);
                    return created.getHours() === hour.getHours() &&
                        created.toDateString() === now.toDateString();
                }).length;
                data.push({
                    date: `${hour.getHours()}:00`,
                    count
                });
            }
        } else if (filter === "weekly") {
            // Last 7 days
            for (let i = 6; i >= 0; i--) {
                const day = new Date(now);
                day.setDate(now.getDate() - i);
                const count = ambassadorsList.filter(amb => {
                    if (!amb.ambassador.createdAt?.seconds) return false;
                    const created = new Date(amb.ambassador.createdAt.seconds * 1000);
                    return created.toDateString() === day.toDateString();
                }).length;
                data.push({
                    date: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    count
                });
            }
        } else if (filter === "monthly") {
            // Last 30 days
            for (let i = 29; i >= 0; i--) {
                const day = new Date(now);
                day.setDate(now.getDate() - i);
                const count = ambassadorsList.filter(amb => {
                    if (!amb.ambassador.createdAt?.seconds) return false;
                    const created = new Date(amb.ambassador.createdAt.seconds * 1000);
                    return created.toDateString() === day.toDateString();
                }).length;
                data.push({
                    date: day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    count
                });
            }
        }

        setChartData(data);
    };

    useEffect(() => {
        fetchAmbassadors();
    }, [fetchAmbassadors]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredAmbassadors(ambassadors);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = ambassadors.filter(item => {
            const ambassadorName = item.ambassador?.name?.toLowerCase() || "";
            const phoneNumber = item.ambassador?.phoneNumber || "";
            const locationName = item.location_name?.toLowerCase() || "";
            const city = item.city?.toLowerCase() || "";
            const area = item.area?.toLowerCase() || "";
            const course = item.ambassador?.course?.toLowerCase() || "";

            return (
                ambassadorName.includes(query) ||
                phoneNumber.includes(query) ||
                locationName.includes(query) ||
                city.includes(query) ||
                area.includes(query) ||
                course.includes(query)
            );
        });

        setFilteredAmbassadors(filtered);
    }, [searchQuery, ambassadors]);

    useEffect(() => {
        generateChartData(ambassadors, chartFilter);
    }, [chartFilter, ambassadors]);

    const handleView = useCallback((ambassador) => {
        router.push(`/ambassadors/${ambassador.location_id}`);
    }, [router]);

    const handleEdit = useCallback((ambassador) => {
        router.push(`/ambassadors/${ambassador.location_id}/edit`);
    }, [router]);

    const handleDelete = useCallback(async (ambassador) => {
        if (!confirm(`Are you sure you want to delete ${ambassador.ambassador?.name}?`)) return;

        try {
            console.log("Delete ambassador from location:", ambassador.location_id);
            await fetchAmbassadors();
        } catch (err) {
            console.error("Delete failed:", err);
            setError("Failed to delete ambassador");
        }
    }, [fetchAmbassadors]);

    // Calculate metrics
    const totalAmbassadors = ambassadors.length;
    const activeAmbassadors = ambassadors.filter(
        amb => amb.ambassador?.status?.toLowerCase() === "active"
    ).length;
    const campusCovered = new Set(
        ambassadors.map(amb => amb.location_id)
    ).size;
    const campusWithoutAmbassador = locations.filter(
        loc => !loc.ambassador || Object.keys(loc.ambassador).length === 0
    ).length;
    const avgAmbassadorsPerLocation = campusCovered > 0
        ? (totalAmbassadors / campusCovered).toFixed(2)
        : 0;



    return (
        <div className="min-h-screen bg-[#f9fafb] px-4 sm:px-6 lg:px-10 py-4 pt-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <Card
                    title="Total Ambassadors"
                    value={totalAmbassadors}
                    icon={Users}
                    iconBg="bg-indigo-50"
                    iconColor="text-indigo-600"
                />
                <Card
                    title="Active Ambassadors"
                    value={activeAmbassadors}
                    icon={UserCheck}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-600"
                />
                <Card
                    title="Campus Covered"
                    value={campusCovered}
                    icon={Building2}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-600"
                />
                <Card
                    title="Campus Without Ambassador"
                    value={campusWithoutAmbassador}
                    icon={AlertCircle}
                    iconBg="bg-amber-50"
                    iconColor="text-amber-600"
                />
                <Card
                    title="Avg Ambassadors/Location"
                    value={avgAmbassadorsPerLocation}
                    icon={TrendingUp}
                    iconBg="bg-purple-50"
                    iconColor="text-purple-600"
                />
            </div>

            {/* Onboarding Chart */}
            <div className="mb-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-indigo-600" />
                            <h3 className="text-sm font-bold text-slate-900">Ambassadors Onboarded</h3>
                        </div>
                        <div className="flex gap-2">
                            {["today", "weekly", "monthly"].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setChartFilter(filter)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${chartFilter === filter
                                        ? "bg-indigo-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    {filter === "today" ? "Today" : filter === "weekly" ? "Weekly" : "Monthly"}
                                </button>
                            ))}
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                stroke="#cbd5e1"
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                stroke="#cbd5e1"
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    color: '#fff'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#6366f1"
                                strokeWidth={2}
                                dot={{ fill: '#6366f1', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Ambassador List Table */}
            <div className="w-full mx-auto min-h-screen bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 600px)' }}>
                <div className="p-3 md:p-4 border-b border-slate-200 sticky top-0 z-20 bg-white flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <UserPlus size={18} className="text-green-600" />
                            <h2 className="text-sm md:text-md font-semibold text-slate-900">Campus Ambassadors</h2>
                        </div>
                        <button
                            onClick={fetchAmbassadors}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs md:text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Filter className={`w-3 h-3 md:w-4 md:h-4 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>
                    </div>

                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, phone, location, course..."
                            className="w-full pl-9 pr-4 py-2 md:py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-auto min-h-screen">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/75 sticky top-0 z-10 backdrop-blur-sm">
                            <tr className="border-b border-slate-200 text-slate-500 text-[10px] md:text-[11px] font-bold uppercase tracking-wider">
                                <th className="px-3 md:px-6 py-3 md:py-4">Ambassador</th>
                                <th className="px-3 md:px-6 py-3 md:py-4 hidden sm:table-cell">Location & Course</th>
                                <th className="px-3 md:px-6 py-3 md:py-4">Status</th>
                                <th className="px-3 md:px-6 py-3 md:py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {isLoading ? (
                                <LoadingState />
                            ) : error ? (
                                <ErrorState error={error} onRetry={fetchAmbassadors} />
                            ) : filteredAmbassadors.length === 0 ? (
                                <EmptyState />
                            ) : (
                                filteredAmbassadors.map((ambassador) => (
                                    <AmbassadorRow
                                        key={ambassador.uniqueId}
                                        ambassador={ambassador}
                                        onView={handleView}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        isMenuOpen={openMenuId === ambassador.uniqueId}
                                        onToggleMenu={(id) => setOpenMenuId(openMenuId === id ? null : id)}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
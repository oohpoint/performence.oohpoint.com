"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    MapPin,
    User,
    AlertCircle,
    Loader2,
    Edit,
    CheckCircle2,
    School,
    BookOpen,
    Award,
    History,
    FileText,
    CheckCheck,
    CopyPlusIcon,
    Phone,
    Building2,
    GraduationCap,
    Users,
    TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/Resublaty";

export default function AmbassadorProfilePage() {
    const router = useRouter();
    const { id } = useParams();

    const [ambassador, setAmbassador] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [copiedId, setCopiedId] = useState('');

    useEffect(() => {
        if (!id) return;

        const controller = new AbortController();

        const fetchAmbassadorData = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/ambassadors/${id}`, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    if (response.status === 404)
                        throw new Error("Ambassador not found");
                    throw new Error("Failed to fetch ambassador data");
                }

                const result = await response.json();
                const data = result.data || result;
                setAmbassador(data);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAmbassadorData();

        return () => controller.abort();
    }, [id]);

    const tabs = [
        { key: "overview", label: "Overview", icon: FileText },
        { key: "location", label: "Location Details", icon: MapPin },
        { key: "campaigns", label: "Campaigns", icon: History },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">
                        Loading ambassador profile...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-100 shadow-xl shadow-red-500/5 text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                        Something went wrong
                    </h2>
                    <p className="text-slate-500 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!ambassador) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">
            {/* HERO SECTION */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-2">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="h-11 w-11 border border-slate-200 rounded-sm flex items-center justify-center">
                            <div className="bg-black text-2xl font-semibold text-white h-11 w-11 flex items-center justify-center rounded-sm">
                                {ambassador.ambassador?.name ? ambassador.ambassador?.name.charAt(0).toUpperCase() : "B"}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-bold text-slate-900">
                                    {ambassador.ambassador?.name || "N/A"}
                                </h1>
                                <Badge
                                    variant="success"
                                    label={ambassador.ambassador?.status || "inactive"}
                                />
                            </div>
                            <div className="flex items-center gap-4 text-slate-500 font-medium">
                                <div className="flex items-center gap-1.5">
                                    <School size={13} />
                                    <span className="text-[13px] font-medium">
                                        {ambassador.location_name || "N/A"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <BookOpen size={13} />
                                    <span className="text-[13px] font-medium">
                                        {ambassador.ambassador?.year || "N/A"} • {ambassador.ambassador?.course || "N/A"}
                                    </span>
                                </div>
                                {ambassador.id && (
                                    <div
                                        className="relative flex items-center gap-1 cursor-pointer"
                                        onClick={async () => {
                                            await navigator.clipboard.writeText(ambassador.id);
                                            setCopiedId(ambassador.id);
                                            setTimeout(() => setCopiedId(null), 2000);
                                        }}
                                    >
                                        <span
                                            className={`absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs bg-gray-700 text-white px-2 py-0.5 rounded-md shadow transition-all duration-200 whitespace-nowrap ${copiedId === ambassador.id
                                                ? "opacity-100 scale-100"
                                                : "opacity-0 scale-90 pointer-events-none"
                                                }`}
                                        >
                                            ID Copied!
                                        </span>

                                        {copiedId === ambassador.id ? (
                                            <CheckCheck size={12} />
                                        ) : (
                                            <CopyPlusIcon size={12} />
                                        )}
                                        <span className="text-[11px] hover:text-blue-600 transition">
                                            {ambassador.id?.substring(0, 12) || "N/A"}...
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => router.push(`/ambassadors/${ambassador.id}/edit`)}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
                        >
                            <Edit className="w-4 h-4" /> Edit
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex items-center justify-between border-b border-slate-200 px-2 pt-3 sticky top-16 z-40 bg-[#F8FAFC]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 mx-3 py-2 text-[12px] font-bold transition-all border-b-2 whitespace-nowrap uppercase ${activeTab === tab.key
                                    ? "border-black text-black rounded-t-lg"
                                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-lg"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                {activeTab === "overview" ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* PRIMARY DETAILS */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Personal Information */}
                                <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-100">
                                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                            <User className="w-5 h-5 text-blue-600" />
                                            Personal Information
                                        </h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <DataRow
                                                label="Full Name"
                                                value={ambassador.ambassador?.name}
                                            />
                                            <DataRow
                                                label="Phone Number"
                                                value={ambassador.ambassador?.phoneNumber}
                                            />
                                            <DataRow
                                                label="Course"
                                                value={ambassador.ambassador?.course}
                                            />
                                            <DataRow
                                                label="Academic Year"
                                                value={ambassador.ambassador?.year}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Location Information */}
                                <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-100">
                                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-orange-500" />
                                            Location Information
                                        </h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <DataRow
                                                label="Location Name"
                                                value={ambassador.location_name}
                                            />
                                            <DataRow
                                                label="Location Type"
                                                value={ambassador.location_type}
                                            />
                                            <DataRow
                                                label="City"
                                                value={ambassador.city}
                                            />
                                            <DataRow
                                                label="Area"
                                                value={ambassador.area}
                                            />
                                            <DataRow
                                                label="Pincode"
                                                value={ambassador.pincode}
                                            />
                                            <DataRow
                                                label="College Type"
                                                value={ambassador.college_type}
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Demographics & Audience */}
                                <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-100">
                                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                            <Users className="w-5 h-5 text-indigo-600" />
                                            Demographics & Audience
                                        </h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <DataRow
                                                label="Primary Audience"
                                                value={ambassador.primary_audience}
                                            />
                                            <DataRow
                                                label="Age Band"
                                                value={ambassador.age_band}
                                            />
                                            <DataRow
                                                label="Gender Skew"
                                                value={ambassador.gender_skew}
                                            />
                                            <DataRow
                                                label="Footfall Level"
                                                value={ambassador.footfall_level}
                                            />
                                            <DataRow
                                                label="Education Level"
                                                value={ambassador.education_level}
                                            />
                                            <DataRow
                                                label="Campus Type"
                                                value={ambassador.campus_type}
                                            />
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* SIDEBAR */}
                            <div className="space-y-6">
                                {/* Status Overview */}
                                <div className="bg-slate-900 rounded-2xl p-6 text-white">
                                    <h3 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        Status Overview
                                    </h3>
                                    <div className="space-y-4">
                                        <StatusItem
                                            label="Ambassador Status"
                                            value={ambassador.ambassador?.status || "N/A"}
                                        />
                                        <StatusItem
                                            label="Location Status"
                                            value={ambassador.status || "N/A"}
                                        />
                                        <div className="pt-4 border-t border-white/10">
                                            <p className="text-slate-400 text-[10px] italic">
                                                Regular monitoring helps maintain ambassador quality and performance.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* College Tags */}
                                {ambassador.college_tags && ambassador.college_tags.length > 0 && (
                                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                        <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">
                                            College Tags
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {ambassador.college_tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Quick Actions */}
                                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                    <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">
                                        Quick Actions
                                    </h3>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => router.push(`/ambassadors/${ambassador.id}/edit`)}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98] bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-900 border-blue-200 border"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit Profile
                                        </button>
                                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98] bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900 border-indigo-200 border">
                                            <Award className="w-4 h-4" />
                                            View Campaigns
                                        </button>
                                    </div>
                                </div>

                                {/* Info Card */}
                                <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                                    <h3 className="font-bold text-blue-900 mb-2 text-sm flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Additional Info
                                    </h3>
                                    <div className="space-y-1 text-xs text-blue-800">
                                        <p>Location ID: {ambassador.location_id || "N/A"}</p>
                                        {ambassador.createdAt && (
                                            <p>
                                                Created:{" "}
                                                {new Date(
                                                    ambassador.createdAt.seconds * 1000
                                                ).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : activeTab === "location" ? (
                    <LocationDetailsTab ambassador={ambassador} />
                ) : (
                    <EmptyState section={tabs.find((t) => t.key === activeTab)?.label} />
                )}
            </main>
        </div>
    );
}

// Location Details Tab Component
const LocationDetailsTab = ({ ambassador }) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    Complete Location Details
                </h2>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <DataRow label="Location Name" value={ambassador.location_name} />
                    <DataRow label="Location Type" value={ambassador.location_type} />
                    <DataRow label="City" value={ambassador.city} />
                    <DataRow label="Area" value={ambassador.area} />
                    <DataRow label="Pincode" value={ambassador.pincode} />
                    <DataRow label="College Type" value={ambassador.college_type} />
                    <DataRow label="Education Level" value={ambassador.education_level} />
                    <DataRow label="Footfall Level" value={ambassador.footfall_level} />
                    <DataRow label="Gender Skew" value={ambassador.gender_skew} />
                    <DataRow label="Primary Audience" value={ambassador.primary_audience} />
                    <DataRow label="Age Band" value={ambassador.age_band} />
                    <DataRow label="Campus Type" value={ambassador.campus_type} />
                </div>

                {ambassador.geo && (
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-600" />
                            Geographic Coordinates
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <DataRow label="Latitude" value={ambassador.geo.lat} />
                            <DataRow label="Longitude" value={ambassador.geo.lng} />
                        </div>
                    </div>
                )}
            </div>
        </section>
    </div>
);

// Data Row Component
const DataRow = ({ label, value }) => (
    <div className="flex flex-col gap-1 border-l-2 border-slate-100 pl-4 py-1 hover:border-blue-200 transition-colors">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {label}
        </span>
        <span className="text-sm font-bold text-slate-800">
            {value || "Not specified"}
        </span>
    </div>
);

// Status Item Component
const StatusItem = ({ label, value }) => (
    <div className="flex items-center justify-between pb-3 border-b border-white/10 last:border-b-0 last:pb-0">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            {label}
        </p>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 capitalize">
            {value}
        </span>
    </div>
);

// Empty State Component
const EmptyState = ({ section }) => (
    <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-20 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <FileText className="w-10 h-10 text-slate-200" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">{section} Module</h3>
        <p className="text-slate-500 max-w-xs mx-auto">
            Detailed {section} information for this ambassador is currently being synchronized.
        </p>
        <button className="mt-8 px-8 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-full text-sm font-bold transition-all shadow-lg shadow-slate-200">
            Refresh Data
        </button>
    </div>
);
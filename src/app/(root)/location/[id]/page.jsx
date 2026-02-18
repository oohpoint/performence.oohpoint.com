"use client";
import React, { useState, useEffect } from 'react';
import {
    Edit, MapPin, Users, Calendar, Info, Navigation,
    PieChart, History, UserCheck, Store, Clock, Target, AlertCircle, Loader2,
    Ban,
    X,
    CheckCheck,
    CopyPlusIcon,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import ProfileCard from '@/components/ProfileCard';
import { Badge } from '@/components/Resublaty';
import Ambassadors from './_components/Ambassadors';


const LocationProfilePage = () => {
    const { id } = useParams();

    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        if (!id) return;

        const controller = new AbortController();

        const fetchLocationData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetching from your actual API endpoint
                const response = await fetch(`/api/location/${id}`, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    if (response.status === 404) throw new Error("Location not found");
                    throw new Error("Failed to fetch location data");
                }

                const result = await response.json();
                // Extracting data based on your specific structure
                const data = result.data || result;
                setLocation(data);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchLocationData();

        return () => controller.abort();
    }, [id]);

    const tabs = [
        { key: "overview", label: "Overview", icon: Info },
        { key: "map", label: "Map & Radius", icon: Navigation },
        { key: "campaigns", label: "Campaigns", icon: History },
        { key: "insights", label: "Insights", icon: PieChart },
        { key: "ambassadors", label: "Ambassadors", icon: UserCheck },
        { key: "vendor", label: "Vendor", icon: Store },
    ];

    const router = useRouter();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Synchronizing location data...</p>
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
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
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

    if (!location) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">
            {/* HERO SECTION */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-2">
                <div className="max-w-400 mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="h-11 w-11 border border-slate-200 rounded-sm flex items-center justify-center">
                            <div className="bg-black text-2xl font-semibold text-white h-11 w-11 flex items-center justify-center rounded-sm">
                                {location.location_name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-bold text-slate-900">{location.location_name}</h1>
                                <Badge variant="warning" label={location.status || "Pilot"} />
                                <Badge variant="success" label='Verified' />
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-[11px] text-slate-500 font-medium">
                                <span className="flex items-center gap-1"><MapPin size={12} />{location.area}, {location.city} ({location.pincode})</span>
                                {location.uid && (
                                    <div
                                        className="relative flex items-center gap-1 cursor-pointer"
                                        onClick={async () => {
                                            await navigator.clipboard.writeText(location.uid);
                                            setCopiedId(location.uid);
                                            setTimeout(() => setCopiedId(null), 2000);
                                        }}
                                    >
                                        {/* Copied tooltip */}
                                        <span
                                            className={`absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs bg-gray-700 text-white px-2 py-0.5 rounded-md shadow transition-all duration-200 whitespace-nowrap ${copiedId === location.uid
                                                ? "opacity-100 scale-100"
                                                : "opacity-0 scale-90 pointer-events-none"
                                                }`}
                                        >
                                            ID Copied!
                                        </span>

                                        {copiedId === location.uid ?
                                            <CheckCheck size={12} /> : <CopyPlusIcon size={12} />}
                                        <span className=" font-medium hover:text-blue-600 transition">
                                            {location.uid?.substring(0, 12) || "N/A"}...
                                        </span>
                                    </div>
                                )}
                                <span className="text-slate-300">|</span>
                                <span className="flex items-center gap-1"><Store size={12} />{location.location_type || location.college?.type || "Standard"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => router.push(`/location/${location.id}/edit`)} className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
                            <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all">
                            Actions
                        </button>
                    </div>
                </div>
            </header>
            <div className="flex items-center justify-between border-b border-slate-200 px-2 pt-3 sticky top-16 z-40 bg-[#F8FAFC]">
                {/* TAB NAVIGATION */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-1  overflow-x-auto no-scrollbar scroll-smooth">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 mx-3 py-2 text-[12px] font-bold transition-all border-b-2 whitespace-nowrap uppercase ${activeTab === tab.key
                                    ? "border-black text-black  rounded-t-lg"
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

                        {/* KPI GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <ProfileCard
                                label="Primary Group"
                                value={location.audience?.primary}
                            />
                            <ProfileCard
                                label="Footfall Intensity"
                                value={location.audience?.footfall_level?.split(' ')[0]}
                            />
                            <ProfileCard
                                label="Target Age"
                                value={location.audience?.age_band}
                            />
                            <ProfileCard
                                label="Avg. Dwell"
                                value={location.avg_dwell_bucket?.split(' ')[0]}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* PRIMARY DETAILS */}
                            <div className="lg:col-span-2 space-y-6">
                                <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden ">
                                    <div className="px-6 py-4 border-b border-slate-100">
                                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                            <Target className="w-5 h-5 text-blue-600" />
                                            Audience Segmentation
                                        </h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <DataRow label="Campus Type" value={location.audience?.campus_type} />
                                            <DataRow label="Gender Skew" value={location.audience?.gender_skew} />
                                            <DataRow label="Education Level" value={location.audience?.education_level} />
                                            <DataRow label="Primary Demographic" value={location.audience?.primary} />
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-100">
                                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-orange-500" />
                                            Traffic Windows
                                        </h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div>
                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Peak Hours</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {location.peak_windows?.map((win, i) => (
                                                        <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                                                            {win}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">Low Traffic</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {location.low_windows?.map((win, i) => (
                                                        <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-100">
                                                            {win}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-100">
                                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                            <Navigation className="w-5 h-5 text-indigo-600" />
                                            Geographic Data
                                        </h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <DataRow label="Latitude / Longitude" value={`${location.latitude}, ${location.longitude}`} />
                                            <DataRow label="Operating Radius" value={`${location.radius} meters`} />
                                            <DataRow label="Pincode" value={location.pincode} />
                                            <DataRow label="Nearby Landmark" value={location.nearby_vendors_type_landmark} />
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* SIDEBAR ACTIONS */}
                            <div className="space-y-6">
                                <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200">
                                    <h3 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                        <Ban className="w-4 h-4 text-red-400" />
                                        Restricted Categories
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {location.restricted_categories?.map((cat, i) => (
                                            <span key={i} className="px-2 py-1 bg-white/10 rounded-md text-[11px] font-bold border border-white/10">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-slate-400 text-[10px] mt-4 leading-relaxed italic">
                                        Campaigns in these categories are strictly prohibited at this venue.
                                    </p>
                                </div>

                                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                    <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Completion Check List</h3>
                                    <div className="space-y-2">
                                        <ActionButton icon={Calendar} label="Schedule Campaign" />
                                        <ActionButton icon={Users} label="View Footfall Data" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : activeTab === "ambassadors" ? (

                    <Ambassadors location={location} />
                ) : (

                    <EmptyState section={tabs.find(t => t.key === activeTab)?.label} />
                )
                }
            </main>
        </div>
    );
};

/**
 * REUSABLE PRODUCTION COMPONENTS
 */


const DataRow = ({ label, value }) => (
    <div className="flex flex-col gap-1 border-l-2 border-slate-100 pl-4 py-1 hover:border-blue-200 transition-colors">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="text-sm font-bold text-slate-800">{value || "Not specified"}</span>
    </div>
);

const ActionButton = ({ icon: Icon, label, variant = "primary" }) => (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98] ${variant === "primary"
        ? "bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-900 border-red-200 border"
        : "border border-green-200 text-green-500 hover:bg-green-50 hover:border-green-300 bg-green-50"
        }`}>
        <Icon className="w-4 h-4" />
        {label}
        <X className="w-4 h-4 text-red-500 ml-auto" />
    </button>
);

const EmptyState = ({ section }) => (
    <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-20 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <PieChart className="w-10 h-10 text-slate-200" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">{section} Module</h3>
        <p className="text-slate-500 max-w-xs mx-auto">
            Detailed {section} information for this venue is currently being synchronized.
        </p>
        <button className="mt-8 px-8 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-full text-sm font-bold transition-all shadow-lg shadow-slate-200">
            Refresh Data
        </button>
    </div>
);


export default LocationProfilePage;
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    MapPin,
    Building2,
    User,
    Mail,
    IndianRupee,
    TrendingUp,
    Settings,
    ArrowLeft,
    ExternalLink,
    FileText,
    AlertCircle,
    Loader2,
    Globe,
    Phone,
    MapPinIcon,
    Target,
    BarChart3,
    CheckCircle2,
    Clock,
    Zap,
    CopyPlusIcon,
    Check,
    PlusCircle,
    Briefcase,
    Hash,
    Shield,
    Calendar,
    Ticket,
    Percent,
    FingerprintPattern,
    MonitorCheck,
    Copy,
    Pause,
    Plus,
    CheckCheck,
} from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import { Badge } from "@/components/Resublaty";

export default function BrandProfilePage() {
    const router = useRouter();
    const { id } = useParams();
    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        if (!id) return;

        const controller = new AbortController();

        const fetchBrand = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(`/api/brands/${id}`, {
                    signal: controller.signal,
                });

                if (!res.ok) {
                    if (res.status === 404) throw new Error("Brand not found");
                    throw new Error("Failed to fetch brand data");
                }

                const data = await res.json();

                if (data.success) {
                    setBrand(data.data);
                } else {
                    throw new Error("Invalid response format");
                }
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBrand();

        return () => controller.abort();
    }, [id]);

    const tabs = [
        { key: "overview", label: "Overview", icon: FileText },
        { key: "campaigns", label: "Campaigns", icon: TrendingUp },
        { key: "budget", label: "Budget & Analytics", icon: BarChart3 },
        { key: "activity", label: "Activity", icon: Clock },
        { key: "contacts", label: "Brand Info", icon: User },

    ];

    const getStatusStyles = (status) => {
        switch (status?.toUpperCase()) {
            case "ACTIVE":
                return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "PENDING":
                return "bg-amber-100 text-amber-700 border-amber-200";
            case "INACTIVE":
                return "bg-slate-100 text-slate-700 border-slate-200";
            default:
                return "bg-blue-100 text-blue-700 border-blue-200";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Synchronizing brand data...</p>
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

    if (!brand) return null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-20">
            {/* HERO SECTION */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-2">
                <div className="max-w-400 mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="h-11 w-11 border border-slate-200 rounded-sm flex items-center justify-center">
                            {brand.imageUrl ? (
                                <img
                                    src={brand.imageUrl}
                                    alt="Brand Logo"
                                    className="w-11 h-11 object-contain rounded-sm border border-slate-200"
                                />
                            ) : (
                                <div className="bg-black text-2xl font-semibold text-white h-11 w-11 flex items-center justify-center rounded-sm">
                                    {brand.brandName ? brand.brandName.charAt(0).toUpperCase() : "B"}
                                </div>
                            )}

                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-bold text-slate-900">{brand?.brandName}</h1>
                                <Badge variant="warning" label={brand?.status || "Pilot"} />
                                <Badge variant="success" label='Verified' />
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-[11px] text-slate-500 font-medium">
                                <span className="flex items-center gap-1"><Globe size={12} />{brand?.industryType}</span>
                                <span className="flex items-center gap-1"><MapPin size={12} />{brand?.city}</span>
                                {brand.uid && (
                                    <div
                                        className="relative flex items-center gap-1 cursor-pointer"
                                        onClick={async () => {
                                            await navigator.clipboard.writeText(brand.uid);
                                            setCopiedId(brand.uid);
                                            setTimeout(() => setCopiedId(null), 2000);
                                        }}
                                    >
                                        {/* Copied tooltip */}
                                        <span
                                            className={`absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs bg-gray-700 text-white px-2 py-0.5 rounded-md shadow transition-all duration-200 whitespace-nowrap ${copiedId === brand.uid
                                                ? "opacity-100 scale-100"
                                                : "opacity-0 scale-90 pointer-events-none"
                                                }`}
                                        >
                                            ID Copied!
                                        </span>

                                        {copiedId === brand.uid ?
                                            <CheckCheck size={12} /> : <CopyPlusIcon size={12} />}
                                        <span className=" font-medium hover:text-blue-600 transition">
                                            {brand.uid?.substring(0, 12) || "N/A"}...
                                        </span>
                                    </div>
                                )}
                                <span className="text-slate-300">|</span>
                                <span>Budget: {brand.adBudget || "-"} </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => router.push(`/brand/${id}/campaigns/new`)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-slate-900 text-white cursor-pointer rounded-lg hover:bg-slate-800 transition-all">
                            <PlusCircle className="w-4 h-4 text-green-500" />
                            Add Campaign
                        </button>
                        <button onClick={() => router.push(`/brand/${id}/edit`)} className="hidden cursor-pointer sm:flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
                            <Settings className="w-4 h-4" /> Edit
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex items-center justify-between border-b border-slate-200 px-2 pt-5 ">
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
            <main className="max-w-7xl mx-auto px-4 sm:px-2 py-8">
                {activeTab === "overview" ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* KPI GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
                            <ProfileCard
                                label="Active Campaigns"
                                value={brand.activeCampaigns?.length || 0}
                            />
                            <ProfileCard
                                label="Completed"
                                value={brand.completedCampaigns?.length || 0}
                            />
                            <ProfileCard
                                label="Upcoming Campaigns"
                                value={brand.upcomingCampaigns?.length || 0}
                            />
                            <ProfileCard
                                label="Total Engagements"
                                value={brand.totalEngagements || 0}

                            />
                            <ProfileCard
                                label="Unique Users Engaged"
                                value={brand.uniqueUsersEngaged || 0}
                                icon={User}
                                trend={`${brand.uniqueUsersEngaged || 0} Unique Users`}
                                color="indigo"
                            />
                            <ProfileCard
                                label="Avg CPVE"
                                value={`₹${brand.avgCPVE || 0}`}
                                icon={IndianRupee}
                                trend={`${brand.avgCPVE || 0} Average Cost Per View Engagement`}
                                color="orange"
                            />
                            <ProfileCard
                                label="Credit Redeemed Rate"
                                value={brand.creditRedeemedRate || 0}
                                icon={Percent}
                                batch='admin'
                                trend={`${brand.creditRedeemedRate || 0} Credit Redeemed Rate`}
                                color="indigo"
                            />
                            <ProfileCard
                                label="Funnel Rate"
                                value={brand.funnelCompletionRate || 0}
                                icon={Ticket}
                                trend={`${brand.funnelCompletionRate || 0} Funnel Completion Rate`}
                                color="indigo"
                            />
                            <ProfileCard
                                label="Total Budget"
                                value={brand.adBudget || 0}
                                icon={MonitorCheck}
                                trend={`${brand.totalAllocatedBudget || 0} Total Allocated Budget`}
                                color="yellow"
                            />
                            <ProfileCard
                                label="Total Spent"
                                value={brand.totalSpent || 0}
                                icon={IndianRupee}
                                trend={`${brand.totalSpent || 0} Total Spent`}
                                color="teal"
                            />
                            <ProfileCard
                                label="Remaining Budget"
                                value={brand.remainingBudget || 0}
                                icon={FingerprintPattern}
                                trend={`${brand.remainingBudget || 0} Total Remaining Budget`}
                                color="purple"
                            />
                            <ProfileCard
                                label="Run Rate"
                                value={brand.runRate || 0}
                                icon={TrendingUp}
                                trend={`${brand.runRate || 0} Run Rate (Budget/Day)`}
                                color="yellow"
                            />
                            <ProfileCard
                                label="Active Locations"
                                value={brand.totalActiveLocations || 0}
                                icon={MapPin}
                                trend={`${brand.totalActiveLocations || 0} Active Locations`}
                                color="red"
                            />
                        </div>
                    </div>
                ) : activeTab === "contacts" ? (
                    <ContactsTab brand={brand} />
                ) : activeTab === "budget" ? (
                    <BudgetTab brand={brand} />
                ) : activeTab === "activity" ? (
                    <ActivityTab brand={brand} />
                ) : (
                    <EmptyState section={tabs.find((t) => t.key === activeTab)?.label} />
                )}
            </main>
        </div>
    );
}

/**
 * REUSABLE PRODUCTION COMPONENTS
 */



const DataRow = ({ label, value, isLink, href, isCopyable }) => (
    <div className="flex flex-col gap-1 border-l-2 border-slate-100 pl-4 py-1 hover:border-blue-200 transition-colors">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        {isLink ? (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 w-fit"
            >
                {value}
                <ExternalLink className="w-3 h-3" />
            </a>
        ) : (
            <span className="text-sm font-bold text-slate-800 break-all">
                {isCopyable && (
                    <button
                        onClick={() => navigator.clipboard.writeText(value)}
                        className="inline-flex items-center gap-2 hover:text-blue-600 transition group"
                        title="Copy to clipboard"
                    >
                        {value}
                        <svg
                            className="w-3 h-3 text-slate-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                    </button>
                )}
                {!isCopyable && value}
            </span>
        )}
    </div>
);

const StatusItem = ({ label, value, status }) => (
    <div className="flex items-center justify-between pb-3 border-b border-white/10 last:border-b-0 last:pb-0">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${status === "Active" || status === "Verified"
                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                : "bg-amber-100 text-amber-700 border-amber-200"
                }`}
        >
            {value}
        </span>
    </div>
);

const ActionButton = ({ icon: Icon, label, onClick, variant = "primary" }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98] ${variant === "primary"
            ? "bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-900 border-red-200 border"
            : "border border-green-200 text-green-500 hover:bg-green-50 hover:border-green-300 bg-green-50"
            }`}
    >
        <Icon className="w-4 h-4" />
        {label}
    </button>
);

const EmptyState = ({ section }) => (
    <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-20 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <BarChart3 className="w-10 h-10 text-slate-200" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">{section} Module</h3>
        <p className="text-slate-500 max-w-xs mx-auto">
            Detailed {section} information for this brand is currently being synchronized.
        </p>
        <button className="mt-8 px-8 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-full text-sm font-bold transition-all shadow-lg shadow-slate-200">
            Refresh Data
        </button>
    </div>
);

const ContactsTab = ({ brand }) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Brand Info */}
            <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        Brand Information
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <InfoField label="Brand Name" value={brand.brandName || "-"} icon={Building2} />
                    <InfoField label="Industry" value={brand.industryType || "-"} icon={Briefcase} />
                    <InfoField label="City" value={brand.city || "-"} icon={MapPin} />
                    <InfoField label="UID" value={brand.uid || "-"} icon={Hash} />
                    <InfoField
                        label="Status"
                        value={brand.status || "Pilot"}
                        icon={Shield}
                    />
                </div>
            </section>

            {/* Contact + Compliance */}
            <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-600" />
                        Contact & Compliance
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <InfoField label="POC Name" value={brand.poc?.name || "-"} icon={User} />
                    <InfoField label="POC Email" value={brand.poc?.email || "-"} icon={Mail} isEmail />
                    <InfoField label="POC Phone" value={brand.poc?.phone || "-"} icon={Phone} />
                    <InfoField label="GST Number" value={brand.gst || "-"} icon={FileText} />
                </div>
            </section>

        </div>
    </div>
);


const BudgetTab = ({ brand }) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ProfileCard
                label="Total Budget"
                value={`₹${(brand.adBudget || 0).toLocaleString()}`}
                icon={IndianRupee}
                trend="Allocated"
                color="blue"
            />
            <ProfileCard label="Spent" value="₹0" icon={Zap} trend="Usage" color="orange" />
            <ProfileCard
                label="Remaining"
                value={`₹${(brand.adBudget || 0).toLocaleString()}`}
                icon={Target}
                trend="Available"
                color="emerald"
            />
            <ProfileCard label="Utilization" value="0%" icon={BarChart3} trend="Rate" color="indigo" />
        </div>

        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Budget Analytics
                </h2>
            </div>
            <div className="p-6">
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[11px] font-bold text-slate-500 uppercase">Total Allocation</span>
                            <span className="text-lg font-black text-slate-900">
                                ₹{(brand.adBudget || 0).toLocaleString()}
                            </span>
                        </div>
                        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-linear-to-r from-blue-600 to-indigo-600 rounded-full" style={{ width: "0%" }}></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
                        <div>
                            <p className="text-[11px] text-slate-500 font-bold uppercase mb-1">Spent</p>
                            <p className="text-lg font-bold text-slate-900">₹0</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-slate-500 font-bold uppercase mb-1">Reserved</p>
                            <p className="text-lg font-bold text-slate-900">₹0</p>
                        </div>
                        <div>
                            <p className="text-[11px] text-slate-500 font-bold uppercase mb-1">Available</p>
                            <p className="text-lg font-bold text-emerald-600">₹{(brand.adBudget || 0).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
);

const ActivityTab = ({ brand }) => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Activity Timeline
                </h2>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                    <TimelineItem
                        title="Brand Created"
                        description="Initial brand setup completed"
                        timestamp="Today"
                    />
                    <TimelineItem
                        title="Profile Activated"
                        description={`Status set to ${brand.status}`}
                        timestamp="Today"
                    />
                    <TimelineItem
                        title="Account Setup"
                        description="Business details and contact information registered"
                        timestamp="Today"
                    />
                </div>
            </div>
        </section>
    </div>
);

const InfoField = ({ label, value, icon: Icon, isEmail, isLink, href }) => (
    <div className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-b-0 last:pb-0">
        {Icon && <Icon className="w-4 h-4 text-slate-400 shrink-0 mt-1" />}
        <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
            {isLink ? (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 break-all"
                >
                    {value}
                    <ExternalLink className="w-3 h-3" />
                </a>
            ) : isEmail ? (
                <a
                    href={`mailto:${value}`}
                    className="text-sm font-bold text-slate-800 hover:text-blue-600 transition break-all"
                >
                    {value}
                </a>
            ) : (
                <p className="text-sm font-bold text-slate-800 break-all">{value || "-"}</p>
            )}
        </div>
    </div>
);

const TimelineItem = ({ title, description, timestamp }) => (
    <div className="flex gap-4 relative pb-6 last:pb-0">
        <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-blue-600 mt-1.5"></div>
            <div className="w-0.5 h-12 bg-slate-200 mt-2 last:h-0"></div>
        </div>
        <div className="pb-4 last:pb-0 flex-1">
            <p className="text-sm font-bold text-slate-900">{title}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{timestamp}</p>
            <p className="text-xs text-slate-600 mt-1">{description}</p>
        </div>
    </div>
);
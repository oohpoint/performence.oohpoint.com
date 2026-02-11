"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    MapPin,
    Building2,
    User,
    Mail,
    IndianRupee,
    MoreVertical,
    TrendingUp,
    Settings,
    ArrowLeft,
    ExternalLink,
    FileText,
} from "lucide-react";
import Card from "@/components/Card";

export default function BrandProfilePage() {
    const router = useRouter();
    const { id } = useParams();
    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchBrand = async () => {
            try {
                const res = await fetch(`/api/brands/${id}`);
                const data = await res.json();

                if (data.success) {
                    setBrand(data.data);
                }
            } catch (err) {
                console.error("Fetch brand failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBrand();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 text-sm">Loading brand profile...</p>
                </div>
            </div>
        );
    }

    if (!brand) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="text-center max-w-md w-full">
                    <Building2 size={48} className="text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Brand Not Found
                    </h2>
                    <p className="text-gray-600 text-sm mb-6">
                        The brand you're looking for doesn't exist or has been removed.
                    </p>
                    <button
                        onClick={() => router.push("/brand")}
                        className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Back to Brands
                    </button>
                </div>
            </div>
        );
    }

    // Format date
    const formatDate = (timestamp) => {
        if (!timestamp) return "-";
        return new Date(timestamp).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4 transition text-sm font-medium"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <div className="flex items-start justify-between gap-6">
                        {/* Brand Info */}
                        <div className="flex items-start gap-4 flex-1">
                            <div className="h-16 w-16 rounded-xl bg-linear-to-br from-blue-100 to-blue-50 flex items-center justify-center shrink-0 border border-blue-200 shadow-sm overflow-hidden">
                                {brand.logoUrl ? (
                                    <img
                                        src={brand.logoUrl}
                                        alt={brand.brandName}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <Building2
                                        className="text-blue-600"
                                        size={32}
                                    />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {brand.brandName}
                                    </h1>

                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span>{brand.industryType}</span>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
                                        <MapPin size={14} />
                                        {brand.city}
                                    </div>
                                    <span
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${brand.status === "Active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-amber-100 text-amber-700"
                                            }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-md ${brand.status === "Active"
                                            ? "bg-green-600"
                                            : "bg-amber-600"
                                            }`}></span>
                                        {brand.status || "Active"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Top Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    <Card
                        title="Ad Budget"
                        value={`₹${(brand.adBudget || 0).toLocaleString()}`}
                        icon={IndianRupee}
                    />
                    <Card
                        title="GST ID"
                        value={brand.gst || "-"}
                        icon={FileText}
                    />
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Brand Details Card1 */}
                        <Card1 title="Brand Information">
                            <div className="space-y-6">
                                <InfoRow label="Brand Name" value={brand.brandName} />
                                <InfoRow
                                    label="Website"
                                    value={brand.website}
                                    isLink={true}
                                    href={brand.website}
                                />
                                <InfoRow label="Brand UID" value={brand.id} isCopyable={true} />
                            </div>
                        </Card1>

                        {/* Point of Contact Card1 */}
                        <Card1 title="Point of Contact">
                            <div className="space-y-6">
                                <InfoRow
                                    label="Contact Name"
                                    value={brand.poc?.name || "-"}
                                    icon={User}
                                />
                                <InfoRow
                                    label="Email Address"
                                    value={brand.poc?.email || "-"}
                                    icon={Mail}
                                    isLink={true}
                                    href={`mailto:${brand.poc?.email}`}
                                />
                            </div>
                        </Card1>

                        {/* Activity Timeline */}
                        <Card1 title="Activity History">
                            <div className="space-y-4">
                                <TimelineItem
                                    title="Brand Created"
                                    description="Initial brand setup completed"
                                />
                                <TimelineItem
                                    title="Profile Activated"
                                    description={`Status set to ${brand.status}`}
                                />
                            </div>
                        </Card1>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card1 title="Quick Actions">
                            <div className="space-y-3">
                                <ActionButton
                                    label="Edit Brand"
                                    icon={Settings}
                                    onClick={() => router.push(`/brand/${id}/edit`)}
                                />
                                <ActionButton
                                    label="View Campaigns"
                                    icon={TrendingUp}
                                />
                            </div>
                        </Card1>

                        {/* Status Overview */}
                        <Card1 title="Status Overview">
                            <div className="space-y-4">
                                <StatusBadge
                                    label="Account Status"
                                    value={brand.status}
                                    status={brand.status}
                                />
                                <StatusBadge
                                    label="Verification"
                                    value={brand.status === "Active" ? "Verified" : "Pending"}
                                    status={brand.status === "Active" ? "Active" : "Pending"}
                                />
                            </div>
                        </Card1>

                        {/* Budget Info */}
                        <Card1 title="Budget Information">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">
                                        Total Ad Budget
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        ₹{(brand.adBudget || 0).toLocaleString()}
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-xs text-gray-600 font-semibold">
                                            Budget Usage
                                        </p>
                                        <span className="text-xs font-medium text-blue-600">
                                            0%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 rounded-full" style={{ width: "0%" }}></div>
                                    </div>
                                </div>
                            </div>
                        </Card1>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ========== Components ========== */

function Card1({ title, children }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition">
            <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    {title}
                </h3>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}

function InfoRow({ label, value, icon: Icon, isLink, href, isCopyable }) {
    return (
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
            <div className="flex items-center gap-2">
                {Icon && <Icon size={16} className="text-gray-400 shrink-0" />}
                <p className="text-sm text-gray-600 font-medium">{label}</p>
            </div>
            <div className="flex items-center gap-2 justify-end">
                {isLink ? (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                    >
                        {value}
                        <ExternalLink size={14} />
                    </a>
                ) : (
                    <p className={`text-sm font-medium ${value === "-" ? "text-gray-400" : "text-gray-900"}`}>
                        {value}
                    </p>
                )}
                {isCopyable && (
                    <button
                        onClick={() => navigator.clipboard.writeText(value)}
                        className="p-1 hover:bg-gray-100 rounded transition"
                        title="Copy to clipboard"
                    >
                        <svg
                            className="w-4 h-4 text-gray-400 hover:text-gray-600"
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
            </div>
        </div>
    );
}


function TimelineItem({ title, timestamp, description }) {
    return (
        <div className="flex gap-4 relative">
            <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-blue-600 mt-1.5"></div>
                <div className="w-0.5 h-12 bg-gray-200 mt-2 last:h-0"></div>
            </div>
            <div className="pb-4 last:pb-0">
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{timestamp}</p>
                <p className="text-xs text-gray-500 mt-1">{description}</p>
            </div>
        </div>
    );
}

function ActionButton({ label, icon: Icon, onClick }) {
    return (
        <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition group cursor-pointer" onClick={onClick}>
            <span className="text-sm font-medium text-gray-700">{label}</span>
            {Icon && <Icon size={16} className="text-gray-400 group-hover:text-gray-600 transition" />}
        </button>
    );
}

function StatusBadge({ label, value, status }) {
    return (
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 last:border-b-0 last:pb-0">
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">
                {label}
            </p>
            <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status === "Active" || status === "Verified"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                    }`}
            >
                <span
                    className={`w-1.5 h-1.5 rounded-full ${status === "Active" || status === "Verified"
                        ? "bg-green-600"
                        : "bg-amber-600"
                        }`}
                ></span>
                {value}
            </span>
        </div>
    );
}
"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    ArrowLeft, Mail, Phone, MapPin, Building, Shield, ShieldAlert,
    GraduationCap, User, Calendar, Clock, Tag, BarChart3,
    CheckCircle2, XCircle, Loader2, AlertCircle, Gift, ClipboardList,
    Hash, Globe, Heart, Star, UserMinus, UserCheck, Copy, Check,
    ChevronRight, Layers, Wallet, ScanLine, ExternalLink
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

/* ─── tiny helpers ─── */
const fmt = (ts) => {
    if (!ts) return "—";
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};
const ago = (ts) => {
    if (!ts) return "—";
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    const diff = Date.now() - d.getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "Just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
};

/* ─── sub-components ─── */
const Pill = ({ children, color = "gray" }) => {
    const map = {
        gray: "bg-gray-100 text-gray-600",
        blue: "bg-blue-50 text-blue-700 border border-blue-100",
        green: "bg-green-50 text-green-700 border border-green-100",
        red: "bg-red-50 text-red-600 border border-red-100",
        indigo: "bg-indigo-50 text-indigo-700 border border-indigo-100",
        amber: "bg-amber-50 text-amber-700 border border-amber-100",
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${map[color]}`}>
            {children}
        </span>
    );
};

const SectionCard = ({ icon: Icon, label, accent = "blue", children }) => {
    const colors = {
        blue: "text-blue-600 bg-blue-50",
        indigo: "text-indigo-600 bg-indigo-50",
        green: "text-green-600 bg-green-50",
        amber: "text-amber-600 bg-amber-50",
        red: "text-red-600 bg-red-50",
        purple: "text-purple-600 bg-purple-50",
    };
    return (
        <div className="bg-white rounded-2xl border border-gray-100  overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[accent]}`}>
                    <Icon size={16} />
                </div>
                <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-500">{label}</h2>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
};

const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
        <div className="mt-0.5">
            <Icon size={14} className="text-gray-300" />
        </div>
        <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</div>
            <div className="text-sm font-semibold text-gray-800 break-all">{value || "—"}</div>
        </div>
    </div>
);

const StatBox = ({ label, value, icon: Icon, color = "blue" }) => {
    const c = {
        blue: { bg: "bg-blue-50", text: "text-blue-700", icon: "text-blue-500" },
        green: { bg: "bg-green-50", text: "text-green-700", icon: "text-green-500" },
        amber: { bg: "bg-amber-50", text: "text-amber-700", icon: "text-amber-500" },
        purple: { bg: "bg-purple-50", text: "text-purple-700", icon: "text-purple-500" },
    }[color];
    return (
        <div className={`rounded-xl p-4 ${c.bg} flex items-center gap-3`}>
            <Icon size={20} className={c.icon} />
            <div>
                <div className={`text-2xl font-black ${c.text}`}>{value}</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</div>
            </div>
        </div>
    );
};

/* ─── COUPONS SECTION ─── */
const PAGE_SIZE_COUPONS = 5;

function CouponsSection({ coupons }) {
    const [filter, setFilter] = useState("all"); // all | redeemed | pending
    const [page, setPage] = useState(1);
    const [expanded, setExpanded] = useState(null);

    const filtered = useMemo(() => {
        if (filter === "redeemed") return coupons.filter(c => c.isRedeemed);
        if (filter === "pending") return coupons.filter(c => !c.isRedeemed);
        return coupons;
    }, [coupons, filter]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE_COUPONS);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE_COUPONS, page * PAGE_SIZE_COUPONS);

    const redeemedCount = coupons.filter(c => c.isRedeemed).length;
    const pendingCount = coupons.length - redeemedCount;

    const tabs = [
        { key: "all", label: `All (${coupons.length})` },
        { key: "redeemed", label: `Redeemed (${redeemedCount})` },
        { key: "pending", label: `Pending (${pendingCount})` },
    ];

    const handleFilterChange = (key) => {
        setFilter(key);
        setPage(1);
        setExpanded(null);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100  overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-50 text-amber-600">
                        <Gift size={16} />
                    </div>
                    <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-500">Coupons</h2>
                </div>
                {/* Filter tabs */}
                <div className="flex items-center bg-gray-50 rounded-xl p-1 gap-1 border border-gray-100">
                    {tabs.map(t => (
                        <button
                            key={t.key}
                            onClick={() => handleFilterChange(t.key)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${filter === t.key
                                ? "bg-white text-gray-800  border border-gray-100"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-6">
                {filtered.length === 0 ? (
                    <p className="text-sm text-gray-400 italic text-center py-8">No coupons in this category.</p>
                ) : (
                    <>
                        <div className="flex flex-col gap-3">
                            {paginated.map((c, i) => {
                                const key = `${c.couponId}-${i}`;
                                const isOpen = expanded === key;
                                return (
                                    <div key={key} className={`rounded-xl border transition-all overflow-hidden ${c.isRedeemed ? "border-green-100" : "border-gray-100"}`}>
                                        {/* Collapsed row — always visible */}
                                        <button
                                            onClick={() => setExpanded(isOpen ? null : key)}
                                            className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors ${c.isRedeemed ? "bg-green-50/50 hover:bg-green-50" : "bg-gray-50/50 hover:bg-gray-50"}`}
                                        >
                                            <div className="flex-1 flex items-center gap-3 min-w-0 flex-wrap">
                                                <span className="font-mono text-xs font-bold text-gray-700 bg-white border border-gray-200 px-2 py-0.5 rounded shrink-0">
                                                    {c.couponId}
                                                </span>
                                                <span className="text-xs font-bold text-green-700 shrink-0">₹{c.couponAmount}</span>
                                                <Pill color={c.isRedeemed ? "green" : "amber"}>
                                                    {c.isRedeemed ? "Redeemed" : "Pending"}
                                                </Pill>
                                                <span className="text-[11px] text-gray-400 font-mono hidden sm:block">Campaign: {c.campaignId}</span>
                                            </div>
                                            <div className={`text-gray-400 transition-transform ${isOpen ? "rotate-90" : ""}`}>
                                                <ChevronRight size={16} />
                                            </div>
                                        </button>

                                        {/* Expanded details */}
                                        {isOpen && (
                                            <div className="px-4 py-4 border-t border-gray-100 bg-white">
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                                                    {[
                                                        ["Campaign ID", c.campaignId],
                                                        ["Vendor ID", c.vendorId],
                                                        ["Price / Scan", `₹${c.pricePerScan}`],
                                                        ["Value", `₹${c.couponAmount}`],
                                                        ["Created", fmt(c.createdAt)],
                                                        ["Expires", fmt(c.expiry)],
                                                    ].map(([label, value]) => (
                                                        <div key={label}>
                                                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</div>
                                                            <div className="text-xs font-semibold text-gray-700 font-mono">{value}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {c.redirectLink && (
                                                    <a
                                                        href={c.redirectLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                                                    >
                                                        <ExternalLink size={12} />
                                                        Open Redirect Link
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50">
                                <span className="text-[11px] text-gray-400 font-medium">
                                    Showing {(page - 1) * PAGE_SIZE_COUPONS + 1}–{Math.min(page * PAGE_SIZE_COUPONS, filtered.length)} of {filtered.length}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(p => p - 1)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                        Prev
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                        <button
                                            key={n}
                                            onClick={() => setPage(n)}
                                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${n === page
                                                ? "bg-blue-600 text-white "
                                                : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                                                }`}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => setPage(p => p + 1)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

/* ─── SURVEYS SECTION ─── */
const PAGE_SIZE_SURVEYS = 4;

function SurveysSection({ surveys }) {
    const [page, setPage] = useState(1);
    const [filterCampaign, setFilterCampaign] = useState("all");

    // Unique campaign IDs for filter
    const campaigns = useMemo(() => {
        const ids = [...new Set(surveys.map(s => s.campaignId).filter(Boolean))];
        return ids;
    }, [surveys]);

    const filtered = useMemo(() => {
        if (filterCampaign === "all") return surveys;
        return surveys.filter(s => s.campaignId === filterCampaign);
    }, [surveys, filterCampaign]);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE_SURVEYS);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE_SURVEYS, page * PAGE_SIZE_SURVEYS);

    const handleCampaignFilter = (id) => {
        setFilterCampaign(id);
        setPage(1);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100  overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600">
                        <ClipboardList size={16} />
                    </div>
                    <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                        Survey Responses
                        <span className="ml-2 font-mono text-gray-300">({surveys.length})</span>
                    </h2>
                </div>
                {/* Campaign filter */}
                {campaigns.length > 1 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Campaign:</span>
                        <button
                            onClick={() => handleCampaignFilter("all")}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${filterCampaign === "all" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"}`}
                        >
                            All
                        </button>
                        {campaigns.map(id => (
                            <button
                                key={id}
                                onClick={() => handleCampaignFilter(id)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border font-mono transition-all ${filterCampaign === id ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"}`}
                            >
                                {id}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-6">
                {filtered.length === 0 ? (
                    <p className="text-sm text-gray-400 italic text-center py-8">No surveys for this campaign.</p>
                ) : (
                    <>
                        {/* Group by campaign visually */}
                        {(() => {
                            // Group paginated surveys by campaignId
                            const groups = paginated.reduce((acc, s) => {
                                const key = s.campaignId || "unknown";
                                if (!acc[key]) acc[key] = [];
                                acc[key].push(s);
                                return acc;
                            }, {});

                            return Object.entries(groups).map(([campaignId, items]) => (
                                <div key={campaignId} className="mb-6 last:mb-0">
                                    {/* Campaign group header */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="h-px flex-1 bg-gray-100" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 font-mono px-2">
                                            Campaign: {campaignId}
                                        </span>
                                        <div className="h-px flex-1 bg-gray-100" />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        {items.map((s, i) => (
                                            <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                {/* Question */}
                                                <div className="flex items-start justify-between gap-3 mb-3">
                                                    <p className="text-sm font-bold text-gray-800 leading-snug">{s.question}</p>
                                                    <span className="text-[10px] font-mono text-gray-400 whitespace-nowrap shrink-0">{ago(s.createdAt)}</span>
                                                </div>

                                                {/* Options */}
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {(s.options || []).map((opt, oi) => {
                                                        const selected = (s.selectedOption || []).includes(oi);
                                                        return (
                                                            <span key={oi} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-all ${selected
                                                                ? "bg-blue-600 text-white border-blue-600 "
                                                                : "bg-white text-gray-500 border-gray-200"
                                                                }`}>
                                                                {selected
                                                                    ? <CheckCircle2 size={11} className="shrink-0" />
                                                                    : <XCircle size={11} className="shrink-0 text-gray-300" />}
                                                                {opt.trim()}
                                                            </span>
                                                        );
                                                    })}
                                                </div>

                                                {/* Meta */}
                                                <div className="flex flex-wrap gap-3">
                                                    {[["Brand", s.brandId], ["Vendor", s.vendorId]].map(([label, val]) => val && (
                                                        <span key={label} className="text-[10px] font-mono text-gray-400 bg-white border border-gray-100 px-2 py-0.5 rounded">
                                                            {label}: {val}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ));
                        })()}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50">
                                <span className="text-[11px] text-gray-400 font-medium">
                                    Page {page} of {totalPages} • {filtered.length} responses
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(p => p - 1)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                        Prev
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                        <button
                                            key={n}
                                            onClick={() => setPage(n)}
                                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${n === page
                                                ? "bg-indigo-600 text-white "
                                                : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                                                }`}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => setPage(p => p + 1)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

/* ─── MAIN PAGE ─── */
export default function UserProfilePage() {
    const router = useRouter();
    const params = useParams();
    const userId = params?.id;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [blocking, setBlocking] = useState(false);
    const [copied, setCopied] = useState(false);

    const fetchUser = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/users/${userId}`);
            if (!res.ok) throw new Error("User not found");
            const data = await res.json();
            setUser(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => { fetchUser(); }, [fetchUser]);

    const toggleBlock = async () => {
        if (!user) return;
        setBlocking(true);
        try {
            const res = await fetch("/api/users/block", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: user.id || user.uid, isBlocked: !user.isBlocked }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setUser((prev) => ({ ...prev, isBlocked: !prev.isBlocked }));
        } catch (err) {
            alert("Failed to update status: " + err.message);
        } finally {
            setBlocking(false);
        }
    };

    const copyId = () => {
        navigator.clipboard.writeText(user?.uid || user?.id || "");
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    /* ─── loading / error states ─── */
    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-gray-500 font-medium">Loading user profile…</p>
        </div>
    );

    if (error || !user) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircle size={36} className="text-red-400" />
            </div>
            <div className="text-center">
                <h2 className="text-lg font-bold text-gray-900">Profile Not Found</h2>
                <p className="text-gray-500 mt-1">{error || "This user doesn't exist."}</p>
            </div>
            <button
                onClick={() => router.back()}
                className="mt-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
            >
                Go Back
            </button>
        </div>
    );

    const coupons = user.coupons || [];
    const surveys = user.survey || [];
    const interests = user.interests || [];
    const redeemedCount = coupons.filter(c => c.isRedeemed).length;
    const totalEarned = coupons.reduce((s, c) => s + (c.couponAmount || 0), 0);

    return (
        <div className="min-h-screen bg-[#f9fafb] px-6 py-6">

            {/* ── Top bar ── */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors group"
                >
                    <div className="w-9 h-9 bg-white rounded-xl border border-gray-200 flex items-center justify-center group-hover:border-gray-300 transition-all ">
                        <ArrowLeft size={16} />
                    </div>
                    Back to Users
                </button>
                <ChevronRight size={14} className="text-gray-300" />
                <span className="text-sm font-semibold text-gray-800 truncate max-w-xs">{user.name}</span>
            </div>

            {/* ── Hero Card ── */}
            <div className="bg-white rounded-2xl border border-gray-100  p-8 mb-6 relative overflow-hidden">
                {/* subtle background pattern */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "28px 28px" }} />

                <div className="relative flex flex-col md:flex-row gap-6 items-start">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.name}
                                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg" />
                        ) : (
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-4 border-white shadow-lg">
                                <User size={36} className="text-blue-500" />
                            </div>
                        )}
                        <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${user.isBlocked ? "bg-red-500" : "bg-green-500"}`}>
                            {user.isBlocked
                                ? <XCircle size={10} className="text-white" />
                                : <CheckCircle2 size={10} className="text-white" />}
                        </div>
                    </div>

                    {/* Identity */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="text-2xl font-black text-gray-900">{user.name}</h1>
                            <Pill color={user.isBlocked ? "red" : "green"}>
                                {user.isBlocked ? "SUSPENDED" : "ACTIVE"}
                            </Pill>
                            <Pill color="blue">{user.role?.toUpperCase() || "USER"}</Pill>
                            {user.lifeStage && <Pill color="indigo">{user.lifeStage}</Pill>}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                            <span className="flex items-center gap-1.5"><Mail size={13} />{user.email}</span>
                            <span className="flex items-center gap-1.5"><Phone size={13} />{user.phoneNumber}</span>
                            <span className="flex items-center gap-1.5"><MapPin size={13} />{user.address}</span>
                        </div>

                        {/* UID copy */}
                        <button
                            onClick={copyId}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-mono text-gray-500 transition-all"
                        >
                            <Hash size={11} />
                            {user.uid || user.id}
                            {copied ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
                        </button>
                    </div>

                    {/* Action */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                            onClick={toggleBlock}
                            disabled={blocking}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all  ${user.isBlocked
                                ? "bg-green-600 hover:bg-green-700 text-white shadow-green-100"
                                : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-100"
                                }`}
                        >
                            {blocking ? (
                                <Loader2 size={15} className="animate-spin" />
                            ) : user.isBlocked ? (
                                <UserCheck size={15} />
                            ) : (
                                <UserMinus size={15} />
                            )}
                            {user.isBlocked ? "Activate Account" : "Suspend Account"}
                        </button>
                    </div>
                </div>

                {/* Stat row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-50">
                    <StatBox label="Total Coupons" value={coupons.length} icon={Tag} color="blue" />
                    <StatBox label="Redeemed" value={redeemedCount} icon={ScanLine} color="green" />
                    <StatBox label="Surveys Done" value={surveys.length} icon={ClipboardList} color="purple" />
                    <StatBox label="Total Earned ₹" value={totalEarned} icon={Wallet} color="amber" />
                </div>
            </div>

            {/* ── 2-col grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT col */}
                <div className="lg:col-span-1 flex flex-col gap-6">

                    {/* Personal Details */}
                    <SectionCard icon={User} label="Personal Details" accent="blue">
                        <InfoRow icon={User} label="Full Name" value={user.name} />
                        <InfoRow icon={Calendar} label="Age" value={user.age ? `${user.age} years` : "—"} />
                        <InfoRow icon={Shield} label="Gender" value={user.gender} />
                        <InfoRow icon={GraduationCap} label="Life Stage" value={user.lifeStage} />
                        <InfoRow icon={Star} label="Reward Interest" value={user.rewardInterest} />
                    </SectionCard>

                    {/* Contact & Location */}
                    <SectionCard icon={MapPin} label="Contact & Location" accent="indigo">
                        <InfoRow icon={Mail} label="Email" value={user.email} />
                        <InfoRow icon={Phone} label="Phone" value={user.phoneNumber} />
                        <InfoRow icon={MapPin} label="Address" value={user.address} />
                        <InfoRow icon={Globe} label="Coordinates" value={
                            user.latitude && user.longitude
                                ? `${user.latitude}, ${user.longitude}`
                                : "—"
                        } />
                    </SectionCard>

                    {/* Account Status */}
                    <SectionCard icon={Shield} label="Account Status" accent="green">
                        <InfoRow icon={CheckCircle2} label="Blocked" value={user.isBlocked ? "Yes — Suspended" : "No — Active"} />
                        <InfoRow icon={Shield} label="Phone Verified" value={user.needsPhoneVerification ? "Pending" : "Verified"} />
                        <InfoRow icon={User} label="First Time User" value={user.isFirstTime ? "Yes" : "No"} />
                        <InfoRow icon={Clock} label="Account Created" value={fmt(user.createdAt)} />
                        <InfoRow icon={Clock} label="Last Seen" value={fmt(user.lastSeen || user.lastLoginAt)} />
                    </SectionCard>

                    {/* Interests */}
                    <SectionCard icon={Heart} label="Interests" accent="purple">
                        {interests.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">No interests recorded.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {interests.map((interest, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-[11px] font-bold">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        )}
                    </SectionCard>
                </div>

                {/* RIGHT col */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* Coupons */}
                    <CouponsSection coupons={coupons} />

                    {/* Surveys */}
                    <SurveysSection surveys={surveys} />

                </div>
            </div>
        </div>
    );
}
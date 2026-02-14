"use client";
import React, { useEffect, useState } from "react";
import {
    MapPin,
    Building2,
    User,
    Mail,
    IndianRupee,
    Settings,
    ExternalLink,
    FileText,
    AlertCircle,
    Loader2,
    Globe,
    Phone,
    Clock,
    Zap,
    CheckCircle2,
    ShieldCheck,
    CreditCard,
    Briefcase,
    Copy,
    CheckCheck,
    Calendar,
    Navigation,
    Image as ImageIcon,
    FileCheck,
    Store,
    CopyPlusIcon
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/Resublaty";


const ProfileCard = ({ label, value, icon: Icon, color = "blue", trend }) => {
    const colors = {
        blue: "text-blue-600 bg-blue-50",
        emerald: "text-emerald-600 bg-emerald-50",
        purple: "text-purple-600 bg-purple-50",
        orange: "text-orange-600 bg-orange-50",
    };
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${colors[color]}`}>
                    {Icon && <Icon size={18} />}
                </div>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{label}</p>
            <h3 className="text-xl font-black text-slate-900 mt-0.5">{value}</h3>
            {trend && <p className="text-[10px] text-slate-500 mt-1">{trend}</p>}
        </div>
    );
};

export default function VendorProfilePage() {
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [copiedId, setCopiedId] = useState(null);
    const router = useRouter();
    const { id } = useParams();
    useEffect(() => {

        const fetchVendor = async () => {
            try {
                setLoading(true);

                const response = await fetch(`/api/vendor/${id}`);
                const data = await response.json();

                if (data.success) setVendor(data.data);
                else throw new Error("Failed to load vendor");
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchVendor();
    }, []);

    const copyToClipboard = async (text) => {
        await navigator.clipboard.writeText(text);
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const tabs = [
        { key: "overview", label: "Overview", icon: FileText },
        { key: "operations", label: "Operations", icon: Clock },
        { key: "banking", label: "Financials", icon: CreditCard },
        { key: "documents", label: "Compliance", icon: ShieldCheck },
    ];

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-slate-500 font-medium">Loading Vendor Profile...</p>
            </div>
        </div>
    );

    if (error || !vendor) return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <div className="bg-white p-8 rounded-3xl border border-red-100 text-center max-w-sm">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Error</h2>
                <p className="text-slate-500 mb-6">{error}</p>
                <button onClick={() => window.location.reload()} className="w-full py-3 bg-black text-white rounded-xl font-bold">Try Again</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* HEADER */}
            <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-2">
                <div className="max-w-400 mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="h-11 w-11 border border-slate-200 rounded-sm flex items-center justify-center">
                            {vendor.media?.logo ? (
                                <img
                                    src={vendor.media.logo}
                                    alt="Logo"
                                    className="w-11 h-11 object-contain rounded-sm border border-slate-200"
                                />
                            ) : (
                                <div className="bg-black text-2xl font-semibold text-white h-11 w-11 flex items-center justify-center rounded-sm">
                                    {vendor.businessName?.charAt(0)?.toUpperCase() || <Building2 size={20} />}
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-bold text-slate-900">{vendor.businessName}</h1>
                                <Badge variant="success" label={vendor.category} />
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-[11px] text-slate-500 font-medium">
                                <span className="flex items-center gap-1"><User size={12} /> {vendor.ownerName}</span>
                                <span className="text-slate-300">|</span>
                                <div className="relative flex items-center gap-1 cursor-pointer" onClick={() => copyToClipboard(vendor.id)}>
                                    <span
                                        className={`absolute -top-7 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs bg-gray-700 text-white px-2 py-0.5 rounded-md shadow transition-all duration-200 whitespace-nowrap ${copiedId === vendor.id
                                            ? "opacity-100 scale-100"
                                            : "opacity-0 scale-90 pointer-events-none"
                                            }`}
                                    >
                                        ID Copied!
                                    </span>
                                    {copiedId === vendor.id ?
                                        <CheckCheck size={12} /> : <CopyPlusIcon size={12} />}
                                    <span className=" font-medium hover:text-blue-600 transition">
                                        {vendor.id?.substring(0, 12) || "N/A"}...
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => router.push(`/vendor/${id}/edit`)} className="hidden cursor-pointer sm:flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
                            <Settings className="w-4 h-4" /> Edit
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex items-center justify-between border-b border-slate-200 px-2 pt-3 sticky top-16 z-40 bg-[#F8FAFC]">
                {/* TAB NAVIGATION */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-1  overflow-x-auto no-scrollbar scroll-smooth">
                        {tabs.map(tab => (
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

            <main className="max-w-7xl mx-auto px-6 py-8">
                {activeTab === "overview" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* KPI GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <ProfileCard label="Category" value={vendor.category} icon={Store} color="blue" trend={vendor.subcategory} />
                            <ProfileCard label="Wallet Balance" value="₹4,250" icon={IndianRupee} color="emerald" trend="Settlement Pending" />
                            <ProfileCard label="Total Orders" value="128" icon={Zap} color="purple" trend="+12% this week" />
                            <ProfileCard label="Opening Hours" value={vendor.businessHours?.openingHours} icon={Clock} color="orange" trend={`Closes at ${vendor.businessHours?.closingHours}`} />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* CONTACT SECTION */}
                            <div className="lg:col-span-2 space-y-6">
                                <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                        <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                            <Phone size={14} className="text-blue-600" /> Contact Details
                                        </h3>
                                    </div>
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InfoItem label="Email Address" value={vendor.contact?.email} icon={Mail} isLink href={`mailto:${vendor.contact?.email}`} />
                                        <InfoItem label="Phone Number" value={vendor.contact?.phone} icon={Phone} />
                                        <InfoItem label="WhatsApp" value={vendor.contact?.whatsapp} icon={Zap} />
                                        <InfoItem label="Owner Name" value={vendor.ownerName} icon={User} />
                                    </div>
                                </section>

                                <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                        <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                            <MapPin size={14} className="text-red-600" /> Location Information
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                                                <Navigation size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{vendor.location?.address}</p>
                                                <p className="text-xs text-slate-500 mt-1">Coordinates: {vendor.location?.latitude}, {vendor.location?.longitude}</p>
                                            </div>
                                        </div>
                                        <button className="w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition">
                                            View on Google Maps
                                        </button>
                                    </div>
                                </section>
                            </div>

                            {/* SIDEBAR QUICK INFO */}
                            <div className="space-y-6">
                                <section className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl shadow-slate-200">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                        <Briefcase size={14} /> Business Summary
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                            <span className="text-[10px] uppercase font-bold text-slate-500">Sub-Category</span>
                                            <span className="text-sm font-bold">{vendor.subcategory}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/10 pb-3">
                                            <span className="text-[10px] uppercase font-bold text-slate-500">Status</span>
                                            <Badge variant="success" label="Active" />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] uppercase font-bold text-slate-500">Joined</span>
                                            <span className="text-sm font-bold">Feb 2026</span>
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-white rounded-2xl border border-slate-200 p-6">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Store Media</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {vendor.media?.shopImages.length > 0 ? (
                                            vendor.media.shopImages.map((img, i) => (
                                                <div key={i} className="aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-100">
                                                    <img src={img} className="w-full h-full object-cover" />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-2 py-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl text-slate-300">
                                                <ImageIcon size={24} />
                                                <span className="text-[10px] font-bold mt-2">No Images Uploaded</span>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "operations" && (
                    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                    <Clock size={14} className="text-orange-600" /> Business Hours
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl mb-6">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="text-orange-600" size={20} />
                                        <div>
                                            <p className="text-xs font-bold uppercase text-orange-700">Operating Days</p>
                                            <p className="text-sm font-black text-slate-900">{vendor.businessHours?.operatingDays[0].replace(/,/g, ' • ')}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 border border-slate-100 rounded-xl text-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Opening</p>
                                        <p className="text-xl font-black text-slate-900">{vendor.businessHours?.openingHours}</p>
                                    </div>
                                    <div className="p-4 border border-slate-100 rounded-xl text-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Closing</p>
                                        <p className="text-xl font-black text-slate-900">{vendor.businessHours?.closingHours}</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === "banking" && (
                    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-100 bg-emerald-50/30">
                                <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 text-emerald-700">
                                    <CreditCard size={14} /> Settlement Account
                                </h3>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative overflow-hidden group">
                                    <div className="absolute -right-5 -top-5 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                                        <CreditCard size={150} />
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-4">Account Number</p>
                                        <p className="text-2xl font-black tracking-widest text-slate-900 mb-6">
                                            {vendor.banking?.accountNumber.match(/.{1,4}/g).join(' ')}
                                        </p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">IFSC Code</p>
                                                <p className="text-sm font-black uppercase">{vendor.banking?.ifsc}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">UPI ID</p>
                                                <p className="text-sm font-black">{vendor.banking?.upiId}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold uppercase tracking-wide">
                                    <ShieldCheck size={14} /> Verified for payouts
                                </div>
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === "documents" && (
                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <DocumentCard title="GST Certificate" sub={vendor.documents?.gstNumber} link={vendor.documents?.agreementDocument} />
                        <DocumentCard title="Identity Document" sub="Aadhar / PAN" link={vendor.documents?.idDocument} />
                        <DocumentCard title="Registration Proof" sub={vendor.documents?.registrationNumber} link={vendor.documents?.idDocument} />
                        <DocumentCard title="Service Agreement" sub="Signed Contract" link={vendor.documents?.agreementDocument} />
                    </div>
                )}
            </main>
        </div>
    );
}

const InfoItem = ({ label, value, icon: Icon, isLink, href }) => (
    <div className="flex flex-col gap-1 border-l-2 border-slate-100 pl-4 py-1 hover:border-blue-300 transition-colors">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        {isLink ? (
            <a href={href} className="text-sm font-black text-blue-600 flex items-center gap-1">
                {value} <ExternalLink size={12} />
            </a>
        ) : (
            <span className="text-sm font-black text-slate-800">{value || "N/A"}</span>
        )}
    </div>
);

const DocumentCard = ({ title, sub, link }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between hover:border-blue-400 transition-all group">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <FileCheck size={24} />
            </div>
            <div>
                <h4 className="text-sm font-black text-slate-900">{title}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-tight">{sub}</p>
            </div>
        </div>
        <a href={link} target="_blank" className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
            <ExternalLink size={18} />
        </a>
    </div>
);
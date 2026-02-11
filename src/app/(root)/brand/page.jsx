"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    BadgeCheck,
    MapPin,
    Building2,
    MoreVertical,
    Eye,
    Pencil,
    Archive,
    ChevronRight,
    Wallet,
    PlusCircle,
} from "lucide-react";
import Card from "@/components/Card";

export default function BrandsPage() {
    const router = useRouter();
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [industryType, setIndustryType] = useState("");
    const [isVerified, setIsVerified] = useState("");
    const [targetLocation, setTargetLocation] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);
    const [industries, setIndustries] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loadingFilters, setLoadingFilters] = useState(true);
    const menuRef = useRef(null);

    // Fetch industries and locations on mount
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                setLoadingFilters(true);
                const [industriesRes, locationsRes] = await Promise.all([
                    fetch("/api/brands?action=industries"),
                    fetch("/api/brands?action=locations"),
                ]);

                const industriesData = await industriesRes.json();
                const locationsData = await locationsRes.json();

                setIndustries(industriesData.industries || []);
                setLocations(locationsData.locations || []);
            } catch (error) {
                console.error("Failed to fetch filters:", error);
            } finally {
                setLoadingFilters(false);
            }
        };

        fetchFilters();
    }, []);

    const fetchBrands = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (industryType) params.append("industryType", industryType);
        if (isVerified) params.append("isVerified", isVerified);
        if (targetLocation) params.append("targetLocation", targetLocation);

        try {
            const res = await fetch(`/api/brands?${params.toString()}`);
            const data = await res.json();
            setBrands(data.brands || []);
        } catch (error) {
            console.error("Failed to fetch brands:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-[#f9fafb] px-10 py-4 pt-6">


            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card
                    title="Total Brands"
                    value={brands.length}
                    icon={Wallet}
                    iconBg="bg-indigo-50"
                    iconColor="text-indigo-600"
                />
                <Card
                    title="Active Brands"
                    value={brands.filter((b) => b.status === "live").length}
                    icon={Wallet}
                    iconBg="bg-green-50"
                    iconColor="text-green-600"
                />
                <Card
                    title="Pilot Brands"
                    value={brands.filter((b) => b.status === "trial").length}
                    icon={Wallet}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-600"
                />
                <Card
                    title="upcoming Brands"
                    value={brands.filter((b) => b.status === "paused").length}
                    icon={Wallet}
                    iconBg="bg-orange-50"
                    iconColor="text-orange-600"
                />
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-2xl  border border-slate-200 p-6 mb-8 flex items-center justify-between">
                <div className="flex flex-wrap gap-4 items-end">
                    {/* Search */}
                    {/* <div className="flex-1 min-w-64">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Search
                        </label>
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-3 text-slate-400"
                                size={18}
                            />
                            <input
                                placeholder="Search brand, business, email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div> */}



                    {/* Industry Filter */}
                    <div className="min-w-48">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Category
                        </label>
                        <select
                            value={industryType}
                            onChange={(e) => setIndustryType(e.target.value)}
                            disabled={loadingFilters}
                            className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400"
                        >
                            <option value="">All Industries</option>
                            {industries.map((industry) => (
                                <option key={industry.id} value={industry.name}>
                                    {industry.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="min-w-48">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Status
                        </label>
                        <select
                            value={isVerified}
                            onChange={(e) => setIsVerified(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                        >
                            <option value="">All Status</option>
                            <option value="true">Verified</option>
                            <option value="false">Unverified</option>
                        </select>
                    </div>

                    {/* Location Filter */}
                    <div className="min-w-48">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Location
                        </label>
                        <select
                            value={targetLocation}
                            onChange={(e) => setTargetLocation(e.target.value)}
                            disabled={loadingFilters}
                            className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white disabled:bg-slate-50 disabled:text-slate-400"
                        >
                            <option value="">All Locations</option>
                            {locations.map((location) => (
                                <option key={location.id} value={location.name}>
                                    {location.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Apply Button */}
                    <button
                        onClick={fetchBrands}
                        className="bg-blue-200 text-blue-700 border-blue-400 border px-5 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                        Apply
                    </button>
                </div>
                <button onClick={() => router.push("/brand/add-brand")} className="bg-green-200  px-6 py-2.5 rounded-md text-md font-medium transition-colors duration-200 mt-7  hover:bg-green-400 cursor-pointer flex items-center gap-1.5 shadow-xl hover:shadow-neutral-300 ">
                    <PlusCircle size={18} />
                    Add Brand
                </button>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl  border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="py-16 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                        <p className="text-slate-600">Loading brands...</p>
                    </div>
                ) : brands.length === 0 ? (
                    <div className="py-16 text-center">
                        <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600">No brands found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-left text-xs font-semibolds tracking-wider">
                                        Brand Name
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibolds tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibolds tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibolds tracking-wider">
                                        City
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibolds tracking-wider">
                                        Monthly Cap
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibolds tracking-wider">
                                        Total Campaigns
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibolds tracking-wider">
                                        Total Engagements
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibolds tracking-wider">
                                        Avg CPVE
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibolds tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {brands.map((brand) => (
                                    <tr
                                        key={brand.id}
                                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-150 last:border-b-0"
                                    >

                                        {/* Brand Name */}
                                        <td className="px-6 py-4 cursor-pointer" onClick={() => router.push(`/brand/${brand.id}`)}>
                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    {brand.brandName}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {brand.id}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-700">
                                                <Building2
                                                    size={16}
                                                    className="text-slate-400"
                                                />
                                                <span className="text-sm">
                                                    {brand.industryType}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Status Badge */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${brand.status === "Active"
                                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                                    }`}
                                            >
                                                <BadgeCheck size={14} />

                                                {brand.status}
                                            </span>
                                        </td>

                                        {/* City / Area */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-700">
                                                <MapPin
                                                    size={16}
                                                    className="text-purple-400"
                                                />
                                                <span className="text-sm">
                                                    {brand.targetLocation || brand.city}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Budget */}
                                        <td className="px-6 py-4 ">
                                            <span className="text-sm font-semibold text-green-500">
                                                ₹
                                                {brand.adBudget?.toLocaleString(
                                                    "en-IN"
                                                ) || "0"}
                                            </span>
                                        </td>

                                        {/* Active Campaigns */}
                                        <td className="px-6 py-4 ">
                                            <span className="text-sm text-black">
                                                {brand.activeCampaigns || 'N/A'}
                                            </span>
                                        </td>

                                        {/* Total Engagements */}
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-black">
                                                {brand.totalEngagements || 'N/A'}
                                            </span>
                                        </td>

                                        {/* CPVE */}
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-600">
                                                {brand.defaultCPVE || "N/A"}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end relative">
                                                <button
                                                    onClick={() =>
                                                        setOpenMenuId(
                                                            openMenuId ===
                                                                brand.id
                                                                ? null
                                                                : brand.id
                                                        )
                                                    }
                                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-150"
                                                    aria-label="More actions"
                                                >
                                                    <MoreVertical
                                                        size={18}
                                                        className="text-slate-600"
                                                    />
                                                </button>

                                                {openMenuId === brand.id && (
                                                    <div
                                                        ref={menuRef}
                                                        className="absolute right-0 top-10 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden"
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                router.push(
                                                                    `/brand/${brand.id}`
                                                                );
                                                                setOpenMenuId(
                                                                    null
                                                                );
                                                            }}
                                                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors duration-150 border-b border-slate-100"
                                                        >
                                                            <Eye
                                                                size={16}
                                                                className="text-blue-600"
                                                            />
                                                            <span>
                                                                View Profile
                                                            </span>
                                                            <ChevronRight
                                                                size={16}
                                                                className="ml-auto text-slate-400"
                                                            />
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                router.push(
                                                                    `/brand/${brand.id}/edit`
                                                                );
                                                                setOpenMenuId(
                                                                    null
                                                                );
                                                            }}
                                                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 transition-colors duration-150 border-b border-slate-100"
                                                        >
                                                            <Pencil
                                                                size={16}
                                                                className="text-blue-600"
                                                            />
                                                            <span>
                                                                Edit Brand
                                                            </span>
                                                            <ChevronRight
                                                                size={16}
                                                                className="ml-auto text-slate-400"
                                                            />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
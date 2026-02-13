"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    MapPin,
    Building2,
    MoreVertical,
    Eye,
    Pencil,
    Trash2,
    Users,
    Map,
} from "lucide-react";
import Card from "@/components/Card";
import { ActionMenu, EmptyState, LoadingSpinner } from "@/components/Resublaty";
import LocationToolbar from "@/components/LocationToolbar";
import FilterDrawer from "@/components/FilterDrawer";

export default function LocationsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [loadingFilters, setLoadingFilters] = useState(true);
    const menuRef = useRef(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [toast, setToast] = useState(null);

    // ✅ FIX #3: Initialize filters from URL params
    const [filters, setFilters] = useState({
        search: searchParams.get("search") || "",
        locationType: searchParams.getAll("locationType") || [],
        status: searchParams.getAll("status") || [],
        city: searchParams.getAll("city") || [],
        campus_type: searchParams.getAll("campus_type") || [],
        college_type: searchParams.getAll("college_type") || [],
        education_level: searchParams.getAll("education_level") || [],
        footfall_level: searchParams.getAll("footfall_level") || [],
        gender_skew: searchParams.getAll("gender_skew") || [],
        primary_audience: searchParams.getAll("primary_audience") || [],
        age_band: searchParams.getAll("age_band") || [],
        area: searchParams.getAll("area") || [],
    });

    const [filterOptions, setFilterOptions] = useState < FilterOptions > ({
        locationTypes: [],
        statuses: [],
        cities: [],
        campus_types: [],
        college_types: [],
        education_levels: [],
        footfall_levels: [],
        gender_skews: [],
        primary_audiences: [],
        age_bands: [],
        areas: [],
    });

    // ✅ FIX #10: Simple toast notification system
    const showToast = useCallback(
        (message, type) => {
            setToast({ message, type });
            setTimeout(() => setToast(null), 3000);
        },
        []
    );

    // Fetch filter options on mount
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                setLoadingFilters(true);
                const res = await fetch("/api/location/filter-options");

                // ✅ FIX #15: Validate API response
                if (!res.ok) {
                    throw new Error(`Failed to fetch filter options: ${res.status}`);
                }

                const data = await res.json();

                if (!data || typeof data !== "object") {
                    throw new Error("Invalid response format");
                }

                setFilterOptions({
                    locationTypes: Array.isArray(data.locationTypes)
                        ? data.locationTypes
                        : [],
                    statuses: Array.isArray(data.statuses)
                        ? data.statuses
                        : ["Active", "Inactive"],
                    cities: Array.isArray(data.cities) ? data.cities : [],
                    campus_types: Array.isArray(data.campus_types)
                        ? data.campus_types
                        : [],
                    college_types: Array.isArray(data.college_types)
                        ? data.college_types
                        : [],
                    education_levels: Array.isArray(data.education_levels)
                        ? data.education_levels
                        : [],
                    footfall_levels: Array.isArray(data.footfall_levels)
                        ? data.footfall_levels
                        : [],
                    gender_skews: Array.isArray(data.gender_skews)
                        ? data.gender_skews
                        : [],
                    primary_audiences: Array.isArray(data.primary_audiences)
                        ? data.primary_audiences
                        : [],
                    age_bands: Array.isArray(data.age_bands)
                        ? data.age_bands
                        : [],
                    areas: Array.isArray(data.areas) ? data.areas : [],
                });
            } catch (error) {
                console.error("Failed to fetch filter options:", error);
                showToast("Failed to load filter options", "error");
            } finally {
                setLoadingFilters(false);
            }
        };

        fetchFilterOptions();
    }, [showToast]);

    // ✅ FIX #1: Correct useCallback dependencies
    const fetchLocations = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();

        if (filters.search) params.append("search", filters.search);
        filters.locationType.forEach((val) =>
            params.append("locationType", val)
        );
        filters.status.forEach((val) => params.append("status", val));
        filters.city.forEach((val) => params.append("city", val));
        filters.campus_type.forEach((val) =>
            params.append("campus_type", val)
        );
        filters.college_type.forEach((val) =>
            params.append("college_type", val)
        );
        filters.education_level.forEach((val) =>
            params.append("education_level", val)
        );
        filters.footfall_level.forEach((val) =>
            params.append("footfall_level", val)
        );
        filters.gender_skew.forEach((val) =>
            params.append("gender_skew", val)
        );
        filters.primary_audience.forEach((val) =>
            params.append("primary_audience", val)
        );
        filters.age_band.forEach((val) => params.append("age_band", val));
        filters.area.forEach((val) => params.append("area", val));

        try {
            const res = await fetch(`/api/location?${params.toString()}`);

            // ✅ FIX #15: Validate API response
            if (!res.ok) {
                throw new Error(`API error: ${res.status}`);
            }

            const data = await res.json();

            if (!Array.isArray(data.locations)) {
                console.warn("Invalid API response structure");
                setLocations([]);
            } else {
                setLocations(data.locations);
            }
        } catch (error) {
            console.error("Failed to fetch locations:", error);
            showToast("Failed to load locations", "error");
        } finally {
            setLoading(false);
        }
    }, [filters, showToast]);

    // ✅ FIX #3: Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (filters.search) params.append("search", filters.search);
        filters.locationType.forEach((val) =>
            params.append("locationType", val)
        );
        filters.status.forEach((val) => params.append("status", val));
        filters.city.forEach((val) => params.append("city", val));

        const queryString = params.toString();
        const newUrl = queryString ? `?${queryString}` : "";
        window.history.replaceState({}, "", newUrl);
    }, [filters]);

    // ✅ FIX #2: Fetch when filters change via dependency
    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target)
            ) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ✅ FIX #6: Better error handling for delete
    const handleDelete = async (id) => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/location/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(
                    error.message || "Failed to delete location"
                );
            }
            setLocations((prev) => prev.filter((l) => l.id !== id));
            setDeleteConfirm(null);
            showToast("Location deleted successfully", "success");
        } catch (error) {
            console.error("Delete error:", error);
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to delete location";
            showToast(message, "error");
        } finally {
            setDeleting(false);
        }
    };

    // ✅ FIX #4: Memoize stats calculation
    const stats = useMemo(
        () => ({
            total: locations.length,
            active: locations.filter((l) => l.status === "Active").length,
            colleges: locations.filter(
                (l) => l.location_type === "College"
            ).length,
            foodBeverage: locations.filter(
                (l) => l.location_type === "Food & Beverage"
            ).length,
        }),
        [locations]
    );

    const hasActiveFilters =
        filters.search !== "" ||
        filters.locationType.length > 0 ||
        filters.status.length > 0 ||
        filters.city.length > 0 ||
        filters.campus_type.length > 0 ||
        filters.college_type.length > 0 ||
        filters.education_level.length > 0 ||
        filters.footfall_level.length > 0 ||
        filters.gender_skew.length > 0 ||
        filters.primary_audience.length > 0 ||
        filters.age_band.length > 0 ||
        filters.area.length > 0;

    const clearFilters = () => {
        setFilters({
            search: "",
            locationType: [],
            status: [],
            city: [],
            campus_type: [],
            college_type: [],
            education_level: [],
            footfall_level: [],
            gender_skew: [],
            primary_audience: [],
            age_band: [],
            area: [],
        });
    };

    const handleFilterChange = (
        key,
        value,
        isMulti = false
    ) => {
        setFilters((prev) => ({
            ...prev,
            [key]: isMulti
                ? Array.isArray(prev[key])
                    ? (prev[key]).includes(value)
                        ? (prev[key]).filter((v) => v !== value)
                        : [...(prev[key]), value]
                    : [value]
                : value,
        }));
    };

    const applyFilters = () => {
        setIsFilterOpen(false);
        // fetchLocations is called automatically via useEffect dependency
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ✅ FIX #10: Toast notification */}
            {toast && (
                <div
                    className={`fixed top-4 right-4 px-4 py-3 rounded-lg text-white z-50 ${toast.type === "success"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                >
                    {toast.message}
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 mb-8">
                    <Card title="Total Locations" value={stats.total} icon={Map} />
                    <Card
                        title="Active Locations"
                        value={stats.active}
                        icon={MapPin}
                    />
                    <Card
                        title="Colleges"
                        value={stats.colleges}
                        icon={Building2}
                    />
                    <Card
                        title="Food & Beverage"
                        value={stats.foodBeverage}
                        icon={Users}
                    />
                </div>

                {/* Toolbar */}
                <LocationToolbar
                    search={filters.search}
                    setSearch={(value) =>
                        handleFilterChange("search", value, false)
                    }
                    onOpenFilters={() => setIsFilterOpen(true)}
                    onClearFilters={clearFilters}
                    onAdd={() => router.push("/locations/add")}
                    hasActiveFilters={hasActiveFilters}
                />

                {/* Filter Drawer */}
                {isFilterOpen && (
                    <FilterDrawer
                        filters={filters}
                        filterOptions={filterOptions}
                        loading={loadingFilters}
                        onFilterChange={handleFilterChange}
                        onApply={applyFilters}
                        onClose={() => setIsFilterOpen(false)}
                        onClear={clearFilters}
                    />
                )}

                {/* Locations Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {loading ? (
                        <LoadingSpinner message="Loading locations..." />
                    ) : locations.length === 0 ? (
                        <EmptyState
                            icon={Map}
                            title="No locations found"
                            description="Create your first location to get started"
                            action={{
                                label: "Add Location",
                                onClick: () =>
                                    router.push("/locations/add"),
                            }}
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Location Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            City
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Daily Reach
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Engagement Rate
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Campaign A/U/C
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {locations.map((location) => (
                                        <LocationRow
                                            key={location.id}
                                            location={location}
                                            isMenuOpen={
                                                openMenuId === location.id
                                            }
                                            onMenuToggle={() =>
                                                setOpenMenuId(
                                                    openMenuId === location.id
                                                        ? null
                                                        : location.id
                                                )
                                            }
                                            onView={() =>
                                                router.push(
                                                    `/locations/${location.id}`
                                                )
                                            }
                                            onEdit={() =>
                                                router.push(
                                                    `/locations/${location.id}/edit`
                                                )
                                            }
                                            onDelete={() =>
                                                setDeleteConfirm(location.id)
                                            }
                                            menuRef={menuRef}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {deleteConfirm && (
                <ConfirmDialog
                    title="Delete Location"
                    message="Are you sure you want to delete this location? This action cannot be undone."
                    onConfirm={() => handleDelete(deleteConfirm)}
                    onCancel={() => setDeleteConfirm(null)}
                    loading={deleting}
                    type="danger"
                />
            )}
        </div>
    );
}

/* ========== REUSABLE COMPONENTS ========== */

function LocationRow({
    location,
    isMenuOpen,
    onMenuToggle,
    onView,
    onEdit,
    onDelete,
    menuRef,
}) {
    const statusColors = {
        Active: "bg-green-100 text-green-700 border-green-200",
        Inactive: "bg-gray-100 text-gray-700 border-gray-200",
    };

    const typeIcons = {
        College: Building2,
        "Food & Beverage": Users,
        Retail: MapPin,
        Office: Building2,
        Mall: MapPin,
    };

    const TypeIcon = typeIcons[location.location_type] || MapPin;

    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 last:border-b-0">
            <td className="px-6 py-4 cursor-pointer" onClick={onView}>
                <div>
                    <p className="font-semibold text-gray-900">
                        {location.location_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {location.college_tags && location.college_tags.length > 0
                            ? location.college_tags.join(", ")
                            : "None"}
                    </p>
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-gray-700">
                        <TypeIcon size={16} className="text-blue-600" />
                        <span className="text-sm">
                            {location.location_type}
                        </span>
                    </div>
                </div>
            </td>

            <td className="px-6 py-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-gray-700">
                        <MapPin size={16} className="text-red-500" />
                        <span className="text-sm">{location.city}</span>
                    </div>
                    <span className="text-xs text-gray-500 pl-6">
                        {location.area || "N/A"}
                    </span>
                </div>
            </td>

            <td className="px-6 py-4">
                <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${statusColors[location.status] ||
                        statusColors["Active"]
                        }`}
                >
                    {location.status}
                </span>
            </td>

            <td className="px-6 py-4">
                <span className="text-sm font-semibold text-gray-900">
                    {location.daily_reach || "N/A"}
                </span>
            </td>

            <td className="px-6 py-4">
                <span className="text-sm font-semibold text-gray-900">
                    %{location.engagement_rate || "N/A"}
                </span>
            </td>

            <td className="px-6 py-4">
                <span className="text-sm font-semibold text-gray-700 pl-4">
                    <span className="text-green-500">{location.a || "0"}</span> |{" "}
                    <span className="text-yellow-500">
                        {location.u || "0"}
                    </span>{" "}
                    | <span className="text-purple-500">{location.c || "0"}</span>
                </span>
            </td>

            <td className="px-6 py-4 text-right">
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={onMenuToggle}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-150"
                    >
                        <MoreVertical
                            size={18}
                            className="text-gray-600"
                        />
                    </button>

                    <ActionMenu
                        isOpen={isMenuOpen}
                        actions={[
                            {
                                label: "View Details",
                                icon: Eye,
                                onClick: onView,
                                className: "text-blue-600",
                            },
                            {
                                label: "Edit Location",
                                icon: Pencil,
                                onClick: onEdit,
                                className: "text-blue-600",
                            },
                            {
                                label: "Delete",
                                icon: Trash2,
                                onClick: onDelete,
                                className: "text-red-600",
                                isDanger: true,
                            },
                        ]}
                        menuRef={menuRef}
                    />
                </div>
            </td>
        </tr>
    );
}

function ConfirmDialog({
    title,
    message,
    onConfirm,
    onCancel,
    loading,
    type = "default",
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {title}
                </h3>
                <p className="text-gray-600 text-sm mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${type === "danger"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loading && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
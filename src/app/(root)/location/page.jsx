"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    MapPin,
    Building2,
    MoreVertical,
    Eye,
    Pencil,
    Trash2,
    Users,
    Map,
    Search,
    SlidersHorizontal,
    X,
    Plus,
    ChevronDown,
    AlertCircle,
} from "lucide-react";
import Card from "@/components/Card";
import { ActionMenu, EmptyState, LoadingSpinner } from "@/components/Resublaty";

export default function LocationsPage() {
    const router = useRouter();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const menuRef = useRef(null);

    // Enhanced filter states with multi-select support
    const [filters, setFilters] = useState({
        locationType: [],
        status: [],
        city: [],
        collegeTags: [],
        ageBand: [],
        footfallLevel: [],
        campusType: [],
        educationLevel: [],
        genderSkew: [],
    });

    const [filterOptions, setFilterOptions] = useState({
        locationTypes: [],
        statuses: [],
        cities: [],
        collegeTags: [],
        ageBands: [],
        footfallLevels: [],
        campusTypes: [],
        educationLevels: [],
        genderSkews: [],
    });

    const [loadingFilters, setLoadingFilters] = useState(true);
    const [filterError, setFilterError] = useState(null);

    // Fetch filter options on mount
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                setLoadingFilters(true);
                setFilterError(null);
                const res = await fetch("/api/location/filter-options?action=filterOptions");
                if (!res.ok) throw new Error("Failed to fetch filters");
                const data = await res.json();
                setFilterOptions(data);
            } catch (error) {
                console.error("Failed to fetch filter options:", error);
                setFilterError("Could not load filter options");
            } finally {
                setLoadingFilters(false);
            }
        };

        fetchFilterOptions();
    }, []);

    // Fetch locations with filters (optimized)
    const fetchLocations = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams();

        if (search) params.append("search", search);

        // Handle multi-select filters
        Object.entries(filters).forEach(([key, values]) => {
            if (Array.isArray(values) && values.length > 0) {
                params.append(key, values.join(","));
            }
        });

        try {
            const res = await fetch(`/api/location?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch locations");
            const data = await res.json();
            setLocations(data.locations || []);
        } catch (error) {
            console.error("Failed to fetch locations:", error);
            setLocations([]);
        } finally {
            setLoading(false);
        }
    }, [search, filters]);



    // Debounced search and filters
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchLocations();
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [search, filters, fetchLocations]);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle filter change with multi-select
    const handleFilterChange = (key, value) => {
        setFilters((prev) => {
            const currentValues = prev[key];
            const newValues = currentValues.includes(value)
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value];
            return { ...prev, [key]: newValues };
        });
    };

    // Clear all filters
    const clearAllFilters = () => {
        setFilters({
            locationType: [],
            status: [],
            city: [],
            collegeTags: [],
            ageBand: [],
            footfallLevel: [],
            campusType: [],
            educationLevel: [],
            genderSkew: [],
        });
        setSearch("");
    };

    // Calculate active filters count
    const activeFilterCount = useMemo(() => {
        const filterCount = Object.values(filters).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
        return filterCount + (search ? 1 : 0);
    }, [filters, search]);

    // Delete location
    const handleDelete = async (id) => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/location/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete");
            setLocations(locations.filter((l) => l.id !== id));
            setDeleteConfirm(null);
            alert("Location deleted successfully");
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete location");
        } finally {
            setDeleting(false);
        }
    };

    // Stats calculations (memoized for performance)
    const stats = useMemo(() => ({
        total: locations.length,
        active: locations.filter((l) => l.status === "Active").length,
        colleges: locations.filter((l) => l.location_type === "College").length,
        foodBeverage: locations.filter((l) => l.location_type === "Food & Beverage").length,
    }), [locations]);


    return (
        <div className="min-h-screen bg-[#f9fafb] px-10 py-4 pt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 mb-8">
                <Card title="Total Locations" value={stats.total} icon={Map} />
                <Card title="Active Locations" value={stats.active} icon={MapPin} />
                <Card title="Colleges" value={stats.colleges} icon={Building2} />
                <Card title="Food & Beverage" value={stats.foodBeverage} icon={Users} />
            </div>
            <div className="">


                {/* Search and Action Bar */}
                <div className="flex gap-4 mb-8 flex-col sm:flex-row">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, ID, or email"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filters Button */}
                    <button
                        onClick={() => setFilterPanelOpen(!filterPanelOpen)}
                        className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative bg-white whitespace-nowrap"
                    >
                        <SlidersHorizontal size={20} className="text-gray-600" />
                        <span className="text-gray-700 font-medium">Filters</span>
                        {activeFilterCount > 0 && (
                            <span className="ml-2 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>

                    {/* Add Location Button */}
                    <button
                        onClick={() => router.push("/location/add-location")}
                        className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                    >
                        <Plus size={20} />
                        <span>Add Location</span>
                    </button>
                </div>

                {/* Active Filters Display */}
                {activeFilterCount > 0 && (
                    <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                        <AlertCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm text-blue-900 font-medium mb-2">Active Filters ({activeFilterCount})</p>
                            <div className="flex flex-wrap gap-2">
                                {search && (
                                    <FilterTag label={`Search: "${search}"`} onRemove={() => setSearch("")} />
                                )}
                                {Object.entries(filters).map(([key, values]) =>
                                    Array.isArray(values) && values.map((value) => (
                                        <FilterTag
                                            key={`${key}-${value}`}
                                            label={value}
                                            onRemove={() => handleFilterChange(key, value)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Locations Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {loading ? (
                        <LoadingSpinner message="Loading locations..." />
                    ) : locations.length === 0 ? (
                        <EmptyState
                            icon={Map}
                            title={activeFilterCount > 0 ? "No locations match your filters" : "No locations found"}
                            description={activeFilterCount > 0 ? "Try adjusting your filter criteria" : "Create your first location to get started"}
                            action={
                                activeFilterCount > 0
                                    ? {
                                        label: "Clear Filters",
                                        onClick: clearAllFilters,
                                    }
                                    : {
                                        label: "Add Location",
                                        onClick: () => router.push("/location/add-location"),
                                    }
                            }
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
                                            isMenuOpen={openMenuId === location.id}
                                            onMenuToggle={() =>
                                                setOpenMenuId(
                                                    openMenuId === location.id ? null : location.id
                                                )
                                            }
                                            onView={() =>
                                                router.push(`/location/${location.id}`)
                                            }
                                            onEdit={() =>
                                                router.push(`/location/${location.id}/edit`)
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

                {/* Filter Panel Modal */}
                <FilterPanel
                    isOpen={filterPanelOpen}
                    onClose={() => setFilterPanelOpen(false)}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearAll={clearAllFilters}
                    filterOptions={filterOptions}
                    activeFilterCount={activeFilterCount}
                    isLoadingFilters={loadingFilters}
                    filterError={filterError}
                />
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

/* ========== FILTER TAG COMPONENT ========== */

function FilterTag({ label, onRemove }) {
    return (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-300 rounded-full text-xs text-blue-700">
            <span>{label}</span>
            <button
                onClick={onRemove}
                className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                aria-label="Remove filter"
            >
                <X size={14} />
            </button>
        </div>
    );
}

/* ========== FILTER PANEL COMPONENT ========== */

function FilterPanel({
    isOpen,
    onClose,
    filters,
    onFilterChange,
    onClearAll,
    filterOptions,
    activeFilterCount,
    isLoadingFilters,
    filterError,
}) {
    const [sortBy, setSortBy] = useState("Most recently added");

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/40 z-30"
                onClick={onClose}
            />

            {/* Modal Panel */}
            <div className="fixed inset-0 z-40 flex justify-end mt-15">
                <div className="bg-white w-full max-w-md h-full shadow-xl flex flex-col transition-transform duration-300">
                    {/* Header */}
                    <div className="shadow-sm/10 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Filters
                                </h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Filter Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {filterError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                                <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{filterError}</p>
                            </div>
                        )}

                        {isLoadingFilters ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-6">
                                {/* Collapsible Filter Groups */}
                                {filterOptions.locationTypes && filterOptions.locationTypes.length > 0 && (
                                    <CollapsibleFilterSection
                                        title="Location Type"
                                        count={filters.locationType.length}
                                    >
                                        {filterOptions.locationTypes.map((type) => (
                                            <FilterCheckbox
                                                key={type}
                                                label={type}
                                                checked={filters.locationType.includes(type)}
                                                onChange={() => onFilterChange("locationType", type)}
                                            />
                                        ))}
                                    </CollapsibleFilterSection>
                                )}

                                {filterOptions.statuses && filterOptions.statuses.length > 0 && (
                                    <CollapsibleFilterSection
                                        title="Status"
                                        count={filters.status.length}
                                    >
                                        {filterOptions.statuses.map((status) => (
                                            <FilterCheckbox
                                                key={status}
                                                label={status}
                                                checked={filters.status.includes(status)}
                                                onChange={() => onFilterChange("status", status)}
                                            />
                                        ))}
                                    </CollapsibleFilterSection>
                                )}

                                {filterOptions.cities && filterOptions.cities.length > 0 && (
                                    <CollapsibleFilterSection
                                        title="City"
                                        count={filters.city.length}
                                    >
                                        {filterOptions.cities.map((city) => (
                                            <FilterCheckbox
                                                key={city}
                                                label={city}
                                                checked={filters.city.includes(city)}
                                                onChange={() => onFilterChange("city", city)}
                                            />
                                        ))}
                                    </CollapsibleFilterSection>
                                )}

                                {filterOptions.collegeTags && filterOptions.collegeTags.length > 0 && (
                                    <CollapsibleFilterSection
                                        title="College Tags"
                                        count={filters.collegeTags.length}
                                    >
                                        {filterOptions.collegeTags.map((tag) => (
                                            <FilterCheckbox
                                                key={tag}
                                                label={tag}
                                                checked={filters.collegeTags.includes(tag)}
                                                onChange={() => onFilterChange("collegeTags", tag)}
                                            />
                                        ))}
                                    </CollapsibleFilterSection>
                                )}

                                {filterOptions.ageBands && filterOptions.ageBands.length > 0 && (
                                    <CollapsibleFilterSection
                                        title="Age Band"
                                        count={filters.ageBand.length}
                                    >
                                        {filterOptions.ageBands.map((band) => (
                                            <FilterCheckbox
                                                key={band}
                                                label={band}
                                                checked={filters.ageBand.includes(band)}
                                                onChange={() => onFilterChange("ageBand", band)}
                                            />
                                        ))}
                                    </CollapsibleFilterSection>
                                )}

                                {filterOptions.footfallLevels && filterOptions.footfallLevels.length > 0 && (
                                    <CollapsibleFilterSection
                                        title="Footfall Level"
                                        count={filters.footfallLevel.length}
                                    >
                                        {filterOptions.footfallLevels.map((level) => (
                                            <FilterCheckbox
                                                key={level}
                                                label={level}
                                                checked={filters.footfallLevel.includes(level)}
                                                onChange={() => onFilterChange("footfallLevel", level)}
                                            />
                                        ))}
                                    </CollapsibleFilterSection>
                                )}

                                {filterOptions.campusTypes && filterOptions.campusTypes.length > 0 && (
                                    <CollapsibleFilterSection
                                        title="Campus Type"
                                        count={filters.campusType.length}
                                    >
                                        {filterOptions.campusTypes.map((type) => (
                                            <FilterCheckbox
                                                key={type}
                                                label={type}
                                                checked={filters.campusType.includes(type)}
                                                onChange={() => onFilterChange("campusType", type)}
                                            />
                                        ))}
                                    </CollapsibleFilterSection>
                                )}

                                {filterOptions.educationLevels && filterOptions.educationLevels.length > 0 && (
                                    <CollapsibleFilterSection
                                        title="Education Level"
                                        count={filters.educationLevel.length}
                                    >
                                        {filterOptions.educationLevels.map((level) => (
                                            <FilterCheckbox
                                                key={level}
                                                label={level}
                                                checked={filters.educationLevel.includes(level)}
                                                onChange={() => onFilterChange("educationLevel", level)}
                                            />
                                        ))}
                                    </CollapsibleFilterSection>
                                )}

                                {filterOptions.genderSkews && filterOptions.genderSkews.length > 0 && (
                                    <CollapsibleFilterSection
                                        title="Gender Skew"
                                        count={filters.genderSkew.length}
                                    >
                                        {filterOptions.genderSkews.map((skew) => (
                                            <FilterCheckbox
                                                key={skew}
                                                label={skew}
                                                checked={filters.genderSkew.includes(skew)}
                                                onChange={() => onFilterChange("genderSkew", skew)}
                                            />
                                        ))}
                                    </CollapsibleFilterSection>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-2">
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-2.5 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        {activeFilterCount > 0 && (
                            <button
                                onClick={onClearAll}
                                className="w-full px-4 py-2.5 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                            >
                                Clear All Filters
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ========== COLLAPSIBLE FILTER SECTION COMPONENT ========== */

function CollapsibleFilterSection({ title, children, count }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
                    {count > 0 && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            {count}
                        </span>
                    )}
                </div>
                <ChevronDown
                    size={16}
                    className={`text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>
            {isOpen && (
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 space-y-2.5">
                    {children}
                </div>
            )}
        </div>
    );
}

/* ========== FILTER CHECKBOX COMPONENT ========== */

function FilterCheckbox({ label, checked, onChange }) {
    return (
        <label className="flex items-center gap-3 cursor-pointer group">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {label}
            </span>
        </label>
    );
}

/* ========== LOCATION ROW COMPONENT ========== */

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
            {/* Location Name */}
            <td className="px-6 py-4 cursor-pointer" onClick={onView}>
                <div>
                    <p className="font-semibold text-gray-900">
                        {location.location_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {location.college_tags?.join(", ") || location.college?.tags?.join(", ") || "-"}
                    </p>
                </div>
            </td>

            {/* Type */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-gray-700">
                    <TypeIcon size={16} className="text-blue-600" />
                    <span className="text-sm">{location.location_type}</span>
                </div>
            </td>

            {/* City */}
            <td className="px-6 py-4">
                <div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <MapPin size={16} className="text-red-500" />
                        <span className="text-sm">{location.city}</span>
                    </div>
                    <span className="text-xs text-gray-500 pl-6">
                        {location.area}
                    </span>
                </div>
            </td>

            {/* Status */}
            <td className="px-6 py-4">
                <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${statusColors[location.status] || statusColors.Active}`}
                >
                    {location.status}
                </span>
            </td>

            {/* Daily Reach */}
            <td className="px-6 py-4">
                <span className="text-sm font-semibold text-gray-900">
                    {location.daily_reach || "N/A"}
                </span>
            </td>

            {/* Engagement Rate */}
            <td className="px-6 py-4">
                <span className="text-sm font-semibold text-gray-900">
                    %{location.engagement_rate || "N/A"}
                </span>
            </td>

            {/* Campaign A/U/C */}
            <td className="px-6 py-4">
                <span className="text-sm font-semibold text-gray-700">
                    <span className="text-green-500">{location.a || "0"}</span> |{" "}
                    <span className="text-yellow-500">{location.u || "0"}</span> |{" "}
                    <span className="text-purple-500">{location.c || "0"}</span>
                </span>
            </td>

            {/* Actions */}
            <td className="px-6 py-4 text-right">
                <div className="relative">
                    <button
                        onClick={onMenuToggle}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-150"
                    >
                        <MoreVertical size={18} className="text-gray-600" />
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

/* ========== CONFIRM DIALOG COMPONENT ========== */

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
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
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
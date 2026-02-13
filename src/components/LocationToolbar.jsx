// components/LocationToolbar.tsx
"use client";

import { Search, SlidersHorizontal, X, PlusCircle } from "lucide-react";

export default function LocationToolbar({
    search,
    setSearch,
    onOpenFilters,
    onClearFilters,
    onAdd,
    hasActiveFilters,
}) {
    return (
        <div className="flex items-center justify-between mb-6 gap-4">

            {/* Search */}
            <div className="relative w-full max-w-lg">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search by name, ID, city..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex items-center gap-3">

                {/* Filters */}
                <button
                    onClick={onOpenFilters}
                    className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                >
                    <SlidersHorizontal size={18} />
                    Filters
                </button>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-lg bg-red-50 hover:bg-red-100 transition"
                    >
                        <X size={18} />
                        Clear
                    </button>
                )}

                {/* Add Location */}
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    <PlusCircle size={18} />
                    Add Location
                </button>
            </div>
        </div>
    );
}

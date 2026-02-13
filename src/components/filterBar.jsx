// components/FilterBar.tsx
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function FilterBar({ filters, onApply, onClear }) {
    const searchFilter = filters.find((f) => f.type === "search");
    const selectFilters = filters.filter((f) => f.type === "select");
    const router = useRouter();

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
            <div className="space-y-4">
                {searchFilter && (
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            {searchFilter.label}
                        </label>
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-3 text-gray-400"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder={searchFilter.placeholder}
                                value={searchFilter.value}
                                onChange={(e) =>
                                    searchFilter.onChange(e.target.value)
                                }
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {selectFilters.map((filter) => (
                        <div key={filter.label}>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                {filter.label}
                            </label>
                            <select
                                value={filter.value}
                                onChange={(e) =>
                                    filter.onChange(e.target.value)
                                }
                                disabled={filter.loading}
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white disabled:bg-gray-50 disabled:text-gray-400"
                            >
                                <option value="">
                                    All {filter.label}
                                </option>
                                {filter.options?.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 pt-2 items-center justify-end">
                    <button
                        onClick={onApply}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all active:scale-95"
                    >
                        Apply Filters
                    </button>

                    <button
                        onClick={onClear}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                        <X size={18} />
                        Clear
                    </button>
                    <div>
                        <button
                            onClick={() => router.push("/location/add-location")}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <PlusCircle size={18} />
                            Add Location
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
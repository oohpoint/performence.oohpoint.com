"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
    targetingCitiesConfig,
    autoFlagRulesConfig,
} from "./form-config";

/* ===================== Cities Selection ===================== */

export function CitiesField() {
    const { control } = useFormContext();
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (!containerRef.current?.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // ESC to close
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, []);

    const filteredCities = useMemo(() => {
        return targetingCitiesConfig.cities.filter((city) =>
            city.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);

    return (
        <div className="space-y-4 pt-6 border-t">
            <h3 className="text-sm font-semibold text-gray-900">
                {targetingCitiesConfig.label}
            </h3>

            <Controller
                name="targetCities"
                control={control}
                defaultValue={[]}
                render={({ field }) => {
                    const selected = field.value || [];

                    const toggleCity = useCallback(
                        (city) => {
                            if (selected.includes(city)) {
                                field.onChange(selected.filter((c) => c !== city));
                            } else {
                                field.onChange([...selected, city]);
                            }
                        },
                        [selected, field]
                    );

                    const clearAll = () => field.onChange([]);

                    return (
                        <div ref={containerRef} className="relative">
                            {/* Input Box */}
                            <div
                                onClick={() => setOpen((p) => !p)}
                                className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-xl cursor-pointer flex flex-wrap gap-2 items-center bg-white hover:border-teal-400 transition"
                            >
                                {selected.length === 0 && (
                                    <span className="text-sm text-gray-400">
                                        Select target cities...
                                    </span>
                                )}

                                {selected.map((city) => (
                                    <span
                                        key={city}
                                        className="flex items-center gap-1 bg-teal-100 text-teal-700 px-2.5 py-1 rounded-full text-xs font-medium"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleCity(city);
                                        }}
                                    >
                                        {city}
                                        <span className="text-teal-600">✕</span>
                                    </span>
                                ))}

                                {selected.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            clearAll();
                                        }}
                                        className="ml-auto text-xs text-gray-400 hover:text-red-500"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            {/* Dropdown */}
                            {open && (
                                <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                                    {/* Search */}
                                    <div className="sticky top-0 bg-white p-3 border-b">
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Search cities..."
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    </div>

                                    {/* Options */}
                                    <div className="max-h-64 overflow-auto p-2 space-y-1">
                                        {filteredCities.map((city) => {
                                            const isChecked = selected.includes(city);
                                            return (
                                                <label
                                                    key={city}
                                                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition
                            ${isChecked ? "bg-teal-50 text-teal-700" : "hover:bg-gray-50"}
                          `}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => toggleCity(city)}
                                                            className="accent-teal-600"
                                                        />
                                                        {city}
                                                    </div>
                                                    {isChecked && (
                                                        <span className="text-teal-600 text-xs font-semibold">
                                                            Selected
                                                        </span>
                                                    )}
                                                </label>
                                            );
                                        })}

                                        {filteredCities.length === 0 && (
                                            <p className="text-xs text-gray-400 text-center py-4">
                                                No cities found
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                }}
            />
        </div>
    );
}

/* ===================== Auto Flag Rules ===================== */

export function AutoFlagRulesField() {
    const { control, formState } = useFormContext();
    const error = formState.errors?.[autoFlagRulesConfig.name];

    return (
        <div className="space-y-4 pt-6 border-t">
            <h3 className="text-sm font-semibold text-gray-900">
                {autoFlagRulesConfig.label}
            </h3>

            <Controller
                name={autoFlagRulesConfig.name}
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <div className="space-y-2">
                        <textarea
                            {...field}
                            placeholder={autoFlagRulesConfig.placeholder}
                            rows={6}
                            className={`w-full px-3 py-2 border rounded-xl text-sm resize-none font-mono focus:outline-none focus:ring-2
                ${error ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-teal-500"}
              `}
                        />

                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                                Example: completion &lt; 10s AND risk &gt; 70
                            </p>
                            {field.value && (
                                <span className="text-xs text-gray-400">
                                    {field.value.length} chars
                                </span>
                            )}
                        </div>

                        {error && (
                            <p className="text-xs text-red-500">
                                {typeof error.message === "string"
                                    ? error.message
                                    : "Invalid auto-flag rules"}
                            </p>
                        )}
                    </div>
                )}
            />
        </div>
    );
}
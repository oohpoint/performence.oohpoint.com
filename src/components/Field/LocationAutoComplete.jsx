// components/Field/LocationAutoComplete.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";
import {
    getCitySuggestions,
    getAreaSuggestions,
    getPincodeSuggestions,
} from "@/lib/location-data";


export function LocationAutoComplete({
    cityValue,
    areaValue,
    pincodeValue,
    onCityChange,
    onAreaChange,
    onPincodeChange,
    errors,
}) {
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [areaSuggestions, setAreaSuggestions] = useState([]);
    const [pincodeSuggestions, setPincodeSuggestions] = useState([]);

    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [showAreaDropdown, setShowAreaDropdown] = useState(false);
    const [showPincodeDropdown, setShowPincodeDropdown] = useState(false);

    const cityRef = useRef(null);
    const areaRef = useRef(null);
    const pincodeRef = useRef(null);

    // City autocomplete
    const handleCityInput = (value) => {
        onCityChange(value);
        if (value) {
            const suggestions = getCitySuggestions(value);
            setCitySuggestions(suggestions);
            setShowCityDropdown(true);
        } else {
            setCitySuggestions([]);
            setShowCityDropdown(false);
        }
        // Reset area and pincode when city changes
        onAreaChange("");
        onPincodeChange("");
    };

    // Area autocomplete
    const handleAreaInput = (value) => {
        onAreaChange(value);
        if (cityValue && value) {
            const suggestions = getAreaSuggestions(cityValue, value);
            setAreaSuggestions(suggestions);
            setShowAreaDropdown(true);
        } else {
            setAreaSuggestions([]);
            setShowAreaDropdown(false);
        }
        // Reset pincode when area changes
        onPincodeChange("");
    };

    // Pincode autocomplete
    const handlePincodeInput = (value) => {
        onPincodeChange(value);
        if (cityValue && areaValue && value) {
            const suggestions = getPincodeSuggestions(cityValue, areaValue, value);
            setPincodeSuggestions(suggestions);
            setShowPincodeDropdown(true);
        } else {
            setPincodeSuggestions([]);
            setShowPincodeDropdown(false);
        }
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cityRef.current && !cityRef.current.contains(event.target)) {
                setShowCityDropdown(false);
            }
            if (areaRef.current && !areaRef.current.contains(event.target)) {
                setShowAreaDropdown(false);
            }
            if (pincodeRef.current && !pincodeRef.current.contains(event.target)) {
                setShowPincodeDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* City */}
            <div ref={cityRef} className="relative">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                    City <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <MapPin
                        size={18}
                        className="absolute left-3 top-3.5 text-gray-400 pointer-events-none"
                    />
                    <input
                        type="text"
                        value={cityValue}
                        onChange={(e) => handleCityInput(e.target.value)}
                        onFocus={() => cityValue && setShowCityDropdown(true)}
                        placeholder="e.g., Mumbai"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none transition ${errors?.city
                                ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-300"
                                : "border-gray-300 bg-white focus:ring-2 focus:ring-blue-300"
                            }`}
                    />
                </div>

                {/* City Dropdown */}
                {showCityDropdown && citySuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {citySuggestions.map((city) => (
                            <button
                                key={city}
                                type="button"
                                onClick={() => {
                                    onCityChange(city);
                                    setCitySuggestions([]);
                                    setShowCityDropdown(false);
                                    onAreaChange("");
                                    onPincodeChange("");
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition text-sm text-gray-700"
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                )}

                {errors?.city && (
                    <p className="text-xs text-red-600 mt-1">
                        {errors.city.message}
                    </p>
                )}
            </div>

            {/* Area */}
            <div ref={areaRef} className="relative">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Area <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <MapPin
                        size={18}
                        className="absolute left-3 top-3.5 text-gray-400 pointer-events-none"
                    />
                    <input
                        type="text"
                        value={areaValue}
                        onChange={(e) => handleAreaInput(e.target.value)}
                        onFocus={() => areaValue && cityValue && setShowAreaDropdown(true)}
                        placeholder={cityValue ? "e.g., Powai" : "Select city first"}
                        disabled={!cityValue}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none transition ${errors?.area
                                ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-300"
                                : "border-gray-300 bg-white focus:ring-2 focus:ring-blue-300"
                            } ${!cityValue ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    />
                </div>

                {/* Area Dropdown */}
                {showAreaDropdown && areaSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {areaSuggestions.map((area) => (
                            <button
                                key={area}
                                type="button"
                                onClick={() => {
                                    onAreaChange(area);
                                    setAreaSuggestions([]);
                                    setShowAreaDropdown(false);
                                    onPincodeChange("");
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition text-sm text-gray-700"
                            >
                                {area}
                            </button>
                        ))}
                    </div>
                )}

                {errors?.area && (
                    <p className="text-xs text-red-600 mt-1">
                        {errors.area.message}
                    </p>
                )}
            </div>

            {/* Pincode */}
            <div ref={pincodeRef} className="relative">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Pincode
                </label>
                <div className="relative">
                    <MapPin
                        size={18}
                        className="absolute left-3 top-3.5 text-gray-400 pointer-events-none"
                    />
                    <input
                        type="text"
                        value={pincodeValue}
                        onChange={(e) => handlePincodeInput(e.target.value)}
                        onFocus={() =>
                            pincodeValue && cityValue && areaValue && setShowPincodeDropdown(true)
                        }
                        placeholder={
                            cityValue && areaValue ? "e.g., 400076" : "Select area first"
                        }
                        disabled={!cityValue || !areaValue}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none transition ${errors?.pincode
                                ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-300"
                                : "border-gray-300 bg-white focus:ring-2 focus:ring-blue-300"
                            } ${!cityValue || !areaValue ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    />
                </div>

                {/* Pincode Dropdown */}
                {showPincodeDropdown && pincodeSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {pincodeSuggestions.map((pincode) => (
                            <button
                                key={pincode}
                                type="button"
                                onClick={() => {
                                    onPincodeChange(pincode);
                                    setPincodeSuggestions([]);
                                    setShowPincodeDropdown(false);
                                }}
                                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition text-sm text-gray-700"
                            >
                                {pincode}
                            </button>
                        ))}
                    </div>
                )}

                {errors?.pincode && (
                    <p className="text-xs text-red-600 mt-1">
                        {errors.pincode.message}
                    </p>
                )}
            </div>
        </div>
    );
}
"use client";
import React from "react";
import { MapPin } from "lucide-react";

export default function LocationHeatmap({ data = [] }) {
    const maxValue = Math.max(...data.map((d) => d.value || 0), 1);

    return (
        <div className="w-full bg-white border border-slate-200 rounded-xl p-5 mt-6">
            {/* Title */}
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
                Location Heatmap — Interaction Wise
            </h3>

            {/* Bars */}
            <div className="space-y-4">
                {data.map((item) => {
                    const percent = (item.value / maxValue) * 100;

                    return (
                        <div key={item.location} className="flex items-center gap-4">
                            {/* Location Label */}
                            <div className="w-40 flex items-center gap-2 text-slate-700 font-medium">
                                <MapPin size={16} className="text-slate-400" />
                                {item.location}
                            </div>

                            {/* Progress Bar */}
                            <div className="flex-1 relative">
                                <div className="w-full h-6 bg-slate-100 rounded-md overflow-hidden">
                                    <div
                                        className="h-full rounded-md bg-gradient-to-r from-slate-300 to-blue-600 transition-all duration-700"
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                            </div>

                            {/* Value */}
                            <div className="w-16 text-right text-sm font-semibold text-slate-900">
                                {item.value.toLocaleString()}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 mt-5 text-xs text-slate-500">
                <div className="w-16 h-3 rounded-md bg-gradient-to-r from-slate-300 to-blue-600" />
                <span>Low → High interaction density</span>
            </div>
        </div>
    );
}

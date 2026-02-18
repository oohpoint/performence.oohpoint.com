"use client";
import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

const COLORS = {
    Android: "#3366CC",
    iOS: "#2CA8DF",
    Desktop: "#F59E0B",
    Tablet: "#CBD5E1",
};

export default function DeviceDistributionChart({ data = [] }) {
    return (
        <div className="w-full bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800">
                Demography Breakdown
            </h3>
            <div className="flex items-center mt-10">
                {/* Left: Chart */}
                <div className="w-[260px] h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={3}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[entry.name] || "#94A3B8"}
                                    />
                                ))}
                            </Pie>
                            <Tooltip formatter={(val) => `${val}%`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Right: Legend List */}
                <div className="flex-1 ml-10 space-y-4">
                    {data.map((item) => (
                        <div
                            key={item.name}
                            className="flex items-center justify-between text-sm"
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className="w-4 h-4 rounded-sm border"
                                    style={{ borderColor: COLORS[item.name] }}
                                />
                                <span className="text-slate-700 font-medium">
                                    {item.name}
                                </span>
                            </div>
                            <span className="font-semibold text-slate-900">
                                {item.value}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

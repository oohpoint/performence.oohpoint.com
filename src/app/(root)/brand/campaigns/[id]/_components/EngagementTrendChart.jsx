"use client";
import React, { useMemo, useState } from "react";
import {
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    label: `${i}:00`,
    value: 100 + Math.sin(i / 2) * 40 + i * 5,
}));

const dailyData = Array.from({ length: 14 }, (_, i) => ({
    label: `Day ${i + 1}`,
    value: 400 + Math.sin(i / 1.3) * 120 + (i % 3) * 40,
}));

const monthlyData = [
    { label: "Jan", value: 3200 },
    { label: "Feb", value: 4100 },
    { label: "Mar", value: 3800 },
    { label: "Apr", value: 5200 },
    { label: "May", value: 6100 },
    { label: "Jun", value: 5900 },
    { label: "Jul", value: 7200 },
    { label: "Aug", value: 6800 },
    { label: "Sep", value: 6400 },
    { label: "Oct", value: 7100 },
    { label: "Nov", value: 7600 },
    { label: "Dec", value: 8200 },
];

const lifetimeData = [
    { label: "2021", value: 24000 },
    { label: "2022", value: 42000 },
    { label: "2023", value: 61000 },
    { label: "2024", value: 87000 },
    { label: "2025", value: 112000 },
];

const filters = ["Hourly", "Daily", "Monthly", "Lifetime"];

export default function EngagementTrendChart() {
    const [filter, setFilter] = useState("Lifetime");

    const data = useMemo(() => {
        switch (filter) {
            case "Hourly":
                return hourlyData;
            case "Monthly":
                return monthlyData;
            case "Lifetime":
                return lifetimeData;
            default:
                return dailyData;
        }
    }, [filter]);

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mt-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h2 className="text-sm font-semibold text-slate-700">
                    Engagement Trend
                </h2>

                {/* Filter Tabs */}
                <div className="flex bg-slate-100 rounded-lg p-1 w-fit">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${filter === f
                                ? "bg-white shadow text-slate-900"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="engagementFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
                                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>

                        <XAxis
                            dataKey="label"
                            tick={{ fontSize: 11, fill: "#64748b" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: "#64748b" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                fontSize: "12px",
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#2563eb"
                            strokeWidth={2}
                            fill="url(#engagementFill)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

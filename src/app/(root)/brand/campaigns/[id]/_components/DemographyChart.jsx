"use client";
import React, { useMemo, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const COLORS = ["#3366CC", "#2CA8DF"]; // Male, Female

export default function DemographyPieChart({ data = [] }) {
    const [selectedAge, setSelectedAge] = useState(data?.[0]?.ageGroup);

    const chartData = useMemo(() => {
        const group = data.find((d) => d.ageGroup === selectedAge);
        if (!group) return [];

        return [
            { name: "Male", value: group.male },
            { name: "Female", value: group.female },
        ];
    }, [data, selectedAge]);

    return (
        <div className="w-full bg-white rounded-xl border border-slate-200 p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-800">
                    Demography Breakdown
                </h3>

                {/* Age Filter */}
                <select
                    value={selectedAge}
                    onChange={(e) => setSelectedAge(e.target.value)}
                    className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white"
                >
                    {data.map((d) => (
                        <option key={d.ageGroup} value={d.ageGroup}>
                            {d.ageGroup}
                        </option>
                    ))}
                </select>
            </div>

            {/* Pie Chart */}
            <div className="w-full h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={index} fill={COLORS[index]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

"use client";

import React, { useMemo } from "react";

const colors = [
    "bg-blue-600",
    "bg-sky-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-violet-500",
];

const EngagementFunnel = ({ data = [] }) => {
    // Example data:
    // [
    //   { label: "Discovered", value: 18525 },
    //   { label: "Watched", value: 12227 },
    //   { label: "Interacted", value: 8070 },
    //   { label: "Redeemed", value: 9750 }
    // ]

    const maxValue = data[0]?.value || 1;

    const computed = useMemo(() => {
        return data.map((step, i) => {
            const percent = Math.round((step.value / maxValue) * 100);
            return {
                ...step,
                percent,
                width: `${percent}%`,
                color: colors[i % colors.length],
            };
        });
    }, [data, maxValue]);

    const dropInsight = useMemo(() => {
        if (computed.length < 2) return null;

        let biggestDrop = 0;
        let from = "";
        let to = "";

        for (let i = 0; i < computed.length - 1; i++) {
            const drop =
                100 -
                Math.round(
                    (computed[i + 1].value / computed[i].value) * 100
                );

            if (drop > biggestDrop) {
                biggestDrop = drop;
                from = computed[i].label;
                to = computed[i + 1].label;
            }
        }

        return { biggestDrop, from, to };
    }, [computed]);

    return (
        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">
                Human Engagement Funnel — Live Flow
            </h3>

            <div className="space-y-5">
                {computed.map((step, i) => (
                    <div key={step.label}>
                        {/* Label Row */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`w-3 h-3 rounded-full ${step.color}`}
                                />
                                <span className="text-sm text-slate-700 font-medium">
                                    {step.label}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-slate-900">
                                    {step.value.toLocaleString()}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full border bg-white text-slate-600">
                                    {step.percent}%
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full ${step.color}`}
                                style={{ width: step.width }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Drop-off Insight */}
            {dropInsight && (
                <div className="mt-5 border border-slate-200 bg-white rounded-lg p-3 text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">
                        Drop-off Analysis:
                    </span>{" "}
                    Biggest drop is {dropInsight.from} → {dropInsight.to} (
                    {dropInsight.biggestDrop}% drop). Consider improving
                    mid-funnel engagement.
                </div>
            )}
        </div>
    );
};

export default EngagementFunnel;

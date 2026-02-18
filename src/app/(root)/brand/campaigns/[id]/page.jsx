"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BookOpenCheck, Dot, Icon, icons, LayoutDashboard, Rocket, Server } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import EngagementFunnel from "./_components/page";
import EngagementTrendChart from "./_components/EngagementTrendChart";
import DemographyChart from "./_components/DemographyChart";
import DeviceDistributionChart from "./_components/DeviceDistributionChart";
import LocationHeatmap from "./_components/LocationHeatmap";
import SurveyDashboard, { Survey } from "./_components/Survey";
import InteractiveQuiz from "./_components/InteractiveQuiz";

const Page = () => {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    const tabs = [
        { key: "overview", label: "Overview", Icon: LayoutDashboard, },
        { key: "servay", label: "User Insights", Icon: Server },
        { key: "quiz", label: "Leads", Icon: BookOpenCheck },

    ];
    const demoData = [
        { ageGroup: "18–24", male: 2600, female: 2200 },
        { ageGroup: "25–34", male: 1400, female: 1750 },
        { ageGroup: "35–44", male: 650, female: 520 },
        { ageGroup: "45+", male: 300, female: 280 },
    ];
    const deviceData = [
        { name: "Android", value: 58 },
        { name: "iOS", value: 34 },
        { name: "Desktop", value: 6 },
        { name: "Tablet", value: 2 },
    ];
    const locationData = [
        { location: "Mumbai", value: 3413 },
        { location: "Bangalore", value: 2145 },
        { location: "Delhi", value: 1755 },
        { location: "Pune", value: 1170 },
        { location: "Hyderabad", value: 780 },
        { location: "Gurugram", value: 488 },
    ];


    const fetchCampaign = async () => {
        try {
            const res = await fetch(`/api/campaigns/${id}`);
            const data = await res.json();
            setCampaign(data?.data || data);
        } catch (error) {
            console.error("Failed to fetch campaign:", error);
        }
    };

    useEffect(() => {
        if (id) fetchCampaign();
    }, [id]);

    return (
        <div className="w-full bg-slate-100/70 min-h-screen  px-6 py-6">
            <header className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-md bg-slate-200 flex items-center justify-center">
                    <Rocket className="text-slate-600" size={22} />
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl  font-semibold text-slate-900">
                            {campaign?.name || "Campaign Name"}
                        </h2>

                        <span
                            className={`text-xs px-2.5 py-0.5 rounded-[5px] font-semibold border capitalize
                                ${campaign?.status === "active"
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : campaign?.status === "paused"
                                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                        : campaign?.status === "completed"
                                            ? "bg-blue-100 text-blue-700 border-blue-200"
                                            : "bg-slate-100 text-slate-600 border-slate-200"
                                }`}
                        >
                            {campaign?.status || "draft"}
                        </span>
                    </div>

                    <p className="text-sm text-slate-500 mt-0.5">
                        {campaign?.objective || "Objective"} {<Dot className="inline" size={20} />} {" "}
                        {campaign?.startDate || "—"} → {campaign?.endDate || "—"}
                    </p>
                </div>
            </header>
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mt-6">
                <ProfileCard label="Total Engagements" value={"0"} />
                <ProfileCard label="Unique Users" value={"0"} />
                <ProfileCard label="Total Spend" value={"₹0"} />
                <ProfileCard label="Completion Rate" value={"0%"} />
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 px-2 pt-5 ">
                {/* TAB NAVIGATION */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-1  overflow-x-auto no-scrollbar scroll-smooth">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 mx-3 py-2 text-[12px] font-bold transition-all border-b-2 whitespace-nowrap uppercase ${activeTab === tab.key
                                    ? "border-black text-black  rounded-t-lg"
                                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-lg"
                                    }`}
                            >
                                {tab.Icon && <tab.Icon size={18} />}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6">
                {activeTab === "overview" && <div>
                    <EngagementFunnel data={[
                        { label: "Discovered", value: 18525 },
                        { label: "Watched", value: 12227 },
                        { label: "Interacted", value: 8070 },
                        { label: "Redeemed", value: 9750 },
                    ]} />
                    <div className=" grid grid-cols-2 gap-6">
                        <EngagementTrendChart />
                        <LocationHeatmap data={locationData} />
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-6">
                        <DemographyChart data={demoData} />
                        <DeviceDistributionChart data={deviceData} />
                    </div>


                </div>}
                {activeTab === "servay" && <div>
                    <SurveyDashboard />
                </div>}
                {activeTab === "quiz" && <div>
                    <InteractiveQuiz />
                </div>}
            </div>
        </div>
    );
};

export default Page;

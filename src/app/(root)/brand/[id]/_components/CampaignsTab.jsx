import ProfileCard from '@/components/ProfileCard'
import { MoreVertical, Pause, Pen, Pencil, Play, PlusCircle, Rocket, Trash, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React from 'react'

const CampaignsTab = ({ brand, refreshBrand }) => {
    const router = useRouter();

    // Convert campaigns map → array
    const campaigns = brand?.campaigns
        ? Object.entries(brand.campaigns).map(([campaignId, data]) => ({
            campaignId,
            ...data,
        }))
        : [];

    const updateCampaign = async (campaignId, data) => {
        await fetch(`/api/brands/${brand.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ campaignId, data }),
        });
        await refreshBrand();
    };



    const totalBudget = campaigns.reduce((s, c) => s + (Number(c.budget) || 0), 0);
    const totalSpent = campaigns.reduce((s, c) => s + (Number(c.rewardEngine?.expectedValue) || 0), 0);
    const activeCampaigns = campaigns.filter((c) => c.status === "active").length;

    return (
        <div>
            <div className="">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-4 w-full">
                    <ProfileCard label="Total Campaigns" value={campaigns.length} />
                    <ProfileCard label="Active Campaigns" value={activeCampaigns} />
                    <ProfileCard label="Total Budget" value={`₹${(totalBudget / 1000).toFixed(1)}K`} />
                    <ProfileCard label="Total Spent" value={`₹${totalSpent.toFixed(2)}`} />
                </div>
            </div>

            <div className="min-h-screen mt-4">
                {campaigns.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-300 rounded-xl text-slate-400">
                        <p className="text-sm font-medium">No campaigns yet</p>
                        <p className="text-xs mt-1">Click "Add Campaign" to create your first one</p>
                    </div>
                ) : (
                    <div className="border border-slate-400/30 rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-white border-b border-slate-300 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 text-left">Campaign</th>
                                    <th className="p-4 text-left">Objective</th>
                                    <th className="p-4 text-left">Type</th>
                                    <th className="p-4 text-left">Budget</th>
                                    <th className="p-4 text-left">CPVE</th>
                                    <th className="p-4 text-left">Period</th>
                                    <th className="p-4 text-left">Locations</th>
                                    <th className="p-4 text-left">Status</th>
                                    <th className="p-4 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white text-sm">
                                {campaigns.map((c) => (
                                    <tr key={c.campaignId} className="hover:bg-slate-50 transition">
                                        <td onClick={() => router.push(`/brand/campaigns/${c.campaignId}`)}
                                            className="p-4 cursor-pointer hover:bg-slate-50" >
                                            <div className="font-semibold text-slate-900">
                                                {c.name || "—"}
                                            </div>
                                            <div className="text-xs text-slate-400 font-mono">
                                                {c.campaignId?.substring(0, 8)}...
                                            </div>
                                        </td>

                                        <td className="p-4 text-slate-700">{c.objective || "—"}</td>
                                        <td className="p-4 text-slate-700 capitalize">
                                            {c.media?.campaignType || "Standard"}
                                        </td>
                                        <td className="p-4 font-medium font-mono">
                                            ₹{Number(c.budget || 0).toLocaleString()}
                                        </td>
                                        <td className="p-4 font-mono">₹{c.cpve || 0}</td>
                                        <td className="p-4 text-xs text-slate-600">
                                            <div>{c.startDate || "—"}</div>
                                            <div className="text-slate-400">→ {c.endDate || "—"}</div>
                                        </td>
                                        <td className="p-4 text-blue-500 font-bold">
                                            {c.locationIds?.length || 0}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`text-xs px-3 py-1 rounded-[5px] border font-medium capitalize ${c.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : c.status === "draft"
                                                        ? "bg-slate-100 text-slate-600"
                                                        : c.status === "paused"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : c.status === "completed"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : "bg-rose-100 text-rose-600"
                                                    }`}
                                            >
                                                {c.status || "draft"}
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {/* Draft → Publish */}
                                                {c.status === "draft" && (
                                                    <button
                                                        onClick={() => updateCampaign(c.campaignId, { status: "active" })}
                                                        title="Publish campaign"
                                                        className="p-1.5 flex items-center gap-1.5 font-semibold text-xs rounded-[5px] border border-green-200  text-green-700 hover:bg-green-100 transition-colors cursor-pointer"
                                                    >
                                                        Publish
                                                        <Rocket size={14} />
                                                    </button>
                                                )}

                                                {/* Active → Pause */}
                                                {c.status === "active" && (
                                                    <button
                                                        onClick={() => updateCampaign(c.campaignId, { status: "paused" })}
                                                        title="Pause campaign"
                                                        className="p-1.5 rounded-[5px] border border-yellow-200 text-yellow-700 hover:bg-yellow-100 transition-colors cursor-pointer"
                                                    >
                                                        <Pause size={14} />
                                                    </button>
                                                )}

                                                {/* Paused → Resume */}
                                                {c.status === "paused" && (
                                                    <button
                                                        onClick={() => updateCampaign(c.campaignId, { status: "active" })}
                                                        title="Resume campaign"
                                                        className="p-1.5 rounded-[5px] border border-green-200 text-green-700 hover:bg-green-100 transition-colors cursor-pointer"
                                                    >
                                                        <Play size={14} />
                                                    </button>
                                                )}

                                                {/* Edit (available except deleted) */}
                                                {c.status == "draft" && (
                                                    <button
                                                        title="Edit campaign"
                                                        className="p-1.5 rounded-[5px] border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                )}

                                                {/* Soft Delete */}
                                                <button
                                                    onClick={() => updateCampaign(c.campaignId, { status: "deleted" })}
                                                    title="Delete campaign"
                                                    className="p-1.5 rounded-[5px] border border-rose-200 text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-colors cursor-pointer"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>


                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div >
    )
}

export default CampaignsTab
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Zap,
    CheckCircle2,
    PauseCircle,
    ShieldAlert,
    DollarSign,
    TrendingUp,
    AlertTriangle,
    MoreHorizontal,
    Eye,
    Pause,
    Copy,
    XCircle,
} from 'lucide-react';


// ============================================================================
// MOCK DATA
// ============================================================================

const TASK_TYPE_LABELS = {
    video_quiz: 'Video + Quiz',
    survey: 'Survey',
    watch_only: 'Watch Only',
    hybrid: 'Hybrid',
};

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'];

const DASHBOARD_STATS = {
    activeTasks: 24,
    pausedTasks: 8,
    highRiskTasks: 3,
    dailyPPE: 45680,
    dailyRewardsPaid: 38920,
    avgCompletionRate: 78,
    riskAlertsToday: 5,
};

const MOCK_TASKS = [
    {
        id: 'TASK-001',
        name: 'YouTube Ad Engagement Campaign',
        type: 'video_quiz',
        targetSegment: '18-25, Mobile',
        rewardValue: 50,
        budgetUsed: 25000,
        totalBudget: 50000,
        completionRate: 85,
        riskStatus: 'low',
        status: 'active',
        city: 'Mumbai',
    },
    {
        id: 'TASK-002',
        name: 'Product Survey - Electronics',
        type: 'survey',
        targetSegment: '25-35, Web',
        rewardValue: 75,
        budgetUsed: 18500,
        totalBudget: 40000,
        completionRate: 62,
        riskStatus: 'medium',
        status: 'active',
        city: 'Bangalore',
    },
    {
        id: 'TASK-003',
        name: 'Netflix Content Watch',
        type: 'watch_only',
        targetSegment: 'All, Mobile',
        rewardValue: 30,
        budgetUsed: 42000,
        totalBudget: 60000,
        completionRate: 91,
        riskStatus: 'low',
        status: 'active',
        city: 'Delhi',
    },
    {
        id: 'TASK-004',
        name: 'Mobile App Beta Testing',
        type: 'hybrid',
        targetSegment: '20-30, Tech Savvy',
        rewardValue: 120,
        budgetUsed: 12000,
        totalBudget: 30000,
        completionRate: 45,
        riskStatus: 'high',
        status: 'paused',
        city: 'Hyderabad',
    },
    {
        id: 'TASK-005',
        name: 'Travel Insurance Awareness',
        type: 'video_quiz',
        targetSegment: '35-50, Desktop',
        rewardValue: 65,
        budgetUsed: 22000,
        totalBudget: 45000,
        completionRate: 73,
        riskStatus: 'medium',
        status: 'active',
        city: 'Chennai',
    },
    {
        id: 'TASK-006',
        name: 'E-commerce Review Campaign',
        type: 'survey',
        targetSegment: '25-40, All',
        rewardValue: 55,
        budgetUsed: 35000,
        totalBudget: 50000,
        completionRate: 88,
        riskStatus: 'low',
        status: 'active',
        city: 'Pune',
    },
    {
        id: 'TASK-007',
        name: 'Gaming Platform Engagement',
        type: 'hybrid',
        targetSegment: '18-30, Mobile',
        rewardValue: 100,
        budgetUsed: 8000,
        totalBudget: 25000,
        completionRate: 56,
        riskStatus: 'high',
        status: 'terminated',
        city: 'Mumbai',
    },
    {
        id: 'TASK-008',
        name: 'Fintech App User Testing',
        type: 'watch_only',
        targetSegment: '25-45, Web',
        rewardValue: 85,
        budgetUsed: 18000,
        totalBudget: 35000,
        completionRate: 79,
        riskStatus: 'low',
        status: 'active',
        city: 'Kolkata',
    },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

// ============================================================================
// COMPONENTS
// ============================================================================


function RiskBadge({ level }) {
    const bgColorMap = {
        low: 'bg-green-100 text-green-700',
        medium: 'bg-yellow-100 text-yellow-700',
        high: 'bg-red-100 text-red-700',
    };

    const dotColorMap = {
        low: 'bg-green-500',
        medium: 'bg-yellow-500',
        high: 'bg-red-500',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium',
                bgColorMap[level]
            )}
        >
            <span className={cn('h-1.5 w-1.5 rounded-full', dotColorMap[level])} />
            {level.charAt(0).toUpperCase() + level.slice(1)}
        </span>
    );
}


function StatusBadge({ status }) {
    const bgColorMap = {
        active: 'bg-blue-100 text-blue-700',
        paused: 'bg-gray-100 text-gray-700',
        terminated: 'bg-slate-100 text-slate-700',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                bgColorMap[status]
            )}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}


function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    variant = 'default',
}) {
    const bgColorMap = {
        default: 'bg-blue-50',
        warning: 'bg-yellow-50',
        danger: 'bg-red-50',
    };

    const iconColorMap = {
        default: 'text-blue-600',
        warning: 'text-yellow-600',
        danger: 'text-red-600',
    };

    const trendColorMap = {
        positive: 'text-green-600',
        negative: 'text-red-600',
    };

    return (
        <div className={cn('p-4 rounded-lg border border-gray-200 shadow-sm', bgColorMap[variant])}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-widest">
                        {title}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <p
                            className={cn(
                                'mt-1 text-xs font-semibold',
                                trend.positive ? trendColorMap.positive : trendColorMap.negative
                            )}
                        >
                            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% vs yesterday
                        </p>
                    )}
                </div>
                <div className={cn('text-xl', iconColorMap[variant])}>{Icon}</div>
            </div>
        </div>
    );
}


function FilterBar({ filters, onChange }) {
    const handleFilterChange = (key) => {
        onChange({ ...filters, [key]: value });
    };

    return (
        <div className="flex flex-wrap items-center gap-4 px-4 py-2.5 bg-white rounded-t-lg border border-gray-200">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
                Filters
            </span>

            <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="all">All Cities</option>
                {CITIES.map((city) => (
                    <option key={city} value={city}>
                        {city}
                    </option>
                ))}
            </select>

            <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="all">All Types</option>
                {Object.entries(TASK_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                        {label}
                    </option>
                ))}
            </select>

            <select
                value={filters.risk}
                onChange={(e) => handleFilterChange('risk', e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="all">All Risk</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>

            <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="terminated">Terminated</option>
            </select>
        </div>
    );
}


function TaskTable({ tasks }) {
    const [openMenu, setOpenMenu] = useState(null);

    const handleMenuClick = (taskId, e) => {
        e.stopPropagation();
        setOpenMenu(openMenu === taskId ? null : taskId);
    };

    return (
        <div className="rounded-b-lg border border-gray-200 overflow-hidden bg-white">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left whitespace-nowrap font-semibold text-gray-700 uppercase text-xs tracking-wider">
                                Task ID
                            </th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wider">
                                Task Name
                            </th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wider">
                                Segment
                            </th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wider">
                                Reward
                            </th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wider">
                                Budget
                            </th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wider">
                                Completion
                            </th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wider">
                                Risk
                            </th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-center font-semibold text-gray-700 uppercase text-xs tracking-wider w-12">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {tasks.map((task) => (
                            <tr
                                key={task.id}
                                className="hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <td className="px-6 py-4 font-mono text-xs whitespace-nowrap text-gray-500">{task.id}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{task.name}</td>
                                <td className="px-6 py-4 text-gray-600">
                                    {TASK_TYPE_LABELS[task.type]}
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-600">{task.targetSegment}</td>
                                <td className="px-6 py-4 font-semibold text-gray-900">
                                    ₹{task.rewardValue}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="text-xs text-gray-600">
                                            ₹{task.budgetUsed.toLocaleString()} / ₹
                                            {task.totalBudget.toLocaleString()}
                                        </div>
                                        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full transition-all"
                                                style={{
                                                    width: `${(task.budgetUsed / task.totalBudget) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {task.completionRate}%
                                </td>
                                <td className="px-6 py-4">
                                    <RiskBadge level={task.riskStatus} />
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={task.status} />
                                </td>
                                <td
                                    className="px-6 py-4 relative"
                                    onClick={(e) => handleMenuClick(task.id, e)}
                                >
                                    <button className="p-1 hover:bg-gray-200 rounded-md transition-colors">
                                        <MoreHorizontal className="h-4 w-4 text-gray-600" />
                                    </button>

                                    {openMenu === task.id && (
                                        <div className="absolute right-6 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-max">
                                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 border-b border-gray-100">
                                                <Eye className="h-4 w-4" /> View
                                            </button>
                                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 border-b border-gray-100">
                                                <Pause className="h-4 w-4" /> Pause
                                            </button>
                                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 border-b border-gray-100">
                                                <Copy className="h-4 w-4" /> Clone
                                            </button>
                                            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                <XCircle className="h-4 w-4" /> Terminate
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ============================================================================
// MAIN DASHBOARD PAGE
// ============================================================================

export default function Dashboard() {
    const [filters, setFilters] = useState({
        city: 'all',
        type: 'all',
        risk: 'all',
        status: 'all',
    });

    const filteredTasks = MOCK_TASKS.filter((task) => {
        if (filters.city !== 'all' && task.city !== filters.city) return false;
        if (filters.type !== 'all' && task.type !== filters.type) return false;
        if (filters.risk !== 'all' && task.riskStatus !== filters.risk) return false;
        if (filters.status !== 'all' && task.status !== filters.status) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Task Dashboard</h1>
                        <p className="text-gray-600 mt-1">
                            Manage and monitor daily platform engagement tasks
                        </p>
                    </div>
                    <Link
                        href="/users/tasks/new"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Zap className="h-4 w-4" /> Create Task
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard
                        title="Active Tasks"
                        value={DASHBOARD_STATS.activeTasks}
                        icon={<CheckCircle2 className="h-5 w-5" />}
                        trend={{ value: 12, positive: true }}
                    />
                    <StatCard
                        title="Paused"
                        value={DASHBOARD_STATS.pausedTasks}
                        icon={<PauseCircle className="h-5 w-5" />}
                        variant="warning"
                    />
                    <StatCard
                        title="Daily PPE"
                        value={`₹${DASHBOARD_STATS.dailyPPE.toLocaleString()}`}
                        icon={<TrendingUp className="h-5 w-5" />}
                        trend={{ value: 8, positive: true }}
                    />
                    <StatCard
                        title="Rewards Paid"
                        value={`₹${DASHBOARD_STATS.dailyRewardsPaid.toLocaleString()}`}
                        icon={<DollarSign className="h-5 w-5" />}
                    />
                    <StatCard
                        title="Avg Completion"
                        value={`${DASHBOARD_STATS.avgCompletionRate}%`}
                        icon={<CheckCircle2 className="h-5 w-5" />}
                        trend={{ value: 3.2, positive: true }}
                    />
                </div>

                <div>
                    {/* Filters */}
                    <FilterBar filters={filters} onChange={setFilters} />

                    {/* Task Table */}
                    <TaskTable tasks={filteredTasks} />
                </div>

                {/* Footer Info */}
                <div className="text-center text-sm text-gray-600">
                    Showing {filteredTasks.length} of {MOCK_TASKS.length} tasks
                </div>
            </div>
        </div>
    );
}

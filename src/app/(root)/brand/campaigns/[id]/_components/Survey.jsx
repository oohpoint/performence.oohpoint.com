import React from 'react';

const SurveyDashboard = () => {
    // Mock data - in a real app, this would come from an API or props
    const recommendationData = {
        question: "Would you recommend this experience to a friend?",
        totalResponses: 6923,
        type: "Single",
        options: [
            { label: "Definitely yes", count: 3413, percentage: 49, color: "bg-blue-600" },
            { label: "Probably yes", count: 2145, percentage: 31, color: "bg-sky-400" },
            { label: "Not sure", count: 975, percentage: 14, color: "bg-orange-400" },
            { label: "No", count: 390, percentage: 6, color: "bg-slate-500" },
        ]
    };

    const adExperienceData = {
        question: "Rate the ad experience (1-5 stars)",
        totalResponses: 7410,
        averageRating: 4.1,
        type: "Rating",
        options: [
            { label: "5 Stars", count: 3120, percentage: 42, color: "bg-blue-600" },
            { label: "4 Stars", count: 2438, percentage: 33, color: "bg-sky-400" },
            { label: "3 Stars", count: 1170, percentage: 16, color: "bg-orange-400" },
            { label: "2 Stars", count: 488, percentage: 7, color: "bg-slate-500" },
            { label: "1 Star", count: 195, percentage: 2, color: "bg-slate-400" },
        ]
    };

    const Card = ({ data }) => (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 font-sans">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-blue-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </span>
                    <h3 className="text-gray-800 font-medium">{data.question}</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-300">
                        {data.type}
                    </span>
                    <span className="text-gray-500 text-sm">{data.totalResponses.toLocaleString()} responses</span>
                </div>
            </div>

            {/* Average Rating Section (Conditional) */}
            {data.averageRating && (
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-orange-400 font-medium">
                        <span>★</span>
                        <span>Average Rating</span>
                    </div>
                    <div className="text-2xl font-bold">
                        {data.averageRating} <span className="text-gray-400 text-lg font-normal">/ 5</span>
                    </div>
                </div>
            )}

            {/* Rows */}
            <div className="space-y-4">
                {data.options.map((option, idx) => (
                    <div key={idx} className="relative">
                        <div className="flex justify-between text-sm mb-1 text-gray-700">
                            <span>{option.label}</span>
                            <div className="flex gap-4">
                                <span className="text-gray-400">{option.count.toLocaleString()}</span>
                                <span className="font-bold w-8 text-right">{option.percentage}%</span>
                            </div>
                        </div>
                        {/* Progress Bar Background */}
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            {/* Active Bar */}
                            <div
                                className={`h-full ${option.color} transition-all duration-500`}
                                style={{ width: `${option.percentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className=" min-h-screen">
            <Card data={recommendationData} />
            <Card data={adExperienceData} />
        </div>
    );
};

export default SurveyDashboard;
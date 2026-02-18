import React from 'react';

const InteractiveQuiz = ({
    question = "Would you recommend this experience to a friend?",
    yesCount = 5558,
    noCount = 390
}) => {
    const total = yesCount + noCount;
    const yesPercent = total > 0 ? ((yesCount / total) * 100).toFixed(1) : 0;
    const noPercent = total > 0 ? (100 - yesPercent).toFixed(1) : 0;

    return (
        <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 font-sans">
            {/* Header: Focus on the 'Why' */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Community Feedback</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 leading-tight">
                    {question}
                </h3>
            </div>

            {/* Main Bar: Unified "Sentiment Track" */}
            <div className="relative h-12 w-full bg-gray-50 rounded-2xl p-1.5 flex items-center mb-6 overflow-hidden border border-gray-100">
                {/* Yes Section */}
                <div
                    style={{ width: `${yesPercent}%` }}
                    className="h-full bg-gray-900 rounded-xl transition-all duration-1000 ease-out flex items-center px-4"
                >
                    <span className="text-white text-xs font-bold whitespace-nowrap">
                        {yesPercent >= 20 ? 'Yes' : ''}
                    </span>
                </div>

                {/* No Section */}
                <div className="flex-1 h-full flex items-center justify-end px-4">
                    <span className="text-gray-400 text-xs font-bold">
                        {noPercent >= 20 ? 'No' : ''}
                    </span>
                </div>
            </div>

            {/* Stats Grid: Better readability */}
            <div className="grid grid-cols-2 gap-8 px-2">
                <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1 tracking-tighter">
                        {yesPercent}%
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-900" />
                        <span className="text-xs text-gray-500 font-medium">
                            {yesCount.toLocaleString()} Positive
                        </span>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-3xl font-bold text-gray-300 mb-1 tracking-tighter">
                        {noPercent}%
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-xs text-gray-400 font-medium">
                            {noCount.toLocaleString()} Negative
                        </span>
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-200" />
                    </div>
                </div>
            </div>

            {/* Footer: Credibility Footer */}
            <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-gray-200" />
                    ))}
                    <div className="h-6 w-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-400">
                        +{total > 999 ? '1k' : total}
                    </div>
                </div>
                <span className="text-[10px] text-gray-400 font-medium italic">
                    Updated just now
                </span>
            </div>
        </div>
    );
};

export default InteractiveQuiz;
"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import {
    ArrowLeft,
    Save,
    Loader2,
    AlertCircle,
    CheckCircle,
} from "lucide-react";

import {
    basicInfoFields,
    engagementFields,
    targetingFields,
    rewardsFields,
    fraudControlsFields,
} from "../_components/form-config";

import { FormSection } from "../_components/FormSection";
import SurveyBuilder from "../_components/SurveyBuilder";
import QuizBuilder from "../_components/QuizBuilder";

export default function CreateTaskPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState(null);

    const methods = useForm({
        mode: "onBlur",
        defaultValues: {
            // Basic Info
            title: "",
            description: "",
            category: "fmcg",
            priority: "medium",
            status: "active",
            taskType: "video_quiz",
            completionTrigger: "video_end",
            startDate: "",
            endDate: "",
            minAge: "",
            maxAge: "",

            // Engagement
            maxAttempts: 3,
            cooldownPeriod: 24,
            dailyParticipationLimit: 10000,
            mandatoryInteraction: false,

            // Targeting
            gender: "all",
            profession: "all",
            radius: 10,
            deviceType: "all",
            targetCities: [],

            // Rewards
            rewardType: "cash",
            rewardValue: 5,
            maxDailyRewardCap: 10000,
            totalBudget: 50000,
            rewardApprovalMode: "auto",
            walletLockPeriod: 48,
            redemptionWindow: 30,

            // // Fraud Controls
            // minQualityScore: 50,
            // allowedRiskLevel: "low_medium",
            // engagementVelocityLimit: 5,
            // rapidCompletionThreshold: 15,
            // deviceUniquenessEnforcement: true,
            // geoVerificationRequired: true,
            // duplicateAccountDetection: true,
            // excludeSuspendedUsers: true,
            // excludeFlaggedUsers: true,
            // enforceDeviceBlacklist: true,
            // autoFlagRules: "",

            // Survey & Quiz - IMPORTANT: Must be proper array structure
            surveyQuestions: [], // Empty array of survey questions
            quizQuestions: [],   // Empty array of quiz questions
        },
    });

    const { handleSubmit, watch, formState: { errors } } = methods;
    const taskType = watch("taskType");

    const generateTaskId = useCallback(() => {
        const timestamp = Date.now().toString().slice(-6);
        return `TSK-${timestamp}`;
    }, []);

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            setError(null);

            // === Date Validation ===
            if (data.startDate && data.endDate) {
                if (new Date(data.endDate) <= new Date(data.startDate)) {
                    setError("End date must be after start date");
                    return;
                }
            }

            // === Age Validation ===
            if (data.minAge && data.maxAge && parseInt(data.minAge) > parseInt(data.maxAge)) {
                setError("Minimum age cannot be greater than maximum age");
                return;
            }

            // === Reward Validation ===
            if (parseFloat(data.rewardValue) > parseFloat(data.maxDailyRewardCap)) {
                setError("Reward value cannot exceed daily reward cap");
                return;
            }

            if (parseFloat(data.maxDailyRewardCap) > parseFloat(data.totalBudget)) {
                setError("Daily reward cap cannot exceed total budget");
                return;
            }

            // === Survey Questions Validation ===
            if (taskType === "survey" || taskType === "hybrid") {
                if (!data.surveyQuestions || data.surveyQuestions.length === 0) {
                    setError("Please add at least one survey question");
                    return;
                }

                // Validate each question
                for (let i = 0; i < data.surveyQuestions.length; i++) {
                    const q = data.surveyQuestions[i];

                    if (!q.question || !q.question.trim()) {
                        setError(`Survey question ${i + 1} is empty`);
                        return;
                    }

                    if (!q.options || q.options.length === 0) {
                        setError(`Survey question ${i + 1} has no answer options`);
                        return;
                    }

                    // Check for empty options
                    const emptyOptions = q.options.filter(opt => !opt || !opt.trim());
                    if (emptyOptions.length > 0) {
                        setError(`Survey question ${i + 1} has ${emptyOptions.length} empty option(s)`);
                        return;
                    }

                    // Minimum 2 options
                    if (q.options.length < 2) {
                        setError(`Survey question ${i + 1} must have at least 2 answer options`);
                        return;
                    }
                }
            }

            // === Quiz Questions Validation ===
            if (taskType === "quiz" || taskType === "hybrid") {
                if (!data.quizQuestions || data.quizQuestions.length === 0) {
                    setError("Please add at least one quiz question");
                    return;
                }

                for (let i = 0; i < data.quizQuestions.length; i++) {
                    const q = data.quizQuestions[i];

                    if (!q.question || !q.question.trim()) {
                        setError(`Quiz question ${i + 1} is empty`);
                        return;
                    }

                    if (!q.answer) {
                        setError(`Quiz question ${i + 1} has no answer selected`);
                        return;
                    }
                }
            }

            // All validations passed, prepare payload
            const payload = {
                ...data,
                taskId: generateTaskId(),
                createdAt: new Date().toISOString(),
            };

            console.log("Submitting payload:", payload);

            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(
                    errorData.message ||
                    errorData.error ||
                    `Server error: ${res.status}`
                );
            }

            setShowSuccess(true);
            setTimeout(() => router.push("/"), 2000);
        } catch (err) {
            console.error("Form submission error:", err);
            setError(err?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={() => router.back()}
                        className="hover:bg-gray-200 rounded-lg p-1"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Create Task</h1>
                </div>

                {/* Success */}
                {showSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                            <p className="text-sm font-medium text-green-800">
                                Task created successfully!
                            </p>
                            <p className="text-xs text-green-700">Redirecting...</p>
                        </div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* Basic Info */}
                        <FormSection section={basicInfoFields} includeSpecialFields />

                        {/* Engagement */}
                        <FormSection section={engagementFields} includeSpecialFields />

                        {/* Survey Builder */}
                        {(taskType === "survey" || taskType === "hybrid") && (
                            <SurveyBuilder name="surveyQuestions" />
                        )}

                        {/* Quiz Builder */}
                        {(taskType === "quiz" || taskType === "hybrid") && (
                            <QuizBuilder name="quizQuestions" />
                        )}

                        {/* Targeting */}
                        <FormSection section={targetingFields} includeSpecialFields />

                        {/* Rewards */}
                        <FormSection section={rewardsFields} includeSpecialFields />

                        {/* Fraud Controls */}
                        {/* <FormSection section={fraudControlsFields} includeSpecialFields /> */}

                        {/* Save */}
                        <div className="pt-6 border-t border-gray-200 flex gap-3">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 font-medium"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save Task
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
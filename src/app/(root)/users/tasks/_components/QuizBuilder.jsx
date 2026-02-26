"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Trash2, AlertCircle, Plus } from "lucide-react";

export default function QuizBuilder({ name }) {
    const { control, register, watch, formState } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    // Watch selected answers for visual feedback
    const watchedAnswers = watch(name);

    return (
        <div className="space-y-6 border-t pt-6">
            {/* Header with Question Count */}
            <div>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Quiz Questions (Yes / No)
                        <span className="text-red-500 ml-1">*</span>
                    </h3>
                    {fields.length > 0 && (
                        <span className="text-sm text-gray-600">
                            {fields.length} question{fields.length !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    Add at least one question with a correct answer
                </p>
            </div>

            {/* Questions List */}
            {fields.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">No quiz questions yet</p>
                    <p className="text-gray-500 text-xs mt-1">
                        Add one by clicking the button below
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {fields.map((field, index) => {
                        const questionError = formState.errors[name]?.[index]?.question;
                        const answerError = formState.errors[name]?.[index]?.answer;
                        const hasError = questionError || answerError;
                        const selectedAnswer = watchedAnswers?.[index]?.answer;

                        return (
                            <div
                                key={field.id}
                                className={`border rounded-xl p-4 space-y-3 bg-white transition-all ${hasError
                                        ? "border-red-300 bg-red-50"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                {/* Question Input */}
                                <div>
                                    <label
                                        htmlFor={`${name}-${index}-question`}
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Question {index + 1}
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        id={`${name}-${index}-question`}
                                        {...register(`${name}.${index}.question`, {
                                            required: "Question is required",
                                            minLength: {
                                                value: 1,
                                                message: "Question cannot be empty",
                                            },
                                            validate: (value) =>
                                                !value || value.trim().length > 0 ||
                                                "Question cannot be empty",
                                        })}
                                        placeholder="Enter quiz question (e.g., 'Is the sky blue?')"
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors ${questionError
                                                ? "border-red-300 bg-red-50"
                                                : "border-gray-300"
                                            }`}
                                    />
                                    {questionError && (
                                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {questionError.message}
                                        </p>
                                    )}
                                </div>

                                {/* Answer Selection - Yes/No Radio */}
                                <fieldset>
                                    <legend className="text-sm font-medium text-gray-700 mb-2">
                                        Correct Answer
                                        <span className="text-red-500 ml-1">*</span>
                                        <span className="text-xs text-gray-500 ml-2">
                                            (Use arrow keys or click)
                                        </span>
                                    </legend>

                                    <div className="space-y-2">
                                        {/* Yes Option */}
                                        <label
                                            htmlFor={`${name}-${index}-yes`}
                                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedAnswer === "yes"
                                                    ? "bg-teal-50 border border-teal-300"
                                                    : "hover:bg-gray-100 border border-transparent"
                                                }`}
                                        >
                                            <input
                                                id={`${name}-${index}-yes`}
                                                type="radio"
                                                value="yes"
                                                {...register(
                                                    `${name}.${index}.answer`,
                                                    {
                                                        required:
                                                            "Please select an answer",
                                                    }
                                                )}
                                                className="h-4 w-4 cursor-pointer"
                                                aria-label="Answer is Yes"
                                            />
                                            <span className="text-sm text-gray-700 font-medium">
                                                Yes
                                            </span>
                                        </label>

                                        {/* No Option */}
                                        <label
                                            htmlFor={`${name}-${index}-no`}
                                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedAnswer === "no"
                                                    ? "bg-teal-50 border border-teal-300"
                                                    : "hover:bg-gray-100 border border-transparent"
                                                }`}
                                        >
                                            <input
                                                id={`${name}-${index}-no`}
                                                type="radio"
                                                value="no"
                                                {...register(
                                                    `${name}.${index}.answer`,
                                                    {
                                                        required:
                                                            "Please select an answer",
                                                    }
                                                )}
                                                className="h-4 w-4 cursor-pointer"
                                                aria-label="Answer is No"
                                            />
                                            <span className="text-sm text-gray-700 font-medium">
                                                No
                                            </span>
                                        </label>
                                    </div>

                                    {answerError && (
                                        <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {answerError.message}
                                        </p>
                                    )}
                                </fieldset>

                                {/* Remove Button */}
                                <div className="pt-2 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                        aria-label={`Remove question ${index + 1}`}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                        Remove Question
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Question Button */}
            <button
                type="button"
                onClick={() =>
                    append({
                        question: "",
                        answer: "yes",
                    })
                }
                className="w-full px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors flex items-center justify-center gap-2"
            >
                <Plus className="h-4 w-4" />
                Add Quiz Question
            </button>
        </div>
    );
}
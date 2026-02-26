"use client";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";

/* Question Item */
function SurveyQuestionItem({ qIndex, name, removeQuestion }) {
    const { control, register, watch, formState: { errors } } = useFormContext();

    const answersName = `${name}.${qIndex}.options`;

    const {
        fields: answerFields,
        append: appendAnswer,
        remove: removeAnswer,
    } = useFieldArray({
        control,
        name: answersName,
    });

    // Watch options to debug
    const watchedOptions = watch(answersName);

    const questionError = errors?.[name]?.[qIndex]?.question;
    const optionsError = errors?.[name]?.[qIndex]?.options;

    return (
        <div className="border rounded-2xl p-5 space-y-4 bg-gray-50">
            {/* Question */}
            <div className="flex justify-between gap-3">
                <div className="flex-1">
                    <input
                        {...register(`${name}.${qIndex}.question`, {
                            required: "Question is required",
                        })}
                        placeholder="Enter survey question"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
                    />
                    {questionError && (
                        <p className="text-xs text-red-500 mt-1">
                            {questionError.message}
                        </p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-500 hover:text-red-700 p-2 flex-shrink-0"
                    title="Remove question"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            {/* Answers Section */}
            <div className="space-y-3 bg-white p-4 rounded-lg">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">
                        Answer Options <span className="text-red-500">*</span>
                    </p>
                    <span className="text-xs text-gray-500">
                        {answerFields?.length || 0} option{answerFields?.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Options List */}
                <div className="space-y-2">
                    {answerFields && answerFields.length > 0 ? (
                        answerFields.map((field, aIndex) => (
                            <div key={field.id} className="flex gap-2">
                                <input
                                    {...register(
                                        `${answersName}.${aIndex}`,
                                        {
                                            required: "Option cannot be empty",
                                        }
                                    )}
                                    placeholder={`Option ${aIndex + 1}`}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none text-sm"
                                />
                                {answerFields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeAnswer(aIndex)}
                                        className="text-red-500 hover:text-red-700 p-2 flex-shrink-0"
                                        title="Remove option"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-gray-500 italic py-2">
                            No options yet. Click below to add.
                        </p>
                    )}
                </div>

                {optionsError && (
                    <p className="text-xs text-red-500">
                        {optionsError.message}
                    </p>
                )}

                {/* Add Answer Button */}
                <button
                    type="button"
                    onClick={() => {
                        console.log("Adding answer. Current options:", watchedOptions);
                        appendAnswer("");
                    }}
                    className="w-full mt-3 px-3 py-2 text-sm text-teal-600 font-medium hover:text-teal-700 hover:bg-teal-50 rounded-lg border border-teal-200 flex items-center justify-center gap-1"
                >
                    <Plus className="h-4 w-4" />
                    Add Another Option
                </button>
            </div>
        </div>
    );
}

/* Main Builder */
export default function SurveyBuilder({ name }) {
    const { control, watch, formState: { errors } } = useFormContext();

    const {
        fields: questionFields,
        append: appendQuestion,
        remove: removeQuestion,
    } = useFieldArray({
        control,
        name,
    });

    const watchedQuestions = watch(name);

    return (
        <div className="space-y-6 border-t pt-6">
            <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                    Survey Questions & Answers <span className="text-red-500">*</span>
                </h3>
                {questionFields.length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                        No questions added. Click "Add Question" below to start.
                    </p>
                )}
                {questionFields.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                        {questionFields.length} question{questionFields.length !== 1 ? "s" : ""} added
                    </p>
                )}
            </div>

            {/* Questions */}
            {questionFields.map((field, qIndex) => (
                <SurveyQuestionItem
                    key={field.id}
                    qIndex={qIndex}
                    name={name}
                    removeQuestion={removeQuestion}
                />
            ))}

            {/* Add Question Button */}
            <button
                type="button"
                onClick={() => {
                    console.log("Adding question");
                    appendQuestion({
                        question: "",
                        options: ["", ""], // Start with 2 empty options
                    });
                }}
                className="w-full px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 flex items-center justify-center gap-2"
            >
                <Plus className="h-4 w-4" />
                Add Question
            </button>
        </div>
    );
}
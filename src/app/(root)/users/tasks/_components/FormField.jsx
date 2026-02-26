// components/FormField.tsx - Reusable field component
'use client';

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';


export function FormField({ field, isDisabled }) {
    const { control, formState } = useFormContext();
    const error = formState.errors[field.name];

    const gridClass = {
        full: 'col-span-2',
        half: 'col-span-1',
        third: 'col-span-1 md:col-span-1 lg:col-span-1',
    };

    return (
        <div className={gridClass[field.grid || 'half']}>
            <Controller
                name={field.name}
                control={control}
                defaultValue={field.defaultValue || ''}
                rules={field.validation}
                render={({ field: fieldProps }) => (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            {field.label}
                            {field.validation?.required && (
                                <span className="text-red-500 ml-1">*</span>
                            )}
                        </label>

                        {/* Input Field */}
                        {field.type === 'input' && (
                            <input
                                {...fieldProps}
                                type="text"
                                placeholder={field.placeholder}
                                disabled={isDisabled || field.validation?.disabled}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                            />
                        )}

                        {/* Number Field */}
                        {field.type === 'number' && (
                            <input
                                {...fieldProps}
                                type="number"
                                placeholder={field.placeholder}
                                disabled={isDisabled}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100 text-sm"
                            />
                        )}

                        {/* Date Field */}
                        {field.type === 'date' && (
                            <input
                                {...fieldProps}
                                type="date"
                                disabled={isDisabled}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100 text-sm"
                            />
                        )}

                        {/* Select Field */}
                        {field.type === 'select' && (
                            <select
                                {...fieldProps}
                                disabled={isDisabled}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100 text-sm"
                            >
                                <option value="">Select {field.label}</option>
                                {field.options?.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}

                        {/* Textarea Field */}
                        {field.type === 'textarea' && (
                            <textarea
                                {...fieldProps}
                                placeholder={field.placeholder}
                                disabled={isDisabled}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100 text-sm resize-none"
                            />
                        )}

                        {/* Switch Field */}
                        {field.type === 'switch' && (
                            <label className="flex items-center cursor-pointer">
                                <input
                                    {...fieldProps}
                                    type="checkbox"
                                    disabled={isDisabled}
                                    className="w-4 h-4 cursor-pointer accent-teal-500"
                                />
                            </label>
                        )}

                        {/* Checkbox Field */}
                        {field.type === 'checkbox' && (
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    {...fieldProps}
                                    type="checkbox"
                                    disabled={isDisabled}
                                    className="w-4 h-4 cursor-pointer accent-teal-500 rounded"
                                />
                                <span className="text-sm text-gray-700">{field.label}</span>
                            </label>
                        )}

                        {/* Error Message */}
                        {error && (
                            <p className="text-xs text-red-500 mt-1">
                                {typeof error.message === 'string'
                                    ? error.message
                                    : 'This field is invalid'}
                            </p>
                        )}

                        {/* Help Text */}
                        {field.helpText && !error && (
                            <p className="text-xs text-gray-500">{field.helpText}</p>
                        )}
                    </div>
                )}
            />
        </div>
    );
}
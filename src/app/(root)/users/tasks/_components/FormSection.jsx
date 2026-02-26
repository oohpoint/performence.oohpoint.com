'use client';

import React from 'react';
import { FormField } from './FormField';
import { CitiesField, AutoFlagRulesField } from './SpecializedFields';


export function FormSection({ section, includeSpecialFields }) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                {section.description && (
                    <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                )}
            </div>

            {/* Grid for regular fields */}
            <div className="grid grid-cols-4 gap-4">
                {section.fields.map((field) => (
                    <FormField key={field.name} field={field} />
                ))}
            </div>

            {/* Special fields based on section ID */}
            {section.id === 'targeting' && includeSpecialFields && (
                <>
                    <CitiesField />
                </>
            )}

            {section.id === 'fraud-controls' && includeSpecialFields && (
                <AutoFlagRulesField />
            )}
        </div>
    );
}
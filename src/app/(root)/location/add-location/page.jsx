"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Building2, MapPin, Users, Shield, Plus, Loader, CheckCircle2, ArrowLeft } from "lucide-react";
import { InputField } from "@/components/Field/InputField";
import { SelectField } from "@/components/Field/SelectField";
import { LocationAutoComplete } from "@/components/Field/LocationAutoComplete";
import { COLLEGE_TYPES, COLLEGE_TAGS, CAFE_SUB_TYPES, CAFE_SUB_CATEGORIES, STATUS_OPTIONS, AUDIENCE_OPTIONS, AGE_BAND_OPTIONS, GENDER_SKEW_OPTIONS, EDUCATION_LEVEL_OPTIONS, CAMPUS_TYPE_OPTIONS, FOOTFALL_LEVEL_OPTIONS, PEAK_WINDOWS, LOW_WINDOWS, RESTRICTED_CATEGORIES, DWELL_TIME_OPTIONS, LOCATION_TYPES } from "../constants/form-options";
import { CheckboxGroup } from "../components/form-fields";


const DEFAULT_VALUES = {
    peak_windows: [],
    low_windows: [],
    restricted_categories: [],
    college_tags: [],
    cafe_sub_categories: [],
    status: "Active",
    radius: 500,
    city: "",
    area: "",
    pincode: "",
};

export default function LocationAddPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors, isDirty },
        reset,
        setValue,
    } = useForm({
        defaultValues: DEFAULT_VALUES,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const locationType = watch("location_type");
    const subLocationType = watch("sub_location_type");
    const peakWindows = watch("peak_windows");
    const lowWindows = watch("low_windows");
    const restrictedCategories = watch("restricted_categories");
    const collegeTags = watch("college_tags");
    const cafeSubCategories = watch("cafe_sub_categories");

    // Location autocomplete state
    const cityValue = watch("city");
    const areaValue = watch("area");
    const pincodeValue = watch("pincode");

    // Reset conditional fields when location type changes
    useEffect(() => {
        if (locationType === "College") {
            setValue("sub_location_type", undefined);
            setValue("cafe_sub_categories", []);
        } else if (locationType === "Food & Beverage") {
            setValue("college_type", undefined);
            setValue("college_tags", []);
        }
    }, [locationType, setValue]);

    // Reset sub-categories when sub_location_type changes
    useEffect(() => {
        setValue("cafe_sub_categories", []);
    }, [subLocationType, setValue]);

    // Show warning before leaving page with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            // Prepare data for API
            const submitData = {
                location_name: data.location_name,
                location_type: data.location_type,
                city: data.city,
                area: data.area,
                pincode: data.pincode || "",
                latitude: data.latitude ? parseFloat(data.latitude) : null,
                longitude: data.longitude ? parseFloat(data.longitude) : null,
                radius: data.radius ? parseInt(data.radius) : 500,
                status: data.status,
                primary_audience: data.primary_audience,
                age_band: data.age_band,
                gender_skew: data.gender_skew || "",
                education_level: data.education_level || "",
                campus_type: data.campus_type || "",
                footfall_level: data.footfall_level,
                peak_windows: peakWindows || [],
                low_windows: lowWindows || [],
                avg_dwell_bucket: data.avg_dwell_bucket || "",
                nearby_vendors_type_landmark: data.nearby_vendors_type_landmark || "",
                restricted_categories: restrictedCategories || [],
            };

            // Add conditional fields
            if (locationType === "College") {
                submitData.college_type = data.college_type;
                submitData.college_tags = collegeTags || [];
            } else if (locationType === "Food & Beverage") {
                submitData.sub_location_type = data.sub_location_type;
                submitData.cafe_sub_categories = cafeSubCategories || [];
            }

            console.log("Submitting location data:", submitData);

            const response = await fetch("/api/location/add-location", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submitData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to create location");
            }

            const result = await response.json();
            console.log("Location created:", result);

            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
                reset(DEFAULT_VALUES);
                router.push("/location");
            }, 2000);
        } catch (error) {
            console.error("Submission error:", error);
            alert(error instanceof Error ? error.message : "Failed to create location");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCheckboxChange = (fieldName, value) => {
        const currentValues = watch(fieldName) || [];
        if (currentValues.includes(value)) {
            setValue(fieldName, currentValues.filter((v) => v !== value));
        } else {
            setValue(fieldName, [...currentValues, value]);
        }
    };

    return (
        <div className="bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="py-8 space-y-10"
                >
                    {/* Location Identity */}
                    <FormSection
                        title="Location Identity"
                        icon={Building2}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <InputField
                                    label="Location Name"
                                    name="location_name"
                                    register={register}
                                    required="Location name is required"
                                    error={errors.location_name}
                                    icon={<Building2 size={18} />}
                                    placeholder="e.g., IIT Bombay Main Gate"
                                />
                            </div>

                            <div>
                                <SelectField
                                    label="Location Type"
                                    name="location_type"
                                    register={register}
                                    required="Location type is required"
                                    options={LOCATION_TYPES}
                                    error={errors.location_type}
                                />
                            </div>

                            {locationType === "College" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <SelectField
                                        label="College Type"
                                        name="college_type"
                                        register={register}
                                        required="College type is required"
                                        options={COLLEGE_TYPES}
                                        error={errors.college_type}
                                    />

                                    <CheckboxGroupField
                                        label="College Tags"
                                        options={COLLEGE_TAGS}
                                        selectedValues={collegeTags}
                                        onChange={(value) => handleCheckboxChange("college_tags", value)}
                                    />
                                </div>
                            )}

                            {locationType === "Food & Beverage" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <SelectField
                                        label="Food & Beverage Type"
                                        name="sub_location_type"
                                        register={register}
                                        required="Type is required"
                                        options={CAFE_SUB_TYPES}
                                        error={errors.sub_location_type}
                                    />

                                    {subLocationType && (
                                        <CheckboxGroupField
                                            label="Sub Categories"
                                            options={CAFE_SUB_CATEGORIES[subLocationType] || []}
                                            selectedValues={cafeSubCategories}
                                            onChange={(value) => handleCheckboxChange("cafe_sub_categories", value)}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Location Autocomplete - INTEGRATED */}
                            <LocationAutoComplete
                                cityValue={cityValue}
                                areaValue={areaValue}
                                pincodeValue={pincodeValue}
                                onCityChange={(value) => setValue("city", value)}
                                onAreaChange={(value) => setValue("area", value)}
                                onPincodeChange={(value) => setValue("pincode", value)}
                                errors={errors}
                            />

                            <div>
                                <SelectField
                                    label="Status"
                                    name="status"
                                    register={register}
                                    required="Status is required"
                                    options={STATUS_OPTIONS}
                                    error={errors.status}
                                />
                            </div>
                        </div>
                    </FormSection>

                    {/* Geo Coordinates */}
                    <FormSection
                        title="Geo Coordinates & Radius"
                        description="Location coordinates and coverage radius"
                        icon={MapPin}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <InputField
                                label="Latitude"
                                name="latitude"
                                type="number"
                                step="any"
                                register={register}
                                required="Latitude is required"
                                error={errors.latitude}
                                placeholder="e.g., 19.1334"
                            />

                            <InputField
                                label="Longitude"
                                name="longitude"
                                type="number"
                                step="any"
                                register={register}
                                required="Longitude is required"
                                error={errors.longitude}
                                placeholder="e.g., 72.9133"
                            />

                            <InputField
                                label="Radius (meters)"
                                name="radius"
                                type="number"
                                register={register}
                                error={errors.radius}
                                placeholder="e.g., 500"
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-4">
                            💡 Use Google Maps to find coordinates and set appropriate radius for location coverage
                        </p>
                    </FormSection>

                    {/* Audience Profile */}
                    <FormSection
                        title="Audience Profile"
                        icon={Users}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <SelectField
                                label="Primary Audience"
                                name="primary_audience"
                                register={register}
                                required="Primary audience is required"
                                options={AUDIENCE_OPTIONS}
                                error={errors.primary_audience}
                            />

                            <SelectField
                                label="Age Band"
                                name="age_band"
                                register={register}
                                required="Age band is required"
                                options={AGE_BAND_OPTIONS}
                                error={errors.age_band}
                            />

                            <SelectField
                                label="Gender Skew"
                                name="gender_skew"
                                register={register}
                                options={GENDER_SKEW_OPTIONS}
                                error={errors.gender_skew}
                            />

                            <SelectField
                                label="Education Level"
                                name="education_level"
                                register={register}
                                options={EDUCATION_LEVEL_OPTIONS}
                                error={errors.education_level}
                            />

                            <SelectField
                                label="Campus Type"
                                name="campus_type"
                                register={register}
                                options={CAMPUS_TYPE_OPTIONS}
                                error={errors.campus_type}
                            />

                            <SelectField
                                label="Footfall Level"
                                name="footfall_level"
                                register={register}
                                required="Footfall level is required"
                                options={FOOTFALL_LEVEL_OPTIONS}
                                error={errors.footfall_level}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                            <CheckboxGroup
                                label="Peak Windows"
                                name="peak_windows"
                                control={control}
                                options={PEAK_WINDOWS}
                                error={errors.peak_windows?.message}
                            />

                            <CheckboxGroup
                                label="Low Windows"
                                name="low_windows"
                                control={control}
                                options={LOW_WINDOWS}
                                error={errors.low_windows?.message}
                            />
                        </div>

                    </FormSection>



                    {/* Context & Safety */}
                    <FormSection
                        title="Context & Safety"
                        description="Dwell time and restricted categories"
                        icon={Shield}
                    >
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <SelectField
                                    label="Avg Dwell Time"
                                    name="avg_dwell_bucket"
                                    register={register}
                                    options={DWELL_TIME_OPTIONS}
                                    error={errors.avg_dwell_bucket}
                                />

                                <InputField
                                    label="Nearby Vendors / Landmark"
                                    name="nearby_vendors_type_landmark"
                                    register={register}
                                    error={errors.nearby_vendors_type_landmark}
                                    placeholder="e.g., Cafe Coffee Day, HDFC ATM"
                                />
                            </div>

                            <CheckboxGroup
                                label="Restricted Categories"
                                name="restricted_categories"
                                control={control}
                                options={RESTRICTED_CATEGORIES}
                                error={errors.restricted_categories?.message}
                            />
                        </div>
                    </FormSection>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-8 border-t border-gray-200 ">
                        <button
                            type="button"
                            onClick={() => router.push("/location")}
                            disabled={isSubmitting || !isDirty}
                            className=" cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowLeft size={20} />
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 cursor-pointer px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader size={20} className="animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus size={20} />
                                    Create Location
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>


            {/* Success Modal */}
            {isSubmitted && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={32} className="text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                            Location Created!
                        </h3>
                        <p className="text-gray-600 text-center text-sm">
                            Your location has been successfully created.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ========== Components ========== */

function FormSection({ title, icon: Icon, children }) {
    return (
        <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <Icon size={26} className="text-blue-600" />
                {title}
            </h2>
            <div>
                {children}
            </div>
        </section>
    );
}

function CheckboxGroupField({ label, options, selectedValues, onChange }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
                {label}
            </label>
            <div className="space-y-2">
                {options.map((option) => (
                    <label key={option} className="flex items-center">
                        <input
                            type="checkbox"
                            checked={(selectedValues || []).includes(option)}
                            onChange={() => onChange(option)}
                            className="w-4 h-4 rounded border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
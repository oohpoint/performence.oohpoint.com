"use client";

import { FileUpload } from "@/components/Field/FileUpload";
import { InputField } from "@/components/Field/InputField";
import { SelectField } from "@/components/Field/SelectField";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {
    Building2,
    Mail,
    Lock,
    MapPin,
    FileText,
    Globe,
    DollarSign,
    User,
    CheckCircle2,
    ArrowLeft,
    Loader,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function BrandEditPage() {
    const router = useRouter();
    const { id } = useParams();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
        reset,
    } = useForm();

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [previewLogo, setPreviewLogo] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const selectedCategory = watch("brandCategory");

    // Fetch brand data on mount
    useEffect(() => {
        const fetchBrand = async () => {
            try {
                setIsLoading(true);
                setErrorMessage("");
                const res = await fetch(`/api/brands/${id}`);
                const data = await res.json();

                if (data.success) {
                    const brand = data.data;
                    setPreviewLogo(brand.logoUrl || "");

                    // Set form values
                    reset({
                        brandName: brand.brandName || "",
                        brandCategory: brand.industryType || "",
                        website: brand.website || "",
                        city: brand.city || "",
                        gst: brand.gst || "",
                        status: brand.status || "Pilot",
                        adBudget: brand.adBudget || "",
                        pocName: brand.poc?.name || "",
                        pocEmail: brand.poc?.email || "",
                        pocPassword: brand.poc?.password || "",
                    });
                } else {
                    setErrorMessage("Failed to load brand data");
                }
            } catch (error) {
                console.error("Failed to fetch brand:", error);
                setErrorMessage("Failed to load brand data");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchBrand();
        }
    }, [id, reset]);

    // Handle logo preview
    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewLogo(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            setIsSaving(true);
            setErrorMessage("");

            const formData = new FormData();

            // Append all fields to FormData
            formData.append("brandName", data.brandName || "");
            formData.append("industryType", data.brandCategory || "");
            formData.append("website", data.website || "");
            formData.append("city", data.city || "");
            formData.append("gst", data.gst || "");
            formData.append("status", data.status || "Pilot");
            formData.append("adBudget", data.adBudget || "0");
            formData.append("pocName", data.pocName || "");
            formData.append("pocEmail", data.pocEmail || "");
            formData.append("pocPassword", data.pocPassword || "");

            // Handle logo file if provided
            if (data.brandLogo instanceof FileList && data.brandLogo.length > 0) {
                formData.append("brandLogo", data.brandLogo[0]);
            }

            console.log("Submitting form data...");

            const res = await fetch(`/api/brands/${id}/edit`, {
                method: "PUT",
                body: formData,
            });

            const result = await res.json();

            console.log("API Response:", result);

            if (!res.ok) {
                throw new Error(result.message || "Failed to update brand");
            }

            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
                router.push(`/brand/${id}`);
            }, 2000);
        } catch (error) {
            console.error("Brand update error:", error);
            setErrorMessage(error.message || "Failed to update brand");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 text-sm">Loading brand details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">


            {/* Error Message */}
            {errorMessage && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                </div>
            )}

            {/* Form Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Brand Information */}
                    <FormSection
                        title="Brand Information"
                        description="Update your brand details and online presence"
                        icon={Building2}
                    >
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <InputField
                                    label="Brand Name"
                                    name="brandName"
                                    register={register}
                                    required="Brand name is required"
                                    error={errors.brandName}
                                    icon={<Building2 size={18} />}
                                    placeholder="Enter your brand name"
                                />

                                <SelectField
                                    label="Industry Type"
                                    name="brandCategory"
                                    register={register}
                                    required="Category is required"
                                    options={[
                                        "F&B",
                                        "Salon",
                                        "Edtech",
                                        "Fitness",
                                        "Retail",
                                        "Services",
                                        "Fintech",
                                        "Other",
                                    ]}
                                    error={errors.brandCategory}
                                />

                                <InputField
                                    label="Website URL"
                                    name="website"
                                    type="url"
                                    placeholder="https://example.com"
                                    register={register}
                                    icon={<Globe size={18} />}
                                />

                                <InputField
                                    label="City"
                                    name="city"
                                    register={register}
                                    placeholder="Enter city"
                                    icon={<MapPin size={18} />}
                                />
                            </div>

                            {/* Logo Upload Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <label className="block text-sm font-semibold text-gray-900 mb-4">
                                    Brand Logo
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Logo Preview */}
                                    <div>
                                        <div className="relative w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                                            {previewLogo ? (
                                                <img
                                                    src={previewLogo}
                                                    alt="Logo preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    <Building2
                                                        size={32}
                                                        className="text-gray-400 mx-auto mb-2"
                                                    />
                                                    <p className="text-xs text-gray-600">
                                                        No logo
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-600 mt-2">
                                            Current logo preview
                                        </p>
                                    </div>

                                    {/* Logo Upload */}
                                    <div>
                                        <FileUpload
                                            label="Upload New Logo"
                                            name="brandLogo"
                                            register={register}
                                            setValue={setValue}
                                            onChange={handleLogoChange}
                                        />
                                        <p className="text-xs text-gray-600 mt-2">
                                            Leave empty to keep current logo
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FormSection>

                    {/* Business Details */}
                    <FormSection
                        title="Business Details"
                        description="Manage your business information and budget"
                        icon={FileText}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputField
                                label="GST Number"
                                name="gst"
                                register={register}
                                placeholder="Enter GST number"
                                icon={<FileText size={18} />}
                            />

                            <SelectField
                                label="Brand Status"
                                name="status"
                                register={register}
                                required="Status is required"
                                options={["Pilot", "Active"]}
                                error={errors.status}
                            />

                            <InputField
                                label="Ad Budget (₹)"
                                name="adBudget"
                                type="number"
                                register={register}
                                placeholder="Enter budget amount"
                                icon={<DollarSign size={18} />}
                            />
                        </div>
                    </FormSection>

                    {/* Point of Contact */}
                    <FormSection
                        title="Point of Contact"
                        description="Update contact information for this brand"
                        icon={User}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputField
                                label="POC Name"
                                name="pocName"
                                register={register}
                                required="POC name required"
                                error={errors.pocName}
                                placeholder="Enter full name"
                                icon={<User size={18} />}
                            />

                            <InputField
                                label="POC Email"
                                name="pocEmail"
                                type="email"
                                register={register}
                                required="Email required"
                                error={errors.pocEmail}
                                placeholder="Enter email address"
                                icon={<Mail size={18} />}
                            />

                            <InputField
                                label="POC Password"
                                name="pocPassword"
                                type="password"
                                register={register}
                                required="Password required"
                                error={errors.pocPassword}
                                placeholder="Enter secure password"
                                icon={<Lock size={18} />}
                            />
                        </div>
                    </FormSection>

                    {/* Submit Section */}
                    <div className="flex gap-4 pt-8 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Loader size={20} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    Save Changes
                                    <CheckCircle2 size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Success Modal */}
            {isSubmitted && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 animate-in">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={32} className="text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                            Brand Updated!
                        </h3>
                        <p className="text-gray-600 text-center text-sm">
                            Your changes have been saved successfully.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ========== Components ========== */

function FormSection({
    title,
    description,
    icon: Icon,
    children,
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-blue-100 rounded-lg">
                        <Icon size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-sm text-gray-600 mt-0.5">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="px-6 py-6">
                {children}
            </div>
        </div>
    );
}
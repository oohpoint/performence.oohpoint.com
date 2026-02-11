"use client";

import { FileUpload } from "@/components/Field/FileUpload";
import { InputField } from "@/components/Field/InputField";
import { SelectField } from "@/components/Field/SelectField";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function BrandForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue
    } = useForm({
        defaultValues: {
            status: "Pilot",
        },
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const selectedCategory = watch("brandCategory");

    const onSubmit = async (data) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            // ✅ Handle file input
            if (key === "brandLogo") {
                if (value instanceof FileList && value.length > 0) {
                    formData.append("brandLogo", value[0]);
                }
                return;
            }

            // ✅ Skip empty values (important)
            if (value === undefined || value === null) return;

            // ✅ Convert numbers / booleans safely
            if (typeof value === "number" || typeof value === "boolean") {
                formData.append(key, String(value));
                return;
            }

            // ✅ Normal strings
            formData.append(key, value);
        });

        try {
            const res = await fetch("/api/brands/add-brand", {
                method: "POST",
                body: formData, // ❗ no headers
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Failed to create brand");
            }

            setIsSubmitted(true);
            setTimeout(() => setIsSubmitted(false), 3000);

            router.push("/brand");
        } catch (error) {
            console.error("Brand submit error:", error);
            alert(error.message || "API Error");
        }
    };


    return (
        <div className="bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="py-8 space-y-10"
                >
                    {/* Brand Information */}
                    <section className="space-y-4 ">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <Building2 className="text-blue-600" size={26} />
                            Brand Information
                        </h2>

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
                                label="Brand Category"
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

                            {selectedCategory === "Other" && (
                                <InputField
                                    label="Specify Category"
                                    name="customCategory"
                                    register={register}
                                    required="Please specify category"
                                    error={errors.customCategory}
                                    placeholder="Enter custom category"
                                />
                            )}

                            <FileUpload
                                label="Brand Logo"
                                name="brandLogo"
                                register={register}
                                setValue={setValue}
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
                    </section>

                    {/* Business Details */}
                    <section className="space-y-4 pt-8 border-t border-slate-200 ">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <FileText className="text-blue-600" size={26} />
                            Business Details
                        </h2>

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
                                label="Monthly Spend Cap (₹)"
                                name="monthlySpend"
                                type="number"
                                register={register}
                                placeholder="Enter amount"
                                icon={<DollarSign size={18} />}
                            />
                        </div>
                    </section>

                    {/* Point of Contact */}
                    <section className="space-y-4 pt-8 border-t border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <User className="text-blue-600" size={26} />
                            Point of Contact
                        </h2>

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
                    </section>

                    {/* Submit */}
                    <div className="pt-8 border-t border-slate-200">
                        <button
                            type="submit"
                            className="w-full px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            Create Brand
                            <CheckCircle2 size={20} />
                        </button>
                    </div>
                </form>
            </div>

            {/* Success Modal */}
            {isSubmitted && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={32} className="text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
                            Brand Created!
                        </h3>
                        <p className="text-slate-600 text-center text-sm">
                            Your brand has been successfully created.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

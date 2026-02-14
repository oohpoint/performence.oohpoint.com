"use client";

import { FileUpload } from "@/components/Field/FileUpload";
import { InputField } from "@/components/Field/InputField";
import { SelectField } from "@/components/Field/SelectField";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
    Building2,
    User,
    Phone,
    Mail,
    Lock,
    MapPin,
    Clock,
    FileText,
    CreditCard,
    Image,
    CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function VendorForm() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
    } = useForm();

    const [isSubmitted, setIsSubmitted] = useState(false);
    const selectedCategory = watch("category");

    const onSubmit = async (data) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (
                key === "vendorLogo" ||
                key === "shopImages" ||
                key === "menuImages" ||
                key === "interiorPhoto" ||
                key === "idDocument" ||
                key === "agreementDocument"
            ) {
                if (value instanceof File) {
                    formData.append(key, value);
                }
                if (value instanceof FileList) {
                    Array.from(value).forEach((file) =>
                        formData.append(key, file)
                    );
                }
                return;
            }

            if (value === undefined || value === null) return;

            if (typeof value === "boolean" || typeof value === "number") {
                formData.append(key, String(value));
            } else {
                formData.append(key, value);
            }
        });

        try {
            const res = await fetch("/api/vendor/add-vendor", {
                method: "POST",
                body: formData,
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Failed to create vendor");
            }

            setIsSubmitted(true);
            setTimeout(() => setIsSubmitted(false), 3000);
            router.push("/vendor");
        } catch (error) {
            console.error("Vendor submit error:", error);
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
                    {/* Basic Information */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Building2 className="text-purple-600" size={26} />
                            Basic Information
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <InputField
                                label="Business Name"
                                name="businessName"
                                register={register}
                                required="Business name required"
                                error={errors.businessName}
                                placeholder="Enter business name"
                                icon={<Building2 size={18} />}
                            />

                            <InputField
                                label="Owner's Name"
                                name="ownerName"
                                register={register}
                                required="Owner name required"
                                error={errors.ownerName}
                                placeholder="Enter owner's name"
                                icon={<User size={18} />}
                            />

                            <SelectField
                                label="Category"
                                name="category"
                                register={register}
                                required="Category required"
                                options={[
                                    "Restaurant",
                                    "Cafe",
                                    "Salon",
                                    "Retail",
                                    "Services",
                                    "Other",
                                ]}
                                error={errors.category}
                            />

                            <InputField
                                label="Subcategory"
                                name="subcategory"
                                register={register}
                                error={errors.subcategory}
                                placeholder="Select Subcategory"
                            />

                            {selectedCategory === "Other" && (
                                <InputField
                                    label="Specify Category"
                                    name="customCategory"
                                    register={register}
                                    required="Specify category"
                                    error={errors.customCategory}
                                    placeholder="Enter category"
                                />
                            )}
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Phone className="text-purple-600" size={26} />
                            Contact Information
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                            <InputField
                                label="Phone Number"
                                name="phone"
                                register={register}
                                required="Phone required"
                                error={errors.phone}
                                placeholder="Enter phone number"
                                icon={<Phone size={18} />}
                            />

                            <InputField
                                label="WhatsApp (Optional)"
                                name="whatsapp"
                                register={register}
                                placeholder="Enter WhatsApp number"
                                icon={<Phone size={18} />}
                            />

                            <InputField
                                label="Email Address"
                                name="email"
                                type="email"
                                register={register}
                                required="Email required"
                                error={errors.email}
                                placeholder="Enter email"
                                icon={<Mail size={18} />}
                            />

                            <InputField
                                label="Password"
                                name="password"
                                type="password"
                                register={register}
                                required="Password required"
                                error={errors.password}
                                placeholder="Enter password"
                                icon={<Lock size={18} />}
                            />
                        </div>
                    </section>

                    {/* Location Details */}
                    <section className="space-y-4 ">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <MapPin className="text-purple-600" size={26} />
                            Location Details
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <InputField
                                label="Full Address"
                                name="address"
                                register={register}
                                required="Address required"
                                error={errors.address}
                                placeholder="Enter full address"
                            />

                            <InputField
                                label="Latitude"
                                name="latitude"
                                register={register}
                                required="Latitude required"
                                error={errors.latitude}
                                placeholder="Enter latitude"
                            />

                            <InputField
                                label="Longitude"
                                name="longitude"
                                register={register}
                                required="Longitude required"
                                error={errors.longitude}
                                placeholder="Enter longitude"
                            />
                        </div>
                    </section>

                    {/* Business Hours */}
                    <section className="space-y-4 ">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Clock className="text-purple-600" size={26} />
                            Business Hours
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputField
                                label="Opening Hours"
                                name="openingHours"
                                type="time"
                                register={register}
                                required="Opening hours required"
                                error={errors.openingHours}
                            />

                            <InputField
                                label="Closing Hours"
                                name="closingHours"
                                type="time"
                                register={register}
                                required="Closing hours required"
                                error={errors.closingHours}
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-2">
                                Operating Days
                            </label>
                            <div className="flex items-center  flex-wrap gap-5">
                                {[
                                    "Monday",
                                    "Tuesday",
                                    "Wednesday",
                                    "Thursday",
                                    "Friday",
                                    "Saturday",
                                    "Sunday",
                                ].map((day) => (
                                    <label
                                        key={day}
                                        className="flex items-center gap-1.5"
                                    >
                                        <input
                                            className="mt-1"
                                            type="checkbox"
                                            value={day}
                                            {...register("operatingDays")}
                                        />
                                        {day}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Business Documents */}
                    <section className="space-y-4 ">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <FileText className="text-purple-600" size={26} />
                            Business Documents
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputField
                                label="GST Number"
                                name="gstNumber"
                                register={register}
                                required="GST required"
                                error={errors.gstNumber}
                                placeholder="Enter GST number"
                            />

                            <InputField
                                label="Registration Number (Optional)"
                                name="registrationNumber"
                                register={register}
                                placeholder="Enter registration number"
                            />

                            <FileUpload
                                label="Aadhar/PAN/Voter ID Document"
                                name="idDocument"
                                register={register}
                                setValue={setValue}
                            />

                            <FileUpload
                                label="Agreement Document"
                                name="agreementDocument"
                                register={register}
                                setValue={setValue}
                            />
                        </div>
                    </section>

                    {/* Banking Information */}
                    <section className="space-y-4 ">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <CreditCard
                                className="text-purple-600"
                                size={26}
                            />
                            Banking Information
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <InputField
                                label="Bank Account Number"
                                name="accountNumber"
                                register={register}
                                required="Account number required"
                                error={errors.accountNumber}
                                placeholder="Enter account number"
                            />

                            <InputField
                                label="IFSC Code"
                                name="ifsc"
                                register={register}
                                required="IFSC required"
                                error={errors.ifsc}
                                placeholder="Enter IFSC code"
                            />

                            <InputField
                                label="UPI ID (Optional)"
                                name="upiId"
                                register={register}
                                placeholder="Enter UPI ID"
                            />
                        </div>
                    </section>

                    {/* Media & Images */}
                    <section className="space-y-4 ">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Image className="text-purple-600" size={26} />
                            Media & Images
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FileUpload
                                label="Vendor Logo"
                                name="vendorLogo"
                                register={register}
                                setValue={setValue}
                            />

                            <FileUpload
                                label="Shop Front Images (Multiple)"
                                name="shopImages"
                                register={register}
                                setValue={setValue}
                                multiple
                            />

                            <FileUpload
                                label="Menu Images (Multiple)"
                                name="menuImages"
                                register={register}
                                setValue={setValue}
                                multiple
                            />

                            <FileUpload
                                label="Interior Photo"
                                name="interiorPhoto"
                                register={register}
                                setValue={setValue}
                            />
                        </div>
                    </section>

                    {/* Terms */}
                    <section className="-mt-7">
                        <label className="flex items-center gap-2">
                            <input
                                className="mt-1"
                                type="checkbox"
                                {...register("terms", {
                                    required: "You must accept terms",
                                })}
                            />
                            I agree to the terms and conditions.
                        </label>
                        {errors.terms && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.terms.message}
                            </p>
                        )}
                    </section>

                    {/* Submit */}
                    <div className="">
                        <button
                            type="submit"
                            className="w-full px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                        >
                            Create Vendor
                            <CheckCircle2 size={20} />
                        </button>
                    </div>
                </form>
            </div>

            {isSubmitted && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2
                                    size={32}
                                    className="text-green-600"
                                />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-center mb-2">
                            Vendor Created!
                        </h3>
                        <p className="text-slate-600 text-center text-sm">
                            Vendor has been successfully created.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

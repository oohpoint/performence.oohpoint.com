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
    Phone,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

export default function VendorEditPage() {
    const router = useRouter();
    const { id } = useParams();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
        reset: resetForm,
    } = useForm();

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [previewLogo, setPreviewLogo] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const selectedCategory = watch("category");

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                setIsLoading(true);
                setErrorMessage("");
                const res = await fetch(`/api/vendor/${id}`);
                const data = await res.json();

                if (data.success || data) {
                    const vendor = data.data || data;
                    setPreviewLogo(vendor.media?.logo || vendor.vendorLogo || "");

                    resetForm({
                        businessName: vendor.businessName || "",
                        ownerName: vendor.ownerName || "",
                        category: vendor.category || vendor.businessCategory || "",
                        subcategory: vendor.subcategory || vendor.businessSubCategory || "",
                        email: vendor.contact?.email || vendor.email || "",
                        phone: vendor.contact?.phone || vendor.phoneNumber || vendor.phone || "",
                        whatsapp: vendor.contact?.whatsapp || vendor.whatsapp || "",
                        address: vendor.location?.address || vendor.address || "",
                        latitude: vendor.location?.latitude || "",
                        longitude: vendor.location?.longitude || "",
                        gstNumber: vendor.documents?.gstNumber || vendor.gstNumber || "",
                        registrationNumber: vendor.documents?.registrationNumber || vendor.registrationNumber || "",
                        status: vendor.status || "Pending",
                        accountNumber: vendor.banking?.accountNumber || vendor.accountNumber || "",
                        upiId: vendor.banking?.upiId || vendor.upiId || "",
                        ifsc: vendor.banking?.ifsc || vendor.ifsc || "",
                        openingHours: vendor.businessHours?.openingHours || vendor.openingHours || "",
                        closingHours: vendor.businessHours?.closingHours || vendor.closingHours || "",
                    });
                } else {
                    setErrorMessage("Failed to load vendor data");
                }
            } catch (error) {
                console.error("Failed to fetch vendor:", error);
                setErrorMessage("Failed to load vendor data");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchVendor();
        }
    }, [id, resetForm]);

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

            formData.append("businessName", data.businessName || "");
            formData.append("ownerName", data.ownerName || "");
            formData.append("category", data.category || "");
            formData.append("subcategory", data.subcategory || "");
            formData.append("email", data.email || "");
            formData.append("phone", data.phone || "");
            formData.append("whatsapp", data.whatsapp || "");
            formData.append("address", data.address || "");
            formData.append("latitude", data.latitude || "");
            formData.append("longitude", data.longitude || "");
            formData.append("gstNumber", data.gstNumber || "");
            formData.append("registrationNumber", data.registrationNumber || "");
            formData.append("status", data.status || "Pending");
            formData.append("accountNumber", data.accountNumber || "");
            formData.append("upiId", data.upiId || "");
            formData.append("ifsc", data.ifsc || "");
            formData.append("openingHours", data.openingHours || "");
            formData.append("closingHours", data.closingHours || "");

            if (data.vendorLogo instanceof FileList && data.vendorLogo.length > 0) {
                formData.append("vendorLogo", data.vendorLogo[0]);
            }

            const res = await fetch(`/api/vendor/${id}/edit`, {
                method: "PUT",
                body: formData,
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Failed to update vendor");
            }

            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
                router.push(`/vendor/${id}`);
            }, 2000);
        } catch (error) {
            console.error("Vendor update error:", error);
            setErrorMessage(error.message || "Failed to update vendor");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 text-sm">Loading vendor details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {errorMessage && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Vendor Information */}
                    <FormSection
                        title="Vendor Information"
                        description="Update your business details and basic information"
                        icon={Building2}
                    >
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <InputField
                                    label="Vendor Name"
                                    name="businessName"
                                    register={register}
                                    required="Vendor name is required"
                                    error={errors.businessName}
                                    icon={<Building2 size={18} />}
                                    placeholder="Enter your vendor name"
                                />

                                <InputField
                                    label="Owner Name"
                                    name="ownerName"
                                    register={register}
                                    required="Owner name is required"
                                    error={errors.ownerName}
                                    icon={<User size={18} />}
                                    placeholder="Enter owner name"
                                />

                                <SelectField
                                    label="Category"
                                    name="category"
                                    register={register}
                                    required="Category is required"
                                    options={[
                                        "Restaurant",
                                        "Café",
                                        "Salon",
                                        "Gym",
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
                                    placeholder="Enter subcategory"
                                    icon={<Building2 size={18} />}
                                />
                            </div>

                            {/* Logo Upload Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <label className="block text-sm font-semibold text-gray-900 mb-4">
                                    Vendor Logo
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

                                    <div>
                                        <FileUpload
                                            label="Upload New Logo"
                                            name="vendorLogo"
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

                    {/* Contact Information */}
                    <FormSection
                        title="Contact Information"
                        description="Update contact details for your business"
                        icon={Mail}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputField
                                label="Email"
                                name="email"
                                type="email"
                                register={register}
                                required="Email is required"
                                error={errors.email}
                                placeholder="Enter email address"
                                icon={<Mail size={18} />}
                            />

                            <InputField
                                label="Phone"
                                name="phone"
                                register={register}
                                required="Phone is required"
                                error={errors.phone}
                                placeholder="Enter phone number"
                                icon={<Phone size={18} />}
                            />

                            <InputField
                                label="WhatsApp"
                                name="whatsapp"
                                register={register}
                                placeholder="Enter WhatsApp number"
                                icon={<Phone size={18} />}
                            />
                        </div>
                    </FormSection>

                    {/* Location Information */}
                    <FormSection
                        title="Location Information"
                        description="Update your business location and coordinates"
                        icon={MapPin}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputField
                                label="Address"
                                name="address"
                                register={register}
                                required="Address is required"
                                error={errors.address}
                                placeholder="Enter full address"
                                icon={<MapPin size={18} />}
                            />

                            <InputField
                                label="Latitude"
                                name="latitude"
                                type="number"
                                register={register}
                                placeholder="Enter latitude"
                                icon={<MapPin size={18} />}
                            />

                            <InputField
                                label="Longitude"
                                name="longitude"
                                type="number"
                                register={register}
                                placeholder="Enter longitude"
                                icon={<MapPin size={18} />}
                            />
                        </div>
                    </FormSection>

                    {/* Business Documents */}
                    <FormSection
                        title="Business Documents"
                        description="Manage your business documentation and compliance"
                        icon={FileText}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputField
                                label="GST Number"
                                name="gstNumber"
                                register={register}
                                placeholder="Enter GST number"
                                icon={<FileText size={18} />}
                            />

                            <InputField
                                label="Registration Number"
                                name="registrationNumber"
                                register={register}
                                placeholder="Enter registration number"
                                icon={<FileText size={18} />}
                            />

                            <SelectField
                                label="Vendor Status"
                                name="status"
                                register={register}
                                required="Status is required"
                                options={["Active", "Inactive", "Pending"]}
                                error={errors.status}
                            />
                        </div>
                    </FormSection>

                    {/* Banking Information */}
                    <FormSection
                        title="Banking Information"
                        description="Update banking details for payments"
                        icon={DollarSign}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputField
                                label="Account Number"
                                name="accountNumber"
                                register={register}
                                placeholder="Enter account number"
                                icon={<DollarSign size={18} />}
                            />

                            <InputField
                                label="IFSC Code"
                                name="ifsc"
                                register={register}
                                placeholder="Enter IFSC code"
                                icon={<DollarSign size={18} />}
                            />

                            <InputField
                                label="UPI ID"
                                name="upiId"
                                register={register}
                                placeholder="Enter UPI ID"
                                icon={<DollarSign size={18} />}
                            />
                        </div>
                    </FormSection>

                    {/* Business Hours */}
                    <FormSection
                        title="Business Hours"
                        description="Set your business operating hours"
                        icon={Globe}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputField
                                label="Opening Hours"
                                name="openingHours"
                                type="time"
                                register={register}
                                placeholder="Enter opening time"
                                icon={<Globe size={18} />}
                            />

                            <InputField
                                label="Closing Hours"
                                name="closingHours"
                                type="time"
                                register={register}
                                placeholder="Enter closing time"
                                icon={<Globe size={18} />}
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
                            Vendor Updated!
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
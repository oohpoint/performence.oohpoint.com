import { db, storage } from "@/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function PUT(request, { params }) {
    try {
        const { id } = await params;

        if (!id) {
            return Response.json(
                { success: false, message: "Vendor ID is required" },
                { status: 400 }
            );
        }

        const formData = await request.formData();

        const updateData = {
            businessName: formData.get("businessName") || "",
            ownerName: formData.get("ownerName") || "",
            category: formData.get("category") || "",
            subcategory: formData.get("subcategory") || "",
            status: formData.get("status") || "Pending",
            contact: {
                email: formData.get("email") || "",
                phone: formData.get("phone") || "",
                whatsapp: formData.get("whatsapp") || "",
            },
            location: {
                address: formData.get("address") || "",
                latitude: parseFloat(formData.get("latitude")) || 0,
                longitude: parseFloat(formData.get("longitude")) || 0,
            },
            documents: {
                gstNumber: formData.get("gstNumber") || "",
                registrationNumber: formData.get("registrationNumber") || "",
            },
            banking: {
                accountNumber: formData.get("accountNumber") || "",
                upiId: formData.get("upiId") || "",
                ifsc: formData.get("ifsc") || "",
            },
            businessHours: {
                openingHours: formData.get("openingHours") || "",
                closingHours: formData.get("closingHours") || "",
            },
            updatedAt: new Date(),
        };

        const logoFile = formData.get("vendorLogo");

        if (logoFile && logoFile.size > 0) {
            const fileName = `vendors/logo/${Date.now()}-${logoFile.name}`;
            const storageRef = ref(storage, fileName);
            const arrayBuffer = await logoFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            await uploadBytes(storageRef, buffer, {
                contentType: logoFile.type,
            });

            const downloadUrl = await getDownloadURL(storageRef);

            updateData.media = {
                ...updateData.media,
                logo: downloadUrl,
            };
        }

        const vendorRef = doc(db, "vendors", id);
        const vendorSnap = await getDoc(vendorRef);

        if (!vendorSnap.exists()) {
            return Response.json(
                { success: false, message: "Vendor not found" },
                { status: 404 }
            );
        }

        await updateDoc(vendorRef, updateData);

        const updatedVendorSnap = await getDoc(vendorRef);
        const updatedVendorData = updatedVendorSnap.data();

        return Response.json(
            {
                success: true,
                message: "Vendor updated successfully",
                data: { id: updatedVendorSnap.id, ...updatedVendorData },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating vendor:", error);
        return Response.json(
            { success: false, message: error.message || "Failed to update vendor" },
            { status: 500 }
        );
    }
}
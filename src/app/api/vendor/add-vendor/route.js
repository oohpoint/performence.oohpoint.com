import { NextResponse } from "next/server";
import { db, storage } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function POST(req) {
    try {
        const formData = await req.formData();

        // Helper to upload single file
        const uploadFile = async (file, path) => {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const storageRef = ref(storage, path);
            await uploadBytes(storageRef, buffer, {
                contentType: file.type,
            });

            return await getDownloadURL(storageRef);
        };

        // Helper for multiple files
        const uploadMultiple = async (files, folder) => {
            const urls = [];
            for (const file of files) {
                const url = await uploadFile(
                    file,
                    `${folder}/${Date.now()}-${file.name}`
                );
                urls.push(url);
            }
            return urls;
        };

        // ===== Extract fields =====
        const businessName = formData.get("businessName");
        const ownerName = formData.get("ownerName");
        const category = formData.get("category");
        const subcategory = formData.get("subcategory");
        const customCategory = formData.get("customCategory");

        const phone = formData.get("phone");
        const whatsapp = formData.get("whatsapp");
        const email = formData.get("email");
        const password = formData.get("password");

        const address = formData.get("address");
        const latitude = formData.get("latitude");
        const longitude = formData.get("longitude");

        const openingHours = formData.get("openingHours");
        const closingHours = formData.get("closingHours");
        const operatingDays = formData.getAll("operatingDays");

        const gstNumber = formData.get("gstNumber");
        const registrationNumber = formData.get("registrationNumber");

        const accountNumber = formData.get("accountNumber");
        const ifsc = formData.get("ifsc");
        const upiId = formData.get("upiId");

        // ===== Files =====
        const vendorLogo = formData.get("vendorLogo");
        const interiorPhoto = formData.get("interiorPhoto");
        const idDocument = formData.get("idDocument");
        const agreementDocument = formData.get("agreementDocument");

        const shopImages = formData.getAll("shopImages");
        const menuImages = formData.getAll("menuImages");

        // ===== Upload files =====
        let logoUrl = "";
        let interiorUrl = "";
        let idDocUrl = "";
        let agreementUrl = "";
        let shopImageUrls = [];
        let menuImageUrls = [];

        if (vendorLogo && vendorLogo.size > 0) {
            logoUrl = await uploadFile(
                vendorLogo,
                `vendors/logo/${Date.now()}-${vendorLogo.name}`
            );
        }

        if (interiorPhoto && interiorPhoto.size > 0) {
            interiorUrl = await uploadFile(
                interiorPhoto,
                `vendors/interior/${Date.now()}-${interiorPhoto.name}`
            );
        }

        if (idDocument && idDocument.size > 0) {
            idDocUrl = await uploadFile(
                idDocument,
                `vendors/docs/${Date.now()}-${idDocument.name}`
            );
        }

        if (agreementDocument && agreementDocument.size > 0) {
            agreementUrl = await uploadFile(
                agreementDocument,
                `vendors/agreement/${Date.now()}-${agreementDocument.name}`
            );
        }

        if (shopImages && shopImages.length > 0) {
            shopImageUrls = await uploadMultiple(
                shopImages,
                "vendors/shop"
            );
        }

        if (menuImages && menuImages.length > 0) {
            menuImageUrls = await uploadMultiple(
                menuImages,
                "vendors/menu"
            );
        }

        // ===== Save to Firestore =====
        const docRef = await addDoc(collection(db, "vendors"), {
            businessName,
            ownerName,
            category: category === "Other" ? customCategory : category,
            subcategory,

            contact: {
                phone,
                whatsapp,
                email,
                password,
            },

            location: {
                address,
                latitude: Number(latitude),
                longitude: Number(longitude),
            },

            businessHours: {
                openingHours,
                closingHours,
                operatingDays,
            },

            documents: {
                gstNumber,
                registrationNumber,
                idDocument: idDocUrl,
                agreementDocument: agreementUrl,
            },

            banking: {
                accountNumber,
                ifsc,
                upiId,
            },

            media: {
                logo: logoUrl,
                interiorPhoto: interiorUrl,
                shopImages: shopImageUrls,
                menuImages: menuImageUrls,
            },

            createdAt: serverTimestamp(),
        });

        return NextResponse.json({
            success: true,
            id: docRef.id,
            message: "Vendor created successfully",
        });
    } catch (error) {
        console.error("Vendor API Error:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";
import {
    collection,
    addDoc,
    updateDoc,
    serverTimestamp,
    query,
    where,
    limit,
    getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase";

export async function POST(req) {
    try {
        const formData = await req.formData();

        const brandName = formData.get("brandName");
        let industryType = formData.get("brandCategory");
        const customCategory = formData.get("customCategory");

        if (industryType === "Other" && customCategory) {
            industryType = customCategory;
        }

        const website = formData.get("website");
        const city = formData.get("city");
        const gst = formData.get("gst");
        const status = formData.get("status");
        const monthlySpend = formData.get("monthlySpend");

        const pocName = formData.get("pocName");
        const pocEmail = formData.get("pocEmail");
        const pocPassword = formData.get("pocPassword");
        const brandLogo = formData.get("brandLogo");

        let imageUrl = "";

        // Handle file upload if a logo is provided
        if (brandLogo && brandLogo.size > 0) {
            const bytes = await brandLogo.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const storageRef = ref(
                storage,
                `brands/${Date.now()}-${brandLogo.name}`
            );

            await uploadBytes(storageRef, buffer, {
                contentType: brandLogo.type,
            });

            imageUrl = await getDownloadURL(storageRef);
        }

        // Check for duplicate email
        const emailQuery = query(
            collection(db, "brands"),
            where("poc.email", "==", pocEmail),
            limit(1)
        );

        const emailSnapshot = await getDocs(emailQuery);

        if (!emailSnapshot.empty) {
            return NextResponse.json(
                { success: false, message: "Email already exists" },
                { status: 400 }
            );
        }



        // 1️⃣ Create document
        const docRef = await addDoc(collection(db, "brands"), {
            brandName,
            industryType,
            website,
            city,
            gst,
            status,
            adBudget: Number(monthlySpend) || 0,
            imageUrl,
            poc: {
                name: pocName,
                email: pocEmail,
                password: pocPassword,
            },
            createdAt: serverTimestamp(),
        });

        // 2️⃣ Store uid = document ID
        await updateDoc(docRef, {
            uid: docRef.id,
        });

        return NextResponse.json(
            { success: true, uid: docRef.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Brand API Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create brand" },
            { status: 500 }
        );
    }
}

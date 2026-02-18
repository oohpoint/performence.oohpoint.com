import { db } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Brand ID is required",
                },
                { status: 400 }
            );
        }

        const brandRef = doc(db, "brands", id);
        const brandSnapshot = await getDoc(brandRef);

        if (!brandSnapshot.exists()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Brand not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                id: brandSnapshot.id,
                ...brandSnapshot.data(),
            },
        });
    } catch (error) {
        console.error("Error fetching brand:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}


export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const { campaignId, data } = await req.json();

        const brandRef = doc(db, "brands", id);

        const updatePayload = {};
        Object.keys(data).forEach((key) => {
            updatePayload[`campaigns.${campaignId}.${key}`] = data[key];
        });

        await updateDoc(brandRef, updatePayload);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}


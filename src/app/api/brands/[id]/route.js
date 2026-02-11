// app/api/brands/[id]/route.ts
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
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


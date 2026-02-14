import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";



export async function GET(request, { params }) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Vendor ID is required",
                },
                { status: 400 }
            );
        }

        const vendorRef = doc(db, "vendors", id);
        const vendorSnapshot = await getDoc(vendorRef);

        if (!vendorSnapshot.exists()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Vendor not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                id: vendorSnapshot.id,
                ...vendorSnapshot.data(),
            },
        })


    } catch (error) {
        console.error("Error fetching vendor:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}
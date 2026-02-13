import { db } from "@/firebase";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Location ID is required",
                },
                { status: 400 }
            );
        }

        const locationRef = doc(db, "locations", id);
        const locationSnapshot = await getDoc(locationRef);

        if (!locationSnapshot.exists()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Location not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                id: locationSnapshot.id,
                ...locationSnapshot.data(),
            },
        });
    } catch (error) {
        console.error("Error fetching location:", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}




export async function DELETE(
    req,
    { params }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Location ID is required" },
                { status: 400 }
            );
        }

        const locationRef = doc(db, "locations", id);
        await deleteDoc(locationRef);

        return NextResponse.json(
            { success: true, message: "Location deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete location" },
            { status: 500 }
        );
    }
}

import { db } from "@/firebase";
import { getDoc, updateDoc, serverTimestamp, doc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        console.log(body)

        const ref = doc(db, "locations", id);

        await updateDoc(ref, {
            ...body,
            updated_at: serverTimestamp(),
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Failed to update location" },
            { status: 500 }
        );
    }
}

export async function GET(req, { params }) {
    try {
        const { id } = params;

        const locationRef = doc(db, "locations", id);
        const locationSnapshot = await getDoc(locationRef);

        if (!locationSnapshot.exists()) {
            return NextResponse.json(
                { success: false, message: "Location not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                ...locationSnapshot.data(),
                id: locationSnapshot.id,
            },
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = params;

        const locationRef = doc(db, "locations", id);
        const locationSnapshot = await getDoc(locationRef);

        if (!locationSnapshot.exists()) {
            return NextResponse.json(
                { success: false, error: "Location not found" },
                { status: 404 }
            );
        }

        await updateDoc(locationRef, {
            status: "Deleted",
            updated_at: serverTimestamp(),
        });

        return NextResponse.json({
            success: true,
            message: "Location marked as Deleted",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

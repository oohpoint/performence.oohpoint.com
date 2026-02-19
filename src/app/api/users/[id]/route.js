import { db } from "@/firebase"; // your firebase config
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        if (!id) {
            return NextResponse.json(
                { message: "User ID is required" },
                { status: 400 }
            );
        }

        const userRef = doc(db, "users", id);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            id: userSnap.id,
            ...userSnap.data(),
        });
    } catch (error) {
        console.error("GET USER ERROR:", error);
        return NextResponse.json(
            { message: "Failed to fetch user" },
            { status: 500 }
        );
    }
}

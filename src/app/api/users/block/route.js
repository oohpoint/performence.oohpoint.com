// app/api/users/block/route.ts
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    try {
        const body = await req.json();
        const { id, isBlocked } = body;

        if (!id || typeof isBlocked !== "boolean") {
            return NextResponse.json(
                { success: false, message: "Invalid payload: id and isBlocked(boolean) required" },
                { status: 400 }
            );
        }

        const userRef = doc(db, "users", id);
        await updateDoc(userRef, { isBlocked });

        return NextResponse.json({
            success: true,
            message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
            data: { id, isBlocked },
        });
    } catch (error) {
        console.error("Update isBlocked Error →", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

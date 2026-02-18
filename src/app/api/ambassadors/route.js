import { db } from "@/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";


// GET - Fetch ambassadors of a location
export async function GET(req, { params }) {
    try {
        const { locationId } = await params;

        const docRef = doc(db, "locations", locationId);
        const snapshot = await getDoc(docRef);

        if (!snapshot.exists()) {
            return NextResponse.json({ success: true, ambassador: null });
        }

        return NextResponse.json({
            success: true,
            ambassador: snapshot.data().ambassador || null,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}


export async function POST(req) {
    try {
        const body = await req.json();
        const { locationId, ...rest } = body;

        if (!locationId) {
            return NextResponse.json(
                { success: false, message: "locationId is required" },
                { status: 400 }
            );
        }

        const docRef = doc(db, "locations", locationId);

        await setDoc(
            docRef,
            {
                ambassador: {
                    ...rest,
                    createdAt: serverTimestamp(),
                },
            },
            { merge: true }
        );

        const newDoc = await getDoc(docRef);

        return NextResponse.json({
            success: true,
            message: "Ambassador added successfully",
            ambassador: { id: docRef.id, ...newDoc.data() }
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}

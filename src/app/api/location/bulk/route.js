import { db } from "@/firebase";
import {
    collection,
    doc,
    writeBatch,
    serverTimestamp,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const locations = body.locations;

        if (!Array.isArray(locations)) {
            return NextResponse.json(
                { error: "locations must be an array" },
                { status: 400 }
            );
        }

        const batch = writeBatch(db);
        const locationsRef = collection(db, "locations");

        locations.forEach((loc) => {
            const docId =
                loc.location_id && loc.location_id !== "aut-gen"
                    ? loc.location_id
                    : doc(locationsRef).id; // auto generate if needed

            const ref = doc(db, "locations", docId);

            batch.set(ref, {
                ...loc,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                geo: {
                    lat: loc.latitude,
                    lng: loc.longitude,
                },
            });
        });

        await batch.commit();

        return NextResponse.json({
            success: true,
            count: locations.length,
            message: "Locations uploaded successfully",
        });
    } catch (error) {
        console.error("Bulk upload error:", error);
        return NextResponse.json(
            { error: "Failed to upload locations" },
            { status: 500 }
        );
    }
}

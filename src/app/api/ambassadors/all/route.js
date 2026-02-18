// app/api/location/route.ts
import { NextResponse } from "next/server";
import { db } from "@/firebase"
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET(req) {
    try {
        const snapshot = await getDocs(collection(db, "locations"));

        const locations = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const ambassadorsSnap = await getDocs(
                    collection(db, "locations", doc.id, "ambassadors")
                );

                return {
                    id: doc.id,
                    ...doc.data(),
                    ambassadors: ambassadorsSnap.docs.map(a => ({
                        id: a.id,
                        ...a.data(),
                    })),
                };
            })
        );

        return NextResponse.json(
            {
                success: true,
                locations,
                count: locations.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Location fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch locations",
            },
            { status: 500 }
        );
    }
}

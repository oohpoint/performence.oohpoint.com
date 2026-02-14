// app/api/vendor/route.js
import { NextResponse } from "next/server";
import { db } from "@/firebase";
import {
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit,
    startAfter,
} from "firebase/firestore";

export async function GET(req) {
    try {
        const searchParams = req.nextUrl.searchParams;

        const pageLimit = parseInt(searchParams.get("limit")) || 10;
        const lastDocId = searchParams.get("lastDocId") || null;
        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "";
        const city = searchParams.get("city") || "";
        const status = searchParams.get("status") || "";

        let baseQuery = collection(db, "vendors");

        const constraints = [];

        if (category) constraints.push(where("category", "==", category));
        if (city) constraints.push(where("city", "==", city));
        if (status) constraints.push(where("status", "==", status));

        constraints.push(orderBy("createdAt", "desc"));
        constraints.push(limit(pageLimit));

        let q = query(baseQuery, ...constraints);

        // Pagination
        if (lastDocId) {
            const lastDocSnap = await getDocs(
                query(baseQuery, orderBy("createdAt", "desc"))
            );

            const lastVisible = lastDocSnap.docs.find((d) => d.id === lastDocId);
            if (lastVisible) {
                q = query(baseQuery, ...constraints, startAfter(lastVisible));
            }
        }

        const snapshot = await getDocs(q);

        let vendors = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Client-side search (name/email/phone)
        if (search) {
            const term = search.toLowerCase();
            vendors = vendors.filter((v) =>
                [v.businessName, v.ownerName, v.email, v.phone]
                    .filter(Boolean)
                    .some((field) => field.toLowerCase().includes(term))
            );
        }

        return NextResponse.json({
            vendors,
            lastDocId: snapshot.docs.length
                ? snapshot.docs[snapshot.docs.length - 1].id
                : null,
            hasMore: snapshot.docs.length === pageLimit,
        });
    } catch (error) {
        console.error("GET /api/vendor error:", error);
        return NextResponse.json(
            { message: "Failed to fetch vendors" },
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";
import { db } from "@/firebase";
import {
    collection,
    getDocs,
    query,
    where,
    limit as limitFn,
    doc,
    deleteDoc,
} from "firebase/firestore";

// GET BRANDS + FILTERS + SEARCH
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const action = searchParams.get("action");

        // Action: Get distinct industries
        if (action === "industries") {
            const snapshot = await getDocs(collection(db, "brands"));
            const brands = snapshot.docs.map((doc) => doc.data());

            const industries = [
                ...new Set(
                    brands
                        .map((brand) => brand.industryType)
                        .filter((type) => type && type.trim())
                ),
            ]
                .sort()
                .map((name, idx) => ({
                    id: idx + 1,
                    name,
                }));

            return NextResponse.json(
                {
                    success: true,
                    industries,
                },
                { status: 200 }
            );
        }

        // Action: Get distinct locations
        if (action === "locations") {
            const snapshot = await getDocs(collection(db, "brands"));
            const brands = snapshot.docs.map((doc) => doc.data());

            const locations = [
                ...new Set(
                    brands
                        .map((brand) => brand.targetLocation)
                        .filter((location) => location && location.trim())
                ),
            ]
                .sort()
                .map((name, idx) => ({
                    id: idx + 1,
                    name,
                }));

            return NextResponse.json(
                {
                    success: true,
                    locations,
                },
                { status: 200 }
            );
        }

        // Default action: Get brands list with filters
        const search = searchParams.get("search");
        const industryType = searchParams.get("industryType");
        const isVerified = searchParams.get("isVerified");
        const targetLocation = searchParams.get("targetLocation");
        const limit = Number(searchParams.get("limit")) || 20;

        const filters = [];

        if (industryType && industryType.trim()) {
            filters.push(where("industryType", "==", industryType));
        }

        if (targetLocation && targetLocation.trim()) {
            filters.push(where("targetLocation", "==", targetLocation));
        }

        if (isVerified !== null && isVerified !== "") {
            filters.push(where("isVerified", "==", isVerified === "true"));
        }

        // Build query without orderBy to avoid index requirement
        let q;
        if (filters.length > 0) {
            q = query(
                collection(db, "brands"),
                ...filters,
                limitFn(limit)
            );
        } else {
            q = query(
                collection(db, "brands"),
                limitFn(limit)
            );
        }

        const snapshot = await getDocs(q);

        let brands = snapshot.docs.map((doc) => {
            const data = doc.data();

            delete data.password;
            delete data.gstNumber;
            delete data.uid;

            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.() || new Date(),
            };
        });

        // Client-side sorting (instead of server-side)
        brands.sort((a, b) => {
            const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
            const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
            return dateB - dateA; // desc order
        });

        // Client-side search
        if (search && search.trim()) {
            const keyword = search.toLowerCase();
            brands = brands.filter(
                (brand) =>
                    brand.brandName?.toLowerCase().includes(keyword) ||
                    brand.businessName?.toLowerCase().includes(keyword) ||
                    brand.email?.toLowerCase().includes(keyword)
            );
        }

        return NextResponse.json(
            {
                success: true,
                count: brands.length,
                brands: brands.map((brand) => ({
                    ...brand,
                    adBudget: brand.adBudget || 0,
                    defaultCPVE: brand.defaultCPVE || "N/A",
                })),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET Brands Error →", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch brands",
                error: error.message,
            },
            { status: 500 }
        );
    }
}

// DELETE/ARCHIVE BRAND
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const brandId = searchParams.get("id");

        if (!brandId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Brand ID is required",
                },
                { status: 400 }
            );
        }

        const brandRef = doc(db, "brands", brandId);
        await deleteDoc(brandRef);

        return NextResponse.json(
            {
                success: true,
                message: "Brand archived successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE Brands Error →", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to archive brand",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
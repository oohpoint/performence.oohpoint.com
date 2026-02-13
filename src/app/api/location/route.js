// app/api/location/route.ts
import { NextResponse } from "next/server";
import { db } from "@/firebase"
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET(req) {
    try {
        const searchParams = req.nextUrl.searchParams;

        // Get all filter parameters
        const search = searchParams.get("search");
        const locationTypes = searchParams.getAll("locationType");
        const statuses = searchParams.getAll("status");
        const cities = searchParams.getAll("city");
        const campus_types = searchParams.getAll("campus_type");
        const college_types = searchParams.getAll("college_type");
        const education_levels = searchParams.getAll("education_level");
        const footfall_levels = searchParams.getAll("footfall_level");
        const gender_skews = searchParams.getAll("gender_skew");
        const primary_audiences = searchParams.getAll("primary_audience");
        const age_bands = searchParams.getAll("age_band");
        const areas = searchParams.getAll("area");

        let q = query(collection(db, "locations"));
        const constraints = [];

        // Build dynamic query constraints
        if (locationTypes.length > 0) {
            constraints.push(
                where("location_type", "in", locationTypes)
            );
        }

        if (statuses.length > 0) {
            constraints.push(where("status", "in", statuses));
        }

        if (cities.length > 0) {
            constraints.push(where("city", "in", cities));
        }

        if (campus_types.length > 0) {
            constraints.push(where("campus_type", "in", campus_types));
        }

        if (college_types.length > 0) {
            constraints.push(where("college_type", "in", college_types));
        }

        if (education_levels.length > 0) {
            constraints.push(
                where("education_level", "in", education_levels)
            );
        }

        if (footfall_levels.length > 0) {
            constraints.push(where("footfall_level", "in", footfall_levels));
        }

        if (gender_skews.length > 0) {
            constraints.push(where("gender_skew", "in", gender_skews));
        }

        if (primary_audiences.length > 0) {
            constraints.push(
                where("primary_audience", "in", primary_audiences)
            );
        }

        if (age_bands.length > 0) {
            constraints.push(where("age_band", "in", age_bands));
        }

        if (areas.length > 0) {
            constraints.push(where("area", "in", areas));
        }

        // Build query with all constraints
        if (constraints.length > 0) {
            q = query(collection(db, "locations"), ...constraints);
        }

        // Execute query
        const snapshot = await getDocs(q);
        let locations = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Client-side search (for location_name, which requires text search)
        if (search) {
            const searchLower = search.toLowerCase();
            locations = locations.filter(
                (loc) =>
                    loc.location_name?.toLowerCase().includes(searchLower) ||
                    loc.city?.toLowerCase().includes(searchLower) ||
                    loc.area?.toLowerCase().includes(searchLower)
            );
        }

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


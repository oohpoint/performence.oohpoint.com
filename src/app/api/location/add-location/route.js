import { NextResponse } from "next/server";
import { db } from "@/firebase";
import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp,
    limit,
    startAfter,
    GeoPoint,
} from "firebase/firestore";

/* ===========================
   Utility Functions
=========================== */

function generateSlug(name = "") {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
}

function validateLocation(body) {
    const requiredFields = [
        "location_name",
        "location_type",
        "city",
        "latitude",
        "longitude",
        "primary_audience",
        "age_band",
        "footfall_level",
    ];

    for (const field of requiredFields) {
        if (!body[field]) {
            return `${field} is required`;
        }
    }

    if (isNaN(parseFloat(body.latitude))) {
        return "Invalid latitude";
    }

    if (isNaN(parseFloat(body.longitude))) {
        return "Invalid longitude";
    }

    return null;
}

/* ===========================
   CREATE LOCATION
=========================== */

export async function POST(req) {
    try {
        const body = await req.json();

        // 1️⃣ Validate input
        const validationError = validateLocation(body);
        if (validationError) {
            return NextResponse.json(
                { success: false, message: validationError },
                { status: 400 }
            );
        }

        // 2️⃣ Sanitize & Structure Data
        const latitude = parseFloat(body.latitude);
        const longitude = parseFloat(body.longitude);

        const locationData = {
            // Core
            location_name: body.location_name.trim(),
            slug: generateSlug(body.location_name),
            location_type: body.location_type,

            // Address
            city: body.city || "",
            area: body.area || "",
            pincode: body.pincode || "",

            // Geo
            geo: new GeoPoint(latitude, longitude),
            latitude,
            longitude,
            radius: body.radius ? parseInt(body.radius) : 500,

            // Status
            status: body.status ?? "Active",
            isDeleted: false,

            // Audience (Normalized)
            audience: {
                primary: body.primary_audience,
                age_band: body.age_band,
                gender_skew: body.gender_skew || "",
                education_level: body.education_level || "",
                campus_type: body.campus_type || "",
                footfall_level: body.footfall_level,
            },

            peak_windows: body.peak_windows || [],
            low_windows: body.low_windows || [],
            avg_dwell_bucket: body.avg_dwell_bucket || "",
            nearby_vendors_type_landmark:
                body.nearby_vendors_type_landmark || "",
            restricted_categories: body.restricted_categories || [],

            // Conditional Fields
            ...(body.college_type && {
                college: {
                    type: body.college_type,
                    tags: body.college_tags || [],
                },
            }),

            ...(body.sub_location_type && {
                food_beverage: {
                    type: body.sub_location_type,
                    sub_categories: body.cafe_sub_categories || [],
                },
            }),

            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        // 3️⃣ Save to Firestore
        const docRef = await addDoc(collection(db, "locations"), locationData);

        return NextResponse.json(
            {
                success: true,
                id: docRef.id,
                message: "Location created successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create Location Error →", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create location",
            },
            { status: 500 }
        );
    }
}

/* ===========================
   LIST LOCATIONS (Paginated)
=========================== */

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const pageSize = parseInt(searchParams.get("limit")) || 10;

        const q = query(
            collection(db, "locations"),
            orderBy("createdAt", "desc"),
            limit(pageSize)
        );

        const snapshot = await getDocs(q);

        const locations = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json(
            {
                success: true,
                count: locations.length,
                locations,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Fetch Locations Error →", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch locations",
            },
            { status: 500 }
        );
    }
}

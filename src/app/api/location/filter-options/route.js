import { NextResponse } from "next/server";
import { db } from "@/firebase";
import { collection, getDocs, Query } from "firebase/firestore";

// Simple in-memory cache for filter options
const filterCache = {
    data: null,
    timestamp: 0,
    ttl: 5 * 60 * 1000, // 5 minutes
};

function isCacheValid() {
    return (
        filterCache.data !== null &&
        Date.now() - filterCache.timestamp < filterCache.ttl
    );
}

function parseMultiSelect(param) {
    if (!param) return [];
    return param
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v && v !== "undefined" && v.length > 0);
}



export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get("action");

        // Handle filter options request separately
        if (action === "filterOptions") {
            return getFilterOptions();
        }

        // Get search and filter parameters
        const search = searchParams.get("search")?.trim() || "";

        // Fetch all locations (consider pagination for large datasets)
        const locationsRef = collection(db, "locations");
        const snapshot = await getDocs(locationsRef);

        let locations = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Parse filters
        const filterMap = {
            locationType: "location_type",
            status: "status",
            city: "city",
            campusType: "campus_type",
            collegeType: "college_type",
            educationLevel: "education_level",
            footfallLevel: "footfall_level",
            genderSkew: "gender_skew",
            primaryAudience: "primary_audience",
            ageBand: "age_band",
            area: "area",
        };

        // Apply filters with AND logic between different filters, OR within same filter
        for (const [paramName, dbField] of Object.entries(filterMap)) {
            const filterValues = parseMultiSelect(
                searchParams.get(paramName) || undefined
            );

            if (filterValues.length > 0) {
                locations = locations.filter((location) => {
                    const fieldValue = location[dbField];

                    // Handle array fields
                    if (Array.isArray(fieldValue)) {
                        return filterValues.some((v) => fieldValue.includes(v));
                    }

                    // Handle string fields
                    return filterValues.includes(fieldValue);
                });
            }
        }

        // Apply search
        if (search) {
            const searchLower = search.toLowerCase();
            locations = locations.filter((loc) => {
                return (
                    loc.location_name?.toLowerCase().includes(searchLower) ||
                    loc.location_id?.toLowerCase().includes(searchLower) ||
                    loc.email?.toLowerCase().includes(searchLower) ||
                    loc.city?.toLowerCase().includes(searchLower) ||
                    loc.area?.toLowerCase().includes(searchLower)
                );
            });
        }

        // Sort by creation date (newest first)
        locations = locations.sort((a, b) => {
            const dateA =
                a.created_at?.toDate?.() ||
                a.createdAt?.toDate?.() ||
                new Date(0);
            const dateB =
                b.created_at?.toDate?.() ||
                b.createdAt?.toDate?.() ||
                new Date(0);
            return dateB.getTime() - dateA.getTime();
        });

        // Apply limit
        const limit = Math.min(parseInt(searchParams.get("limit") || "1000", 10), 1000);
        const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
        const skip = (page - 1) * limit;

        const paginatedLocations = locations.slice(skip, skip + limit);

        return NextResponse.json(
            {
                success: true,
                count: paginatedLocations.length,
                total: locations.length,
                page,
                limit,
                locations: paginatedLocations,
            },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-cache",
                },
            }
        );
    } catch (error) {
        console.error("Location fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch locations",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

/**
 * POST handler for creating a new location
 */
export async function POST(request) {
    try {
        const body = await request.json();

        // Validation would go here
        if (!body.location_name) {
            return NextResponse.json(
                { success: false, error: "Location name is required" },
                { status: 400 }
            );
        }

        // Add location logic would go here
        // Invalidate cache when adding new location
        filterCache.data = null;

        return NextResponse.json(
            { success: true, message: "Location created" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Location create error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create location" },
            { status: 500 }
        );
    }
}

/**
 * Fetch and return filter options from all locations with caching
 */
async function getFilterOptions() {
    try {
        // Return cached data if still valid
        if (isCacheValid()) {
            return NextResponse.json(
                {
                    success: true,
                    ...filterCache.data,
                    cached: true,
                },
                {
                    status: 200,
                    headers: {
                        "Cache-Control":
                            "public, s-maxage=300, stale-while-revalidate=600",
                    },
                }
            );
        }

        // Fetch all locations
        const locationsRef = collection(db, "locations");
        const snapshot = await getDocs(locationsRef);

        const filterData = {
            locationTypes: new Set(),
            statuses: new Set(),
            cities: new Set(),
            campusTypes: new Set(),
            collegeTypes: new Set(),
            educationLevels: new Set(),
            footfallLevels: new Set(),
            genderSkews: new Set(),
            primaryAudiences: new Set(),
            ageBands: new Set(),
            areas: new Set(),
        };

        // Extract unique values from all documents
        snapshot.docs.forEach((doc) => {
            const data = doc.data();

            // Add to sets (automatically removes duplicates)
            if (data.location_type) filterData.locationTypes.add(data.location_type);
            if (data.status) filterData.statuses.add(data.status);
            if (data.city) filterData.cities.add(data.city);
            if (data.campus_type) filterData.campusTypes.add(data.campus_type);
            if (data.college_type) filterData.collegeTypes.add(data.college_type);
            if (data.education_level)
                filterData.educationLevels.add(data.education_level);
            if (data.footfall_level)
                filterData.footfallLevels.add(data.footfall_level);
            if (data.gender_skew) filterData.genderSkews.add(data.gender_skew);
            if (data.primary_audience)
                filterData.primaryAudiences.add(data.primary_audience);
            if (data.age_band) filterData.ageBands.add(data.age_band);
            if (data.area) filterData.areas.add(data.area);
        });

        // Convert sets to sorted arrays
        const responseData = {
            locationTypes: Array.from(filterData.locationTypes).sort(),
            statuses: Array.from(filterData.statuses).sort(),
            cities: Array.from(filterData.cities).sort(),
            campusTypes: Array.from(filterData.campusTypes).sort(),
            collegeTypes: Array.from(filterData.collegeTypes).sort(),
            educationLevels: Array.from(filterData.educationLevels).sort(),
            footfallLevels: Array.from(filterData.footfallLevels).sort(),
            genderSkews: Array.from(filterData.genderSkews).sort(),
            primaryAudiences: Array.from(filterData.primaryAudiences).sort(),
            ageBands: Array.from(filterData.ageBands).sort(),
            areas: Array.from(filterData.areas).sort(),
        };

        // Cache the result
        filterCache.data = responseData;
        filterCache.timestamp = Date.now();

        return NextResponse.json(
            {
                success: true,
                ...responseData,
                cached: false,
            },
            {
                status: 200,
                headers: {
                    "Cache-Control":
                        "public, s-maxage=300, stale-while-revalidate=600",
                },
            }
        );
    } catch (error) {
        console.error("Filter options fetch error:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to fetch filter options",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
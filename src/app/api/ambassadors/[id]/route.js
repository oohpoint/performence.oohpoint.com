import { db } from "@/firebase";
import {
    doc,
    getDoc,
} from "firebase/firestore";

export async function GET(request, { params }) {
    try {
        const { id } = await params;

        if (!id) {
            return Response.json(
                { success: false, message: "Location ID is required" },
                { status: 400 }
            );
        }

        const locationRef = doc(db, "locations", id);
        const locationSnap = await getDoc(locationRef);

        if (!locationSnap.exists()) {
            return Response.json(
                { success: false, message: "Location not found" },
                { status: 404 }
            );
        }

        const locationData = locationSnap.data();

        // Check if ambassador exists in this location
        if (!locationData.ambassador || typeof locationData.ambassador !== 'object') {
            return Response.json(
                { success: false, message: "No ambassador found at this location" },
                { status: 404 }
            );
        }

        // Prepare ambassador data with location details
        const ambassadorData = {
            id: locationSnap.id,
            location_id: locationSnap.id,
            location_name: locationData.location_name,
            location_type: locationData.location_type,
            city: locationData.city,
            area: locationData.area,
            pincode: locationData.pincode,
            college_type: locationData.college_type,
            education_level: locationData.education_level,
            footfall_level: locationData.footfall_level,
            primary_audience: locationData.primary_audience,
            age_band: locationData.age_band,
            gender_skew: locationData.gender_skew,
            campus_type: locationData.campus_type,
            college_tags: locationData.college_tags || [],
            geo: locationData.geo || null,
            status: locationData.status,
            ambassador: {
                name: locationData.ambassador.name,
                phoneNumber: locationData.ambassador.phoneNumber,
                course: locationData.ambassador.course,
                year: locationData.ambassador.year,
                status: locationData.ambassador.status,
                createdAt: locationData.ambassador.createdAt
            },
            createdAt: locationData.createdAt,
            updatedAt: locationData.updatedAt || locationData.updated_at
        };

        return Response.json(
            { success: true, data: ambassadorData },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching ambassador:", error);
        return Response.json(
            { success: false, message: "Failed to fetch ambassador details" },
            { status: 500 }
        );
    }
}
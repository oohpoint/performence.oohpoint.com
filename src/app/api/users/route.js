import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);

        // Extract search query
        const searchQuery = searchParams.get("q")?.toLowerCase() || "";

        // Extract filters
        const ageBands = searchParams.get("ageBand")?.split(",") || [];
        const genders = searchParams.get("gender")?.split(",") || [];
        const professions = searchParams.get("profession")?.split(",") || [];
        const cities = searchParams.get("city")?.split(",") || [];
        const campuses = searchParams.get("campus")?.split(",") || [];
        const riskStatuses = searchParams.get("riskStatus")?.split(",") || [];

        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);

        let users = [];
        userSnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });

        // Apply search filter (searches in id, email, phone, name)
        if (searchQuery) {
            users = users.filter(user => {
                const searchableFields = [
                    user.id?.toLowerCase(),
                    user.email?.toLowerCase(),
                    user.phoneNumber?.toLowerCase(),
                    user.name?.toLowerCase()
                ].filter(Boolean);

                return searchableFields.some(field => field.includes(searchQuery));
            });
        }

        // Apply demographic filters
        if (ageBands.length > 0) {
            users = users.filter(user => {
                if (!user.ageBand && user.age) {
                    // Map age to age band if ageBand doesn't exist
                    const age = parseInt(user.age);
                    if (age >= 18 && age <= 21) return ageBands.includes("18-21");
                    if (age >= 22 && age <= 25) return ageBands.includes("22-25");
                    if (age >= 26 && age <= 30) return ageBands.includes("26-30");
                    if (age >= 31) return ageBands.includes("31+");
                    return false;
                }
                return ageBands.includes(user.ageBand);
            });
        }

        if (genders.length > 0) {
            users = users.filter(user => genders.includes(user.gender));
        }

        if (professions.length > 0) {
            users = users.filter(user => professions.includes(user.profession || user.lifeStage));
        }

        // Apply location filters
        if (cities.length > 0) {
            users = users.filter(user => {
                const userCity = user.city || user.address;
                return cities.some(city =>
                    userCity?.toLowerCase().includes(city.toLowerCase())
                );
            });
        }

        if (campuses.length > 0) {
            users = users.filter(user => campuses.includes(user.campus));
        }

        // Apply risk status filter
        if (riskStatuses.length > 0) {
            users = users.filter(user => {
                const isActive = !user.isBlocked;
                if (riskStatuses.includes("Active") && isActive) return true;
                if (riskStatuses.includes("Suspended") && user.isBlocked) return true;
                return false;
            });
        }

        return NextResponse.json(users);

    } catch (error) {
        console.error("GET Users Error →", error);
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}
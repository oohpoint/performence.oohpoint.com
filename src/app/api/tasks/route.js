import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

/**
 * POST /api/tasks
 * Creates a new task in Firestore
 * 
 * Request body:
 * {
 *   title: string (required)
 *   description: string
 *   taskType: string (required) - "survey", "quiz", "video_quiz", "hybrid"
 *   category: string
 *   priority: string
 *   status: string (default: "active")
 *   startDate: ISO string (required)
 *   endDate: ISO string (required)
 *   ... other fields
 * }
 */
export async function POST(request) {
    try {
        // ✅ Parse request body
        let taskData;
        try {
            taskData = await request.json();
        } catch (err) {
            return NextResponse.json(
                { error: "Invalid JSON in request body" },
                { status: 400 }
            );
        }


        // ✅ Prepare payload for Firestore
        const payload = {
            ...taskData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            status: taskData.status || "active",
        };

        // ✅ Save to Firestore
        const docRef = await addDoc(collection(db, "tasks"), payload);

        // ✅ Return success with proper HTTP status
        return NextResponse.json(
            {
                success: true,
                id: docRef.id,
                message: "Task created successfully",
            },
            { status: 201 } // 201 Created
        );
    } catch (error) {
        console.error("Firebase Create Task Error:", error);

        // Handle specific Firebase errors
        let errorMessage = "Failed to create task";

        if (error.code === "permission-denied") {
            errorMessage = "You do not have permission to create tasks";
        } else if (error.code === "internal") {
            errorMessage = "Database error - please try again later";
        } else if (error.message) {
            errorMessage = error.message;
        }

        // ✅ Return error with proper HTTP status
        return NextResponse.json(
            {
                success: false,
                error: errorMessage,
            },
            { status: 500 } // 500 Internal Server Error
        );
    }
}

/**
 * Optional: GET handler to fetch tasks
 * GET /api/tasks
 */
export async function GET() {
    return NextResponse.json(
        { error: "Use /api/tasks/[id] to fetch tasks" },
        { status: 405 } // 405 Method Not Allowed
    );
}
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, uid } = body;

        if (!email || !uid) {
            return NextResponse.json(
                { error: "Email and UID required" },
                { status: 400 }
            );
        }

        const token = Buffer.from(JSON.stringify({ email, uid, timestamp: Date.now() })).toString("base64");

        const response = NextResponse.json(
            { message: "Login successful", token },
            { status: 200 }
        );

        // Set secure cookie
        response.cookies.set("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400, // 24 hours
            path: "/",
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { error: "Login failed" },
            { status: 500 }
        );
    }
}
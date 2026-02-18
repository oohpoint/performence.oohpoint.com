import { NextResponse } from "next/server";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET(req, context) {
    try {
        // ✅ unwrap params correctly
        const { id: campaignId } = await context.params;

        const brandsSnap = await getDocs(collection(db, "brands"));

        let foundCampaign = null;

        brandsSnap.forEach((docSnap) => {
            const brandData = docSnap.data();
            const campaigns = brandData.campaigns || {};

            if (campaigns[campaignId]) {
                foundCampaign = {
                    campaignId,
                    brandId: docSnap.id,
                    brandName: brandData.name,
                    ...campaigns[campaignId],
                };
            }
        });

        if (!foundCampaign) {
            return NextResponse.json(
                { success: false, message: "Campaign not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: foundCampaign,
        });
    } catch (error) {
        console.error("Error fetching campaign:", error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

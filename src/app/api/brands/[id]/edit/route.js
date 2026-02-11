// app/api/brands/[id]/edit/route.js
import { db, storage } from "@/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ success: false, message: "Brand ID required" }, { status: 400 });
        }

        const formData = await req.formData();

        const brandRef = doc(db, "brands", id);
        const snapshot = await getDoc(brandRef);

        if (!snapshot.exists()) {
            return NextResponse.json({ success: false, message: "Brand not found" }, { status: 404 });
        }

        const existing = snapshot.data();

        const updateData = {
            updatedAt: serverTimestamp(),
        };

        const fields = [
            "brandName",
            "industryType",
            "website",
            "city",
            "gst",
            "status",
        ];

        fields.forEach((field) => {
            const val = formData.get(field);
            if (val !== null) updateData[field] = val;
        });

        const budget = Number(formData.get("adBudget"));
        updateData.adBudget = isNaN(budget) ? existing.adBudget : budget;

        updateData.isVerified =
            (updateData.status || existing.status)?.toLowerCase() === "active";

        // POC
        const poc = {};
        ["pocName", "pocEmail", "pocPassword"].forEach((k) => {
            const v = formData.get(k);
            if (v) poc[k.replace("poc", "").toLowerCase()] = v;
        });

        if (Object.keys(poc).length > 0) {
            updateData.poc = { ...existing.poc, ...poc };
        }

        // Logo upload
        const logo = formData.get("brandLogo");
        if (logo instanceof File && logo.size > 0) {
            const refPath = ref(storage, `brands/${Date.now()}-${logo.name}`);
            const buffer = Buffer.from(await logo.arrayBuffer());
            await uploadBytes(refPath, buffer, { contentType: logo.type });
            updateData.logoUrl = await getDownloadURL(refPath);
        }

        await updateDoc(brandRef, updateData);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}

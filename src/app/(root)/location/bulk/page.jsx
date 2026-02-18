"use client";

import { useState } from "react";
import { UploadCloud, FileJson, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function BulkUploadLocations() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.type === "application/json") {
            setFile(selected);
            setResult(null);
        } else {
            alert("Please upload a valid JSON file");
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        try {
            setLoading(true);
            setResult(null);

            const text = await file.text();
            const json = JSON.parse(text);

            const locationsArray = Array.isArray(json) ? json : json.locations;

            const res = await fetch("/api/location/bulk", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ locations: locationsArray }),
            });

            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            setResult({ error: "Invalid JSON or upload failed" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 m-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Bulk Upload Locations
            </h2>

            {/* Upload Box */}
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:bg-gray-50 transition">
                <UploadCloud className="text-gray-400 mb-3" size={32} />
                <p className="text-sm text-gray-600">
                    Drag & drop JSON file or click to upload
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    Upload 70+ college / transit / cafe media locations
                </p>
                <input
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </label>

            {/* Selected File */}
            {file && (
                <div className="flex items-center gap-3 mt-4 text-sm text-gray-700">
                    <FileJson size={18} className="text-indigo-500" />
                    <span>{file.name}</span>
                </div>
            )}

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="mt-5 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" size={18} />
                        Uploading...
                    </>
                ) : (
                    <>
                        <UploadCloud size={18} />
                        Upload to Firebase
                    </>
                )}
            </button>

            {/* Result */}
            {result && (
                <div className="mt-4">
                    {result.success ? (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                            <CheckCircle2 size={18} />
                            {result.count} locations uploaded successfully 🚀
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                            <AlertCircle size={18} />
                            {result.error || "Upload failed"}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

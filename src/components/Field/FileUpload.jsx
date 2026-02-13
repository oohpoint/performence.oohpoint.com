import { useState, useRef } from "react";
import { Upload } from "lucide-react";

export const FileUpload = ({ label, name, register, setValue }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState("");
    const fileRef = useRef(null);

    const handleFileChange = (file) => {
        if (file) {
            setFileName(file.name);
            // Store the file directly, not FileList
            setValue(name, file, { shouldValidate: true });
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 block">
                {label}
            </label>

            <div
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                    ${isDragging
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-300 bg-slate-50 hover:border-blue-400"
                    }`}
                onClick={() => fileRef.current?.click()}
            >
                <input
                    type="file"
                    accept="image/*"
                    {...register(name)}
                    ref={fileRef}
                    onChange={(e) => {
                        if (e.target.files?.[0]) {
                            handleFileChange(e.target.files[0]);
                        }
                    }}
                    className="hidden"
                />

                {fileName ? (
                    <p className="text-sm font-medium text-green-700">
                        ✓ {fileName}
                    </p>
                ) : (
                    <>
                        <Upload className="w-8 h-8 mx-auto text-slate-400" />
                        <p className="text-sm">Drag & drop or click to upload</p>
                    </>
                )}
            </div>
        </div>
    );
};
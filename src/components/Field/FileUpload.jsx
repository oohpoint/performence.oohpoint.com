import { useState, useRef } from "react";
import { Upload } from "lucide-react";

export const FileUpload = ({ label, name, register, setValue }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState("");
    const inputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            setFileName(files[0].name);

            // ✅ IMPORTANT: update React Hook Form
            setValue(name, files, { shouldValidate: true });
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
                onClick={() => inputRef.current?.click()}
            >
                <input
                    type="file"
                    accept="image/*"
                    {...register(name)}
                    ref={inputRef}
                    onChange={(e) => {
                        if (e.target.files?.length > 0) {
                            setFileName(e.target.files[0].name);
                        }
                    }}
                    className="hidden"
                />

                {fileName ? (
                    <p className="text-sm font-medium text-green-700">{fileName}</p>
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

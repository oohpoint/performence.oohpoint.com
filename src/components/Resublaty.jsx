"use client";
import { ChevronRight, PlusCircle } from "lucide-react";
export function ActionMenu({ isOpen, actions, menuRef }) {
    if (!isOpen) return null;

    return (
        <div
            ref={menuRef}
            className="absolute right-0 top-10 w-56 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden"
        >
            {actions.map((action, index) => (
                <button
                    key={action.label}
                    onClick={action.onClick}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors duration-150 ${index !== actions.length - 1
                        ? "border-b border-gray-100"
                        : ""
                        } ${action.isDanger
                            ? "text-red-700 hover:bg-red-50"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                >
                    <action.icon
                        size={16}
                        className={action.className || "text-gray-400"}
                    />
                    <span>{action.label}</span>
                    <ChevronRight
                        size={16}
                        className="ml-auto text-gray-400"
                    />
                </button>
            ))}
        </div>
    );
}




// components/LoadingSpinner.tsx
export function LoadingSpinner({ message = "Loading..." }) {
    return (
        <div className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-gray-600 text-sm">{message}</p>
        </div>
    );
}


// components/EmptyState.tsx
export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
}) {
    return (
        <div className="py-16 text-center">
            <Icon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-900 font-semibold mb-2">
                {title}
            </p>

            {description && (
                <p className="text-gray-600 text-sm mb-6">
                    {description}
                </p>
            )}

            {action && (
                <button
                    onClick={action.onClick}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}


// components/TableRow.tsx (Generic reusable table row)
export function TableRow({
    cells,
    onClick,
    isHoverable = true,
}) {
    return (
        <tr
            onClick={onClick}
            className={`border-b border-gray-100 ${isHoverable
                ? "hover:bg-gray-50 cursor-pointer"
                : ""
                } transition-colors duration-150 last:border-b-0`}
        >
            {cells.map((cell, idx) => (
                <td key={idx} className="px-6 py-4">
                    {cell}
                </td>
            ))}
        </tr>
    );
}


// components/Badge.tsx (Reusable status badge)
export function Badge({ label, variant = "default" }) {
    const variants = {
        default: "bg-gray-100 text-gray-700 border-gray-200",
        success: "bg-green-100 text-green-700 border-green-200",
        warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
        danger: "bg-red-100 text-red-700 border-red-200",
        info: "bg-blue-100 text-blue-700 border-blue-200",
    };

    return (
        <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-xs font-medium border ${variants[variant]}`}
        >
            {label}
        </span>
    );
}



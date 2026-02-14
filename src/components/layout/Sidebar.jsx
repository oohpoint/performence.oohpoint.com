"use client";
import { LayoutDashboard, ChevronDown, ChevronUp, Dot, Handshake, MapPinCheckInside, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState(null);

    const menuItems = useMemo(
        () => [
            { label: "Dashboard", path: "/", icon: LayoutDashboard },
            { label: 'Brand', path: '/brand', icon: Handshake },
            { label: 'Location', path: '/location', icon: MapPinCheckInside },
            { label: 'Vendor', path: '/vendor', icon: ShoppingBag },
        ],
        []
    );

    const handleNavigation = (path) => {
        router.push(path);
    };

    const toggleDropdown = (label) => {
        setOpenDropdown((prev) => (prev === label ? null : label));
    };

    return (
        <aside className="fixed md:sticky top-0 left-0 h-screen z-50 w-52 bg-white flex flex-col border-r border-gray-200">
            <div className="relative flex flex-col h-full">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                    <div
                        className="flex items-center gap-3 overflow-hidden cursor-pointer"
                        onClick={() => handleNavigation("/")}
                    >
                        <Image
                            src="/logo.png"
                            alt="logo"
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-md object-contain"
                            priority
                        />
                        <span className="text-gray-900 font-bold text-lg whitespace-nowrap">
                            OOHPoint
                        </span>
                    </div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
                        Menu
                    </div>

                    {menuItems.map(({ label, path, icon: Icon, children }) => {
                        const isActive = pathname === path;
                        const isDropdownOpen = openDropdown === label;

                        return (
                            <div key={path}>
                                <button
                                    onClick={() =>
                                        children ? toggleDropdown(label) : handleNavigation(path)
                                    }
                                    className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-150 relative ${isActive
                                        ? "bg-gray-100 "
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 w-1 h-8 bg-gray-500 rounded-r-full -translate-x-3" />
                                    )}

                                    <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    <div className="flex items-center justify-between flex-1 min-w-0">
                                        <span className="text-sm font-medium whitespace-nowrap">
                                            {label}
                                        </span>

                                        {children &&
                                            (isDropdownOpen ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            ))}
                                    </div>
                                </button>

                                {children && isDropdownOpen && (
                                    <div className="ml-8 mt-1 space-y-1">
                                        {children.map((sub) => {
                                            const isSubActive = pathname === sub.path;
                                            return (
                                                <button
                                                    key={sub.path}
                                                    onClick={() => handleNavigation(sub.path)}
                                                    className={`w-full flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isSubActive
                                                        ? "bg-blue-100 text-blue-900"
                                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                                        }`}
                                                >
                                                    <Dot className="w-4 h-4 opacity-80" />
                                                    <span>{sub.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
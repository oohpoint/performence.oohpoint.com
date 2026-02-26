"use client";
import { LayoutDashboard, ChevronDown, ChevronUp, Dot, GraduationCap, LoaderPinwheel, Store, UserCog, Pin, LocationEditIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { TbBrandBlogger, TbQuestionMark } from "react-icons/tb";


const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState(null);

    const menuItems = useMemo(
        () => [
            { label: "Dashboard", path: "/", icon: LayoutDashboard },
            { label: 'Brand', path: '/brand', icon: LoaderPinwheel },
            { label: 'Location', path: '/location', icon: LocationEditIcon },
            { label: 'Vendor', path: '/vendor', icon: Store },
            { label: 'Ambassadors', path: '/ambassadors', icon: GraduationCap },
            {
                label: 'Users', path: '/users', icon: UserCog,
                children: [
                    { label: "Dashboard", path: "/users/dashboard", },
                    { label: 'Users', path: '/users', },
                ]
            },


            { label: "Inquiry", path: "/inquiry", icon: TbQuestionMark },
            { label: "Blogs", path: "/blogs", icon: TbBrandBlogger },
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
        <aside className="fixed md:sticky top-0 left-0 h-screen z-50 w-52 bg-[#0f1729] flex flex-col">
            <div className="relative flex flex-col h-full">
                <div className="relative flex items-center justify-between px-4 py-3">
                    <div
                        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 overflow-hidden cursor-pointer"
                        onClick={() => handleNavigation("/")}
                    >
                        <span className="font-bold text-lg whitespace-nowrap font-mono mt-9">
                            <span className="text-green-500">Ooh</span>
                            <span className="text-white">point</span>
                        </span>
                    </div>
                </div>


                <nav className="flex-1 px-3 py-10 space-y-1 overflow-y-auto overflow-x-hidden">

                    {menuItems.map(({ label, path, icon, children }) => {
                        const isActive = pathname === path;
                        const isDropdownOpen = openDropdown === label;
                        const isImageIcon = typeof icon === "string";
                        const Icon = icon;

                        return (
                            <div key={path}>
                                <button
                                    onClick={() =>
                                        children ? toggleDropdown(label) : handleNavigation(path)
                                    }
                                    className={`w-full flex items-center gap-2 px-3 py-1 rounded-lg cursor-pointer transition-colors duration-150 relative ${isActive
                                        ? "bg-[#182239] text-white "
                                        : "text-gray-400 hover:bg-[#182239] hover:text-[#d2d5df]"
                                        }`}
                                >
                                    <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                                        {isImageIcon ? (
                                            <Image
                                                src={icon}
                                                alt={label}
                                                width={20}
                                                height={20}
                                                className="object-contain"
                                            />
                                        ) : (
                                            <Icon className="w-5 h-5" />
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between flex-1 min-w-0">
                                        <span className="text-[16px] font-normal whitespace-nowrap">
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
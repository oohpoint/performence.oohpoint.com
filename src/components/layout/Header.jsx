"use client";

import {
    Bell,
    LogOut,
    Settings,
    User,
    ChevronDown
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { query, where, collection, getDocs } from "firebase/firestore";
import { auth } from "@/firebase";
import { db } from "@/firebase";

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [authUser, setAuthUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [hasNotifications, setHasNotifications] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setAuthUser(user);

            if (!user) return;

            const q = query(
                collection(db, "admins"),
                where("uid", "==", user.uid)
            );

            const snap = await getDocs(q);
            if (!snap.empty) {
                setProfile(snap.docs[0].data());
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await signOut(auth);
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
            setIsLoggingOut(false);
        }
    };

    const getInitials = (name) => {
        return name
            ?.split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "U";
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex-1" />

                <div className="flex items-center gap-4">
                    <button
                        className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                        aria-label="Notifications"
                    >
                        <Bell size={20} />
                        {hasNotifications && (
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                        )}
                    </button>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="group flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-50"
                            aria-haspopup="true"
                            aria-expanded={isDropdownOpen}
                        >
                            {profile?.imageUrl ? (
                                <img
                                    src={profile.imageUrl}
                                    alt={profile.name}
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-blue-600 text-xs font-semibold text-white">
                                    {getInitials(profile?.name)}
                                </div>
                            )}

                            <div className="hidden text-left sm:block">
                                <div className="text-sm font-medium text-gray-900">
                                    {profile?.name || authUser?.email?.split("@")[0] || "User"}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {profile?.role || "Admin"}
                                </div>
                            </div>

                            <ChevronDown
                                size={16}
                                className="text-gray-400 transition-transform group-data-[state=open]:rotate-180"
                            />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
                                <div className="border-b border-gray-100 px-4 py-3 sm:hidden">
                                    <div className="text-sm font-medium text-gray-900">
                                        {profile?.name || authUser?.email?.split("@")[0]}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {authUser?.email}
                                    </div>
                                </div>

                                <nav className="space-y-1 p-2">
                                    <button
                                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                                    >
                                        <User size={16} />
                                        <span>Profile</span>
                                    </button>

                                    <button
                                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                                    >
                                        <Settings size={16} />
                                        <span>Settings</span>
                                    </button>
                                </nav>

                                <div className="border-t border-gray-100 p-2">
                                    <button
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                                    >
                                        <LogOut size={16} />
                                        <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
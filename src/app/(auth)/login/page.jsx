// app/(auth)/login/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { AlertCircle, Eye, EyeOff, ArrowRight } from "lucide-react";

import { auth, db } from "@/firebase";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push("/");
            }
        });

        return () => unsubscribe();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            const adminsRef = collection(db, "admins");
            const q = query(adminsRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setErrorMessage("Invalid email or password.");
                setLoading(false);
                return;
            }

            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            if (user) {
                // Get JWT token
                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: user.email,
                        uid: user.uid,
                    }),
                });

                if (response.ok) {
                    router.push("/");
                } else {
                    setErrorMessage("Failed to create session.");
                }
            }
        } catch (error) {
            setErrorMessage("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Section - linear Background */}
            <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 items-center justify-center p-12 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-slate-600/20 rounded-full blur-3xl"></div>

                <div className="text-center text-white relative z-10">
                    <div className="mb-8">
                        <div className="w-16 h-16 mx-auto bg-linear-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
                            OO
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold mb-4 leading-tight">
                        OOHPoint
                    </h1>
                    <p className="text-xl text-slate-300 mb-2">
                        Out-of-Home Media Management
                    </p>
                    <p className="text-slate-400">
                        Streamline your advertising campaigns with our powerful platform
                    </p>

                    {/* Features List */}
                    <div className="mt-12 space-y-4">
                        <div className="flex items-center justify-center gap-3 text-slate-300">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Real-time Campaign Management</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 text-slate-300">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Advanced Analytics & Reporting</span>
                        </div>
                        <div className="flex items-center justify-center gap-3 text-slate-300">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Multi-Channel Integration</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md">
                    {/* Logo for Mobile */}
                    <div className="lg:hidden mb-8 text-center">
                        <div className="w-12 h-12 mx-auto bg-linear-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-xl font-bold text-white mb-4">
                            OO
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">OOHPoint</h1>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-3">
                            Welcome Back
                        </h2>
                        <p className="text-gray-600 text-base">
                            Sign in to your admin account to continue
                        </p>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 animate-in fade-in">
                            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                            <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400"
                                placeholder="admin@example.com"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end pt-1">
                            <button
                                type="button"
                                onClick={() => router.push("/forget-password")}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-semibold rounded-lg transition-all duration-200 mt-8 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                    </div>

                    {/* Security Note */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-900 font-medium">
                            🔒 Your login credentials are encrypted and secure. Never share your password.
                        </p>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-gray-500 text-xs mt-6">
                        © 2025 OOHPoint. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
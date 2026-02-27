"use client";
import React, { createContext, useState, useEffect } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const MyContext = createContext();

const MyProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [queries, setQueries] = useState([]);
  const [userQueries, setUserQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        toast.error("Log in first");
        router.push("/sign-in");
        setUser(null);
      } else {
        setUser(firebaseUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch sponsor inquiries
  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/getSponsor");
      if (!res.ok) throw new Error("Failed to fetch inquiries");

      const data = await res.json();
      setInquiries([...data].reverse());
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
  };

  // Fetch queries
  const fetchQueries = async () => {
    try {
      const res = await fetch("/api/getQueries");
      if (!res.ok) throw new Error("Failed to fetch queries");

      const data = await res.json();
      const reversed = [...data].reverse();

      setQueries(reversed);
      setUserQueries(reversed.filter((q) => q.type === "userQuery"));
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  };

  if (loading) return null;

  return (
    <MyContext.Provider
      value={{
        user,
        blogs,
        setBlogs,
        inquiries,
        fetchInquiries,
        queries,
        userQueries,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyProvider };
"use client";
import React, { createContext, use, useState } from "react";
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getDocs, collection, query, where } from "firebase/firestore";

const MyContext = createContext();

const MyProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isEditCampaign, setIsEditCampaign] = useState(false);
  const [editedCampaign, setEditedCampaign] = useState(null);
  const [mode, setMode] = useState("");
  const [blog, setBlog] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [queries, setQueries] = useState([]);
  const [qrs, setQrs] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [userQueries, setUserQueries] = useState([]);
  const [brandQueries, setBrandQueries] = useState([]);
  const [vendorQueries, setVendorQueries] = useState([]);
  const [campaign, setCampaign] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [promoters, setPromoters] = useState([]);

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        toast.error("Log in first");
        router.push("/sign-in"); // Adjust the route as per your application
      } else {
        console.log(user);
        fetchUser(user.uid);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [router]);

  const fetchUser = async (uid) => {
    try {
      const res = await fetch("/api/getAdmins");

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const userData = await res.json();

      const data = userData.find((user) => user.uid === uid);
      setUser(data);
      fetchTabs(data);
      fetchCampaigns();
      fetchVendors();
      fetchBrands();
      fetchUsers();
      fetchBlogs();
      fetchAdmins();
      fetchQr();
      fetchQueries();
      fetchInquiries();
      fetchRoles();
      fetchProducts();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchTabs = async (user) => {
    try {
      // Create a query to fetch the document where name matches user.role
      const q = query(collection(db, "roles"), where("name", "==", user.role));

      // Execute the query
      const querySnapshot = await getDocs(q);

      // Map through the query results and return the desired data
      const roles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const tabsData = roles[0].tabs; // Access the tabs array from the first role document

      setTabs(tabsData); // Return the fetched roles (can be one or more)
      console.log(tabsData);
    } catch (error) {
      console.error("Error fetching role:", error);
      return []; // Return an empty array or handle the error as needed
    }
  };

  const fetchVendors = async () => {
    try {
      const res = await fetch("/api/getVendors");

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const userData = await res.json();
      setVendors(userData.reverse());
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchRoles = async () => {
    // auth.signOut();
    try {
      const querySnapshot = await getDocs(collection(db, "roles"));
      const fetchedRoles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRoles(fetchedRoles);
    } catch (err) {
      console.log("Failed to fetch roles.");
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch("/api/getBrands");

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const userData = await res.json();
      setBrands(userData.reverse());
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/getSponsor");

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const userData = await res.json();
      console.log(userData);
      setInquiries(userData.reverse());
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchQueries = async () => {
    try {
      const res = await fetch("/api/getQueries");

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const queriesData = await res.json();
      setQueries(queriesData.reverse());
      setUserQueries(queriesData.filter((query) => query.type === "userQuery"));
      setVendorQueries(
        queriesData.filter((query) => query.type === "vendorQuery")
      );
      setBrandQueries(
        queriesData.filter((query) => query.type === "brandQuery")
      );
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/getUsers");

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const userData = await res.json();
      setUsers(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/getCampaigns");

      if (!res.ok) {
        throw new Error("Failed to fetch campaigns");
      }

      const campaignsData = await res.json();

      setCampaigns(campaignsData);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/getBlogs");

      if (!res.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const blogsData = await res.json();

      setBlogs(blogsData);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/getAdmins");

      if (!res.ok) {
        throw new Error("Failed to fetch admins");
      }

      const blogsData = await res.json();

      setAdmins(blogsData.reverse());
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchQr = async () => {
    try {
      const res = await fetch("/api/getQr");

      if (!res.ok) {
        throw new Error("Failed to fetch qrs");
      }

      const qrsData = await res.json();

      setQrs(qrsData);
    } catch (error) {
      console.error("Error fetching qrs:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const productsRef = collection(db, "products");
      const snapshot = await getDocs(productsRef);

      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Products fetched:", productsData);
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };




  const fetchPromoters = async () => {
    try {
      const promotersRef = collection(db, "promoters");
      const snapshot = await getDocs(promotersRef);

      const promotersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPromoters(promotersData);
    } catch (error) {
      console.error("Error fetching promoters:", error);
    }
  };

  if (!user) return null;

  return (
    <MyContext.Provider
      value={{
        isOpen,
        setIsOpen,
        isHovered,
        setIsHovered,
        user,
        setUser,
        campaigns,
        setCampaigns,
        vendors,
        setVendors,
        brands,
        setBrands,
        users,
        setUsers,
        fetchVendors,
        fetchBrands,
        fetchCampaigns,
        fetchUsers,
        blogs,
        setBlogs,
        fetchBlogs,
        isEditCampaign,
        setIsEditCampaign,
        editedCampaign,
        setEditedCampaign,
        mode,
        setMode,
        blog,
        setBlog,
        fetchBlogs,
        admins,
        setAdmins,
        fetchAdmins,
        inquiries,
        setInquiries,
        fetchInquiries,
        qrs,
        setQrs,
        fetchQr,
        queries,
        setQueries,
        userQueries,
        setUserQueries,
        brandQueries,
        setBrandQueries,
        setVendorQueries,
        vendorQueries,
        fetchQueries,
        roles,
        setRoles,
        fetchRoles,
        tabs,
        setTabs,
        campaign,
        setCampaign,
        vendor,
        setVendor,
        products,
        setProducts,
        product,
        setProduct,
        fetchProducts,
        promoters,
        setPromoters,
        fetchPromoters,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyProvider };

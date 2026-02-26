"use client";
import React, { useContext, useMemo, useCallback } from "react";
import { MyContext } from "@/context/MyContext";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "react-hot-toast";
import { Loader2, FileText, TrendingUp, Calendar, Trash2, Edit, ChevronLeft, ChevronRight } from "lucide-react";

const BlogsHome = ({ blogs }) => {
  const _ctx = useContext(MyContext) || {};
  const setBlog = _ctx.setBlog ?? (() => { });
  const setBlogs = _ctx.setBlogs ?? (() => { });
  const setMode = _ctx.setMode ?? (() => { });
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 10;

  // Transform blogs data for table
  const transformedBlogsData = useMemo(() => {
    if (!blogs?.length) return [];

    return blogs.map((blog) => ({
      title: blog.title || "Untitled",
      id: blog.id,
      category: blog.category || "Uncategorized",
      type: blog.isCaseStudy ? "Case Study" : "Blog Article",
      createdAt: blog.createdAt?.seconds
        ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        })
        : "N/A",
      image: blog.image || "",
      isFeatured: blog.isFeatured === "Yes",
      tags: blog.tags || [],
    }));
  }, [blogs]);

  // Pagination
  const totalPages = Math.ceil(transformedBlogsData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = transformedBlogsData.slice(startIndex, endIndex);

  // Handle edit action
  const handleEdit = useCallback((id) => {
    const blogToEdit = blogs.find((blog) => blog.id === id);

    if (blogToEdit) {
      setBlog(blogToEdit);
      setMode("edit");
    } else {
      toast.error("Blog not found");
    }
  }, [blogs, setBlog, setMode]);

  // Handle delete action with confirmation
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
      return;
    }

    const loadingToast = toast.loading("Deleting blog...");

    try {
      await deleteDoc(doc(db, "blogs", id));
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
      toast.success("Blog deleted successfully", { id: loadingToast });

      // Adjust page if needed
      if (currentData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog. Please try again.", { id: loadingToast });
    }
  }, [setBlogs, currentData.length, currentPage]);

  // Loading state
  if (!blogs) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (transformedBlogsData.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No blogs yet</h3>
          <p className="text-gray-500">Create your first blog to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FileText}
          label="Total Blogs"
          value={blogs.length}
          color="purple"
        />
        <StatCard
          icon={FileText}
          label="Blog Articles"
          value={blogs.filter(b => !b.isCaseStudy).length}
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          label="Case Studies"
          value={blogs.filter(b => b.isCaseStudy).length}
          color="green"
        />
        <StatCard
          icon={Calendar}
          label="This Month"
          value={blogs.filter(b => {
            if (!b.createdAt?.seconds) return false;
            const blogDate = new Date(b.createdAt.seconds * 1000);
            const now = new Date();
            return blogDate.getMonth() === now.getMonth() &&
              blogDate.getFullYear() === now.getFullYear();
          }).length}
          color="orange"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.map((blog, index) => (
                <tr
                  key={blog.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {blog.image && (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {blog.title.length > 40 ? `${blog.title.slice(0, 37)}...` : blog.title}
                        </p>
                        {blog.isFeatured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${blog.type === "Case Study"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                      }`}>
                      {blog.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {blog.createdAt}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(blog.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, transformedBlogsData.length)} of {transformedBlogsData.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                    ? "bg-purple-600 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Stats Card Component
const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-6 transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80 mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <Icon className="h-10 w-10 opacity-50" />
      </div>
    </div>
  );
};

export default BlogsHome;
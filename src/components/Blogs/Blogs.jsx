"use client";
import React, { useContext, useState, useMemo } from "react";
import { MyContext } from "@/context/MyContext";
import CreateBlog from "./CreateBlog";
import { FilterIcon, ChevronDownIcon, HomeIcon, PlusCircleIcon, CheckIcon } from "lucide-react";
import BlogsHome from "./BlogsHome";

const FILTER_OPTIONS = [
  { value: "all", label: "All Posts", count: 0 },
  { value: "casestudy", label: "Case Studies", count: 0 },
  { value: "blogs", label: "Blog Articles", count: 0 }
];

const SECTIONS = {
  HOME: "home",
  CREATE: "CreateBlog"
};

const Blogs = () => {
  const _ctx = useContext(MyContext) || {};
  const blogs = _ctx.blogs ?? [];
  const [activeSection, setActiveSection] = useState(SECTIONS.HOME);
  const [filterType, setFilterType] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Calculate counts for each filter
  const filterCounts = useMemo(() => ({
    all: blogs.length,
    casestudy: blogs.filter(d => d.isCaseStudy).length,
    blogs: blogs.filter(d => !d.isCaseStudy).length
  }), [blogs]);

  // Memoized filtered blogs
  const filteredBlogs = useMemo(() => {
    if (filterType === "all") return blogs;
    if (filterType === "casestudy") return blogs.filter(d => d.isCaseStudy);
    if (filterType === "blogs") return blogs.filter(d => !d.isCaseStudy);
    return blogs;
  }, [blogs, filterType]);

  const handleFilterSelect = (filter) => {
    setFilterType(filter);
    setIsDropdownOpen(false);
  };

  const getFilterLabel = () => {
    const option = FILTER_OPTIONS.find(opt => opt.value === filterType);
    return option ? option.label : "All Posts";
  };

  return (
    <div className="bg-white w-full min-h-screen ">

      {/* Navigation & Filter Bar */}
      <div className="bg-white  sticky top-0 z-30 ">
        <div className="max-w-7xl mx-auto px-4 py-3 ">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Tab Navigation */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-full sm:w-auto">
              <button
                onClick={() => setActiveSection(SECTIONS.HOME)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 flex-1 sm:flex-initial ${activeSection === SECTIONS.HOME
                  ? "bg-white text-oohpoint-primary-3 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                <HomeIcon className="h-4 w-4" />
                <span className="text-sm sm:text-base">Home</span>
              </button>
              <button
                onClick={() => setActiveSection(SECTIONS.CREATE)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 flex-1 sm:flex-initial ${activeSection === SECTIONS.CREATE
                  ? "bg-white text-oohpoint-primary-3 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                <PlusCircleIcon className="h-4 w-4" />
                <span className="text-sm sm:text-base">Create</span>
              </button>
            </div>

            {/* Filter Dropdown - Enhanced */}
            {activeSection === SECTIONS.HOME && (
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between w-full sm:w-auto gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 transition-all duration-200 hover:shadow-md"
                  aria-label="Filter blogs"
                  aria-expanded={isDropdownOpen}
                >
                  <div className="flex items-center gap-2">
                    <FilterIcon className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-700 text-sm sm:text-base">
                      {getFilterLabel()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-oohpoint-primary-3 text-white px-2 py-0.5 rounded-full">
                      {filteredBlogs.length}
                    </span>
                    <ChevronDownIcon
                      className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                        }`}
                    />
                  </div>
                </button>

                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-full sm:w-72 bg-white rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                      <div className="p-2">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                          Filter by Type
                        </div>
                        {FILTER_OPTIONS.map(({ value, label }) => {
                          const count = filterCounts[value];
                          const isActive = filterType === value;
                          return (
                            <button
                              key={value}
                              onClick={() => handleFilterSelect(value)}
                              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-150 ${isActive
                                ? "bg-oohpoint-primary-3 text-white shadow-md"
                                : "hover:bg-gray-50 text-gray-700"
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                {isActive && <CheckIcon className="h-4 w-4" />}
                                <span className={`font-medium ${isActive ? "" : "ml-7"}`}>
                                  {label}
                                </span>
                              </div>
                              <span className={`text-sm px-2 py-0.5 rounded-full ${isActive
                                ? "bg-white/20 text-white"
                                : "bg-gray-100 text-gray-600"
                                }`}>
                                {count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-xl shadow-sm min-h-[500px] p-4 sm:p-6 lg:p-8">
          {activeSection === SECTIONS.CREATE ? (
            <CreateBlog />
          ) : (
            <>
              {/* Results Header */}
              <div className="mb-6 pb-4 border-b">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  {filterType === "all" && "All Posts"}
                  {filterType === "casestudy" && "Case Studies"}
                  {filterType === "blogs" && "Blog Articles"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredBlogs.length} {filteredBlogs.length === 1 ? "post" : "posts"} found
                </p>
              </div>

              <BlogsHome blogs={filteredBlogs} />
            </>
          )}
        </div>
      </div>

      {/* Floating Action Button - Mobile Only */}
      {activeSection === SECTIONS.HOME && (
        <button
          onClick={() => setActiveSection(SECTIONS.CREATE)}
          className="lg:hidden fixed bottom-6 right-6 bg-gradient-to-r from-oohpoint-primary-3 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-200 z-40"
          aria-label="Create new post"
        >
          <PlusCircleIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Blogs;
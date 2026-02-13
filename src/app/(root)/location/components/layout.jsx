"use client";

export const Section = ({ title, required = false, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {title}
          {required && <span className="text-red-500 ml-2">*</span>}
        </h2>
      </div>
      {children}
    </div>
  );
};

export const Grid = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
};
"use client";
import React, { useContext, useMemo, useState } from "react";
import { MyContext } from "@/context/MyContext";
import moment from "moment";
import {
  Users,
  Award,
  Megaphone,
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  Building,
  Target,
  Globe,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import Card from "@/components/Card";

// Reusable Modal Component (matching blog style)
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card (matching blog style)
const StatCard = ({ icon: Icon, label, value, color, isActive, onClick, badge }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    green: "bg-green-50 text-green-600 border-green-200",
  };

  return (
    <button
      onClick={onClick}
      className={`relative border rounded-xl p-6 transition-all duration-200 hover:shadow-md text-left w-full ${isActive ? "ring-2 ring-purple-500 shadow-md" : colorClasses[color]
        }`}
    >
      {badge > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg animate-pulse">
          {badge}
        </span>
      )}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80 mb-1">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <Icon className="h-10 w-10 opacity-50" />
      </div>
    </button>
  );
};

// Reusable Detail Field
const DetailField = ({ label, value, icon: Icon, isLink = false }) => (
  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <div className="flex items-center gap-2 mb-1">
      {Icon && <Icon className="h-4 w-4 text-gray-500" />}
      <p className="text-sm font-semibold text-gray-600">{label}</p>
    </div>
    {isLink && value ? (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-base font-medium text-purple-600 hover:underline break-all"
      >
        {value}
      </a>
    ) : (
      <p className="text-base font-medium text-gray-900">{value || "N/A"}</p>
    )}
  </div>
);

// Section Component for Modal
const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const SponsorsPage = () => {
  const { inquiries, markInquiryAsRead } = useContext(MyContext);
  const [selectedType, setSelectedType] = useState("sponsors");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Categorize inquiries
  const categorizedData = useMemo(() => {
    if (!inquiries) return { sponsors: [], ambassador: [], advertise: [], contact: [] };

    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    const categories = {
      sponsors: inquiries.filter((i) => i.type === "sponsorship"),
      ambassador: inquiries.filter((i) => i.type === "ambassador"),
      advertise: inquiries.filter((i) => i.type === "advertise"),
      contact: inquiries.filter((i) => i.type === "contact"),
    };

    const unreadCounts = {
      sponsors: categories.sponsors.filter((i) => new Date(i.createdAt) > oneDayAgo).length,
      ambassador: categories.ambassador.filter((i) => new Date(i.createdAt) > oneDayAgo).length,
      advertise: categories.advertise.filter((i) => new Date(i.createdAt) > oneDayAgo).length,
      contact: categories.contact.filter((i) => new Date(i.createdAt) > oneDayAgo).length,
    };

    return { ...categories, unreadCounts };
  }, [inquiries]);

  // Current data with pagination
  const currentData = useMemo(() => {
    const data = categorizedData[selectedType] || [];
    const startIndex = (currentPage - 1) * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  }, [categorizedData, selectedType, currentPage]);

  const totalPages = Math.ceil((categorizedData[selectedType]?.length || 0) / rowsPerPage);

  // Handle row click
  const handleRowClick = (item) => {
    if (item && !item.isRead && markInquiryAsRead) {
      markInquiryAsRead(item._id);
    }
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setModalOpen(false);
  };

  // Table configurations
  const tableConfig = {
    sponsors: {
      columns: ["Event Name", "Sponsor Name", "Event Date", "Contact Email", "Actions"],
      renderRow: (item) => [
        item.eventName,
        item.contactName,
        moment(item.eventDate).format("MMM DD, YYYY"),
        item.contactEmail,
      ],
    },
    ambassador: {
      columns: ["College Name", "Ambassador Name", "Email", "Phone", "Actions"],
      renderRow: (item) => [
        item.personalInformation?.collegeName,
        item.personalInformation?.fullName,
        item.personalInformation?.email,
        item.personalInformation?.phoneNumber,
      ],
    },
    advertise: {
      columns: ["Brand Name", "Company Name", "Campaign Objective", "Nature of Business", "Actions"],
      renderRow: (item) => [
        item.brandName,
        item.companyName,
        item.campaignObjective,
        item.natureOfBusiness,
      ],
    },
    contact: {
      columns: ["Name", "Email", "Phone", "Inquiry Type", "Actions"],
      renderRow: (item) => [
        item.fullName,
        item.email,
        item.phone,
        item.inquiryType,
      ],
    },
  };

  const renderModalContent = () => {
    if (!selectedItem) return null;

    switch (selectedType) {
      case "sponsors":
        return (
          <>
            <Section title="Event Information">
              <DetailField label="Event Name" value={selectedItem.eventName} icon={Calendar} />
              <DetailField label="Event Date" value={moment(selectedItem.eventDate).format("MMMM DD, YYYY")} icon={Calendar} />
              <DetailField label="Event Type" value={selectedItem.eventType} icon={FileText} />
              <DetailField label="Attendees" value={selectedItem.attendees} icon={Users} />
              <DetailField label="Finalize Date" value={selectedItem.finalizeDate ? moment(selectedItem.finalizeDate).format("MMMM DD, YYYY") : "N/A"} icon={Calendar} />
            </Section>
            <Section title="Contact Information">
              <DetailField label="Contact Name" value={selectedItem.contactName} icon={Users} />
              <DetailField label="Email" value={selectedItem.contactEmail} icon={Mail} />
              <DetailField label="Phone" value={selectedItem.contactPhone} icon={Phone} />
            </Section>
            <Section title="Additional Details">
              <DetailField label="Notes" value={selectedItem.notes} icon={FileText} />
              <DetailField label="Preferences" value={selectedItem.preferences} icon={FileText} />
              <DetailField label="File" value={selectedItem.fileURL} icon={FileText} isLink />
            </Section>
          </>
        );

      case "ambassador":
        return (
          <>
            <Section title="Personal Information">
              <DetailField label="Full Name" value={selectedItem.personalInformation?.fullName} icon={Users} />
              <DetailField label="Email" value={selectedItem.personalInformation?.email} icon={Mail} />
              <DetailField label="Phone" value={selectedItem.personalInformation?.phoneNumber} icon={Phone} />
              <DetailField label="College" value={selectedItem.personalInformation?.collegeName} icon={Building} />
              <DetailField label="Course" value={selectedItem.personalInformation?.courseStream} icon={FileText} />
              <DetailField label="Year" value={selectedItem.personalInformation?.yearOfStudy} icon={Calendar} />
              <DetailField label="Social Media" value={selectedItem.personalInformation?.socialHandles} icon={Globe} isLink />
            </Section>
            <Section title="Skills & Interests">
              <DetailField label="Marketing" value={selectedItem.skillsInterests?.advertisingMarketing} icon={Target} />
              <DetailField label="Communication" value={selectedItem.skillsInterests?.communication} icon={MessageSquare} />
              <DetailField label="Event Management" value={selectedItem.skillsInterests?.eventManagement} icon={Calendar} />
              <DetailField label="Leadership" value={selectedItem.skillsInterests?.leadership} icon={Award} />
              <DetailField label="Interests" value={selectedItem.skillsInterests?.interests} icon={FileText} />
            </Section>
            <Section title="Availability & Experience">
              <DetailField label="Availability" value={selectedItem.availabilityExperience?.availability} icon={Calendar} />
              <DetailField label="Previous Experience" value={selectedItem.availabilityExperience?.previousExperience} icon={FileText} />
              <div className="md:col-span-2">
                <DetailField label="Experience Description" value={selectedItem.availabilityExperience?.experienceDescription} icon={FileText} />
              </div>
            </Section>
            {selectedItem.mediaUploads?.videoURL && (
              <Section title="Media">
                <DetailField label="Video" value={selectedItem.mediaUploads.videoURL} icon={FileText} isLink />
              </Section>
            )}
          </>
        );

      case "advertise":
        return (
          <>
            <Section title="Brand Information">
              <DetailField label="Brand Name" value={selectedItem.brandName} icon={Award} />
              <DetailField label="Company Name" value={selectedItem.companyName} icon={Building} />
              <DetailField label="Website" value={selectedItem.websiteLink} icon={Globe} isLink />
              <DetailField label="Nature of Business" value={selectedItem.natureOfBusiness} icon={FileText} />
              <DetailField label="GST Number" value={selectedItem.gstNumber} icon={FileText} />
            </Section>
            <Section title="Campaign Details">
              <DetailField label="Objective" value={selectedItem.campaignObjective} icon={Target} />
              <DetailField label="Target Audience" value={selectedItem.targetAudience} icon={Users} />
              <DetailField label="Reach Goal" value={selectedItem.reachGoal} icon={Megaphone} />
              <DetailField label="Start Date" value={selectedItem.startDate ? moment(selectedItem.startDate).format("MMMM DD, YYYY") : "N/A"} icon={Calendar} />
              <DetailField label="End Date" value={selectedItem.endDate ? moment(selectedItem.endDate).format("MMMM DD, YYYY") : "N/A"} icon={Calendar} />
              <DetailField label="Locations" value={selectedItem.locations} icon={Building} />
              <div className="md:col-span-2">
                <DetailField label="Description" value={selectedItem.description} icon={FileText} />
              </div>
            </Section>
          </>
        );

      case "contact":
        return (
          <Section title="Contact Information">
            <DetailField label="Full Name" value={selectedItem.fullName} icon={Users} />
            <DetailField label="Email" value={selectedItem.email} icon={Mail} />
            <DetailField label="Phone" value={selectedItem.phone} icon={Phone} />
            <DetailField label="Inquiry Type" value={selectedItem.inquiryType} icon={FileText} />
            <div className="md:col-span-2">
              <DetailField label="Message" value={selectedItem.message} icon={MessageSquare} />
            </div>
          </Section>
        );

      default:
        return null;
    }
  };

  if (!inquiries) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading inquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] px-10 py-4 pt-6">
      {/* Stats Cards - matching blog page style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
        <Card
          icon={Users}
          label="Sponsors"
          value={categorizedData.sponsors.length}
          color="blue"
          isActive={selectedType === "sponsors"}
          onClick={() => {
            setSelectedType("sponsors");
            setCurrentPage(1);
          }}
          badge={categorizedData.unreadCounts?.sponsors || 0}
        />
        <Card
          icon={Award}
          label="Ambassadors"
          value={categorizedData.ambassador.length}
          color="yellow"
          isActive={selectedType === "ambassador"}
          onClick={() => {
            setSelectedType("ambassador");
            setCurrentPage(1);
          }}
          badge={categorizedData.unreadCounts?.ambassador || 0}
        />
        <Card
          icon={MessageSquare}
          label="Contacts"
          value={categorizedData.contact.length}
          color="purple"
          isActive={selectedType === "contact"}
          onClick={() => {
            setSelectedType("contact");
            setCurrentPage(1);
          }}
          badge={categorizedData.unreadCounts?.contact || 0}
        />
        <Card
          icon={Megaphone}
          label="Advertisers"
          value={categorizedData.advertise.length}
          color="green"
          isActive={selectedType === "advertise"}
          onClick={() => {
            setSelectedType("advertise");
            setCurrentPage(1);
          }}
          badge={categorizedData.unreadCounts?.advertise || 0}
        />
      </div>

      {/* Table Container - matching blog page style */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="mb-6 pb-4 border-b px-6 pt-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 capitalize">
            {selectedType} Inquiries
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {categorizedData[selectedType]?.length || 0} {categorizedData[selectedType]?.length === 1 ? "inquiry" : "inquiries"} found
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto px-6">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {tableConfig[selectedType].columns.map((col) => (
                  <th
                    key={col}
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.length > 0 ? (
                currentData.map((item, idx) => {
                  const isUnread = new Date(item.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);
                  return (
                    <tr
                      key={idx}
                      className={`hover:bg-gray-50 transition-colors ${isUnread ? "bg-blue-50/50 font-semibold" : ""
                        }`}
                    >
                      {tableConfig[selectedType].renderRow(item).map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-6 py-4 text-sm text-gray-900">
                          {cell || "N/A"}
                        </td>
                      ))}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleRowClick(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={tableConfig[selectedType].columns.length}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium">No {selectedType} inquiries yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - matching blog page style */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * rowsPerPage) + 1} to{" "}
              {Math.min(currentPage * rowsPerPage, categorizedData[selectedType]?.length || 0)} of{" "}
              {categorizedData[selectedType]?.length || 0} results
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={`${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Details`}
      >
        {renderModalContent()}
      </Modal>
    </div>

  );
};

export default SponsorsPage;
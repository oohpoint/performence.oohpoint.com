"use client"
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
    Search,
    Filter,
    Plus,
    MoreVertical,
    ChevronDown,
    Mail,
    Phone,
    MapPin,
    AlertCircle,
    CheckCircle2,
    Clock,
    Building2,
    ArrowUpDown,
    Wallet,
    Eye,
    Pencil,
    Trash2,
    X
} from 'lucide-react';
import Card from '@/components/Card';
import { useRouter } from 'next/navigation';
import { ActionMenu } from '@/components/Resublaty';

const VendorDashboard = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'businessName', direction: 'asc' });
    const [openMenuId, setOpenMenuId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();
    const menuRef = useRef(null);

    useEffect(() => {
        fetchVendors();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchVendors = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/vendor");
            const data = await res.json();

            let vendorList = [];
            if (Array.isArray(data)) {
                vendorList = data;
            } else if (data?.data && Array.isArray(data.data)) {
                vendorList = data.data;
            } else if (data?.vendors && Array.isArray(data.vendors)) {
                vendorList = data.vendors;
            }

            const normalizedVendors = vendorList.map(vendor => normalizeVendor(vendor));
            setVendors(normalizedVendors);
        } catch (err) {
            console.error("Failed to fetch vendors:", err);
            setVendors([]);
        } finally {
            setLoading(false);
        }
    };

    const normalizeVendor = (vendor) => ({
        id: vendor.id || vendor.vid || '',
        businessName: vendor.businessName || vendor.business_name || '',
        ownerName: vendor.ownerName || vendor.owner_name || '',
        category: vendor.category || vendor.businessCategory || vendor.business_category || '',
        subcategory: vendor.subcategory || vendor.businessSubCategory || vendor.business_sub_category || '',
        status: normalizeStatus(vendor.status),
        contact: {
            email: vendor.contact?.email || vendor.email || '',
            phone: vendor.contact?.phone || vendor.phoneNumber || vendor.phone || '',
            whatsapp: vendor.contact?.whatsapp || vendor.whatsapp || ''
        },
        location: {
            address: vendor.location?.address || vendor.address || '',
            latitude: vendor.location?.latitude || 0,
            longitude: vendor.location?.longitude || 0
        },
        documents: {
            idDocument: vendor.documents?.idDocument || vendor.kycFile || '',
            agreementDocument: vendor.documents?.agreementDocument || vendor.agreementDoc || '',
            gstNumber: vendor.documents?.gstNumber || vendor.gstNumber || '',
            registrationNumber: vendor.documents?.registrationNumber || vendor.registrationNumber || ''
        },
        banking: {
            accountNumber: vendor.banking?.accountNumber || vendor.accountNumber || '',
            upiId: vendor.banking?.upiId || vendor.upiId || '',
            ifsc: vendor.banking?.ifsc || vendor.ifsc || ''
        },
        businessHours: {
            openingHours: vendor.businessHours?.openingHours || vendor.openingHours || '00:00',
            closingHours: vendor.businessHours?.closingHours || vendor.closingHours || '00:00',
            operatingDays: vendor.businessHours?.operatingDays || vendor.operatingDays || []
        },
        media: {
            logo: vendor.media?.logo || vendor.vendorLogo || '',
            menuImages: vendor.media?.menuImages || vendor.menuImages || [],
            shopImages: vendor.media?.shopImages || vendor.shopFrontImages || [],
            interiorPhoto: vendor.media?.interiorPhoto || vendor.interiorPhoto || ''
        },
        createdAt: vendor.createdAt
    });

    const normalizeStatus = (status) => {
        if (!status) return 'Pending';
        const normalized = status.toLowerCase();
        if (normalized === 'active') return 'Active';
        if (normalized === 'pending') return 'Pending';
        if (normalized === 'inactive') return 'Inactive';
        return 'Pending';
    };

    const handleSort = useCallback((key) => {
        setSortConfig(prevConfig => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }));
    }, []);

    const filteredAndSortedVendors = useMemo(() => {
        if (!Array.isArray(vendors)) return [];

        let result = [...vendors];

        if (statusFilter !== 'All') {
            result = result.filter(v => v.status === statusFilter);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(v =>
                v.businessName?.toLowerCase().includes(query) ||
                v.category?.toLowerCase().includes(query) ||
                v.location?.address?.toLowerCase().includes(query) ||
                v.ownerName?.toLowerCase().includes(query)
            );
        }

        result.sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];

            if (aVal === undefined || aVal === null) return 1;
            if (bVal === undefined || bVal === null) return -1;

            return aVal < bVal
                ? sortConfig.direction === 'asc' ? -1 : 1
                : aVal > bVal ? (sortConfig.direction === 'asc' ? 1 : -1) : 0;
        });

        return result;
    }, [vendors, searchQuery, statusFilter, sortConfig]);

    const statusCounts = useMemo(() => ({
        total: vendors.length,
        active: vendors.filter(v => v.status === 'Active').length,
        pending: vendors.filter(v => v.status === 'Pending').length,
        inactive: vendors.filter(v => v.status === 'Inactive').length
    }), [vendors]);

    const handleDelete = async (id) => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/vendor/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete');
            setVendors(vendors.filter(v => v.id !== id));
            setDeleteConfirm(null);
            alert('Vendor deleted successfully');
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete vendor');
        } finally {
            setDeleting(false);
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            Active: 'bg-green-100 text-green-700 border-green-200',
            Inactive: 'bg-gray-100 text-gray-700 border-gray-200',
            Pending: 'bg-amber-100 text-amber-700 border-amber-200',
        };

        const icons = {
            Active: <CheckCircle2 size={14} className="mr-1" />,
            Inactive: <Clock size={14} className="mr-1" />,
            Pending: <AlertCircle size={14} className="mr-1" />,
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
                {icons[status]}
                {status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 px-10 py-6">
            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card
                    title="Total Vendors"
                    value={statusCounts.total}
                    icon={Wallet}
                    iconBg="bg-indigo-50"
                    iconColor="text-indigo-600"
                />
                <Card
                    title="Active"
                    value={statusCounts.active}
                    icon={CheckCircle2}
                    iconBg="bg-green-50"
                    iconColor="text-green-600"
                />
                <Card
                    title="Pending Approval"
                    value={statusCounts.pending}
                    icon={Clock}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-600"
                />
                <Card
                    title="Inactive"
                    value={statusCounts.inactive}
                    icon={AlertCircle}
                    iconBg="bg-orange-50"
                    iconColor="text-orange-600"
                />
            </div>

            {/* Search and Filters */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by vendor name, category, or location..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-colors"
                            >
                                <Filter size={18} />
                                Status: {statusFilter}
                                <ChevronDown size={16} />
                            </button>
                            {isFilterOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    {['All', 'Active', 'Inactive', 'Pending'].map((status) => (
                                        <button
                                            key={status}
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                                            onClick={() => {
                                                setStatusFilter(status);
                                                setIsFilterOpen(false);
                                            }}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => router.push("/vendor/add-vendor")}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            <Plus size={18} />
                            Add Vendor
                        </button>
                    </div>
                </div>

                {/* Vendors Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-y border-gray-200">
                                <th
                                    className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('businessName')}
                                >
                                    <div className="flex items-center gap-2">
                                        Vendor Name
                                        <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-8">
                                            <div className="h-4 bg-gray-200 rounded"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredAndSortedVendors.length > 0 ? (
                                filteredAndSortedVendors.map((vendor) => (
                                    <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 last:border-b-0">
                                        <td
                                            onClick={() => router.push(`/vendor/${vendor.id}`)}
                                            className="px-6 py-4 cursor-pointer"
                                        >
                                            <div className="font-semibold text-gray-900">{vendor.businessName}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">{vendor.ownerName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-700">{vendor.category}</span>
                                            {vendor.subcategory && <div className="text-xs text-gray-500">{vendor.subcategory}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={vendor.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1 text-xs">
                                                {vendor.contact?.email && (
                                                    <div className="flex items-center gap-1 text-gray-700">
                                                        <Mail size={12} className="text-gray-400" />
                                                        <a href={`mailto:${vendor.contact.email}`} className="hover:text-indigo-600 truncate">
                                                            {vendor.contact.email}
                                                        </a>
                                                    </div>
                                                )}
                                                {vendor.contact?.phone && (
                                                    <div className="flex items-center gap-1 text-gray-700">
                                                        <Phone size={12} className="text-gray-400" />
                                                        <a href={`tel:${vendor.contact.phone}`} className="hover:text-indigo-600">
                                                            {vendor.contact.phone}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-sm text-gray-700">
                                                <MapPin size={14} className="text-gray-400 shrink-0" />
                                                <span className="truncate">{vendor.location?.address}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="relative" ref={menuRef}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenMenuId(openMenuId === vendor.id ? null : vendor.id);
                                                    }}
                                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-150"
                                                >
                                                    <MoreVertical size={18} className="text-gray-600" />
                                                </button>

                                                <ActionMenu
                                                    isOpen={openMenuId === vendor.id}
                                                    actions={[
                                                        {
                                                            label: "View Details",
                                                            icon: Eye,
                                                            onClick: () => {
                                                                setOpenMenuId(null);
                                                                router.push(`/vendor/${vendor.id}`);
                                                            },
                                                            className: "text-blue-600",
                                                        },
                                                        {
                                                            label: "Edit",
                                                            icon: Pencil,
                                                            onClick: () => {
                                                                setOpenMenuId(null);
                                                                router.push(`/vendor/${vendor.id}/edit`);
                                                            },
                                                            className: "text-blue-600",
                                                        },
                                                        {
                                                            label: "Delete",
                                                            icon: Trash2,
                                                            onClick: () => {
                                                                setOpenMenuId(null);
                                                                setDeleteConfirm(vendor.id);
                                                            },
                                                            className: "text-red-600",
                                                            isDanger: true,
                                                        },
                                                    ]}
                                                    menuRef={menuRef}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <Building2 className="mx-auto mb-3 text-gray-300" size={48} />
                                        <p className="text-lg font-semibold text-gray-900">No vendors found</p>
                                        <p className="text-sm text-gray-600">Try adjusting your filters or search query</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
                    <div>
                        Showing <span className="font-medium text-gray-900">{filteredAndSortedVendors.length}</span> of <span className="font-medium text-gray-900">{vendors.length}</span> vendors
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {deleteConfirm && (
                <ConfirmDialog
                    title="Delete Vendor"
                    message="Are you sure you want to delete this vendor? This action cannot be undone."
                    onConfirm={() => handleDelete(deleteConfirm)}
                    onCancel={() => setDeleteConfirm(null)}
                    loading={deleting}
                    type="danger"
                />
            )}
        </div>
    );
};

function ConfirmDialog({
    title,
    message,
    onConfirm,
    onCancel,
    loading,
    type = "default",
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${type === "danger"
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {loading && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VendorDashboard;
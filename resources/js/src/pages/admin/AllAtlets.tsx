// src/pages/admin/AllAtlets.tsx
import React, { useState, useEffect } from "react";
import { Search, Users, Loader, Eye, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { useAtletContext, genderOptions } from "../../context/AtlitContext";
import { apiClient } from "../../config/api";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const AllAtlets: React.FC = () => {
  const { atlits, fetchAllAtlits } = useAtletContext();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState<"ALL" | "LAKI_LAKI" | "PEREMPUAN">("ALL");
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const navigate = useNavigate();
  const [filterAgeCategory, setFilterAgeCategory] = useState<"ALL" | "Super Pra-cadet" | "Pracadet" | "Cadet" | "Junior" | "Senior">("ALL");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(100);

  // Set token global sekali aja
  useEffect(() => {
    // Token handled by apiClient automatically
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchAllAtlits();
      } catch (err: any) {
        console.error("Error fetching athletes:");
        setError("Gagal memuat data atlet");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getAgeCategory = (umur: number | undefined): "Super Pra-cadet" | "Pracadet" | "Cadet" | "Junior" | "Senior" | undefined => {
    if (!umur) return undefined;
    if (umur >= 5 && umur <= 8) return "Super Pra-cadet";
    if (umur >= 9 && umur <= 11) return "Pracadet";
    if (umur >= 12 && umur <= 14) return "Cadet";
    if (umur >= 15 && umur <= 17) return "Junior";
    if (umur >= 18) return "Senior";
  };

  const filteredAtlits = atlits.filter((atlet) => {
    const matchesSearch = atlet.nama_atlet.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = filterGender === "ALL" || atlet.jenis_kelamin === filterGender;

    const category = getAgeCategory(atlet.umur);
    const matchesAgeCategory = filterAgeCategory === "ALL" || category === filterAgeCategory;

    return matchesSearch && matchesGender && matchesAgeCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAtlits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAtlits = filteredAtlits.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterGender, filterAgeCategory]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const ageCategories = [
    { value: "ALL", label: "Semua Kelompok Umur" },
    { value: "Super Pra-cadet", label: "Super Pra-Cadet (2017-2020)" },
    { value: "Pracadet", label: "Pracadet (2014-2016)" },
    { value: "Cadet", label: "Cadet (2011-2013)" },
    { value: "Junior", label: "Junior (2008-2010)" },
    { value: "Senior", label: "Senior (2007 ke atas)" },
  ];

  const getGenderBadge = (gender: string) => {
    return gender === "LAKI_LAKI" ? (
      <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(153, 13, 53, 0.1)', color: '#990D35' }}>
        Laki-Laki
      </span>
    ) : (
      <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(245, 183, 0, 0.2)', color: '#050505' }}>
        Perempuan
      </span>
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5FBEF' }}>
        <div className="flex flex-col items-center gap-3">
          <Loader className="animate-spin" style={{ color: '#990D35' }} size={32} />
          <p style={{ color: '#050505', opacity: 0.6 }}>Memuat data atlet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-bebas text-4xl tracking-wide text-gray-900">Data Atlet</h1>
          <p className="text-gray-500 mt-2 font-inter">Kelola database atlet, riwayat pertandingan, dan prestasi.</p>
        </div>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="mb-6 border rounded-xl p-4" style={{ backgroundColor: 'rgba(153, 13, 53, 0.05)', borderColor: 'rgba(153, 13, 53, 0.2)' }}>
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" style={{ color: '#990D35' }} />
            <div className="flex-1">
              <p className="text-sm sm:text-base" style={{ color: '#990D35' }}>{error}</p>
              <button
                onClick={fetchAllAtlits}
                className="mt-2 font-semibold underline hover:no-underline text-sm"
                style={{ color: '#990D35' }}
              >
                Coba lagi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FILTER + SEARCH */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="space-y-4">
          <div className="w-full">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atlet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red focus:border-red outline-none transition-all font-inter"
              />
            </div>
          </div>

          {/* Filter dalam grid 2 kolom di mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Filter Gender */}
            <div>
              <label className="block text-xs mb-2 font-medium" style={{ color: '#050505', opacity: 0.6 }}>Jenis Kelamin</label>
              <Select
                unstyled
                value={{
                  value: filterGender,
                  label:
                    filterGender === "ALL" ? "Semua Gender" : filterGender,
                }}
                onChange={(selected) => setFilterGender(selected?.value as any)}
                options={[
                  { value: "ALL", label: "Semua Gender" },
                  { value: "LAKI_LAKI", label: "Laki-Laki" },
                  { value: "PEREMPUAN", label: "Perempuan" },
                ]}
                placeholder="Pilih kelompok usia"
                classNames={{
                  control: () =>
                    `w-full flex items-center border border-gray-200 rounded-xl px-3 py-3 gap-2 transition-all duration-300 hover:shadow-sm focus-within:border-red focus-within:ring-2 focus-within:ring-red/20`,
                  valueContainer: () => "px-1",
                  placeholder: () => "text-gray-400 text-sm font-inter",
                  menu: () =>
                    "border border-gray-200 bg-white rounded-xl shadow-lg mt-2 overflow-hidden z-50",
                  menuList: () => "max-h-40 overflow-y-auto",
                  option: ({ isFocused, isSelected }) =>
                    [
                      "px-3 py-3 cursor-pointer text-sm transition-colors duration-200 font-inter",
                      isFocused ? "bg-red/5 text-gray-900" : "text-gray-600",
                      isSelected ? "bg-red text-white" : "",
                    ].join(" "),
                }}
              />
            </div>

            {/* Filter Age Category */}
            <div>
              <label className="block text-xs mb-2 font-medium" style={{ color: '#050505', opacity: 0.6 }}>Kategori Umur</label>
              <Select
                unstyled
                value={{
                  value: filterAgeCategory,
                  label:
                    filterAgeCategory === "ALL" ? "Semua Usia" : filterAgeCategory,
                }}
                onChange={(selected) => setFilterAgeCategory(selected?.value as any)}
                options={[
                  { value: "ALL", label: "Semua Kelompok Umur" },
                  { value: "Super Pra-cadet", label: "Super Pra-Cadet (2017-2020)" },
                  { value: "Pracadet", label: "Pracadet (2014-2016)" },
                  { value: "Cadet", label: "Cadet (2011-2013)" },
                  { value: "Junior", label: "Junior (2008-2010)" },
                  { value: "Senior", label: "Senior (2007 ke atas)" },
                ]}
                placeholder="Pilih kelompok usia"
                classNames={{
                  control: () =>
                    `w-full flex items-center border border-gray-200 rounded-xl px-3 py-3 gap-2 transition-all duration-300 hover:shadow-sm focus-within:border-red focus-within:ring-2 focus-within:ring-red/20`,
                  valueContainer: () => "px-1",
                  placeholder: () => "text-gray-400 text-sm font-inter",
                  menu: () =>
                    "border border-gray-200 bg-white rounded-xl shadow-lg mt-2 overflow-hidden z-50",
                  menuList: () => "max-h-40 overflow-y-auto",
                  option: ({ isFocused, isSelected }) =>
                    [
                      "px-3 py-3 cursor-pointer text-sm transition-colors duration-200 font-inter",
                      isFocused ? "bg-red/5 text-gray-900" : "text-gray-600",
                      isSelected ? "bg-red text-white" : "",
                    ].join(" "),
                }}
              />
            </div>
          </div>

          {/* Info hasil */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-4 border-t border-gray-100 mt-4">
            <p className="text-sm sm:text-base text-gray-500 font-inter">
              Menampilkan <span className="font-semibold text-gray-900">{startIndex + 1}-{Math.min(endIndex, filteredAtlits.length)}</span> dari <span className="font-semibold text-gray-900">{filteredAtlits.length}</span> atlet
            </p>
            <p className="text-xs sm:text-sm text-gray-400 font-inter">
              Halaman {currentPage} dari {totalPages}
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader className="w-8 h-8 animate-spin" style={{ color: '#990D35' }} />
            <p className="text-sm sm:text-base" style={{ color: '#050505', opacity: 0.5 }}>Loading data atlet...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Cards View */}
          <div className="block lg:hidden space-y-4">
            {currentAtlits.map((atlet) => (
              <div
                key={atlet.id_atlet}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header Card */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => navigate(`/dashboard/atlit/${atlet.id_atlet}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className="font-semibold text-base leading-tight truncate text-gray-900 font-inter">
                        {atlet.nama_atlet}
                      </h3>
                      <p className="text-sm mt-1 text-gray-500 font-inter">
                        {getAgeCategory(atlet.umur) || 'Tidak diketahui'}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {getGenderBadge(atlet.jenis_kelamin)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 font-inter">Tanggal Lahir:</span>
                      <p className="font-medium text-gray-900 font-inter">{formatDate(atlet.tanggal_lahir)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-inter">Umur:</span>
                      <p className="font-medium text-gray-900 font-inter">{atlet.umur ?? '-'} tahun</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex gap-2 p-4 pt-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/atlit/${atlet.id_atlet}`);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium font-inter"
                  >
                    <Eye size={16} />
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {["Nama Atlet", "Jenis Kelamin", "Tanggal Lahir", "Umur", "Kategori Umur", "Aksi"].map((header) => (
                        <th
                          key={header}
                          className={`py-4 px-6 font-bold text-xs uppercase tracking-wider text-gray-900 font-inter ${header === "Aksi" ? "text-center" : "text-left"
                            }`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentAtlits.map((atlet) => (
                      <tr
                        key={atlet.id_atlet}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/dashboard/atlit/${atlet.id_atlet}`)}
                      >
                        <td className="py-4 px-6 font-medium text-sm text-gray-900 font-inter">{atlet.nama_atlet}</td>
                        <td className="py-4 px-6 text-center">{getGenderBadge(atlet.jenis_kelamin)}</td>
                        <td className="py-4 px-6 text-sm text-gray-500 font-inter">{formatDate(atlet.tanggal_lahir)}</td>
                        <td className="py-4 px-6 text-sm text-center text-gray-500 font-inter">{atlet.umur ?? '-'} tahun</td>
                        <td className="py-4 px-6 text-sm text-center text-gray-500 font-inter">
                          {getAgeCategory(atlet.umur) || '-'}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/dashboard/atlit/${atlet.id_atlet}`);
                            }}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium font-inter"
                          >
                            <Eye size={16} />
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filteredAtlits.length === 0 && (
            <div className="py-16 text-center text-gray-500">
              <Users size={52} className="mx-auto mb-4 opacity-50 text-gray-400" />
              <p className="text-lg font-medium text-gray-900">Tidak ada atlet yang ditemukan</p>
              {(searchTerm || filterGender !== "ALL" || filterAgeCategory !== "ALL") && (
                <p className="text-sm mt-2">Coba ubah filter pencarian Anda</p>
              )}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-gray-200 p-6 mt-6 shadow-sm">
          {/* Pagination Info */}
          <div className="text-sm order-2 sm:order-1 text-gray-500 font-inter">
            Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredAtlits.length)} dari {filteredAtlits.length} hasil
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-600"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((pageNum, index) => (
                pageNum === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-3 py-2 text-sm text-gray-400">...</span>
                ) : (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum as number)}
                    className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${currentPage === pageNum
                      ? "bg-red text-white shadow-md shadow-red/20"
                      : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
                      }`}
                  >
                    {pageNum}
                  </button>
                )
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-600"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>

  );
};

export default AllAtlets;
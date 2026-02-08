import React, { useState, useEffect } from 'react';
import { Eye, Loader, Building2, Search, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { useDojang } from '../../context/dojangContext';
import toast from 'react-hot-toast';
import AlertModal from '../../components/alertModal';
import { apiClient as api } from '../../config/api'; // Use apiClient as api

const ValidasiDojang: React.FC = () => {
  const { dojangs, refreshDojang, isLoading } = useDojang();
  const [selectedDojang, setSelectedDojang] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [dojangToDelete, setDojangToDelete] = useState<any | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    refreshDojang().catch(() => toast.error('Gagal memuat data dojang'));
  }, []);

  const handleViewDetail = (id: number) => {
    setSelectedDojang(id);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (dojang: any) => {
    setDojangToDelete(dojang);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!dojangToDelete) return;

    const toastId = toast.loading('Menghapus dojang...');
    try {
      await api.delete(`/dojang/${dojangToDelete.id_dojang}`);
      toast.success(`Dojang ${dojangToDelete.nama_dojang} berhasil dihapus.`, { id: toastId });
      await refreshDojang();
    } catch (error: any) {
      console.error('Error deleting dojang:', error);
      const errorMessage = error?.data?.message || error?.message || 'Gagal menghapus dojang.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsAlertOpen(false);
      setDojangToDelete(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const filteredDojangs = dojangs.filter(d =>
    d.nama_dojang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredDojangs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDojangs = filteredDojangs.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5FBEF' }}>
        <div className="flex flex-col items-center gap-3">
          <Loader className="animate-spin" style={{ color: '#990D35' }} size={32} />
          <p style={{ color: '#050505' }}>Memuat data dojang...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-bebas text-4xl tracking-wide text-gray-900">Validasi Dojang</h1>
          <p className="text-gray-500 mt-2 font-inter">Kelola pendaftaran dan data dojang.</p>
        </div>
      </div>

      {/* SEARCH + INFO - Layout yang sama dengan ValidasiPeserta */}
      {/* SEARCH + INFO */}
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
                placeholder="Cari dojang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red focus:border-red outline-none transition-all font-inter"
              />
            </div>
          </div>

          {/* Info hasil */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-4 border-t border-gray-100 mt-4">
            <p className="text-sm sm:text-base text-gray-500 font-inter">
              Menampilkan <span className="font-semibold text-gray-900">{startIndex + 1}-{Math.min(endIndex, filteredDojangs.length)}</span> dari <span className="font-semibold text-gray-900">{filteredDojangs.length}</span> dojang
            </p>
            {totalPages > 1 && (
              <p className="text-xs sm:text-sm text-gray-400 font-inter">
                Halaman {currentPage} dari {totalPages}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <>
        {/* Mobile Cards View */}
        <div className="block lg:hidden space-y-4">
          {currentDojangs.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              <Building2 size={52} className="mx-auto mb-4 opacity-50 text-gray-400" />
              <p className="text-lg font-medium text-gray-900">Tidak ada dojang yang ditemukan</p>
              {searchTerm && (
                <p className="text-sm mt-2">Coba ubah kata kunci pencarian Anda</p>
              )}
            </div>
          ) : (
            currentDojangs.map((d) => (
              <div
                key={d.id_dojang}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header Card */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => handleViewDetail(d.id_dojang)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className="font-semibold text-base leading-tight truncate text-gray-900 font-inter">
                        {d.nama_dojang}
                      </h3>
                      <p className="text-sm mt-1 text-gray-500 font-inter">
                        {d.provinsi || 'Provinsi tidak diketahui'}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 bg-yellow-100 text-yellow-800">
                      {d.jumlah_atlet || 0} Atlet
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 font-inter">Tanggal Daftar:</span>
                      <p className="font-medium text-gray-900 font-inter">{formatDate(d.created_at)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-inter">Jumlah Atlet:</span>
                      <p className="font-medium text-gray-900 font-inter">{d.jumlah_atlet || 0} orang</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 p-4 pt-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetail(d.id_dojang);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium font-inter"
                  >
                    <Eye size={16} />
                    Lihat Detail
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(d);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all text-sm font-medium font-inter"
                  >
                    <Trash2 size={16} />
                    Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {filteredDojangs.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                <Building2 size={52} className="mx-auto mb-4 opacity-50 text-gray-400" />
                <p className="text-lg font-medium text-gray-900">Tidak ada dojang yang ditemukan</p>
                {searchTerm && (
                  <p className="text-sm mt-2">Coba ubah kata kunci pencarian Anda</p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {["Nama Dojang", "Jumlah Atlet", "Provinsi", "Tanggal Daftar", "Aksi"].map((header) => (
                        <th
                          key={header}
                          className={`py-4 px-6 font-bold text-xs uppercase tracking-wider text-gray-900 font-inter ${header === "Aksi" || header === "Jumlah Atlet" ? "text-center" : "text-left"}`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentDojangs.map((d) => (
                      <tr
                        key={d.id_dojang}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewDetail(d.id_dojang)}
                      >
                        <td className="py-4 px-6 font-medium text-sm text-gray-900 font-inter">{d.nama_dojang}</td>
                        <td className="py-4 px-6 text-center text-sm text-gray-500 font-inter">{d.jumlah_atlet || 0}</td>
                        <td className="py-4 px-6 text-sm text-gray-500 font-inter">{d.provinsi || '-'}</td>
                        <td className="py-4 px-6 text-sm text-center text-gray-500 font-inter">{formatDate(d.created_at)}</td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetail(d.id_dojang);
                              }}
                              className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-xs font-medium font-inter"
                            >
                              <Eye size={14} />
                              Detail
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(d);
                              }}
                              className="flex items-center gap-1 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all text-xs font-medium font-inter"
                            >
                              <Trash2 size={14} />
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-gray-200 p-6 mt-6 shadow-sm">
          {/* Pagination Info */}
          <div className="text-sm order-2 sm:order-1 text-gray-500 font-inter">
            Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredDojangs.length)} dari {filteredDojangs.length} hasil
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

      {/* Enhanced Modal - Modal styling yang konsisten */}
      {showDetailModal && selectedDojang && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" style={{ backgroundColor: '#F5FBEF' }}>
            <div className="sticky top-0 border-b p-4 sm:p-6 flex items-center justify-between rounded-t-xl" style={{ backgroundColor: '#F5FBEF', borderColor: '#990D35' }}>
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: '#050505' }}>Detail Dojang</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:shadow-sm transition-colors"
                style={{ color: '#050505', opacity: 0.4 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(153, 13, 53, 0.1)';
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.opacity = '0.4';
                }}
              >
                ×
              </button>
            </div>
            <div className="p-4 sm:p-6">
              {(() => {
                const dojang = dojangs.find(d => d.id_dojang === selectedDojang);
                if (!dojang) return <p style={{ color: '#050505', opacity: 0.5 }}>Dojang tidak ditemukan</p>;

                return (
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(153, 13, 53, 0.05)' }}>
                        <h3 className="font-semibold mb-2" style={{ color: '#050505', opacity: 0.7 }}>Informasi Dasar</h3>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Nama:</span> {dojang.nama_dojang}</div>
                          <div><span className="font-medium">Email:</span> {dojang.email}</div>
                          <div><span className="font-medium">no telp:</span> {dojang.no_telp}</div>
                          <div><span className="font-medium">Jumlah Atlet:</span> {dojang.jumlah_atlet || 0}</div>
                          <div><span className="font-medium">Provinsi:</span> {dojang.provinsi || '-'}</div>
                          <div><span className="font-medium">Tanggal Daftar:</span> {formatDate(dojang.created_at)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal for Delete Confirmation */}
      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleConfirmDelete}
        message={
          dojangToDelete
            ? `Anda yakin ingin menghapus dojang "${dojangToDelete.nama_dojang}"? Dojang ini memiliki ${dojangToDelete.jumlah_atlet || 0} atlet.`
            : 'Apakah Anda yakin?'
        }
      />
    </div>
  );
};

export default ValidasiDojang;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Users, Award, TrendingUp, Search, Eye, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import NavbarDashboard from "../../components/navbar/navbarDashboard"
import { useAuth } from "../../context/authContext";
import { apiClient } from "../../config/api";
import { useLocation } from "react-router-dom";
import { useKompetisi } from "../../context/KompetisiContext";

interface StatsCardProps {
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  title: string;
  value: string;
  theme: any;
  colorHex: string;
}

interface Atlit {
  id_atlet: string;
  nama_atlet: string;
  jenis_kelamin: "LAKI_LAKI" | "PEREMPUAN";
  provinsi?: string;
  age: number;
  tinggi_badan?: number;
  berat_badan?: number;
  tanggal_lahir?: string;
  pas_foto?: string;
}

const getPhotoUrl = (filename: string): string | null => {
  if (!filename) return null;
  return `${process.env.REACT_APP_API_BASE_URL || 'http://cjvmanagementevent.com'}/uploads/atlet/pas_foto/${filename}`;
};

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, title, value, theme, colorHex }) => (
  <div className="backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border"
    style={{
      backgroundColor: theme.cardBg,
      borderColor: theme.border
    }}>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 lg:gap-4">
        <div className="p-2 lg:p-3 rounded-xl" style={{ backgroundColor: colorHex + '20' }}>
          <Icon size={20} className="w-6 h-6" style={{ color: colorHex }} />
        </div>
        <div>
          <h3 className="font-plex font-medium text-xs lg:text-sm" style={{ color: theme.textSecondary }}>{title}</h3>
          <p className="font-bebas text-xl lg:text-2xl" style={{ color: theme.textPrimary }}>{value}</p>
        </div>
      </div>
    </div>
  </div>
);

const DataAtlit = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { kompetisiDetail } = useKompetisi();
  const [atlits, setAtlits] = useState<Atlit[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState<"all" | "LAKI_LAKI" | "PEREMPUAN">("all");
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);

  const location = useLocation();

  const templateType = kompetisiDetail?.template_type || 'default';
  const isModern = templateType === 'modern' || templateType === 'template_b';

  const theme = {
    bg: isModern ? '#0a0a0a' : '#FFF5F7',
    cardBg: isModern ? '#111111' : '#FFFFFF',
    textPrimary: isModern ? '#FFFFFF' : '#1F2937',
    textSecondary: isModern ? '#A1A1AA' : '#6B7280',
    primary: isModern ? '#DC2626' : '#DC2626',
    border: isModern ? 'rgba(255,255,255,0.1)' : 'rgba(255, 255, 255, 0.5)',
    inputBg: isModern ? '#1F2937' : '#FFFFFF',
    gradient: isModern ? 'linear-gradient(135deg, #111111 0%, #0a0a0a 100%)' : 'linear-gradient(to bottom right, #ffffff, #FFF5F7, #FFF0F0)'
  };

  const fetchAtlits = async () => {
    try {
      setLoading(true);
      const id_dojang = user?.pelatih?.id_dojang;
      if (!id_dojang) {
        console.warn("No dojang ID found for user");
        return;
      }

      const response = await apiClient.get<any>(`/atlet/dojang/${id_dojang}`);

      let atletData = [];
      if (response.data && response.data.success && response.data.data) {
        atletData = Array.isArray(response.data.data) ? response.data.data : [];
      } else if (Array.isArray(response.data)) {
        atletData = response.data;
      } else {
        atletData = [];
      }

      setAtlits(atletData);
    } catch (err) {
      console.error("Error fetching athletes:", err);
      setAtlits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.refresh) {
      fetchAtlits();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (user?.pelatih?.id_dojang) {
      fetchAtlits();
    }
  }, [user]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const filteredAtlits = atlits.filter(atlit => {
    const matchesSearch = atlit.nama_atlet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atlit.provinsi?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = genderFilter === "all" || atlit.jenis_kelamin === genderFilter;
    return matchesSearch && matchesGender;
  });

  const totalPages = Math.ceil(filteredAtlits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAtlits = filteredAtlits.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, genderFilter]);

  const totalAtlits = atlits.length;
  const lakiLakiCount = atlits.filter(a => a.jenis_kelamin === "LAKI_LAKI").length;
  const perempuanCount = atlits.filter(a => a.jenis_kelamin === "PEREMPUAN").length;
  const avgAge = atlits.length > 0 ? Math.round(atlits.reduce((sum, a) => sum + a.age, 0) / atlits.length) : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen max-w-screen" style={{ background: theme.gradient }}>
      <NavbarDashboard />

      <div className="lg:ml-72 min-h-screen">
        <div className="w-full min-h-screen flex flex-col gap-6 lg:gap-8 pt-6 lg:pt-8 pb-12 px-4 lg:px-8"
          style={{ backgroundColor: isModern ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.4)', backdropFilter: 'blur(12px)' }}>

          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
            <div className="lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-3 rounded-xl transition-all duration-300 border"
                style={{ borderColor: theme.border, color: theme.primary }}
              >
                <Menu size={24} />
              </button>
            </div>

            <div className="space-y-4 lg:space-y-6 flex-1 w-full">
              <div>
                <h1 className="font-bebas text-3xl sm:text-4xl lg:text-6xl xl:text-7xl tracking-wider"
                  style={{ color: theme.textPrimary }}>
                  DATA ATLIT
                </h1>
                <p className="font-plex text-base lg:text-lg mt-2" style={{ color: theme.textSecondary }}>
                  Kelola data dan informasi atlet terdaftar
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                <StatsCard
                  icon={Users}
                  title="Total Atlet"
                  value={totalAtlits.toString()}
                  theme={theme}
                  colorHex="#EF4444"
                />
                <StatsCard
                  icon={Award}
                  title="Laki-laki"
                  value={lakiLakiCount.toString()}
                  theme={theme}
                  colorHex="#3B82F6"
                />
                <StatsCard
                  icon={Award}
                  title="Perempuan"
                  value={perempuanCount.toString()}
                  theme={theme}
                  colorHex="#EC4899"
                />
                <StatsCard
                  icon={TrendingUp}
                  title="Rata-rata Umur"
                  value={`${avgAge} Tahun`}
                  theme={theme}
                  colorHex="#F59E0B"
                />
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="backdrop-blur-sm rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-xl border"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2"
                    size={18} style={{ color: theme.textSecondary }} />
                  <input
                    type="text"
                    placeholder="Cari nama atlet atau provinsi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 lg:pl-12 pr-4 py-2.5 lg:py-3 rounded-xl border-2 outline-none font-plex text-sm lg:text-base focus:border-red-500"
                    style={{
                      backgroundColor: theme.inputBg,
                      borderColor: theme.border,
                      color: theme.textPrimary
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setGenderFilter("all")}
                  className={`cursor-pointer px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl font-plex text-xs lg:text-sm transition-all duration-300 whitespace-nowrap`}
                  style={{
                    backgroundColor: genderFilter === "all" ? theme.primary : 'transparent',
                    color: genderFilter === "all" ? '#fff' : theme.textSecondary,
                    border: `1px solid ${genderFilter === "all" ? theme.primary : theme.border}`
                  }}
                >
                  Semua
                </button>
                <button
                  onClick={() => setGenderFilter("LAKI_LAKI")}
                  className={`cursor-pointer px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl font-plex text-xs lg:text-sm transition-all duration-300 whitespace-nowrap`}
                  style={{
                    backgroundColor: genderFilter === "LAKI_LAKI" ? '#3B82F6' : 'transparent',
                    color: genderFilter === "LAKI_LAKI" ? '#fff' : '#3B82F6',
                    border: genderFilter === "LAKI_LAKI" ? '1px solid #3B82F6' : '1px solid rgba(59, 130, 246, 0.2)'
                  }}
                >
                  Laki-laki
                </button>
                <button
                  onClick={() => setGenderFilter("PEREMPUAN")}
                  className={`cursor-pointer px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl font-plex text-xs lg:text-sm transition-all duration-300 whitespace-nowrap`}
                  style={{
                    backgroundColor: genderFilter === "PEREMPUAN" ? '#EC4899' : 'transparent',
                    color: genderFilter === "PEREMPUAN" ? '#fff' : '#EC4899',
                    border: genderFilter === "PEREMPUAN" ? '1px solid #EC4899' : '1px solid rgba(236, 72, 153, 0.2)'
                  }}
                >
                  Perempuan
                </button>
              </div>
            </div>

            {(searchTerm || genderFilter !== "all") && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.border }}>
                <div className="flex flex-wrap gap-2 items-center text-sm">
                  <span className="font-plex" style={{ color: theme.textSecondary }}>Filter aktif:</span>
                  {searchTerm && (
                    <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded-lg font-plex">
                      "{searchTerm}"
                    </span>
                  )}
                  {genderFilter !== "all" && (
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded-lg font-plex">
                      {genderFilter === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setGenderFilter("all");
                    }}
                    className="ml-2 text-xs hover:underline"
                    style={{ color: theme.primary }}
                  >
                    Clear filter
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table Section */}
          <div className="backdrop-blur-sm rounded-2xl lg:rounded-3xl p-4 lg:p-6 xl:p-8 shadow-xl border"
            style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 lg:gap-4 mb-4 lg:mb-6">
              <div className="flex gap-3 lg:gap-4 items-center">
                <div className="p-2 rounded-xl" style={{ backgroundColor: theme.primary + '20' }}>
                  <Users size={18} style={{ color: theme.primary }} />
                </div>
                <div>
                  <h2 className="font-bebas text-xl lg:text-2xl tracking-wide" style={{ color: theme.textPrimary }}>
                    DAFTAR ATLET
                  </h2>
                  <p className="font-plex text-sm" style={{ color: theme.textSecondary }}>
                    Menampilkan {paginatedAtlits.length} dari {filteredAtlits.length} atlet
                  </p>
                </div>
              </div>
              <div className="flex gap-2 lg:gap-3">
                <button
                  onClick={() => navigate('/dashboard/TambahAtlit')}
                  className="font-plex font-medium px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 flex justify-center items-center cursor-pointer text-white shadow-lg gap-2 text-sm lg:text-base border-0"
                  style={{ backgroundColor: theme.primary }}
                >
                  <UserPlus size={18} />
                  <span className="hidden sm:inline">Tambah Atlit</span>
                  <span className="sm:hidden">Tambah</span>
                </button>
              </div>
            </div>

            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: theme.primary }}></div>
                <p className="font-plex mt-2" style={{ color: theme.textSecondary }}>Memuat data...</p>
              </div>
            )}

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-hidden rounded-2xl border" style={{ borderColor: theme.border }}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-white" style={{ background: theme.primary }}>
                      <th className="px-6 py-4 text-left font-bebas text-2xl tracking-wide">NAMA</th>
                      <th className="px-6 py-4 text-center font-bebas text-2xl tracking-wide">PROVINSI</th>
                      <th className="px-6 py-4 text-center font-bebas text-2xl tracking-wide">GENDER</th>
                      <th className="px-6 py-4 text-center font-bebas text-2xl tracking-wide">UMUR</th>
                      <th className="px-6 py-4 text-center font-bebas text-2xl tracking-wide">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: theme.border }}>
                    {paginatedAtlits.map((atlit, index) => (
                      <tr
                        key={atlit.id_atlet}
                        className={`transition-all duration-200 cursor-pointer hover:bg-opacity-50`}
                        style={{ backgroundColor: index % 2 === 0 ? theme.bg + '40' : 'transparent' }}
                        onClick={() => navigate(`/dashboard/atlit/${atlit.id_atlet}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-white font-bebas shadow-lg"
                              style={{ backgroundColor: theme.primary }}>
                              {atlit.pas_foto ? (
                                <img
                                  src={getPhotoUrl(atlit.pas_foto)}
                                  alt={`Foto ${atlit.nama_atlet}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const sibling = target.nextElementSibling as HTMLElement;
                                    if (sibling) sibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <span
                                className={`w-full h-full flex items-center justify-center ${atlit.pas_foto ? 'hidden' : ''}`}
                                style={{ display: atlit.pas_foto ? 'none' : 'flex' }}
                              >
                                {atlit.nama_atlet.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-plex font-semibold" style={{ color: theme.textPrimary }}>{atlit.nama_atlet}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-plex" style={{ color: theme.textSecondary }}>{atlit.provinsi || "-"}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-plex font-medium ${atlit.jenis_kelamin === "LAKI_LAKI"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-pink-100 text-pink-600"
                              }`}
                          >
                            {atlit.jenis_kelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-plex font-medium" style={{ color: theme.textSecondary }}>{atlit.age} Tahun</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/dashboard/atlit/${atlit.id_atlet}`);
                              }}
                              className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all duration-200"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
              {paginatedAtlits.map((atlit) => (
                <div
                  key={atlit.id_atlet}
                  className="rounded-xl p-4 shadow-md border transition-all duration-200 hover:shadow-lg cursor-pointer"
                  style={{ backgroundColor: theme.cardBg, borderColor: theme.border }}
                  onClick={() => navigate(`/dashboard/atlit/${atlit.id_atlet}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center text-white font-bebas text-lg shadow-lg"
                        style={{ backgroundColor: theme.primary }}>
                        {atlit.pas_foto ? (
                          <img
                            src={getPhotoUrl(atlit.pas_foto)}
                            alt={`Foto ${atlit.nama_atlet}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const sibling = target.nextElementSibling as HTMLElement;
                              if (sibling) sibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span
                          className={`w-full h-full flex items-center justify-center ${atlit.pas_foto ? 'hidden' : ''}`}
                          style={{ display: atlit.pas_foto ? 'none' : 'flex' }}
                        >
                          {atlit.nama_atlet.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-plex font-semibold truncate" style={{ color: theme.textPrimary }}>{atlit.nama_atlet}</p>
                        <p className="font-plex text-sm" style={{ color: theme.textSecondary }}>{atlit.provinsi || "Tidak diketahui"}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-plex font-medium ${atlit.jenis_kelamin === "LAKI_LAKI"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-pink-100 text-pink-600"
                              }`}
                          >
                            {atlit.jenis_kelamin === "LAKI_LAKI" ? "L" : "P"}
                          </span>
                          <span className="font-plex text-xs" style={{ color: theme.textSecondary }}>{atlit.age} tahun</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/atlit/${atlit.id_atlet}`);
                      }}
                      className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all duration-200"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {!loading && filteredAtlits.length === 0 && (
              <div className="text-center py-8 lg:py-12">
                <Users className="mx-auto mb-4" size={40} style={{ color: theme.textSecondary }} />
                <p className="font-plex" style={{ color: theme.textSecondary }}>
                  {atlits.length === 0
                    ? "Belum ada atlet yang terdaftar"
                    : "Tidak ada atlet yang sesuai dengan filter"
                  }
                </p>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && filteredAtlits.length > 0 && totalPages > 1 && (
              <div className="mt-6 lg:mt-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="font-plex text-sm" style={{ color: theme.textSecondary }}>
                    Halaman {currentPage} dari {totalPages}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className="p-2 lg:p-2.5 rounded-lg border bg-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      style={{
                        borderColor: theme.border,
                        color: theme.textPrimary,
                        backgroundColor: theme.bg
                      }}
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <div className="flex gap-1 lg:gap-2 max-w-xs overflow-x-auto">
                      {getPageNumbers().map((page, index) => (
                        <button
                          key={index}
                          onClick={() => typeof page === 'number' && handlePageChange(page)}
                          disabled={page === '...'}
                          className={`px-3 lg:px-4 py-2 lg:py-2.5 rounded-lg font-plex text-sm transition-all duration-200 whitespace-nowrap`}
                          style={{
                            backgroundColor: page === currentPage ? theme.primary : 'transparent',
                            color: page === currentPage ? '#fff' : theme.textPrimary,
                            border: page === currentPage ? 'none' : `1px solid ${theme.border}`
                          }}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className="p-2 lg:p-2.5 rounded-lg border bg-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      style={{
                        borderColor: theme.border,
                        color: theme.textPrimary,
                        backgroundColor: theme.bg
                      }}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="lg:hidden z-50">
            <NavbarDashboard mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
};

export default DataAtlit;
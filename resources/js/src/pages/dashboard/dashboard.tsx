import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarDashboard from "../../components/navbar/navbarDashboard";
import {
  Trophy,
  Users,
  Calendar,
  TrendingUp,
  Video,
  Activity,
  ArrowRight,
  Medal,
  Clock,
  Target,
  Zap,
  ChevronRight,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/authContext';
import { useKompetisi } from "../../context/KompetisiContext";
import { useDojang } from "../../context/dojangContext";
import { useQuery } from '@tanstack/react-query';
import apiClient from "../../utils/apiClient";

interface StatsCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  value: string;
  theme: any;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, title, value, theme }) => (
  <div className="backdrop-blur-sm rounded-2xl p-6 shadow-lg border transition-all duration-300 hover:scale-[1.02]"
    style={{
      backgroundColor: theme.cardBg,
      borderColor: theme.border,
      boxShadow: theme.shadow
    }}
  >
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-xl" style={{ backgroundColor: theme.primary + '20' }}>
        <Icon size={24} style={{ color: theme.primary }} />
      </div>
      <div>
        <h3 className="font-plex text-sm" style={{ color: theme.textSecondary }}>{title}</h3>
        <p className="font-bebas text-2xl" style={{ color: theme.textPrimary }}>{value}</p>
      </div>
    </div>
  </div>
);

const QuickActionCard: React.FC<{
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  onClick: () => void;
  accentColor: string;
  theme: any;
}> = ({ icon: Icon, title, description, onClick, accentColor, theme }) => (
  <button
    onClick={onClick}
    className="w-full text-left p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl group"
    style={{
      backgroundColor: theme.cardBg,
      borderColor: theme.border,
      boxShadow: theme.shadow
    }}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl transition-colors duration-300`}
        style={{
          backgroundColor: accentColor + '20',
          color: accentColor
        }}>
        <Icon size={24} />
      </div>
      <div className={`p-2 rounded-full transition-transform duration-300 group-hover:translate-x-1`}
        style={{ backgroundColor: theme.bg }}>
        <ChevronRight size={16} style={{ color: theme.textSecondary }} />
      </div>
    </div>
    <h3 className="font-bebas text-xl mb-1" style={{ color: theme.textPrimary }}>{title}</h3>
    <p className="font-plex text-sm" style={{ color: theme.textSecondary }}>{description}</p>
  </button>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { kompetisiDetail } = useKompetisi();
  const { dojangDetail } = useDojang();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats', dojangDetail?.id],
    queryFn: async () => {
      // Return mock data if API fails or for now
      try {
        // const response = await apiClient.get('/dashboard/stats');
        // return response.data;
        return {
          total_atlit: "12",
          kompetisi_diikuti: "3",
          total_medali: "5",
          performa: "85%"
        };
      } catch (error) {
        return {
          total_atlit: "0",
          kompetisi_diikuti: "0",
          total_medali: "0",
          performa: "0%"
        };
      }
    },
    enabled: !!dojangDetail?.id
  });

  const templateType = kompetisiDetail?.template_type || 'default';
  const isDark = templateType === 'modern' || templateType === 'template_b';
  const isWhite = templateType === 'template_c';
  const primaryColor = kompetisiDetail?.primary_color || '#DC2626';

  const theme = {
    bg: isDark ? '#0a0a0a' : (isWhite ? '#FFFFFF' : '#FFF5F7'),
    cardBg: isDark ? '#111111' : '#FFFFFF',
    textPrimary: isDark ? '#FFFFFF' : '#1F2937',
    textSecondary: isDark ? '#A1A1AA' : '#6B7280',
    primary: primaryColor,
    border: isDark ? 'rgba(255,255,255,0.1)' : (isWhite ? 'rgba(0,0,0,0.05)' : 'rgba(255, 255, 255, 0.5)'),
    shadow: isDark ? '0 10px 15px -3px rgba(0, 0, 0, 0.5)' : '0 10px 15px -3px rgba(220, 38, 38, 0.05)',
    gradient: isDark ? 'linear-gradient(135deg, #111111 0%, #0a0a0a 100%)' : (isWhite ? 'linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)' : 'linear-gradient(to bottom right, #ffffff, #FFF5F7, #FFF0F0)')
  };

  return (
    <div className="min-h-screen w-full transition-colors duration-300"
      style={{ background: theme.gradient }}>
      <NavbarDashboard mobile={false} />

      <div className="lg:ml-72 min-h-screen transition-all duration-300">
        <main className="p-4 lg:p-8 space-y-8">
          {/* Header Section */}
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div>
              <h1 className="font-bebas text-4xl lg:text-5xl mb-2" style={{ color: theme.textPrimary }}>
                Halo, <span style={{ color: theme.primary }}>{user?.name || 'Coach'}</span>
              </h1>
              <p className="font-plex text-lg" style={{ color: theme.textSecondary }}>
                Selamat datang di Dashboard {dojangDetail?.name || 'Club'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-full text-sm font-medium border"
                style={{
                  backgroundColor: theme.cardBg,
                  color: theme.primary,
                  borderColor: theme.border
                }}>
                {kompetisiDetail?.name || 'Kompetisi Aktif'}
              </span>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              icon={Users}
              title="Total Atlit"
              value={stats?.total_atlit || "0"}
              theme={theme}
            />
            <StatsCard
              icon={Trophy}
              title="Kompetisi Diikuti"
              value={stats?.kompetisi_diikuti || "0"}
              theme={theme}
            />
            <StatsCard
              icon={Medal}
              title="Total Medali"
              value={stats?.total_medali || "0"}
              theme={theme}
            />
            <StatsCard
              icon={Activity}
              title="Performa Tim"
              value={stats?.performa || "0%"}
              theme={theme}
            />
          </div>

          {/* Quick Actions & Recent Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-bebas text-2xl" style={{ color: theme.textPrimary }}>Akses Cepat</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuickActionCard
                  icon={Users}
                  title="Daftarkan Atlit"
                  description="Tambah data atlit baru ke database"
                  onClick={() => navigate('/dashboard/atlit')}
                  accentColor="#3B82F6"
                  theme={theme}
                />
                <QuickActionCard
                  icon={Trophy}
                  title="Info Kompetisi"
                  description="Lihat detail dan jadwal kompetisi"
                  onClick={() => navigate('/dashboard/dataKompetisi')}
                  accentColor="#F59E0B"
                  theme={theme}
                />
                <QuickActionCard
                  icon={Target}
                  title="Bracket"
                  description="Lihat bagan pertandingan"
                  onClick={() => navigate('/dashboard/bracket-viewer')}
                  accentColor="#10B981"
                  theme={theme}
                />
                <QuickActionCard
                  icon={Video}
                  title="Live Steam"
                  description="Tonton pertandingan langsung"
                  onClick={() => navigate('/live-stream')}
                  accentColor="#EF4444"
                  theme={theme}
                />
              </div>
            </div>

            {/* Recent Activity / Notifications */}
            <div className="rounded-2xl border p-6 h-fit"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.border,
                boxShadow: theme.shadow
              }}>
              <div className="flex items-center gap-3 mb-6">
                <Bell size={24} style={{ color: theme.primary }} />
                <h2 className="font-bebas text-2xl" style={{ color: theme.textPrimary }}>Notifikasi</h2>
              </div>

              <div className="space-y-4">
                {/* Placeholder content for notifications */}
                <div className="p-4 rounded-xl transition-colors hover:bg-opacity-80 cursor-pointer"
                  style={{ backgroundColor: theme.bg }}>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full mt-2 shrink-0"
                      style={{ backgroundColor: theme.primary }} />
                    <div>
                      <p className="font-medium text-sm mb-1" style={{ color: theme.textPrimary }}>
                        Pendaftaran Dibuka
                      </p>
                      <p className="text-xs" style={{ color: theme.textSecondary }}>
                        Pendaftaran untuk {kompetisiDetail?.name} telah dibuka. Segera daftarkan atlit Anda.
                      </p>
                      <p className="text-[10px] mt-2" style={{ color: theme.textSecondary }}>2 jam yang lalu</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl transition-colors hover:bg-opacity-80 cursor-pointer"
                  style={{ backgroundColor: theme.bg }}>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full mt-2 shrink-0 bg-blue-500" />
                    <div>
                      <p className="font-medium text-sm mb-1" style={{ color: theme.textPrimary }}>
                        Jadwal Pertandingan
                      </p>
                      <p className="text-xs" style={{ color: theme.textSecondary }}>
                        Jadwal pertandingan terbaru telah dirilis. Cek menu Bracket.
                      </p>
                      <p className="text-[10px] mt-2" style={{ color: theme.textSecondary }}>1 hari yang lalu</p>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 py-3 rounded-xl font-medium text-sm transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: theme.primary + '10',
                  color: theme.primary
                }}>
                Lihat Semua Notifikasi
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Menu Button - Fixed Position */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-4 rounded-full shadow-lg text-white transition-transform hover:scale-110"
          style={{ backgroundColor: theme.primary }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden relative z-50">
          <NavbarDashboard mobile={true} onClose={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
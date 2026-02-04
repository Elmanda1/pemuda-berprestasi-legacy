import { useNavigate, useLocation } from "react-router-dom";
import { X, ArrowLeft, Home, Users, Trophy, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/authContext'
import { useKompetisi } from "../../context/KompetisiContext";

interface NavbarProps {
  mobile?: boolean;
  onClose?: () => void;
}

const NavbarDashboard: React.FC<NavbarProps> = ({ mobile = false, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { kompetisiDetail } = useKompetisi();


  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose && mobile) onClose(); // Close mobile menu after navigation
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    {
      path: '/dashboard/dojang',
      label: 'Data Dojang',
      icon: Home,
      exact: false
    },
    {
      path: '/dashboard/atlit',
      label: 'Data Atlit',
      icon: Users,
      exact: false
    },
    {
      path: '/dashboard/dataKompetisi',
      label: 'Data Kompetisi',
      icon: Trophy,
      exact: false
    },
    // ⭐ TAMBAHKAN INI
    {
      path: '/dashboard/bracket-viewer',
      label: 'Lihat Bracket',
      icon: Trophy, // atau import { GitBranch } from 'lucide-react'
      exact: false
    }
  ];

  const checkIsActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path) && path !== '/dashboard';
  };

  const templateType = kompetisiDetail?.template_type || 'default';
  const isDark = templateType === 'modern' || templateType === 'template_b';
  const isWhite = templateType === 'template_c';
  const primaryColor = kompetisiDetail?.primary_color || '#DC2626';

  const theme = {
    bg: isDark ? '#111111' : '#ffffff',
    headerBg: isDark ? '#0a0a0a' : (isWhite ? '#ffffff' : '#F5FBEF'),
    textPrimary: isDark ? '#e5e7eb' : (isWhite ? '#111111' : '#990D35'),
    textSecondary: isDark ? '#9ca3af' : (isWhite ? '#4B5563' : '#6B7280'),
    activeBg: isDark ? primaryColor : (isWhite ? primaryColor : '#990D35'),
    activeText: '#ffffff',
    border: isDark ? '#374151' : '#E5E7EB',
    hoverBg: isDark ? primaryColor : (isWhite ? primaryColor + '15' : '#990D35'),
    hoverText: isDark ? '#ffffff' : (isWhite ? primaryColor : '#F5FBEF'),
    titleColor: isDark ? '#ffffff' : (isWhite ? '#111111' : '#050505'),
    accentColor: primaryColor
  };

  return (
    <>
      {/* Overlay for mobile */}
      {mobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${mobile
          ? "fixed left-0 top-0 h-full w-72 shadow-2xl z-50 transform transition-transform duration-300"
          : "hidden lg:block w-72 h-screen shadow-2xl fixed left-0 top-0 z-30"
        }
      `} style={{ backgroundColor: theme.bg }}>

        {/* Header */}
        <div className="p-6 border-b" style={{ backgroundColor: theme.headerBg, borderColor: theme.border }}>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/')}
              className="cursor-pointer flex items-center gap-2 transition-colors duration-200"
              style={{
                color: theme.textPrimary,
                fontFamily: 'IBM Plex Sans, sans-serif'
              }}
              title="Kembali ke Beranda"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Beranda</span>
            </button>

            {mobile && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                title="Tutup Menu"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <div className="text-center">
            <h1 className="leading-tight" style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '32px',
              color: theme.titleColor
            }}>
              DASHBOARD<br />
              <span style={{ color: theme.accentColor }}>PELATIH</span>
            </h1>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isItemActive = checkIsActive(item.path, item.exact);

            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-all duration-200
                  ${isItemActive
                    ? 'shadow-lg'
                    : 'border border-transparent hover:border-red-200'
                  }
                `}
                style={{
                  fontFamily: 'IBM Plex Sans, sans-serif',
                  backgroundColor: isItemActive ? theme.activeBg : 'transparent',
                  color: isItemActive ? theme.activeText : theme.textPrimary,
                  ...(isItemActive ? {} : {
                    ':hover': {
                      backgroundColor: theme.hoverBg,
                      color: theme.hoverText
                    }
                  })
                }}
                onMouseEnter={(e) => {
                  if (!isItemActive) {
                    e.currentTarget.style.backgroundColor = theme.hoverBg;
                    e.currentTarget.style.color = theme.hoverText;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isItemActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = theme.textPrimary;
                  }
                }}
                title={item.label}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t space-y-4" style={{ borderColor: theme.border }}>
          {/* Settings Button */}
          <button
            onClick={() => handleNavigation('/settings')}
            className={`
              w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-all duration-200
              ${checkIsActive('/settings')
                ? 'shadow-lg'
                : 'border border-gray-200'
              }
            `}
            style={{
              fontFamily: 'IBM Plex Sans, sans-serif',
              backgroundColor: checkIsActive('/settings') ? '#6B7280' : 'transparent',
              color: checkIsActive('/settings') ? '#F5FBEF' : theme.textSecondary,
              borderColor: theme.border
            }}
            onMouseEnter={(e) => {
              if (!checkIsActive('/settings')) {
                e.currentTarget.style.backgroundColor = '#6B7280';
                e.currentTarget.style.color = '#F5FBEF';
              }
            }}
            onMouseLeave={(e) => {
              if (!checkIsActive('/settings')) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme.textSecondary;
              }
            }}
            title="Pengaturan"
          >
            <Settings size={20} />
            <span>Pengaturan</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-all duration-200 border"
            style={{
              fontFamily: 'IBM Plex Sans, sans-serif',
              color: theme.textPrimary,
              borderColor: theme.textPrimary
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.hoverBg;
              e.currentTarget.style.color = theme.hoverText;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = theme.textPrimary;
            }}
            title="Keluar"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>

          {/* Copyright */}
          <div className="text-center pt-2">
            <p className="text-xs" style={{ color: theme.textSecondary, fontFamily: 'IBM Plex Sans, sans-serif' }}>
              © 2025 CJV Management
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarDashboard;

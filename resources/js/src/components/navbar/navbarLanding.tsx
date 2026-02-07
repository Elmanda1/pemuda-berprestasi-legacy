  import {
  ChevronDown,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/authContext";
import { useKompetisi } from "../../context/KompetisiContext";

const NavbarLanding = ({
  onLogoutRequest,
}: {
  onLogoutRequest: () => void;
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { user } = useAuth();
  const { kompetisiDetail } = useKompetisi();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsBurgerOpen(false);
    setShowDropdown(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isBurgerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isBurgerOpen]);

  // Dynamic styling - HANYA MERAH DAN PUTIH dengan animasi smooth
  const getNavbarStyles = () => {
    const templateType = kompetisiDetail?.template_type || 'default';
    const primaryColor = kompetisiDetail?.primary_color || '#DC2626';

    // MODERN DARK THEME CHECK
    if (templateType === 'modern' || templateType === 'template_b' || templateType === 'template_c') {
      return {
        bg: isScrolled ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-gray-800" : "bg-transparent",
        text: isScrolled ? "text-gray-300" : "text-white", // Ensure text is white when transparent (Hero overlay)
        logo: "text-white",
        buttonBorder: isScrolled ? "border-white/20" : "border-white/20",
        buttonText: "text-white",
        buttonBg: `bg-[${primaryColor}] hover:opacity-90 text-white shadow-[0_0_15px_${primaryColor}66]`,
        buttonStyle: { backgroundColor: primaryColor },
        hoverText: `hover:text-[${primaryColor}] transition-colors`,
        dropdownBg: "bg-[#111] border border-gray-800 text-white",
      }
    }

    if (isHomePage && !isScrolled) {
      return {
        bg: "bg-transparent",
        text: "text-white",
        logo: "text-white drop-shadow-lg",
        buttonBorder: "border-white/80",
        buttonText: "text-white",
        buttonBg: `bg-white text-[${primaryColor}] hover:bg-white/90 hover:scale-105`,
        buttonStyle: { color: primaryColor },
        hoverText: "hover:text-white/80 ",
        dropdownBg: "bg-white/95 backdrop-blur-md",
      };
    }
    return {
      bg: isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white/90",
      text: `text-[${primaryColor}]`,
      textStyle: { color: primaryColor },
      logo: `text-[${primaryColor}]`,
      logoStyle: { color: primaryColor },
      buttonBorder: `border-[${primaryColor}]/80`,
      buttonBorderStyle: { borderColor: primaryColor + 'cc' },
      buttonText: `text-[${primaryColor}]`,
      buttonBg: `bg-[${primaryColor}] text-white hover:opacity-90 hover:scale-105`,
      buttonBgStyle: { backgroundColor: primaryColor },
      hoverText: "hover:opacity-80 ",
      dropdownBg: "bg-white/95 backdrop-blur-md",
    };
  };

  const styles = getNavbarStyles();

  const navItems = [
    { to: "/", label: "Beranda" },
    { to: "/events", label: "Event" },
    { to: "/tutorial", label: "Tutorial" },
    // { to: "/pertandingan", label: "Pertandingan" },
  ];

  const getDashboardLink = () => {
    if (user?.role === "PELATIH")
      return { to: "/dashboard/dojang", label: "Dashboard", icon: Home };
    if (user?.role === "ADMIN_PENYELENGGARA" || user?.role === "SUPER_ADMIN")
      return { to: "/admin/statistik", label: "Dashboard", icon: Home };
    if (user?.role === "ADMIN_KOMPETISI")
      return { to: "/admin-kompetisi", label: "Dashboard", icon: Home };
    return { to: "/", label: "Dashboard", icon: Home }; // fallback
  };

  const userMenuItems = [
    getDashboardLink(),
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Navbar - Tanpa border bottom */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${styles.bg}`}
      >
        <div className="w-full px-[5%] sm:px-[8%] lg:px-[10%] py-2">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link
              to="/"
              className={`text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bebas tracking-wider uppercase transition-all duration-300 ease-out hover:scale-105`}
              style={styles.logoStyle}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {kompetisiDetail?.nama_event || "CJV Management"}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-1 xl:space-x-8 flex-wrap justify-center">
              {navItems.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`text-sm xl:text-xl relative px-2 xl:px-4 py-2 font-plex font-medium transition-all duration-300 ease-out whitespace-nowrap ${location.pathname === to
                    ? "font-semibold"
                    : styles.hoverText
                    } group`}
                  style={location.pathname === to ? { color: kompetisiDetail?.primary_color || '#dc2626' } : (styles.textStyle || {})}
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {label}
                  {/* Animated underline */}
                  <span
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300 ease-out ${location.pathname === to
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                      }`}
                    style={{ backgroundColor: kompetisiDetail?.primary_color || '#dc2626' }}
                  />
                </Link>
              ))}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden xl:flex items-center">
              {!user ? (
                <div className="flex items-center space-x-2 xl:space-x-4">
                  <Link
                    to="/register"
                    className={`px-4 xl:px-6 py-2 xl:py-2.5 text-xs xl:text-2xl border-2 font-plex rounded-lg transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg`}
                    style={{ ...styles.buttonBorderStyle, ...styles.buttonBgStyle, color: '#fff' }}
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className={`px-4 xl:px-8 py-2 xl:py-2.5 text-xs xl:text-2xl border-2 font-plex rounded-lg transition-all duration-300 ease-out hover:shadow-lg`}
                    style={{ ...styles.buttonBorderStyle, backgroundColor: '#fff', ...styles.buttonBgStyle }}
                  >
                    Login
                  </Link>
                </div>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`flex items-center space-x-1 xl:space-x-2 px-2 xl:px-4 py-2 xl:py-2.5 text-xs xl:text-2xl border-2 font-plex rounded-lg transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg group`}
                    style={styles.buttonBorderStyle}
                  >
                    <User
                      size={18}
                      className="transition-transform duration-300 group-hover:scale-110 xl:w-6 xl:h-6"
                      style={styles.textStyle}
                    />
                    <span className="max-w-24 xl:max-w-48 truncate" style={styles.textStyle}>
                      {user?.super_admin?.nama || user?.admin_penyelenggara?.nama || user?.pelatih?.nama_pelatih || user?.admin_kompetisi?.nama || "User"}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-all duration-300 ease-out ${showDropdown ? "rotate-180" : ""
                        } group-hover:scale-110 xl:w-[18px] xl:h-[18px]`}
                      style={styles.textStyle}
                    />
                  </button>

                  {/* User Dropdown - dengan animasi smooth */}
                  {showDropdown && (
                    <div
                      className={`absolute right-0 mt-2 w-52 ${styles.dropdownBg} rounded-lg border border-gray-200/50 shadow-2xl overflow-hidden z-50 transform transition-all duration-300 ease-out animate-in fade-in slide-in-from-top-2`}
                    >
                      {userMenuItems.map(({ to, label, icon: Icon }) => (
                        <Link
                          key={to}
                          to={to}
                          className="text-xl flex items-center space-x-3 px-4 py-3 text-red font-plex transition-all duration-200 ease-out hover:bg-red hover:text-white group"
                          onClick={() => setShowDropdown(false)}
                        >
                          <Icon
                            size={16}
                            className="transition-transform duration-200 group-hover:scale-110"
                          />
                          <span>{label}</span>
                        </Link>
                      ))}
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onLogoutRequest();
                        }}
                        className="text-xl flex items-center space-x-3 w-full px-4 py-3 text-red font-plex transition-all duration-200 ease-out hover:bg-red hover:text-white group"
                      >
                        <LogOut
                          size={16}
                          className="transition-transform duration-200 group-hover:scale-110"
                        />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsBurgerOpen(!isBurgerOpen)}
              className={`xl:hidden p-3 hover:opacity-90 rounded-xl transition-all duration-300 ease-out hover:scale-110 hover:shadow-lg group`}
              style={styles.textStyle}
            >
              <div className="relative w-6 h-6">
                <Menu
                  size={24}
                  className={`absolute inset-0 transition-all duration-300 ease-out ${isBurgerOpen
                    ? "opacity-0 rotate-180 scale-75"
                    : "opacity-100 rotate-0 scale-100"
                    }`}
                />
                <X
                  size={24}
                  className={`absolute inset-0 transition-all duration-300 ease-out ${isBurgerOpen
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 rotate-180 scale-75"
                    }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay dengan animasi smooth - LEBIH KOMPAK */}
      <div
        className={`fixed inset-0 z-40 xl:hidden transition-all duration-500 ease-out ${isBurgerOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      >
        {/* Background overlay */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ease-out ${isBurgerOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setIsBurgerOpen(false)}
        />

        {/* Mobile menu panel - UKURAN DIPERKECIL */}
        <div
          className={`absolute top-20 md:top-24 left-4 right-4 sm:left-8 sm:right-8 bg-white rounded-xl shadow-2xl transform transition-all duration-500 ease-out ${isBurgerOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
            }`}
        >
          <div className="px-4 py-5 max-h-[calc(100vh-6rem)] overflow-y-auto">
            {/* Mobile Navigation Links - SPACING DIKURANGI */}
            <div className="space-y-1 mb-5">
              {navItems.map(({ to, label }, index) => (
                <Link
                  key={to}
                  to={to}
                  className={`block px-4 py-3 text-base font-plex font-medium rounded-lg transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-md ${location.pathname === to
                    ? "text-white shadow-lg"
                    : "hover:bg-gray-100"
                    }`}
                  style={{
                    ...(location.pathname === to ? { backgroundColor: kompetisiDetail?.primary_color || '#dc2626' } : { color: kompetisiDetail?.primary_color || '#dc2626' }),
                    transitionDelay: isBurgerOpen ? `${index * 100}ms` : "0ms",
                  }}
                  onClick={() => {
                    setIsBurgerOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Mobile Auth Section - BUTTON DIPERBAIKI */}
            <div className="pt-4 border-t border-gray-200">
              {!user ? (
                <div className="space-y-3">
                  <Link
                    to="/register"
                    className="block w-full py-4 text-lg text-center border-2 font-plex font-semibold rounded-xl hover:opacity-90 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg"
                    style={{ borderColor: kompetisiDetail?.primary_color || '#dc2626', color: kompetisiDetail?.primary_color || '#dc2626' }}
                    onClick={() => setIsBurgerOpen(false)}
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="block w-full py-4 text-lg text-center border-2 text-white font-plex font-semibold rounded-xl hover:opacity-90 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg"
                    style={{ borderColor: kompetisiDetail?.primary_color || '#dc2626', backgroundColor: kompetisiDetail?.primary_color || '#dc2626' }}
                    onClick={() => setIsBurgerOpen(false)}
                  >
                    Login
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* User Info - UKURAN DIPERKECIL */}
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: kompetisiDetail?.primary_color || '#dc2626' }}>
                      <User size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-plex font-semibold truncate text-sm" style={{ color: kompetisiDetail?.primary_color || '#dc2626' }}>
                        {user?.super_admin?.nama || user?.admin_penyelenggara?.nama || user?.pelatih?.nama_pelatih || user?.admin_kompetisi?.nama || "User"}
                      </p>
                      <p className="text-xs text-gray-500">Logged in</p>
                    </div>
                  </div>

                  {/* User Menu Items - SPACING DIKURANGI */}
                  <div className="space-y-1">
                    {userMenuItems.map(({ to, label, icon: Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        className="flex items-center space-x-3 px-4 py-3 font-plex rounded-lg hover:bg-gray-100 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-md group"
                        style={{ color: kompetisiDetail?.primary_color || '#dc2626' }}
                        onClick={() => setIsBurgerOpen(false)}
                      >
                        <Icon
                          size={16}
                          className="transition-transform duration-300 group-hover:scale-110"
                        />
                        <span className="text-base">{label}</span>
                      </Link>
                    ))}

                    {/* Logout Button - PADDING DIKURANGI */}
                    <button
                      onClick={() => {
                        setIsBurgerOpen(false);
                        onLogoutRequest();
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 font-plex rounded-lg hover:bg-gray-100 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-md border-t border-gray-200 mt-4 pt-3 group"
                      style={{ color: kompetisiDetail?.primary_color || '#dc2626' }}
                    >
                      <LogOut
                        size={16}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                      <span className="text-base">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarLanding;

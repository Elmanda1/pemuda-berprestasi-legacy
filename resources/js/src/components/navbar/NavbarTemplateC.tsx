import {
    Menu,
    X,
    User,
    Settings,
    LogOut,
    Home,
    Medal,
    Calendar,
    HelpCircle,
    PlayCircle,
    Trophy,
    ChevronDown,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/authContext";
import { useKompetisi } from "../../context/KompetisiContext";

const NavbarTemplateC = ({
    onLogoutRequest,
}: {
    onLogoutRequest: () => void;
}) => {
    const location = useLocation();
    const { user } = useAuth();
    const { kompetisiDetail } = useKompetisi();
    const [showDropdown, setShowDropdown] = useState(false);
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getKompetisiId = () => {
        const storedId = localStorage.getItem('id_kompetisi');
        return storedId || '1';
    };

    const idKompetisi = getKompetisiId();

    // Parse modules_enabled
    const modules: any = (() => {
        try {
            if (typeof kompetisiDetail?.modules_enabled === 'string') {
                return JSON.parse(kompetisiDetail.modules_enabled);
            }
            return kompetisiDetail?.modules_enabled || {};
        } catch (e) {
            return {};
        }
    })();

    const isModuleEnabled = (key: string) => {
        return modules[key] !== false;
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setIsBurgerOpen(false);
        setShowDropdown(false);
    }, [location]);

    useEffect(() => {
        document.body.style.overflow = isBurgerOpen ? "hidden" : "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [isBurgerOpen]);

    const navItems = [
        { to: "/event/home", label: "Beranda", icon: Home, module: 'home' },
        { to: "/event/timeline", label: "Timeline", icon: Calendar, module: 'timeline' },
        { to: "/event/faq", label: "FAQ", icon: HelpCircle, module: 'faq' },
        { to: "/event/live-streaming", label: "Live Streaming", icon: PlayCircle, module: 'live_streaming' },
        { to: `/event/medal-tally/${idKompetisi}`, label: "Perolehan Medali", icon: Trophy, module: 'medal_tally' },
    ].filter(item => isModuleEnabled(item.module));

    const getDashboardLink = () => {
        if (user?.role === "PELATIH") return { to: "/dashboard/dojang", label: "Dashboard", icon: Home };
        if (user?.role === "ADMIN") return { to: "/admin/validasi-peserta", label: "Dashboard", icon: Home };
        if (user?.role === "ADMIN_KOMPETISI") return { to: "/admin-kompetisi", label: "Dashboard", icon: Home };
        return { to: "/", label: "Dashboard", icon: Home };
    };

    const userMenuItems = [
        getDashboardLink(),
        { to: "/settings", label: "Settings", icon: Settings },
    ];

    const primaryColor = kompetisiDetail?.primary_color || '#DC2626';

    const getNavbarStyles = () => {
        return {
            bg: isScrolled ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm" : "bg-white border-b border-transparent",
            text: "text-gray-600",
            activeText: `text-[${primaryColor}] font-bold`,
            logoStyle: { color: primaryColor },
            buttonText: `text-[${primaryColor}]`,
            buttonStyle: { backgroundColor: primaryColor },
            hoverText: `hover:text-[${primaryColor}] transition-all`,
            activeLinkStyle: { color: primaryColor },
            dropdownBg: "bg-white border border-gray-100 text-gray-700",
        };
    };

    const styles = getNavbarStyles();

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${styles.bg}`}>
            <div className="container mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/event/home"
                    className="flex items-center gap-2 group"
                >
                    <span className="text-2xl md:text-3xl font-bebas tracking-wider" style={styles.logoStyle}>
                        {kompetisiDetail?.nama_event || "CHAMPIONSHIP"}
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden xl:flex items-center gap-8">
                    {navItems.map(({ to, label, icon: Icon }) => {
                        const isActive = location.pathname === to;
                        return (
                            <Link
                                key={to}
                                to={to}
                                className={`relative py-2 text-sm font-bold tracking-wide transition-all duration-300 ${isActive ? styles.activeText : "text-gray-500 hover:text-gray-900"}`}
                                style={isActive ? styles.activeLinkStyle : {}}
                            >
                                <span className="flex items-center gap-2">
                                    {Icon && <Icon size={16} />}
                                    {label}
                                </span>
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                                )}
                            </Link>
                        );
                    })}

                    <div className="h-6 w-px bg-gray-200 mx-2" />

                    {!user ? (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors"
                            >
                                LOG IN
                            </Link>
                            <Link
                                to="/register"
                                className="px-6 py-2.5 text-sm font-bold text-white rounded-lg shadow-lg hover:opacity-90 transition-all transform hover:-translate-y-0.5"
                                style={styles.buttonStyle}
                            >
                                REGISTER
                            </Link>
                        </div>
                    ) : (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-all"
                            >
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-400 shadow-sm" style={{ color: primaryColor }}>
                                    <User size={18} />
                                </div>
                                <span className="text-sm font-bold text-gray-700 max-w-[120px] truncate">
                                    {user?.pelatih?.nama_pelatih ?? "USER"}
                                </span>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                            </button>

                            {showDropdown && (
                                <div className={`absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200`}>
                                    <div className="p-2 space-y-1">
                                        <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Signed in as</p>
                                            <p className="text-sm font-bold text-gray-900 truncate">{user?.pelatih?.nama_pelatih}</p>
                                        </div>
                                        {userMenuItems.map(({ to, label, icon: Icon }) => (
                                            <Link
                                                key={to}
                                                to={to}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:text-white rounded-lg transition-all group"
                                                onClick={() => setShowDropdown(false)}
                                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = primaryColor }}
                                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                                            >
                                                <Icon size={18} />
                                                {label}
                                            </Link>
                                        ))}
                                        <button
                                            onClick={onLogoutRequest}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <LogOut size={18} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsBurgerOpen(!isBurgerOpen)}
                    className="xl:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    {isBurgerOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 top-16 md:top-20 z-[90] xl:hidden transition-all duration-500 ${isBurgerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <div className={`absolute inset-0 bg-white/60 backdrop-blur-md transition-all duration-500 ${isBurgerOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsBurgerOpen(false)} />
                <div className={`absolute right-0 top-0 bottom-0 w-[300px] bg-white shadow-2xl transition-transform duration-500 ease-out transform ${isBurgerOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="h-full flex flex-col p-6">
                        <div className="flex-1 space-y-2">
                            {navItems.map(({ to, label, icon: Icon }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`flex items-center gap-4 px-4 py-4 text-base font-bold rounded-xl transition-all ${location.pathname === to ? "text-white shadow-lg" : "text-gray-600 hover:bg-gray-50"}`}
                                    style={location.pathname === to ? { backgroundColor: primaryColor } : {}}
                                >
                                    {Icon && <Icon size={20} />}
                                    {label}
                                </Link>
                            ))}
                        </div>

                        <div className="mt-auto pt-6 border-t border-gray-100">
                            {!user ? (
                                <div className="grid gap-3">
                                    <Link to="/login" className="w-full py-3 text-center rounded-xl bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 transition-all border border-gray-100">
                                        LOG IN
                                    </Link>
                                    <Link to="/register" className="w-full py-3 text-center rounded-xl text-white font-bold shadow-lg transition-all" style={{ backgroundColor: primaryColor }}>
                                        REGISTER NOW
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 px-2">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 border-2 border-white text-gray-400 shadow-lg" style={{ color: primaryColor }}>
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <p className="text-gray-900 font-bold">{user.pelatih?.nama_pelatih || "USER"}</p>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Online</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {userMenuItems.map(({ to, label, icon: Icon }) => (
                                            <Link key={to} to={to} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all border border-gray-100 group">
                                                <Icon size={20} className="transition-transform group-hover:scale-110" style={{ color: primaryColor }} />
                                                <span className="text-xs font-bold">{label}</span>
                                            </Link>
                                        ))}
                                        <button onClick={onLogoutRequest} className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 transition-all border border-red-100">
                                            <LogOut size={20} />
                                            <span className="text-xs font-bold">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavbarTemplateC;

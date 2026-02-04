import {
    ChevronDown,
    Menu,
    X,
    User,
    Settings,
    LogOut,
    Home,
    Medal,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/authContext";
import { useKompetisi } from "../../context/KompetisiContext";

const NavbarTemplateB = ({ onLogoutRequest }: { onLogoutRequest: () => void }) => {
    const location = useLocation();
    const { user } = useAuth();
    const { kompetisiDetail } = useKompetisi();
    const [showDropdown, setShowDropdown] = useState(false);
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Extract idKompetisi from URL for Medal Tally link
    const getKompetisiId = () => {
        const match = location.pathname.match(/\/event\/(?:pertandingan|medal-tally)\/(\d+)/);
        if (match) return match[1];
        const storedId = localStorage.getItem('currentKompetisiId');
        return storedId || '1';
    };

    const idKompetisi = getKompetisiId();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close dropdown logic
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setIsBurgerOpen(false);
        setShowDropdown(false);
    }, [location]);

    // Body scroll lock
    useEffect(() => {
        document.body.style.overflow = isBurgerOpen ? "hidden" : "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [isBurgerOpen]);

    const navItems = [
        { to: "/event/home", label: "Beranda", icon: Home },
        { to: "/event/timeline", label: "Timeline", icon: null },
        { to: "/event/faq", label: "FAQ", icon: null },
        { to: "/event/live-streaming", label: "Live Streaming", icon: null },
        { to: `/event/medal-tally/${idKompetisi}`, label: "Perolehan Medali", icon: Medal },
    ];

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

    // Modern Dark Theme Styles
    const getNavbarStyles = () => {
        return {
            bg: isScrolled ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-gray-800" : "bg-transparent",
            text: "text-gray-300",
            activeText: "text-white font-semibold",
            logo: "text-white",
            buttonBorder: "border-red-500",
            buttonText: "text-white",
            buttonBg: "bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]",
            hoverText: "hover:text-white transition-colors",
            dropdownBg: "bg-[#111] border border-gray-800 text-white",
        };
    };

    const styles = getNavbarStyles();

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${styles.bg}`}>
                <div className="w-full px-[5%] sm:px-[8%] lg:px-[10%] py-4">
                    <div className="flex justify-between items-center h-16 md:h-20">
                        {/* Logo */}
                        <Link
                            to="/"
                            className={`text-2xl lg:text-3xl ${styles.logo} font-bebas tracking-widest uppercase flex items-center gap-3 group`}
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        >
                            <div className="relative">
                                {kompetisiDetail?.logo_url && (
                                    <img src={kompetisiDetail.logo_url} alt="Logo" className="h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                                )}
                            </div>
                            <span className="hidden sm:block group-hover:text-red-500 transition-colors">
                                {kompetisiDetail?.nama_event || "CJV Management"}
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {navItems.filter(item => {
                                if (kompetisiDetail?.show_navbar === 0 || kompetisiDetail?.show_navbar === false) {
                                    return item.label === "Beranda";
                                }
                                return true;
                            }).map(({ to, label, icon: Icon }) => {
                                const isActive = location.pathname === to;
                                return (
                                    <Link
                                        key={to}
                                        to={to}
                                        className={`relative px-5 py-2 rounded-full font-plex text-sm tracking-wide transition-all duration-300 ${isActive ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"
                                            }`}
                                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                    >
                                        <span className="flex items-center gap-2 relative z-10">
                                            {Icon && <Icon size={16} className={isActive ? "text-red-500" : ""} />}
                                            {label}
                                        </span>
                                        {isActive && (
                                            <span className="absolute inset-0 rounded-full border border-white/10 shadow-[inner_0_0_10px_rgba(255,255,255,0.05)]" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Desktop Auth */}
                        <div className="hidden lg:flex items-center gap-4">
                            {!user ? (
                                <>
                                    <Link to="/login" className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className={`px-6 py-2.5 text-sm font-bold tracking-wide rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 ${styles.buttonBg}`}
                                    >
                                        REGISTER
                                    </Link>
                                </>
                            ) : (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-transparent group-hover:ring-red-500/50 transition-all">
                                            <User size={16} className="text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-300 group-hover:text-white max-w-[100px] truncate">
                                            {user?.pelatih?.nama_pelatih ?? "User"}
                                        </span>
                                        <ChevronDown size={14} className={`text-gray-500 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                                    </button>

                                    {/* Dropdown */}
                                    {showDropdown && (
                                        <div className={`absolute right-0 mt-3 w-56 ${styles.dropdownBg} rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200`}>
                                            <div className="p-2 space-y-1">
                                                {userMenuItems.map(({ to, label, icon: Icon }) => (
                                                    <Link
                                                        key={to}
                                                        to={to}
                                                        onClick={() => setShowDropdown(false)}
                                                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                                                    >
                                                        <Icon size={16} className="text-gray-500 group-hover:text-red-500 transition-colors" />
                                                        {label}
                                                    </Link>
                                                ))}
                                                <div className="h-px bg-gray-800 my-1" />
                                                <button
                                                    onClick={() => { setShowDropdown(false); onLogoutRequest(); }}
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <LogOut size={16} />
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
                            className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
                        >
                            {isBurgerOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${isBurgerOpen ? "visible" : "invisible"}`}>
                <div className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${isBurgerOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsBurgerOpen(false)} />

                <div className={`absolute top-0 right-0 w-3/4 max-w-sm h-full bg-[#111] border-l border-gray-800 shadow-2xl transform transition-transform duration-300 ease-out ${isBurgerOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-xl font-bebas tracking-widest text-white">MENU</span>
                            <button onClick={() => setIsBurgerOpen(false)} className="p-2 bg-white/5 rounded-full text-white hover:bg-red-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-2 flex-1 overflow-y-auto">
                            {navItems.filter(item => {
                                if (kompetisiDetail?.show_navbar === 0 || kompetisiDetail?.show_navbar === false) return item.label === "Beranda";
                                return true;
                            }).map(({ to, label, icon: Icon }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={() => setIsBurgerOpen(false)}
                                    className={`flex items-center gap-4 px-4 py-4 text-lg font-medium rounded-xl transition-all ${location.pathname === to ? "bg-red-600 text-white shadow-lg shadow-red-900/20" : "text-gray-400 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    {Icon && <Icon size={20} className={location.pathname === to ? "text-white" : "text-gray-500"} />}
                                    {label}
                                </Link>
                            ))}
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-800">
                            {!user ? (
                                <div className="grid gap-3">
                                    <Link to="/login" className="w-full py-3 text-center rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all">
                                        Login
                                    </Link>
                                    <Link to="/register" className="w-full py-3 text-center rounded-xl bg-gradient-to-r from-red-600 to-red-800 text-white font-bold shadow-lg hover:shadow-red-900/30 transition-all">
                                        Register Now
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 px-2">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-red-500 flex items-center justify-center text-white font-bold">
                                            <User size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{user.pelatih?.nama_pelatih || "User"}</p>
                                            <p className="text-xs text-gray-500">Online</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {userMenuItems.map(({ to, label, icon: Icon }) => (
                                            <Link key={to} to={to} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all">
                                                <Icon size={20} />
                                                <span className="text-xs">{label}</span>
                                            </Link>
                                        ))}
                                        <button onClick={onLogoutRequest} className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all">
                                            <LogOut size={20} />
                                            <span className="text-xs">Logout</span>
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

export default NavbarTemplateB;

import { Phone, Instagram, MapPin, Calendar, Clock, Trophy } from "lucide-react";
import sriwijaya from "../assets/logo/sriwijaya.png";
import heroLomba from "../assets/photos/heroLomba.png";
import UnifiedRegistration from "../components/registrationSteps/UnifiedRegistration";
import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";
import ketua from "../assets/photos/ketua.png";
import { Link } from "react-router-dom";
import { useKompetisi } from "../context/KompetisiContext";

const HomeTemplateB = () => {
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
    const { user } = useAuth();
    const { kompetisiDetail } = useKompetisi();

    const handleJoinClick = () => {
        if (user?.role != "PELATIH") {
            toast.error("Hanya pelatih yang bisa mendaftar kompetisi!");
            return;
        }
        setIsRegistrationOpen(true);
    };

    useEffect(() => {
        if (isRegistrationOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isRegistrationOpen]);

    return (
        <div className="min-h-screen w-full bg-black text-white selection:bg-yellow selection:text-black">
            {/* Hero Section - Modern Dark */}
            <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Dynamic Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 transform hover:scale-105"
                    style={{ backgroundImage: `url(${kompetisiDetail?.poster_image || heroLomba})` }}
                >
                    <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-[2px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                </div>

                <div className="relative z-10 container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 text-left">

                            {/* Title */}
                            <div className="space-y-2">
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bebas leading-[0.85] tracking-tight">
                                    <span className="text-white block">
                                        {kompetisiDetail?.nama_event || "Sriwijaya"}
                                    </span>
                                    <span style={{ color: kompetisiDetail?.primary_color || '#DC2626' }} className="block">
                                        Championship
                                    </span>
                                </h1>
                                <p className="text-xl md:text-2xl font-light text-gray-300 font-plex max-w-xl border-l-4 pl-6" style={{ borderColor: kompetisiDetail?.primary_color || '#DC2626' }}>
                                    {kompetisiDetail?.hero_description || "Wujudkan prestasi gemilang di panggung internasional."}
                                </p>
                            </div>

                            {/* Stats/Info Grid */}
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2" style={{ color: kompetisiDetail?.primary_color || '#DC2626' }}>
                                        <Calendar className="w-5 h-5" />
                                        <span className="font-bebas text-xl">Tanggal</span>
                                    </div>
                                    <p className="text-sm text-gray-400 font-plex">
                                        {kompetisiDetail?.timeline_data?.[3]?.time || "22 - 26 November 2025"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2" style={{ color: kompetisiDetail?.primary_color || '#DC2626' }}>
                                        <MapPin className="w-5 h-5" />
                                        <span className="font-bebas text-xl">Lokasi</span>
                                    </div>
                                    <p className="text-sm text-gray-400 font-plex truncate">
                                        {kompetisiDetail?.contact_venue_name || "GOR Jakabaring"}
                                    </p>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-wrap gap-4 pt-4">
                                {kompetisiDetail?.tipe_kompetisi !== 'MASTER' && (
                                    <button
                                        onClick={handleJoinClick}
                                        className="px-8 py-4 text-black font-bold font-plex rounded-none skew-x-[-10deg] hover:bg-white transition-colors duration-300 group"
                                        style={{ backgroundColor: kompetisiDetail?.primary_color || '#DC2626' }}
                                    >
                                        <span className="block skew-x-[10deg]">
                                            DAFTAR SEKARANG
                                        </span>
                                    </button>
                                )}
                                {kompetisiDetail?.tipe_kompetisi === 'MASTER' && (
                                    <div className="px-8 py-4 border border-white text-white font-bold font-plex rounded-none skew-x-[-10deg]">
                                        <span className="block skew-x-[10deg]">
                                            INFORMASI EVENT
                                        </span>
                                    </div>
                                )}
                                {kompetisiDetail?.tipe_kompetisi !== 'MASTER' && (kompetisiDetail?.show_antrian === 1 || !kompetisiDetail) && (
                                    <Link
                                        to={`/event/pertandingan/${kompetisiDetail?.id_kompetisi || 1}`}
                                        className="px-8 py-4 border border-white text-white font-bold font-plex rounded-none skew-x-[-10deg] hover:bg-white hover:text-black transition-all duration-300"
                                    >
                                        <span className="block skew-x-[10deg]">
                                            LIHAT ANTREAN
                                        </span>
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Logo/Graphic */}
                        <div className="hidden lg:flex justify-center items-center relative">
                            <div className="absolute inset-0 rounded-full blur-[100px] animate-pulse" style={{ backgroundColor: (kompetisiDetail?.primary_color || '#DC2626') + '33' }}></div>
                            <img
                                src={kompetisiDetail?.logo_url || sriwijaya}
                                alt="Logo"
                                className="relative z-10 w-96 h-96 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section - Modern Grid */}
            <section className="py-20 bg-stone-900 border-t border-white/10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 relative">
                            <div className="absolute -inset-4 border transform rotate-3" style={{ borderColor: (kompetisiDetail?.primary_color || '#DC2626') + '33' }}></div>
                            <div className="aspect-[4/5] relative overflow-hidden bg-gray-800 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                                <img
                                    src={ketua}
                                    alt="Ketua"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                                    <h3 className="text-2xl font-bebas" style={{ color: kompetisiDetail?.primary_color || '#DC2626' }}>
                                        {kompetisiDetail?.about_director_name || "Hj. Meilinda"}
                                    </h3>
                                    <p className="text-sm font-plex text-gray-300">
                                        {kompetisiDetail?.about_director_title || "Ketua Pelaksana"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 space-y-6">
                            <h2 className="text-4xl md:text-6xl font-bebas text-white">
                                Sambutan <span style={{ color: kompetisiDetail?.primary_color || '#DC2626' }}>Ketua</span>
                            </h2>
                            <p className="text-gray-400 font-plex text-lg leading-relaxed text-justify">
                                {kompetisiDetail?.about_description || "Salam hormat... (Default description)"}
                            </p>
                            <div className="h-1 w-20" style={{ backgroundColor: kompetisiDetail?.primary_color || '#DC2626' }}></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Registration Steps - Minimalist Cards */}
            {kompetisiDetail?.tipe_kompetisi !== 'MASTER' && (
                <section className="py-20 bg-black relative">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-6xl font-bebas text-white mb-4">
                                Alur <span style={{ color: kompetisiDetail?.primary_color || '#DC2626' }}>Pendaftaran</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { step: "01", title: "Buat Akun", desc: "Daftar akun di website." },
                                { step: "02", title: "Pilih Kategori", desc: "Tentukan kelas tanding." },
                                { step: "03", title: "Upload Data", desc: "Lengkapi dokumen atlet." },
                                { step: "04", title: "Finalisasi", desc: "Konfirmasi pendaftaran." }
                            ].map((item, idx) => (
                                <div key={idx} className="group p-6 border border-white/10 transition-colors duration-300" style={{ borderColor: kompetisiDetail?.primary_color ? kompetisiDetail.primary_color : 'rgba(255,255,255,0.1)' }}>
                                    <div className="text-6xl font-bebas text-white/10 group-hover:text-opacity-20 transition-colors mb-4" style={{ color: kompetisiDetail?.primary_color || '#DC2626' }}>
                                        {item.step}
                                    </div>
                                    <h3 className="text-xl font-bold font-plex text-white mb-2 group-hover:text-opacity-100 transition-colors" style={{ color: kompetisiDetail?.primary_color || '#DC2626' }}>
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 font-plex">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer Info - Simple & Bold */}
            <section className="py-20 bg-stone-900 border-t border-white/10">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bebas text-white mb-12">Hubungi Kami</h2>
                    <div className="flex flex-wrap justify-center gap-10">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 text-black flex items-center justify-center rounded-none skew-x-[-10deg]" style={{ backgroundColor: kompetisiDetail?.primary_color || '#DC2626' }}>
                                <Phone className="w-8 h-8 skew-x-[10deg]" />
                            </div>
                            <div>
                                <p className="font-bebas text-xl text-white">Telepon</p>
                                <p className="text-gray-400">{kompetisiDetail?.contact_phone_1 || "-"}</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-yellow text-black flex items-center justify-center rounded-none skew-x-[-10deg]">
                                <Instagram className="w-8 h-8 skew-x-[10deg]" />
                            </div>
                            <div>
                                <p className="font-bebas text-xl text-white">Instagram</p>
                                <p className="text-gray-400">@{kompetisiDetail?.contact_instagram || "-"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <UnifiedRegistration
                isOpen={isRegistrationOpen}
                onClose={() => setIsRegistrationOpen(false)}
            />
        </div>
    );
};

export default HomeTemplateB;

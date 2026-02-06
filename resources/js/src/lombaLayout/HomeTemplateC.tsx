import { Phone, Instagram, Eye, Calendar, MapPin, Award, CheckCircle, Trophy } from "lucide-react";
import sriwijaya from "../assets/logo/sriwijaya.png";
import heroLomba from "../assets/photos/heroLomba.png";
import UnifiedRegistration from "../components/registrationSteps/UnifiedRegistration";
import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";
import ketua from "../assets/photos/ketua.png";
import { Link } from "react-router-dom";
import { useKompetisi } from "../context/KompetisiContext";

const HomeTemplateC = () => {
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
    const { user } = useAuth();
    const { kompetisiDetail } = useKompetisi();

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
        // If not defined (undefined), default to TRUE for backward compatibility or initial state
        return modules[key] !== false;
    };

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

    const registerStep = [
        {
            number: 1,
            title: "Buat Akun",
            desc: "Daftar di website resmi kejuaraan dengan mengisi informasi pribadi dan data tim secara lengkap.",
        },
        {
            number: 2,
            title: "Login & Pilih Kategori",
            desc: "Masuk lalu pilih kategori lomba sesuai kelompok usia dan kemampuan.",
        },
        {
            number: 3,
            title: "Unggah Dokumen",
            desc: "Upload dokumen yang dibutuhkan.",
        },
        {
            number: 4,
            title: "Konfirmasi",
            desc: "Periksa kembali data lalu konfirmasi.",
        },
    ];

    return (
        <div className="min-h-screen w-full bg-white font-inter text-gray-900">
            {/* 1. Hero Section (Redesigned) */}
            {isModuleEnabled('hero') && (
                <section className="relative min-h-[85vh] flex items-center bg-gray-50 overflow-hidden">
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-2/3 h-full bg-red/5 skew-x-[-10deg] transform translate-x-1/4"></div>
                    <div className="absolute bottom-0 left-0 w-1/3 h-full bg-yellow/5 skew-x-[10deg] transform -translate-x-1/4"></div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Text Content */}
                            <div className="space-y-8 order-2 lg:order-1">

                                <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-gray-900">
                                    {kompetisiDetail?.nama_event || "Sriwijaya Championship"}
                                </h1>

                                <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                                    {kompetisiDetail?.hero_description || "Bergabunglah dalam kompetisi taekwondo bergengsi dan tunjukkan kemampuan terbaikmu di panggung internasional."}
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    {kompetisiDetail?.tipe_kompetisi !== 'MASTER' && (
                                        <button
                                            onClick={handleJoinClick}
                                            className="px-8 py-4 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:-translate-y-1 hover:opacity-90"
                                            style={{ backgroundColor: kompetisiDetail?.primary_color || '#DC2626', boxShadow: `0 10px 15px -3px ${(kompetisiDetail?.primary_color || '#DC2626')}33` }}
                                        >
                                            Daftar Sekarang
                                        </button>
                                    )}
                                    {kompetisiDetail?.tipe_kompetisi === 'MASTER' && (
                                        <div className="px-8 py-4 bg-gray-900/10 text-gray-900 font-semibold rounded-xl border border-gray-200">
                                            Informasi Event
                                        </div>
                                    )}
                                    {kompetisiDetail?.tipe_kompetisi !== 'MASTER' && (kompetisiDetail?.show_antrian === 1 || !kompetisiDetail) && (
                                        <Link
                                            to={`/event/pertandingan/${kompetisiDetail?.id_kompetisi || 1}`}
                                            className="px-8 py-4 bg-white text-gray-900 border border-gray-200 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                                        >
                                            Lihat Jadwal
                                        </Link>
                                    )}
                                </div>

                                <div className="flex items-center gap-8 pt-8 border-t border-gray-200">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Total Peserta</p>
                                        <p className="text-2xl font-bold text-gray-900">1,200+</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Total Dojang</p>
                                        <p className="text-2xl font-bold text-gray-900">85+</p>
                                    </div>
                                </div>
                            </div>

                            {/* Image/Hero Asset */}
                            <div className="order-1 lg:order-2 relative flex justify-center">
                                <div className="relative w-full max-w-lg aspect-square">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-red/20 to-yellow/20 rounded-full blur-3xl opacity-50"></div>
                                    <img
                                        src={kompetisiDetail?.poster_image || heroLomba}
                                        alt="Hero"
                                        className="relative z-10 w-full h-full object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500 rounded-2xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* 2. Registration Steps (Moved Up as requested "Rearrange") */}
            {isModuleEnabled('registration') && kompetisiDetail?.tipe_kompetisi !== 'MASTER' && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="font-semibold tracking-wider uppercase text-sm" style={{ color: kompetisiDetail?.primary_color || '#DC2626' }}>Alur Pendaftaran</span>
                            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">Siap Bertanding?</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {(() => {
                                const stepsData = kompetisiDetail?.registration_steps as any;
                                const steps = (() => {
                                    if (Array.isArray(stepsData) && stepsData.length > 0) return stepsData;
                                    if (typeof stepsData === 'string' && stepsData.trim().length > 0) {
                                        try { return JSON.parse(stepsData); } catch (e) { }
                                    }
                                    return registerStep;
                                })();

                                return steps.map((step: any, idx: number) => (
                                    <div key={idx} className="relative group">
                                        <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 transition-all duration-300 h-full group-hover:shadow-xl" style={{ borderColor: idx === -1 ? 'transparent' : 'inherit' }}>
                                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-xl mb-6 group-hover:text-white transition-colors" style={{ color: kompetisiDetail?.primary_color || '#DC2626' }}>
                                                {idx + 1}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                            <p className="text-gray-600 leading-relaxed text-sm">{step.desc}</p>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                </section>
            )}

            {/* 3. About Section (Clean Split) */}
            {isModuleEnabled('about') && (
                <section className="py-24 bg-gray-50 overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="w-full lg:w-1/2 relative">
                                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl relative">
                                    <img
                                        src={ketua}
                                        alt="Ketua"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-8 left-8 text-white">
                                        <p className="font-bebas text-2xl">{kompetisiDetail?.about_director_name}</p>
                                        <p className="text-sm opacity-80">{kompetisiDetail?.about_director_title}</p>
                                    </div>
                                </div>
                                {/* Decorative Dots */}
                                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-red/10 rounded-full blur-xl"></div>
                                <div className="absolute -top-6 -left-6 w-32 h-32 bg-yellow/10 rounded-full blur-xl"></div>
                            </div>

                            <div className="w-full lg:w-1/2 space-y-8">
                                <div className="inline-block px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-100">
                                    <span className="font-bold uppercase tracking-wider text-sm flex items-center gap-2" style={{ color: kompetisiDetail?.primary_color || '#DC2626' }}>
                                        <Award size={16} />
                                        Sambutan
                                    </span>
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                    Menjunjung Tinggi <span style={{ color: kompetisiDetail?.primary_color || '#DC2626' }}>Sportivitas</span>
                                </h2>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    {kompetisiDetail?.about_description || "Kejuaraan ini diselenggarakan dengan tujuan mempererat tali persaudaraan antar atlet serta meningkatkan kualitas taekwondo di Indonesia."}
                                </p>

                                <div className="grid grid-cols-2 gap-6 pt-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: (kompetisiDetail?.primary_color || '#DC2626') + '1a', color: kompetisiDetail?.primary_color || '#DC2626' }}>
                                            <CheckCircle size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Standar Internasional</h4>
                                            <p className="text-sm text-gray-500 mt-1">Menggunakan aturan WT terbaru</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-yellow/10 flex items-center justify-center flex-shrink-0 text-yellow-600">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Wasit Bersertifikat</h4>
                                            <p className="text-sm text-gray-500 mt-1">Dipimpin oleh wasit nasional & internasional</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* 4. Contact / Footer (Clean) */}
            {isModuleEnabled('contact') && (
                <section className="py-16 bg-white border-t border-gray-100">
                    <div className="container mx-auto px-6">
                        <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-16 text-white overflow-hidden relative">
                            {/* Background Patterns */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                                <div className="space-y-6 text-center md:text-left max-w-xl">
                                    <h2 className="text-3xl md:text-5xl font-bold">Pusat Informasi</h2>
                                    <p className="text-gray-400 text-lg">
                                        Butuh bantuan? Hubungi tim kami untuk informasi lebih lanjut mengenai pendaftaran dan teknis pertandingan.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                        <a href={`https://wa.me/${kompetisiDetail?.contact_phone_1?.replace(/[^0-9]/g, '')}`} className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-colors border border-white/10">
                                            <Phone className="w-5 h-5" />
                                            <span>{kompetisiDetail?.contact_phone_1 || "Hubungi Kami"}</span>
                                        </a>
                                        <a href={`https://instagram.com/${kompetisiDetail?.contact_instagram?.replace('@', '')}`} className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-colors border border-white/10">
                                            <Instagram className="w-5 h-5" />
                                            <span>@{kompetisiDetail?.contact_instagram || "sumsel_taekwondo"}</span>
                                        </a>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto">
                                    <div className="bg-white p-2 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                        <iframe
                                            src={kompetisiDetail?.contact_gmaps_url || "https://www.google.com/maps/embed?pb=..."}
                                            className="w-full md:w-80 h-64 rounded-xl grayscale hover:grayscale-0 transition-all"
                                            loading="lazy"
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <UnifiedRegistration
                isOpen={isRegistrationOpen}
                onClose={() => setIsRegistrationOpen(false)}
            />
        </div>
    );
};

export default HomeTemplateC;

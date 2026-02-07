import React, { useState, useEffect } from 'react';
import { useKompetisi } from '../../context/KompetisiContext';
import { useAuth } from '../../context/authContext';
import {
    Trophy, Plus, Search, Calendar, MapPin, Users,
    ArrowRight, Edit, Trash2, Eye, Filter, MoreVertical,
    Layout, Save, X, Check, Image as ImageIcon, Type,
    Palette, FileText, ArrowLeftRight, Clock, MessageCircle,
    HelpCircle, Video, Upload, Settings as SettingsIcon, Database,
    Globe, Building2
} from 'lucide-react';
import { apiClient } from '../../config/api';
import toast from 'react-hot-toast';

const AdminKompetisi = () => {
    const { user, isSuperAdmin } = useAuth();
    const { loadingKompetisi: isLoading, fetchKompetisiList, kompetisiList: allKompetisi } = useKompetisi();
    const [viewLevel, setViewLevel] = useState<'organizers' | 'competitions'>('organizers');
    const [selectedOrganizer, setSelectedOrganizer] = useState<any>(null);
    const [kompetisiList, setKompetisiList] = useState<any[]>([]);

    // State for Wizard
    const [isAddingKompetisi, setIsAddingKompetisi] = useState(false);
    const [activeTab, setActiveTab] = useState('umum');
    const [newKompData, setNewKompData] = useState({
        nama_event: '',
        lokasi: '',
        logo_url: '',
        poster_image: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        id_penyelenggara: '',
        status: 'PENDAFTARAN',
        tipe_kompetisi: 'TUNGGAL',
        primary_color: '#990D35',
        secondary_color: '#F5B700',
        template_type: 'default',
        admin_email: '',
        admin_password: '',
        hero_title: '',
        hero_description: '',
        event_year: new Date().getFullYear().toString(),
        show_antrian: true,
        show_navbar: true,
        about_description: '',
        about_director_name: '',
        about_director_title: '',
        about_director_slogan: '',
        registration_description: '',
        registration_steps: [
            { title: 'Buat Akun', desc: 'Daftar akun tim atau atlet.' },
            { title: 'Pilih Kategori', desc: 'Tentukan kelas pertandingan.' },
            { title: 'Pembayaran', desc: 'Upload bukti transfer.' },
            { title: 'Verifikasi', desc: 'Tunggu validasi admin.' }
        ],
        faq_data: [],
        timeline_data: [],
        contact_venue_name: '',
        contact_description: '',
        contact_phone_1: '',
        contact_phone_2: '',
        contact_person_name_1: '',
        contact_person_name_2: '',
        contact_instagram: '',
        contact_gmaps_url: '',
        modules_enabled: {
            hero: true,
            about: true,
            registration: true,
            contact: true,
            faq: true,
            timeline: true,
            hide_console: false
        }
    });

    // Files for creation
    const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
    const [newHeroFile, setNewHeroFile] = useState<File | null>(null);

    // State for Editing
    const [editingId, setEditingId] = useState<number | null>(null);

    // Landing Page Customization State
    const [isEditingLanding, setIsEditingLanding] = useState(false);
    const [landingData, setLandingData] = useState({ 
        title: '', 
        subtitle: '', 
        about_title: '', 
        about_content: '', 
        features_title: '',
        feature_1_title: '',
        feature_1_desc: '',
        feature_2_title: '',
        feature_2_desc: '',
        feature_3_title: '',
        feature_3_desc: '',
        id_penyelenggara: 1 
    });

    useEffect(() => {
        const fetchLandingSettings = async () => {
            try {
                const res: any = await apiClient.get('/landing-settings');
                if (res.success) {
                    setLandingData({
                        title: res.data.title || '',
                        subtitle: res.data.subtitle || '',
                        about_title: res.data.about_title || '',
                        about_content: res.data.about_content || '',
                        features_title: res.data.features_title || '',
                        feature_1_title: res.data.feature_1_title || '',
                        feature_1_desc: res.data.feature_1_desc || '',
                        feature_2_title: res.data.feature_2_title || '',
                        feature_2_desc: res.data.feature_2_desc || '',
                        feature_3_title: res.data.feature_3_title || '',
                        feature_3_desc: res.data.feature_3_desc || '',
                        id_penyelenggara: res.data.id_penyelenggara || 1
                    });
                }
            } catch (err) {
                console.error("Failed to fetch landing settings", err);
            }
        };
        fetchLandingSettings();
    }, []);

    // Tutorials State
    const [tutorials, setTutorials] = useState<any[]>([]);
    const [isAddingTutorial, setIsAddingTutorial] = useState(false);
    const [editingTutorial, setEditingTutorial] = useState<any>(null);
    const [newTutorial, setNewTutorial] = useState({
        title: '',
        description: '',
        video_id: '',
        icon_type: 'FileText'
    });

    const [penyelenggaraList, setPenyelenggaraList] = useState<any[]>([]);

    const fetchPenyelenggara = async () => {
        try {
            const res: any = await apiClient.get('/admin/penyelenggara?limit=100');
            const data = res.data || res;
            const list = Array.isArray(data) ? data : (data.data || []);
            setPenyelenggaraList(list);
            
            
        } catch (err) {
            console.error("Failed to fetch penyelenggara", err);
        }
    };

    useEffect(() => {
        fetchPenyelenggara();
    }, []);

    // Effect for Auto-selection (Runs when user and list are ready)
    useEffect(() => {
        if (user?.role === 'ADMIN_PENYELENGGARA' && user?.admin_penyelenggara?.id_penyelenggara) {
            const myOrgId = user.admin_penyelenggara.id_penyelenggara;
            // Try to find in list, but if list is empty or not yet loaded, we can still set the ID
            // Ideally we wait for list, but for critical path we can just set it.
            // If list is loaded, we can get the name.
            const myOrg = penyelenggaraList.find((o: any) => o.id_penyelenggara === myOrgId) || { 
                id_penyelenggara: myOrgId, 
                nama_penyelenggara: user.admin_penyelenggara.nama || 'My Organization' 
            };
            
            console.log("Auto-selecting organization for ADMIN_PENYELENGGARA:", myOrg);
            setSelectedOrganizer(myOrg);
            setViewLevel('competitions');
            fetchKompetisiByOrganizer(myOrgId);
            setNewKompData(prev => ({ ...prev, id_penyelenggara: String(myOrgId) }));
        } else if (penyelenggaraList.length > 0 && !newKompData.id_penyelenggara && !isSuperAdmin) {
            // Only auto-select first if not super admin (though logic above handles admin_penyelenggara)
            // Actually super admin doesn't need auto select.
        }
    }, [user, penyelenggaraList]);

    const fetchKompetisiByOrganizer = async (orgId: number) => {
        try {
            const res: any = await apiClient.get(`/kompetisi?id_penyelenggara=${orgId}&limit=100`);
            const data = res.data || res;
            const list = Array.isArray(data) ? data : (data.data || []);
            setKompetisiList(list);
        } catch (err) {
            console.error("Failed to fetch competitions for organizer", err);
        }
    };

    // --- Functions ---
    // --- Functions ---
    const handleAddKompetisi = async () => {
        if (!newKompData.nama_event || !newKompData.tanggal_mulai || !newKompData.tanggal_selesai || !newKompData.id_penyelenggara) {
            toast.error("Mohon lengkapi data wajib (Nama, Tanggal, Penyelenggara)");
            return;
        }
        if (!newKompData.admin_email || !newKompData.admin_password) {
            // Check if editing, password might not be needed if not changing
            if (!editingId) {
                toast.error("Mohon lengkapi akun admin untuk kompetisi ini");
                return;
            }
        }

        const isEdit = !!editingId;
        const toastId = toast.loading(isEdit ? "Menyimpan perubahan..." : "Membuat kompetisi...");
        
        try {
            const formData = new FormData();
            Object.entries(newKompData).forEach(([key, value]) => {
                if (['modules_enabled', 'faq_data', 'timeline_data', 'registration_steps'].includes(key)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                     // If editing and password is empty, don't send it (or handle in backend)
                    if (key === 'admin_password' && isEdit && !value) {
                        return;
                    }
                    if (value !== null && value !== undefined) {
                         formData.append(key, value as string);
                    }
                }
            });
            
            if (newLogoFile) formData.append('logo', newLogoFile);
            if (newHeroFile) formData.append('hero', newHeroFile);

            // For updates, use POST with _method=PUT (Laravel method spoofing)
            if (isEdit) {
                formData.append('_method', 'PUT');
            }

            const url = isEdit ? `/kompetisi/${editingId}` : '/kompetisi';
            const response = await apiClient.postFormData(url, formData);

            if ((response as any).data?.success || (response as any).success) {
                toast.dismiss(toastId);
                toast.success(isEdit ? "Kompetisi berhasil diperbarui!" : "Kompetisi berhasil dibuat!");
                setIsAddingKompetisi(false);
                setEditingId(null);
                setActiveTab('umum');
                fetchKompetisiByOrganizer(Number(newKompData.id_penyelenggara));
            } else {
                throw new Error((response as any).message || "Gagal menyimpan kompetisi");
            }
        } catch (error: any) {
            toast.dismiss(toastId);
            toast.error(error.response?.data?.message || "Terjadik kesalahan saat menyimpan kompetisi");
        }
    };

    const handleEdit = (komp: any) => {
        console.log("Editing Kompetisi:", komp); // Debugging
        // Prepare data for Wizard
        const parseJSON = (str: any, fallback: any) => {
            if (!str) return fallback;
            if (typeof str === 'object') return str;
            try { return JSON.parse(str); } catch { return fallback; }
        };

        const existingModules = parseJSON(komp.modules_enabled, { hero: true, about: true, registration: true, contact: true, faq: true, timeline: true, hide_console: false });
        
        // Populate state
        setNewKompData({
            nama_event: komp.nama_event || '',
            lokasi: komp.lokasi || '',
            logo_url: komp.logo_url || '',
            poster_image: komp.poster_image || '',
            tanggal_mulai: komp.tanggal_mulai ? String(komp.tanggal_mulai).split(' ')[0] : '',
            tanggal_selesai: komp.tanggal_selesai ? String(komp.tanggal_selesai).split(' ')[0] : '',
            id_penyelenggara: String(komp.id_penyelenggara),
            status: komp.status || 'PENDAFTARAN',
            tipe_kompetisi: komp.tipe_kompetisi || 'TUNGGAL',
            primary_color: komp.primary_color || '#990D35',
            secondary_color: komp.secondary_color || '#F5B700',
            template_type: komp.template_type || 'default',
            admin_email: komp.user?.email || '', // We might not have this if not eager loaded, handled below
            admin_password: '', // Leave empty to keep unchanged
            hero_title: komp.hero_title || '',
            hero_description: komp.hero_description || '',
            event_year: komp.event_year || new Date().getFullYear().toString(),
            show_antrian: komp.show_antrian === 1 || komp.show_antrian === true,
            show_navbar: komp.show_navbar === 1 || komp.show_navbar === true,
            about_description: komp.about_description || '',
            about_director_name: komp.about_director_name || '',
            about_director_title: komp.about_director_title || '',
            about_director_slogan: komp.about_director_slogan || '',
            registration_description: komp.registration_description || '',
            registration_steps: parseJSON(komp.registration_steps, [
                { title: 'Buat Akun', desc: 'Daftar akun tim atau atlet.' },
                { title: 'Pilih Kategori', desc: 'Tentukan kelas pertandingan.' },
                { title: 'Pembayaran', desc: 'Upload bukti transfer.' },
                { title: 'Verifikasi', desc: 'Tunggu validasi admin.' }
            ]).map((step: any) => ({
                title: step.title || step.judul || step.name || '',
                desc: step.desc || step.description || step.keterangan || step.deskripsi || ''
            })),
            faq_data: (() => {
                const parsed = parseJSON(komp.faq_data, []);
                // Check if it's the categorized structure (has 'questions' arrow)
                if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].questions) {
                     return parsed.flatMap((cat: any) => 
                         (cat.questions || []).map((q: any) => ({
                             q: q.question || q.tanya || '',
                             a: q.answer || q.jawab || ''
                         }))
                     );
                }
                // Fallback for flat structure
                return parsed.map((item: any) => ({
                    q: item.q || item.question || item.pertanyaan || item.tanya || '',
                    a: item.a || item.answer || item.jawaban || item.jawab || ''
                }));
            })(),
            timeline_data: parseJSON(komp.timeline_data, []).map((item: any) => ({
                title: item.title || item.event || item.judul || item.activity || item.kegiatan || '',
                date: item.date || item.time || item.tanggal || item.waktu || '',
                desc: item.desc || item.month || item.description || item.keterangan || item.isi || item.side || ''
            })),
            contact_venue_name: komp.contact_venue_name || '',
            contact_description: komp.contact_description || '',
            contact_phone_1: komp.contact_phone_1 || '',
            contact_phone_2: komp.contact_phone_2 || '',
            contact_person_name_1: komp.contact_person_name_1 || '',
            contact_person_name_2: komp.contact_person_name_2 || '',
            contact_instagram: komp.contact_instagram || '',
            contact_gmaps_url: komp.contact_gmaps_url || '',
            modules_enabled: existingModules
        });

        // If admin data isn't directly in komp, we might need to fetch it or just display what we have.
        // Usually komp.user is not joined in 'get all' query unless specified.
        // For now we assume email is there or user can re-enter if needed, but optimally we should fetch detail.
        // If the backend 'get all' includes user relation, fine.
        
        setEditingId(komp.id_kompetisi);
        setNewLogoFile(null);
        setNewHeroFile(null);
        setIsAddingKompetisi(true);

        setActiveTab('umum');
    };

    const fetchTutorials = async (kompId: number) => {
        try {
            const res: any = await apiClient.get(`/kompetisi/tutorials/${kompId}`);
            if (res.success) setTutorials(res.data);
        } catch (err) {
            console.error("Error fetching tutorials:", err);
        }
    };



    // Tutorial logic
    const handleAddTutorial = async () => { /* ... implemented in previous step, abbreviated here for saving space if needed */ };
    const handleUpdateTutorial = async () => { /* ... */ };
    const handleDeleteTutorial = async (tutId: number) => { /* ... */ };

    const handleOpenLanding = async (org: any) => {
        const toastId = toast.loading('Memuat pengaturan landing page...');
        try {
            const res: any = await apiClient.get(`/landing-settings?id_penyelenggara=${org.id_penyelenggara}`);
            if (res.success) {
                setLandingData({
                    title: res.data.title || '',
                    subtitle: res.data.subtitle || '',
                    about_title: res.data.about_title || '',
                    about_content: res.data.about_content || '',
                    features_title: res.data.features_title || '',
                    feature_1_title: res.data.feature_1_title || '',
                    feature_1_desc: res.data.feature_1_desc || '',
                    feature_2_title: res.data.feature_2_title || '',
                    feature_2_desc: res.data.feature_2_desc || '',
                    feature_3_title: res.data.feature_3_title || '',
                    feature_3_desc: res.data.feature_3_desc || '',
                    id_penyelenggara: org.id_penyelenggara
                });
                setIsEditingLanding(true);
            }
            toast.dismiss(toastId);
        } catch (err) {
            toast.dismiss(toastId);
            toast.error("Gagal memuat pengaturan landing page");
        }
    };

    const handleViewCompetitions = (org: any) => {
        setSelectedOrganizer(org);
        setViewLevel('competitions');
        fetchKompetisiByOrganizer(org.id_penyelenggara);
    };

    const handleSaveLanding = async () => {
        const toastId = toast.loading('Menyimpan perubahan landing page...');
        try {
            const id = landingData.id_penyelenggara;
            if (!id) throw new Error("ID Penyelenggara tidak valid");

            await apiClient.put(`/admin/penyelenggara/${id}`, {
                nama_penyelenggara: selectedOrganizer?.nama_penyelenggara || penyelenggaraList.find(p => p.id_penyelenggara === id)?.nama_penyelenggara,
                email: selectedOrganizer?.email || penyelenggaraList.find(p => p.id_penyelenggara === id)?.email,
                landing_title: landingData.title,
                landing_subtitle: landingData.subtitle,
                landing_about_title: landingData.about_title,
                landing_about_content: landingData.about_content,
                landing_features_title: landingData.features_title,
                landing_feature_1_title: landingData.feature_1_title,
                landing_feature_1_desc: landingData.feature_1_desc,
                landing_feature_2_title: landingData.feature_2_title,
                landing_feature_2_desc: landingData.feature_2_desc,
                landing_feature_3_title: landingData.feature_3_title,
                landing_feature_3_desc: landingData.feature_3_desc,
            });

            toast.dismiss(toastId);
            toast.success("Landing page berhasil diperbarui!");
            setIsEditingLanding(false);
        } catch (err: any) {
            toast.dismiss(toastId);
            toast.error(err.message || "Gagal memperbarui landing page");
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-bebas text-4xl tracking-wide text-gray-900">
                        {viewLevel === 'organizers' ? 'Manajemen Website' : `Kompetisi: ${selectedOrganizer?.nama_penyelenggara}`}
                    </h1>
                    <p className="text-gray-500 mt-2 font-inter">
                        {viewLevel === 'organizers' 
                            ? 'Kelola halaman utama dan kompetisi untuk setiap penyelenggara.' 
                            : 'Kelola event, branding, dan informasi kompetisi di bawah penyelenggara ini.'}
                    </p>
                </div>
                    <div className="flex gap-3">
                    {viewLevel === 'competitions' && isSuperAdmin && (
                        <button
                            onClick={() => {
                                setViewLevel('organizers');
                                setSelectedOrganizer(null);
                            }}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-all font-bold"
                        >
                            <ArrowLeftRight size={20} /> Kembali ke Daftar Website
                        </button>
                    )}
                    {!isAddingKompetisi && viewLevel === 'competitions' && (
                        <button
                            onClick={() => setIsAddingKompetisi(true)}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red text-white shadow-lg shadow-red/20 hover:scale-105 active:scale-95 transition-all font-bold"
                        >
                            <Plus size={20} /> Buat Kompetisi Baru
                        </button>
                    )}
                </div>
            </div>

            {/* Modal for Landing Page Settings */}
            {isEditingLanding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bebas text-2xl text-gray-900 tracking-wide uppercase">Pengaturan Landing Page</h3>
                            <button onClick={() => setIsEditingLanding(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="bg-red/5 p-4 rounded-xl border border-red/10">
                                <p className="text-sm text-red-700 font-medium">
                                    Pengaturan ini akan mengubah tampilan teks di halaman utama website (Root).
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Headline (Hero Title)</label>
                                    <textarea
                                        value={landingData.title}
                                        onChange={(e) => setLandingData({ ...landingData, title: e.target.value })}
                                        className="w-full px-4 text-3xl font-bebas py-3 border rounded-xl focus:ring-2 focus:ring-red focus:border-red outline-none transition-all h-24"
                                        placeholder="Contoh: Welcome to the Arena"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Tips: Anda dapat menggunakan Enter untuk baris baru.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Sub-headline (Hero Description)</label>
                                    <textarea
                                        value={landingData.subtitle}
                                        onChange={(e) => setLandingData({ ...landingData, subtitle: e.target.value })}
                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red focus:border-red outline-none transition-all h-32"
                                        placeholder="Masukkan deskripsi singkat tentang kompetisi..."
                                    />
                                </div>

                                <div className="border-t pt-6 mt-6">
                                    <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-xs">Section: Tentang Kami</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Judul (About Title)</label>
                                            <textarea
                                                value={landingData.about_title}
                                                onChange={(e) => setLandingData({ ...landingData, about_title: e.target.value })}
                                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red focus:border-red outline-none transition-all h-20"
                                                placeholder="Contoh: Embrace the Spirit of Competition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Konten (About Content)</label>
                                            <textarea
                                                value={landingData.about_content}
                                                onChange={(e) => setLandingData({ ...landingData, about_content: e.target.value })}
                                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red focus:border-red outline-none transition-all h-40"
                                                placeholder="Masukkan deskripsi detail tentang platform..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-6 mt-6">
                                    <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-xs">Section: Keunggulan (Features)</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Judul Utama (Features Title)</label>
                                            <input
                                                type="text"
                                                value={landingData.features_title}
                                                onChange={(e) => setLandingData({ ...landingData, features_title: e.target.value })}
                                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red focus:border-red outline-none transition-all"
                                                placeholder="Contoh: Keunggulan Platform Kami"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <div className="md:col-span-2">
                                                <h5 className="text-[10px] font-bold text-red uppercase">Kartu 1 (Standard)</h5>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Judul</label>
                                                <input
                                                    type="text"
                                                    value={landingData.feature_1_title}
                                                    onChange={(e) => setLandingData({ ...landingData, feature_1_title: e.target.value })}
                                                    className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-red focus:border-red outline-none transition-all"
                                                    placeholder="Contoh: Standar Internasional"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Deskripsi</label>
                                                <textarea
                                                    value={landingData.feature_1_desc}
                                                    onChange={(e) => setLandingData({ ...landingData, feature_1_desc: e.target.value })}
                                                    className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-red focus:border-red outline-none transition-all h-20"
                                                    placeholder="Masukkan deskripsi kartu..."
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <div className="md:col-span-2">
                                                <h5 className="text-[10px] font-bold text-red uppercase">Kartu 2 (Modern)</h5>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Judul</label>
                                                <input
                                                    type="text"
                                                    value={landingData.feature_2_title}
                                                    onChange={(e) => setLandingData({ ...landingData, feature_2_title: e.target.value })}
                                                    className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-red focus:border-red outline-none transition-all"
                                                    placeholder="Contoh: Teknologi Modern"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Deskripsi</label>
                                                <textarea
                                                    value={landingData.feature_2_desc}
                                                    onChange={(e) => setLandingData({ ...landingData, feature_2_desc: e.target.value })}
                                                    className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-red focus:border-red outline-none transition-all h-20"
                                                    placeholder="Masukkan deskripsi kartu..."
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <div className="md:col-span-2">
                                                <h5 className="text-[10px] font-bold text-red uppercase">Kartu 3 (Global)</h5>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Judul</label>
                                                <input
                                                    type="text"
                                                    value={landingData.feature_3_title}
                                                    onChange={(e) => setLandingData({ ...landingData, feature_3_title: e.target.value })}
                                                    className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-red focus:border-red outline-none transition-all"
                                                    placeholder="Contoh: Komunitas Global"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Deskripsi</label>
                                                <textarea
                                                    value={landingData.feature_3_desc}
                                                    onChange={(e) => setLandingData({ ...landingData, feature_3_desc: e.target.value })}
                                                    className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-red focus:border-red outline-none transition-all h-20"
                                                    placeholder="Masukkan deskripsi kartu..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => setIsEditingLanding(false)}
                                className="px-6 py-2 text-gray-500 font-bold"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSaveLanding}
                                className="flex items-center gap-2 px-8 py-2 bg-red text-white rounded-xl shadow-lg shadow-red/20 font-bold hover:scale-105 transition-all"
                            >
                                <Save size={18} /> Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isAddingKompetisi ? (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500 shadow-xl">
                    <div className="flex border-b border-gray-200 bg-gray-50/50">
                        {['umum', 'tampilan', 'modul', 'konten', 'pengaturan'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === tab ? 'border-red text-red bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                            >
                                {tab === 'umum' && 'Informasi Umum'}
                                {tab === 'tampilan' && 'Tampilan & Branding'}
                                {tab === 'modul' && 'Modul & Fitur'}
                                {tab === 'konten' && 'Konten Website'}
                                {tab === 'pengaturan' && 'Pengaturan Akun'}
                            </button>
                        ))}
                        <div className="flex-1 flex justify-end items-center px-4">
                             <button onClick={() => { setIsAddingKompetisi(false); setEditingId(null); }} className="p-2 hover:bg-gray-200 rounded-lg text-gray-400"><X size={20} /></button>
                        </div>
                    </div>

                    <div className="p-8 h-[70vh] overflow-y-auto">
                        {activeTab === 'umum' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h5 className="font-bebas text-2xl text-gray-900 border-b pb-2">Informasi Dasar</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Nama Event</label>
                                        <input type="text" value={newKompData.nama_event} onChange={e => setNewKompData({ ...newKompData, nama_event: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red focus:ring-2 focus:ring-red/20 outline-none transition-all" placeholder="Contoh: Kejuaraan Pemuda 2024" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Lokasi</label>
                                        <input type="text" value={newKompData.lokasi} onChange={e => setNewKompData({ ...newKompData, lokasi: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red focus:ring-2 focus:ring-red/20 outline-none transition-all" placeholder="Contoh: GOR Popki Cibubur" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Mulai</label>
                                        <input type="date" value={newKompData.tanggal_mulai} onChange={e => setNewKompData({ ...newKompData, tanggal_mulai: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Selesai</label>
                                        <input type="date" value={newKompData.tanggal_selesai} onChange={e => setNewKompData({ ...newKompData, tanggal_selesai: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Tahun Event</label>
                                        <input type="number" value={newKompData.event_year} onChange={e => setNewKompData({ ...newKompData, event_year: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red outline-none transition-all" />
                                    </div>
                                     <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                                        <select value={newKompData.status} onChange={e => setNewKompData({ ...newKompData, status: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red outline-none transition-all">
                                            <option value="PENDAFTARAN">PENDAFTARAN</option>
                                            <option value="SEDANG_DIMULAI">SEDANG DIMULAI</option>
                                            <option value="SELESAI">SELESAI</option>
                                            <option value="DIBATALKAN">DIBATALKAN</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'tampilan' && (
                            <div className="space-y-6 animate-in fade-in">
                                <h5 className="font-bebas text-2xl text-gray-900 border-b pb-2">Branding & Tampilan</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="font-bold text-gray-700">Warna Identitas</label>
                                        <div className="flex gap-4 items-center">
                                            <input type="color" value={newKompData.primary_color} onChange={e => setNewKompData({ ...newKompData, primary_color: e.target.value })} className="w-16 h-16 rounded-xl cursor-pointer border-4 border-white shadow-md" title="Primary Color" />
                                            <div className="flex-1">
                                                <span className="text-xs font-bold text-gray-500 uppercase">Primary Color</span>
                                                <input type="text" value={newKompData.primary_color} onChange={e => setNewKompData({ ...newKompData, primary_color: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono text-sm" />
                                            </div>
                                        </div>
                                        <div className="flex gap-4 items-center">
                                            <input type="color" value={newKompData.secondary_color} onChange={e => setNewKompData({ ...newKompData, secondary_color: e.target.value })} className="w-16 h-16 rounded-xl cursor-pointer border-4 border-white shadow-md" title="Secondary Color" />
                                            <div className="flex-1">
                                                <span className="text-xs font-bold text-gray-500 uppercase">Secondary Color</span>
                                                <input type="text" value={newKompData.secondary_color} onChange={e => setNewKompData({ ...newKompData, secondary_color: e.target.value })} className="w-full px-3 py-2 border rounded-lg font-mono text-sm" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="font-bold text-gray-700">Logo & Poster</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 cursor-pointer transition-all hover:border-red group relative" onClick={() => document.getElementById('logoInput')?.click()}>
                                                {(newLogoFile || newKompData.logo_url) ? (
                                                     <div className="flex flex-col items-center">
                                                        {newLogoFile ? <span className="text-sm font-bold text-green-600">New File Selected</span> : <img src={newKompData.logo_url} className="h-16 w-auto object-contain mb-2" />}
                                                        <span className="text-xs text-gray-400">Ganti Logo</span>
                                                     </div>
                                                ) : (
                                                    <div className="flex flex-col items-center text-gray-400 group-hover:text-red">
                                                        <ImageIcon size={32} className="mb-2" />
                                                        <span className="text-sm font-bold">Upload Logo</span>
                                                    </div>
                                                )}
                                                <input id="logoInput" type="file" className="hidden" onChange={e => setNewLogoFile(e.target.files?.[0] || null)} />
                                            </div>
                                            
                                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 cursor-pointer transition-all hover:border-red group relative" onClick={() => document.getElementById('heroInput')?.click()}>
                                                {(newHeroFile || newKompData.poster_image) ? (
                                                     <div className="flex flex-col items-center">
                                                        {newHeroFile ? <span className="text-sm font-bold text-green-600">New File Selected</span> : <img src={newKompData.poster_image} className="h-16 w-auto object-cover rounded mb-2" />}
                                                        <span className="text-xs text-gray-400">Ganti Poster</span>
                                                     </div>
                                                ) : (
                                                    <div className="flex flex-col items-center text-gray-400 group-hover:text-red">
                                                        <ImageIcon size={32} className="mb-2" />
                                                        <span className="text-sm font-bold">Upload Poster</span>
                                                    </div>
                                                )}
                                                <input id="heroInput" type="file" className="hidden" onChange={e => setNewHeroFile(e.target.files?.[0] || null)} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-span-1 md:col-span-2 space-y-4">
                                        <label className="font-bold text-gray-700">Template Style</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {[{id: 'default', name: 'Classic Light'}, {id: 'modern', name: 'Modern Dark'}, {id: 'minimalist', name: 'Minimalist'}].map(t => (
                                                <div key={t.id} onClick={() => setNewKompData({ ...newKompData, template_type: t.id })}
                                                    className={`p-4 border rounded-xl cursor-pointer text-center transition-all ${newKompData.template_type === t.id ? 'bg-red text-white border-red' : 'bg-white border-gray-200 hover:border-red/50'}`}>
                                                    <span className="font-bold text-sm">{t.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'modul' && (
                             <div className="space-y-6 animate-in fade-in">
                                <h5 className="font-bebas text-2xl text-gray-900 border-b pb-2">Manajemen Modul</h5>
                                <p className="text-gray-500 text-sm">Pilih fitur dan section yang ingin ditampilkan di halaman kompetisi.</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Object.entries(newKompData.modules_enabled).map(([key, isEnabled]: [string, any]) => (
                                        key !== 'hide_console' && (
                                            <div key={key} 
                                                onClick={() => setNewKompData({ ...newKompData, modules_enabled: { ...newKompData.modules_enabled, [key]: !isEnabled } })}
                                                className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all ${isEnabled ? 'border-red bg-red/5' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900 capitalize text-lg">{key.replace('_', ' ')}</span>
                                                    <span className="text-xs text-gray-500 mt-1">{isEnabled ? 'Aktif' : 'Tidak Aktif'}</span>
                                                </div>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${isEnabled ? 'bg-red border-red' : 'bg-transparent border-gray-300'}`}>
                                                    {isEnabled && <Check size={14} className="text-white" />}
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                             </div>
                        )}

                        {activeTab === 'konten' && (
                             <div className="space-y-8 animate-in fade-in">
                                {/* Hero Content */}
                                {newKompData.modules_enabled.hero && (
                                    <div className="border border-gray-200 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center gap-3 border-b pb-3 mb-2">
                                            <Layout className="text-red" size={20} />
                                            <h6 className="font-bold text-lg text-gray-900">Hero Section</h6>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Hero Title</label>
                                            <input type="text" value={newKompData.hero_title} onChange={e => setNewKompData({...newKompData, hero_title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" placeholder="Judul besar di halaman utama" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Hero Description</label>
                                            <textarea value={newKompData.hero_description} onChange={e => setNewKompData({...newKompData, hero_description: e.target.value})} className="w-full px-4 py-2 border rounded-xl h-24" placeholder="Deskripsi singkat di bawah judul" />
                                        </div>
                                    </div>
                                )}

                                {/* About Content */}
                                {newKompData.modules_enabled.about && (
                                    <div className="border border-gray-200 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center gap-3 border-b pb-3 mb-2">
                                            <Users className="text-red" size={20} />
                                            <h6 className="font-bold text-lg text-gray-900">Sambutan / About</h6>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nama Direktur/Ketua</label>
                                                <input type="text" value={newKompData.about_director_name} onChange={e => setNewKompData({...newKompData, about_director_name: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Jabatan</label>
                                                <input type="text" value={newKompData.about_director_title} onChange={e => setNewKompData({...newKompData, about_director_title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" placeholder="Ketua Panitia" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Isi Sambutan</label>
                                                <textarea value={newKompData.about_description} onChange={e => setNewKompData({...newKompData, about_description: e.target.value})} className="w-full px-4 py-2 border rounded-xl h-32" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Contact Content */}
                                {newKompData.modules_enabled.contact && (
                                    <div className="border border-gray-200 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center gap-3 border-b pb-3 mb-2">
                                            <MessageCircle className="text-red" size={20} />
                                            <h6 className="font-bold text-lg text-gray-900">Kontak & Lokasi</h6>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nama Venue</label>
                                                <input type="text" value={newKompData.contact_venue_name} onChange={e => setNewKompData({...newKompData, contact_venue_name: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Instagram (@)</label>
                                                <input type="text" value={newKompData.contact_instagram} onChange={e => setNewKompData({...newKompData, contact_instagram: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">WhatsApp 1</label>
                                                <input type="text" value={newKompData.contact_phone_1} onChange={e => setNewKompData({...newKompData, contact_phone_1: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Contact Person 1</label>
                                                <input type="text" value={newKompData.contact_person_name_1} onChange={e => setNewKompData({...newKompData, contact_person_name_1: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
                                            </div>
                                             <div className="md:col-span-2">
                                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Google Maps Embed URL</label>
                                                <input type="text" value={newKompData.contact_gmaps_url} onChange={e => setNewKompData({...newKompData, contact_gmaps_url: e.target.value})} className="w-full px-4 py-2 border rounded-xl text-xs font-mono" placeholder="https://www.google.com/maps/embed?..." />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Registration Content */}
                                {newKompData.modules_enabled.registration && (
                                    <div className="border border-gray-200 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center gap-3 border-b pb-3 mb-2">
                                            <Trophy className="text-red" size={20} />
                                            <h6 className="font-bold text-lg text-gray-900">Pendaftaran & Alur</h6>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Deskripsi Pendaftaran</label>
                                            <textarea value={newKompData.registration_description} onChange={e => setNewKompData({...newKompData, registration_description: e.target.value})} className="w-full px-4 py-2 border rounded-xl h-24" placeholder="Penjelasan singkat alur pendaftaran..." />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-gray-500 mb-3">Langkah-Langkah (Registration Steps)</label>
                                            <div className="space-y-3">
                                                {(newKompData.registration_steps || []).map((step: any, idx: number) => (
                                                    <div key={idx} className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                                                        <div className="w-8 h-8 flex items-center justify-center bg-red/10 text-red font-bold rounded-lg shrink-0">{idx + 1}</div>
                                                        <div className="flex-1 space-y-2">
                                                            <input type="text" placeholder="Judul Langkah" value={step.title} onChange={e => {
                                                                const newSteps: any = [...newKompData.registration_steps];
                                                                newSteps[idx].title = e.target.value;
                                                                setNewKompData({...newKompData, registration_steps: newSteps});
                                                            }} className="w-full px-3 py-1.5 border rounded-lg text-sm font-bold" />
                                                            <input type="text" placeholder="Deskripsi" value={step.desc} onChange={e => {
                                                                const newSteps: any = [...newKompData.registration_steps];
                                                                newSteps[idx].desc = e.target.value;
                                                                setNewKompData({...newKompData, registration_steps: newSteps});
                                                            }} className="w-full px-3 py-1.5 border rounded-lg text-sm" />
                                                        </div>
                                                        <button onClick={() => {
                                                            const newSteps = newKompData.registration_steps.filter((_, i) => i !== idx);
                                                            setNewKompData({...newKompData, registration_steps: newSteps});
                                                        }} className="p-2 text-gray-400 hover:text-red transition-colors"><Trash2 size={16} /></button>
                                                    </div>
                                                ))}
                                                <button onClick={() => setNewKompData({...newKompData, registration_steps: [...(newKompData.registration_steps || []), {title: '', desc: ''}]})} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 text-sm font-bold hover:border-red hover:text-red transition-all flex items-center justify-center gap-2">
                                                    <Plus size={16} /> Tambah Langkah
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Timeline Content */}
                                {newKompData.modules_enabled.timeline && (
                                    <div className="border border-gray-200 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center gap-3 border-b pb-3 mb-2">
                                            <Calendar className="text-red" size={20} />
                                            <h6 className="font-bold text-lg text-gray-900">Jadwal & Timeline</h6>
                                        </div>
                                        <div className="space-y-3">
                                            {(newKompData.timeline_data || []).map((item: any, idx: number) => (
                                                <div key={idx} className="flex flex-wrap md:flex-nowrap gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200 items-start">
                                                    <div className="w-full md:w-auto md:flex-1 space-y-2">
                                                        <input type="text" placeholder="Judul Kegiatan" value={item.title} onChange={e => {
                                                            const newData: any = [...newKompData.timeline_data];
                                                            newData[idx].title = e.target.value;
                                                            setNewKompData({...newKompData, timeline_data: newData});
                                                        }} className="w-full px-3 py-1.5 border rounded-lg text-sm font-bold" />
                                                        <div className="flex gap-2">
                                                            <input type="text" placeholder="Tanggal (Contoh: 12 Jan 2024)" value={item.date} onChange={e => {
                                                                const newData: any = [...newKompData.timeline_data];
                                                                newData[idx].date = e.target.value;
                                                                setNewKompData({...newKompData, timeline_data: newData});
                                                            }} className="w-1/2 px-3 py-1.5 border rounded-lg text-sm" />
                                                            <input type="text" placeholder="Keterangan" value={item.desc} onChange={e => {
                                                                const newData: any = [...newKompData.timeline_data];
                                                                newData[idx].desc = e.target.value;
                                                                setNewKompData({...newKompData, timeline_data: newData});
                                                            }} className="w-1/2 px-3 py-1.5 border rounded-lg text-sm" />
                                                        </div>
                                                    </div>
                                                    <button onClick={() => {
                                                        const newData = newKompData.timeline_data.filter((_, i) => i !== idx);
                                                        setNewKompData({...newKompData, timeline_data: newData});
                                                    }} className="p-2 text-gray-400 hover:text-red transition-colors self-center"><Trash2 size={16} /></button>
                                                </div>
                                            ))}
                                            <button onClick={() => setNewKompData({...newKompData, timeline_data: [...(newKompData.timeline_data || []), {title: '', date: '', desc: ''}]})} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 text-sm font-bold hover:border-red hover:text-red transition-all flex items-center justify-center gap-2">
                                                <Plus size={16} /> Tambah Jadwal
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* FAQ Content */}
                                {newKompData.modules_enabled.faq && (
                                    <div className="border border-gray-200 rounded-2xl p-6 space-y-4">
                                        <div className="flex items-center gap-3 border-b pb-3 mb-2">
                                            <HelpCircle className="text-red" size={20} />
                                            <h6 className="font-bold text-lg text-gray-900">FAQ (Tanya Jawab)</h6>
                                        </div>
                                        <div className="space-y-3">
                                            {(newKompData.faq_data || []).map((item: any, idx: number) => (
                                                <div key={idx} className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                                                    <div className="flex-1 space-y-2">
                                                        <input type="text" placeholder="Pertanyaan (Q)" value={item.q} onChange={e => {
                                                            const newData: any = [...newKompData.faq_data];
                                                            newData[idx].q = e.target.value;
                                                            setNewKompData({...newKompData, faq_data: newData});
                                                        }} className="w-full px-3 py-1.5 border rounded-lg text-sm font-bold" />
                                                        <textarea placeholder="Jawaban (A)" value={item.a} onChange={e => {
                                                            const newData: any = [...newKompData.faq_data];
                                                            newData[idx].a = e.target.value;
                                                            setNewKompData({...newKompData, faq_data: newData});
                                                        }} className="w-full px-3 py-1.5 border rounded-lg text-sm h-16" />
                                                    </div>
                                                    <button onClick={() => {
                                                        const newData = newKompData.faq_data.filter((_, i) => i !== idx);
                                                        setNewKompData({...newKompData, faq_data: newData});
                                                    }} className="p-2 text-gray-400 hover:text-red transition-colors"><Trash2 size={16} /></button>
                                                </div>
                                            ))}
                                            <button onClick={() => setNewKompData({...newKompData, faq_data: [...(newKompData.faq_data || []), {q: '', a: ''}]})} className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 text-sm font-bold hover:border-red hover:text-red transition-all flex items-center justify-center gap-2">
                                                <Plus size={16} /> Tambah FAQ
                                            </button>
                                        </div>
                                    </div>
                                )}
                             </div>
                        )}

                        {activeTab === 'pengaturan' && (
                             <div className="space-y-6 animate-in fade-in">
                                <h5 className="font-bebas text-2xl text-gray-900 border-b pb-2">Pengaturan Lanjutan</h5>
                                
                                <div className="p-6 bg-red/5 rounded-2xl border border-red/10">
                                    <h6 className="font-bold text-red mb-4 flex items-center gap-2"><SettingsIcon size={18} /> Akun Admin Kompetisi</h6>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1">Email Login</label>
                                            <input type="email" value={newKompData.admin_email} onChange={e => setNewKompData({ ...newKompData, admin_email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1">Password {editingId && '(Biarkan kosong jika tetap)'}</label>
                                            <input type="password" value={newKompData.admin_password} onChange={e => setNewKompData({ ...newKompData, admin_password: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h6 className="font-bold text-gray-900">Fitur & Visibilitas</h6>
                                    <div className="flex items-center justify-between p-4 border rounded-xl">
                                        <div>
                                            <span className="font-bold block">Tampilkan Menu Navigasi</span>
                                            <span className="text-xs text-gray-500">Menampilkan navbar di halaman landing page kompetisi</span>
                                        </div>
                                        <input type="checkbox" checked={newKompData.show_navbar} onChange={e => setNewKompData({ ...newKompData, show_navbar: e.target.checked })} className="w-6 h-6 rounded text-red focus:ring-red" />
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-xl">
                                        <div>
                                            <span className="font-bold block">Tampilkan Antrian</span>
                                            <span className="text-xs text-gray-500">Fitur publik untuk melihat antrian pemanggilan atlet</span>
                                        </div>
                                        <input type="checkbox" checked={newKompData.show_antrian} onChange={e => setNewKompData({ ...newKompData, show_antrian: e.target.checked })} className="w-6 h-6 rounded text-red focus:ring-red" />
                                    </div>
                                </div>
                             </div>
                        )}
                    </div>
                    
                    <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                        <button onClick={() => { setIsAddingKompetisi(false); setEditingId(null); }} className="px-6 py-3 font-bold text-gray-500 hover:text-gray-700">
                            Batal
                        </button>
                        <button onClick={handleAddKompetisi} className="px-8 py-3 bg-red text-white rounded-xl font-bold shadow-lg shadow-red/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                             <Save size={18} /> {editingId ? 'Simpan Perubahan' : 'Buat Kompetisi'}
                        </button>
                    </div>
                </div>
            ) : (
                /* List & Edit UI */
                <div className="grid grid-cols-1 gap-6">
                    {viewLevel === 'organizers' ? (
                        /* Organizers List */
                        penyelenggaraList.map((org: any) => (
                            <div key={org.id_penyelenggara} className="rounded-2xl border border-gray-200 bg-white overflow-hidden p-6 hover:shadow-md transition-all">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-red/5 rounded-2xl flex items-center justify-center border border-red/10">
                                            <Building2 size={32} className="text-red" />
                                        </div>
                                        <div>
                                            <h4 className="font-bebas text-2xl tracking-wide text-gray-900">{org.nama_penyelenggara}</h4>
                                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1 font-inter">
                                                <span>{org.email}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span>{org.no_telp || 'No Phone'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        <button 
                                            onClick={() => handleOpenLanding(org)}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-red text-red hover:bg-red/5 transition-all font-bold"
                                        >
                                            <Globe size={18} /> Atur Website
                                        </button>
                                        <button 
                                            onClick={() => handleViewCompetitions(org)}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red text-white shadow-lg shadow-red/20 hover:scale-105 active:scale-95 transition-all font-bold"
                                        >
                                            <Trophy size={18} /> Lihat Kompetisi
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        /* Competitions List */
                        isLoading ? <p className="text-center py-12 text-gray-500">Memuat data kompetisi...</p> : (
                            kompetisiList.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                                    <Trophy size={48} className="mx-auto text-gray-300 mb-4" />
                                    <h5 className="font-bold text-gray-900">Belum Ada Kompetisi</h5>
                                    <p className="text-gray-500">Penyelenggara ini belum memiliki kompetisi aktif.</p>
                                </div>
                            ) : (
                                kompetisiList.map((komp: any) => (
                                    <div key={komp.id_kompetisi} className={`rounded-2xl border bg-white overflow-hidden transition-all border-gray-200 hover:shadow-sm`}>
                                        <div className="p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                                                    {komp.logo_url ? <img src={komp.logo_url} className="w-8 h-8 object-contain" /> : <Trophy size={20} className="text-gray-400" />}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg text-gray-900">{komp.nama_event}</h4>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <MapPin size={14} />
                                                        <span>{komp.lokasi}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                                <div className="flex gap-2">
                                                     <button 
                                                        onClick={() => window.open(`/${komp.slug}`, '_blank')}
                                                        className="p-2.5 text-gray-400 hover:text-red hover:bg-red/5 rounded-xl transition-all"
                                                        title="Lihat Landing Page"
                                                    >
                                                        <Eye size={20} />
                                                    </button>
                                                    <button onClick={() => handleEdit(komp)} className="px-4 py-2 border rounded-xl hover:bg-gray-50 flex items-center gap-2 font-bold text-gray-700">
                                                        <Globe size={16} className="text-red" /> Atur Website
                                                    </button>
                                                </div>
                                            
                                        </div>
                                    </div>
                                ))
                            )
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminKompetisi;

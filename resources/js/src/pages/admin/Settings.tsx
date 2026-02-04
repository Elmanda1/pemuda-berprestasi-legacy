import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Database,
  Mail,
  Save,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  RefreshCw,
  Trophy,
  Palette,
  Plus,
  Video,
  Layout,
  FileText,
  HelpCircle,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  ArrowLeftRight,
  X,
  Settings as SettingsIcon
} from 'lucide-react';
import { useKompetisi } from '../../context/KompetisiContext';
import { apiClient } from '../../config/api';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true
  });
  const [activeThemeTab, setActiveThemeTab] = useState('tampilan');

  const { kompetisiList, updateKompetisiTheme, fetchKompetisiList, loadingKompetisi } = useKompetisi();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    primary_color: '',
    secondary_color: '',
    logo_url: '',
    show_antrian: true,
    show_navbar: true,
    hero_title: '',
    hero_description: '',
    about_description: '',
    about_director_name: '',
    about_director_title: '',
    contact_description: '',
    contact_venue_name: '',
    contact_phone_1: '',
    contact_phone_2: '',
    contact_instagram: '',
    contact_gmaps_url: '',
    contact_person_name_1: '',
    contact_person_name_2: '',
    event_year: '',
    about_director_slogan: '',
    registration_description: '',
    registration_steps: [] as any[],
    faq_data: [] as any[],
    timeline_data: [] as any[],
    template_type: 'default'
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);

  // Tutorial state
  const [showTutorialEditor, setShowTutorialEditor] = useState(false);
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [isAddingTutorial, setIsAddingTutorial] = useState(false);
  const [newTutorial, setNewTutorial] = useState({ title: '', description: '', video_id: '', icon_type: 'FileText' });

  React.useEffect(() => {
    if (activeTab === 'kompetisi') {
      fetchKompetisiList();
    }
  }, [activeTab]);

  const settingsTabs = [
    { id: 'profile', label: 'Profil Admin', icon: User },
    { id: 'security', label: 'Keamanan', icon: Shield },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'system', label: 'Sistem', icon: Database },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'kompetisi', label: 'Pengaturan Website', icon: Trophy }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div
          className="w-24 h-24 rounded-xl flex items-center justify-center font-inter font-bold text-2xl relative group cursor-pointer"
          style={{ backgroundColor: '#F5B700', color: '#050505' }}
        >
          A
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Upload size={24} className="text-white" />
          </div>
        </div>
        <div>
          <h3
            className="font-inter font-semibold"
            style={{ fontSize: '20px', color: '#050505' }}
          >
            Admin User
          </h3>
          <p
            className="font-inter"
            style={{ fontSize: '14px', color: '#050505', opacity: '0.6' }}
          >
            admin@taekwondo.com
          </p>
          <button
            className="font-inter font-medium mt-2 hover:underline text-red"
            style={{ fontSize: '14px' }}
          >
            Ubah Avatar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label
            className="block font-inter font-medium mb-2"
            style={{ fontSize: '14px', color: '#050505' }}
          >
            Nama Lengkap
          </label>
          <input
            type="text"
            defaultValue="Administrator"
            className="w-full px-4 py-3 rounded-xl border border-red bg-white text-black font-inter"
          />
        </div>
        <div>
          <label
            className="block font-inter font-medium mb-2"
            style={{ fontSize: '14px', color: '#050505' }}
          >
            Email
          </label>
          <input
            type="email"
            defaultValue="admin@taekwondo.com"
            className="w-full px-4 py-3 rounded-xl border border-red bg-white text-black font-inter"
          />
        </div>
        <div>
          <label
            className="block font-inter font-medium mb-2"
            style={{ fontSize: '14px', color: '#050505' }}
          >
            Nomor Telepon
          </label>
          <input
            type="tel"
            defaultValue="+62 812 3456 7890"
            className="w-full px-4 py-3 rounded-xl border font-inter"
            style={{
              borderColor: '#990D35',
              backgroundColor: '#FFFFFF',
              color: '#050505'
            }}
          />
        </div>
        <div>
          <label
            className="block font-inter font-medium mb-2"
            style={{ fontSize: '14px', color: '#050505' }}
          >
            Jabatan
          </label>
          <input
            type="text"
            defaultValue="Super Administrator"
            className="w-full px-4 py-3 rounded-xl border font-inter"
            style={{
              borderColor: '#990D35',
              backgroundColor: '#FFFFFF',
              color: '#050505'
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div
        className="p-6 rounded-xl"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #990D3520' }}
      >
        <h3
          className="font-inter font-semibold mb-4"
          style={{ fontSize: '18px', color: '#050505' }}
        >
          Ubah Password
        </h3>
        <div className="space-y-4">
          <div>
            <label
              className="block font-inter font-medium mb-2"
              style={{ fontSize: '14px', color: '#050505' }}
            >
              Password Saat Ini
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 rounded-xl border font-inter pr-12"
                style={{
                  borderColor: '#990D35',
                  backgroundColor: '#FFFFFF',
                  color: '#050505'
                }}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                style={{ color: '#990D35' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label
              className="block font-inter font-medium mb-2"
              style={{ fontSize: '14px', color: '#050505' }}
            >
              Password Baru
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border font-inter"
              style={{
                borderColor: '#990D35',
                backgroundColor: '#FFFFFF',
                color: '#050505'
              }}
            />
          </div>
          <div>
            <label
              className="block font-inter font-medium mb-2"
              style={{ fontSize: '14px', color: '#050505' }}
            >
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border font-inter"
              style={{
                borderColor: '#990D35',
                backgroundColor: '#FFFFFF',
                color: '#050505'
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="p-6 rounded-xl"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #990D3520' }}
      >
        <h3
          className="font-inter font-semibold mb-4"
          style={{ fontSize: '18px', color: '#050505' }}
        >
          Keamanan Akun
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="font-inter font-medium"
                style={{ fontSize: '16px', color: '#050505' }}
              >
                Two-Factor Authentication
              </p>
              <p
                className="font-inter"
                style={{ fontSize: '14px', color: '#050505', opacity: '0.6' }}
              >
                Tambahan keamanan untuk akun Anda
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div
                className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                style={{ backgroundColor: '#990D35' }}
              ></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div
        className="p-6 rounded-xl"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #990D3520' }}
      >
        <h3
          className="font-inter font-semibold mb-4"
          style={{ fontSize: '18px', color: '#050505' }}
        >
          Pengaturan Notifikasi
        </h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p
                  className="font-inter font-medium capitalize"
                  style={{ fontSize: '16px', color: '#050505' }}
                >
                  Notifikasi {key}
                </p>
                <p
                  className="font-inter"
                  style={{ fontSize: '14px', color: '#050505', opacity: '0.6' }}
                >
                  Terima notifikasi melalui {key}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div
                  className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                  style={{ backgroundColor: value ? '#990D35' : '#ccc' }}
                ></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSystemTab = () => (
    <div className="space-y-6">
      <div
        className="p-6 rounded-xl"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #990D3520' }}
      >
        <h3
          className="font-inter font-semibold mb-4"
          style={{ fontSize: '18px', color: '#050505' }}
        >
          Pengaturan Sistem
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p
                className="font-inter font-medium"
                style={{ fontSize: '16px', color: '#050505' }}
              >
                Backup Otomatis
              </p>
              <p
                className="font-inter"
                style={{ fontSize: '14px', color: '#050505', opacity: '0.6' }}
              >
                Backup database setiap hari pada pukul 02:00
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-inter font-medium transition-all duration-300"
              style={{ backgroundColor: '#990D35', color: '#F5FBEF' }}
            >
              <RefreshCw size={16} />
              Backup Sekarang
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p
                className="font-inter font-medium"
                style={{ fontSize: '16px', color: '#050505' }}
              >
                Maintenance Mode
              </p>
              <p
                className="font-inter"
                style={{ fontSize: '14px', color: '#050505', opacity: '0.6' }}
              >
                Aktifkan untuk maintenance sistem
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div
                className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-red-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
              ></div>
            </label>
          </div>
        </div>
      </div>

      <div
        className="p-6 rounded-xl"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #990D3520' }}
      >
        <h3
          className="font-inter font-semibold mb-4"
          style={{ fontSize: '18px', color: '#050505' }}
        >
          Database Management
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            className="flex flex-col items-center gap-2 p-4 rounded-xl font-inter font-medium transition-all duration-300 hover:shadow-md"
            style={{ backgroundColor: '#F5B70015', color: '#F5B700', border: '1px solid #F5B70030' }}
          >
            <Database size={24} />
            <span>Export Data</span>
          </button>
          <button
            className="flex flex-col items-center gap-2 p-4 rounded-xl font-inter font-medium transition-all duration-300 hover:shadow-md"
            style={{ backgroundColor: '#05050515', color: '#050505', border: '1px solid #05050530' }}
          >
            <Upload size={24} />
            <span>Import Data</span>
          </button>
          <button
            className="flex flex-col items-center gap-2 p-4 rounded-xl font-inter font-medium transition-all duration-300 hover:shadow-md"
            style={{ backgroundColor: '#990D3515', color: '#990D35', border: '1px solid #990D3530' }}
          >
            <Trash2 size={24} />
            <span>Clear Cache</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderEmailTab = () => (
    <div className="space-y-6">
      <div
        className="p-6 rounded-xl"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #990D3520' }}
      >
        <h3
          className="font-inter font-semibold mb-4"
          style={{ fontSize: '18px', color: '#050505' }}
        >
          Konfigurasi Email
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label
              className="block font-inter font-medium mb-2"
              style={{ fontSize: '14px', color: '#050505' }}
            >
              SMTP Host
            </label>
            <input
              type="text"
              defaultValue="smtp.gmail.com"
              className="w-full px-4 py-3 rounded-xl border font-inter"
              style={{
                borderColor: '#990D35',
                backgroundColor: '#FFFFFF',
                color: '#050505'
              }}
            />
          </div>
          <div>
            <label
              className="block font-inter font-medium mb-2"
              style={{ fontSize: '14px', color: '#050505' }}
            >
              SMTP Port
            </label>
            <input
              type="text"
              defaultValue="587"
              className="w-full px-4 py-3 rounded-xl border font-inter"
              style={{
                borderColor: '#990D35',
                backgroundColor: '#FFFFFF',
                color: '#050505'
              }}
            />
          </div>
          <div>
            <label
              className="block font-inter font-medium mb-2"
              style={{ fontSize: '14px', color: '#050505' }}
            >
              Username
            </label>
            <input
              type="text"
              defaultValue="admin@taekwondo.com"
              className="w-full px-4 py-3 rounded-xl border font-inter"
              style={{
                borderColor: '#990D35',
                backgroundColor: '#FFFFFF',
                color: '#050505'
              }}
            />
          </div>
          <div>
            <label
              className="block font-inter font-medium mb-2"
              style={{ fontSize: '14px', color: '#050505' }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                defaultValue="••••••••"
                className="w-full px-4 py-3 rounded-xl border font-inter pr-12"
                style={{
                  borderColor: '#990D35',
                  backgroundColor: '#FFFFFF',
                  color: '#050505'
                }}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                style={{ color: '#990D35' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="p-6 rounded-xl"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #990D3520' }}
      >
        <h3
          className="font-inter font-semibold mb-4"
          style={{ fontSize: '18px', color: '#050505' }}
        >
          Template Email
        </h3>
        <div className="space-y-4">
          <div>
            <label
              className="block font-inter font-medium mb-2"
              style={{ fontSize: '14px', color: '#050505' }}
            >
              Email Header
            </label>
            <input
              type="text"
              defaultValue="Sistem Manajemen Taekwondo"
              className="w-full px-4 py-3 rounded-xl border font-inter"
              style={{
                borderColor: '#990D35',
                backgroundColor: '#FFFFFF',
                color: '#050505'
              }}
            />
          </div>
          <div>
            <label
              className="block font-inter font-medium mb-2"
              style={{ fontSize: '14px', color: '#050505' }}
            >
              Email Footer
            </label>
            <textarea
              rows={3}
              defaultValue="Terima kasih atas perhatian Anda.&#10;Tim Administrasi Taekwondo"
              className="w-full px-4 py-3 rounded-xl border font-inter resize-none"
              style={{
                borderColor: '#990D35',
                backgroundColor: '#FFFFFF',
                color: '#050505'
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="p-6 rounded-xl"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #990D3520' }}
      >
        <h3
          className="font-inter font-semibold mb-4"
          style={{ fontSize: '18px', color: '#050505' }}
        >
          Test Email
        </h3>
        <div className="flex gap-4">
          <input
            type="email"
            placeholder="Masukkan email untuk test"
            className="flex-1 px-4 py-3 rounded-xl border font-inter"
            style={{
              borderColor: '#990D35',
              backgroundColor: '#FFFFFF',
              color: '#050505'
            }}
          />
          <button
            className="px-6 py-3 rounded-xl font-inter font-medium transition-all duration-300 hover:shadow-md"
            style={{ backgroundColor: '#990D35', color: '#F5FBEF' }}
          >
            Kirim Test
          </button>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-8">
        <button
          className="px-6 py-2.5 rounded-xl border border-red text-red hover:bg-red/5 font-medium transition-colors"
        >
          Batalkan
        </button>
        <button
          className="px-6 py-2.5 rounded-xl bg-red text-white hover:opacity-90 font-medium shadow-md transition-all flex items-center gap-2"
        >
          <Save size={20} />
          Simpan Profil
        </button>
      </div>
    </div>
  );

  const renderKompetisiTab = () => {
    const handleEdit = (komp: any) => {
      setEditingId(komp.id_kompetisi);
      setEditData({
        primary_color: komp.primary_color || '#990D35',
        secondary_color: komp.secondary_color || '#F5B700',
        logo_url: komp.logo_url || '',
        show_antrian: komp.show_antrian === 1 || komp.show_antrian === true,
        show_navbar: komp.show_navbar === 1 || komp.show_navbar === true,
        hero_title: komp.hero_title || '',
        hero_description: komp.hero_description || '',
        about_description: komp.about_description || '',
        about_director_name: komp.about_director_name || '',
        about_director_title: komp.about_director_title || '',
        contact_description: komp.contact_description || 'Berikut adalah detail informasi mengenai kontak dan lokasi pertandingan. Jangan takut untuk menghubungi tim kami kapan saja. Kami siap memberikan informasi detail Sriwijaya Competition 2025 serta panduan menuju ke lokasi pertandingan',
        contact_venue_name: komp.contact_venue_name || 'GOR Jakabaring (Gor Ranau JSC), Palembang',
        contact_phone_1: komp.contact_phone_1 || '081377592090',
        contact_phone_2: komp.contact_phone_2 || '085922124908',
        contact_instagram: komp.contact_instagram || 'sumsel_taekwondo',
        contact_gmaps_url: komp.contact_gmaps_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.2808245295255!2d104.7919914!3d-3.0190341000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e3b9da396d2b289%3A0xcc3623bbbb92bd93!2sGOR%20Jakabaring!5e0!3m2!1sen!2sid!4v1757524240866!5m2!1sen!2sid',
        contact_person_name_1: komp.contact_person_name_1 || 'Rora',
        contact_person_name_2: komp.contact_person_name_2 || 'Rizka',
        event_year: komp.event_year || '2025',
        about_director_slogan: komp.about_director_slogan || '“SALAM TAEKWONDO INDONESIA PROVINSI SUMATERA SELATAN”',
        registration_description: komp.registration_description || 'Ikuti langkah-langkah berikut untuk mendaftar sebagai peserta Sriwijaya Competition 2025 dengan mudah dan efisien.',
        registration_steps: (() => {
          if (Array.isArray(komp.registration_steps)) return komp.registration_steps;
          if (typeof komp.registration_steps === 'string') {
            try { return JSON.parse(komp.registration_steps); } catch (e) { return []; }
          }
          return [
            { number: 1, title: 'Buat Akun', desc: 'Daftar di website resmi kejuaraan dengan mengisi informasi pribadi dan data tim secara lengkap.' },
            { number: 2, title: 'Login dan Pilih Kategori', desc: 'Masuk menggunakan akun yang sudah terdaftar lalu pilih kategori lomba sesuai kelompok usia dan kemampuan.' },
            { number: 3, title: 'Unggah Dokumen', desc: 'Upload dokumen yang dibutuhkan seperti kartu identitas, foto, d bukti pembayaran.' },
            { number: 4, title: 'Konfirmasi & Selesai', desc: 'Periksa kembali data yang telah diisi, lalu konfirmasi pendaftaran untuk mendapatkan nomor peserta.' },
          ];
        })(),
        faq_data: (() => {
          if (Array.isArray(komp.faq_data)) return komp.faq_data;
          if (typeof komp.faq_data === 'string') {
            try { return JSON.parse(komp.faq_data); } catch (e) { return []; }
          }
          return [];
        })(),
        timeline_data: (() => {
          if (Array.isArray(komp.timeline_data)) return komp.timeline_data;
          if (typeof komp.timeline_data === 'string') {
            try { return JSON.parse(komp.timeline_data); } catch (e) { return []; }
          }
          return [
            { event: 'Registrasi', time: '1 Agustus - 8 November 2025', side: 'left', month: 'Agustus - November' },
            { event: 'Penimbangan', time: '21 November 2025 10.00 - 15.00', side: 'right', month: 'November' },
            { event: 'Technical Meeting', time: '21 November 2025 15.30 - selesai', side: 'left', month: 'November' },
            { event: 'Pertandingan', time: '22 -26 November 2025', side: 'right', month: 'November' },
          ];
        })(),
        template_type: komp.template_type || 'default'
      });
      setLogoFile(null);
      setHeroFile(null);
      fetchTutorials(komp.id_kompetisi);
    };

    const fetchTutorials = async (kompId: number) => {
      try {
        const res: any = await apiClient.get(`/kompetisi/tutorials/${kompId}`);
        if (res.success) setTutorials(res.data);
      } catch (err) {
        console.error("Error fetching tutorials:", err);
      }
    };

    const handleResetTheme = async (id: number) => {
      if (!window.confirm("Apakah Anda yakin ingin mengatur ulang tema ke default?")) return;
      try {
        const formData = new FormData();
        formData.append('primary_color', '#990D35');
        formData.append('secondary_color', '#F5B700');
        formData.append('logo_url', '');
        formData.append('poster_image', '');
        formData.append('show_antrian', '1');
        formData.append('show_navbar', '1');

        await updateKompetisiTheme(id, formData);
        toast.success("Tema diatur ulang ke default");
        setEditingId(null);
      } catch (err) {
        toast.error("Gagal mengatur ulang tema");
      }
    };

    const handleSaveTheme = async (id: number) => {
      // Validation: At least one phone number must be provided
      if (!editData.contact_phone_1 && !editData.contact_phone_2) {
        toast.error('Minimal harus ada 1 nomor telepon kontak!');
        return;
      }

      const toastId = toast.loading('Menyimpan perubahan...');
      try {
        const formData = new FormData();
        formData.append('primary_color', editData.primary_color);
        formData.append('secondary_color', editData.secondary_color);
        formData.append('show_antrian', editData.show_antrian ? '1' : '0');
        formData.append('show_antrian', editData.show_antrian ? '1' : '0');
        formData.append('show_navbar', editData.show_navbar ? '1' : '0');
        formData.append('template_type', editData.template_type);

        // Text Content
        formData.append('hero_title', editData.hero_title);
        formData.append('hero_description', editData.hero_description);
        formData.append('about_description', editData.about_description);
        formData.append('about_director_name', editData.about_director_name);
        formData.append('about_director_title', editData.about_director_title);
        formData.append('contact_description', editData.contact_description);
        formData.append('contact_venue_name', editData.contact_venue_name);
        formData.append('contact_phone_1', editData.contact_phone_1);
        formData.append('contact_phone_2', editData.contact_phone_2);
        formData.append('contact_instagram', editData.contact_instagram);
        formData.append('contact_gmaps_url', editData.contact_gmaps_url);
        formData.append('contact_person_name_1', editData.contact_person_name_1);
        formData.append('contact_person_name_2', editData.contact_person_name_2);
        formData.append('event_year', editData.event_year);
        formData.append('about_director_slogan', editData.about_director_slogan);
        formData.append('registration_description', editData.registration_description);
        formData.append('registration_steps', JSON.stringify(editData.registration_steps));
        formData.append('faq_data', JSON.stringify(editData.faq_data));
        formData.append('timeline_data', JSON.stringify(editData.timeline_data));

        if (logoFile) formData.append('logo', logoFile);
        if (heroFile) formData.append('hero', heroFile);

        await updateKompetisiTheme(id, formData);
        localStorage.setItem('currentKompetisiId', id.toString());
        toast.dismiss(toastId);
        toast.success("Tema kompetisi berhasil diperbarui");
        setEditingId(null);
      } catch (err) {
        toast.dismiss(toastId);
        toast.error("Gagal memperbarui tema");
      }
    };

    const handleAddTutorial = async () => {
      if (!editingId) return;
      try {
        const res: any = await apiClient.post('/kompetisi/tutorials', {
          ...newTutorial,
          id_kompetisi: editingId
        });
        if (res.success) {
          toast.success("Tutorial ditambahkan");
          setIsAddingTutorial(false);
          setNewTutorial({ title: '', description: '', video_id: '', icon_type: 'FileText' });
          fetchTutorials(editingId);
        }
      } catch (err) {
        toast.error("Gagal menambah tutorial");
      }
    };

    const handleDeleteTutorial = async (tutId: number) => {
      try {
        const res: any = await apiClient.delete(`/kompetisi/tutorials/${tutId}`);
        if (res.success) {
          toast.success("Tutorial dihapus");
          if (editingId) fetchTutorials(editingId);
        }
      } catch (err) {
        toast.error("Gagal menghapus tutorial");
      }
    };

    return (
      <div className="space-y-6">
        <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
          <h3 className="font-bebas text-2xl mb-4 tracking-wide text-red">Pengaturan Website</h3>
          <p className="text-sm text-gray-500 mb-6 font-inter">Kelola tampilan, konten, dan informasi website untuk setiap kompetisi.</p>

          {loadingKompetisi ? (
            <div className="flex justify-center p-12">
              <RefreshCw className="animate-spin text-red" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {kompetisiList.map((komp) => (
                <div
                  key={komp.id_kompetisi}
                  className="rounded-2xl border bg-white overflow-hidden transition-all duration-300"
                  style={{ borderColor: editingId === komp.id_kompetisi ? '#990D35' : '#e5e7eb' }}
                >
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {/* Logo placeholder removed */}
                        <div>
                          <h4 className="font-inter font-bold text-gray-900 text-lg leading-tight">{komp.nama_event}</h4>
                          <p className="text-sm text-gray-500">{komp.lokasi || 'Lokasi tidak diatur'}</p>
                        </div>
                      </div>

                      {editingId !== komp.id_kompetisi && (
                        <button
                          onClick={() => handleEdit(komp)}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-sm font-semibold text-gray-700 hover:border-red/30"
                        >
                          <Palette size={18} className="text-red" />
                          Atur Branding & Sistem
                        </button>
                      )}
                    </div>

                    {editingId === komp.id_kompetisi && (
                      <div>
                        <div className="mt-8 bg-gray-50/50 rounded-2xl border border-gray-100 p-2">
                          <div className="flex flex-wrap gap-2">
                            {[
                              { id: 'tampilan', label: 'Tampilan & Aset', icon: Palette },
                              { id: 'konten', label: 'Konten Teks', icon: FileText },
                              { id: 'kontak', label: 'Kontak & Lokasi', icon: ArrowLeftRight },
                              { id: 'informasi', label: 'Informasi & Jadwal', icon: Calendar },
                              { id: 'fitur', label: 'Fitur Lainnya', icon: SettingsIcon }
                            ].map((tab) => (
                              <button
                                key={tab.id}
                                onClick={() => setActiveThemeTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${activeThemeTab === tab.id
                                  ? 'bg-white text-red shadow-sm ring-1 ring-gray-200'
                                  : 'text-gray-500 hover:bg-white/60 hover:text-gray-700'
                                  }`}
                              >
                                <tab.icon size={16} />
                                {tab.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
                          {/* Section: Tampilan & Aset */}
                          {activeThemeTab === 'tampilan' && (
                            <div className="space-y-8">
                              {/* Section 0: Template Selection */}
                              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                  <Layout size={18} className="text-red" />
                                  Pilih Tata Letak & Tema (Web Template)
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div
                                    onClick={() => setEditData({ ...editData, template_type: 'default' })}
                                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md ${editData.template_type === 'default' ? 'border-red bg-white ring-2 ring-red/20' : 'border-gray-200 bg-white hover:border-red/50'}`}
                                  >
                                    <div className="flex items-center gap-3 mb-3">
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${editData.template_type === 'default' ? 'border-red' : 'border-gray-300'}`}>
                                        {editData.template_type === 'default' && <div className="w-2 h-2 rounded-full bg-red" />}
                                      </div>
                                      <h6 className="font-bold text-gray-800">Classic Light (Default)</h6>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3">Tampilan standar dengan dominasi warna putih yang bersih dan formal.</p>
                                    <div className="h-24 bg-gray-100 rounded-lg border border-gray-100 overflow-hidden relative">
                                      <div className="absolute top-0 left-0 w-full h-8 bg-white border-b border-gray-100 flex items-center px-2 space-x-1">
                                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                        <div className="w-8 h-2 rounded bg-gray-200"></div>
                                      </div>
                                      <div className="absolute top-10 left-2 w-1/2 h-8 bg-white rounded shadow-sm"></div>
                                    </div>
                                  </div>

                                  <div
                                    onClick={() => setEditData({ ...editData, template_type: 'modern' })}
                                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md ${editData.template_type === 'modern' ? 'border-red bg-gray-900 ring-2 ring-red/20' : 'border-gray-200 bg-gray-800 hover:border-red/50'}`}
                                  >
                                    <div className="flex items-center gap-3 mb-3">
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${editData.template_type === 'modern' ? 'border-red' : 'border-gray-500'}`}>
                                        {editData.template_type === 'modern' && <div className="w-2 h-2 rounded-full bg-red" />}
                                      </div>
                                      <h6 className="font-bold text-white">Modern Dark (Premium)</h6>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-3">Tema gelap elegan dengan aksen neon dan animasi modern.</p>
                                    <div className="h-24 bg-gray-900 rounded-lg border border-gray-700 overflow-hidden relative">
                                      <div className="absolute top-0 left-0 w-full h-8 bg-gray-800 border-b border-gray-700 flex items-center px-2 space-x-1">
                                        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                                        <div className="w-8 h-2 rounded bg-gray-600"></div>
                                      </div>
                                      <div className="absolute top-10 left-2 w-1/2 h-8 bg-gray-800 rounded shadow-sm border border-gray-700"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Section 1: Colors */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                  <label className="block text-sm font-bold text-gray-700">Warna Kebanggaan (Primer)</label>
                                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <input
                                      type="color"
                                      value={editData.primary_color}
                                      onChange={(e) => setEditData({ ...editData, primary_color: e.target.value })}
                                      className="w-16 h-16 rounded-xl cursor-pointer border-2 border-white shadow-md p-0 bg-transparent overflow-hidden shrink-0"
                                    />
                                    <input
                                      type="text"
                                      value={editData.primary_color}
                                      onChange={(e) => setEditData({ ...editData, primary_color: e.target.value })}
                                      className="flex-1 h-12 px-4 rounded-xl border border-gray-200 font-mono text-center focus:border-red outline-none transition-all"
                                      placeholder="#990D35"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <label className="block text-sm font-bold text-gray-700">Warna Aksen (Sekunder)</label>
                                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <input
                                      type="color"
                                      value={editData.secondary_color}
                                      onChange={(e) => setEditData({ ...editData, secondary_color: e.target.value })}
                                      className="w-16 h-16 rounded-xl cursor-pointer border-2 border-white shadow-md p-0 bg-transparent overflow-hidden shrink-0"
                                    />
                                    <input
                                      type="text"
                                      value={editData.secondary_color}
                                      onChange={(e) => setEditData({ ...editData, secondary_color: e.target.value })}
                                      className="flex-1 h-12 px-4 rounded-xl border border-gray-200 font-mono text-center focus:border-red outline-none transition-all"
                                      placeholder="#F5B700"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Section 2: Asset Uploads */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-3">
                                  <label className="block text-sm font-bold text-gray-700">Ganti Logo Event</label>
                                  <div className="relative group/upload h-32 border-2 border-dashed border-gray-300 rounded-2xl hover:border-red/50 transition-colors bg-gray-50 flex items-center justify-center overflow-hidden">
                                    {logoFile ? (
                                      <img src={URL.createObjectURL(logoFile)} className="h-full w-full object-contain p-2" alt="New Logo" />
                                    ) : editData.logo_url ? (
                                      <img src={editData.logo_url} className="h-full w-full object-contain p-2" alt="Current Logo" />
                                    ) : (
                                      <div className="text-center">
                                        <Upload className="mx-auto text-gray-400 mb-2" />
                                        <span className="text-xs text-gray-500">Pilih Logo (PNG/JPG)</span>
                                      </div>
                                    )}
                                    <input
                                      type="file"
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                      onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                                      accept="image/*"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <label className="block text-sm font-bold text-gray-700">Ganti Hero/Banner Poster</label>
                                  <div className="relative group/upload h-32 border-2 border-dashed border-gray-300 rounded-2xl hover:border-red/50 transition-colors bg-gray-50 flex items-center justify-center overflow-hidden">
                                    {heroFile ? (
                                      <img src={URL.createObjectURL(heroFile)} className="h-full w-full object-cover" alt="New Hero" />
                                    ) : komp.poster_image ? (
                                      <img src={komp.poster_image} className="h-full w-full object-cover" alt="Current Hero" />
                                    ) : (
                                      <div className="text-center">
                                        <Upload className="mx-auto text-gray-400 mb-2" />
                                        <span className="text-xs text-gray-500">Pilih Banner Utama</span>
                                      </div>
                                    )}
                                    <input
                                      type="file"
                                      className="absolute inset-0 opacity-0 cursor-pointer"
                                      onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                                      accept="image/*"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {activeThemeTab === 'konten' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                              {/* Hero Section */}
                              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <h6 className="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wider">Hero / Banner Utama</h6>
                                <div className="grid grid-cols-1 gap-4">
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Judul Utama (Event Name)</label>
                                    <div className="flex gap-4">
                                      <input
                                        type="text"
                                        value={editData.hero_title}
                                        onChange={(e) => setEditData({ ...editData, hero_title: e.target.value })}
                                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-red outline-none text-sm"
                                        placeholder="Contoh: Sriwijaya International (Kosongkan untuk default)"
                                      />
                                      <div className="w-32">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase">Tahun</label>
                                        <input
                                          type="text"
                                          value={editData.event_year}
                                          onChange={(e) => setEditData({ ...editData, event_year: e.target.value })}
                                          className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-red outline-none text-sm"
                                          placeholder="2025"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Deskripsi Singkat (Subtitle)</label>
                                    <textarea
                                      value={editData.hero_description}
                                      onChange={(e) => setEditData({ ...editData, hero_description: e.target.value })}
                                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-red outline-none text-sm h-20 resize-none"
                                      placeholder="Deskripsi singkat event di bawah judul..."
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* About Section */}
                              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <h6 className="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wider">Sambutan / About</h6>
                                <div className="grid grid-cols-1 gap-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-500 mb-1">Nama Ketua / Direktur</label>
                                      <input
                                        type="text"
                                        value={editData.about_director_name}
                                        onChange={(e) => setEditData({ ...editData, about_director_name: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-red outline-none text-sm"
                                        placeholder="Contoh: Hj. Meilinda, S.Sos.,M.M"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-500 mb-1">Jabatan</label>
                                      <input
                                        type="text"
                                        value={editData.about_director_title}
                                        onChange={(e) => setEditData({ ...editData, about_director_title: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-red outline-none text-sm"
                                        placeholder="Contoh: Ketua Panitia Pelaksana"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Slogan Sambutan (Quote)</label>
                                    <input
                                      type="text"
                                      value={editData.about_director_slogan}
                                      onChange={(e) => setEditData({ ...editData, about_director_slogan: e.target.value })}
                                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-red outline-none text-sm"
                                      placeholder="Contoh: SALAM TAEKWONDO INDONESIA..."
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Isi Sambutan / Deskripsi Lengkap</label>
                                    <textarea
                                      value={editData.about_description}
                                      onChange={(e) => setEditData({ ...editData, about_description: e.target.value })}
                                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-red outline-none text-sm h-32"
                                      placeholder="Teks sambutan lengkap..."
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {activeThemeTab === 'kontak' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                              {/* Contact Section */}
                              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <h6 className="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wider">Kontak & Lokasi</h6>
                                <div className="grid grid-cols-1 gap-4">
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Nama Lokasi / Venue</label>
                                    <input
                                      type="text"
                                      value={editData.contact_venue_name}
                                      onChange={(e) => setEditData({ ...editData, contact_venue_name: e.target.value })}
                                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-red outline-none text-sm"
                                      placeholder="Contoh: GOR Jakabaring, Palembang"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Deskripsi Kontak</label>
                                    <textarea
                                      value={editData.contact_description}
                                      onChange={(e) => setEditData({ ...editData, contact_description: e.target.value })}
                                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-red outline-none text-sm h-20 resize-none"
                                      placeholder="Informasi tambahan di bagian kontak..."
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-500 mb-1">Nomor Telepon 1 (Wajib)</label>
                                      <input
                                        type="text"
                                        value={editData.contact_phone_1}
                                        onChange={(e) => setEditData({ ...editData, contact_phone_1: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-red outline-none text-sm"
                                        placeholder="Contoh: 08123456789"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-500 mb-1">Nomor Telepon 2 (Opsional)</label>
                                      <input
                                        type="text"
                                        value={editData.contact_phone_2}
                                        onChange={(e) => setEditData({ ...editData, contact_phone_2: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-red outline-none text-sm"
                                        placeholder="Contoh: 08123456789"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-500 mb-1">Nama Kontak 1</label>
                                      <input
                                        type="text"
                                        value={editData.contact_person_name_1}
                                        onChange={(e) => setEditData({ ...editData, contact_person_name_1: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-red outline-none text-sm"
                                        placeholder="Contoh: Rora"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-500 mb-1">Nama Kontak 2</label>
                                      <input
                                        type="text"
                                        value={editData.contact_person_name_2}
                                        onChange={(e) => setEditData({ ...editData, contact_person_name_2: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-red outline-none text-sm"
                                        placeholder="Contoh: Rizka"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-500 mb-1">Username Instagram</label>
                                      <div className="flex items-center">
                                        <span className="bg-gray-100 border border-r-0 border-gray-200 px-3 py-2 rounded-l-xl text-gray-500 text-sm">@</span>
                                        <input
                                          type="text"
                                          value={editData.contact_instagram}
                                          onChange={(e) => setEditData({ ...editData, contact_instagram: e.target.value })}
                                          className="w-full px-3 py-2 rounded-r-xl border border-gray-200 focus:border-red outline-none text-sm"
                                          placeholder="sumsel_taekwondo"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold text-gray-500 mb-1">Link Embed Google Maps</label>
                                      <input
                                        type="text"
                                        value={editData.contact_gmaps_url}
                                        onChange={(e) => setEditData({ ...editData, contact_gmaps_url: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-red outline-none text-sm"
                                        placeholder="https://www.google.com/maps/embed?..."
                                      />
                                      <p className="text-[10px] text-gray-400 mt-1">*Masukkan URL dari menu Share &gt; Embed a map</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {activeThemeTab === 'informasi' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                              {/* Registration Steps Section */}
                              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <h6 className="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wider">Panduan Pendaftaran</h6>
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1">Deskripsi Panduan</label>
                                    <textarea
                                      value={editData.registration_description}
                                      onChange={(e) => setEditData({ ...editData, registration_description: e.target.value })}
                                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-red outline-none text-sm h-20 resize-none"
                                      placeholder="Kalimat pengantar di bagian panduan pendaftaran..."
                                    />
                                  </div>
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <label className="block text-xs font-bold text-gray-700 uppercase">Langkah-langkah (Steps)</label>
                                      <button
                                        onClick={() => {
                                          const nextNum = editData.registration_steps.length + 1;
                                          setEditData({
                                            ...editData,
                                            registration_steps: [
                                              ...editData.registration_steps,
                                              { number: nextNum, title: 'Langkah Baru', desc: 'Deskripsi langkah...' }
                                            ]
                                          });
                                        }}
                                        className="flex items-center gap-1 text-sm bg-red text-white font-bold px-4 py-2 rounded-lg hover:opacity-90 hover:scale-103 cursor-pointer transition-all"
                                      >
                                        <Plus size={20} />
                                        Tambah Step
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                      {editData.registration_steps.map((step, idx) => (
                                        <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm space-y-2 relative group">
                                          <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-red text-white text-sm font-bold rounded-full flex items-center justify-center shrink-0">
                                              {idx + 1}
                                            </div>
                                            <input
                                              type="text"
                                              value={step.title}
                                              onChange={(e) => {
                                                const newSteps = [...editData.registration_steps];
                                                newSteps[idx].title = e.target.value;
                                                setEditData({ ...editData, registration_steps: newSteps });
                                              }}
                                              className="flex-1 font-bold text-sm bg-transparent border-b border-transparent focus:border-red outline-none"
                                              placeholder="Judul Step"
                                            />
                                            <button
                                              onClick={() => {
                                                const newSteps = editData.registration_steps.filter((_, i) => i !== idx);
                                                // reorder numbers
                                                const reordered = newSteps.map((s, i) => ({ ...s, number: i + 1 }));
                                                setEditData({ ...editData, registration_steps: reordered });
                                              }}
                                              className="text-red hover:scale-110 cursor-pointer transition-all opacity-0 group-hover:opacity-100"
                                            >
                                              <Trash2 size={20} />
                                            </button>
                                          </div>
                                          <textarea
                                            value={step.desc}
                                            onChange={(e) => {
                                              const newSteps = [...editData.registration_steps];
                                              newSteps[idx].desc = e.target.value;
                                              setEditData({ ...editData, registration_steps: newSteps });
                                            }}
                                            className="w-full text-sm text-gray-500 bg-transparent border-none focus:ring-0 resize-none h-12 p-0"
                                            placeholder="Deskripsi langkah..."
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* FAQ Management Section */}
                              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <h6 className="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wider flex items-center justify-between">
                                  FAQ (Kategori & Pertanyaan)
                                  <button
                                    onClick={() => {
                                      setEditData({
                                        ...editData,
                                        faq_data: [
                                          ...editData.faq_data || [],
                                          { title: 'Kategori Baru', description: 'Deskripsi kategori...', questions: [{ question: 'Pertanyaan Baru', answer: 'Jawaban...' }] }
                                        ]
                                      });
                                    }}
                                    className="flex items-center gap-1 text-sm bg-red text-white font-bold px-4 py-2 rounded-lg hover:opacity-90 hover:scale-103 cursor-pointer transition-all"
                                  >
                                    <Plus size={20} />
                                    Tambah Kategori
                                  </button>
                                </h6>
                                <div className="space-y-6">
                                  {(editData.faq_data || []).map((section: any, sIdx: number) => (
                                    <div key={sIdx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4 relative group">
                                      <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                          <input
                                            type="text"
                                            value={section.title}
                                            onChange={(e) => {
                                              const newFaq = [...editData.faq_data];
                                              newFaq[sIdx].title = e.target.value;
                                              setEditData({ ...editData, faq_data: newFaq });
                                            }}
                                            className="w-full font-bold text-base bg-transparent border-b border-gray-100 focus:border-red outline-none pb-1"
                                            placeholder="Judul Kategori FAQ"
                                          />
                                          <input
                                            type="text"
                                            value={section.description}
                                            onChange={(e) => {
                                              const newFaq = [...editData.faq_data];
                                              newFaq[sIdx].description = e.target.value;
                                              setEditData({ ...editData, faq_data: newFaq });
                                            }}
                                            className="w-full text-sm text-gray-500 bg-transparent border-none focus:ring-0 p-0"
                                            placeholder="Deskripsi singkat kategori..."
                                          />
                                        </div>
                                        <button
                                          onClick={() => {
                                            const newFaq = editData.faq_data.filter((_: any, i: number) => i !== sIdx);
                                            setEditData({ ...editData, faq_data: newFaq });
                                          }}
                                          className="text-red hover:scale-110 cursor-pointer transition-all opacity-0 group-hover:opacity-100"
                                          title="Hapus Kategori"
                                        >
                                          <Trash2 size={20} />
                                        </button>
                                      </div>

                                      <div className="pl-4 border-l-2 border-red/10 space-y-4">
                                        <div className="flex items-center justify-between">
                                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daftar Pertanyaan</span>
                                          <button
                                            onClick={() => {
                                              const newFaq = [...editData.faq_data];
                                              newFaq[sIdx].questions = [
                                                ...newFaq[sIdx].questions || [],
                                                { question: 'Pertanyaan Baru', answer: 'Jawaban...' }
                                              ];
                                              setEditData({ ...editData, faq_data: newFaq });
                                            }}
                                            className="flex items-center gap-1 text-sm text-red font-bold cursor-pointer hover:underline pr-4 transition-all"
                                          >
                                            <Plus size={20} />
                                            Tambah Pertanyaan
                                          </button>
                                        </div>

                                        <div className="space-y-3">
                                          {(section.questions || []).map((q: any, qIdx: number) => (
                                            <div key={qIdx} className="bg-gray-50/50 p-3 rounded-lg border border-red space-y-2 relative group">
                                              <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 flex-1">
                                                  <HelpCircle size={16} className="text-red/60" />
                                                  <input
                                                    type="text"
                                                    value={q.question}
                                                    onChange={(e) => {
                                                      const newFaq = [...editData.faq_data];
                                                      newFaq[sIdx].questions[qIdx].question = e.target.value;
                                                      setEditData({ ...editData, faq_data: newFaq });
                                                    }}
                                                    className="w-full text-sm font-semibold bg-transparent border-none focus:ring-0 p-0"
                                                    placeholder="Pertanyaan..."
                                                  />
                                                </div>
                                                <button
                                                  onClick={() => {
                                                    const newFaq = [...editData.faq_data];
                                                    newFaq[sIdx].questions = newFaq[sIdx].questions.filter((_: any, i: number) => i !== qIdx);
                                                    setEditData({ ...editData, faq_data: newFaq });
                                                  }}
                                                  className="text-red hover:scale-110 cursor-pointer transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                  <Trash2 size={20} />
                                                </button>
                                              </div>
                                              <div className="flex items-start gap-2">
                                                <MessageCircle size={16} className="text-gray-400" />
                                                <textarea
                                                  value={q.answer}
                                                  onChange={(e) => {
                                                    const newFaq = [...editData.faq_data];
                                                    newFaq[sIdx].questions[qIdx].answer = e.target.value;
                                                    setEditData({ ...editData, faq_data: newFaq });
                                                  }}
                                                  className="w-full text-sm text-gray-600 bg-transparent border-none focus:ring-0 p-0 h-16 resize-none"
                                                  placeholder="Jawaban..."
                                                />
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  {(!editData.faq_data || editData.faq_data.length === 0) && (
                                    <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-200">
                                      <HelpCircle className="mx-auto text-gray-300 mb-2" size={24} />
                                      <p className="text-xs text-gray-400">Belum ada data FAQ. Tambahkan kategori pertama Anda.</p>
                                    </div>
                                  )}
                                </div>
                              </div>


                              {/* Timeline Management Section */}
                              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mt-6">
                                <h6 className="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wider flex items-center justify-between">
                                  Timeline (Jadwal Kegiatan)
                                  <button
                                    onClick={() => {
                                      setEditData({
                                        ...editData,
                                        timeline_data: [
                                          ...editData.timeline_data || [],
                                          { event: 'Kegiatan Baru', time: 'Waktu...', side: 'left', month: 'Bulan...' }
                                        ]
                                      });
                                    }}
                                    className="flex items-center gap-1 text-sm bg-red text-white font-bold px-4 py-2 rounded-lg hover:opacity-90 hover:scale-103 cursor-pointer transition-all"
                                  >
                                    <Plus size={20} />
                                    Tambah Event
                                  </button>
                                </h6>
                                <div className="space-y-4">
                                  {(editData.timeline_data || []).map((item: any, idx: number) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3 relative group">
                                      <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                              <Calendar size={10} /> Nama Kegiatan
                                            </label>
                                            <input
                                              type="text"
                                              value={item.event}
                                              onChange={(e) => {
                                                const newTimeline = [...editData.timeline_data];
                                                newTimeline[idx].event = e.target.value;
                                                setEditData({ ...editData, timeline_data: newTimeline });
                                              }}
                                              className="w-full font-bold text-sm bg-transparent border-b border-gray-50 focus:border-red outline-none pb-1"
                                              placeholder="Nama Kegiatan"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                              <Clock size={10} /> Waktu / Tanggal
                                            </label>
                                            <input
                                              type="text"
                                              value={item.time}
                                              onChange={(e) => {
                                                const newTimeline = [...editData.timeline_data];
                                                newTimeline[idx].time = e.target.value;
                                                setEditData({ ...editData, timeline_data: newTimeline });
                                              }}
                                              className="w-full text-sm text-gray-600 bg-transparent border-b border-gray-50 focus:border-red outline-none pb-1"
                                              placeholder="Contoh: 1 Agustus - 8 Nov"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                              <Calendar size={10} /> Bulan (Group)
                                            </label>
                                            <input
                                              type="text"
                                              value={item.month}
                                              onChange={(e) => {
                                                const newTimeline = [...editData.timeline_data];
                                                newTimeline[idx].month = e.target.value;
                                                setEditData({ ...editData, timeline_data: newTimeline });
                                              }}
                                              className="w-full text-sm text-gray-600 bg-transparent border-b border-gray-50 focus:border-red outline-none pb-1"
                                              placeholder="Contoh: November"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                              <ArrowLeftRight size={10} /> Sisi Tampilan (Desktop)
                                            </label>
                                            <select
                                              value={item.side}
                                              onChange={(e) => {
                                                const newTimeline = [...editData.timeline_data];
                                                newTimeline[idx].side = e.target.value;
                                                setEditData({ ...editData, timeline_data: newTimeline });
                                              }}
                                              className="w-full text-sm text-gray-600 bg-transparent border-b border-gray-50 focus:border-red outline-none pb-1 cursor-pointer"
                                            >
                                              <option value="left text-right">Kiri</option>
                                              <option value="right">Kanan</option>
                                            </select>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => {
                                            const newTimeline = editData.timeline_data.filter((_: any, i: number) => i !== idx);
                                            setEditData({ ...editData, timeline_data: newTimeline });
                                          }}
                                          className="text-red hover:scale-110 cursor-pointer transition-all opacity-0 group-hover:opacity-100"
                                          title="Hapus Event"
                                        >
                                          <Trash2 size={20} />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                  {(!editData.timeline_data || editData.timeline_data.length === 0) && (
                                    <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-200">
                                      <Calendar className="mx-auto text-gray-300 mb-2" size={24} />
                                      <p className="text-xs text-gray-400">Belum ada data Timeline. Tambahkan kegiatan pertama Anda.</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {activeThemeTab === 'fitur' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                              {/* Section 3: Visibility Configuration */}
                              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                  <Layout size={18} className="text-red" />
                                  Konfigurasi Visibility Interface
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl">
                                    <div>
                                      <p className="font-semibold text-sm">Tampilkan Antrean</p>
                                      <p className="text-xs text-gray-500">Tampilkan list antrean lapangan di landing page</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={editData.show_antrian}
                                        onChange={(e) => setEditData({ ...editData, show_antrian: e.target.checked })}
                                        className="sr-only peer"
                                      />
                                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red"></div>
                                    </label>
                                  </div>

                                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl">
                                    <div>
                                      <p className="font-semibold text-sm">Hide Seluruh Navbar (Kecuali Beranda)</p>
                                      <p className="text-xs text-gray-500">Sembunyikan link menu lain di navbar event</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={!editData.show_navbar}
                                        onChange={(e) => setEditData({ ...editData, show_navbar: !e.target.checked })}
                                        className="sr-only peer"
                                      />
                                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red"></div>
                                    </label>
                                  </div>
                                </div>
                              </div>

                              {/* Section 4: Tutorial Management */}
                              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                  <h5 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Video size={18} className="text-red" />
                                    Manajemen Video Tutorial
                                  </h5>
                                  <button
                                    onClick={() => setIsAddingTutorial(!isAddingTutorial)}
                                    className="px-3 py-1.5 bg-red/10 text-red text-xs font-bold rounded-lg hover:bg-red/20 flex items-center gap-1 transition-all"
                                  >
                                    {isAddingTutorial ? <X size={14} /> : <Plus size={14} />}
                                    {isAddingTutorial ? 'Batal' : 'Tambah Tutorial'}
                                  </button>
                                </div>

                                {isAddingTutorial && (
                                  <div className="bg-red/5 p-4 rounded-2xl border border-red/10 mb-4 space-y-4 animate-in slide-in-from-right-4 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <input
                                        type="text"
                                        placeholder="Judul Tutorial"
                                        value={newTutorial.title}
                                        onChange={e => setNewTutorial({ ...newTutorial, title: e.target.value })}
                                        className="px-3 py-2 rounded-xl border border-red/20 focus:border-red focus:ring-1 focus:ring-red outline-none text-sm"
                                      />
                                      <input
                                        type="text"
                                        placeholder="URL Video YouTube / ID"
                                        value={newTutorial.video_id}
                                        onChange={e => setNewTutorial({ ...newTutorial, video_id: e.target.value })}
                                        className="px-3 py-2 rounded-xl border border-red/20 focus:border-red focus:ring-1 focus:ring-red outline-none text-sm"
                                      />
                                      <select
                                        value={newTutorial.icon_type}
                                        onChange={e => setNewTutorial({ ...newTutorial, icon_type: e.target.value })}
                                        className="px-3 py-2 rounded-xl border border-red/20 focus:border-red focus:ring-1 focus:ring-red outline-none text-sm bg-white"
                                      >
                                        <option value="FileText">Icon: File</option>
                                        <option value="User">Icon: User</option>
                                        <option value="Award">Icon: Trophy</option>
                                        <option value="Video">Icon: Video</option>
                                        <option value="HelpCircle">Icon: Help</option>
                                        <option value="BookOpen">Icon: Book</option>
                                      </select>
                                    </div>
                                    <textarea
                                      placeholder="Deskripsi singkat tutorial..."
                                      value={newTutorial.description}
                                      onChange={e => setNewTutorial({ ...newTutorial, description: e.target.value })}
                                      className="w-full px-3 py-2 rounded-xl border border-red/20 focus:border-red focus:ring-1 focus:ring-red outline-none text-sm h-16 resize-none"
                                    />
                                    <div className="flex justify-end">
                                      <button
                                        onClick={handleAddTutorial}
                                        className="px-6 py-2 bg-red text-white text-sm font-bold rounded-xl hover:opacity-90 shadow-md shadow-red/20"
                                      >
                                        Simpan Tutorial Baru
                                      </button>
                                    </div>
                                  </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {tutorials.map((tut) => (
                                    <div key={tut.id_tutorial} className="p-4 bg-white border border-gray-100 rounded-2xl flex flex-col justify-between group/tut relative">
                                      <div>
                                        <div className="aspect-video bg-gray-100 rounded-lg mb-2 overflow-hidden relative">
                                          <img src={`https://img.youtube.com/vi/${tut.video_id}/mqdefault.jpg`} className="w-full h-full object-cover" alt="" />
                                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/tut:opacity-100 transition-opacity">
                                            <Video className="text-white" />
                                          </div>
                                        </div>
                                        <h6 className="font-bold text-sm truncate">{tut.title}</h6>
                                        <p className="text-[10px] text-gray-500 line-clamp-2">{tut.description}</p>
                                      </div>
                                      <button
                                        onClick={() => handleDeleteTutorial(tut.id_tutorial)}
                                        className="mt-3 text-red/60 hover:text-red transition-colors"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  ))}
                                  {tutorials.length === 0 && !isAddingTutorial && (
                                    <div className="col-span-full py-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                      <p className="text-xs text-gray-400">Belum ada tutorial khusus untuk kompetisi ini.</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Actions Footer */}
                          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-6 py-3 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors"
                            >
                              Batal
                            </button>
                            <button
                              onClick={() => handleResetTheme(komp.id_kompetisi)}
                              className="px-6 py-3 text-red/60 hover:text-red border border-red/10 hover:border-red/30 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
                            >
                              <RefreshCw size={16} />
                              Reset ke Default
                            </button>
                            <button
                              onClick={() => handleSaveTheme(komp.id_kompetisi)}
                              className="px-10 py-3 bg-red text-white rounded-xl text-sm font-bold shadow-xl shadow-red/20 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                            >
                              <Save size={18} />
                              Simpan Seluruh Perubahan
                            </button>
                          </div>
                        </div></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'security': return renderSecurityTab();
      case 'notifications': return renderNotificationsTab();
      case 'system': return renderSystemTab();
      case 'email': return renderEmailTab();
      case 'kompetisi': return renderKompetisiTab();
      default: return renderProfileTab();
    }
  };

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#F5FBEF', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1
            className="font-inter font-bold"
            style={{ fontSize: '32px', color: '#050505' }}
          >
            Pengaturan Sistem
          </h1>
          <p
            className="font-inter mt-1"
            style={{ fontSize: '16px', color: '#050505', opacity: '0.7' }}
          >
            Kelola konfigurasi dan preferensi sistem
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64">
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            <nav className="space-y-2">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 font-inter font-medium ${activeTab === tab.id
                    ? 'bg-red text-white shadow-sm'
                    : 'text-black hover:bg-red/10 hover:text-red'
                    }`}
                >
                  <tab.icon
                    size={18}
                    className={activeTab === tab.id ? 'text-yellow' : 'text-current'}
                  />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div
            className="p-6 rounded-xl"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            {renderTabContent()}

            {/* Save Button */}
            <div className="flex justify-end mt-8 pt-6 border-t border-black/10">
              <button
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-inter font-medium transition-all duration-300 bg-red text-white hover:opacity-90 hover:shadow-md"
              >
                <Save size={16} />
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
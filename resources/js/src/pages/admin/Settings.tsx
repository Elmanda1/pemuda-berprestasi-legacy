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
  Palette
} from 'lucide-react';
import { useKompetisi } from '../../context/KompetisiContext';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true
  });

  const { kompetisiList, updateKompetisiTheme, fetchKompetisiList, loadingKompetisi } = useKompetisi();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ primary_color: '', secondary_color: '', logo_url: '' });

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
    { id: 'kompetisi', label: 'Tema Kompetisi', icon: Trophy }
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
        logo_url: komp.logo_url || ''
      });
    };

    const handleSaveTheme = async (id: number) => {
      try {
        await updateKompetisiTheme(id, editData);
        // ⭐ Set active competition to current one so theme applies to Admin UI
        localStorage.setItem('currentKompetisiId', id.toString());
        toast.success("Tema kompetisi berhasil diperbarui");
        setEditingId(null);
      } catch (err) {
        toast.error("Gagal memperbarui tema");
      }
    };

    return (
      <div className="space-y-6">
        <div className="p-6 rounded-xl bg-white border border-gray-100">
          <h3 className="font-inter font-semibold mb-4 text-lg">Kustomisasi Tema Kompetisi</h3>
          <p className="text-sm text-gray-500 mb-6">Sesuaikan warna identitas dan logo untuk setiap kompetisi.</p>

          {loadingKompetisi ? (
            <div className="flex justify-center p-12">
              <RefreshCw className="animate-spin text-red" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {kompetisiList.map((komp) => (
                <div
                  key={komp.id_kompetisi}
                  className="p-5 rounded-2xl border transition-all duration-300 hover:shadow-md"
                  style={{ borderColor: editingId === komp.id_kompetisi ? '#990D35' : '#00000010' }}
                >
                  <div className={`transition-all duration-300 ${editingId === komp.id_kompetisi ? 'space-y-6' : 'flex flex-col md:flex-row md:items-center justify-between gap-4'}`}>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0 shadow-sm transition-colors duration-300"
                        style={{ backgroundColor: (editingId === komp.id_kompetisi ? editData.primary_color : komp.primary_color) || '#990D35' }}
                      >
                        {komp.nama_event.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-inter font-bold text-gray-900 leading-tight">{komp.nama_event}</h4>
                        <p className="text-sm text-gray-500">{komp.lokasi || 'Lokasi tidak diatur'}</p>
                      </div>
                    </div>

                    {editingId === komp.id_kompetisi ? (
                      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Warna Primer</label>
                            <p className="text-xs text-gray-500 mb-2">Mengganti warna merah/maroon standar</p>
                            <div className="flex items-center gap-3">
                              <input
                                type="color"
                                value={editData.primary_color}
                                onChange={(e) => setEditData({ ...editData, primary_color: e.target.value })}
                                className="w-16 h-16 rounded-2xl cursor-pointer border-4 border-white shadow-md p-0 bg-transparent overflow-hidden shrink-0 transition-transform hover:scale-105 active:scale-95"
                              />
                              <input
                                type="text"
                                value={editData.primary_color}
                                onChange={(e) => setEditData({ ...editData, primary_color: e.target.value })}
                                className="flex-1 h-16 px-4 py-2.5 rounded-2xl border border-gray-200 text-lg font-mono focus:ring-4 focus:ring-red/10 focus:border-red outline-none transition-all shadow-sm"
                                placeholder="#990D35"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Warna Sekunder</label>
                            <p className="text-xs text-gray-500 mb-2">Mengganti warna kuning/aksen standar</p>
                            <div className="flex items-center gap-3">
                              <input
                                type="color"
                                value={editData.secondary_color}
                                onChange={(e) => setEditData({ ...editData, secondary_color: e.target.value })}
                                className="w-16 h-16 rounded-2xl cursor-pointer border-4 border-white shadow-md p-0 bg-transparent overflow-hidden shrink-0 transition-transform hover:scale-105 active:scale-95"
                              />
                              <input
                                type="text"
                                value={editData.secondary_color}
                                onChange={(e) => setEditData({ ...editData, secondary_color: e.target.value })}
                                className="flex-1 h-16 px-4 py-2.5 rounded-2xl border border-gray-200 text-lg font-mono focus:ring-4 focus:ring-red/10 focus:border-red outline-none transition-all shadow-sm"
                                placeholder="#F5B700"
                              />
                            </div>
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700">Logo Kompetisi (URL)</label>
                            <input
                              type="text"
                              value={editData.logo_url}
                              onChange={(e) => setEditData({ ...editData, logo_url: e.target.value })}
                              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-red/20 focus:border-red outline-none transition-all"
                              placeholder="https://example.com/logo.png"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-6 py-2.5 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => handleSaveTheme(komp.id_kompetisi)}
                            className="px-8 py-2.5 bg-red text-white rounded-xl text-sm font-semibold hover:opacity-90 shadow-lg shadow-red/20 transition-all flex items-center gap-2"
                          >
                            <Save size={18} />
                            Simpan Perubahan
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(komp)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all text-sm font-semibold text-gray-700 active:scale-95"
                      >
                        <Palette size={18} className="text-red" />
                        Atur Branding
                      </button>
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
// src/pages/admin/Penyelenggara.tsx
import React, { useState, useEffect } from 'react';
import { Search, Trash2, Plus, Loader, AlertTriangle, Building2, X, Edit2, ChevronLeft, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/authContext';

interface PenyelenggaraItem {
    id_penyelenggara: number;
    nama_penyelenggara: string;
    email: string;
    no_telp?: string;
    alamat?: string;
}

const Penyelenggara: React.FC = () => {
    const { token, isSuperAdmin } = useAuth();
    const [items, setItems] = useState<PenyelenggaraItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 10;

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [editItem, setEditItem] = useState<PenyelenggaraItem | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [form, setForm] = useState({
        nama_penyelenggara: '',
        email: '',
        no_telp: '',
        alamat: ''
    });

    useEffect(() => {
        if (!isSuperAdmin) {
            setError('Anda tidak memiliki akses ke halaman ini');
            setLoading(false);
            return;
        }
        fetchData();
    }, [isSuperAdmin, page]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`/api/v1/admin/penyelenggara?page=${page}&limit=${limit}&search=${searchTerm}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch data');

            const data = await response.json();
            setItems(data.data || []);
            setTotal(data.total || 0);
            setTotalPages(data.last_page || 1);
        } catch (err: any) {
            setError(err.message || 'Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        fetchData();
    };

    const openCreateModal = () => {
        setModalMode('create');
        setEditItem(null);
        setForm({ nama_penyelenggara: '', email: '', no_telp: '', alamat: '' });
        setShowModal(true);
    };

    const openEditModal = (item: PenyelenggaraItem) => {
        setModalMode('edit');
        setEditItem(item);
        setForm({
            nama_penyelenggara: item.nama_penyelenggara,
            email: item.email,
            no_telp: item.no_telp || '',
            alamat: item.alamat || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.nama_penyelenggara || !form.email) {
            toast.error('Nama dan email wajib diisi');
            return;
        }

        try {
            setFormLoading(true);
            const url = modalMode === 'create'
                ? '/api/v1/admin/penyelenggara'
                : `/api/v1/admin/penyelenggara/${editItem?.id_penyelenggara}`;

            const response = await fetch(url, {
                method: modalMode === 'create' ? 'POST' : 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Gagal menyimpan');

            toast.success(modalMode === 'create' ? 'Penyelenggara berhasil dibuat' : 'Penyelenggara berhasil diupdate');
            setShowModal(false);
            fetchData();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id: number, nama: string) => {
        if (!window.confirm(`Hapus penyelenggara "${nama}"?`)) return;

        try {
            setActionLoading(id);
            const response = await fetch(`/api/v1/admin/penyelenggara/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Gagal menghapus');
            }

            toast.success('Penyelenggara berhasil dihapus');
            fetchData();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    if (!isSuperAdmin) {
        return (
            <div className="p-6 flex items-center justify-center min-h-96">
                <div className="text-center">
                    <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
                    <p className="text-gray-600">Anda tidak memiliki akses ke halaman ini</p>
                </div>
            </div>
        );
    }

    if (loading && items.length === 0) {
        return (
            <div className="p-6 flex items-center justify-center min-h-96">
                <div className="text-center">
                    <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
                    <p className="text-gray-600">Memuat data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Building2 className="text-gray-600" size={24} />
                    <h1 className="text-3xl font-bold text-gray-800">Penyelenggara</h1>
                </div>
                <p className="text-gray-600">Kelola organisasi penyelenggara kompetisi</p>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
                    <AlertTriangle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {/* Search and Create */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari penyelenggara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red/50"
                        />
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-red text-white rounded-lg hover:bg-red/90 transition-colors font-medium"
                    >
                        <Plus size={18} />
                        Tambah Penyelenggara
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Penyelenggara</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Kontak</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Alamat</th>
                                <th className="text-left py-4 px-6 font-semibold text-gray-900">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id_penyelenggara} className="border-t border-gray-200 hover:bg-gray-50">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <Building2 size={20} className="text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{item.nama_penyelenggara}</p>
                                                <p className="text-sm text-gray-500">ID: {item.id_penyelenggara}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail size={14} />
                                                <span>{item.email}</span>
                                            </div>
                                            {item.no_telp && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone size={14} />
                                                    <span>{item.no_telp}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        {item.alamat ? (
                                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                                                <span className="line-clamp-2">{item.alamat}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id_penyelenggara, item.nama_penyelenggara)}
                                                disabled={actionLoading === item.id_penyelenggara}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                {actionLoading === item.id_penyelenggara ? (
                                                    <Loader size={16} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {items.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <Building2 size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 text-lg">Tidak ada penyelenggara</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Halaman {page} dari {totalPages} ({total} total)
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">
                                {modalMode === 'create' ? 'Tambah Penyelenggara' : 'Edit Penyelenggara'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penyelenggara *</label>
                                <input
                                    type="text"
                                    value={form.nama_penyelenggara}
                                    onChange={(e) => setForm({ ...form, nama_penyelenggara: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red/50"
                                    placeholder="PT. Taekwondo Indonesia"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red/50"
                                    placeholder="contact@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
                                <input
                                    type="text"
                                    value={form.no_telp}
                                    onChange={(e) => setForm({ ...form, no_telp: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red/50"
                                    placeholder="+62812345678"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                                <textarea
                                    value={form.alamat}
                                    onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                                    rows={3}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red/50"
                                    placeholder="Jl. Contoh No. 123, Jakarta"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="flex-1 py-3 bg-red text-white rounded-lg hover:bg-red/90 transition-colors font-medium disabled:opacity-50"
                                >
                                    {formLoading ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Penyelenggara;

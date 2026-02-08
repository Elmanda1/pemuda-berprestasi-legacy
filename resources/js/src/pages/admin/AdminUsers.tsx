// src/pages/admin/AdminUsers.tsx
import React, { useState, useEffect } from 'react';
import { Search, Trash2, UserPlus, Loader, AlertTriangle, Users, X, Building2, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/authContext';

interface User {
  id_akun: number;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN_PENYELENGGARA' | 'ADMIN_KOMPETISI' | 'PELATIH';
  nama: string;
  penyelenggara?: {
    id_penyelenggara: number;
    nama_penyelenggara: string;
  };
  kompetisi?: {
    id_kompetisi: number;
    nama_event: string;
  };
  dojang?: {
    id_dojang: number;
    nama_dojang: string;
  };
}

interface Penyelenggara {
  id_penyelenggara: number;
  nama_penyelenggara: string;
  email?: string;
}

interface Kompetisi {
  id_kompetisi: number;
  nama_event: string;
  status: string;
  penyelenggara?: {
    nama_penyelenggara: string;
  };
}

const AdminUsers: React.FC = () => {
  const { token, isSuperAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'ALL' | 'SUPER_ADMIN' | 'ADMIN_PENYELENGGARA' | 'ADMIN_KOMPETISI' | 'PELATIH'>('ALL');
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [stats, setStats] = useState({
    total_users: 0,
    super_admin: 0,
    admin_penyelenggara: 0,
    admin_kompetisi: 0,
    pelatih: 0
  });

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    nama: '',
    role: 'ADMIN_PENYELENGGARA' as 'ADMIN_PENYELENGGARA' | 'ADMIN_KOMPETISI',
    id_penyelenggara: '',
    id_kompetisi: ''
  });

  // Dropdown options
  const [penyelenggaraList, setPenyelenggaraList] = useState<Penyelenggara[]>([]);
  const [kompetisiList, setKompetisiList] = useState<Kompetisi[]>([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(15);

  useEffect(() => {
    if (!isSuperAdmin) {
      setError('Anda tidak memiliki akses ke halaman ini');
      setLoading(false);
      return;
    }
    fetchUsers();
    fetchPenyelenggaraList();
    fetchKompetisiList();
  }, [isSuperAdmin, page, filterRole, limit]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const roleParam = filterRole !== 'ALL' ? `&role=${filterRole}` : '';
      const response = await fetch(`/api/v1/admin/users?page=${page}&limit=${limit}${roleParam}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.data || []);
      setTotal(data.total || 0);
      setTotalPages(data.last_page || 1);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Gagal memuat data user');
    } finally {
      setLoading(false);
    }
  };

  const fetchPenyelenggaraList = async () => {
    try {
      const response = await fetch('/api/v1/admin/users/penyelenggara-list', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPenyelenggaraList(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching penyelenggara:', err);
    }
  };

  const fetchKompetisiList = async () => {
    try {
      const response = await fetch('/api/v1/admin/users/kompetisi-list', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setKompetisiList(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching kompetisi:', err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createForm.email || !createForm.password || !createForm.nama) {
      toast.error('Mohon lengkapi semua field');
      return;
    }

    if (createForm.role === 'ADMIN_PENYELENGGARA' && !createForm.id_penyelenggara) {
      toast.error('Pilih penyelenggara untuk Admin');
      return;
    }

    if (createForm.role === 'ADMIN_KOMPETISI' && !createForm.id_kompetisi) {
      toast.error('Pilih kompetisi untuk Admin Kompetisi');
      return;
    }

    try {
      setCreateLoading(true);
      const response = await fetch('/api/v1/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: createForm.email,
          password: createForm.password,
          nama: createForm.nama,
          role: createForm.role,
          id_penyelenggara: createForm.role === 'ADMIN_PENYELENGGARA' ? parseInt(createForm.id_penyelenggara) : undefined,
          id_kompetisi: createForm.role === 'ADMIN_KOMPETISI' ? parseInt(createForm.id_kompetisi) : undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gagal membuat user');
      }

      toast.success('User berhasil dibuat!');
      setShowCreateModal(false);
      setCreateForm({ email: '', password: '', nama: '', role: 'ADMIN_PENYELENGGARA', id_penyelenggara: '', id_kompetisi: '' });
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Gagal membuat user');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus user "${userName}"?`)) {
      return;
    }

    try {
      setActionLoading(userId);
      const response = await fetch(`/api/v1/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal menghapus user');
      }

      toast.success('User berhasil dihapus');
      setUsers(prev => prev.filter(user => user.id_akun !== userId));
    } catch (err: any) {
      toast.error(err.message || 'Gagal menghapus user');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      SUPER_ADMIN: 'bg-red-100 text-red-800 border-red-200',
      ADMIN_PENYELENGGARA: 'bg-purple-100 text-purple-800 border-purple-200',
      ADMIN_KOMPETISI: 'bg-blue-100 text-blue-800 border-blue-200',
      PELATIH: 'bg-green-100 text-green-800 border-green-200'
    };

    const labels: Record<string, string> = {
      SUPER_ADMIN: 'Super Admin',
      ADMIN_PENYELENGGARA: 'Admin Penyelenggara',
      ADMIN_KOMPETISI: 'Admin Kompetisi',
      PELATIH: 'Pelatih'
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium border ${styles[role] || 'bg-gray-100'}`}>
        {labels[role] || role}
      </span>
    );
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
          <p className="text-gray-600">Memuat data user...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-bebas text-4xl tracking-wide text-gray-900">Manajemen User</h1>
          <p className="text-gray-500 mt-2 font-inter">Kelola semua user, hak akses, dan peran dalam sistem.</p>
        </div>
        <div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red text-white shadow-lg shadow-red/20 hover:scale-105 active:scale-95 transition-all font-bold"
          >
            <UserPlus size={20} />
            Tambah User Baru
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-2 animate-in fade-in">
          <AlertTriangle size={20} />
          <div>
            <strong>Error:</strong> {error}
            <button onClick={fetchUsers} className="ml-4 text-red-800 underline hover:no-underline font-bold">
              Coba lagi
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-bold uppercase">Super Admin</span>
            <Users size={16} className="text-red" />
          </div>
          <p className="text-3xl font-bebas text-gray-900">{stats.super_admin}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-bold uppercase">Admin Peserta</span>
            <Users size={16} className="text-purple-500" />
          </div>
          <p className="text-3xl font-bebas text-gray-900">{stats.admin_penyelenggara}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-bold uppercase">Admin Kompetisi</span>
            <Users size={16} className="text-blue-500" />
          </div>
          <p className="text-3xl font-bebas text-gray-900">{stats.admin_kompetisi}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-bold uppercase">Pelatih</span>
            <Users size={16} className="text-green-500" />
          </div>
          <p className="text-3xl font-bebas text-gray-900">{stats.pelatih}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red focus:border-red outline-none transition-all"
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red focus:border-red outline-none transition-all"
          >
            <option value="ALL">Semua Role</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN_PENYELENGGARA">Admin Penyelenggara</option>
            <option value="ADMIN_KOMPETISI">Admin Kompetisi</option>
            <option value="PELATIH">Pelatih</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">User</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Role</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Organisasi</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isLoading = actionLoading === user.id_akun;
                const orgName = user.penyelenggara?.nama_penyelenggara ||
                  user.kompetisi?.nama_event ||
                  user.dojang?.nama_dojang ||
                  '-';

                return (
                  <tr key={user.id_akun} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{user.nama}</p>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">{getRoleBadge(user.role)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {user.penyelenggara && <Building2 size={14} className="text-purple-500" />}
                        {user.kompetisi && <Trophy size={14} className="text-blue-500" />}
                        <span className="text-gray-700">{orgName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {user.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => handleDeleteUser(user.id_akun, user.nama)}
                          disabled={isLoading}
                          className={`p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title="Hapus User"
                        >
                          {isLoading ? <Loader size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">Tidak ada user yang ditemukan</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages >= 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Baris per halaman:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="border border-gray-300 rounded-lg text-sm p-1"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <p className="text-sm text-gray-600">
              Halaman {page} dari {totalPages} ({total} total user)
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="px-3 py-1 text-sm font-medium">{page}</span>
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



      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Tambah User Baru</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={createForm.role}
                  onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as any })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red/50"
                >
                  <option value="ADMIN_PENYELENGGARA">Admin Penyelenggara (Master Kompetisi)</option>
                  <option value="ADMIN_KOMPETISI">Admin Kompetisi (Kompetisi Tunggal)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input
                  type="text"
                  value={createForm.nama}
                  onChange={(e) => setCreateForm({ ...createForm, nama: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red/50"
                  placeholder="Nama lengkap"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red/50"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red/50"
                  placeholder="Minimal 6 karakter"
                />
              </div>

              {createForm.role === 'ADMIN_PENYELENGGARA' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Penyelenggara</label>
                  <select
                    value={createForm.id_penyelenggara}
                    onChange={(e) => setCreateForm({ ...createForm, id_penyelenggara: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red/50"
                  >
                    <option value="">Pilih Penyelenggara</option>
                    {penyelenggaraList.map(p => (
                      <option key={p.id_penyelenggara} value={p.id_penyelenggara}>
                        {p.nama_penyelenggara}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {createForm.role === 'ADMIN_KOMPETISI' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kompetisi</label>
                  <select
                    value={createForm.id_kompetisi}
                    onChange={(e) => setCreateForm({ ...createForm, id_kompetisi: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red/50"
                  >
                    <option value="">Pilih Kompetisi</option>
                    {kompetisiList.map(k => (
                      <option key={k.id_kompetisi} value={k.id_kompetisi}>
                        {k.nama_event} {k.penyelenggara ? `(${k.penyelenggara.nama_penyelenggara})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 py-3 bg-red text-white rounded-lg hover:bg-red/90 transition-colors font-medium disabled:opacity-50"
                >
                  {createLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\SuperAdmin;
use App\Models\AdminPenyelenggara;
use App\Models\AdminKompetisi;
use App\Models\Pelatih;
use App\Models\Penyelenggara;
use App\Models\Kompetisi;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Get all users (Super Admin only)
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        // Only Super Admin can access
        if ($user->role !== 'SUPER_ADMIN') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $limit = $request->query('limit', 50);
        $search = $request->query('search');
        $role = $request->query('role');

        $query = User::query();

        // Load relations based on role
        $query->with(['super_admin', 'admin_penyelenggara.penyelenggara', 'admin_kompetisi.kompetisi', 'pelatih.dojang']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('email', 'like', "%{$search}%")
                    ->orWhereHas('super_admin', function ($q2) use ($search) {
                        $q2->where('nama', 'like', "%{$search}%");
                    })
                    ->orWhereHas('admin_penyelenggara', function ($q2) use ($search) {
                        $q2->where('nama', 'like', "%{$search}%");
                    })
                    ->orWhereHas('admin_kompetisi', function ($q2) use ($search) {
                        $q2->where('nama', 'like', "%{$search}%");
                    })
                    ->orWhereHas('pelatih', function ($q2) use ($search) {
                        $q2->where('nama_pelatih', 'like', "%{$search}%");
                    });
            });
        }

        if ($role && $role !== 'ALL') {
            $query->where('role', $role);
        }

        $users = $query->orderBy('id_akun', 'desc')->paginate($limit);

        // Transform for frontend
        $transformed = $users->getCollection()->map(function ($u) {
            $name = $u->email;
            
            if ($u->super_admin) {
                $name = $u->super_admin->nama;
            } elseif ($u->admin_penyelenggara) {
                $name = $u->admin_penyelenggara->nama;
            } elseif ($u->admin_kompetisi) {
                $name = $u->admin_kompetisi->nama;
            } elseif ($u->pelatih) {
                $name = $u->pelatih->nama_pelatih;
            }

            return [
                'id_akun' => $u->id_akun,
                'email' => $u->email,
                'role' => $u->role,
                'nama' => $name,
                'penyelenggara' => ($u->admin_penyelenggara && $u->admin_penyelenggara->penyelenggara) ? $u->admin_penyelenggara->penyelenggara : null,
                'kompetisi' => ($u->admin_kompetisi && $u->admin_kompetisi->kompetisi) ? $u->admin_kompetisi->kompetisi : null,
                'dojang' => ($u->pelatih && $u->pelatih->dojang) ? $u->pelatih->dojang : null,
            ];
        });

        // Calculate stats (overall totals regardless of filter)
        $stats = [
            'total_users' => User::count(),
            'super_admin' => User::where('role', 'SUPER_ADMIN')->count(),
            'admin_penyelenggara' => User::where('role', 'ADMIN_PENYELENGGARA')->count(),
            'admin_kompetisi' => User::where('role', 'ADMIN_KOMPETISI')->count(),
            'pelatih' => User::where('role', 'PELATIH')->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $transformed,
            'total' => $users->total(),
            'page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
            'per_page' => $users->perPage(),
            'stats' => $stats
        ]);
    }

    /**
     * Create new admin user (Super Admin only)
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        if ($user->role !== 'SUPER_ADMIN') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:tb_akun,email',
            'password' => 'required|string|min:6',
            'nama' => 'required|string|max:150',
            'role' => 'required|in:ADMIN_PENYELENGGARA,ADMIN_KOMPETISI',
            'id_penyelenggara' => 'required_if:role,ADMIN_PENYELENGGARA|exists:tb_penyelenggara,id_penyelenggara',
            'id_kompetisi' => 'required_if:role,ADMIN_KOMPETISI|exists:tb_kompetisi,id_kompetisi',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        try {
            DB::beginTransaction();

            // Create user account
            $newUser = User::create([
                'email' => $request->email,
                'password_hash' => Hash::make($request->password),
                'role' => $request->role,
            ]);

            // Create role-specific record
            if ($request->role === 'ADMIN_PENYELENGGARA') {
                AdminPenyelenggara::create([
                    'id_akun' => $newUser->id_akun,
                    'nama' => $request->nama,
                    'id_penyelenggara' => $request->id_penyelenggara,
                ]);
            } elseif ($request->role === 'ADMIN_KOMPETISI') {
                AdminKompetisi::create([
                    'id_akun' => $newUser->id_akun,
                    'nama' => $request->nama,
                    'id_kompetisi' => $request->id_kompetisi,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'User berhasil dibuat',
                'data' => [
                    'id_akun' => $newUser->id_akun,
                    'email' => $newUser->email,
                    'role' => $newUser->role,
                    'nama' => $request->nama,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Delete user (Super Admin only)
     */
    public function destroy($id)
    {
        $user = auth()->user();

        if ($user->role !== 'SUPER_ADMIN') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Prevent deleting self
        if ($user->id_akun == $id) {
            return response()->json(['message' => 'Tidak dapat menghapus akun sendiri'], 400);
        }

        $targetUser = User::find($id);
        if (!$targetUser) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        try {
            DB::beginTransaction();

            // Delete role-specific records first (foreign key constraints)
            SuperAdmin::where('id_akun', $id)->delete();
            AdminPenyelenggara::where('id_akun', $id)->delete();
            AdminKompetisi::where('id_akun', $id)->delete();
            Pelatih::where('id_akun', $id)->delete();

            // Delete user
            $targetUser->delete();

            DB::commit();

            return response()->json(['success' => true, 'message' => 'User berhasil dihapus']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Get penyelenggara list for dropdown
     */
    public function getPenyelenggaraList()
    {
        $user = auth()->user();

        if ($user->role !== 'SUPER_ADMIN') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $penyelenggara = Penyelenggara::select('id_penyelenggara', 'nama_penyelenggara', 'email')
            ->orderBy('nama_penyelenggara')
            ->get();

        return response()->json(['success' => true, 'data' => $penyelenggara]);
    }

    /**
     * Get kompetisi list for dropdown
     */
    public function getKompetisiList()
    {
        $user = auth()->user();

        if ($user->role !== 'SUPER_ADMIN') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $kompetisi = Kompetisi::select('id_kompetisi', 'nama_event', 'status', 'id_penyelenggara')
            ->with('penyelenggara:id_penyelenggara,nama_penyelenggara')
            ->orderBy('tanggal_mulai', 'desc')
            ->get();

        return response()->json(['success' => true, 'data' => $kompetisi]);
    }
}

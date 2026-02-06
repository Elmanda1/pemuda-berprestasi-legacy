<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Penyelenggara;
use Illuminate\Support\Facades\Validator;

class PenyelenggaraController extends Controller
{
    /**
     * Get all penyelenggara (Super Admin only)
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        if ($user->role !== 'SUPER_ADMIN') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $limit = $request->query('limit', 15);
        $page = $request->query('page', 1);
        $search = $request->query('search');

        $query = Penyelenggara::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama_penyelenggara', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $penyelenggara = $query->orderBy('id_penyelenggara', 'desc')->paginate($limit);

        return response()->json([
            'success' => true,
            'data' => $penyelenggara->items(),
            'total' => $penyelenggara->total(),
            'page' => $penyelenggara->currentPage(),
            'last_page' => $penyelenggara->lastPage(),
            'per_page' => $penyelenggara->perPage()
        ]);
    }

    /**
     * Create new penyelenggara (Super Admin only)
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        if ($user->role !== 'SUPER_ADMIN') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'nama_penyelenggara' => 'required|string|max:255',
            'email' => 'required|email|unique:tb_penyelenggara,email',
            'no_telp' => 'nullable|string|max:20',
            'alamat' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        try {
            $penyelenggara = Penyelenggara::create([
                'nama_penyelenggara' => $request->nama_penyelenggara,
                'email' => $request->email,
                'no_telp' => $request->no_telp,
                'alamat' => $request->alamat,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Penyelenggara berhasil dibuat',
                'data' => $penyelenggara
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Update penyelenggara (Super Admin only)
     */
    public function update(Request $request, $id)
    {
        $user = auth()->user();

        if ($user->role !== 'SUPER_ADMIN') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $penyelenggara = Penyelenggara::find($id);
        if (!$penyelenggara) {
            return response()->json(['message' => 'Penyelenggara tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_penyelenggara' => 'required|string|max:255',
            'email' => 'required|email|unique:tb_penyelenggara,email,' . $id . ',id_penyelenggara',
            'no_telp' => 'nullable|string|max:20',
            'alamat' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        try {
            $penyelenggara->update([
                'nama_penyelenggara' => $request->nama_penyelenggara,
                'email' => $request->email,
                'no_telp' => $request->no_telp,
                'alamat' => $request->alamat,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Penyelenggara berhasil diupdate',
                'data' => $penyelenggara
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * Delete penyelenggara (Super Admin only)
     */
    public function destroy($id)
    {
        $user = auth()->user();

        if ($user->role !== 'SUPER_ADMIN') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $penyelenggara = Penyelenggara::find($id);
        if (!$penyelenggara) {
            return response()->json(['message' => 'Penyelenggara tidak ditemukan'], 404);
        }

        try {
            $penyelenggara->delete();
            return response()->json(['success' => true, 'message' => 'Penyelenggara berhasil dihapus']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal menghapus: ' . $e->getMessage()], 400);
        }
    }
}

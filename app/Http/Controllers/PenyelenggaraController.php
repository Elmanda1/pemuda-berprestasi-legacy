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
                'landing_title' => $request->landing_title,
                'landing_subtitle' => $request->landing_subtitle,
                'landing_about_title' => $request->landing_about_title,
                'landing_about_content' => $request->landing_about_content,
                'landing_features_title' => $request->landing_features_title,
                'landing_feature_1_title' => $request->landing_feature_1_title,
                'landing_feature_1_desc' => $request->landing_feature_1_desc,
                'landing_feature_2_title' => $request->landing_feature_2_title,
                'landing_feature_2_desc' => $request->landing_feature_2_desc,
                'landing_feature_3_title' => $request->landing_feature_3_title,
                'landing_feature_3_desc' => $request->landing_feature_3_desc,
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
            'landing_title' => 'nullable|string|max:255',
            'landing_subtitle' => 'nullable|string',
            'landing_about_title' => 'nullable|string|max:255',
            'landing_about_content' => 'nullable|string',
            'landing_features_title' => 'nullable|string|max:255',
            'landing_feature_1_title' => 'nullable|string|max:255',
            'landing_feature_1_desc' => 'nullable|string',
            'landing_feature_2_title' => 'nullable|string|max:255',
            'landing_feature_2_desc' => 'nullable|string',
            'landing_feature_3_title' => 'nullable|string|max:255',
            'landing_feature_3_desc' => 'nullable|string',
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
                'landing_title' => $request->landing_title,
                'landing_subtitle' => $request->landing_subtitle,
                'landing_about_title' => $request->landing_about_title,
                'landing_about_content' => $request->landing_about_content,
                'landing_features_title' => $request->landing_features_title,
                'landing_feature_1_title' => $request->landing_feature_1_title,
                'landing_feature_1_desc' => $request->landing_feature_1_desc,
                'landing_feature_2_title' => $request->landing_feature_2_title,
                'landing_feature_2_desc' => $request->landing_feature_2_desc,
                'landing_feature_3_title' => $request->landing_feature_3_title,
                'landing_feature_3_desc' => $request->landing_feature_3_desc,
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
     * Get landing settings for public view
     */
    public function getLandingSettings(Request $request)
    {
        // Try to get by ID if provided, otherwise get the first one
        $id = $request->query('id_penyelenggara');
        $penyelenggara = $id ? Penyelenggara::find($id) : Penyelenggara::first();
        
        return response()->json([
            'success' => true,
            'data' => [
                'title' => $penyelenggara ? $penyelenggara->landing_title : null,
                'subtitle' => $penyelenggara ? $penyelenggara->landing_subtitle : null,
                'about_title' => $penyelenggara ? $penyelenggara->landing_about_title : null,
                'about_content' => $penyelenggara ? $penyelenggara->landing_about_content : null,
                'features_title' => $penyelenggara ? $penyelenggara->landing_features_title : null,
                'feature_1_title' => $penyelenggara ? $penyelenggara->landing_feature_1_title : null,
                'feature_1_desc' => $penyelenggara ? $penyelenggara->landing_feature_1_desc : null,
                'feature_2_title' => $penyelenggara ? $penyelenggara->landing_feature_2_title : null,
                'feature_2_desc' => $penyelenggara ? $penyelenggara->landing_feature_2_desc : null,
                'feature_3_title' => $penyelenggara ? $penyelenggara->landing_feature_3_title : null,
                'feature_3_desc' => $penyelenggara ? $penyelenggara->landing_feature_3_desc : null,
                'id_penyelenggara' => $penyelenggara ? $penyelenggara->id_penyelenggara : null,
            ]
        ]);
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

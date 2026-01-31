<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pelatih;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PelatihController extends Controller
{
    /**
     * Get current logged in pelatih profile.
     */
    public function getMyProfile(Request $request)
    {
        $user = $request->user();
        $pelatih = $user->pelatih;

        if (!$pelatih) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        return response()->json(['data' => $pelatih]);
    }

    /**
     * Update current logged in pelatih profile.
     */
    public function updateMyProfile(Request $request)
    {
        $user = $request->user();
        $pelatih = $user->pelatih;

        if (!$pelatih) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_pelatih' => 'required|string|max:150',
            'no_telp' => 'nullable|string|max:15',
            'jenis_kelamin' => 'nullable|in:LAKI_LAKI,PEREMPUAN',
            'kota' => 'nullable|string|max:100',
            'provinsi' => 'nullable|string|max:100',
            'alamat' => 'nullable|string|max:100',
            'birth_date' => 'nullable|date', // Legacy might send this
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $pelatih->update($request->except(['foto_ktp', 'sertifikat_sabuk', 'id_akun', 'id_dojang', 'nik']));
        // Prevent updating critical fields directly here, or strictly define fillable.

        return response()->json(['message' => 'Profile updated', 'data' => $pelatih]);
    }

    /**
     * Upload files (ktp, sertifikat).
     */
    public function uploadFiles(Request $request)
    {
        $user = $request->user();
        $pelatih = $user->pelatih;

        if (!$pelatih) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'type' => 'required|in:foto_ktp,sertifikat_sabuk',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file = $request->file('file');
        $type = $request->type;

        // Store file
        $path = $file->store("pelatih/{$pelatih->id_pelatih}/{$type}", 'public');

        // Update database
        $pelatih->update([
            $type => $path
        ]);

        return response()->json(['message' => 'File uploaded', 'path' => $path]);
    }

    /**
     * Admin: Get All Pelatih
     */
    public function getAllPelatih()
    {
        // Add specific admin check logic here if needed, or rely on route middleware
        return response()->json(['data' => Pelatih::all()]);
    }

    /**
     * Admin: Get Pelatih By ID
     */
    public function getPelatihById($id)
    {
        $pelatih = Pelatih::find($id);
        if (!$pelatih) {
            return response()->json(['message' => 'Pelatih not found'], 404);
        }
        return response()->json(['data' => $pelatih]);
    }
}

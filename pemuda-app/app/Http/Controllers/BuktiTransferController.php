<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BuktiTransfer;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class BuktiTransferController extends Controller
{
    // Upload Bukti Transfer
    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_dojang' => 'required|exists:tb_dojang,id_dojang',
            'id_pelatih' => 'nullable|exists:tb_pelatih,id_pelatih', // Optional if inferred, but good to validate
            'file' => 'required|file|mimes:jpeg,png,jpg,pdf|max:2048' // 2MB Max
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        $pelatihId = $request->id_pelatih ?? auth()->user()->id_pelatih; // Assuming auth context
        if (!$pelatihId) {
            return response()->json(['message' => 'Pelatih ID required'], 400);
        }

        try {
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $filename = time() . '_' . $file->getClientOriginalName();
                // Legacy path: uploads/pelatih/BuktiTf
                // We'll use public_path or storage path. Let's use public_path for simplicity to match legacy "static serving" usually.

                $destinationPath = public_path('uploads/pelatih/BuktiTf');
                if (!File::exists($destinationPath)) {
                    File::makeDirectory($destinationPath, 0755, true);
                }

                $file->move($destinationPath, $filename);

                $bukti = BuktiTransfer::create([
                    'id_dojang' => $request->id_dojang,
                    'id_pelatih' => $pelatihId,
                    'bukti_transfer_path' => $filename
                ]);

                return response()->json(['success' => true, 'data' => $bukti, 'message' => 'Upload successful'], 201);
            }
            return response()->json(['message' => 'File not found'], 400);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    // Get All
    public function getAll(Request $request)
    {
        $data = BuktiTransfer::with(['dojang', 'pelatih'])->orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $data]);
    }

    // Get By Dojang
    public function getByDojang($idDojang)
    {
        $data = BuktiTransfer::where('id_dojang', $idDojang)
            ->with(['dojang', 'pelatih'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json(['success' => true, 'data' => $data]);
    }

    // Get By Pelatih
    public function getByPelatih($idPelatih)
    {
        $data = BuktiTransfer::where('id_pelatih', $idPelatih)
            ->with(['dojang', 'pelatih'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json(['success' => true, 'data' => $data]);
    }

    // Delete
    public function delete($id)
    {
        $bukti = BuktiTransfer::find($id);
        if (!$bukti) {
            return response()->json(['message' => 'Not found'], 404);
        }

        try {
            // Delete file
            $filePath = public_path('uploads/pelatih/BuktiTf/' . $bukti->bukti_transfer_path);
            if (File::exists($filePath)) {
                File::delete($filePath);
            }

            $bukti->delete();
            return response()->json(['success' => true, 'message' => 'Deleted']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }
}

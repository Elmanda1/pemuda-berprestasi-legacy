<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lapangan;
use App\Models\JadwalPertandingan; // tb_jadwal_pertandingan ?
// Note: Lapangan logic often uses tb_lapangan, tb_lapangan_kelas, tb_jadwal_pertandingan
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class LapanganController extends Controller
{
    // Tambah Hari Lapangan (Jadwal Pertandingan)
    // Legacy: tambahHariLapangan -> creates tb_jadwal_pertandingan entry?
    // Looking at service logic would be better, but assuming tb_jadwal_pertandingan

    public function getAllHari(Request $request)
    {
        // Fetch distinct dates (hari) from tb_lapangan
        $data = Lapangan::select('tanggal')->distinct()->get();

        // Map to format frontend expects (usually just strings or simple objects)
        $formatted = $data->map(function ($item) {
            return [
                'tanggal' => $item->tanggal,
                'hari' => date('Y-m-d', strtotime($item->tanggal))
            ];
        });

        return response()->json(['success' => true, 'data' => $formatted]);
    }

    public function tambahHariLapangan(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_kompetisi' => 'required',
            'tanggal' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 400);
        }

        try {
            // Check if already exists for this competition
            $exists = Lapangan::where('id_kompetisi', $request->id_kompetisi)
                ->where('tanggal', $request->tanggal)
                ->exists();

            if ($exists) {
                return response()->json(['success' => false, 'message' => 'Hari sudah terdaftar'], 400);
            }

            // Create a default lapangan for this day
            $lapangan = Lapangan::create([
                'id_kompetisi' => $request->id_kompetisi,
                'nama_lapangan' => 'Lapangan 1', // Default
                'tanggal' => $request->tanggal
            ]);

            return response()->json(['success' => true, 'data' => $lapangan]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    // Get Lapangan by Kompetisi (Grouped by Date)
    public function getByKompetisi($id_kompetisi)
    {
        $lapangans = Lapangan::where('id_kompetisi', $id_kompetisi)
            ->orderBy('tanggal', 'asc')
            ->orderBy('nama_lapangan', 'asc')
            ->get();

        // Group by tanggal
        $grouped = $lapangans->groupBy('tanggal');

        $result = [];
        foreach ($grouped as $tanggal => $items) {
            $result[] = [
                'tanggal' => $tanggal,
                'jumlah_lapangan' => $items->count(),
                'lapangan' => $items->map(function ($lap) {
                    return [
                        'id_lapangan' => $lap->id_lapangan,
                        'id_kompetisi' => $lap->id_kompetisi,
                        'nama_lapangan' => $lap->nama_lapangan,
                        'tanggal' => $lap->tanggal,
                        'kelas_list' => [], // Placeholder for relationship
                        'antrian' => null
                    ];
                })
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'hari_pertandingan' => $result
            ]
        ]);
    }

    // CRUD Lapangan
    public function getAll(Request $request)
    {
        $data = Lapangan::all();
        return response()->json(['success' => true, 'data' => $data]);
    }

    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_kompetisi' => 'required',
            'nama_lapangan' => 'required',
            // ... other fields
        ]);

        // As legacy controller uses complex service logic (tambahLapanganKeHari),
        // we'll leave this as simple create for now or Todo.
        return response()->json(['message' => 'Complex logic not fully ported'], 501);
    }

    public function delete($id)
    {
        $lapangan = Lapangan::find($id);
        if ($lapangan) {
            $lapangan->delete();
            return response()->json(['success' => true]);
        }
        return response()->json(['message' => 'Not found'], 404);
    }

    // Auto Generate Numbers (Complex)
    public function autoGenerateMatchNumbers(Request $request, $idLapangan)
    {
        // This requires porting LapanganService.autoGenerateMatchNumbers
        // which iterates matches and assigns numbers.
        return response()->json(['message' => 'Auto-generate numbers not implemented'], 501);
    }

    public function getNumberingStatus(Request $request, $idLapangan)
    {
        return response()->json(['message' => 'Numbering status not implemented'], 501);
    }
}

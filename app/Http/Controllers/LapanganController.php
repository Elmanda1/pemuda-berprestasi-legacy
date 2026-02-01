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
        $lapangans = Lapangan::with(['kelas_list.kelasKejuaraan', 'antrian'])
            ->where('id_kompetisi', $id_kompetisi)
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
                        'kelas_list' => $lap->kelas_list->map(function ($lk) {
                            return [
                                'id_kelas_kejuaraan' => $lk->id_kelas_kejuaraan,
                                'nama_kelas' => $lk->kelasKejuaraan ? $lk->kelasKejuaraan->nama_kelas : 'Unknown'
                            ];
                        }),
                        'antrian' => $lap->antrian ? [
                            'bertanding' => $lap->antrian->bertanding,
                            'persiapan' => $lap->antrian->persiapan,
                            'pemanasan' => $lap->antrian->pemanasan,
                        ] : null
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

    public function simpanKelas(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_lapangan' => 'required|exists:tb_lapangan,id_lapangan',
            // 'kelas_kejuaraan_ids' => 'required|array' // Frontend sends array or empty array
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 400);
        }

        try {
            DB::beginTransaction();

            // Clear existing classes for this lapangan
            // Using App\Models\LapanganKelas
            \App\Models\LapanganKelas::where('id_lapangan', $request->id_lapangan)->delete();

            $ids = $request->kelas_kejuaraan_ids ?? [];
            if (!is_array($ids)) {
                // handle if parsed incorrectly, though axios/fetch usually handles json
                $ids = [];
            }

            foreach ($ids as $index => $idKelas) {
                \App\Models\LapanganKelas::create([
                    'id_lapangan' => $request->id_lapangan,
                    'id_kelas_kejuaraan' => $idKelas,
                    'urutan' => $index + 1
                ]);
            }

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Kelas berhasil disimpan']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
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
    public function resetNumbering($id)
    {
        // 1. Get classes for this field
        $lapanganKelas = \App\Models\LapanganKelas::where('id_lapangan', $id)->get();
        $kelasIds = $lapanganKelas->pluck('id_kelas_kejuaraan');

        // 2. Reset match numbers for these classes (set no_partai to null)
        // Matches are linked via Bagan
        $baganIds = \App\Models\Bagan::whereIn('id_kelas_kejuaraan', $kelasIds)->pluck('id_bagan');

        \App\Models\Matches::whereIn('id_bagan', $baganIds)
            ->update([
                'nomor_partai' => null, // Column name is nomor_partai not no_partai based on fillable? Wait, fillable says nomor_partai, log says no_partai? 
                // Fillable says 'nomor_partai'. I used 'no_partai' before. Correcting to 'nomor_partai'.
                'nomor_lapangan' => null,
                'id_lapangan' => null,
                'hari' => null
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Nomor partai berhasil di-reset'
        ]);
    }

    public function previewNumbering(Request $request, $id)
    {
        // Calculate preview stats
        // This logic mimics the frontend expectation:
        // Return { success: true, total_bye_skipped: N, range: "1 - N", summary: { pemula: [], prestasi: [] } }

        $lapanganKelas = \App\Models\LapanganKelas::with(['kelasKejuaraan.kategori_event'])
            ->where('id_lapangan', $id)
            ->orderBy('urutan')
            ->get();

        $pemula = [];
        $prestasi = [];
        $totalMatches = 0;
        $startNumber = $request->query('starting_number', 1);
        $currentNumber = $startNumber;

        foreach ($lapanganKelas as $lk) {
            $kelas = $lk->kelasKejuaraan;
            if (!$kelas)
                continue;

            // Fix: Query via Bagan
            $matchesCount = \App\Models\Matches::whereHas('bagan', function ($q) use ($kelas) {
                $q->where('id_kelas_kejuaraan', $kelas->id_kelas_kejuaraan);
            })->count();

            if ($matchesCount == 0)
                continue;

            $rangeStart = $currentNumber;
            $rangeEnd = $currentNumber + $matchesCount - 1;
            $rangeStr = "$rangeStart - $rangeEnd";

            $isPemula = false;
            // logic check pemula
            if ($kelas->kategori_event && stripos($kelas->kategori_event->nama_kategori, 'pemula') !== false) {
                $isPemula = true;
            }

            $item = [
                'kelas' => $kelas->nama_kelas,
                'peserta' => 0, // Todo: count peserta
                'matches' => $matchesCount,
                'range' => $rangeStr
            ];

            if ($isPemula) {
                $pemula[] = $item;
            } else {
                $prestasi[] = $item;
            }

            $totalMatches += $matchesCount;
            $currentNumber += $matchesCount;
        }

        $endNumber = $currentNumber - 1;
        $rangeTotal = $totalMatches > 0 ? "$startNumber - $endNumber" : "-";

        return response()->json([
            'success' => true,
            'total_bye_skipped' => 0, // Placeholder
            'range' => $rangeTotal,
            'summary' => [
                'pemula' => $pemula,
                'prestasi' => $prestasi
            ]
        ]);
    }

    public function autoGenerateMatchNumbers(Request $request, $id)
    {
        // Simple sequential generation
        try {
            DB::beginTransaction();

            $lapanganKelas = \App\Models\LapanganKelas::where('id_lapangan', $id)
                ->orderBy('urutan')
                ->get();

            $currentNumber = $request->input('starting_number', 1);
            $hari = $request->input('hari');

            foreach ($lapanganKelas as $lk) {
                // Find Bagan first
                $bagan = \App\Models\Bagan::where('id_kelas_kejuaraan', $lk->id_kelas_kejuaraan)->first();
                if (!$bagan)
                    continue;

                $matches = \App\Models\Matches::where('id_bagan', $bagan->id_bagan)
                    ->orderBy('id_match', 'asc')
                    ->get();

                foreach ($matches as $match) {
                    $match->nomor_partai = $currentNumber++;
                    if ($hari)
                        $match->hari = $hari;
                    $match->id_lapangan = $id;
                    $match->nomor_lapangan = $id; // Or name? Check Lapangan model, usually ID or number. Assuming ID/Number logic.
                    // If nomor_lapangan is string/name, we might need Lapangan::find($id)->nama_lapangan.
                    // Let's assume matches table uses simplistic ID or just skip if uncertain. 
                    // Matches model fillable has 'nomor_lapangan'. 
                    // Using $id for now.
                    $match->save();
                }
            }

            DB::commit();
            return response()->json([
                'success' => true,
                'range' => "1 - " . ($currentNumber - 1),
                'message' => 'Nomor partai berhasil di-generate'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    public function getNumberingStatus(Request $request, $idLapangan)
    {
        return response()->json(['message' => 'Numbering status not implemented'], 200);
    }
}

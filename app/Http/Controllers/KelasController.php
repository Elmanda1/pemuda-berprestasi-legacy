<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\KelompokUsia;
use App\Models\KelasBerat;
use App\Models\KelasPoomsae;
use App\Models\KelasKejuaraan;
use Illuminate\Support\Facades\DB;

class KelasController extends Controller
{
    // Get Kelompok Usia
    public function getKelompokUsia(Request $request)
    {
        $data = KelompokUsia::all();
        return response()->json($data);
    }

    // Get Kelas Berat
    public function getKelasBerat(Request $request)
    {
        $kelompokId = $request->query('kelompokId');
        $gender = $request->query('jenis_kelamin');

        if (!$kelompokId || !$gender) {
            return response()->json(['message' => 'Missing parameters'], 400);
        }

        $data = KelasBerat::where('id_kelompok_usia', $kelompokId)
            ->where('jenis_kelamin', $gender)
            ->get();

        return response()->json($data);
    }

    // Get Kelas Poomsae
    public function getKelasPoomsae(Request $request)
    {
        $kelompokId = $request->query('kelompokId');
        $gender = $request->query('jenis_kelamin');

        if (!$kelompokId || !$gender) {
            return response()->json(['message' => 'Missing parameters'], 400);
        }

        // Note: Poomsae gender might be optional in some logic, but legacy controller enforced it?
        // Legacy: if (!gender) return 400.

        $data = KelasPoomsae::where('id_kelompok_usia', $kelompokId)
            ->where('jenis_kelamin', $gender)
            ->get();

        return response()->json($data);
    }

    // Get Kelas Kejuaraan (Complex Filter)
    public function getKelasKejuaraan(Request $request, $kompetisiId)
    {
        $styleType = $request->input('styleType'); // KYORUGI/POOMSAE
        $categoryType = $request->input('categoryType'); // PEMULA/PRESTASI
        $gender = $request->input('gender');
        $kelompokId = $request->input('kelompokId');
        $kelasBeratId = $request->input('kelasBeratId');
        $poomsaeId = $request->input('poomsaeId');

        $query = KelasKejuaraan::where('id_kompetisi', $kompetisiId)
            ->with(['kategori_event', 'kelompok_usia', 'kelas_berat', 'kelas_poomsae']);

        // Filter by Style (Cabang)
        if ($styleType) {
            $query->where('cabang', $styleType);
        }

        // Filter by Category Type (via Relation or direct?)
        // relation kategori_event -> nama_kategori contains 'PEMULA' or 'PRESTASI'
        if ($categoryType) {
            $query->whereHas('kategori_event', function ($q) use ($categoryType) {
                // Fuzzy match? Legacy logic uses specific logic?
                // Legacy payload sends categoryType as ID or Name? 
                // Legacy: categoryType is required.
                // Assuming categoryType corresponds to id_kategori_event or approximate name check
                // If ID passed:
                //$q->where('id_kategori_event', $categoryType);
                // If name:
                $q->where('nama_kategori', 'like', "%$categoryType%");
            });
        }

        if ($gender) {
            $query->where('jenis_kelamin', $gender);
        }

        if ($kelompokId) {
            $query->where('id_kelompok_usia', $kelompokId);
        }

        if ($kelasBeratId) {
            $query->where('id_kelas_berat', $kelasBeratId);
        }

        if ($poomsaeId) {
            $query->where('id_kelas_poomsae', $poomsaeId);
        }

        $data = $query->get();
        if ($data->isEmpty()) {
            return response()->json(['message' => 'No filter matched'], 404);
        }

        return response()->json($data);
    }

    // Get By Kompetisi (Simple List)
    public function getKelasKejuaraanByKompetisi(Request $request, $id)
    {
        $data = KelasKejuaraan::where('id_kompetisi', $id)
            ->with(['kategori_event', 'kelompok_usia', 'kelas_berat', 'kelas_poomsae'])
            ->get();

        if ($data->isEmpty()) {
            return response()->json(['message' => 'No classes found'], 404);
        }

        return response()->json($data);
    }
}

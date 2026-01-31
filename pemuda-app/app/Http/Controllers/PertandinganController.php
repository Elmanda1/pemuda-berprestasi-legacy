<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Matches; // Model name is Matches, not Match
use Illuminate\Support\Facades\DB;

class PertandinganController extends Controller
{
    /**
     * Get Match Info for specific competition
     */
    public function getPertandinganInfo(Request $request, $idKompetisi)
    {
        $hari = $request->query('hari');

        // Query Matches where bagan -> id_kompetisi matches

        $query = Matches::query();

        // Filter by Competition ID via Bagan relation
        $query->whereHas('bagan', function ($q) use ($idKompetisi) {
            $q->where('id_kompetisi', $idKompetisi);
        });

        // Filter: Participants not null
        $query->whereNotNull('id_peserta_a');
        $query->whereNotNull('id_peserta_b');

        // Filter: Stage name not null
        $query->whereNotNull('stage_name');

        // Filter: Hari if provided
        if ($hari) {
            $query->where('hari', $hari);
        }

        // Filter: Approved participants only
        $query->whereHas('peserta_a', function ($q) {
            $q->where('status', 'APPROVED');
        });
        $query->whereHas('peserta_b', function ($q) {
            $q->where('status', 'APPROVED');
        });

        // Load relations
        $query->with([
            'peserta_a.atlet.dojang',
            'peserta_b.atlet.dojang'
        ]);

        $matches = $query->get();

        // Map to response format
        $data = $matches->map(function ($match) {
            // Helper to get name from Peserta
            // Peserta -> Atlet OR Team?
            // Legacy Service specifically selects: peserta_a.atlet.nama_atlet (Assumes individual mostly? or relations handle team?)
            // Legacy code: match.peserta_a?.atlet?.nama_atlet

            return [
                'nomor_antrian' => $match->nomor_antrian,
                'nomor_lapangan' => $match->nomor_lapangan,
                'stage_name' => $match->stage_name,
                'nama_atlet_a' => $match->peserta_a->atlet->nama_atlet ?? ($match->peserta_a->is_team ? 'Team A' : null),
                'nama_dojang_a' => $match->peserta_a->atlet->dojang->nama_dojang ?? null,
                'nama_atlet_b' => $match->peserta_b->atlet->nama_atlet ?? ($match->peserta_b->is_team ? 'Team B' : null),
                'nama_dojang_b' => $match->peserta_b->atlet->dojang->nama_dojang ?? null,
                'foto_atlet_a' => $match->peserta_a->atlet->pas_foto ?? null,
                'foto_atlet_b' => $match->peserta_b->atlet->pas_foto ?? null,
            ];
        });

        return response()->json(['success' => true, 'data' => $data]);
    }
}

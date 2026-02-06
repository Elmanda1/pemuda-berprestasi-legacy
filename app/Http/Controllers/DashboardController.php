<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Atlet;
use App\Models\Dojang;
use App\Models\Kompetisi;
use App\Models\PesertaKompetisi;
use App\Traits\HasScopedAccess;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    use HasScopedAccess;

    public function getAdminStats()
    {
        $orgId = $this->getOrganizerId();

        // Base queries
        $userQuery = User::query();
        $atletQuery = Atlet::query();
        $dojangQuery = Dojang::query();
        $kompetisiQuery = Kompetisi::query();
        $pesertaQuery = PesertaKompetisi::query();

        // Apply Scoping
        if ($orgId) {
            // Scoped to Organizer
            $dojangQuery->where('id_penyelenggara', $orgId);
            $atletQuery->whereIn('id_dojang', function($q) use ($orgId) {
                $q->select('id_dojang')->from('tb_dojang')->where('id_penyelenggara', $orgId);
            });
            $kompetisiQuery->where('id_penyelenggara', $orgId);
            $pesertaQuery->whereHas('kelas_kejuaraan', function($q) use ($orgId) {
                $q->where('id_kompetisi', function($q2) use ($orgId) {
                    $q2->select('id_kompetisi')->from('tb_kompetisi')->where('id_penyelenggara', $orgId);
                });
            });
            // Users related to this organizer
            $userQuery->where(function($q) use ($orgId) {
                $q->whereHas('admin_penyelenggara', function($q2) use ($orgId) {
                    $q2->where('id_penyelenggara', $orgId);
                })->orWhereHas('admin_kompetisi', function($q2) use ($orgId) {
                    $q2->whereHas('kompetisi', function($q3) use ($orgId) {
                        $q3->where('id_penyelenggara', $orgId);
                    });
                });
            });
        }

        $pesertaQueryPending = clone $pesertaQuery;
        $stats = [
            'totalUsers' => $userQuery->count(),
            'totalAtlets' => $atletQuery->count(),
            'totalDojangs' => $dojangQuery->count(),
            'totalKompetisi' => $kompetisiQuery->count(),
            'pendingValidations' => $pesertaQueryPending->where('status', 'PENDING')->count(),
            'recentActivity' => [], // Placeholder for now
            'userGrowth' => [], // Placeholder
            'atletByCategory' => $this->getAtletByCategory($atletQuery),
            'detailPenyelenggara' => $this->getDetailPenyelenggara($orgId),
        ];

        return response()->json($stats);
    }

    private function getDetailPenyelenggara($orgId)
    {
        if ($orgId) return []; // Only for Super Admin

        $penyelenggara = \App\Models\Penyelenggara::all();
        $details = $penyelenggara->map(function($p) {
            return [
                'id' => $p->id_penyelenggara,
                'nama' => $p->nama_penyelenggara,
                'totalKompetisi' => \App\Models\Kompetisi::where('id_penyelenggara', $p->id_penyelenggara)->count(),
                'totalDojang' => \App\Models\Dojang::where('id_penyelenggara', $p->id_penyelenggara)->count(),
                'totalAtlet' => \App\Models\Atlet::whereIn('id_dojang', function($q) use ($p) {
                    $q->select('id_dojang')->from('tb_dojang')->where('id_penyelenggara', $p->id_penyelenggara);
                })->count(),
            ];
        });

        return $details;
    }

    private function getAtletByCategory($query)
    {
        // Category based on gender for now as placeholder
        $lakiQuery = clone $query;
        $peremQuery = clone $query;
        $laki = $lakiQuery->where('jenis_kelamin', 'LAKI_LAKI')->count();
        $perempuan = $peremQuery->where('jenis_kelamin', 'PEREMPUAN')->count();

        return [
            ['category' => 'Laki-laki', 'count' => $laki],
            ['category' => 'Perempuan', 'count' => $perempuan],
        ];
    }
}

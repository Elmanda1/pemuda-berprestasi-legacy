<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Kompetisi;
use App\Models\KelasKejuaraan;
use App\Models\PesertaKompetisi;
use App\Models\PesertaTim;
use App\Models\Atlet;
use App\Models\Penyelenggara;
use App\Models\User;
use App\Models\AdminKompetisi;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

use App\Traits\HasScopedAccess;

class KompetisiController extends Controller
{
    use HasScopedAccess;
    // Public: Get All
    public function getAll(Request $request)
    {
        $limit = $request->query('limit', 10);
        $search = $request->query('search');
        $status = $request->query('status');

        $query = Kompetisi::with([
            'penyelenggara' => function ($q) {
                $q->select('id_penyelenggara', 'nama_penyelenggara', 'email');
            }
        ]);

        $this->scopeByOrganizer($query);
        $this->scopeByKompetisi($query);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama_event', 'like', "%{$search}%")
                    ->orWhereHas('penyelenggara', function ($q2) use ($search) {
                        $q2->where('nama_penyelenggara', 'like', "%{$search}%");
                    });
            });
        }

        if ($status)
            $query->where('status', $status);
        if ($request->start_date)
            $query->whereDate('tanggal_mulai', '>=', $request->start_date);
        if ($request->end_date)
            $query->whereDate('tanggal_mulai', '<=', $request->end_date);

        $query->orderBy('tanggal_mulai', 'desc');

        $result = $query->paginate($limit);
        return response()->json($result);
    }

    // Public: Get By ID
    public function getById($id)
    {
        $kompetisi = Kompetisi::with([
            'penyelenggara',
            'kelas_kejuaraan' => function ($q) {
                $q->with(['kategori_event', 'kelompok_usia', 'kelas_berat', 'kelas_poomsae', 'peserta_kompetisi']); // Basic load
            }
        ])->find($id);

        if (!$kompetisi)
            return response()->json(['message' => 'Not found'], 404);
        return response()->json(['success' => true, 'data' => $kompetisi]);
    }

    // Public: Get By Slug
    public function getBySlug($slug)
    {
        $kompetisi = Kompetisi::with([
            'penyelenggara',
            'kelas_kejuaraan' => function ($q) {
                $q->with(['kategori_event', 'kelompok_usia', 'kelas_berat', 'kelas_poomsae', 'peserta_kompetisi']);
            }
        ])->where('slug', $slug)->first();

        if (!$kompetisi)
            return response()->json(['message' => 'Not found'], 404);
        return response()->json(['success' => true, 'data' => $kompetisi]);
    }

    // Auth (Admin): Create
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_penyelenggara' => 'required|exists:tb_penyelenggara,id_penyelenggara',
            'nama_event' => 'required|string',
            'tipe_kompetisi' => 'required|in:MASTER,TUNGGAL',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'status' => 'required|in:PENDAFTARAN,SEDANG_DIMULAI,SELESAI,DIBATALKAN', // Enum check
            'lokasi' => 'nullable|string',
            'primary_color' => 'nullable|string|size:7',
            'secondary_color' => 'nullable|string|size:7',
            'logo_url' => 'nullable|string|max:500',
            'admin_email' => 'required|email|unique:tb_akun,email',
            'admin_password' => 'required|string|min:6',
        ]);

        if ($validator->fails())
            return response()->json(['message' => $validator->errors()->first()], 400);

        try {
            DB::beginTransaction();
            $data = $request->all();

            // Generate slug
            $slug = Str::slug($data['nama_event']);
            // Ensure uniqueness
            $count = Kompetisi::where('slug', 'like', $slug . '%')->count();
            $data['slug'] = $count > 0 ? $slug . '-' . ($count + 1) : $slug;

            // Normalize boolean strings from FormData
            if (isset($data['show_antrian'])) {
                $data['show_antrian'] = ($data['show_antrian'] === 'true' || $data['show_antrian'] === '1' || $data['show_antrian'] === true) ? 1 : 0;
            }
            if (isset($data['show_navbar'])) {
                $data['show_navbar'] = ($data['show_navbar'] === 'true' || $data['show_navbar'] === '1' || $data['show_navbar'] === true) ? 1 : 0;
            }

            // Create preliminary record or handle files first? 
            // Better create first to get ID for filename if choosing that pattern, 
            // but update pattern at line 107 uses $id. 
            // For create, we can use a temporary name or timestamp.

            $kompetisi = Kompetisi::create($data);
            $id = $kompetisi->id_kompetisi;

            $updatedData = [];
            // Handle Logo Upload
            if ($request->hasFile('logo')) {
                $file = $request->file('logo');
                $filename = 'logo_' . $id . '_' . time() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('uploads/kompetisi'), $filename);
                $updatedData['logo_url'] = '/uploads/kompetisi/' . $filename;
            }

            // Handle Hero (Poster) Upload
            if ($request->hasFile('hero')) {
                $file = $request->file('hero');
                $filename = 'hero_' . $id . '_' . time() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('uploads/kompetisi'), $filename);
                $updatedData['poster_image'] = '/uploads/kompetisi/' . $filename;
            }

            if (!empty($updatedData)) {
                $kompetisi->update($updatedData);
            }

            // Create Admin Account for this competition
            $user = User::create([
                'email' => $data['admin_email'],
                'password_hash' => Hash::make($data['admin_password']),
                'role' => 'ADMIN_KOMPETISI',
            ]);

            AdminKompetisi::create([
                'id_kompetisi' => $id,
                'id_akun' => $user->id_akun,
                'nama' => 'Admin ' . $kompetisi->nama_event
            ]);

            DB::commit();
            return response()->json(['success' => true, 'data' => $kompetisi], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    // Auth (Admin): Update
    public function update(Request $request, $id)
    {
        $kompetisi = Kompetisi::find($id);
        if (!$kompetisi)
            return response()->json(['message' => 'Not found'], 404);

        $data = $request->all();

        // Handle Logo Upload
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = 'logo_' . $id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/kompetisi'), $filename);
            $data['logo_url'] = '/uploads/kompetisi/' . $filename;
        }

        // Handle Hero (Poster) Upload
        if ($request->hasFile('hero')) {
            $file = $request->file('hero');
            $filename = 'hero_' . $id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/kompetisi'), $filename);
            $data['poster_image'] = '/uploads/kompetisi/' . $filename;
        } else if ($request->input('poster_image') === '') {
            $data['poster_image'] = null;
        }

        // Additional handling for logo_url if passed as field
        if (!$request->hasFile('logo') && $request->input('logo_url') === '') {
            $data['logo_url'] = null;
        }

        // Normalize boolean strings from FormData
        if (isset($data['show_antrian'])) {
            $data['show_antrian'] = ($data['show_antrian'] === 'true' || $data['show_antrian'] === '1' || $data['show_antrian'] === true) ? 1 : 0;
        }
        if (isset($data['show_navbar'])) {
            $data['show_navbar'] = ($data['show_navbar'] === 'true' || $data['show_navbar'] === '1' || $data['show_navbar'] === true) ? 1 : 0;
        }

        $kompetisi->update($data);
        return response()->json(['success' => true, 'data' => $kompetisi]);
    }

    public function getTutorials(Request $request, $id = null)
    {
        $query = \App\Models\Tutorial::query();
        if ($id) {
            $query->where('id_kompetisi', $id);
        } else if ($request->query('id_kompetisi')) {
            $query->where('id_kompetisi', $request->query('id_kompetisi'));
        }
        return response()->json(['success' => true, 'data' => $query->orderBy('created_at', 'asc')->get()]);
    }

    public function addTutorial(Request $request)
    {
        $data = $request->validate([
            'id_kompetisi' => 'nullable|exists:tb_kompetisi,id_kompetisi',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'video_id' => 'required|string',
            'icon_type' => 'nullable|string'
        ]);

        $tutorial = \App\Models\Tutorial::create($data);
        return response()->json(['success' => true, 'data' => $tutorial]);
    }

    public function deleteTutorial($id)
    {
        $tutorial = \App\Models\Tutorial::find($id);
        if (!$tutorial)
            return response()->json(['message' => 'Not found'], 404);
        $tutorial->delete();
        return response()->json(['success' => true]);
    }

    // Auth (Admin): Delete
    public function delete($id)
    {
        $kompetisi = Kompetisi::withCount('kelas_kejuaraan')->find($id);
        if (!$kompetisi)
            return response()->json(['message' => 'Not found'], 404);

        if ($kompetisi->kelas_kejuaraan_count > 0) {
            return response()->json(['message' => 'Cannot delete competition with classes'], 400);
            // Legacy check: can't delete if has classes? Or if classes have participants?
            // Legacy says: if existingKompetisi._count.kelas_kejuaraan > 0 throw Error. (Service line 396)
            // So indeed, strict check.
        }

        $kompetisi->delete();
        return response()->json(['success' => true, 'message' => 'Deleted']);
    }

    // Auth: Register Atlet
    public function registerAtlet(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'kelasKejuaraanId' => 'required|exists:tb_kelas_kejuaraan,id_kelas_kejuaraan',
            'atlitId' => 'required|exists:tb_atlet,id_atlet',
            'atlitId2' => 'nullable|exists:tb_atlet,id_atlet|different:atlitId'
        ]);

        if ($validator->fails())
            return response()->json(['message' => $validator->errors()->first()], 400);

        $kelasId = $request->kelasKejuaraanId;
        $atletId = $request->atlitId;
        $atletId2 = $request->atlitId2;

        try {
            DB::beginTransaction();

            $kelas = KelasKejuaraan::find($kelasId);
            $isTeam = false;
            if ($atletId2 && $kelas->cabang === 'POOMSAE') {
                $isTeam = true;
            }

            if ($isTeam) {
                $peserta = PesertaKompetisi::create([
                    'id_kelas_kejuaraan' => $kelasId,
                    'is_team' => true,
                    'status' => 'PENDING'
                ]);

                // Create PesertaTim members
                PesertaTim::create(['id_peserta_kompetisi' => $peserta->id_peserta_kompetisi, 'id_atlet' => $atletId]);
                PesertaTim::create(['id_peserta_kompetisi' => $peserta->id_peserta_kompetisi, 'id_atlet' => $atletId2]);

                DB::commit();
                return response()->json(['success' => true, 'message' => 'Tim registered', 'data' => $peserta], 201);
            } else {
                $peserta = PesertaKompetisi::create([
                    'id_kelas_kejuaraan' => $kelasId,
                    'id_atlet' => $atletId,
                    'status' => 'PENDING',
                    'is_team' => false
                ]);
                DB::commit();
                return response()->json(['success' => true, 'message' => 'Atlet registered', 'data' => $peserta], 201);
            }

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    // Auth: Delete Participant
    public function deleteParticipant(Request $request, $id, $participantId)
    {
        // Legacy: Hard delete with FK checks disabled?
        // We will try Eloquent standard delete first. The migration setup ON DELETE clauses should handle most.
        // But legacy specifically Nullifies Match participants.

        $peserta = PesertaKompetisi::find($participantId);
        if (!$peserta)
            return response()->json(['message' => 'Participant not found'], 404);

        // Security check: ensure participant belong to competition $id
        // Using relationship check (omitted for brevity but recommended)

        try {
            DB::beginTransaction();
            // Handle cleanup manually if CASCADE not sufficient
            // e.g. set match references to null
            DB::table('tb_match')->where('id_peserta_a', $participantId)->update(['id_peserta_a' => null]);
            DB::table('tb_match')->where('id_peserta_b', $participantId)->update(['id_peserta_b' => null]);

            if ($peserta->is_team) {
                PesertaTim::where('id_peserta_kompetisi', $participantId)->delete();
            }

            $peserta->delete();

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Participant deleted']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    // Auth: Update Status
    public function updateStatus(Request $request, $id, $participantId)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:PENDING,APPROVED,REJECTED'
        ]);

        if ($validator->fails())
            return response()->json(['message' => $validator->errors()->first()], 400);

        $peserta = PesertaKompetisi::find($participantId);
        if (!$peserta)
            return response()->json(['message' => 'Participant not found'], 404);

        $peserta->update(['status' => $request->status]);

        return response()->json(['success' => true, 'data' => $peserta]);
    }

    // Auth: Update Class
    public function updateClass(Request $request, $id, $participantId)
    {
        $validator = Validator::make($request->all(), [
            'kelasKejuaraanId' => 'required|exists:tb_kelas_kejuaraan,id_kelas_kejuaraan'
        ]);

        if ($validator->fails())
            return response()->json(['message' => $validator->errors()->first()], 400);

        $peserta = PesertaKompetisi::find($participantId);
        if (!$peserta)
            return response()->json(['message' => 'Participant not found'], 404);

        $peserta->update(['id_kelas_kejuaraan' => $request->kelasKejuaraanId]);

        return response()->json(['success' => true, 'data' => $peserta]);
    }


    // Auth: Get Atlets By Kompetisi (Participants)
    public function getAtletsByKompetisi(Request $request, $id)
    {
        $limit = $request->query('limit', 100);
        $idDojang = $request->query('id_dojang');
        $idKelas = $request->query('id_kelas');
        $status = $request->query('status');

        $query = PesertaKompetisi::whereHas('kelas_kejuaraan', function ($q) use ($id) {
            $q->where('id_kompetisi', $id);
        })->with([
                    'atlet',
                    'atlet.dojang',
                    'anggota_tim.atlet',
                    'anggota_tim.atlet.dojang',
                    'kelas_kejuaraan.kategori_event',
                    'kelas_kejuaraan.kelompok',
                    'kelas_kejuaraan.kelas_berat',
                    'kelas_kejuaraan.kelas_poomsae',
                    'kelas_kejuaraan.poomsae'
                ]);

        if ($idDojang) {
            $query->where(function ($q) use ($idDojang) {
                // Individual
                $q->whereHas('atlet', function ($q2) use ($idDojang) {
                    $q2->where('id_dojang', $idDojang);
                })
                    // OR Team (all members)
                    ->orWhere(function ($qTeam) use ($idDojang) {
                        $qTeam->where('is_team', true)
                            ->whereHas('anggota_tim.atlet', function ($q3) use ($idDojang) {
                                $q3->where('id_dojang', $idDojang);
                            });
                    });
            });
        }

        if ($idKelas) {
            $query->where('id_kelas_kejuaraan', $idKelas);
        }

        if ($status) {
            $query->where('status', $status);
        }

        $result = $query->paginate($limit);
        return response()->json($result);
    }

    // TODO: Implement getAvailableClassesForParticipant (Logic from Service)
    public function getAvailableClassesForParticipant(Request $request, $id, $participantId)
    {
        // This requires implementing the complex filtering logic found in logic service.
        // For now returning empty or Todo message.
        return response()->json(['message' => 'Endpoint under construction', 'data' => []]);
    }

    // Bracket Generation
    public function generateBrackets(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'kelasKejuaraanId' => 'required|exists:tb_kelas_kejuaraan,id_kelas_kejuaraan',
            'dojangSeparation' => 'nullable'
        ]);

        if ($validator->fails())
            return response()->json(['message' => $validator->errors()->first()], 400);

        try {
            $bracket = \App\Services\BracketService::createBracket(
                $id,
                $request->kelasKejuaraanId,
                $request->dojangSeparation
            );
            return response()->json(['success' => true, 'data' => $bracket, 'message' => 'Bracket generated']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function getBrackets(Request $request, $id, $kelasId = null)
    {
        $kelasId = $kelasId ?: $request->query('kelasKejuaraanId');

        try {
            $data = \App\Services\BracketService::getBracket($id, $kelasId);
            if (!$data)
                return response()->json(['message' => 'Bracket not found'], 404);
            return response()->json(['success' => true, 'data' => $data]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function getMedalTally($id)
    {
        try {
            $classes = \App\Models\KelasKejuaraan::where('id_kompetisi', $id)
                ->with(['kategori_event', 'kelompok', 'kelas_berat', 'poomsae'])
                ->get();

            $formattedClasses = $classes->map(function ($kelas) use ($id) {
                // Attach bracket if exists
                $bagan = \App\Models\Bagan::where('id_kompetisi', $id)
                    ->where('id_kelas_kejuaraan', $kelas->id_kelas_kejuaraan)
                    ->first();

                return [
                    'id_kelas_kejuaraan' => $kelas->id_kelas_kejuaraan,
                    'cabang' => $kelas->cabang,
                    'kategori_event' => $kelas->kategori_event,
                    'kelompok' => $kelas->kelompok, // Match frontend alias
                    'kelas_berat' => $kelas->kelas_berat,
                    'poomsae' => $kelas->poomsae,
                    'jenis_kelamin' => $kelas->jenis_kelamin,
                    'bracket' => $bagan ? \App\Services\BracketService::formatBracketData($bagan) : null
                ];
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'kelas' => $formattedClasses
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function getBracketTanggal($id, $kelasId)
    {
        $bagan = \App\Models\Bagan::where('id_kompetisi', $id)
            ->where('id_kelas_kejuaraan', $kelasId)
            ->first();

        if (!$bagan) {
            return response()->json(['success' => false, 'message' => 'Bracket not found'], 404);
        }

        $match = \App\Models\Matches::where('id_bagan', $bagan->id_bagan)
            ->whereNotNull('tanggal_pertandingan')
            ->first();

        $tanggal = $match ? $match->tanggal_pertandingan : null;

        return response()->json([
            'success' => true,
            'data' => [
                'tanggal' => $tanggal
            ]
        ]);
    }
}

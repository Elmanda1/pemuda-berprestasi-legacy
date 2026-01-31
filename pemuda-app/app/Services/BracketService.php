<?php

namespace App\Services;

use App\Models\Bagan;
use App\Models\DrawingSeed;
use App\Models\Matches;
use App\Models\PesertaKompetisi;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class BracketService
{
    /**
     * Create Bracket
     */
    public static function createBracket($kompetisiId, $kelasKejuaraanId, $dojangSeparation = null)
    {
        // Check existing
        $existing = Bagan::where('id_kompetisi', $kompetisiId)
            ->where('id_kelas_kejuaraan', $kelasKejuaraanId)
            ->first();

        if ($existing) {
            throw new \Exception('Bagan sudah dibuat untuk kelas kejuaraan ini');
        }

        return self::generateBracket($kompetisiId, $kelasKejuaraanId, [], $dojangSeparation);
    }

    /**
     * Generate Bracket Logic
     */
    public static function generateBracket($kompetisiId, $kelasKejuaraanId, $byeParticipantIds = [], $dojangSeparation = null)
    {
        try {
            DB::beginTransaction();

            // 1. Fetch Registrations
            $registrations = PesertaKompetisi::where('id_kelas_kejuaraan', $kelasKejuaraanId)
                ->where('status', 'APPROVED')
                ->with([
                    'atlet.dojang',
                    'anggota_tim.atlet.dojang',
                    'kelas_kejuaraan.kategori_event'
                ])
                ->get();

            if ($registrations->count() < 2) {
                throw new \Exception('Minimal 2 peserta diperlukan untuk membuat bagan');
            }

            // 2. Prepare Participants
            $participants = $registrations->map(function ($reg) {
                if ($reg->is_team && $reg->anggota_tim->count() > 0) {
                    $names = $reg->anggota_tim->map(function ($m) {
                        return $m->atlet->nama_atlet;
                    })->join(' & ');
                    $dojangName = $reg->anggota_tim->first()->atlet->dojang->nama_dojang ?? 'UNKNOWN';
                    return [
                        'id' => $reg->id_peserta_kompetisi,
                        'name' => "Tim " . $names,
                        'dojang' => $dojangName,
                        'isTeam' => true
                    ];
                } elseif ($reg->atlet) {
                    return [
                        'id' => $reg->id_peserta_kompetisi,
                        'name' => $reg->atlet->nama_atlet,
                        'dojang' => $reg->atlet->dojang->nama_dojang ?? 'UNKNOWN',
                        'isTeam' => false
                    ];
                }
                return null;
            })->filter()->values()->toArray();

            // 3. Determine Category (Pemula/Prestasi)
            $kelas = $registrations->first()->kelas_kejuaraan;
            $kategoriName = strtolower($kelas->kategori_event->nama_kategori ?? '');
            $isPemula = strpos($kategoriName, 'pemula') !== false;

            // 4. Create Bagan Record
            $bagan = Bagan::create([
                'id_kompetisi' => $kompetisiId,
                'id_kelas_kejuaraan' => $kelasKejuaraanId
            ]);

            // 5. Create Drawing Seeds (Initial Order)
            foreach ($participants as $index => $p) {
                DrawingSeed::create([
                    'id_bagan' => $bagan->id_bagan,
                    'id_peserta_kompetisi' => $p['id'],
                    'seed_num' => $index + 1
                ]);
            }

            // 6. Generate Matches
            $matches = [];
            if ($isPemula) {
                $matches = self::generatePemulaBracket($bagan->id_bagan, $participants, $dojangSeparation);
            } else {
                // Auto-select BYEs if needed (simple shuffle for now)
                $finalByeIds = $byeParticipantIds;
                if (empty($finalByeIds)) {
                    $targetSize = pow(2, ceil(log(count($participants), 2)));
                    $byesNeeded = $targetSize - count($participants);
                    if ($byesNeeded > 0) {
                        $shuffled = $participants;
                        shuffle($shuffled);
                        $finalByeIds = array_column(array_slice($shuffled, 0, $byesNeeded), 'id');
                    }
                }
                $matches = self::generatePrestasiBracket($bagan->id_bagan, $participants, $finalByeIds, $dojangSeparation);
            }

            DB::commit();

            return [
                'id' => $bagan->id_bagan,
                'matches' => $matches,
                'participants' => $participants
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    // --- PRESTASI BRACKET GENERATION ---
    private static function generatePrestasiBracket($baganId, $participants, $byeIds, $dojangSeparation)
    {
        $matches = [];
        $participantCount = count($participants);

        // Target Size (Power of 2)
        $targetSize = pow(2, ceil(log($participantCount, 2)));
        $totalRounds = log($targetSize, 2);
        $totalMatchesR1 = $targetSize / 2;
        $halfSize = $totalMatchesR1 / 2;

        $r1Stage = self::determineAbsoluteStageName($totalMatchesR1);

        // Separate Active & BYE
        $byeParticipants = [];
        $activeParticipants = [];

        foreach ($participants as $p) {
            if (in_array($p['id'], $byeIds ?? [])) {
                $byeParticipants[] = $p;
            } else {
                $activeParticipants[] = $p;
            }
        }

        // Distribute BYE Positions (Mirrored)
        $byePositions = self::distributeBYEForMirroredBracket($participantCount, $targetSize);

        // Fight Positions
        $allPositions = range(0, $totalMatchesR1 - 1);
        $fightPositions = array_diff($allPositions, $byePositions);

        $leftFightPositions = array_filter($fightPositions, function ($p) use ($halfSize) {
            return $p < $halfSize;
        });
        $rightFightPositions = array_filter($fightPositions, function ($p) use ($halfSize) {
            return $p >= $halfSize;
        });

        $leftNeeded = count($leftFightPositions) * 2;
        $rightNeeded = count($rightFightPositions) * 2;

        // Shuffle / Distribute Active Participants
        // Simplified Logic: Just shuffle active participants for now
        // TODO: Implement Dojang Separation logic here if needed
        shuffle($activeParticipants);

        $leftPool = array_slice($activeParticipants, 0, $leftNeeded);
        $rightPool = array_slice($activeParticipants, $leftNeeded, $rightNeeded);

        // Create R1 Matches
        $leftIdx = 0;
        $rightIdx = 0;
        $byeIdx = 0;
        $sortedPositions = $allPositions; // Already sorted 0..N

        foreach ($sortedPositions as $pos) {
            $p1 = null;
            $p2 = null;
            $status = 'pending';

            if (in_array($pos, $byePositions)) {
                if ($byeIdx < count($byeParticipants)) {
                    $p1 = $byeParticipants[$byeIdx++];
                    $status = 'bye';
                }
            } else {
                $isLeft = $pos < $halfSize;
                if ($isLeft) {
                    if ($leftIdx + 1 < count($leftPool)) {
                        $p1 = $leftPool[$leftIdx++];
                        $p2 = $leftPool[$leftIdx++];
                    }
                } else {
                    if ($rightIdx + 1 < count($rightPool)) {
                        $p1 = $rightPool[$rightIdx++];
                        $p2 = $rightPool[$rightIdx++];
                    }
                }
            }

            $match = Matches::create([
                'id_bagan' => $baganId,
                'ronde' => 1,
                'position' => $pos,
                'stage_name' => $r1Stage,
                'id_peserta_a' => $p1['id'] ?? null,
                'id_peserta_b' => $p2['id'] ?? null,
                'skor_a' => 0,
                'skor_b' => 0
            ]);

            $matches[] = $match;
        }

        // Create Next Rounds (Placeholders)
        for ($round = 2; $round <= $totalRounds; $round++) {
            $matchCount = pow(2, $totalRounds - $round);
            $stageName = self::determineAbsoluteStageName($matchCount);

            for ($i = 0; $i < $matchCount; $i++) {
                $match = Matches::create([
                    'id_bagan' => $baganId,
                    'ronde' => $round,
                    'position' => $i,
                    'stage_name' => $stageName,
                    'id_peserta_a' => null,
                    'id_peserta_b' => null,
                    'skor_a' => 0,
                    'skor_b' => 0
                ]);
                $matches[] = $match;
            }
        }

        // Auto-advance BYEs
        foreach ($matches as $m) {
            if ($m->ronde == 1 && $m->id_peserta_a && !$m->id_peserta_b) {
                // Advance $m->id_peserta_a
                self::advanceWinnerToNextRound($baganId, 1, $m->position, $m->id_peserta_a);
            }
        }

        return $matches;
    }

    // --- PEMULA BRACKET GENERATION ---
    private static function generatePemulaBracket($baganId, $participants, $dojangSeparation)
    {
        $matches = [];
        $shuffled = $participants;
        shuffle($shuffled); // Simple shuffle for now

        $totalParticipants = count($shuffled);
        $normalPairsCount = floor($totalParticipants / 2);

        // Pairs
        for ($i = 0; $i < $normalPairsCount; $i++) {
            $p1 = $shuffled[$i * 2];
            $p2 = $shuffled[$i * 2 + 1];

            $match = Matches::create([
                'id_bagan' => $baganId,
                'ronde' => 1,
                'position' => $i,
                'stage_name' => 'FINAL', // Pemula usually 1 round matches
                'id_peserta_a' => $p1['id'],
                'id_peserta_b' => $p2['id'],
                'skor_a' => 0,
                'skor_b' => 0
            ]);
            $matches[] = $match;
        }

        // Odd one out (BYE?) logic for Pemula? Legacy says:
        // if participants.length % 2 === 1, byeParticipant = workingList.pop()
        // create byeMatch with status 'bye'

        if ($totalParticipants % 2 !== 0) {
            $byePart = end($shuffled);
            $match = Matches::create([
                'id_bagan' => $baganId,
                'ronde' => 1,
                'position' => $normalPairsCount,
                'stage_name' => 'FINAL',
                'id_peserta_a' => $byePart['id'],
                'id_peserta_b' => null,
                'skor_a' => 0,
                'skor_b' => 0
            ]);
            $matches[] = $match;
        }

        return $matches;
    }

    // --- HELPERS ---

    private static function determineAbsoluteStageName($matchCount)
    {
        switch ($matchCount) {
            case 32:
                return 'ROUND_OF_64';
            case 16:
                return 'ROUND_OF_32';
            case 8:
                return 'ROUND_OF_16';
            case 4:
                return 'QUARTER_FINAL';
            case 2:
                return 'SEMI_FINAL';
            case 1:
                return 'FINAL';
            default:
                return 'ROUND_OF_' . ($matchCount * 2);
        }
    }

    private static function distributeBYEForMirroredBracket($participantCount, $targetSize)
    {
        $byesNeeded = $targetSize - $participantCount;
        if ($byesNeeded <= 0)
            return [];

        $totalMatchesR1 = $targetSize / 2;
        $halfSize = $totalMatchesR1 / 2;

        $byePositions = [];
        $leftTop = 0;
        $leftBottom = $halfSize - 1;
        $rightTop = $halfSize;
        $rightBottom = $totalMatchesR1 - 1;

        for ($i = 0; $i < $byesNeeded; $i++) {
            $side = ($i % 2 === 0) ? 'LEFT' : 'RIGHT';
            $isFromTop = (floor($i / 2) % 2 === 0);

            if ($side === 'LEFT') {
                if ($isFromTop && $leftTop <= $leftBottom) {
                    $byePositions[] = $leftTop++;
                } elseif (!$isFromTop && $leftBottom >= $leftTop) {
                    $byePositions[] = $leftBottom--;
                } elseif ($rightTop <= $rightBottom) {  // Fallback
                    $byePositions[] = $rightTop++;
                }
            } else {
                if ($isFromTop && $rightTop <= $rightBottom) {
                    $byePositions[] = $rightTop++;
                } elseif (!$isFromTop && $rightBottom >= $rightTop) {
                    $byePositions[] = $rightBottom--;
                } elseif ($leftTop <= $leftBottom) { // Fallback
                    $byePositions[] = $leftTop++;
                }
            }
        }

        sort($byePositions);
        return $byePositions;
    }

    public static function advanceWinnerToNextRound($baganId, $currentRound, $currentPosition, $winnerId)
    {
        // Calculate Next Match Position
        // pos 0,1 -> next pos 0
        // pos 2,3 -> next pos 1
        $nextRound = $currentRound + 1;
        $nextPosition = floor($currentPosition / 2);
        $isPlayerA = ($currentPosition % 2 === 0);

        $nextMatch = Matches::where('id_bagan', $baganId)
            ->where('ronde', $nextRound)
            ->where('position', $nextPosition)
            ->first();

        if ($nextMatch) {
            if ($isPlayerA) {
                $nextMatch->update(['id_peserta_a' => $winnerId]);
            } else {
                $nextMatch->update(['id_peserta_b' => $winnerId]);
            }

            // If next match is now full (or has BYE potential), logic could trigger recursion?
            // For now just update.
        }
    }

    public static function getBracket($kompetisiId, $kelasKejuaraanId = null)
    {
        $query = Bagan::where('id_kompetisi', $kompetisiId);
        if ($kelasKejuaraanId) {
            $query->where('id_kelas_kejuaraan', $kelasKejuaraanId);
            $bagan = $query->first();
            if (!$bagan)
                return null;
            return self::formatBracketData($bagan);
        }

        $bagans = $query->get();
        return $bagans->map(function ($b) {
            return self::formatBracketData($b);
        });
    }

    public static function formatBracketData($bagan)
    {
        $bagan->load([
            'matches.peserta_a.atlet.dojang',
            'matches.peserta_b.atlet.dojang',
            'matches.peserta_a.anggota_tim.atlet.dojang',
            'matches.peserta_b.anggota_tim.atlet.dojang',
            'kelasKejuaraan.kategori_event',
            'kelasKejuaraan.kelompok',
            'kelasKejuaraan.kelas_berat',
            'kelasKejuaraan.poomsae',
            'kompetisi'
        ]);

        $matches = $bagan->matches->map(function ($m) {
            return [
                'id' => $m->id_match,
                'round' => $m->ronde,
                'position' => $m->position,
                'stageName' => $m->stage_name,
                'scoreA' => $m->skor_a,
                'scoreB' => $m->skor_b,
                'participant1' => $m->peserta_a ? self::transformParticipant($m->peserta_a) : null,
                'participant2' => $m->peserta_b ? self::transformParticipant($m->peserta_b) : null,
                'tanggalPertandingan' => $m->tanggal_pertandingan,
                'nomorPartai' => $m->nomor_partai,
                'nomorAntrian' => $m->nomor_antrian,
                'nomorLapangan' => $m->nomor_lapangan,
                'venue' => $m->venue ? $m->venue->nama_venue : null
            ];
        });

        // Get all unique participants from matches for the convenience of frontend
        $participantIds = [];
        foreach ($bagan->matches as $m) {
            if ($m->id_peserta_a)
                $participantIds[] = $m->id_peserta_a;
            if ($m->id_peserta_b)
                $participantIds[] = $m->id_peserta_b;
        }
        $participants = PesertaKompetisi::whereIn('id_peserta_kompetisi', array_unique($participantIds))
            ->with(['atlet.dojang', 'anggota_tim.atlet.dojang'])
            ->get()
            ->map(function ($p) {
                return self::transformParticipant($p);
            });

        return [
            'id' => $bagan->id_bagan,
            'id_kompetisi' => $bagan->id_kompetisi,
            'id_kelas_kejuaraan' => $bagan->id_kelas_kejuaraan,
            'matches' => $matches,
            'participants' => $participants,
            'cabang' => $bagan->kelasKejuaraan->cabang ?? 'KYORUGI',
            'kategori_event' => $bagan->kelasKejuaraan->kategori_event ?? null,
            'kelompok' => $bagan->kelasKejuaraan->kelompok ?? null,
            'kelas_berat' => $bagan->kelasKejuaraan->kelas_berat ?? null,
            'poomsae' => $bagan->kelasKejuaraan->poomsae ?? null,
            'jenis_kelamin' => $bagan->kelasKejuaraan->jenis_kelamin ?? 'LAKI_LAKI',
            'kompetisi' => $bagan->kompetisi
        ];
    }

    private static function transformParticipant($p)
    {
        if ($p->is_team) {
            $names = $p->anggota_tim->map(function ($m) {
                return $m->atlet->nama_atlet ?? 'UNKNOWN';
            })->toArray();
            $dojang = $p->anggota_tim->first()->atlet->dojang->nama_dojang ?? 'UNKNOWN';
            return [
                'id' => $p->id_peserta_kompetisi,
                'name' => "Tim " . implode(' & ', $names),
                'dojang' => $dojang,
                'dojo' => $dojang, // Alias for frontend
                'isTeam' => true,
                'teamMembers' => $names
            ];
        } else {
            return [
                'id' => $p->id_peserta_kompetisi,
                'atletId' => $p->id_atlet,
                'name' => $p->atlet->nama_atlet ?? 'UNKNOWN',
                'dojang' => $p->atlet->dojang->nama_dojang ?? 'UNKNOWN',
                'dojo' => $p->atlet->dojang->nama_dojang ?? 'UNKNOWN', // Alias for frontend
                'isTeam' => false
            ];
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Certificate;
use Illuminate\Support\Facades\Validator;

class CertificateController extends Controller
{
    // Generate Certificate Number
    public function generateCertificateNumber(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_atlet' => 'required|exists:tb_atlet,id_atlet',
            'id_peserta_kompetisi' => 'required|exists:tb_peserta_kompetisi,id_peserta_kompetisi',
            'id_kompetisi' => 'required|exists:tb_kompetisi,id_kompetisi',
            'medal_status' => 'nullable|string'
        ]);

        if ($validator->fails())
            return response()->json(['message' => $validator->errors()->first()], 400);

        $idAtlet = $request->id_atlet;
        $idPeserta = $request->id_peserta_kompetisi;

        // Check exists
        $existing = Certificate::where('id_atlet', $idAtlet)
            ->where('id_peserta_kompetisi', $idPeserta)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => true,
                'data' => [
                    'certificateNumber' => $existing->certificate_number,
                    'alreadyExists' => true
                ]
            ]);
        }

        // Generate ID
        $lastCert = Certificate::orderBy('id_certificate', 'desc')->first();
        // Be careful: certificate_number is string
        $nextNum = $lastCert ? intval($lastCert->certificate_number) + 1 : 1;
        $certificateNumber = str_pad($nextNum, 5, '0', STR_PAD_LEFT);

        try {
            $certificate = Certificate::create([
                'certificate_number' => $certificateNumber,
                'id_atlet' => $idAtlet,
                'id_peserta_kompetisi' => $idPeserta,
                'id_kompetisi' => $request->id_kompetisi,
                'medal_status' => $request->medal_status ?? 'PARTICIPANT' // Default if null?
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'certificateNumber' => $certificate->certificate_number,
                    'alreadyExists' => false
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // Get Athlete Certificates
    public function getAthleteCertificates(Request $request, $id_atlet)
    {
        $certificates = Certificate::where('id_atlet', $id_atlet)
            ->with([
                'peserta_kompetisi' => function ($q) {
                    // Ensure relations exist in models deeper or minimal load
                    $q->with(['kelas_kejuaraan.kategori_event', 'kelas_kejuaraan.kompetisi']);
                }
            ])
            ->orderBy('created_at', 'desc') // timestamp col name might differ? Migration has created_at?
            // Check migration: tb_certificate has generated_at -> use it?
            // Or id_certificate desc.
            ->orderBy('id_certificate', 'desc')
            ->get();

        return response()->json(['success' => true, 'data' => $certificates]);
    }

    // Check Exists
    public function checkCertificateExists(Request $request, $id_atlet, $id_peserta_kompetisi)
    {
        $existing = Certificate::where('id_atlet', $id_atlet)
            ->where('id_peserta_kompetisi', $id_peserta_kompetisi)
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'exists' => !!$existing,
                'certificateNumber' => $existing->certificate_number ?? null
            ]
        ]);
    }
}

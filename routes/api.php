<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Auth Routes
    Route::post('auth/login', 'AuthController@login');

    Route::group(['middleware' => 'auth:api'], function () {
        Route::get('auth/me', 'AuthController@me');
        Route::post('auth/logout', 'AuthController@logout');

        // Pelatih Routes
        Route::prefix('pelatih')->group(function () {
            Route::get('profile', 'PelatihController@getMyProfile');
            Route::put('profile', 'PelatihController@updateMyProfile');
            Route::post('upload', 'PelatihController@uploadFiles');
            Route::get('/', 'PelatihController@getAllPelatih');
            Route::get('{id}', 'PelatihController@getPelatihById');
        });

        // Dojang Routes (Auth)
        Route::prefix('dojang')->group(function () {
            Route::get('my-dojang', 'DojangController@getMyDojang');
            Route::get('list', 'DojangController@getAll');
            Route::get('listdojang', 'DojangController@getAll');
            Route::get('pelatih/{id_pelatih}', 'DojangController@getByPelatih');
            Route::get('{id}/has-approved-participants', 'DojangController@hasApprovedParticipants');
            Route::get('{id}', 'DojangController@getById');
            Route::put('{id}', 'DojangController@update');
            Route::delete('{id}', 'DojangController@delete');
        });

        // Atlet Routes (Auth)
        Route::prefix('atlet')->group(function () {
            Route::get('/', 'AtletController@getAll');
            Route::post('/', 'AtletController@create');
            Route::get('dojang/{id_dojang}', 'AtletController@getByDojang');
            Route::post('eligible', 'AtletController@getEligible');
            Route::get('{id}', 'AtletController@getById');
            Route::put('{id}', 'AtletController@update');
            Route::delete('{id}', 'AtletController@delete');
            Route::post('{id}/upload-documents', 'AtletController@uploadDocuments');
            // Route::get('kompetisi/{id_kompetisi}/atlet', 'AtletController@getByKompetisi'); // Requires relation update
        });
    });

    // Public Routes
    Route::prefix('dojang')->group(function () {
        Route::get('check-name', 'DojangController@checkNameAvailability');
        Route::get('stats', 'DojangController@getStats');
        Route::get('list', 'DojangController@getAll');
        Route::get('listdojang', 'DojangController@getAll');
        Route::post('/', 'DojangController@create');
        Route::get('{id}', 'DojangController@getById');
        Route::put('{id}', 'DojangController@update');
        Route::delete('{id}', 'DojangController@delete');
    });

    // Public Kelas Reference
    Route::prefix('kelas')->group(function () {
        Route::get('kelompok-usia', 'KelasController@getKelompokUsia');
        Route::get('kelas-berat', 'KelasController@getKelasBerat');
        Route::get('kelas-poomsae', 'KelasController@getKelasPoomsae');

        Route::post('kompetisi/{kompetisiId}', 'KelasController@getKelasKejuaraan'); // Search/Filter
        Route::get('{id}/kelas-kejuaraan', 'KelasController@getKelasKejuaraanByKompetisi');
    });

    Route::prefix('atlet')->group(function () {
        Route::get('stats', 'AtletController@getStats');
    });

    // Public Pertandingan
    Route::get('pertandingan/{id_kompetisi}', 'PertandinganController@getPertandinganInfo');

    // Public Certificate (Check Exists)
    Route::prefix('certificate')->group(function () {
        Route::get('check/{id_atlet}/{id_peserta_kompetisi}', 'CertificateController@checkCertificateExists');
        // Legacy didn't explicitly separate public/auth, assuming check is public?
        // Wait, legacy certificate routes are:
        // router.post('/', generateCertificateNumber) -> Auth likely
        // router.get('/:id_atlet', getAthleteCertificates) -> Auth likely
        // router.get('/check/:id_atlet/:id_peserta_kompetisi', checkCertificateExists) -> Public?
        // Let's assume public for check.
    });

    // Public Kompetisi
    Route::prefix('kompetisi')->group(function () {
        Route::get('/', 'KompetisiController@getAll');
        Route::get('{id}/brackets/{kelasId?}', 'KompetisiController@getBrackets');
        Route::get('{id}/medal-tally', 'KompetisiController@getMedalTally'); // For BracketList
    });
    // Add public alias for legacy support
    Route::get('public/kompetisi/{id}/medal-tally', 'KompetisiController@getMedalTally');
    Route::get('public/kompetisi/{id}/brackets/{kelasId?}', 'KompetisiController@getBrackets');

    // Auth Routes continued...
    Route::group(['middleware' => 'auth:api'], function () {
        // ... existing auth routes ...

        // Auth Kompetisi
        Route::prefix('kompetisi')->group(function () {
            Route::post('/', 'KompetisiController@create'); // Admin
            Route::put('{id}', 'KompetisiController@update'); // Admin
            Route::delete('{id}', 'KompetisiController@delete'); // Admin

            // Registration
            Route::post('register-atlet', 'KompetisiController@registerAtlet'); // Coach
            Route::delete('{id}/peserta/{participantId}', 'KompetisiController@deleteParticipant'); // Coach/Admin?
            Route::put('{id}/participants/{participantId}/status', 'KompetisiController@updateStatus');
            Route::put('{id}/participants/{participantId}/class', 'KompetisiController@updateClass');

            Route::post('{id}/brackets/generate', 'KompetisiController@generateBrackets'); // Admin/Coach? Usually Admin
            Route::get('{id}/atlet', 'KompetisiController@getAtletsByKompetisi'); // List participants
        });

        // Certificate Auth
        Route::prefix('certificate')->group(function () {
            Route::post('/', 'CertificateController@generateCertificateNumber');
            Route::get('{id_atlet}', 'CertificateController@getAthleteCertificates');
        });

        // Bukti Transfer (Auth)
        Route::prefix('bukti-transfer')->group(function () {
            Route::post('upload', 'BuktiTransferController@upload');
            Route::get('/', 'BuktiTransferController@getAll'); // Admin?
            Route::get('dojang/{id_dojang}', 'BuktiTransferController@getByDojang');
            Route::get('pelatih/{id_pelatih}', 'BuktiTransferController@getByPelatih');
            Route::delete('{id}', 'BuktiTransferController@delete');
        });

        // Lapangan (Auth) - Basic
        Route::prefix('lapangan')->group(function () {
            Route::get('/', 'LapanganController@getAll');
            Route::get('hari', 'LapanganController@getAllHari');
            Route::get('kompetisi/{id_kompetisi}', 'LapanganController@getByKompetisi');
            Route::post('tambah-hari', 'LapanganController@tambahHariLapangan');
            Route::delete('{id}', 'LapanganController@delete');
            Route::post('{id}/generate-numbers', 'LapanganController@autoGenerateMatchNumbers');
            Route::get('{id}/numbering-status', 'LapanganController@getNumberingStatus');
        });
    });
});

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Atlet extends Model
{
    protected $table = 'tb_atlet';
    protected $primaryKey = 'id_atlet';
    public $timestamps = false;

    protected $fillable = [
        'nama_atlet',
        'tanggal_lahir',
        'berat_badan',
        'tinggi_badan',
        'jenis_kelamin',
        'id_dojang',
        'id_pelatih_pembuat',
        'akte_kelahiran',
        'pas_foto',
        'sertifikat_belt',
        'ktp',
        'kota',
        'provinsi',
        'umur',
        'alamat',
        'belt',
        'nik',
        'no_telp'
    ];

    public function dojang()
    {
        return $this->belongsTo(Dojang::class, 'id_dojang', 'id_dojang');
    }

    public function pelatih()
    {
        return $this->belongsTo(Pelatih::class, 'id_pelatih_pembuat', 'id_pelatih');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pelatih extends Model
{
    protected $table = 'tb_pelatih';
    protected $primaryKey = 'id_pelatih';
    public $timestamps = false;

    protected $fillable = [
        'nama_pelatih',
        'no_telp',
        'foto_ktp',
        'sertifikat_sabuk',
        'id_akun',
        'id_dojang',
        'jenis_kelamin',
        'kota',
        'nik',
        'provinsi',
        'tanggal_lahir',
        'alamat'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_akun', 'id_akun');
    }

    public function dojang()
    {
        return $this->belongsTo(Dojang::class, 'id_dojang', 'id_dojang');
    }
}

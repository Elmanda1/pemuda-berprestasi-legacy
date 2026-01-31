<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PesertaKompetisi extends Model
{
    protected $table = 'tb_peserta_kompetisi';
    protected $primaryKey = 'id_peserta_kompetisi';
    public $timestamps = false;

    protected $fillable = [
        'id_atlet',
        'id_kelas_kejuaraan',
        'status',
        'is_team',
        'penimbangan1',
        'penimbangan2'
    ];

    public function atlet()
    {
        return $this->belongsTo(Atlet::class, 'id_atlet', 'id_atlet');
    }

    public function kelas_kejuaraan()
    {
        return $this->belongsTo(KelasKejuaraan::class, 'id_kelas_kejuaraan', 'id_kelas_kejuaraan');
    }

    public function anggota_tim()
    {
        return $this->hasMany(PesertaTim::class, 'id_peserta_kompetisi', 'id_peserta_kompetisi');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LapanganKelas extends Model
{
    protected $table = 'tb_lapangan_kelas';
    protected $primaryKey = 'id_lapangan_kelas';
    public $timestamps = false; // Check migration, no timestamps created for tb_lapangan_kelas
    // Migration 4: Schema::create('tb_lapangan_kelas'...) -> no timestamps

    protected $fillable = [
        'id_lapangan',
        'id_kelas_kejuaraan',
        'urutan'
    ];

    public function lapangan()
    {
        return $this->belongsTo(Lapangan::class, 'id_lapangan', 'id_lapangan');
    }

    public function kelasKejuaraan()
    {
        return $this->belongsTo(KelasKejuaraan::class, 'id_kelas_kejuaraan', 'id_kelas_kejuaraan');
    }
}

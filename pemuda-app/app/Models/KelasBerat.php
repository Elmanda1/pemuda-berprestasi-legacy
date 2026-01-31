<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KelasBerat extends Model
{
    protected $table = 'tb_kelas_berat';
    protected $primaryKey = 'id_kelas_berat';
    public $timestamps = false;

    protected $fillable = [
        'id_kelompok',
        'batas_min',
        'batas_max',
        'nama_kelas',
        'jenis_kelamin'
    ];

    public function kelompokUsia()
    {
        return $this->belongsTo(KelompokUsia::class, 'id_kelompok', 'id_kelompok');
    }
}

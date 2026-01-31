<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KelasPoomsae extends Model
{
    protected $table = 'tb_kelas_poomsae';
    protected $primaryKey = 'id_poomsae';
    public $timestamps = false;

    protected $fillable = [
        'id_kelompok',
        'nama_kelas',
        'jenis_kelamin'
    ];

    public function kelompokUsia()
    {
        return $this->belongsTo(KelompokUsia::class, 'id_kelompok', 'id_kelompok');
    }
}

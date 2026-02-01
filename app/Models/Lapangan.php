<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lapangan extends Model
{
    protected $table = 'tb_lapangan';
    protected $primaryKey = 'id_lapangan';
    public $timestamps = false;

    protected $fillable = [
        'id_kompetisi',
        'nama_lapangan',
        'tanggal'
    ];

    public function kompetisi()
    {
        return $this->belongsTo(Kompetisi::class, 'id_kompetisi', 'id_kompetisi');
    }

    public function kelas_list()
    {
        return $this->hasMany(LapanganKelas::class, 'id_lapangan', 'id_lapangan');
    }

    public function antrian()
    {
        return $this->hasOne(Antrian::class, 'id_lapangan', 'id_lapangan');
    }
}

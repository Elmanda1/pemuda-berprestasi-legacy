<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JadwalPertandingan extends Model
{
    protected $table = 'tb_jadwal_pertandingan';
    protected $primaryKey = 'id_jadwal';
    public $timestamps = false;

    protected $fillable = [
        'id_lapangan',
        'id_bagan',
        'antrean',
        'waktu_mulai',
        'waktu_selesai'
    ];

    public function lapangan()
    {
        return $this->belongsTo(Lapangan::class, 'id_lapangan', 'id_lapangan');
    }

    public function bagan()
    {
        return $this->belongsTo(Bagan::class, 'id_bagan', 'id_bagan');
    }
}

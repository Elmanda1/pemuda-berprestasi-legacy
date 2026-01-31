<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Matches extends Model
{
    protected $table = 'tb_match';
    protected $primaryKey = 'id_match';
    public $timestamps = false;

    protected $fillable = [
        'id_bagan',
        'ronde',
        'position',
        'stage_name',
        'id_peserta_a',
        'id_peserta_b',
        'skor_a',
        'skor_b',
        'id_venue',
        'tanggal_pertandingan',
        'nomor_antrian',
        'nomor_lapangan',
        'nomor_partai',
        'hari',
        'id_lapangan'
    ];

    public function bagan()
    {
        return $this->belongsTo(Bagan::class, 'id_bagan', 'id_bagan');
    }

    public function peserta_a()
    {
        return $this->belongsTo(PesertaKompetisi::class, 'id_peserta_a', 'id_peserta_kompetisi');
    }

    public function peserta_b()
    {
        return $this->belongsTo(PesertaKompetisi::class, 'id_peserta_b', 'id_peserta_kompetisi');
    }

    public function venue()
    {
        return $this->belongsTo(Venue::class, 'id_venue', 'id_venue');
    }

    public function lapangan()
    {
        return $this->belongsTo(Lapangan::class, 'id_lapangan', 'id_lapangan');
    }
}

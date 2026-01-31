<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DrawingSeed extends Model
{
    protected $table = 'tb_drawing_seed';
    protected $primaryKey = 'id_seed';
    public $timestamps = false;

    protected $fillable = [
        'id_bagan',
        'id_peserta_kompetisi',
        'seed_num'
    ];

    public function bagan()
    {
        return $this->belongsTo(Bagan::class, 'id_bagan', 'id_bagan');
    }

    public function pesertaKompetisi()
    {
        return $this->belongsTo(PesertaKompetisi::class, 'id_peserta_kompetisi', 'id_peserta_kompetisi');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PesertaTim extends Model
{
    protected $table = 'tb_peserta_tim';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'id_peserta_kompetisi',
        'id_atlet'
    ];

    public function pesertaKompetisi()
    {
        return $this->belongsTo(PesertaKompetisi::class, 'id_peserta_kompetisi', 'id_peserta_kompetisi');
    }

    public function atlet()
    {
        return $this->belongsTo(Atlet::class, 'id_atlet', 'id_atlet');
    }
}

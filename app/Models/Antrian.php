<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Antrian extends Model
{
    protected $table = 'tb_antrian';
    protected $primaryKey = 'id_antrian';
    public $timestamps = false;

    protected $fillable = [
        'id_lapangan',
        'bertanding',
        'persiapan',
        'pemanasan'
    ];

    public function lapangan()
    {
        return $this->belongsTo(Lapangan::class, 'id_lapangan', 'id_lapangan');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KelompokUsia extends Model
{
    protected $table = 'tb_kelompok_usia';
    protected $primaryKey = 'id_kelompok';
    public $timestamps = false;

    protected $fillable = [
        'nama_kelompok',
        'usia_min',
        'usia_max'
    ];
}

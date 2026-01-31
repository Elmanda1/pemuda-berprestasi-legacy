<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bagan extends Model
{
    protected $table = 'tb_bagan';
    protected $primaryKey = 'id_bagan';
    public $timestamps = false;

    protected $fillable = [
        'id_kompetisi',
        'id_kelas_kejuaraan'
    ];

    public function kompetisi()
    {
        return $this->belongsTo(Kompetisi::class, 'id_kompetisi', 'id_kompetisi');
    }

    public function kelasKejuaraan()
    {
        return $this->belongsTo(KelasKejuaraan::class, 'id_kelas_kejuaraan', 'id_kelas_kejuaraan');
    }

    public function matches()
    {
        return $this->hasMany(Matches::class, 'id_bagan', 'id_bagan');
    }
}

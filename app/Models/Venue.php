<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venue extends Model
{
    protected $table = 'tb_venue';
    protected $primaryKey = 'id_venue';
    public $timestamps = false;

    protected $fillable = [
        'id_kompetisi',
        'nama_venue',
        'lokasi'
    ];

    public function kompetisi()
    {
        return $this->belongsTo(Kompetisi::class, 'id_kompetisi', 'id_kompetisi');
    }
}

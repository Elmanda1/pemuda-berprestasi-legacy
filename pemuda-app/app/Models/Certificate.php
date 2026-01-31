<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    protected $table = 'tb_certificate';
    protected $primaryKey = 'id_certificate';
    // Migration 5: timestamp('generated_at'). No created_at/updated_at.
    public $timestamps = false;

    protected $dates = ['generated_at']; // Cast to Carbon

    protected $fillable = [
        'certificate_number',
        'id_atlet',
        'id_peserta_kompetisi',
        'id_kompetisi',
        'medal_status',
        'generated_at'
    ];

    public function atlet()
    {
        return $this->belongsTo(Atlet::class, 'id_atlet', 'id_atlet');
    }

    public function kompetisi()
    {
        return $this->belongsTo(Kompetisi::class, 'id_kompetisi', 'id_kompetisi');
    }
}

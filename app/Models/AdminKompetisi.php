<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminKompetisi extends Model
{
    protected $table = 'tb_admin_kompetisi';
    protected $primaryKey = 'id_admin_kompetisi';
    public $timestamps = false;

    protected $fillable = [
        'id_kompetisi',
        'nama',
        'id_akun'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_akun', 'id_akun');
    }

    public function kompetisi()
    {
        return $this->belongsTo(Kompetisi::class, 'id_kompetisi', 'id_kompetisi');
    }
}

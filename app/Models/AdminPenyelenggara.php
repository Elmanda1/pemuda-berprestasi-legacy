<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminPenyelenggara extends Model
{
    protected $table = 'tb_admin_penyelenggara';
    protected $primaryKey = 'id_admin_penyelenggara';
    public $timestamps = false;

    protected $fillable = [
        'nama',
        'id_akun',
        'id_penyelenggara'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_akun', 'id_akun');
    }

    public function penyelenggara()
    {
        return $this->belongsTo(Penyelenggara::class, 'id_penyelenggara', 'id_penyelenggara');
    }
}

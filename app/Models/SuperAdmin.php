<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuperAdmin extends Model
{
    protected $table = 'tb_super_admin';
    protected $primaryKey = 'id_super_admin';
    public $timestamps = false;

    protected $fillable = [
        'nama',
        'id_akun',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_akun', 'id_akun');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $table = 'tb_admin';
    protected $primaryKey = 'id_admin';
    public $timestamps = false;

    protected $fillable = [
        'nama',
        'id_akun'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_akun', 'id_akun');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penyelenggara extends Model
{
    protected $table = 'tb_penyelenggara';
    protected $primaryKey = 'id_penyelenggara';
    public $timestamps = false; // Migration 1 has no timestamps for this table

    protected $fillable = [
        'nama_penyelenggara',
        'email',
        'no_telp'
    ];
}

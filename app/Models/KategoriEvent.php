<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KategoriEvent extends Model
{
    protected $table = 'tb_kategori_event';
    protected $primaryKey = 'id_kategori_event';
    public $timestamps = false;

    protected $fillable = [
        'nama_kategori'
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dojang extends Model
{
    protected $table = 'tb_dojang';
    protected $primaryKey = 'id_dojang';
    // Timestamps enabled in migration 1

    protected $fillable = [
        'nama_dojang',
        'id_penyelenggara',
        'email',
        'no_telp',
        'founder',
        'negara',
        'provinsi',
        'kota',
        'kecamatan',
        'kelurahan',
        'alamat',
        'logo'
    ];

    public function penyelenggara()
    {
        return $this->belongsTo(Penyelenggara::class, 'id_penyelenggara', 'id_penyelenggara');
    }

    public function pelatihs()
    {
        return $this->hasMany(Pelatih::class, 'id_dojang', 'id_dojang');
    }

    public function atlet()
    {
        return $this->hasMany(Atlet::class, 'id_dojang', 'id_dojang');
    }

    public function classes()
    {
        return $this->atlet(); // Dummy alias if some code expects it? Or just leave it.
    }
    protected $appends = ['jumlah_atlet'];

    public function getJumlahAtletAttribute()
    {
        return $this->atlet()->count();
    }
}

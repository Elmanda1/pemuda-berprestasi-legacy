<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KelasKejuaraan extends Model
{
    protected $table = 'tb_kelas_kejuaraan';
    protected $primaryKey = 'id_kelas_kejuaraan';
    public $timestamps = false;

    protected $fillable = [
        'id_kategori_event',
        'id_kelompok',
        'id_kelas_berat',
        'id_poomsae',
        'id_kompetisi',
        'cabang',
        'poomsae_type',
        'jenis_kelamin',
        'bracket_status'
    ];

    public function kompetisi()
    {
        return $this->belongsTo(Kompetisi::class, 'id_kompetisi', 'id_kompetisi');
    }

    public function pesertaKompetisi()
    {
        return $this->hasMany(PesertaKompetisi::class, 'id_kelas_kejuaraan', 'id_kelas_kejuaraan');
    }

    public function peserta_kompetisi()
    {
        return $this->pesertaKompetisi();
    }

    public function kategori_event()
    {
        return $this->belongsTo(KategoriEvent::class, 'id_kategori_event', 'id_kategori_event');
    }

    public function kelompok_usia()
    {
        return $this->belongsTo(KelompokUsia::class, 'id_kelompok', 'id_kelompok');
    }

    public function kelompok()
    {
        return $this->kelompok_usia();
    }

    public function kelas_berat()
    {
        return $this->belongsTo(KelasBerat::class, 'id_kelas_berat', 'id_kelas_berat');
    }

    public function kelas_poomsae()
    {
        return $this->belongsTo(KelasPoomsae::class, 'id_poomsae', 'id_poomsae');
    }

    public function poomsae()
    {
        return $this->kelas_poomsae();
    }

    // Add other relations as needed e.g. KelasBerat, KelompokUsia
}

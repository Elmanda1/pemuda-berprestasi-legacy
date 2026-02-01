<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kompetisi extends Model
{
    protected $table = 'tb_kompetisi';
    protected $primaryKey = 'id_kompetisi';
    // timestamps true by default, migration has created_at/updated_at.

    protected $fillable = [
        'id_penyelenggara',
        'tanggal_mulai',
        'tanggal_selesai',
        'nama_event',
        'lokasi',
        'status',
        'deskripsi',
        'poster_image',
        'website_url',
        'primary_color',
        'secondary_color',
        'logo_url',
        'show_antrian',
        'show_navbar',
        'hero_title',
        'hero_description',
        'about_description',
        'about_director_name',
        'about_director_title',
        'contact_description',
        'contact_venue_name',
        'contact_phone_1',
        'contact_phone_2',
        'contact_instagram',
        'contact_gmaps_url',
        'contact_person_name_1',
        'contact_person_name_2'
    ];

    public function penyelenggara()
    {
        return $this->belongsTo(Penyelenggara::class, 'id_penyelenggara', 'id_penyelenggara');
    }

    public function venues()
    {
        return $this->hasMany(Venue::class, 'id_kompetisi', 'id_kompetisi');
    }

    public function lapangans()
    {
        return $this->hasMany(Lapangan::class, 'id_kompetisi', 'id_kompetisi');
    }

    public function kelas_kejuaraan()
    {
        return $this->hasMany(KelasKejuaraan::class, 'id_kompetisi', 'id_kompetisi');
    }
}

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
        'no_telp',
        'landing_title',
        'landing_subtitle',
        'landing_about_title',
        'landing_about_content',
        'landing_features_title',
        'landing_feature_1_title',
        'landing_feature_1_desc',
        'landing_feature_2_title',
        'landing_feature_2_desc',
        'landing_feature_3_title',
        'landing_feature_3_desc'
    ];

    public function admin_penyelenggara()
    {
        return $this->hasMany(AdminPenyelenggara::class, 'id_penyelenggara', 'id_penyelenggara');
    }
}

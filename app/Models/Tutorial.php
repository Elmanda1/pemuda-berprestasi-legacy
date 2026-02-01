<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tutorial extends Model
{
    protected $table = 'tb_tutorial';
    protected $primaryKey = 'id_tutorial';

    protected $fillable = [
        'id_kompetisi',
        'title',
        'description',
        'video_id',
        'thumbnail',
        'icon_type'
    ];

    public function kompetisi()
    {
        return $this->belongsTo(Kompetisi::class, 'id_kompetisi', 'id_kompetisi');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchAudit extends Model
{
    protected $table = 'tb_match_audit';
    protected $primaryKey = 'id_audit';
    // Migration 5: created_at present. updated_at ??
    // Schema::create... timestamp('created_at'). No updated_at.
    public $timestamps = false;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    protected $fillable = [
        'id_match',
        'id_user',
        'aksi',
        'payload',
        'created_at'
    ];

    public function match()
    {
        return $this->belongsTo(Matches::class, 'id_match', 'id_match');
    }
}

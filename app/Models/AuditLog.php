<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $table = 'tb_audit_log';
    protected $primaryKey = 'id_log';
    // Migration 5: created_at present.
    public $timestamps = false;
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    protected $fillable = [
        'id_user',
        'tabel',
        'aksi',
        'data_lama',
        'data_baru',
        'created_at'
    ];
}

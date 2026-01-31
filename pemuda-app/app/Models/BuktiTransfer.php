<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BuktiTransfer extends Model
{
    protected $table = 'bukti_transfer';
    protected $primaryKey = 'id_bukti_transfer';
    // Migration 5: Schema::create('bukti_transfer'...) -> timestamp('created_at'). No updated_at.
    public $timestamps = false;

    // We should handle created_at manually or tell Eloquent
    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    protected $fillable = [
        'id_dojang',
        'id_pelatih',
        'bukti_transfer_path',
        'created_at'
    ];

    public function dojang()
    {
        return $this->belongsTo(Dojang::class, 'id_dojang', 'id_dojang');
    }

    public function pelatih()
    {
        return $this->belongsTo(Pelatih::class, 'id_pelatih', 'id_pelatih');
    }

    // Frontend compatibility aliases
    public function tb_dojang()
    {
        return $this->dojang();
    }

    public function tb_pelatih()
    {
        return $this->pelatih();
    }
}

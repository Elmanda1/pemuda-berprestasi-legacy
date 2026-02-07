<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'tb_akun';
    protected $primaryKey = 'id_akun';
    public $timestamps = false; // Based on migration, no timestamps created for tb_akun? Ah, migration 1 has no timestamps?
    // Wait, let's check migration 1 again. 
    // Migration 1: Schema::create('tb_akun', function (Blueprint $table) { ... no timestamps(); ... });
    // CORRECT.

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email',
        'password_hash',
        'role',
    ];

    /**
     * Always return role in uppercase for consistency with frontend.
     */
    public function getRoleAttribute($value)
    {
        return strtoupper($value);
    }

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password_hash',
    ];

    /**
     * Get the password for the user.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    // Relations
    public function super_admin()
    {
        return $this->hasOne(SuperAdmin::class, 'id_akun', 'id_akun');
    }

    public function admin()
    {
        return $this->admin_penyelenggara();
    }

    public function pelatih()
    {
        return $this->hasOne(Pelatih::class, 'id_akun', 'id_akun');
    }

    public function admin_kompetisi()
    {
        return $this->hasOne(AdminKompetisi::class, 'id_akun', 'id_akun');
    }

    public function admin_penyelenggara()
    {
        return $this->hasOne(AdminPenyelenggara::class, 'id_akun', 'id_akun');
    }

    public function competitions()
    {
        return $this->hasMany(AdminKompetisi::class, 'id_akun', 'id_akun');
    }
}

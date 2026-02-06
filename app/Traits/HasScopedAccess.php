<?php

namespace App\Traits;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

trait HasScopedAccess
{
    /**
     * Get the organizer ID for the authenticated user, or null if Super Admin.
     */
    protected function getOrganizerId()
    {
        $user = auth()->user();
        if (!$user) return null;

        if ($user->role === 'SUPER_ADMIN') {
            return null;
        }

        if ($user->role === 'ADMIN') {
            return optional($user->admin_penyelenggara)->id_penyelenggara;
        }

        return null;
    }

    /**
     * Scope a query based on the authenticated user's role.
     * 
     * @param Builder $query
     * @param string $column Column name to filter by (e.g., 'id_penyelenggara')
     */
    protected function scopeByOrganizer(Builder $query, $column = 'id_penyelenggara')
    {
        $id = $this->getOrganizerId();
        if ($id !== null) {
            $query->where($column, $id);
        }
        return $query;
    }

    /**
     * Scope a query for Admin Kompetisi.
     */
    protected function scopeByKompetisi(Builder $query, $column = 'id_kompetisi')
    {
        $user = auth()->user();
        if (!$user) return $query;

        if ($user->role === 'ADMIN_KOMPETISI') {
            $id = optional($user->admin_kompetisi)->id_kompetisi;
            if ($id) {
                $query->where($column, $id);
            }
        } elseif ($user->role === 'ADMIN') {
            // Organizer Admin can see all competitions under their organizer
            $orgId = $this->getOrganizerId();
            if ($orgId) {
                // If the model being queried is not Kompetisi, we might need a join or whereHas
                // But if it's Kompetisi, we just scope by orgId
                if ($query->getModel() instanceof \App\Models\Kompetisi) {
                    $query->where('id_penyelenggara', $orgId);
                } else {
                    // For other models, we assume they have id_kompetisi and we scope those through Kompetisi relation if needed
                    // Or just use the column provided if it's already there
                    $query->where($column, function($q) use ($orgId) {
                        $q->select('id_kompetisi')->from('tb_kompetisi')->where('id_penyelenggara', $orgId);
                    });
                }
            }
        }
        
        return $query;
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class AdminUser extends Authenticatable
{
    use HasFactory, HasApiTokens;

    const ROLE_ADMIN = 'admin';
    const ROLE_LEAD_MODERATOR = 'lead_moderator';
    const ROLE_MODERATOR = 'moderator';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isLeadModerator(): bool
    {
        return $this->role === self::ROLE_LEAD_MODERATOR;
    }

    public function isModerator(): bool
    {
        return $this->role === self::ROLE_MODERATOR;
    }

    public function canApproveWithdrawals(): bool
    {
        return $this->isAdmin() || $this->isLeadModerator();
    }
}

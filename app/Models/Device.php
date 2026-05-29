<?php

namespace App\Models;

use App\Models\DeviceSwitch;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    protected $fillable = [
        'name',
        'device_serial',
        'device_token',
        'type',
        'company_id',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function switchSetting(): HasOne
    {
        return $this->hasOne(DeviceSwitch::class, 'device_serial', 'device_serial');
    }
}

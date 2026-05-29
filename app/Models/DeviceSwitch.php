<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeviceSwitch extends Model
{
    protected $table = 'switches';

    protected $fillable = [
        'device_serial',
        'speed',
    ];
}

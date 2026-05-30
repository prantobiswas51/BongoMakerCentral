<?php

use App\Models\Company;
use App\Models\Device;
use App\Models\User;
use Illuminate\Support\Facades\Process;

test('saving switch speed publishes mqtt message for device', function () {
    Process::fake();

    config([
        'services.mqtt.enabled' => true,
        'services.mqtt.command' => 'mosquitto_pub',
        'services.mqtt.host' => '127.0.0.1',
        'services.mqtt.port' => 1883,
        'services.mqtt.topic_prefix' => 'devices',
        'services.mqtt.retain' => false,
        'services.mqtt.username' => null,
        'services.mqtt.password' => null,
        'services.mqtt.timeout' => 5,
    ]);

    $user = User::factory()->create();

    $company = Company::query()->create([
        'name' => 'Acme',
        'user_id' => $user->id,
    ]);

    $device = Device::query()->create([
        'name' => 'Fan Controller',
        'device_serial' => 'SW-001',
        'device_token' => 'switch-secret',
        'type' => 'switch',
        'company_id' => $company->id,
    ]);

    $response = $this->actingAs($user)->post(route('switches.store'), [
        'device_serial' => $device->device_serial,
        'speed' => 75,
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('switches', [
        'device_serial' => 'SW-001',
        'speed' => 75,
    ]);

    Process::assertRan(function ($process) {
        return $process->command === [
            'mosquitto_pub',
            '-h',
            '127.0.0.1',
            '-p',
            '1883',
            '-t',
            'devices/SW-001/speed',
            '-m',
            '75',
        ];
    });
});

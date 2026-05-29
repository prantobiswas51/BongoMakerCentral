<?php

use App\Models\Company;
use App\Models\Device;
use App\Models\User;

test('authenticated user can create device for own company', function () {
    $user = User::factory()->create();

    $company = Company::query()->create([
        'name' => 'Acme',
        'user_id' => $user->id,
    ]);

    $response = $this->actingAs($user)->post(route('devices.store'), [
        'name' => 'Front Door Lock',
        'device_id' => 'LOCK-001',
        'type' => 'doorlock',
        'company_id' => $company->id,
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('devices', [
        'name' => 'Front Door Lock',
        'device_id' => 'LOCK-001',
        'type' => 'doorlock',
        'company_id' => $company->id,
    ]);
});

test('user cannot create device for another users company', function () {
    $owner = User::factory()->create();
    $attacker = User::factory()->create();

    $company = Company::query()->create([
        'name' => 'Protected Co',
        'user_id' => $owner->id,
    ]);

    $response = $this->actingAs($attacker)->post(route('devices.store'), [
        'name' => 'Spy Cam',
        'device_id' => 'CAM-001',
        'type' => 'camera',
        'company_id' => $company->id,
    ]);

    $response->assertSessionHasErrors('company_id');

    expect(Device::query()->where('device_id', 'CAM-001')->exists())->toBeFalse();
});

test('authenticated user can update own device', function () {
    $user = User::factory()->create();

    $company = Company::query()->create([
        'name' => 'Acme',
        'user_id' => $user->id,
    ]);

    $device = Device::query()->create([
        'name' => 'Old Device',
        'device_id' => 'OLD-001',
        'type' => 'doorlock',
        'company_id' => $company->id,
    ]);

    $response = $this->actingAs($user)->patch(route('devices.update', $device), [
        'name' => 'Updated Device',
        'device_id' => 'UPD-001',
        'type' => 'camera',
        'company_id' => $company->id,
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('devices', [
        'id' => $device->id,
        'name' => 'Updated Device',
        'device_id' => 'UPD-001',
        'type' => 'camera',
    ]);
});

test('authenticated user can delete own device', function () {
    $user = User::factory()->create();

    $company = Company::query()->create([
        'name' => 'Acme',
        'user_id' => $user->id,
    ]);

    $device = Device::query()->create([
        'name' => 'Delete Device',
        'device_id' => 'DEL-001',
        'type' => 'doorlock',
        'company_id' => $company->id,
    ]);

    $response = $this->actingAs($user)->delete(route('devices.destroy', $device));

    $response->assertRedirect();

    $this->assertDatabaseMissing('devices', [
        'id' => $device->id,
    ]);
});

test('user cannot update another users device', function () {
    $owner = User::factory()->create();
    $attacker = User::factory()->create();

    $company = Company::query()->create([
        'name' => 'Owner Co',
        'user_id' => $owner->id,
    ]);

    $device = Device::query()->create([
        'name' => 'Protected Device',
        'device_id' => 'PRO-001',
        'type' => 'camera',
        'company_id' => $company->id,
    ]);

    $response = $this->actingAs($attacker)->patch(route('devices.update', $device), [
        'name' => 'Hacked Device',
        'device_id' => 'HK-001',
        'type' => 'doorlock',
        'company_id' => $company->id,
    ]);

    $response->assertForbidden();

    $this->assertDatabaseHas('devices', [
        'id' => $device->id,
        'name' => 'Protected Device',
        'device_id' => 'PRO-001',
    ]);
});

test('user cannot delete another users device', function () {
    $owner = User::factory()->create();
    $attacker = User::factory()->create();

    $company = Company::query()->create([
        'name' => 'Owner Co',
        'user_id' => $owner->id,
    ]);

    $device = Device::query()->create([
        'name' => 'Protected Device',
        'device_id' => 'PRO-DELETE-001',
        'type' => 'camera',
        'company_id' => $company->id,
    ]);

    $response = $this->actingAs($attacker)->delete(route('devices.destroy', $device));

    $response->assertForbidden();

    $this->assertDatabaseHas('devices', [
        'id' => $device->id,
        'device_id' => 'PRO-DELETE-001',
    ]);
});

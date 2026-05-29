<?php

use App\Models\Company;
use App\Models\User;

test('authenticated user can create company', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('company.store'), [
        'name' => 'New Company',
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('companies', [
        'name' => 'New Company',
        'user_id' => $user->id,
    ]);
});

test('authenticated user can update own company', function () {
    $user = User::factory()->create();

    $company = Company::query()->create([
        'name' => 'Old Name',
        'user_id' => $user->id,
    ]);

    $response = $this->actingAs($user)->patch(route('company.update', $company), [
        'name' => 'New Name',
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('companies', [
        'id' => $company->id,
        'name' => 'New Name',
        'user_id' => $user->id,
    ]);
});

test('authenticated user can delete own company', function () {
    $user = User::factory()->create();

    $company = Company::query()->create([
        'name' => 'Delete Me',
        'user_id' => $user->id,
    ]);

    $response = $this->actingAs($user)->delete(route('company.destroy', $company));

    $response->assertRedirect();

    $this->assertDatabaseMissing('companies', [
        'id' => $company->id,
    ]);
});

test('user cannot update another users company', function () {
    $owner = User::factory()->create();
    $attacker = User::factory()->create();

    $company = Company::query()->create([
        'name' => 'Protected Company',
        'user_id' => $owner->id,
    ]);

    $response = $this->actingAs($attacker)->patch(route('company.update', $company), [
        'name' => 'Hacked Name',
    ]);

    $response->assertForbidden();

    $this->assertDatabaseHas('companies', [
        'id' => $company->id,
        'name' => 'Protected Company',
        'user_id' => $owner->id,
    ]);
});

test('user cannot delete another users company', function () {
    $owner = User::factory()->create();
    $attacker = User::factory()->create();

    $company = Company::query()->create([
        'name' => 'Protected Company',
        'user_id' => $owner->id,
    ]);

    $response = $this->actingAs($attacker)->delete(route('company.destroy', $company));

    $response->assertForbidden();

    $this->assertDatabaseHas('companies', [
        'id' => $company->id,
        'user_id' => $owner->id,
    ]);
});

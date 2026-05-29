<?php

use App\Models\Company;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('company page receives companies', function () {
    $user = User::factory()->create();

    Company::query()->create([
        'name' => 'First Company',
        'user_id' => $user->id,
    ]);

    Company::query()->create([
        'name' => 'Second Company',
        'user_id' => $user->id,
    ]);

    $response = $this->get(route('company'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('company')
            ->has('companies', 2)
            ->where('companies.0.name', 'Second Company')
            ->where('companies.1.name', 'First Company')
        );
});

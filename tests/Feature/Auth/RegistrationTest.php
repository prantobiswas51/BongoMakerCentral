<?php

use App\Models\User;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $this->withoutMiddleware(ValidateCsrfToken::class);

    $companyName = 'Acme Studio';
    $password = 'StrongPassword123!';

    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'company' => $companyName,
        'password' => $password,
        'password_confirmation' => $password,
    ]);

    $response->assertSessionHasNoErrors();

    $response->assertRedirect(route('dashboard', absolute: false));

    $user = User::query()->where('email', 'test@example.com')->firstOrFail();

    expect($user->name)->toBe('Test User');

    $this->assertDatabaseHas('companies', [
        'name' => $companyName,
        'user_id' => $user->id,
    ]);
});
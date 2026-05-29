<?php

use App\Http\Controllers\CameraController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\DoorlockController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\SwitchController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// dashboard controller
Route::get('dashboard', [DashboardController::class, 'index'])->middleware('auth')->name('dashboard');

// Member controller
Route::get('members', [MemberController::class, 'index'])->name('members');

// Device controller
Route::get('devices', [DeviceController::class, 'index'])->name('devices');
Route::post('devices', [DeviceController::class, 'store'])->name('devices.store');
Route::patch('devices/{device}', [DeviceController::class, 'update'])->name('devices.update');
Route::delete('devices/{device}', [DeviceController::class, 'destroy'])->name('devices.destroy');

// Doorlock controller
Route::get('doorlocks', [DoorlockController::class, 'index'])->name('doorlocks');

// Camera controller
Route::get('cameras', [CameraController::class, 'index'])->name('cameras');

// Switch controller
Route::get('switches', [SwitchController::class, 'index'])->name('switches');
Route::post('switches', [SwitchController::class, 'store'])->name('switches.store');

// users controller
Route::get('users', [DashboardController::class, 'index'])->name('users');

// company controller
Route::get('company', [CompanyController::class, 'index'])->name('company');
Route::post('company', [CompanyController::class, 'store'])->name('company.store');
Route::patch('company/{company}', [CompanyController::class, 'update'])->name('company.update');
Route::delete('company/{company}', [CompanyController::class, 'destroy'])->name('company.destroy');

require __DIR__.'/settings.php';

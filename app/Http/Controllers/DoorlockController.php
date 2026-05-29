<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DoorlockController extends Controller
{
    public function index()
    {
        return inertia('doorlocks');
    }
}

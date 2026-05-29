<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CameraController extends Controller
{
    public function index()
    {
        return inertia('cameras');
    }
}

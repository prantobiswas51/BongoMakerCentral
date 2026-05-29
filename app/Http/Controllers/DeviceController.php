<?php

namespace App\Http\Controllers;

use App\Http\Requests\DeviceStoreRequest;
use App\Http\Requests\DeviceUpdateRequest;
use App\Models\Company;
use App\Models\Device;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DeviceController extends Controller
{
    public function index(): Response
    {
        $companies = Company::query()
            ->where('user_id', Auth::id())
            ->get(['id', 'name']);

        $devices = Device::query()
            ->whereHas('company', function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->with('company:id,name')
            ->latest()
            ->get(['id', 'name', 'device_id', 'type', 'company_id']);

        return Inertia::render('devices', [
            'companies' => $companies,
            'devices' => $devices,
        ]);
    }

    public function store(DeviceStoreRequest $request): RedirectResponse
    {
        Device::query()->create($request->validated());

        return back();
    }

    public function update(DeviceUpdateRequest $request, Device $device): RedirectResponse
    {
        if ($device->company->user_id !== Auth::id()) {
            abort(403);
        }

        $device->update($request->validated());

        return back();
    }

    public function destroy(Device $device): RedirectResponse
    {
        if ($device->company->user_id !== Auth::id()) {
            abort(403);
        }

        $device->delete();

        return back();
    }
}

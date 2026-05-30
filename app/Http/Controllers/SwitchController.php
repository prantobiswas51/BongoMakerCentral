<?php

namespace App\Http\Controllers;

use App\Http\Requests\SwitchStoreRequest;
use App\Models\Device;
use App\Models\DeviceSwitch;
use App\Services\MqttPublisher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class SwitchController extends Controller
{
    public function index(): Response
    {
        $devices = Device::query()
            ->where('type', 'switch')
            ->whereHas('company', function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->with(['company:id,name', 'switchSetting'])
            ->latest()
            ->get(['id', 'name', 'device_serial', 'company_id']);

        return Inertia::render('switches', [
            'devices' => $devices->map(function (Device $device) {
                return [
                    'id' => $device->id,
                    'name' => $device->name,
                    'device_serial' => $device->device_serial,
                    'company' => $device->company,
                    'speed' => $device->switchSetting?->speed ?? 0,
                ];
            })->all(),
        ]);
    }

    public function store(SwitchStoreRequest $request, MqttPublisher $mqttPublisher): RedirectResponse
    {
        $validated = $request->validated();

        // Verify device belongs to user's company
        $device = Device::where('device_serial', $validated['device_serial'])
            ->where('type', 'switch')
            ->whereHas('company', function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->firstOrFail();

        DeviceSwitch::query()->updateOrCreate(
            ['device_serial' => $validated['device_serial']],
            ['speed' => $validated['speed']]
        );

        $mqttPublisher->publishSwitchSpeed($device->device_serial, $validated['speed']);

        return back();
    }
}

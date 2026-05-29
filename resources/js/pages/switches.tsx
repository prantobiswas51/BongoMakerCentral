import { Head, router } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { useState, useRef, useEffect } from 'react';

type Company = {
    id: number;
    name: string;
};

type Device = {
    id: number;
    name: string;
    device_serial: string;
    company: Company;
    speed: number;
};

type SwitchesProps = {
    devices: Device[];
};

export default function Switches({ devices }: SwitchesProps) {
    const initialSpeeds = devices.reduce<Record<number, number>>((acc, device) => {
        acc[device.id] = device.speed ?? 0;
        return acc;
    }, {});

    const [speeds, setSpeeds] = useState<Record<number, number>>(initialSpeeds);
    const [savingDeviceId, setSavingDeviceId] = useState<number | null>(null);
    const debounceTimersRef = useRef<Record<number, NodeJS.Timeout>>({});

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            Object.values(debounceTimersRef.current).forEach(timer => clearTimeout(timer));
        };
    }, []);

    const saveSpeed = (deviceId: number, deviceSerial: string, speed: number) => {
        setSavingDeviceId(deviceId);

        router.post('/switches', {
            device_serial: deviceSerial,
            speed: speed,
        }, {
            preserveScroll: true,
            onFinish: () => {
                setSavingDeviceId(null);
            },
        });
    };

    const updateSpeed = (deviceId: number, deviceSerial: string, value: number) => {
        setSpeeds((current) => ({
            ...current,
            [deviceId]: value,
        }));

        // Clear existing timer for this device
        if (debounceTimersRef.current[deviceId]) {
            clearTimeout(debounceTimersRef.current[deviceId]);
        }

        // Set new timer to save after slider stops moving (500ms after last change)
        debounceTimersRef.current[deviceId] = setTimeout(() => {
            saveSpeed(deviceId, deviceSerial, value);
        }, 500);
    };

    return (
        <MainLayout>
            <Head title="Switch" />

            <div className="flex items-center">
                <h1 className="text-2xl font-bold">Switch</h1>
            </div>

            <hr className="my-4 border-t border-gray-300" />

            <div className="grid gap-4 lg:grid-cols-2">
                {devices.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
                        No switch devices found.
                    </div>
                ) : (
                    devices.map((device) => (
                        <div key={device.id} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">{device.name}</h2>
                                    <p className="text-xs text-gray-500">{device.device_serial}</p>
                                    <p className="mt-2 text-xs text-gray-600">Company: {device.company.name}</p>
                                </div>
                                <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                                    {speeds[device.id]}%
                                </div>
                            </div>

                            <div className="mt-5">
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="block text-sm font-medium text-gray-700">Speed</label>
                                    {savingDeviceId === device.id && (
                                        <span className="text-xs text-blue-600 font-medium">Saving...</span>
                                    )}
                                </div>
                                <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={speeds[device.id]}
                                    onChange={(event) => updateSpeed(device.id, device.device_serial, Number(event.target.value))}
                                    disabled={savingDeviceId === device.id}
                                    className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </MainLayout>
    );
}

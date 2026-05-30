<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;

class MqttPublisher
{
    public function publishSwitchSpeed(string $deviceSerial, int $speed): void
    {
        if (! config('services.mqtt.enabled')) {
            return;
        }

        $topic = rtrim((string) config('services.mqtt.topic_prefix'), '/')
            .'/'.$deviceSerial.'/speed';

        $command = [
            (string) config('services.mqtt.command'),
            '-h',
            (string) config('services.mqtt.host'),
            '-p',
            (string) config('services.mqtt.port'),
            '-t',
            $topic,
            '-m',
            (string) $speed,
        ];

        if (config('services.mqtt.retain')) {
            $command[] = '-r';
        }

        if ($username = config('services.mqtt.username')) {
            $command[] = '-u';
            $command[] = (string) $username;
        }

        if ($password = config('services.mqtt.password')) {
            $command[] = '-P';
            $command[] = (string) $password;
        }

        $result = Process::timeout((int) config('services.mqtt.timeout'))
            ->run($command);

        if ($result->failed()) {
            Log::warning('MQTT switch speed publish failed.', [
                'device_serial' => $deviceSerial,
                'speed' => $speed,
                'topic' => $topic,
                'error' => trim($result->errorOutput()),
            ]);
        }
    }
}

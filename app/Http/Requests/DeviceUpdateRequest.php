<?php

namespace App\Http\Requests;

use App\Models\Company;
use App\Models\Device;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DeviceUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Device $device */
        $device = $this->route('device');

        return [
            'name' => ['required', 'string', 'max:255'],
            'device_serial' => [
                'required',
                'string',
                'max:255',
                Rule::unique('devices', 'device_serial')->ignore($device->id),
            ],
            // type removed - not editable via UI
            'company_id' => [
                'required',
                'integer',
                Rule::exists(Company::class, 'id')->where(function ($query) {
                    $query->where('user_id', $this->user()->id);
                }),
            ],
        ];
    }
}

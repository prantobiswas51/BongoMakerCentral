<?php

namespace App\Http\Requests;

use App\Models\Device;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SwitchStoreRequest extends FormRequest
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
        return [
            'device_serial' => [
                'required',
                'string',
                Rule::exists('devices', 'device_serial')->where('type', 'switch'),
            ],
            'speed' => ['required', 'integer', 'min:0', 'max:100'],
        ];
    }
}

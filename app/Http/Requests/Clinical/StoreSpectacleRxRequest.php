<?php

namespace App\Http\Requests\Clinical;

use Illuminate\Foundation\Http\FormRequest;

class StoreSpectacleRxRequest extends FormRequest
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
            'customer_id' => ['required', 'exists:customers,id'],
            'prescribed_at' => ['required', 'date', 'before_or_equal:today'],

            // Right Eye
            'od_sphere' => ['required', 'numeric', 'between:-20,20'],
            'od_cylinder' => ['nullable', 'numeric', 'between:-10,10'],
            'od_axis' => ['nullable', 'integer', 'between:1,180'],
            'od_add' => ['nullable', 'numeric', 'between:0.25,4'],
            'od_prism' => ['nullable', 'string', 'max:20'],

            // Left Eye
            'os_sphere' => ['required', 'numeric', 'between:-20,20'],
            'os_cylinder' => ['nullable', 'numeric', 'between:-10,10'],
            'os_axis' => ['nullable', 'integer', 'between:1,180'],
            'os_add' => ['nullable', 'numeric', 'between:0.25,4'],
            'os_prism' => ['nullable', 'string', 'max:20'],

            // PD
            'pd_far' => ['nullable', 'numeric', 'between:50,80'],
            'pd_near' => ['nullable', 'numeric', 'between:50,80'],
            'pd_type' => ['required', 'in:single,dual'],

            'notes' => ['nullable', 'string'],
            'expires_at' => ['required', 'date', 'after:prescribed_at'],
        ];
    }
}

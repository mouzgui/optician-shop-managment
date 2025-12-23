<?php

namespace App\Http\Requests\Sales;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFrameRequest extends FormRequest
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
            'sku' => [
                'required',
                'string',
                'max:50',
                Rule::unique('frames')->where('business_id', auth()->user()->business_id),
            ],
            'barcode' => ['nullable', 'string', 'max:100'],
            'brand' => ['required', 'string', 'max:100'],
            'model' => ['required', 'string', 'max:100'],
            'color_code' => ['nullable', 'string', 'max:50'],
            'color_name' => ['nullable', 'string', 'max:100'],
            'size_eye' => ['nullable', 'integer', 'min:1'],
            'size_bridge' => ['nullable', 'integer', 'min:1'],
            'size_temple' => ['nullable', 'integer', 'min:1'],
            'category' => ['required', 'string', 'in:optical,sunglasses,sports,kids'],
            'material' => ['nullable', 'string', 'max:100'],
            'gender' => ['nullable', 'string', 'in:male,female,unisex,kids'],
            'cost_price' => ['nullable', 'numeric', 'min:0'],
            'selling_price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:0'],
            'low_stock_threshold' => ['required', 'integer', 'min:0'],
            'image_url' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }
}

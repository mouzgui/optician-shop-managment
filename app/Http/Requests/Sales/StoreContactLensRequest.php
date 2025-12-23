<?php

namespace App\Http\Requests\Sales;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactLensRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'brand' => ['required', 'string', 'max:100'],
            'product_line' => ['required', 'string', 'max:100'],
            'type' => ['required', 'string', 'in:spherical,toric,multifocal,color'],
            'replacement_schedule' => ['required', 'string', 'max:50'],
            'power' => ['nullable', 'numeric'],
            'cylinder' => ['nullable', 'numeric'],
            'axis' => ['nullable', 'integer', 'min:0', 'max:180'],
            'add' => ['nullable', 'numeric', 'min:0'],
            'base_curve' => ['nullable', 'numeric', 'min:0'],
            'diameter' => ['nullable', 'numeric', 'min:0'],
            'box_quantity' => ['required', 'integer', 'min:1'],
            'boxes_in_stock' => ['required', 'integer', 'min:0'],
            'cost_price_per_box' => ['nullable', 'numeric', 'min:0'],
            'selling_price_per_box' => ['required', 'numeric', 'min:0'],
            'expiry_date' => ['nullable', 'date'],
            'is_active' => ['boolean'],
        ];
    }
}

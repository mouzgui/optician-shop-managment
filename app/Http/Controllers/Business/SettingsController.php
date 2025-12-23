<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('Business/Settings/Index', [
            'business' => auth()->user()->business,
        ]);
    }

    public function update(Request $request)
    {
        $business = auth()->user()->business;

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'primary_color' => ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'default_language' => ['nullable', 'string', 'in:en,ar,fr,es'],
            'currency_code' => ['nullable', 'string', 'max:3'],
            'tax_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ]);

        $business->update($validated);

        return back()->with('success', 'Settings updated successfully.');
    }
}

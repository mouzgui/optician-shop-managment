<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('Business/Settings', [
            'business' => auth()->user()->business,
        ]);
    }

    public function update(Request $request)
    {
        $business = auth()->user()->business;

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'tax_number' => ['nullable', 'string', 'max:255'],
            'registration_number' => ['nullable', 'string', 'max:255'],
            'primary_color' => ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'default_language' => ['nullable', 'string', 'in:en,ar,fr,es'],
            'currency_code' => ['nullable', 'string', 'max:3'],
            'tax_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'footer_text' => ['nullable', 'string'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'favicon' => ['nullable', 'image', 'max:1024', 'mimes:png,ico'],
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('branding', 'public');
            $validated['logo_url'] = '/storage/' . $path;
        }

        if ($request->hasFile('favicon')) {
            $path = $request->file('favicon')->store('branding', 'public');
            $validated['favicon_url'] = '/storage/' . $path;
        }

        $business->update($validated);

        return back()->with('success', 'Settings updated successfully.');
    }
}

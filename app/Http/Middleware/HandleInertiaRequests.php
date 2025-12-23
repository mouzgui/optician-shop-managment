<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

use Illuminate\Support\Facades\Cache;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $business = $user ? $user->business : null;

        $branding = [
            'primary_color' => '#3b82f6',
            'logo_url' => null,
            'favicon_url' => null,
            'footer_text' => null,
        ];

        if ($business) {
            $branding = Cache::remember("business_{$business->id}_branding", 3600, function () use ($business) {
                return [
                    'primary_color' => $business->primary_color ?? '#3b82f6',
                    'logo_url' => $business->logo_url,
                    'favicon_url' => $business->favicon_url,
                    'footer_text' => $business->footer_text,
                ];
            });
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'business' => $business,
            'branding' => $branding,
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}

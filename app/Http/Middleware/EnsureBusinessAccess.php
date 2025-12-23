<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureBusinessAccess
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            return $next($request);
        }

        // Super admins bypass business check
        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        // Non-super admins must have a business
        if (!$user->business_id) {
            abort(403, 'No business assigned.');
        }

        return $next($request);
    }
}

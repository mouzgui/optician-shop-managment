// Global type declarations for Laravel Inertia project
import { route as ziggyRoute, RouteParams } from 'ziggy-js';

declare global {
    // Make route function available globally
    function route(name: string, params?: RouteParams, absolute?: boolean): string;

    // NodeJS timeout type for TypeScript
    namespace NodeJS {
        interface Timeout { }
    }
}

export { };

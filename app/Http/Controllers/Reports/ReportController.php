<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Frame;
use App\Models\ContactLens;
use App\Models\SpectaclePrescription;
use App\Models\ContactLensPrescription;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function dashboard()
    {
        $businessId = Auth::user()->business_id;
        $today = today();
        $startOfMonth = now()->startOfMonth();

        $stats = [
            'today_sales' => Invoice::where('business_id', $businessId)
                ->whereDate('created_at', $today)
                ->sum('total'),
            'month_sales' => Invoice::where('business_id', $businessId)
                ->whereBetween('created_at', [$startOfMonth, now()])
                ->sum('total'),
            'today_payments' => Payment::where('business_id', $businessId)
                ->whereDate('received_at', $today)
                ->sum('amount'),
            'pending_jobs' => DB::table('job_cards')
                ->where('business_id', $businessId)
                ->where('status', 'pending')
                ->count(),
        ];

        return Inertia::render('Reports/Index', [
            'stats' => $stats,
        ]);
    }

    public function dailyRevenue(Request $request)
    {
        $businessId = Auth::user()->business_id;
        $date = $request->input('date', today()->format('Y-m-d'));

        $payments = Payment::with(['invoice.customer', 'receivedBy', 'invoice.branch'])
            ->where('business_id', $businessId)
            ->whereDate('received_at', $date)
            ->get();

        $summary = [
            'total' => $payments->sum('amount'),
            'by_method' => $payments->groupBy('payment_method')
                ->map(fn($group) => $group->sum('amount')),
        ];

        return Inertia::render('Reports/DailyRevenue', [
            'payments' => $payments,
            'summary' => $summary,
            'filters' => ['date' => $date],
        ]);
    }

    public function downloadDailyRevenuePdf(Request $request)
    {
        $businessId = Auth::user()->business_id;
        $business = Auth::user()->business;
        $date = $request->input('date', today()->format('Y-m-d'));

        $payments = Payment::with(['invoice.customer', 'receivedBy', 'invoice.branch'])
            ->where('business_id', $businessId)
            ->whereDate('received_at', $date)
            ->get();

        $summary = [
            'total' => $payments->sum('amount'),
            'by_method' => $payments->groupBy('payment_method')
                ->map(fn($group) => $group->sum('amount')),
        ];

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('prints.daily-revenue', [
            'payments' => $payments,
            'summary' => $summary,
            'date' => $date,
            'business' => $business,
        ]);

        return $pdf->download("daily-revenue-{$date}.pdf");
    }

    public function monthlyRevenue(Request $request)
    {
        $businessId = Auth::user()->business_id;
        $year = $request->input('year', date('Y'));

        // Use PHP/Eloquent to process data instead of MySQL-specific functions
        $payments = Payment::where('business_id', $businessId)
            ->whereYear('received_at', $year)
            ->get();

        // Group by month in PHP (database-agnostic)
        $monthlyData = $payments->groupBy(function ($payment) {
            return Carbon::parse($payment->received_at)->month;
        })->map(function ($group) {
            return $group->sum('amount');
        })->all();

        // Fill in missing months with 0
        $formattedData = [];
        for ($i = 1; $i <= 12; $i++) {
            $formattedData[] = [
                'month' => Carbon::create()->month($i)->format('M'),
                'total' => $monthlyData[$i] ?? 0,
            ];
        }

        return Inertia::render('Reports/MonthlyRevenue', [
            'data' => $formattedData,
            'filters' => ['year' => $year],
        ]);
    }

    public function downloadMonthlyRevenuePdf(Request $request)
    {
        $businessId = Auth::user()->business_id;
        $business = Auth::user()->business;
        $year = $request->input('year', date('Y'));

        $payments = Payment::where('business_id', $businessId)
            ->whereYear('received_at', $year)
            ->get();

        $monthlyData = $payments->groupBy(function ($payment) {
            return Carbon::parse($payment->received_at)->month;
        })->map(function ($group) {
            return $group->sum('amount');
        })->all();

        $formattedData = [];
        for ($i = 1; $i <= 12; $i++) {
            $formattedData[] = [
                'month' => Carbon::create()->month($i)->format('M'),
                'total' => $monthlyData[$i] ?? 0,
            ];
        }

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('prints.monthly-revenue', [
            'data' => $formattedData,
            'year' => $year,
            'business' => $business,
        ]);

        return $pdf->download("monthly-revenue-{$year}.pdf");
    }

    public function outstandingBalances()
    {
        $businessId = Auth::user()->business_id;

        $invoices = Invoice::with('customer')
            ->where('business_id', $businessId)
            ->where('balance_due', '>', 0)
            ->orderBy('balance_due', 'desc')
            ->get();

        return Inertia::render('Reports/OutstandingBalances', [
            'invoices' => $invoices,
            'total_outstanding' => $invoices->sum('balance_due'),
        ]);
    }

    public function downloadOutstandingBalancesPdf()
    {
        $businessId = Auth::user()->business_id;
        $business = Auth::user()->business;

        $invoices = Invoice::with('customer')
            ->where('business_id', $businessId)
            ->where('balance_due', '>', 0)
            ->orderBy('balance_due', 'desc')
            ->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('prints.outstanding-balances', [
            'invoices' => $invoices,
            'total_outstanding' => $invoices->sum('balance_due'),
            'business' => $business,
        ]);

        return $pdf->download("outstanding-balances-" . now()->format('Y-m-d') . ".pdf");
    }

    public function inventory()
    {
        $businessId = Auth::user()->business_id;
        $cacheKey = "business_{$businessId}_low_stock";

        $data = cache()->remember($cacheKey, now()->addMinutes(10), function () use ($businessId) {
            return [
                'lowStockFrames' => Frame::where('business_id', $businessId)
                    ->where('quantity', '<=', 2)
                    ->get(['id', 'brand', 'model', 'color_name', 'sku', 'quantity']),
                'lowStockCL' => ContactLens::where('business_id', $businessId)
                    ->where('boxes_in_stock', '<=', 5)
                    ->get(['id', 'brand', 'product_line', 'power', 'base_curve', 'boxes_in_stock']),
            ];
        });

        return Inertia::render('Reports/Inventory', $data);
    }

    public function downloadInventoryPdf()
    {
        $businessId = Auth::user()->business_id;
        $business = Auth::user()->business;

        $lowStockFrames = Frame::where('business_id', $businessId)
            ->where('quantity', '<=', 2)
            ->get(['id', 'brand', 'model', 'color_name', 'sku', 'quantity']);

        $lowStockCL = ContactLens::where('business_id', $businessId)
            ->where('boxes_in_stock', '<=', 5)
            ->get(['id', 'brand', 'product_line', 'power', 'base_curve', 'boxes_in_stock']);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('prints.inventory', [
            'lowStockFrames' => $lowStockFrames,
            'lowStockCL' => $lowStockCL,
            'business' => $business,
        ]);

        return $pdf->download("inventory-report-" . now()->format('Y-m-d') . ".pdf");
    }

    public function staffPerformance(Request $request)
    {
        $businessId = Auth::user()->business_id;
        $startDate = $request->input('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));

        // Use PHP-based grouping instead of MySQL-specific SQL
        $payments = Payment::with('receivedBy')
            ->where('business_id', $businessId)
            ->whereBetween('received_at', [$startDate, $endDate])
            ->get();

        $performance = $payments->groupBy('received_by')
            ->map(function ($group) {
                $user = $group->first()->receivedBy;
                return [
                    'name' => $user ? $user->name : 'Unknown',
                    'total_collected' => number_format($group->sum('amount'), 2, '.', ''),
                    'payment_count' => $group->count(),
                ];
            })
            ->values();

        return Inertia::render('Reports/StaffPerformance', [
            'performance' => $performance,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    public function downloadStaffPerformancePdf(Request $request)
    {
        $businessId = Auth::user()->business_id;
        $business = Auth::user()->business;
        $startDate = $request->input('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));

        $payments = Payment::with('receivedBy')
            ->where('business_id', $businessId)
            ->whereBetween('received_at', [$startDate, $endDate])
            ->get();

        $performance = $payments->groupBy('received_by')
            ->map(function ($group) {
                $user = $group->first()->receivedBy;
                return [
                    'name' => $user ? $user->name : 'Unknown',
                    'total_collected' => number_format($group->sum('amount'), 2, '.', ''),
                    'payment_count' => $group->count(),
                ];
            })
            ->values();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('prints.staff-performance', [
            'performance' => $performance,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'business' => $business,
        ]);

        return $pdf->download("staff-performance-{$startDate}-to-{$endDate}.pdf");
    }

    public function rxExpiry()
    {
        $businessId = Auth::user()->business_id;
        $threeMonthsFromNow = now()->addMonths(3);

        $expiringSpectacleRx = SpectaclePrescription::with('customer')
            ->where('business_id', $businessId)
            ->whereBetween('expires_at', [now(), $threeMonthsFromNow])
            ->get();

        $expiringCLRx = ContactLensPrescription::with('customer')
            ->where('business_id', $businessId)
            ->whereBetween('expires_at', [now(), $threeMonthsFromNow])
            ->get();

        return Inertia::render('Reports/RxExpiry', [
            'spectacleRx' => $expiringSpectacleRx,
            'contactLensRx' => $expiringCLRx,
        ]);
    }

    public function downloadRxExpiryPdf()
    {
        $businessId = Auth::user()->business_id;
        $business = Auth::user()->business;
        $threeMonthsFromNow = now()->addMonths(3);

        $expiringSpectacleRx = SpectaclePrescription::with('customer')
            ->where('business_id', $businessId)
            ->whereBetween('expires_at', [now(), $threeMonthsFromNow])
            ->get();

        $expiringCLRx = ContactLensPrescription::with('customer')
            ->where('business_id', $businessId)
            ->whereBetween('expires_at', [now(), $threeMonthsFromNow])
            ->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('prints.rx-expiry', [
            'spectacleRx' => $expiringSpectacleRx,
            'contactLensRx' => $expiringCLRx,
            'business' => $business,
        ]);

        return $pdf->download("expiring-prescriptions-" . now()->format('Y-m-d') . ".pdf");
    }
}

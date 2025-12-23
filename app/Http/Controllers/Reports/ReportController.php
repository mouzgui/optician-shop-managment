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

    public function monthlyRevenue(Request $request)
    {
        $businessId = Auth::user()->business_id;
        $year = $request->input('year', date('Y'));

        $monthlyData = Payment::where('business_id', $businessId)
            ->whereYear('received_at', $year)
            ->select(
                DB::raw('MONTH(received_at) as month'),
                DB::raw('SUM(amount) as total')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('total', 'month')
            ->all();

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

    public function staffPerformance(Request $request)
    {
        $businessId = Auth::user()->business_id;
        $startDate = $request->input('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->format('Y-m-d'));

        $performance = DB::table('payments')
            ->join('users', 'payments.received_by', '=', 'users.id')
            ->where('payments.business_id', $businessId)
            ->whereBetween('payments.received_at', [$startDate, $endDate])
            ->select(
                'users.name',
                DB::raw('SUM(payments.amount) as total_collected'),
                DB::raw('COUNT(payments.id) as payment_count')
            )
            ->groupBy('users.id', 'users.name')
            ->get();

        return Inertia::render('Reports/StaffPerformance', [
            'performance' => $performance,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    public function rxExpiry()
    {
        $businessId = Auth::user()->business_id;
        $threeMonthsFromNow = now()->addMonths(3);

        $expiringSpectacleRx = SpectaclePrescription::with('customer')
            ->where('business_id', $businessId)
            ->whereBetween('expiry_date', [now(), $threeMonthsFromNow])
            ->get();

        $expiringCLRx = ContactLensPrescription::with('customer')
            ->where('business_id', $businessId)
            ->whereBetween('expiry_date', [now(), $threeMonthsFromNow])
            ->get();

        return Inertia::render('Reports/RxExpiry', [
            'spectacleRx' => $expiringSpectacleRx,
            'contactLensRx' => $expiringCLRx,
        ]);
    }
}

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Staff Performance - {{ $start_date }} to {{ $end_date }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; line-height: 1.5; }
        .report-box { max-width: 800px; margin: auto; padding: 30px; }
        .header { margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f8fafc; padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
        .summary-card { background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #e0f2fe; }
        .summary-table td { border: none; padding: 5px; }
        .summary-label { color: #0369a1; font-size: 10px; text-transform: uppercase; font-weight: bold; }
        .summary-value { font-size: 16px; font-weight: bold; color: #0c4a6e; }
        .footer { margin-top: 50px; text-align: center; color: #94a3b8; font-size: 10px; }
        .progress-bar { width: 100%; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden; margin-top: 5px; }
        .progress-fill { height: 100%; background: #3b82f6; }
    </style>
</head>
<body>
    <div class="report-box">
        <div class="header">
            <table>
                <tr>
                    <td>
                        <div class="logo">{{ $business->name }}</div>
                    </td>
                    <td style="text-align: right;">
                        <div class="title">Staff Performance Report</div>
                        <div>Period: {{ \Carbon\Carbon::parse($start_date)->format('d M Y') }} - {{ \Carbon\Carbon::parse($end_date)->format('d M Y') }}</div>
                    </td>
                </tr>
            </table>
        </div>

        @php
            $totalAll = collect($performance)->sum('total_collected');
            $totalTransactions = collect($performance)->sum('payment_count');
        @endphp

        <div class="summary-card">
            <table class="summary-table">
                <tr>
                    <td>
                        <div class="summary-label">Total Revenue Collected</div>
                        <div class="summary-value">{{ $business->formatCurrency($totalAll) }}</div>
                    </td>
                    <td style="text-align: center;">
                        <div class="summary-label">Total Transactions</div>
                        <div class="summary-value">{{ $totalTransactions }}</div>
                    </td>
                    <td style="text-align: right;">
                        <div class="summary-label">Avg Transaction</div>
                        <div class="summary-value">{{ $totalTransactions > 0 ? $business->formatCurrency($totalAll / $totalTransactions) : $business->formatCurrency(0) }}</div>
                    </td>
                </tr>
            </table>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Staff Member</th>
                    <th style="text-align: center;">Transactions</th>
                    <th style="text-align: right;">Total Collected</th>
                    <th style="text-align: right; width: 150px;">Share</th>
                </tr>
            </thead>
            <tbody>
                @foreach($performance as $staff)
                @php
                    $collected = (float) $staff['total_collected'];
                    $share = $totalAll > 0 ? ($collected / $totalAll) * 100 : 0;
                @endphp
                <tr>
                    <td><strong>{{ $staff['name'] }}</strong></td>
                    <td style="text-align: center;">{{ $staff['payment_count'] }}</td>
                    <td style="text-align: right;">{{ $business->formatCurrency($collected) }}</td>
                    <td style="text-align: right;">
                        {{ number_format($share, 1) }}%
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: {{ number_format($share, 2, '.', '') }}%;"></div>
                        </div>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="footer">
            Report generated on {{ now()->format('d M Y H:i') }}<br>
            Software by Opticina
        </div>
    </div>
</body>
</html>

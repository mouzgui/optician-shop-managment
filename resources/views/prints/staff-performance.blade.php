<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Staff Performance - {{ $start_date }} to {{ $end_date }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; line-height: 1.5; }
        .report-box { max-width: 800px; margin: auto; padding: 30px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f8fafc; padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
        .summary-card { background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #e0f2fe; }
        .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
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
            <div class="logo">{{ $business->name }}</div>
            <div style="text-align: right;">
                <div class="title">Staff Performance Report</div>
                <div>Period: {{ \Carbon\Carbon::parse($start_date)->format('d M Y') }} - {{ \Carbon\Carbon::parse($end_date)->format('d M Y') }}</div>
            </div>
        </div>

        @php
            $totalAll = collect($performance)->sum('total_collected');
            $totalTransactions = collect($performance)->sum('payment_count');
        @endphp

        <div class="summary-card">
            <div style="display: flex; justify-content: space-between;">
                <div>
                    <div class="summary-label">Total Revenue Collected</div>
                    <div class="summary-value">${{ number_format($totalAll, 2) }}</div>
                </div>
                <div>
                    <div class="summary-label">Total Transactions</div>
                    <div class="summary-value">{{ $totalTransactions }}</div>
                </div>
                <div>
                    <div class="summary-label">Avg Transaction</div>
                    <div class="summary-value">${{ $totalTransactions > 0 ? number_format($totalAll / $totalTransactions, 2) : '0.00' }}</div>
                </div>
            </div>
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
                    $share = $totalAll > 0 ? ($staff['total_collected'] / $totalAll) * 100 : 0;
                @endphp
                <tr>
                    <td><strong>{{ $staff['name'] }}</strong></td>
                    <td style="text-align: center;">{{ $staff['payment_count'] }}</td>
                    <td style="text-align: right;">${{ number_format($staff['total_collected'], 2) }}</td>
                    <td style="text-align: right;">
                        {{ number_format($share, 1) }}%
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: {{ $share }}%;"></div>
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

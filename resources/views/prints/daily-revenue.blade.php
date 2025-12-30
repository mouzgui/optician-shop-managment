<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Daily Revenue - {{ $date }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; line-height: 1.5; }
        .report-box { max-width: 800px; margin: auto; padding: 30px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f8fafc; padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
        .summary-card { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #e2e8f0; }
        .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .summary-item { margin-bottom: 10px; }
        .summary-label { color: #64748b; font-size: 10px; text-transform: uppercase; font-weight: bold; }
        .summary-value { font-size: 16px; font-weight: bold; color: #0f172a; }
        .footer { margin-top: 50px; text-align: center; color: #94a3b8; font-size: 10px; }
    </style>
</head>
<body>
    <div class="report-box">
        <div class="header">
            <div class="logo">{{ $business->name }}</div>
            <div style="text-align: right;">
                <div class="title">Daily Revenue Report</div>
                <div>Date: {{ \Carbon\Carbon::parse($date)->format('d M Y') }}</div>
            </div>
        </div>

        <div class="summary-card">
            <div class="summary-label">Total Revenue</div>
            <div class="summary-value">${{ number_format($summary['total'], 2) }}</div>
            
            <div style="margin-top: 15px; display: flex; gap: 20px;">
                @foreach($summary['by_method'] as $method => $amount)
                <div style="margin-right: 20px;">
                    <div class="summary-label">{{ strtoupper(str_replace('_', ' ', $method)) }}</div>
                    <div style="font-weight: bold;">${{ number_format($amount, 2) }}</div>
                </div>
                @endforeach
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Invoice #</th>
                    <th>Customer</th>
                    <th>Method</th>
                    <th>Received By</th>
                    <th style="text-align: right;">Amount</th>
                </tr>
            </thead>
            <tbody>
                @foreach($payments as $payment)
                <tr>
                    <td>{{ $payment->invoice->invoice_number ?? '-' }}</td>
                    <td>
                        @if($payment->invoice && $payment->invoice->customer)
                            {{ $payment->invoice->customer->first_name }} {{ $payment->invoice->customer->last_name }}
                        @else
                            -
                        @endif
                    </td>
                    <td>{{ strtoupper(str_replace('_', ' ', $payment->payment_method)) }}</td>
                    <td>{{ $payment->receivedBy->name ?? '-' }}</td>
                    <td style="text-align: right;">${{ number_format($payment->amount, 2) }}</td>
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

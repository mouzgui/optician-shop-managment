<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Outstanding Balances - {{ now()->format('d M Y') }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; line-height: 1.5; }
        .report-box { max-width: 800px; margin: auto; padding: 30px; }
        .header { margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
        .header table { width: 100%; border: none; }
        .header td { border: none; padding: 0; vertical-align: top; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f8fafc; padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
        .summary-card { background: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #fee2e2; }
        .summary-table { width: 100%; border: none; margin-bottom: 0; }
        .summary-table td { border: none; padding: 0; }
        .summary-label { color: #991b1b; font-size: 10px; text-transform: uppercase; font-weight: bold; }
        .summary-value { font-size: 20px; font-weight: bold; color: #991b1b; }
        .footer { margin-top: 50px; text-align: center; color: #94a3b8; font-size: 10px; }
        .badge { padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .badge-danger { background: #fef2f2; color: #991b1b; border: 1px solid #fee2e2; }
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
                        <div class="title">Outstanding Balances Report</div>
                        <div>Generated on: {{ now()->format('d M Y H:i') }}</div>
                    </td>
                </tr>
            </table>
        </div>

        <div class="summary-card">
            <table class="summary-table">
                <tr>
                    <td>
                        <div class="summary-label">Total Outstanding Amount</div>
                        <div class="summary-value">{{ $business->formatCurrency($total_outstanding) }}</div>
                        <div style="margin-top: 5px; font-size: 12px; color: #991b1b;">
                            Across {{ count($invoices) }} pending invoices
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Invoice #</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th style="text-align: right;">Total</th>
                    <th style="text-align: right;">Paid</th>
                    <th style="text-align: right;">Balance</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoices as $invoice)
                <tr>
                    <td><strong>{{ $invoice->invoice_number }}</strong></td>
                    <td>
                        {{ $invoice->customer->first_name }} {{ $invoice->customer->last_name }}<br>
                        <small style="color: #64748b;">{{ $invoice->customer->phone }}</small>
                    </td>
                    <td>{{ $invoice->created_at->format('d M Y') }}</td>
                    <td style="text-align: right;">{{ $business->formatCurrency($invoice->total) }}</td>
                    <td style="text-align: right;">{{ $business->formatCurrency($invoice->amount_paid) }}</td>
                    <td style="text-align: right; color: #dc2626; font-weight: bold;">{{ $business->formatCurrency($invoice->balance_due) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="footer">
            Software by Opticina
        </div>
    </div>
</body>
</html>

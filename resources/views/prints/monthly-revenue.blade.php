<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Monthly Revenue Report - {{ $year }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; line-height: 1.5; }
        .report-box { max-width: 800px; margin: auto; padding: 30px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f8fafc; padding: 12px 10px; border-bottom: 2px solid #e2e8f0; text-align: left; }
        td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; }
        .section-title { font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #1e293b; background: #f1f5f9; padding: 8px; border-radius: 4px; }
        .summary-card { background: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #dbeafe; }
        .summary-label { color: #1e40af; font-size: 10px; text-transform: uppercase; font-weight: bold; }
        .summary-value { font-size: 16px; font-weight: bold; color: #1e3a8a; }
        .footer { margin-top: 50px; text-align: center; color: #94a3b8; font-size: 10px; }
        .text-end { text-align: right; }
        .best-month { color: #16a34a; font-weight: bold; }
    </style>
</head>
<body>
    <div class="report-box">
        <div class="header">
            <div class="logo">{{ $business->name }}</div>
            <div style="text-align: right;">
                <div class="title">Monthly Revenue Report</div>
                <div>Year: {{ $year }}</div>
            </div>
        </div>

        <div class="summary-card">
            <div style="display: flex; gap: 40px;">
                <div>
                    <div class="summary-label">Total Yearly Revenue</div>
                    <div class="summary-value">${{ number_format(collect($data)->sum('total'), 2) }}</div>
                </div>
                <div>
                    <div class="summary-label">Monthly Average</div>
                    <div class="summary-value">${{ number_format(collect($data)->avg('total'), 2) }}</div>
                </div>
            </div>
        </div>

        <div class="section-title">Monthly Breakdown</div>
        <table>
            <thead>
                <tr>
                    <th>Month</th>
                    <th class="text-end">Revenue</th>
                    <th class="text-end">% of Total</th>
                </tr>
            </thead>
            <tbody>
                @php $total = collect($data)->sum('total'); @endphp
                @foreach($data as $item)
                <tr>
                    <td><strong>{{ $item['month'] }}</strong></td>
                    <td class="text-end">${{ number_format($item['total'], 2) }}</td>
                    <td class="text-end">
                        {{ $total > 0 ? number_format(($item['total'] / $total) * 100, 1) : 0 }}%
                    </td>
                </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr style="background: #f8fafc; font-weight: bold;">
                    <td>TOTAL</td>
                    <td class="text-end">${{ number_format($total, 2) }}</td>
                    <td class="text-end">100%</td>
                </tr>
            </tfoot>
        </table>

        <div class="footer">
            Software by Opticina
        </div>
    </div>
</body>
</html>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Expiring Prescriptions Report - {{ now()->format('d M Y') }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; line-height: 1.5; }
        .report-box { max-width: 800px; margin: auto; padding: 30px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f8fafc; padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
        .section-title { font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #1e293b; background: #f1f5f9; padding: 8px; border-radius: 4px; }
        .summary-card { background: #fdf2f8; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #fce7f3; }
        .summary-label { color: #9d174d; font-size: 10px; text-transform: uppercase; font-weight: bold; }
        .summary-value { font-size: 16px; font-weight: bold; color: #831843; }
        .footer { margin-top: 50px; text-align: center; color: #94a3b8; font-size: 10px; }
        .badge { padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; }
        .badge-warning { background: #fffbeb; color: #92400e; }
    </style>
</head>
<body>
    <div class="report-box">
        <div class="header">
            <div class="logo">{{ $business->name }}</div>
            <div style="text-align: right;">
                <div class="title">Expiring Prescriptions Report</div>
                <div>Expiring in the next 3 months</div>
            </div>
        </div>

        <div class="summary-card">
            <div style="display: flex; gap: 40px;">
                <div>
                    <div class="summary-label">Spectacle Prescriptions</div>
                    <div class="summary-value">{{ count($spectacleRx) }} expiring</div>
                </div>
                <div>
                    <div class="summary-label">Contact Lens Prescriptions</div>
                    <div class="summary-value">{{ count($contactLensRx) }} expiring</div>
                </div>
            </div>
        </div>

        <div class="section-title">Expiring Spectacle Prescriptions</div>
        <table>
            <thead>
                <tr>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Prescription Date</th>
                    <th>Expiry Date</th>
                </tr>
            </thead>
            <tbody>
                @forelse($spectacleRx as $rx)
                <tr>
                    <td><strong>{{ $rx->customer->first_name }} {{ $rx->customer->last_name }}</strong></td>
                    <td>{{ $rx->customer->phone }}</td>
                    <td>{{ \Carbon\Carbon::parse($rx->prescribed_at)->format('d M Y') }}</td>
                    <td>
                        <span class="badge badge-warning">
                            {{ \Carbon\Carbon::parse($rx->expires_at)->format('d M Y') }}
                        </span>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" style="text-align: center; color: #64748b;">No expiring spectacle prescriptions found.</td>
                </tr>
                @endforelse
            </tbody>
        </table>

        <div class="section-title">Expiring Contact Lens Prescriptions</div>
        <table>
            <thead>
                <tr>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Prescription Date</th>
                    <th>Expiry Date</th>
                </tr>
            </thead>
            <tbody>
                @forelse($contactLensRx as $rx)
                <tr>
                    <td><strong>{{ $rx->customer->first_name }} {{ $rx->customer->last_name }}</strong></td>
                    <td>{{ $rx->customer->phone }}</td>
                    <td>{{ \Carbon\Carbon::parse($rx->prescribed_at)->format('d M Y') }}</td>
                    <td>
                        <span class="badge badge-warning">
                            {{ \Carbon\Carbon::parse($rx->expires_at)->format('d M Y') }}
                        </span>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" style="text-align: center; color: #64748b;">No expiring contact lens prescriptions found.</td>
                </tr>
                @endforelse
            </tbody>
        </table>

        <div class="footer">
            Software by Opticina
        </div>
    </div>
</body>
</html>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Contact Lens Prescription - {{ $rx->customer->full_name }}</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; color: #333; line-height: 1.5; }
        .rx-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; }
        .header { margin-bottom: 30px; border-bottom: 2px solid #0891b2; padding-bottom: 20px; }
        .header table { width: 100%; border: none; }
        .header td { border: none; padding: 0; vertical-align: top; }
        .business-name { font-size: 24px; font-weight: bold; color: #0891b2; }
        .customer-info { background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 30px; }
        .section-title { font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background: #f1f5f9; padding: 10px; border: 1px solid #e2e8f0; text-align: center; }
        td { padding: 12px; border: 1px solid #e2e8f0; text-align: center; }
        .notes { margin-top: 20px; padding: 15px; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 4px; }
        .footer { margin-top: 50px; }
        .footer table { width: 100%; border: none; }
        .footer td { border: none; padding: 0; vertical-align: bottom; }
        .signature-box { border-top: 1px solid #333; width: 200px; text-align: center; padding-top: 5px; margin-top: 40px; float: right; }
    </style>
</head>
<body>
    <div class="rx-box">
        <div class="header">
            <table>
                <tr>
                    <td>
                        <div class="business-name">{{ $business->name }}</div>
                        <div>{{ $business->address }}</div>
                        <div>Phone: {{ $business->phone }}</div>
                    </td>
                    <td style="text-align: right;">
                        <h1 style="margin: 0; color: #0891b2;">Contact Lens Prescription</h1>
                        <div>Date: {{ \Carbon\Carbon::parse($rx->prescribed_at)->format('d M Y') }}</div>
                        <div style="color: #ef4444; font-weight: bold;">Expires: {{ \Carbon\Carbon::parse($rx->expires_at)->format('d M Y') }}</div>
                    </td>
                </tr>
            </table>
        </div>

        <div class="customer-info">
            <table style="border: none; margin: 0;">
                <tr style="border: none;">
                    <td style="border: none; text-align: left; padding: 0;">
                        <strong>Patient:</strong> {{ $rx->customer->full_name }}<br>
                        <strong>Phone:</strong> {{ $rx->customer->phone }}
                    </td>
                    <td style="border: none; text-align: right; padding: 0;">
                        <strong>Age/DOB:</strong> {{ $rx->customer->date_of_birth ? \Carbon\Carbon::parse($rx->customer->date_of_birth)->age . ' yrs' : '-' }}
                    </td>
                </tr>
            </table>
        </div>

        <div class="section-title">Prescription Details</div>
        <table>
            <thead>
                <tr>
                    <th>Eye</th>
                    <th>Sphere</th>
                    <th>Cylinder</th>
                    <th>Axis</th>
                    <th>Base Curve</th>
                    <th>Diameter</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Right (OD)</strong></td>
                    <td>{{ $rx->od_sphere > 0 ? '+' . number_format($rx->od_sphere, 2) : number_format($rx->od_sphere, 2) }}</td>
                    <td>{{ $rx->od_cylinder ? ($rx->od_cylinder > 0 ? '+' . number_format($rx->od_cylinder, 2) : number_format($rx->od_cylinder, 2)) : '-' }}</td>
                    <td>{{ $rx->od_axis ? $rx->od_axis . '°' : '-' }}</td>
                    <td>{{ $rx->od_base_curve ?? '-' }}</td>
                    <td>{{ $rx->od_diameter ?? '-' }}</td>
                </tr>
                <tr>
                    <td><strong>Left (OS)</strong></td>
                    <td>{{ $rx->os_sphere > 0 ? '+' . number_format($rx->os_sphere, 2) : number_format($rx->os_sphere, 2) }}</td>
                    <td>{{ $rx->os_cylinder ? ($rx->os_cylinder > 0 ? '+' . number_format($rx->os_cylinder, 2) : number_format($rx->os_cylinder, 2)) : '-' }}</td>
                    <td>{{ $rx->os_axis ? $rx->os_axis . '°' : '-' }}</td>
                    <td>{{ $rx->os_base_curve ?? '-' }}</td>
                    <td>{{ $rx->os_diameter ?? '-' }}</td>
                </tr>
            </tbody>
        </table>

        <div style="margin-top: 20px;">
            <strong>Replacement Schedule:</strong> {{ $rx->replacement_schedule ?? 'Not specified' }}
        </div>

        @if($rx->notes)
        <div class="notes">
            <strong>Notes:</strong><br>
            {{ $rx->notes }}
        </div>
        @endif

        <div class="footer">
            <table>
                <tr>
                    <td>
                        <p>Software by Opticina</p>
                    </td>
                    <td style="text-align: right;">
                        <div class="signature-box">
                            <strong>{{ $rx->prescribedBy->name ?? 'Optometrist' }}</strong><br>
                            Authorized Signature
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</body>
</html>

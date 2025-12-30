<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Inventory Report - {{ now()->format('d M Y') }}</title>
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
        .summary-card { background: #fff7ed; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #ffedd5; }
        .summary-label { color: #9a3412; font-size: 10px; text-transform: uppercase; font-weight: bold; }
        .summary-value { font-size: 16px; font-weight: bold; color: #7c2d12; }
        .footer { margin-top: 50px; text-align: center; color: #94a3b8; font-size: 10px; }
        .badge { padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; }
        .badge-danger { background: #fef2f2; color: #991b1b; }
        .badge-warning { background: #fffbeb; color: #92400e; }
    </style>
</head>
<body>
    <div class="report-box">
        <div class="header">
            <div class="logo">{{ $business->name }}</div>
            <div style="text-align: right;">
                <div class="title">Low Stock Inventory Report</div>
                <div>Generated: {{ now()->format('d M Y H:i') }}</div>
            </div>
        </div>

        <div class="summary-card">
            <div style="display: flex; gap: 40px;">
                <div>
                    <div class="summary-label">Low Stock Frames</div>
                    <div class="summary-value">{{ count($lowStockFrames) }} items</div>
                </div>
                <div>
                    <div class="summary-label">Low Stock Contact Lenses</div>
                    <div class="summary-value">{{ count($lowStockCL) }} items</div>
                </div>
            </div>
        </div>

        <div class="section-title">Low Stock Frames</div>
        <table>
            <thead>
                <tr>
                    <th>Brand & Model</th>
                    <th>SKU</th>
                    <th>Color</th>
                    <th style="text-align: center;">Stock</th>
                </tr>
            </thead>
            <tbody>
                @forelse($lowStockFrames as $frame)
                <tr>
                    <td><strong>{{ $frame->brand }}</strong> {{ $frame->model }}</td>
                    <td>{{ $frame->sku }}</td>
                    <td>{{ $frame->color_name }}</td>
                    <td style="text-align: center;">
                        <span class="badge {{ $frame->quantity == 0 ? 'badge-danger' : 'badge-warning' }}">
                            {{ $frame->quantity }}
                        </span>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" style="text-align: center; color: #64748b;">No low stock frames found.</td>
                </tr>
                @endforelse
            </tbody>
        </table>

        <div class="section-title">Low Stock Contact Lenses</div>
        <table>
            <thead>
                <tr>
                    <th>Brand & Product Line</th>
                    <th>Power / BC</th>
                    <th style="text-align: center;">Boxes</th>
                </tr>
            </thead>
            <tbody>
                @forelse($lowStockCL as $cl)
                <tr>
                    <td><strong>{{ $cl->brand }}</strong> {{ $cl->product_line }}</td>
                    <td>{{ $cl->power }} / {{ $cl->base_curve }}</td>
                    <td style="text-align: center;">
                        <span class="badge {{ $cl->boxes_in_stock <= 2 ? 'badge-danger' : 'badge-warning' }}">
                            {{ $cl->boxes_in_stock }}
                        </span>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="3" style="text-align: center; color: #64748b;">No low stock contact lenses found.</td>
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

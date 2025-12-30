<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; font-size: 12px; color: #333; line-height: 1.4; margin: 0; padding: 0; }
        .invoice-box { padding: 30px; }
        .table-header { width: 100%; margin-bottom: 40px; }
        .logo { font-size: 28px; font-weight: bold; color: #2563eb; }
        .company-info { text-align: right; }
        
        .details-table { width: 100%; margin-bottom: 30px; }
        .details-table td { vertical-align: top; width: 50%; }
        .bill-to h3, .invoice-info h3 { margin-bottom: 5px; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
        
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .items-table th { background: #f8fafc; padding: 12px 10px; border-bottom: 2px solid #e2e8f0; text-align: left; color: #475569; font-weight: bold; }
        .items-table td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; }
        
        .totals-container { float: right; width: 40%; }
        .totals-table { width: 100%; }
        .totals-table td { padding: 5px 0; }
        .totals-table .label { color: #64748b; }
        .totals-table .value { text-align: right; font-weight: 500; }
        .grand-total { border-top: 2px solid #e2e8f0; margin-top: 10px; padding-top: 10px; }
        .grand-total .label { font-weight: bold; font-size: 14px; color: #1e293b; }
        .grand-total .value { font-weight: bold; font-size: 18px; color: #2563eb; text-align: right; }
        
        .footer { margin-top: 60px; text-align: center; color: #94a3b8; font-size: 11px; border-top: 1px solid #f1f5f9; padding-top: 20px; }
        .status-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .status-paid { background: #dcfce7; color: #166534; }
        .status-pending { background: #fef9c3; color: #854d0e; }
        .status-overdue { background: #fee2e2; color: #991b1b; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <table class="table-header">
            <tr>
                <td class="logo">{{ $invoice->business->name }}</td>
                <td class="company-info">
                    <strong>{{ $invoice->branch->name }}</strong><br>
                    {{ $invoice->branch->address }}<br>
                    {{ $invoice->branch->phone }}
                </td>
            </tr>
        </table>

        <table class="details-table">
            <tr>
                <td class="bill-to">
                    <h3>Bill To</h3>
                    <strong>{{ $invoice->customer->first_name }} {{ $invoice->customer->last_name }}</strong><br>
                    {{ $invoice->customer->phone }}<br>
                    {{ $invoice->customer->email }}
                </td>
                <td class="invoice-info" style="text-align: right;">
                    <h3>Invoice Details</h3>
                    <strong>#{{ $invoice->invoice_number }}</strong><br>
                    Date: {{ $invoice->created_at->format('d M Y') }}<br>
                    <div style="margin-top: 5px;">
                        <span class="status-badge status-{{ $invoice->status }}">
                            {{ str_replace('_', ' ', $invoice->status) }}
                        </span>
                    </div>
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                <tr>
                    <td>
                        <div style="font-weight: 500; color: #1e293b;">{{ $item->description }}</div>
                        <div style="font-size: 10px; color: #64748b; margin-top: 2px;">{{ strtoupper($item->item_type) }}</div>
                    </td>
                    <td style="text-align: center;">{{ $item->quantity }}</td>
                    <td style="text-align: right;">{{ $invoice->business->formatCurrency($item->unit_price) }}</td>
                    <td style="text-align: right;">{{ $invoice->business->formatCurrency($item->total) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals-container">
            <table class="totals-table">
                <tr>
                    <td class="label">Subtotal</td>
                    <td class="value">{{ $invoice->business->formatCurrency($invoice->subtotal) }}</td>
                </tr>
                @if($invoice->discount_amount > 0)
                <tr>
                    <td class="label" style="color: #dc2626;">Discount</td>
                    <td class="value" style="color: #dc2626;">-{{ $invoice->business->formatCurrency($invoice->discount_amount) }}</td>
                </tr>
                @endif
                <tr class="grand-total">
                    <td class="label">Total Amount</td>
                    <td class="value">{{ $invoice->business->formatCurrency($invoice->total) }}</td>
                </tr>
                <tr>
                    <td class="label">Amount Paid</td>
                    <td class="value">{{ $invoice->business->formatCurrency($invoice->amount_paid) }}</td>
                </tr>
                <tr>
                    <td class="label" style="font-weight: bold; color: #1e293b;">Balance Due</td>
                    <td class="value" style="font-weight: bold; color: #dc2626;">{{ $invoice->business->formatCurrency($invoice->balance_due) }}</td>
                </tr>
            </table>
        </div>

        <div style="clear: both;"></div>

        <div class="footer">
            <strong>Thank you for your business!</strong><br>
            Please keep this invoice for your records and warranty claims.<br>
            Generated on {{ now()->format('d M Y H:i') }}
        </div>
    </div>
</body>
</html>

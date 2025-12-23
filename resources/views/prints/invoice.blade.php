<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; line-height: 1.5; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .company-info { text-align: right; }
        .details { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .bill-to h3 { margin-bottom: 5px; color: #666; font-size: 10px; text-transform: uppercase; }
        .invoice-info h3 { margin-bottom: 5px; color: #666; font-size: 10px; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #f8fafc; padding: 10px; border-bottom: 2px solid #e2e8f0; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
        .totals { float: right; width: 250px; }
        .totals div { display: flex; justify-content: space-between; padding: 5px 0; }
        .grand-total { font-weight: bold; font-size: 16px; border-top: 2px solid #e2e8f0; margin-top: 10px; padding-top: 10px; color: #2563eb; }
        .footer { margin-top: 100px; text-align: center; color: #94a3b8; font-size: 10px; }
    </style>
</head>
<body>
    <div className="invoice-box">
        <div className="header">
            <div className="logo">{{ $invoice->business->name }}</div>
            <div className="company-info">
                <strong>{{ $invoice->branch->name }}</strong><br>
                {{ $invoice->branch->address }}<br>
                {{ $invoice->branch->phone }}
            </div>
        </div>

        <div className="details">
            <div className="bill-to">
                <h3>Bill To</h3>
                <strong>{{ $invoice->customer->first_name }} {{ $invoice->customer->last_name }}</strong><br>
                {{ $invoice->customer->phone }}<br>
                {{ $invoice->customer->email }}
            </div>
            <div className="invoice-info">
                <h3>Invoice Details</h3>
                <strong>#{{ $invoice->invoice_number }}</strong><br>
                Date: {{ $invoice->created_at->format('d M Y') }}<br>
                Status: {{ strtoupper(str_replace('_', ' ', $invoice->status)) }}
            </div>
        </div>

        <table>
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
                        {{ $item->description }}<br>
                        <small style="color: #666;">{{ strtoupper($item->item_type) }}</small>
                    </td>
                    <td style="text-align: center;">{{ $item->quantity }}</td>
                    <td style="text-align: right;">${{ number_format($item->unit_price, 2) }}</td>
                    <td style="text-align: right;">${{ number_format($item->total, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div className="totals">
            <div>
                <span>Subtotal</span>
                <span>${{ number_format($invoice->subtotal, 2) }}</span>
            </div>
            @if($invoice->discount_amount > 0)
            <div style="color: #dc2626;">
                <span>Discount</span>
                <span>-${{ number_format($invoice->discount_amount, 2) }}</span>
            </div>
            @endif
            <div className="grand-total">
                <span>Total Amount</span>
                <span>${{ number_format($invoice->total, 2) }}</span>
            </div>
            <div>
                <span>Amount Paid</span>
                <span>${{ number_format($invoice->amount_paid, 2) }}</span>
            </div>
            <div style="font-weight: bold;">
                <span>Balance Due</span>
                <span>${{ number_format($invoice->balance_due, 2) }}</span>
            </div>
        </div>

        <div style="clear: both;"></div>

        <div className="footer">
            Thank you for your business!<br>
            Please keep this invoice for your records and warranty claims.
        </div>
    </div>
</body>
</html>

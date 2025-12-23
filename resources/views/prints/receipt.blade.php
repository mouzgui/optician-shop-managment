<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Receipt {{ $invoice->invoice_number }}</title>
    <style>
        @page { margin: 0; }
        body { 
            font-family: 'Courier New', Courier, monospace; 
            font-size: 12px; 
            width: 80mm; 
            margin: 0; 
            padding: 10px;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .divider { border-top: 1px dashed #000; margin: 10px 0; }
        .bold { font-weight: bold; }
        table { width: 100%; }
        .footer { margin-top: 20px; font-size: 10px; }
    </style>
</head>
<body>
    <div className="text-center">
        <div className="bold" style="font-size: 16px;">{{ $invoice->business->name }}</div>
        <div>{{ $invoice->branch->name }}</div>
        <div>{{ $invoice->branch->phone }}</div>
    </div>

    <div className="divider"></div>

    <div>
        Date: {{ $invoice->created_at->format('d/m/Y H:i') }}<br>
        Inv: {{ $invoice->invoice_number }}<br>
        Cust: {{ $invoice->customer->last_name }}, {{ substr($invoice->customer->first_name, 0, 1) }}.
    </div>

    <div className="divider"></div>

    <table>
        @foreach($invoice->items as $item)
        <tr>
            <td colspan="2">{{ $item->description }}</td>
        </tr>
        <tr>
            <td>{{ $item->quantity }} x {{ number_format($item->unit_price, 2) }}</td>
            <td className="text-right">${{ number_format($item->total, 2) }}</td>
        </tr>
        @endforeach
    </table>

    <div className="divider"></div>

    <table>
        <tr>
            <td>SUBTOTAL</td>
            <td className="text-right">${{ number_format($invoice->subtotal, 2) }}</td>
        </tr>
        @if($invoice->discount_amount > 0)
        <tr>
            <td>DISCOUNT</td>
            <td className="text-right">-${{ number_format($invoice->discount_amount, 2) }}</td>
        </tr>
        @endif
        <tr className="bold">
            <td style="font-size: 14px;">TOTAL</td>
            <td className="text-right" style="font-size: 14px;">${{ number_format($invoice->total, 2) }}</td>
        </tr>
    </table>

    <div className="divider"></div>

    <table>
        <tr>
            <td>PAID</td>
            <td className="text-right">${{ number_format($invoice->amount_paid, 2) }}</td>
        </tr>
        <tr className="bold">
            <td>BALANCE</td>
            <td className="text-right">${{ number_format($invoice->balance_due, 2) }}</td>
        </tr>
    </table>

    <div className="divider"></div>

    <div className="text-center footer">
        Thank you for your visit!<br>
        Software by Opticina
    </div>
</body>
</html>

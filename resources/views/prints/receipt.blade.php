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
    <div class="text-center">
        <div class="bold" style="font-size: 16px;">{{ $invoice->business->name }}</div>
        <div>{{ $invoice->branch->name }}</div>
        <div>{{ $invoice->branch->phone }}</div>
    </div>

    <div class="divider"></div>

    <div>
        Date: {{ $invoice->created_at->format('d/m/Y H:i') }}<br>
        Inv: {{ $invoice->invoice_number }}<br>
        Cust: {{ $invoice->customer->last_name }}, {{ substr($invoice->customer->first_name, 0, 1) }}.
    </div>

    <div class="divider"></div>

    <table>
        @foreach($invoice->items as $item)
        <tr>
            <td colspan="2">{{ $item->description }}</td>
        </tr>
        <tr>
            <td>{{ $item->quantity }} x {{ $invoice->business->formatCurrency($item->unit_price) }}</td>
            <td class="text-right">{{ $invoice->business->formatCurrency($item->total) }}</td>
        </tr>
        @endforeach
    </table>

    <div class="divider"></div>

    <table>
        <tr>
            <td>SUBTOTAL</td>
            <td class="text-right">{{ $invoice->business->formatCurrency($invoice->subtotal) }}</td>
        </tr>
        @if($invoice->discount_amount > 0)
        <tr>
            <td>DISCOUNT</td>
            <td class="text-right">-{{ $invoice->business->formatCurrency($invoice->discount_amount) }}</td>
        </tr>
        @endif
        <tr class="bold">
            <td style="font-size: 14px;">TOTAL</td>
            <td class="text-right" style="font-size: 14px;">{{ $invoice->business->formatCurrency($invoice->total) }}</td>
        </tr>
    </table>

    <div class="divider"></div>

    <table>
        <tr>
            <td>PAID</td>
            <td class="text-right">{{ $invoice->business->formatCurrency($invoice->amount_paid) }}</td>
        </tr>
        <tr class="bold">
            <td>BALANCE</td>
            <td class="text-right">{{ $invoice->business->formatCurrency($invoice->balance_due) }}</td>
        </tr>
    </table>

    <div class="divider"></div>

    <div class="text-center footer">
        Thank you for your visit!<br>
        Software by Opticina
    </div>
</body>
</html>

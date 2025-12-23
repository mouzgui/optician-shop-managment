<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Job Card {{ $jobCard->job_number }}</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; color: #000; line-height: 1.4; }
        .box { border: 2px solid #000; padding: 20px; margin: auto; max-width: 800px; }
        .header { text-align: center; border-bottom: 2px solid #000; margin-bottom: 20px; padding-bottom: 10px; }
        .job-number { font-size: 24px; font-weight: bold; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .section-title { font-weight: bold; text-decoration: underline; margin-bottom: 10px; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; }
        table, th, td { border: 1px solid #000; }
        th, td { padding: 8px; text-align: left; }
        .rx-table th { background: #eee; }
        .no-prices { background: #000; color: #fff; padding: 5px; text-align: center; font-weight: bold; margin-top: 20px; }
        .instructions { border: 1px solid #000; padding: 10px; min-height: 60px; margin-top: 10px; }
    </style>
</head>
<body>
    <div className="box">
        <div className="header">
            <div className="job-number">JOB CARD: {{ $jobCard->job_number }}</div>
            <div>Invoice: {{ $jobCard->invoice->invoice_number }} | Date: {{ $jobCard->created_at->format('d/m/Y') }}</div>
        </div>

        <div className="grid">
            <div>
                <div className="section-title">Customer Info</div>
                <strong>{{ $jobCard->invoice->customer->first_name }} {{ $jobCard->invoice->customer->last_name }}</strong><br>
                Ref: {{ $jobCard->invoice->customer->id }}
            </div>
            <div style="text-align: right;">
                <div className="section-title">Branch</div>
                {{ $jobCard->invoice->branch->name }}
            </div>
        </div>

        <div className="section-title">Prescription (Rx)</div>
        <table className="rx-table">
            <thead>
                <tr>
                    <th>EYE</th>
                    <th>SPH</th>
                    <th>CYL</th>
                    <th>AXIS</th>
                    <th>ADD</th>
                    <th>PRISM</th>
                </tr>
            </thead>
            <tbody>
                @php $rx = $jobCard->prescription_details; @endphp
                <tr>
                    <td><strong>R (OD)</strong></td>
                    <td>{{ $rx['right_sphere'] ?? '-' }}</td>
                    <td>{{ $rx['right_cylinder'] ?? '-' }}</td>
                    <td>{{ $rx['right_axis'] ?? '-' }}</td>
                    <td>{{ $rx['right_add'] ?? '-' }}</td>
                    <td>{{ $rx['right_prism'] ?? '-' }}</td>
                </tr>
                <tr>
                    <td><strong>L (OS)</strong></td>
                    <td>{{ $rx['left_sphere'] ?? '-' }}</td>
                    <td>{{ $rx['left_cylinder'] ?? '-' }}</td>
                    <td>{{ $rx['left_axis'] ?? '-' }}</td>
                    <td>{{ $rx['left_add'] ?? '-' }}</td>
                    <td>{{ $rx['left_prism'] ?? '-' }}</td>
                </tr>
            </tbody>
        </table>

        <div style="margin-top: 20px;" className="grid">
            <div>
                <div className="section-title">Frame Details</div>
                @php $frame = $jobCard->frame_details; @endphp
                @if($frame)
                    <strong>Brand:</strong> {{ $frame['brand'] }}<br>
                    <strong>Model:</strong> {{ $frame['model'] }}<br>
                    <strong>Color:</strong> {{ $frame['color_name'] }} ({{ $frame['color_code'] }})<br>
                    <strong>Size:</strong> {{ $frame['size_eye'] }}-{{ $frame['size_bridge'] }}-{{ $frame['size_temple'] }}
                @else
                    <em>Customer's Own Frame</em>
                @endif
            </div>
            <div>
                <div className="section-title">Lens Details</div>
                @php $lens = $jobCard->lens_details; @endphp
                @if($lens)
                    <strong>Type:</strong> {{ strtoupper($lens['type'] ?? 'N/A') }}<br>
                    <strong>Index:</strong> {{ $lens['index'] ?? 'N/A' }}<br>
                    <strong>Coatings:</strong> {{ is_array($lens['coatings']) ? implode(', ', $lens['coatings']) : ($lens['coatings'] ?? 'None') }}
                @endif
            </div>
        </div>

        <div className="section-title">Special Instructions</div>
        <div className="instructions">
            {{ $jobCard->special_instructions ?? 'No special instructions provided.' }}
        </div>

        <div className="no-prices">
            TECHNICAL DOCUMENT - DO NOT SHOW PRICES TO LAB
        </div>

        <div style="margin-top: 30px;" className="grid">
            <div style="border-top: 1px solid #000; padding-top: 5px;">Technician Signature</div>
            <div style="border-top: 1px solid #000; padding-top: 5px; text-align: right;">Quality Check Signature</div>
        </div>
    </div>
</body>
</html>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Job Card - {{ $jobCard->job_number }}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 14px;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .job-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .job-info div {
            flex: 1;
        }
        .section-title {
            background: #f4f4f4;
            padding: 5px 10px;
            font-weight: bold;
            text-transform: uppercase;
            border-left: 4px solid #333;
            margin: 20px 0 10px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table, th, td {
            border: 1px solid #ccc;
        }
        th, td {
            padding: 10px;
            text-align: center;
        }
        th {
            background-color: #f9f9f9;
        }
        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        .details-box {
            border: 1px solid #ccc;
            padding: 15px;
            border-radius: 5px;
        }
        .details-box h3 {
            margin-top: 0;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        .label {
            color: #666;
            font-size: 12px;
            display: block;
        }
        .value {
            font-weight: bold;
            font-size: 15px;
        }
        .instructions {
            background: #fff8e1;
            border: 1px solid #ffe082;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #999;
            border-top: 1px solid #eee;
            padding-top: 10px;
        }
        @media print {
            .no-print {
                display: none;
            }
            body {
                padding: 0;
            }
        }
        .critical-note {
            color: #d32f2f;
            font-weight: bold;
            text-align: center;
            margin: 10px 0;
            border: 1px dashed #d32f2f;
            padding: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>LAB JOB CARD</h1>
        <div>{{ $business->name }} - {{ $jobCard->invoice->branch->name }}</div>
    </div>

    <div class="job-info">
        <div>
            <span class="label">JOB NUMBER</span>
            <span class="value">{{ $jobCard->job_number }}</span>
        </div>
        <div style="text-align: center;">
            <span class="label">DATE CREATED</span>
            <span class="value">{{ $jobCard->created_at->format('d M Y H:i') }}</span>
        </div>
        <div style="text-align: right;">
            <span class="label">CUSTOMER</span>
            <span class="value">{{ $jobCard->invoice->customer->full_name }}</span>
        </div>
    </div>

    <div class="critical-note">
        TECHNICAL SPECIFICATIONS ONLY - NO PRICING INFORMATION
    </div>

    <div class="section-title">Prescription Details</div>
    @php $rx = $jobCard->prescription_details; @endphp
    <table>
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

    <div class="details-grid">
        <div class="details-box">
            <h3>Frame Details</h3>
            @php $frame = $jobCard->frame_details; @endphp
            @if($frame)
                <div style="margin-bottom: 10px;">
                    <span class="label">BRAND / MODEL</span>
                    <span class="value">{{ $frame['brand'] }} - {{ $frame['model'] }}</span>
                </div>
                <div style="margin-bottom: 10px;">
                    <span class="label">COLOR</span>
                    <span class="value">{{ $frame['color_name'] }} ({{ $frame['color_code'] }})</span>
                </div>
                <div>
                    <span class="label">SIZE</span>
                    <span class="value">{{ $frame['size_eye'] }}-{{ $frame['size_bridge'] }}-{{ $frame['size_temple'] }}</span>
                </div>
            @else
                <div style="text-align: center; padding: 20px; color: #999;">
                    CUSTOMER'S OWN FRAME
                </div>
            @endif
        </div>

        <div class="details-box">
            <h3>Lens Details</h3>
            @php $lens = $jobCard->lens_details; @endphp
            @if($lens)
                <div style="margin-bottom: 10px;">
                    <span class="label">LENS TYPE</span>
                    <span class="value">{{ ucfirst($lens['type'] ?? 'N/A') }}</span>
                </div>
                <div style="margin-bottom: 10px;">
                    <span class="label">INDEX</span>
                    <span class="value">{{ $lens['index'] ?? 'N/A' }}</span>
                </div>
                <div>
                    <span class="label">COATINGS</span>
                    <span class="value">
                        @if(isset($lens['coatings']))
                            {{ is_array($lens['coatings']) ? implode(', ', $lens['coatings']) : $lens['coatings'] }}
                        @else
                            None
                        @endif
                    </span>
                </div>
            @else
                <div style="text-align: center; padding: 20px; color: #999;">
                    NO LENS DATA
                </div>
            @endif
        </div>
    </div>

    @if($jobCard->special_instructions)
        <div class="section-title">Special Instructions</div>
        <div class="instructions">
            {{ $jobCard->special_instructions }}
        </div>
    @endif

    <div class="footer">
        Job Card generated by {{ config('app.name') }} on {{ now()->format('Y-m-d H:i') }}
    </div>
</body>
</html>

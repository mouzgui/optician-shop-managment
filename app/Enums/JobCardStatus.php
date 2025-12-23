<?php

namespace App\Enums;

enum JobCardStatus: string
{
    case PENDING = 'pending';
    case IN_PROGRESS = 'in_progress';
    case QUALITY_CHECK = 'quality_check';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
}

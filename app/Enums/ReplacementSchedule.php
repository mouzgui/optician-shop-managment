<?php

namespace App\Enums;

enum ReplacementSchedule: string
{
    case DAILY = 'daily';
    case BI_WEEKLY = 'bi_weekly';
    case MONTHLY = 'monthly';
    case QUARTERLY = 'quarterly';
    case YEARLY = 'yearly';
}

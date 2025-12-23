<?php

namespace App\Enums;

enum InvoiceStatus: string
{
    case DEPOSIT_PAID = 'deposit_paid';
    case IN_LAB = 'in_lab';
    case READY_PICKUP = 'ready_pickup';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';

    public function color(): string
    {
        return match($this) {
            self::DEPOSIT_PAID => 'warning',
            self::IN_LAB => 'info',
            self::READY_PICKUP => 'success',
            self::COMPLETED => 'success',
            self::CANCELLED => 'error',
        };
    }
}

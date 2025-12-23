<?php

namespace App\Enums;

enum JobCardStatus: string
{
    case PENDING = 'pending';
    case SENT_TO_LAB = 'sent_to_lab';
    case RECEIVED_FROM_LAB = 'received_from_lab';
    case READY = 'ready';
    case DELIVERED = 'delivered';
    case CANCELLED = 'cancelled';
}

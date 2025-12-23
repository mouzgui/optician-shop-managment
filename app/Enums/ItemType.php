<?php

namespace App\Enums;

enum ItemType: string
{
    case FRAME = 'frame';
    case LENS = 'lens';
    case CONTACT_LENS = 'contact_lens';
    case ACCESSORY = 'accessory';
    case SOLUTION = 'solution';
}

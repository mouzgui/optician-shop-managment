<?php

namespace App\Enums;

enum LensType: string
{
    case SINGLE_VISION = 'single_vision';
    case BIFOCAL = 'bifocal';
    case PROGRESSIVE = 'progressive';
    case OFFICE = 'office';
    case PHOTOCHROMIC = 'photochromic';
    case POLARIZED = 'polarized';
}

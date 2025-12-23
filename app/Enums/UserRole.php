<?php

namespace App\Enums;

enum UserRole: string
{
    case SUPER_ADMIN = 'super_admin';
    case BUSINESS_OWNER = 'business_owner';
    case OPTOMETRIST = 'optometrist';
    case SALES_STAFF = 'sales_staff';
    case LAB_TECHNICIAN = 'lab_technician';

    public function label(): string
    {
        return match($this) {
            self::SUPER_ADMIN => 'Super Admin',
            self::BUSINESS_OWNER => 'Business Owner',
            self::OPTOMETRIST => 'Optometrist',
            self::SALES_STAFF => 'Sales Staff',
            self::LAB_TECHNICIAN => 'Lab Technician',
        };
    }
}

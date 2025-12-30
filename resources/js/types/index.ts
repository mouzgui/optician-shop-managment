// Job Card Types
export interface JobCard {
    id: number;
    job_number: string;
    status: string;
    priority: string;
    customer_name: string;
    branch_name: string;
    due_date: string;
    created_at: string;
    updated_at: string;
    notes?: string;
    items?: JobCardItem[];
    invoice?: Invoice & { customer?: Customer };
    prescription_details?: any;
    frame_details?: any;
    lens_details?: any;
    special_instructions?: string;
    started_at?: string;
    completed_at?: string;
    completed_by?: number;
}

export interface JobCardItem {
    id: number;
    job_card_id: number;
    product_type: string;
    product_name: string;
    quantity: number;
    status: string;
}

// Status mapping helper
export type JobCardStatus = 'pending' | 'in_progress' | 'completed' | 'delivered' | 'cancelled';
export type JobCardPriority = 'low' | 'normal' | 'high' | 'urgent';

// Common pagination interface
export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

// User and Auth types
export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    business_id?: number;
    branch_id?: number;
}

// Customer types
export interface Customer {
    id: number;
    name: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    created_at: string;
}

// Product types
export interface Frame {
    id: number;
    name: string;
    brand: string;
    model: string;
    color: string;
    size: string;
    price: number;
    cost: number;
    stock: number;
}

export interface Lens {
    id: number;
    name: string;
    type: string;
    material: string;
    coating: string;
    price: number;
    cost: number;
    stock: number;
}

export interface ContactLens {
    id: number;
    name: string;
    brand: string;
    type: string;
    power: string;
    bc: string;
    dia: string;
    price: number;
    cost: number;
    stock: number;
}

// Invoice types
export interface Invoice {
    id: number;
    invoice_number: string;
    customer_id: number;
    customer_name?: string;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    paid: number;
    balance: number;
    status: string;
    created_at: string;
}

// Staff types
export interface Staff {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: string;
    branch_id?: number;
    branch_name?: string;
    is_active: boolean;
}

// Branch types
export interface Branch {
    id: number;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    is_active: boolean;
    is_main: boolean;
}

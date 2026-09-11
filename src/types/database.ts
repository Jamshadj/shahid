export type ThermalPrinterWidth = '58mm' | '80mm';
export type PaymentMode = 'cash' | 'upi' | 'card' | 'due';
export type PaymentStatus = 'paid' | 'unpaid';

export interface StoreSettings {
  id: string;
  restaurant_name: string;
  phone_number: string | null;
  address: string | null;
  tax_rate_percent: number;
  tax_number_gst: string | null;
  currency_symbol: string;
  thermal_printer_width: ThermalPrinterWidth;
  staff_access_code?: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  display_order: number;
  created_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
}

export interface Bill {
  id: string;
  bill_number: number;
  customer_name: string | null;
  customer_phone: string | null;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  grand_total: number;
  payment_mode: PaymentMode;
  payment_status: PaymentStatus;
  created_at: string;
}

export interface BillItem {
  id: string;
  bill_id: string;
  item_id: string | null;
  item_name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customPrice?: number;
}

export interface BillWithItems extends Bill {
  bill_items: BillItem[];
}

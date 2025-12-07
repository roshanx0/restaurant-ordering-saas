import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types
export interface RegistrationRequest {
  id: string;
  restaurant_name: string;
  owner_name: string;
  phone: string;
  email?: string;
  city: string;
  address?: string;
  restaurant_type: string;
  heard_from?: string;
  notes?: string;
  status: "pending" | "contacted" | "verified" | "rejected";
  contacted_at?: string;
  rejection_reason?: string;
  internal_notes?: string;
  created_at: string;
}

export interface Restaurant {
  id: string;
  registration_request_id?: string;
  name: string;
  slug: string;
  owner_name?: string;
  phone: string;
  email: string;
  city?: string;
  address?: string;
  restaurant_type?: string;
  logo_url?: string;
  qr_code_url?: string;
  subscription_plan: "free_trial" | "starter" | "pro" | "enterprise";
  status: "active" | "blocked" | "trial";
  is_active: boolean;
  internal_notes?: string;
  block_reason?: string;
  trial_ends_at?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  restaurant_id?: string;
  email: string;
  password_hash: string;
  temp_password: boolean;
  role: "owner" | "staff";
  created_at: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  base_price: number;
  category?: string;
  image_url?: string;
  is_available: boolean;
  sizes?: { name: string; price: number }[];
  addons?: { name: string; price: number }[];
  created_at: string;
}

export interface Order {
  id: string;
  restaurant_id: string;
  order_number: string;
  order_type: "qr" | "counter" | "phone" | "table";
  table_number?: string;
  customer_name?: string;
  customer_phone?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount?: number;
  total: number;
  status:
    | "pending"
    | "accepted"
    | "preparing"
    | "ready"
    | "completed"
    | "cancelled"
    | "rejected";
  payment_method?: string;
  payment_status?: string;
  payment_transaction_id?: string;
  customer_notes?: string;
  internal_notes?: string;
  accepted_at?: string;
  preparing_at?: string;
  ready_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  base_price: number;
  selected_size?: { name: string; price: number };
  selected_addons?: { name: string; price: number }[];
  item_total: number;
  special_instructions?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  name?: string;
  created_at: string;
}

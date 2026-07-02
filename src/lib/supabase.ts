import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipo de Datos para TypeScript
export interface Store {
  id: string;
  user_id?: string;
  name: string;
  slug: string;
  whatsapp_number: string;
  logo_url?: string;
  banner_text?: string;
  theme_color: string;
  font_family?: 'modern' | 'elegant' | 'playful';
  template_id?: string;
  subscription_status: 'pending' | 'active';
  created_at?: string;
}

export interface Product {
  id: string;
  store_id: string;
  title: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  created_at?: string;
}

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

export interface OrderMovement {
  id: string;
  store_id: string;
  customer_name: string;
  phone?: string;
  address?: string;
  date_val?: string;
  time_val?: string;
  notes?: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'delivered';
  payment_status: 'unpaid' | 'paid' | 'partial';
  created_at: string;
}


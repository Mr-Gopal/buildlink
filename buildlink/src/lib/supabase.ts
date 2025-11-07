import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  role: 'buyer' | 'seller';
  phone?: string;
  profile_image_url?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  verified: boolean;
  created_at: string;
  updated_at: string;
};

export type Product = {
  reviews: any;
  id: string;
  seller_id: string;
  category: string;
  subcategory?: string;
  name: string;
  description?: string;
  price: number;
  unit: string;
  image_url?: string;
  available: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
  seller?: Profile;
};

export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  user?: Profile;
};

export type Wishlist = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
};

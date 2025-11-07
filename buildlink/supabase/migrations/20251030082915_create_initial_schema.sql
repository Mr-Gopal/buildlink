/*
  # Create Initial Database Schema for Construction Materials Marketplace

  ## Overview
  This migration sets up the complete database structure for a marketplace connecting 
  buyers with sellers of construction materials and furniture.

  ## New Tables

  ### 1. `profiles`
  User profiles extending Supabase auth.users
  - `id` (uuid, primary key) - Links to auth.users
  - `full_name` (text) - User's full name
  - `role` (text) - Either 'buyer' or 'seller'
  - `phone` (text) - Contact phone number
  - `profile_image_url` (text) - Profile picture URL
  - `address` (text) - Physical address
  - `latitude` (decimal) - Location latitude
  - `longitude` (decimal) - Location longitude
  - `verified` (boolean) - Seller verification status
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `products`
  Product listings for both raw materials and furniture
  - `id` (uuid, primary key) - Unique product identifier
  - `seller_id` (uuid) - Links to profiles table
  - `category` (text) - Product category (cement, sand, iron_rods, pop, bed, table, lamp, wardrobe, etc.)
  - `subcategory` (text) - Additional categorization
  - `name` (text) - Product name
  - `description` (text) - Detailed description
  - `price` (decimal) - Product price
  - `unit` (text) - Unit of measurement (bag, ton, piece, etc.)
  - `image_url` (text) - Primary product image
  - `available` (boolean) - Availability status
  - `stock_quantity` (integer) - Current stock level
  - `created_at` (timestamptz) - Listing creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `reviews`
  Customer reviews and ratings for products
  - `id` (uuid, primary key) - Unique review identifier
  - `product_id` (uuid) - Links to products table
  - `user_id` (uuid) - Links to profiles table
  - `rating` (integer) - Rating from 1-5
  - `comment` (text) - Review text
  - `created_at` (timestamptz) - Review creation timestamp

  ### 4. `wishlists`
  Buyer wishlist functionality
  - `id` (uuid, primary key) - Unique wishlist entry identifier
  - `user_id` (uuid) - Links to profiles table
  - `product_id` (uuid) - Links to products table
  - `created_at` (timestamptz) - Added to wishlist timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Profiles: Users can read all profiles but only update their own
  - Products: Anyone can read, only sellers can create/update their own
  - Reviews: Anyone can read, authenticated users can create, only own reviews can be updated/deleted
  - Wishlists: Users can only access their own wishlist items

  ## Important Notes
  1. All tables use UUIDs for better scalability and security
  2. Timestamps use timestamptz for timezone awareness
  3. Location data stored as latitude/longitude for Google Maps integration
  4. RLS policies ensure data security and proper access control
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('buyer', 'seller')),
  phone text,
  profile_image_url text,
  address text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category text NOT NULL,
  subcategory text,
  name text NOT NULL,
  description text,
  price decimal(10, 2) NOT NULL,
  unit text NOT NULL DEFAULT 'piece',
  image_url text,
  available boolean DEFAULT true,
  stock_quantity integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, user_id)
);

-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(latitude, longitude);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for products
CREATE POLICY "Anyone can view available products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sellers can insert their own products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = seller_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'seller')
  );

CREATE POLICY "Sellers can update their own products"
  ON products FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own products"
  ON products FOR DELETE
  TO authenticated
  USING (auth.uid() = seller_id);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for wishlists
CREATE POLICY "Users can view their own wishlist"
  ON wishlists FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own wishlist"
  ON wishlists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own wishlist"
  ON wishlists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
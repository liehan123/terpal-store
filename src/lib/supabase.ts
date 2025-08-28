import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface User {
  id: string
  email: string
  role: 'customer' | 'admin'
  full_name?: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  material: 'PE' | 'PVC' | 'Canvas'
  sizes: string[]
  thickness: string
  colors: string[]
  brand: string
  usage: 'industrial' | 'household' | 'construction'
  stock_quantity: number
  images: string[]
  specifications: Record<string, any>
  created_at: string
}

export interface CartItem {
  id: string
  product_id: string
  user_id: string
  quantity: number
  size?: string
  color?: string
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address: Record<string, any>
  payment_method: string
  created_at: string
}

export interface Address {
  id: string
  user_id: string
  label: string
  full_name: string
  phone: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
  created_at: string
}

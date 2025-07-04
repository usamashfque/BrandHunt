export interface Product {
  id: string
  name: string
  description: string
  price: number
  discount_price: number
  image_url: string
  website_url: string
  category: string
  brand_id: string
  created_at: string
  updated_at: string
}

export interface Products {
  id: string
  name: string
  description: string
  price: number
  discount_price: number
  image_url: string
  website_url: string
  category: string
  brand_id: string
  brands: Brand
  created_at: string
  updated_at: string
}

export interface Brand {
  id: string
  name: string
  description: string
  city: string
  logo_url: string
  created_at: string
  updated_at: string
}

export interface Brands {
  id: string
  name: string
  description: string
  city: string
  logo_url: string
  user_follows_brand: UserFollowsBrand[]
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  name: string
  phoneNumber: string
  email: string
  role: string
  created_at: string
  updated_at: string
}

export interface UserFollowsBrand {
  id: string
  user_id: string
  brand_id: string
  brands: Brands
  created_at: string
  updated_at: string
}

export interface Notification {
  id: number
  user_id: string
  title: string
  is_read: boolean
  created_at: string
  updated_at: string
}

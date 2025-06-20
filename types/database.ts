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
  logo_url: string
  created_at: string
  updated_at: string
}
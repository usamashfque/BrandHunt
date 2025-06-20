import type { Product, Brand, Products } from "@/types/database"

//#region Product
export async function getProducts(supabase: any) {
  const { data, error } = await supabase.from("products").select("*, brands(name)").order("name")

  if (error) {
    console.error("Error fetching security products:", error)
    return []
  }

  return data as Products[]
}

export async function getProduct(supabase: any, id: string) {
  const { data, error } = await supabase.from("products").select("*, brands(name)")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching security guard:", error)
    return null
  }

  return data as Products
}

export async function createProduct(supabase: any, guard: Omit<Product, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase
    .from("products")
    .insert([{ ...guard, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
    .select()

  if (error) {
    console.error("Error creating security guard:", error)
    return null
  }

  return data[0] as Products
}

export async function updateProduct(supabase: any, id: string, guard: Partial<Product>) {
  const { data, error } = await supabase
    .from("products")
    .update({ ...guard, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating security guard:", error)
    return null
  }

  return data[0] as Products
}

export async function deleteProduct(supabase: any, id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("Error deleting security guard:", error)
    return false
  }

  return true
}
//#endregion

//#region Brands 
export async function getBrands(supabase: any) {
  const { data, error } = await supabase.from("brands").select("*").order("name")

  if (error) {
    console.error("Error fetching security brands:", error)
    return []
  }

  return data as Brand[]
}

export async function createBrand(supabase: any, guard: Omit<Brand, "id" | "created_at" | "updated_at">) {
  console.log(guard)
  const { data, error } = await supabase
    .from("brands")
    .insert([{ ...guard, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
    .select()

  if (error) {
    console.error("Error creating security guard:", error)
    return null
  }

  return data[0] as Brand
}

export async function updateBrand(supabase: any, id: string, guard: Partial<Brand>) {
  const { data, error } = await supabase
    .from("brands")
    .update({ ...guard, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating security guard:", error)
    return null
  }

  return data[0] as Brand
}

export async function deleteBrand(supabase: any, id: string) {
  const { error } = await supabase.from("brands").delete().eq("id", id)

  if (error) {
    console.error("Error deleting security guard:", error)
    return false
  }

  return true
}
//#endregion
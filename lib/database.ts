import type { Product, Brand, Products, User } from "@/types/database"

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
  //user_follows_brand
  const { data, error } = await supabase
    .from("brands")
    .select("*, user_follows_brand!user_follows_brand_brand_id_fkey(*)")
    .order("name")

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


//#region user 
export async function getUsers(supabase: any) {
  //user_follows_brand
  const { data, error } = await supabase
    .from("users")
    .select("*, user_follows_brand!user_follows_brand_user_id_fkey(*)")
    .order("name")

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return data as User[]
}

export async function createUser(supabase: any, guard: Omit<User, "id" | "created_at" | "updated_at">) {
  console.log(guard)
  const { data, error } = await supabase
    .from("users")
    .insert([{ ...guard, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])
    .select()

  if (error) {
    console.error("Error creating guard:", error)
    return null
  }

  return data[0] as User
}

export async function updateUser(supabase: any, id: string, guard: Partial<User>) {
  const { data, error } = await supabase
    .from("users")
    .update({ ...guard, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating user:", error)
    return null
  }

  return data[0] as User
}

export async function deleteUser(supabase: any, id: string) {
  const { error } = await supabase.from("users").delete().eq("id", id)

  if (error) {
    console.error("Error deleting user:", error)
    return false
  }

  return true
}
//#endregion


export async function followBrand(supabase: any, userId: string, brandId: string) {
  const { data, error } = await supabase
    .from("user_follows_brand")
    .insert([{ user_id: userId, brand_id: brandId }])
    .select()

  if (error) {
    console.error("Error following brand:", error)
    throw error
  }
  return data[0]
}

export async function unfollowBrand(supabase: any, userId: string, brandId: string) {
  const { error } = await supabase.from("user_follows_brand").delete().eq("user_id", userId).eq("brand_id", brandId)

  if (error) {
    console.error("Error unfollowing brand:", error)
    throw error
  }
  return true
}

export async function getFollowedBrands(supabase: any, userId: string): Promise<Brand[]> {
  const { data, error } = await supabase
    .from("user_follows_brand")
    .select("brands(*)") // Select the brand details through the join
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching followed brands:", error)
    return []
  }
  // The data will be an array of { brands: Brand } objects, so map it
  return data.map((item: { brands: Brand }) => item.brands)
}
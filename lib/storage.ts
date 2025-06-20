// lib/storage.ts
import { createClient } from "@/utils/supabase/client"
import { v4 as uuidv4 } from "uuid"

export async function uploadFile(file: File, bucket: string, folder: string = "") {
  try {
    const supabase = await createClient()
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (error) {
      throw error
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return {
      path: data.path,
      url: urlData.publicUrl,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

export async function deleteFile(path: string, bucket: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      throw error
    }

    return true
  } catch (error) {
    console.error("Error deleting file:", error)
    throw error
  }
}
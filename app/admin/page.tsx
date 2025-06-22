import { redirect } from "next/navigation"

export default function AdminDashboardPage() {
  redirect("/admin/brands") // Redirect to brands management by default
}
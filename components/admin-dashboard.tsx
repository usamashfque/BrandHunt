"use client"

import { MainSidebar } from "@/components/main-sidebar"
import { DashboardContent } from "@/components/dashboard-content"
import { SidebarInset } from "@/components/ui/sidebar"

export function AdminDashboard() {
  return (
    <div className="flex w-full h-full bg-gray-100">
      <MainSidebar />
      <SidebarInset>
        <DashboardContent />
      </SidebarInset>
    </div>
  )
}

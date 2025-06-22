"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainSidebar } from "@/components/main-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        console.log("AdminLayout useEffect - user:", user, "isLoading:", isLoading)
        if (!isLoading && !user) {
            router.push("/admin/login") // Redirect to login if not authenticated
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return (
            <div className="flex w-full min-h-screen items-center justify-center bg-gray-100">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="ml-3 text-lg text-gray-600">Loading admin panel...</span>
            </div>
        )
    }

    if (!isLoading && !user) {
        return (
            <div className="flex w-full w-full min-h-screen bg-gray-100 dark:bg-gray-900">
                {children}
            </div>

        )
    }

    return (
        <div className="flex w-full min-h-screen bg-gray-100 dark:bg-gray-900">
            <SidebarInset>{children}</SidebarInset>
        </div>
    )
}

"use client"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import {
  BarChart3,
  Users,
  Building2,
  CreditCard,
  FileText,
  Settings,
  MessageSquare,
  LogOut,
  Shield,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function MainSidebar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const menuItems = [
    { name: "Dashboard", icon: BarChart3, path: "/admin" },
    { name: "Brands", icon: Building2, path: "/admin/brands" },
    { name: "Products", icon: Shield, path: "/admin/products" },
    // { name: "Payment History", icon: CreditCard, path: "/payment-history" },
    // { name: "Reports", icon: FileText, path: "/reports" },
    // { name: "Chat", icon: MessageSquare, path: "/chat" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <Sidebar variant="inset" className="p-0 pe-3">
      <SidebarHeader className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span className="text-xl font-bold">Administration</span>
          </div>
          {/* <SidebarTrigger /> */}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton isActive={pathname === item.path} onClick={() => handleNavigation(item.path)}>
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* <ModeToggle /> */}
            <button className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800" onClick={async () => {
              const _result = await signOut()
              router.push("/")
            }}>
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

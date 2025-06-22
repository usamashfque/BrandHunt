"use client"

import Link from "next/link"
import { Building2, UserCircle, LogOut, Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import type { Brand } from "@/types/database"
import { useAuth } from "@/contexts/auth-context"
import { getFollowedBrands } from "@/lib/database"

export function Header() {
  const router = useRouter()
  const supabase = createClient()
  const { user, isLoading, session, signOut } = useAuth()
  const [followedBrands, setFollowedBrands] = useState<Brand[]>([])
  const [isFetchingFollows, setIsFetchingFollows] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut()
      toast({
        title: "Success",
        description: "Logged out successfully!",
      })
      router.push("/login")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const fetchFollowedBrands = async () => {
      if (user && !isFetchingFollows) {
        setIsFetchingFollows(true)
        try {
          const brands = await getFollowedBrands(supabase, user.id)
          setFollowedBrands(brands)
        } catch (error) {
          console.error("Failed to fetch followed brands:", error)
          toast({
            title: "Error",
            description: "Failed to load your followed brands.",
            variant: "destructive",
          })
        } finally {
          setIsFetchingFollows(false)
        }
      }
    }
    fetchFollowedBrands()
  }, [user, isLoading])

  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between z-10">
      <Link href="/" className="flex items-center gap-2 text-lg font-bold text-gray-900">
        <Building2 className="h-6 w-6 text-primary" />
        <span>Brand & Product Showcase</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <Link href="#brands" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
          Brands
        </Link>
        <Link href="#products" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
          Products
        </Link>
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <UserCircle className="h-6 w-6" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">My Profile</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Heart className="mr-2 h-4 w-4" />
                <span>Following Brands</span>
              </DropdownMenuItem>
              {isFetchingFollows ? (
                <DropdownMenuItem disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                </DropdownMenuItem>
              ) : followedBrands.length > 0 ? (
                followedBrands.map((brand) => (
                  <DropdownMenuItem key={brand.id} className="pl-8 text-sm text-gray-600">
                    {brand.name}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled className="pl-8 text-sm text-gray-600">
                  No brands followed yet.
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
        )}
      </nav>
    </header>
  )
}
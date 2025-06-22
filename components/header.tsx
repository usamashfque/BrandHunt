"use client"

import Link from "next/link"
import { Building2, UserCircle, LogOut, Heart, Loader2, Bell } from "lucide-react"
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
import type { Brand, Notification, UserFollowsBrand } from "@/types/database"
import { useAuth } from "@/contexts/auth-context"
import { getFollowedBrands, getNotifications, getUnreadNotificationsCount } from "@/lib/database"
import { formatDistanceToNow } from "date-fns"

export function Header() {
  const router = useRouter()
  const supabase = createClient()
  const { user, isLoading, session, signOut } = useAuth()
  const [followedBrands, setFollowedBrands] = useState<UserFollowsBrand[]>([])
  const [isFetchingFollows, setIsFetchingFollows] = useState(false)
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0)
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([])
  const [isFetchingNotifications, setIsFetchingNotifications] = useState(false)
  const [loading, setLoading] = useState(false) // Declare the loading variable

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
          const _followers = await getFollowedBrands(supabase, user.id)
          setFollowedBrands(_followers)
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


  const fetchNotificationsData = async () => {
    if (user && !isFetchingNotifications) {
      setIsFetchingNotifications(true)
      try {
        const count = await getUnreadNotificationsCount(supabase, user.id)
        setUnreadNotificationsCount(count)
        const recent = await getNotifications(supabase, user.id)
        setRecentNotifications(recent.slice(0, 5)) // Show up to 5 recent notifications
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
        toast({
          title: "Error",
          description: "Failed to load notifications.",
          variant: "destructive",
        })
      } finally {
        setIsFetchingNotifications(false)
      }
    }
  }

  useEffect(() => {
    if (!isLoading && user) {
      fetchNotificationsData()
      // Optionally, set up a real-time listener for notifications if using Supabase Realtime
      // const channel = supabase.channel('public:notifications')
      //   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, payload => {
      //     console.log('New notification!', payload);
      //     fetchNotificationsData(); // Re-fetch notifications on new insert
      //   })
      //   .subscribe();
      // return () => {
      //   supabase.removeChannel(channel);
      // };
    }
  }, [user, isLoading]) // Re-run when user or isLoading changes

  // const handleNotificationClick = async (notificationId: number) => {
  //   try {
  //     await markNotificationAsRead(notificationId)
  //     setUnreadNotificationsCount((prev) => Math.max(0, prev - 1))
  //     setRecentNotifications((prev) =>
  //       prev.map((notif) => (notif.id === notificationId ? { ...notif, is_read: true } : notif)),
  //     )
  //     router.push("/website/notifications") // Redirect to the notifications page
  //   } catch (error) {
  //     console.error("Error marking notification as read:", error)
  //     toast({
  //       title: "Error",
  //       description: "Failed to mark notification as read.",
  //       variant: "destructive",
  //     })
  //   }
  // }


  return (
    <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between z-10">
      <Link href="/website" className="flex items-center gap-2 text-lg font-bold text-gray-900">
        <Building2 className="h-6 w-6 text-primary" />
        <span>Brand & Product Showcase</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <Link href="/website#brands" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
          Brands
        </Link>
        <Link href="/website#products" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
          Products
        </Link>
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
        ) : user ? (
          <>
            {/* Notifications Dropdown */}
            < DropdownMenu >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Bell className="h-5 w-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end" forceMount>
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isFetchingNotifications ? (
                  <DropdownMenuItem disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                  </DropdownMenuItem>
                ) : recentNotifications.length > 0 ? (
                  recentNotifications.map((notif: Notification) => (
                    <DropdownMenuItem
                      key={notif.id}
                      className={`flex flex-col items-start space-y-1 ${!notif.is_read ? "bg-blue-50" : ""}`}
                      onClick={() => { }}
                    >
                      <p className="font-medium">{notif.title}</p>
                      {/* <p className="text-xs text-gray-600 line-clamp-2">{notif.message}</p> */}
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                      </p>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No recent notifications.</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/website/notifications">
                    <Bell className="mr-2 h-4 w-4" />
                    View All Notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Dropdown */}
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
                      {brand?.brands?.name}
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
          </>
        ) : (
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
        )}
      </nav>
    </header >
  )
}
"use client"

import { useState, useEffect } from "react"
import type { Notification } from "@/types/database"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, BellOff, CheckCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns" // You might need to install date-fns: npm install date-fns
import { useAuth } from "@/contexts/auth-context"
import { getNotifications, markNotificationAsRead } from "@/lib/database"
import { createClient } from "@/utils/supabase/client"
import { Header } from "@/components/header"

export default function NotificationsPage() {
    const supabase = createClient()
    const { user, isLoading: authLoading } = useAuth()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isMarkingAllRead, setIsMarkingAllRead] = useState(false)

    const fetchNotifications = async () => {
        if (user) {
            setIsLoading(true)
            try {
                const fetchedNotifications = await getNotifications(supabase, user.id)
                setNotifications(fetchedNotifications)
            } catch (error) {
                console.error("Error fetching notifications:", error)
                toast({
                    title: "Error",
                    description: "Failed to load notifications.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        } else {
            setIsLoading(false) // Not authenticated, no notifications to load
        }
    }

    useEffect(() => {
        if (!authLoading) {
            fetchNotifications()
        }
    }, [user, authLoading])


    if (authLoading) {
        return (
            <div className="w-full flex min-h-screen items-center justify-center bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="ml-3 text-lg text-gray-600">Loading...</span>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="w-full flex min-h-screen items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md text-center p-6">
                    <CardTitle className="mb-4">Access Denied</CardTitle>
                    <p className="text-gray-600">Please log in to view your notifications.</p>
                    <Button className="mt-4" onClick={() => (window.location.href = "/login")}>
                        Go to Login
                    </Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 md:py-16 lg:py-20">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Your Notifications</h1>
                    {/* {notifications.some((n) => !n.is_read) && (
                        <Button variant="outline" onClick={handleMarkAllAsRead} disabled={isMarkingAllRead}>
                            {isMarkingAllRead ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Marking All...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark All as Read
                                </>
                            )}
                        </Button>
                    )} */}
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2 text-lg text-gray-600">Loading notifications...</span>
                    </div>
                ) : notifications.length === 0 ? (
                    <Card className="p-6 text-center">
                        <BellOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <CardTitle className="text-xl mb-2">No Notifications Yet</CardTitle>
                        <p className="text-gray-600">You'll see updates here when new products are added by brands you follow.</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <Card key={notification.id} className={!notification.is_read ? "bg-blue-50 shadow-md" : "bg-white"}>
                                <CardContent className="p-4 flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg">{notification.title}</h3>
                                        {/* <p className="text-gray-700 text-sm mt-1">{notification.message}</p> */}
                                        <p className="text-xs text-gray-500 mt-2">
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                    {/* {!notification.is_read && (
                                        <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                                            <CheckCircle className="h-4 w-4 mr-1" /> Mark as Read
                                        </Button>
                                    )} */}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
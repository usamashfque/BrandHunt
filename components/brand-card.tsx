"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bell, Check } from "lucide-react"
import { useEffect, useState } from "react"
import { Brand } from "@/types/database"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { followBrand, getFollowedBrands, unfollowBrand } from "@/lib/database"
import { createClient } from "@/utils/supabase/client"
import { toast } from "@/hooks/use-toast"

interface BrandCardProps {
    brand: Brand
}

export function BrandCard({ brand }: BrandCardProps) {
    const router = useRouter()
    const supabase = createClient()
    const { user, isLoading: authLoading, session } = useAuth()
    const [isFollowing, setIsFollowing] = useState(false)
    const [isUpdatingFollow, setIsUpdatingFollow] = useState(false)

    useEffect(() => {
        const checkFollowStatus = async () => {
            if (user && !authLoading) {
                try {
                    //const followed = await getFollowedBrands(supabase, user.id)
                    setIsFollowing(brand.user_follows_brand.some((f) => f.user_id === user.id))
                } catch (error) {
                    console.error("Error checking follow status:", error)
                }
            } else if (!user && !authLoading) {
                setIsFollowing(false) // Not logged in, so not following
            }
        }
        checkFollowStatus()
    }, [user, authLoading, brand.id])

    const handleFollowToggle = async () => {
        if (authLoading) return // Prevent action if auth status is still loading

        if (!user) {
            toast({
                title: "Login Required",
                description: "Please log in to follow brands.",
                variant: "default",
            })
            router.push("/login")
            return
        }

        setIsUpdatingFollow(true)
        try {
            if (isFollowing) {
                await unfollowBrand(supabase, user.id, brand.id)
                setIsFollowing(false)
                toast({
                    title: "Unfollowed",
                    description: `You have unfollowed ${brand.name}.`,
                })
            } else {
                await followBrand(supabase, user.id, brand.id)
                setIsFollowing(true)
                toast({
                    title: "Following",
                    description: `You are now following ${brand.name}!`,
                })
            }
            // Optionally, refresh user data or followed brands in header if needed
            // refreshUser();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to update follow status.",
                variant: "destructive",
            })
        } finally {
            setIsUpdatingFollow(false)
        }
    }


    return (
        <Card className="w-full max-w-sm rounded-lg overflow-hidden shadow-md">
            <CardContent className="p-4 flex flex-col items-start">
                <div className="flex items-center w-full mb-4">
                    <div className="relative w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mr-4 flex-shrink-0">
                        <Image
                            src={brand.logo_url || "/placeholder.svg?height=64&width=64"}
                            alt={`${brand.name} logo`}
                            width={64}
                            height={64}
                            className="rounded-full object-cover"
                        />
                    </div>
                    <div className="flex-grow">
                        <div className="flex items-center justify-between w-full">
                            <h3 className="text-lg font-semibold">{brand.name}</h3>
                            {/* {brand.city && (
                                <Badge variant="outline" className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                    {brand.category}
                                </Badge>
                            )} */}
                        </div>
                        {brand.city && (
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {brand.city}
                            </p>
                        )}
                    </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{brand.description}</p>
                <div className="flex items-center justify-between w-full mt-auto">
                    <span className="text-sm text-gray-500">{brand.user_follows_brand?.length ?? 0} followers</span>
                    <Button variant="default" className="bg-black text-white hover:bg-gray-800" onClick={handleFollowToggle}>
                        {isFollowing ? (
                            <>
                                <Check className="h-4 w-4 mr-2" />
                                Following
                            </>
                        ) : (
                            <>
                                <Bell className="h-4 w-4 mr-2" />
                                Follow
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
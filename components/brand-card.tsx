"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bell, Check } from "lucide-react"
import { useState } from "react"
import { Brand } from "@/types/database"

interface BrandCardProps {
    brand: Brand
}

export function BrandCard({ brand }: BrandCardProps) {
    const [isFollowing, setIsFollowing] = useState(false)

    const handleFollowToggle = () => {
        setIsFollowing(!isFollowing)
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
                            {/* {brand.category && (
                                <Badge variant="outline" className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                    {brand.category}
                                </Badge>
                            )} */}
                        </div>
                        {/* {brand.location && (
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {brand.location}
                            </p>
                        )} */}
                    </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{brand.description}</p>
                {/* <div className="flex items-center justify-between w-full mt-auto">
                    <span className="text-sm text-gray-500">{brand.followers?.toLocaleString()} followers</span>
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
                </div> */}
            </CardContent>
        </Card>
    )
}
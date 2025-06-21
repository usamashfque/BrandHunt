"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Bell } from "lucide-react"
import { Product, Products } from "@/types/database"
import { sampleBrands } from "@/lib/data"
import Link from "next/link"


interface ProductCardProps {
    product: Products
}

export function ProductCard({ product }: ProductCardProps) {
    const discountPercentage =
        product.price > 0 ? Math.round(((product.price - product.discount_price) / product.price) * 100) : 0

    const brand = sampleBrands.find((b) => b.id === product.brand_id)

    return (
        <Card className="w-full max-w-sm rounded-lg overflow-hidden shadow-md">
            <CardContent className="p-0">
                <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
                    <Image
                        src={product.image_url || "/placeholder.svg?height=192&width=384"}
                        alt={product.name}
                        width={384}
                        height={192}
                        className="object-cover w-full h-full"
                    />
                    {discountPercentage > 0 && (
                        <Badge className="absolute top-3 right-3 bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded">
                            {discountPercentage}% OFF
                        </Badge>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-gray-600">{product?.brands?.name || "Unknown Brand"}</p>
                        {/* <div className="flex items-center text-gray-500 text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            <span>{product.views || 0}</span>
                        </div> */}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-lg font-bold">
                            Rs. {product.discount_price.toFixed(2)}
                            {product.price > product.discount_price && (
                                <span className="ml-2 text-sm text-gray-500 line-through">Rs. {product.price.toFixed(2)}</span>
                            )}
                        </div>
                        {product.category && (
                            <Badge variant="outline" className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                {product.category}
                            </Badge>
                        )}
                    </div>

                    <Button variant="default" className="w-full bg-black text-white hover:bg-gray-800 p-0 flex items-center justify-center">
                        <Link href={product.website_url} target="_blank" className="w-full h-full pt-3">
                            Explore more
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
"use client"

import { useState, useEffect } from "react"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Brand, Product, Products } from "@/types/database"
import { getBrandsData, getProductsData, sampleBrands } from "@/lib/data"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProductCard } from "@/components/product-card"
import { BrandCard } from "@/components/brand-card"
import { Footer } from "@/components/footer"
import { getBrands, getProducts } from "@/lib/database"
import { createClient } from "@/utils/supabase/client"


export default function WebsitePage() {
  const supabase = createClient()
  const [brands, setBrands] = useState<Brand[]>([])
  const [products, setProducts] = useState<Products[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const fetchedProducts = await getProducts(supabase)
      // const fetchedProducts = await getProductsData()

      const fetchedBrands = await getBrands(supabase)
      // const fetchedBrands = await getBrandsData()
      setBrands(fetchedBrands)
      setProducts(fetchedProducts)
      setLoading(false)
    }
    fetchData()
  }, [])

  const filteredBrands = brands.filter(
    (brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sampleBrands
        .find((b) => b.id === product.brand_id)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="w-full flex flex-col min-h-screen bg-gray-50">
      <Header />
      <HeroSection />

      <main className="flex-grow container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="relative mb-12 max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search brands or products..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-600">Loading data...</p>
          </div>
        ) : (
          <>
            <section id="brands" className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Our Brands</h2>
              {filteredBrands.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredBrands.map((brand) => (
                    <BrandCard key={brand.id} brand={brand} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 text-lg">No brands found matching your search.</p>
              )}
            </section>

            <section id="products">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Our Products</h2>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-600 text-lg">No products found matching your search.</p>
              )}
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
import { Button } from "@/components/ui/button"

export function HeroSection() {
    return (
        <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-r from-gray-900 to-gray-700 text-white text-center">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                    Discover Your Next Favorite Brand & Product
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
                    Explore a curated collection of top brands and their innovative products, designed to inspire and delight.
                </p>
                <div className="flex justify-center gap-4">
                    <Button asChild className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg">
                        <a href="#brands">Explore Brands</a>
                    </Button>
                    <Button
                        asChild className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg">
                        <a href="#products">View Products</a>
                    </Button>
                </div>
            </div>
        </section>
    )
}
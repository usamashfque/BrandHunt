import { Brand, Product } from "@/types/database"

export const sampleBrands: Brand[] = [
    {
        id: "4a476608-8cc8-46e6-b691-ff65b5b11034",
        name: "Bata Pakistan",
        description: "Leading footwear manufacturer with a wide range of shoes for all occasions.",
        logo_url: "", // Using placeholder
        created_at: "2025-06-20T14:06:03.266467+00:00",
        updated_at: "2025-06-20T15:39:22.126637+00:00",
        // location: "Nationwide",
    },
    {
        id: "92179698-d64a-40c1-b1cb-cd72bdd3bc81",
        name: "J.",
        description: "Luxury fashion brand offering high-end clothing, accessories, and fragrances.",
        logo_url: "", // Using placeholder
        created_at: "2025-06-20T15:08:27.577+00:00",
        updated_at: "2025-06-20T15:39:12.871039+00:00",
        // location: "Karachi",
    },
    {
        id: "brand-3",
        name: "Hush Puppies",
        description: "Comfortable and stylish casual footwear.",
        logo_url: "",
        created_at: "2025-06-20T16:00:00.000Z",
        updated_at: "2025-06-20T16:00:00.000Z",
        // location: "Global",
    },
    {
        id: "brand-4",
        name: "Khaadi",
        description: "Pakistani fashion brand known for its unique designs and fabrics.",
        logo_url: "",
        created_at: "2025-06-20T16:05:00.000Z",
        updated_at: "2025-06-20T16:05:00.000Z",
        // location: "Pakistan",
    },
]

export const sampleProducts: Product[] = [
    {
        id: "4c1f58d0-d2f3-4891-923a-0d921789dfff",
        name: "Classic Leather Sneakers",
        description: "eretre",
        price: 9375.0,
        discount_price: 7500.0,
        image_url: "", // Using placeholder
        category: "Shoes",
        brand_id: "brand-3", // Linked to Hush Puppies
        created_at: "2025-06-20T16:57:51.753+00:00",
        updated_at: "2025-06-20T16:57:51.753+00:00"
    },
    {
        id: "product-2",
        name: "Embroidered Lawn Suit",
        description: "Beautifully embroidered lawn suit for summer.",
        price: 6778.0,
        discount_price: 5200.0,
        image_url: "", // Using placeholder
        category: "Women's Clothing",
        brand_id: "brand-4", // Linked to Khaadi
        created_at: "2025-06-20T17:00:00.000Z",
        updated_at: "2025-06-20T17:00:00.000Z"
    },
    {
        id: "product-3",
        name: "Men's Casual Shirt",
        description: "Comfortable casual shirt for everyday wear.",
        price: 2500.0,
        discount_price: 2000.0,
        image_url: "",
        category: "Men's Clothing",
        brand_id: "92179698-d64a-40c1-b1cb-cd72bdd3bc81", // Linked to J.
        created_at: "2025-06-20T17:05:00.000Z",
        updated_at: "2025-06-20T17:05:00.000Z"
    },
    {
        id: "product-4",
        name: "Leather Wallet",
        description: "Premium leather wallet with multiple compartments.",
        price: 4000.0,
        discount_price: 3600.0,
        image_url: "",
        category: "Accessories",
        brand_id: "4a476608-8cc8-46e6-b691-ff65b5b11034", // Linked to Bata Pakistan
        created_at: "2025-06-20T17:10:00.000Z",
        updated_at: "2025-06-20T17:10:00.000Z"
    },
]

export async function getBrandsData(): Promise<Brand[]> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return sampleBrands
}

export async function getProductsData(): Promise<Product[]> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return sampleProducts
}
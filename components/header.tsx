import Link from "next/link"
import { Building2 } from "lucide-react"

export function Header() {
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
        {/* Add more navigation links if needed */}
      </nav>
    </header>
  )
}
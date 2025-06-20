export function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-400 py-8 text-center">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} Brand & Product Showcase. All rights reserved.</p>
        <p className="text-sm mt-2">Built with Next.js, Tailwind CSS, and shadcn/ui.</p>
      </div>
    </footer>
  )
}
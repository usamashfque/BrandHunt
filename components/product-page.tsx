"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MainSidebar } from "@/components/main-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Filter, MoreVertical, Edit, Trash, Eye, Loader2 } from "lucide-react"
import { getProducts, createProduct, updateProduct, deleteProduct, getProduct, getBrands } from "@/lib/database"
import type { Brand, Products } from "@/types/database"
import { toast } from "@/hooks/use-toast"
import { uploadFile } from "@/lib/storage"
import { createClient } from "@/utils/supabase/client"

export function ProductPage() {
  const supabase = createClient()

  const productCategories = [
    "Accessories",
    "Men's Clothing",
    "Women's Clothing",
    "Shoes",
    "Gadgets",
    "Electronics",
    "Home & Kitchen",
    "Books",
    "Sports",
    "Beauty",
  ]

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<Products[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: 0,
    discount_price: 0,
    image_url: "",
    website_url: "",
    category: "",
    brand_id: "",
  })

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const _products = await getProducts(supabase)
      setProducts(_products)

      const _brands = await getBrands(supabase)
      setBrands(_brands)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async () => {
    try {
      setIsFormSubmitting(true)
      let photoUrl = ""

      // Upload photo if selected
      if (photoFile) {
        const result = await uploadFile(photoFile, "guard-photos")
        photoUrl = result.url
      }

      if (formData.id) {
        const payload = {
          ...formData,
          brand_id: formData.brand_id,
        }

        const _result = await updateProduct(supabase, formData.id, !!photoUrl ? { ...payload } : payload)
        if (_result) {
          const _newData = await getProduct(supabase, _result.id)
          if (_newData) {
            setProducts((prev) => prev.map((_) => (_.id === _newData.id ? _newData : _)))
          }
          setIsAddDialogOpen(false)
          setFormData({
            id: "",
            name: "",
            description: "",
            price: 0,
            discount_price: 0,
            image_url: "",
            website_url: "",
            category: "",
            brand_id: "",
          })
          toast({
            title: "Success",
            description: "Security guard updated successfully",
          })
          setIsFormSubmitting(false)
        }
      } else {
        // const payload = {
        //   id: "",
        //   name: formData.name,
        //   address: formData.address,
        //   latitude: formData.latitude,
        //   longitude: formData.longitude,
        //   brand_id: formData.brand_id
        // }

        // New brand: omit id to let Supabase generate it
        const { id, ...restFormData } = formData // Destructure to exclude 'id'

        const payload = {
          ...restFormData, // Use the rest of the form data
        }

        const _result = await createProduct(supabase, payload)
        if (_result) {
          const _newGuard = await getProduct(supabase, _result.id)
          if (_newGuard) {
            setProducts((prev) => [...prev, _newGuard])
          }
          setIsAddDialogOpen(false)
          setFormData({
            id: "",
            name: "",
            description: "",
            price: 0,
            discount_price: 0,
            image_url: "",
            website_url: "",
            category: "",
            brand_id: "",
          })
          toast({
            title: "Success",
            description: "Security guard added successfully",
          })
          setIsFormSubmitting(false)
        }
      }
    } catch (error) {
      console.error("Error adding store:", error)
      toast({
        title: "Error",
        description: "Failed to add store",
        variant: "destructive",
      })
      setIsFormSubmitting(false)
    }
  }

  const handleEditGuard = async (data: Products) => {
    setFormData({
      id: data.id ?? "",
      name: data.name,
      description: data.description,
      price: data.price,
      discount_price: data.discount_price,
      image_url: data.image_url,
      website_url: data.website_url,
      category: data.category,
      brand_id: data.brand_id,
    })
    setIsAddDialogOpen(true)
  }

  const handleDeleteGuard = async (id: string) => {
    if (confirm("Are you sure you want to delete this store?")) {
      try {
        const success = await deleteProduct(supabase, id)
        if (success) {
          setProducts((prev) => prev.filter((guard) => guard.id !== id))
          toast({
            title: "Success",
            description: "Security guard deleted successfully",
          })
        }
      } catch (error) {
        console.error("Error deleting store:", error)
        toast({
          title: "Error",
          description: "Failed to delete store",
          variant: "destructive",
        })
      }
    }
  }

  // Update the handleInputChange function to handle file inputs
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhotoFile(e.target.files[0])
    }
  }

  const filteredGuards = products.filter(
    (guard) =>
      guard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guard.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex w-full min-h-screen bg-gray-100 dark:bg-gray-900">
      <MainSidebar />
      <SidebarInset>
        <div className="p-6 w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Products</h1>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search guards..."
                  className="pl-8 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Guard
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>{formData.id ? "Update Product" : "Add New Product"}</DialogTitle>
                    <DialogDescription>Enter the details of the store. Click save when you're done.</DialogDescription>
                  </DialogHeader>
                  <div className="p-1 grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="brand_id">Brand</Label>
                        <Select
                          value={formData.brand_id}
                          onValueChange={(value) => handleSelectChange("brand_id", value)}
                        >
                          <SelectTrigger id="brand_id">
                            <SelectValue placeholder="Select Brand" />
                          </SelectTrigger>
                          <SelectContent>
                            {brands.map((brand) => (
                              <SelectItem key={brand.id} value={brand.id}>
                                {brand.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Title</Label>
                        <Input id="name" placeholder="" value={formData.name} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          placeholder=""
                          value={formData.description}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleSelectChange("category", value)}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {productCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website_url">Website URL</Label>
                        <Input
                          id="website_url"
                          placeholder=""
                          value={formData.website_url}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input id="price" placeholder="" value={formData.price} onChange={handleInputChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discount_price">Discount Price</Label>
                        <Input
                          id="discount_price"
                          placeholder=""
                          value={formData.discount_price}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isFormSubmitting}>
                      {isFormSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading products...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGuards.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          No products found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredGuards.map((guard) => (
                        <TableRow key={guard.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="font-medium">{guard.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>{guard.description}</TableCell>
                          <TableCell>{guard?.brands.name}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditGuard(guard)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteGuard(guard.id)}>
                                  <Trash className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </div>
  )
}
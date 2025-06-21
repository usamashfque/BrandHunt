"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { MainSidebar } from "@/components/main-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, Filter, MoreVertical, Edit, Trash, Eye, Loader2, Building2 } from "lucide-react"
import { getBrands, createBrand, updateBrand, deleteBrand } from "@/lib/database"
import type { Brand } from "@/types/database"
import { createClient } from "@/utils/supabase/client"
import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { uploadFile } from "@/lib/storage"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Import Select components

export function BrandsPage() {
  const supabase = createClient()

  const pakistanCities = [
    "Islamabad",
    "Lahore",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Gujranwala",
    "Sialkot",
    "Sargodha",
    "Bahawalpur",
    "Sheikhupura",
    "Rahim Yar Khan",
  ]

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [brands, setBrands] = useState<Brand[]>([])
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    logo_url: "",
    city: "", // Add city to formData
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const companiesData = await getBrands(supabase)
        setBrands(companiesData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load Brands data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

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
        const result = await uploadFile(photoFile, "brands")
        photoUrl = result.url
      }

      if (formData.id) {
        // Existing brand: include id for update
        const payload = {
          ...formData,
        }

        const _result = await updateBrand(
          supabase,
          formData.id,
          !!photoUrl ? { ...payload, logo_url: photoUrl } : payload,
        )
        if (_result) {
          setBrands((prev) => prev.map((_) => (_.id === _result.id ? _result : _)))
          setIsAddDialogOpen(false)
          setFormData({
            id: "",
            name: "",
            description: "",
            logo_url: "",
            city: "", // Reset city
          })
          toast({
            title: "Success",
            description: "Brand updated successfully",
          })
          setIsFormSubmitting(false)
        }
      } else {
        // New brand: omit id to let Supabase generate it
        const { id, ...restFormData } = formData // Destructure to exclude 'id'

        const payload = {
          ...restFormData, // Use the rest of the form data
          logo_url: photoUrl || "",
        }

        const _result = await createBrand(supabase, payload) // Pass payload without 'id'
        if (_result) {
          setBrands((prev) => [...prev, _result])
          setIsAddDialogOpen(false)
          setFormData({
            id: "",
            name: "",
            description: "",
            logo_url: "",
            city: "", // Reset city
          })
          toast({
            title: "Success",
            description: "Brand added successfully",
          })
          setIsFormSubmitting(false)
        }
      }
    } catch (error) {
      console.error("Error adding Brand:", error)
      toast({
        title: "Error",
        description: "Failed to add Brand",
        variant: "destructive",
      })
      setIsFormSubmitting(false)
    }
  }

  const handleEdit = async (data: Brand) => {
    setFormData({
      id: data.id ?? "",
      name: data.name,
      description: data.description,
      logo_url: data.logo_url,
      city: data.city || "", // Populate city for editing
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this security guard?")) {
      try {
        const success = await deleteBrand(supabase, id)
        if (success) {
          setBrands((prev) => prev.filter((guard) => guard.id !== id))
          toast({
            title: "Success",
            description: "Brand deleted successfully",
          })
        }
      } catch (error) {
        console.error("Error deleting Brand:", error)
        toast({
          title: "Error",
          description: "Failed to delete Brand",
          variant: "destructive",
        })
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhotoFile(e.target.files[0])
    }
  }

  const filteredGuards = brands.filter(
    (guard) =>
      guard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guard.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guard.city?.toLowerCase().includes(searchTerm.toLowerCase()), // Include city in search
  )

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      <MainSidebar />
      <SidebarInset>
        <div className="p-6 w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Brands</h1>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search brands..."
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
                    {formData.id ? "Update Brand" : "Add New Brand"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>Add New Brand</DialogTitle>
                    <DialogDescription>
                      Enter the details of the new Brand. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="p-1 grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
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
                        <Label htmlFor="city">City</Label>
                        <Select value={formData.city} onValueChange={(value) => handleSelectChange("city", value)}>
                          <SelectTrigger id="city">
                            <SelectValue placeholder="Select City" />
                          </SelectTrigger>
                          <SelectContent>
                            {pakistanCities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="photo">Photo</Label>
                        <Input id="photo" type="file" accept="image/*" onChange={handleFileChange} />
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
                  <span className="ml-2">Loading Brands...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>City</TableHead> {/* New City column header */}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {brands.map((brand) => (
                      <TableRow key={brand.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-gray-500" />
                            </div>
                            <span className="font-medium">{brand.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{brand.description}</TableCell>
                        <TableCell>{brand.city}</TableCell> {/* Display city */}
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
                              <DropdownMenuItem onClick={() => handleEdit(brand)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(brand.id)}>
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
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
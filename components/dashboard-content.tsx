"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Building2, CreditCard, Clock, AlertCircle, CheckCircle, Users, Loader2 } from "lucide-react"

export function DashboardContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    activeGuards: 0,
    companies: 0,
    revenue: 0,
    pendingRequests: 0,
  })
  const [recentRequests, setRecentRequests] = useState<Request[]>([])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true)
  //     try {
  //       const dashboardStats = await getDashboardStats()
  //       const requests = await getRecentRequests()
  //       setStats(dashboardStats)
  //       setRecentRequests(requests)
  //     } catch (error) {
  //       console.error("Error fetching dashboard data:", error)
  //       toast({
  //         title: "Error",
  //         description: "Failed to load dashboard data",
  //         variant: "destructive",
  //       })
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  //   fetchData()
  // }, [])

  if (isLoading) {
    return (
      <div className="p-6 w-full min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div className="p-6 w-full min-h-screen h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          {/* <Button variant="outline">Export</Button>
          <Button>New Request</Button> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stores</CardTitle>
            <Shield className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeGuards}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Building2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.companies}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {stats.revenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="">
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">

          </div>
        </CardContent>
      </Card>
    </div>
  )
}

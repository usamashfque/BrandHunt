"use client"

import { MainSidebar } from "@/components/main-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Bell, Shield, Lock, User, Plus, ExternalLink } from "lucide-react"

export function SettingsPage() {
  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      <MainSidebar />
      <SidebarInset>
        <div className="p-6 w-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>

          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">
                <User className="h-4 w-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="api">
                <Shield className="h-4 w-4 mr-2" />
                API Keys
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Manage your account settings and company information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input id="company-name" defaultValue="SecureAdmin Inc." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-email">Company Email</Label>
                        <Input id="company-email" type="email" defaultValue="admin@secureadmin.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-phone">Company Phone</Label>
                        <Input id="company-phone" defaultValue="+1 (555) 123-4567" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-website">Company Website</Label>
                        <Input id="company-website" defaultValue="https://secureadmin.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-address">Company Address</Label>
                      <Textarea id="company-address" defaultValue="123 Security St, Suite 456, New York, NY 10001" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">System Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="auto-assign">Auto-assign Guards</Label>
                          <p className="text-sm text-gray-500">Automatically assign guards based on availability</p>
                        </div>
                        <Switch id="auto-assign" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="auto-complete">Auto-complete Requests</Label>
                          <p className="text-sm text-gray-500">
                            Automatically mark requests as complete after end date
                          </p>
                        </div>
                        <Switch id="auto-complete" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="payment-reminders">Payment Reminders</Label>
                          <p className="text-sm text-gray-500">Send automatic payment reminders to clients</p>
                        </div>
                        <Switch id="payment-reminders" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how and when you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="new-request">New Request Notifications</Label>
                          <p className="text-sm text-gray-500">Receive an email when a new request is submitted</p>
                        </div>
                        <Switch id="new-request" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="payment-notification">Payment Notifications</Label>
                          <p className="text-sm text-gray-500">Receive an email when a payment is made</p>
                        </div>
                        <Switch id="payment-notification" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="guard-update">Guard Updates</Label>
                          <p className="text-sm text-gray-500">Receive an email when a guard updates their profile</p>
                        </div>
                        <Switch id="guard-update" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">System Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="browser-notifications">Browser Notifications</Label>
                          <p className="text-sm text-gray-500">Show browser notifications for important events</p>
                        </div>
                        <Switch id="browser-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sms-notifications">SMS Notifications</Label>
                          <p className="text-sm text-gray-500">Receive SMS for critical alerts</p>
                        </div>
                        <Switch id="sms-notifications" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security and authentication settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <Switch id="two-factor" />
                    </div>
                    <Button variant="outline" disabled>
                      Set Up Two-Factor Authentication
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Session Management</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Active Sessions</Label>
                        <p className="text-sm text-gray-500">You are currently logged in on 1 device</p>
                      </div>
                      <Button variant="outline" className="text-red-600">
                        Log Out All Devices
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage API keys for integrating with external systems.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Your API Keys</h3>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium">Production API Key</h4>
                            <p className="text-sm text-gray-500">Created on May 1, 2023</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Regenerate
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input value="••••••••••••••••••••••••••••••" readOnly />
                          <Button variant="outline" size="sm">
                            Copy
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium">Development API Key</h4>
                            <p className="text-sm text-gray-500">Created on May 10, 2023</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Regenerate
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input value="••••••••••••••••••••••••••••••" readOnly />
                          <Button variant="outline" size="sm">
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New API Key
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">API Documentation</h3>
                    <p className="text-sm text-gray-500">
                      Access our API documentation to learn how to integrate with our platform and automate your
                      security management workflows.
                    </p>
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View API Documentation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </div>
  )
}

// app/login/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Loader2 } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
    const router = useRouter()
    const { signIn, session, user } = useAuth()
    const [email, setEmail] = useState("superadmin@yopmail.com")
    const [password, setPassword] = useState("admin12345")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { error } = await signIn(email, password)
            if (error) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                })
            } else {
                toast({
                    title: "Success",
                    description: "You have successfully signed in",
                    variant: "default",
                })

                router.push("/admin")
                // setIsLoading(false)
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "An error occurred during sign in",
                variant: "destructive",
            })
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-2">
                        <Shield className="h-12 w-12" />
                    </div>
                    <CardTitle className="text-2xl font-bold">SecureAdmin</CardTitle>
                    <CardDescription>Enter your credentials to sign in to your account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
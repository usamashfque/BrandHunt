// contexts/auth-context.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/client"

type AuthContextType = {
    user: User | null
    session: Session | null
    isLoading: boolean
    signIn: (email: string, password: string) => Promise<{ error: any }>
    signUp: (email: string, password: string) => Promise<{ error: any }>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient()
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const setData = async () => {
            const { data: { session }, error } = await supabase.auth.getSession()
            if (error) {
                console.error(error)
            }
            setSession(session)
            setUser(session?.user ?? null)
            setIsLoading(false)
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setIsLoading(false)
        })

        setData()

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            console.error("Login error:", error.message)
        }

        return { error }
    }

    const signUp = async (email: string, password: string) => {
        const { error, data } = await supabase.auth.signUp({ email, password })
        return { error }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    const value = {
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
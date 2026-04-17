"use client"

import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { AuthModal } from "./AuthModal"
import { useSession } from "next-auth/react"

function AuthObserverContent() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()
    const { data: session } = useSession()
    
    const [isOpen, setIsOpen] = useState(false)
    const [view, setView] = useState<'login' | 'register'>('login')

    useEffect(() => {
        const authParam = searchParams.get('auth')
        if (!authParam) {
            setIsOpen(false)
            return
        }

        // If user is already logged in, clear param and don't open
        if (session) {
            const params = new URLSearchParams(searchParams.toString())
            params.delete('auth')
            router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`)
            return
        }

        if (authParam === 'login') {
            setView('login')
            setIsOpen(true)
        } else if (authParam === 'register' || authParam === 'signup') {
            setView('register')
            setIsOpen(true)
        }
    }, [searchParams, session, pathname, router])

    return (
        <AuthModal 
            isOpen={isOpen} 
            onClose={() => {
                setIsOpen(false)
                // Clear the URL param when closing manually
                const params = new URLSearchParams(searchParams.toString())
                params.delete('auth')
                router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`)
            }} 
            initialView={view} 
        />
    )
}

export function GlobalAuthObserver() {
    return (
        <Suspense fallback={null}>
            <AuthObserverContent />
        </Suspense>
    )
}

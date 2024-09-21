'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    // TODO: Implement actual authentication check
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true'
    if (!isAuthenticated) {
      router.push('/admin')
    }
  }, [router])

  return <>{children}</>
}
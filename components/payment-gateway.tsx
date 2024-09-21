"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Moon, Sun, Lock } from "lucide-react"

export function PaymentGateway() {
  const [isLoading, setIsLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#022d2d]' : 'bg-gray-100'} transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <header className="py-4 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {isDarkMode ? (
              <Sun className="h-6 w-6 text-yellow-400" />
            ) : (
              <Moon className="h-6 w-6 text-gray-400" />
            )}
            <span className="sr-only">Toggle dark mode</span>
          </Button>
        </header>
        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          <Card className={`w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden ${isDarkMode ? 'bg-white' : ''}`}>
            <CardContent className="p-6">
              {isLoading ? (
                <SkeletonUI />
              ) : (
                <>
                  <Image
                    src="/placeholder.svg?height=50&width=200"
                    alt="PayFast Logo"
                    width={200}
                    height={50}
                    className="mb-8 mx-auto"
                  />
                  <h2 className={`text-lg md:text-xl font-bold text-center mb-6 ${isDarkMode ? 'text-[#8b859e]' : 'text-gray-800'}`}>
                    Choose your transactional bank to receive payment.
                  </h2>
                  <p className="text-center text-gray-600 mb-6">
                    PayFast never stores your banking credentials
                  </p>
                  <div className="space-y-4">
                    <BankButton color="bg-red-600" name="Absa" logo="/placeholder.svg?height=30&width=30" isDarkMode={isDarkMode} />
                    <BankButton color="bg-green-500" name="Discovery Bank" logo="/placeholder.svg?height=30&width=30" isDarkMode={isDarkMode} />
                    <BankButton color="bg-teal-500" name="FNB" logo="/placeholder.svg?height=30&width=30" isDarkMode={isDarkMode} />
                    <BankButton color="bg-blue-600" name="Investec" logo="/placeholder.svg?height=30&width=30" isDarkMode={isDarkMode} />
                    <BankButton color="bg-blue-800" name="Standard Bank" logo="/placeholder.svg?height=30&width=30" isDarkMode={isDarkMode} />
                  </div>
                  <div className="flex items-center justify-center mt-6 text-gray-500">
                    <Lock className="w-4 h-4 mr-2" />
                    <span className="text-sm">Secure SSL Encryption</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

function BankButton({ color, name, logo, isDarkMode }: { color: string; name: string; logo: string; isDarkMode: boolean }) {
  return (
    <Button
      variant="outline"
      className={`w-full justify-start text-left font-normal text-sm p-0 h-auto group overflow-hidden transition-all duration-300 ease-in-out hover:shake ${isDarkMode ? 'bg-white hover:bg-gray-100' : 'hover:bg-gray-100'}`}
    >
      <div className="flex items-center w-full relative">
        <div className={`absolute left-0 top-2 bottom-2 w-1 ${color} rounded-r-full`} />
        <div className="flex items-center flex-grow py-3 pl-4">
          <Image src={logo} alt={`${name} logo`} width={30} height={30} className="mr-3" />
          <span className={`font-bold font-sans ${isDarkMode ? 'text-black' : ''}`}>{name}</span>
        </div>
        <div className="pr-4">
          <span className="text-gray-400 group-hover:text-gray-600">&gt;</span>
        </div>
      </div>
    </Button>
  )
}

function SkeletonUI() {
  return (
    <div className="space-y-6 animate-pulse">
      <Skeleton className="h-12 w-48 mx-auto" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-4 w-3/4 mx-auto" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  )
}
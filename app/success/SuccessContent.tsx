"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { CheckCircle } from "lucide-react"

export default function SuccessContent() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [bankName, setBankName] = useState('')
  const [bankLogo, setBankLogo] = useState('')
  const [countdown, setCountdown] = useState(5)
  const [redirectUrl, setRedirectUrl] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const bank = searchParams.get('bank')
    if (bank) {
      const decodedBankName = decodeURIComponent(bank)
      setBankName(decodedBankName)
      setBankLogo(`/bank-logos/${decodedBankName.toLowerCase().split(' ')[0]}.png`)
    }
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true)
    }

    // Fetch the redirect URL from the configuration
    fetch('/api/getConfig')
      .then(response => response.json())
      .then(data => {
        setRedirectUrl(data.redirectUrl || 'https://www.payfast.co.za')
      })
      .catch(error => {
        console.error('Error fetching config:', error)
        setRedirectUrl('https://www.payfast.co.za') // Fallback URL
      })

    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [searchParams])

  useEffect(() => {
    if (countdown === 0 && redirectUrl) {
      window.location.href = redirectUrl
    }
  }, [countdown, redirectUrl])

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className={`w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto rounded-lg shadow-lg overflow-hidden ${isDarkMode ? 'bg-[#022d2d]' : 'bg-gray-100'} transition-colors duration-300`}>
          <CardContent className="p-6 md:p-8">
            <Image
              src={bankLogo}
              alt={`${bankName} Logo`}
              width={50}
              height={50}
              className="mb-8 mx-auto"
            />
            <div className="flex flex-col items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-2 text-gray-800">
                Payment Successful
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-center mb-6 text-gray-600">
                Your payment has been processed successfully.
              </p>
              <p className="text-sm md:text-base lg:text-lg text-center text-gray-600">
                Redirecting in {countdown} seconds...
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
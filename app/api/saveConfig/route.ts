import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  const { sendToTelegram, chatId, botId, redirectUrl } = await req.json()
  const filePath = path.join(process.cwd(), 'database.json')
  
  try {
    const data = await fs.readFile(filePath, 'utf8')
    const jsonData = JSON.parse(data)
    
    jsonData.config = {
      sendResultToTelegram: sendToTelegram,
      chatId,
      botId,
      redirectUrl
    }

    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save config:', error)
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  const filePath = path.join(process.cwd(), 'database.json')
  
  try {
    const data = await fs.readFile(filePath, 'utf8')
    const jsonData = JSON.parse(data)
    return NextResponse.json({
      sendResultToTelegram: jsonData.config?.sendResultToTelegram || false,
      chatId: jsonData.config?.chatId || '',
      botId: jsonData.config?.botId || '',
      redirectUrl: jsonData.config?.redirectUrl || ''
    })
  } catch (error) {
    console.error('Failed to get config:', error)
    return NextResponse.json({ error: 'Failed to get config' }, { status: 500 })
  }
}
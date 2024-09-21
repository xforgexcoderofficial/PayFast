import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST() {
  const filePath = path.join(process.cwd(), 'database.json')
  const emptyDatabase = {
    users: [{ username: "Admin", password: "Admin1234" }],
    visitors: [],
    inputs: []
  }

  try {
    await fs.writeFile(filePath, JSON.stringify(emptyDatabase, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to clear database:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
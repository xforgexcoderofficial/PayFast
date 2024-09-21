import fs from 'fs/promises'
import path from 'path'

export async function fetchMockData() {
  const filePath = path.join(process.cwd(), 'database.json')
  const jsonData = await fs.readFile(filePath, 'utf8')
  return JSON.parse(jsonData)
}
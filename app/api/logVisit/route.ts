import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const ipResponse = await fetch('https://api.ipify.org?format=json')
    const { ip } = await ipResponse.json()

    const countryResponse = await fetch(`https://ipapi.co/${ip}/json/`)
    const countryData = await countryResponse.json()

    return NextResponse.json({ ip, country: countryData.country_name })
  } catch (error) {
    console.error('Error fetching IP and country:', error)
    return NextResponse.json({ error: 'Failed to fetch IP and country' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  // Here you can implement the logic to log the visit
  console.log('Visit logged:', body)
  return NextResponse.json({ success: true })
}
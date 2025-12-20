import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = formData.get('email') as string

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // For MVP, just log the email. In production, save to database or send to email service
    console.log('Email captured:', email)

    // Redirect to directory page
    return NextResponse.redirect(new URL('/directory', request.url))
  } catch (error) {
    console.error('Error capturing email:', error)
    return NextResponse.json(
      { error: 'Failed to capture email' },
      { status: 500 }
    )
  }
}


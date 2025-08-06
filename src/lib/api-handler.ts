import { NextRequest, NextResponse } from 'next/server'

type Handler = (req: NextRequest) => Promise<NextResponse>

export function withErrorHandler(handler: Handler): Handler {
  return async (req: NextRequest) => {
    try {
      return await handler(req)
    } catch (error) {
      console.error('API Error:', error)

      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      )
    }
  }
}

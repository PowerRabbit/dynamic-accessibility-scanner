import { NextRequest, NextResponse } from 'next/server'

type Handler<T> = (req: NextRequest, options: { params: T }) => Promise<NextResponse>

export function withErrorHandler<T>(handler: Handler<T>): Handler<T> {
  return async (req, options) => {
    try {
      return await handler(req, options)
    } catch (error) {
      console.error('API Error:', error)

      return NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      )
    }
  }
}

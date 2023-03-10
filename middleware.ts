import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value
    try {
        if (!token) {
            throw new Error('Not Authorized')
        }
        return NextResponse.redirect(new URL('/app/today', req.url))
    } catch (error) {
        return NextResponse.next()
    }
}

export const config = {
    matcher: ['/auth/login', '/auth/signup'],
}

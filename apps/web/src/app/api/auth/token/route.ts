import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest, res: NextResponse) {
  const getCookies = cookies()
  // En producción (HTTPS) NextAuth usa el prefijo "__Secure-"; en local no.
  const nextAuthSession =
    getCookies.get('__Secure-next-auth.session-token')?.value ||
    getCookies.get('next-auth.session-token')?.value ||
    ''

  return NextResponse.json(nextAuthSession)
}

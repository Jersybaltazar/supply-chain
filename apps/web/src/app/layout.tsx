import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@foundation/ui/src/index.css'
import { Container } from '@foundation/ui/src/components/atoms/container'
import { Navbar } from '@foundation/ui/src/components/organisms/Navbar'
import { Footer } from '@foundation/ui/src/components/organisms/Footer'
import { SessionProvider } from '@foundation/ui/src/components/molecules/SessionProvider'
import { Toaster } from '@foundation/ui/src/components/atoms/toaster'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Foundation X | K',
  description: 'La base para tu monorepo.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Container>
            <SessionProvider>
              <Navbar />
            </SessionProvider>
            {children}
          </Container>
          <Footer />
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

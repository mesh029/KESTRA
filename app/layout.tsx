import type { Metadata } from 'next'
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400'],
})

export const metadata: Metadata = {
  title: {
    default: 'KESTRA PROTOCOL',
    template: '%s — KESTRA PROTOCOL',
  },
  description:
    'A shoppable editorial magazine. Every Look is a story told in fabric, light, and craft. Based in Nairobi, Kenya.',
  openGraph: {
    siteName: 'KESTRA PROTOCOL',
    locale: 'en_KE',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-paper-white text-void-black antialiased">
        {children}
      </body>
    </html>
  )
}

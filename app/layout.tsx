import type { Metadata } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { Providers } from '@/providers'
import { Cursor } from '@/components/layout/Cursor'
import { Loader } from '@/components/layout/Loader'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import '@/styles/globals.css'

/* next/font self-hosts fonts — no external Google Fonts request */

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Oraclous — The Fine-Tuning Team That Runs Itself',
    template: '%s | Oraclous',
  },
  description:
    'An open-source FTOps platform — a team of specialist agents that automates the complete fine-tuning lifecycle over your knowledge graph, on your infrastructure, with full data ownership.',
  keywords: ['FTOps', 'fine-tuning', 'knowledge graph', 'AI agents', 'MLOps', 'self-hosted'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Oraclous',
    title: 'Oraclous — The Fine-Tuning Team That Runs Itself',
    description:
      'The FTOps platform that fine-tunes your domain model — continuously, autonomously, on your infrastructure.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oraclous — The Fine-Tuning Team That Runs Itself',
    description:
      'The FTOps platform that fine-tunes your domain model — continuously, autonomously, on your infrastructure.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <Loader />
          <Cursor />
          <Nav />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

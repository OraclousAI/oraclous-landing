import type { Metadata } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import { Providers } from '@/providers'
import { Cursor } from '@/components/layout/Cursor'
import { Loader } from '@/components/layout/Loader'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
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
      <head>
        <link rel="preconnect" href="https://assets.calendly.com" />
        <link rel="dns-prefetch" href="https://assets.calendly.com" />
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <Loader />
          <Cursor />
          <ScrollProgress />
          <Nav />
          {children}
          <Footer />
          <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
        </Providers>
      </body>
    </html>
  )
}

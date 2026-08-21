import { Analytics } from '@vercel/analytics/next'
import { Inter } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { siteConfig } from '@/shared/config/site.config'

import './globals.css'
import '@/styles/tokens.css'
import '@/styles/base.css'
import '@/styles/layout/header.css'
import '@/styles/layout/footer.css'
import '@/styles/sections/hero.css'
import '@/styles/sections/about.css'
import '@/styles/sections/contact.css'
import '@/styles/features/gallery.css'
import '@/styles/features/video.css'
import '@/styles/features/viewer.css'
import '@/styles/responsive.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fbfbfd',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="uk" className={inter.variable}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

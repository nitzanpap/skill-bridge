import type React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { ServerStatusChecker } from '@/components/server-status-checker'
import { Analytics } from '@vercel/analytics/react'
import { appConfig } from '@/configs/config'
import { NodeEnvs } from '@/types/config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Skill Bridge - Entity Extraction Tool',
  description: 'Identify skills and other entities from job descriptions and resumes',
  generator: 'v0.dev',
  icons: {
    icon: [
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon.ico' },
    ],
    apple: [{ url: '/favicons/apple-touch-icon.png' }],
    other: [
      {
        url: '/favicons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/favicons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  manifest: '/favicons/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <ServerStatusChecker />
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics
          mode={appConfig.nodeEnv === NodeEnvs.PRODUCTION ? 'production' : 'development'}
          debug={appConfig.nodeEnv !== NodeEnvs.PRODUCTION}
        />
      </body>
    </html>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { ThemeToggle } from './theme-toggle'

export function AppHeader() {
  const [logoImage, setLogoImage] = useState<string | undefined>(undefined)
  const { theme } = useTheme()

  useEffect(() => {
    switch (theme) {
      case 'dark':
        setLogoImage('/logo-dark.png')
        return
      case 'light':
        setLogoImage('/logo-light.png')
        return
      case 'system':
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setLogoImage(prefersDark ? '/logo-dark.png' : '/logo-light.png')
        return
      default:
        setLogoImage('/logo-light.png')
        return
    }
  }, [theme])

  return (
    <header className='flex w-full border-b bg-background shadow-sm'>
      <div className='flex h-32 w-full items-center justify-between px-4'>
        <div className='flex items-center gap-2'>
          {logoImage && (
            <Image
              src={logoImage}
              alt='Skill Bridge Logo'
              width={220}
              height={220}
              className='ml-2'
            />
          )}
        </div>
        <div className='flex items-center gap-4'>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

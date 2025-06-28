'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { ThemeToggle } from './theme-toggle'
import { GITHUB_REPOSITORY_URL } from '@/lib/constants'

export function AppHeader() {
  const [logoImage, setLogoImage] = useState<string | undefined>(undefined)
  const [githubIcon, setGithubIcon] = useState<string | undefined>(undefined)
  const { theme } = useTheme()

  useEffect(() => {
    switch (theme) {
      case 'dark':
        setLogoImage('/app_logo/logo-dark.png')
        setGithubIcon('/github_icons/github_icon_for_dark_mode.png')
        return
      case 'light':
        setLogoImage('/app_logo/logo-light.png')
        setGithubIcon('/github_icons/github_icon_for_light_mode.png')
        return
      case 'system':
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setLogoImage(prefersDark ? '/app_logo/logo-dark.png' : '/app_logo/logo-light.png')
        setGithubIcon(
          prefersDark
            ? '/github_icons/github_icon_for_dark_mode.png'
            : '/github_icons/github_icon_for_light_mode.png',
        )
        return
      default:
        setLogoImage('/app_logo/logo-light.png')
        setGithubIcon('/github_icons/github_icon_for_light_mode.png')
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
              width={0}
              height={0}
              className='ml-2 h-auto max-h-[100px] w-auto'
              priority
            />
          )}
        </div>
        <div className='flex items-center gap-4'>
          {githubIcon && (
            <Link
              href={GITHUB_REPOSITORY_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='transition-opacity hover:opacity-80'
              aria-label='View source code on GitHub'
            >
              <Image
                src={githubIcon}
                alt='GitHub Repository'
                width={24}
                height={24}
                className='h-6 w-6'
              />
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

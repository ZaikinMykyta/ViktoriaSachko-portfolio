'use client'

import { useState } from 'react'
import { MobileMenu } from '@/features/navigation/components/mobile-menu'
import { SiteHeader } from '@/features/navigation/components/site-header'
import { useBodyScrollLock } from '@/shared/hooks/use-body-scroll-lock'
import { useScrollThreshold } from '@/shared/hooks/use-scroll-threshold'

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const scrolled = useScrollThreshold()

  useBodyScrollLock(menuOpen)

  return (
    <>
      <SiteHeader scrolled={scrolled} onOpenMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

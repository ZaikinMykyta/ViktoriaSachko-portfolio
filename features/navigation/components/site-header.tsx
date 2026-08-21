'use client'

import { Menu } from 'lucide-react'
import { navLinks } from '@/shared/config/navigation.config'
import { siteConfig } from '@/shared/config/site.config'

type SiteHeaderProps = {
  scrolled: boolean
  onOpenMenu: () => void
}

export function SiteHeader({ scrolled, onOpenMenu }: SiteHeaderProps) {
  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <a href="#top" className="wordmark">{siteConfig.name}</a>

      <nav className="nav-desktop">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href}>{link.label}</a>
        ))}
      </nav>

      <button type="button" className="menu-toggle" onClick={onOpenMenu} aria-label="Меню">
        <Menu />
      </button>
    </header>
  )
}

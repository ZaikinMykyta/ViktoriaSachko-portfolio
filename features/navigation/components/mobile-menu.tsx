'use client'

import { X } from 'lucide-react'
import { navLinks } from '@/shared/config/navigation.config'

type MobileMenuProps = {
  open: boolean
  onClose: () => void
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <div className={`mobile-menu ${open ? 'open' : ''}`} aria-hidden={!open}>
      <button type="button" className="mobile-menu-close" onClick={onClose} aria-label="Закрити">
        <X />
      </button>
      <nav className="mobile-nav">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={onClose}>
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  )
}

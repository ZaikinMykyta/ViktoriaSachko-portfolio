'use client'

import { useEffect } from 'react'

type UseViewerKeyboardOptions = {
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function useViewerKeyboard({ onClose, onPrev, onNext }: UseViewerKeyboardOptions) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrev()
      if (event.key === 'ArrowRight') onNext()
    }

    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, onPrev, onNext])
}

'use client'

import { useEffect, useState } from 'react'
import { captureVideoFrame } from '@/shared/lib/capture-video-frame'

type VideoThumbnailProps = {
  src: string
  alt?: string
}

export function VideoThumbnail({ src, alt = '' }: VideoThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    captureVideoFrame(src)
      .then((dataUrl) => {
        if (!cancelled) setThumbnail(dataUrl)
      })
      .catch(() => {
        if (!cancelled) setThumbnail(null)
      })

    return () => {
      cancelled = true
    }
  }, [src])

  if (thumbnail) {
    return <img src={thumbnail} alt={alt} loading="lazy" />
  }

  return <span className="video-thumb-placeholder" aria-hidden="true" />
}

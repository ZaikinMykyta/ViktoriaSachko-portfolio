'use client'

import { useEffect, useState } from 'react'
import { captureVideoFrame } from '@/shared/lib/capture-video-frame'

type VideoThumbnailProps = {
  src: string
  poster?: string
  alt?: string
}

type ThumbnailMode = 'poster' | 'video' | 'canvas' | 'placeholder'

export function VideoThumbnail({ src, poster, alt = '' }: VideoThumbnailProps) {
  const [mode, setMode] = useState<ThumbnailMode>(poster ? 'poster' : 'video')
  const [canvasSrc, setCanvasSrc] = useState<string | null>(null)

  useEffect(() => {
    if (mode !== 'canvas') return

    let cancelled = false

    captureVideoFrame(src)
      .then((dataUrl) => {
        if (!cancelled) {
          setCanvasSrc(dataUrl)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMode('placeholder')
        }
      })

    return () => {
      cancelled = true
    }
  }, [src, mode])

  if (mode === 'poster' && poster) {
    return (
      <img
        src={poster}
        alt={alt}
        loading="lazy"
        onError={() => setMode('video')}
      />
    )
  }

  if (mode === 'video') {
    return (
      <video
        src={`${src}#t=0.001`}
        muted
        playsInline
        preload="metadata"
        aria-label={alt}
        tabIndex={-1}
        onError={() => setMode('canvas')}
      />
    )
  }

  if (mode === 'canvas' && canvasSrc) {
    return <img src={canvasSrc} alt={alt} loading="lazy" />
  }

  if (mode === 'canvas') {
    return <span className="video-thumb-placeholder" aria-hidden="true" />
  }

  return <span className="video-thumb-placeholder" aria-hidden="true" />
}

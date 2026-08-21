'use client'

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { ViewerMediaFrame } from '@/features/media-viewer/components/viewer-media-frame'
import type { VideoPlayerHandle } from '@/features/media-viewer/components/video-player'
import { useViewerKeyboard } from '@/features/media-viewer/hooks/use-viewer-keyboard'
import type { ViewerState } from '@/shared/types/viewer.types'

export type MediaViewerHandle = {
  playVideoWithSound: () => Promise<void>
}

type MediaViewerProps = {
  state: ViewerState
  onClose: () => void
}

export const MediaViewer = forwardRef<MediaViewerHandle, MediaViewerProps>(function MediaViewer(
  { state, onClose },
  ref,
) {
  const [index, setIndex] = useState(state.startIndex)
  const dialogRef = useRef<HTMLDivElement>(null)
  const videoPlayerRef = useRef<VideoPlayerHandle>(null)
  const media = state.media[index]
  const hasMultiple = state.media.length > 1
  const manualVideoStart = Boolean(state.userInitiated) && index === state.startIndex

  const goPrev = useCallback(() => {
    setIndex((current) => (current - 1 + state.media.length) % state.media.length)
  }, [state.media.length])

  const goNext = useCallback(() => {
    setIndex((current) => (current + 1) % state.media.length)
  }, [state.media.length])

  useImperativeHandle(ref, () => ({
    playVideoWithSound: () => videoPlayerRef.current?.playWithSound() ?? Promise.resolve(),
  }))

  useEffect(() => {
    setIndex(state.startIndex)
  }, [state.startIndex])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  useViewerKeyboard({ onClose, onPrev: goPrev, onNext: goNext })

  const displayTitle = media.title ?? state.title
  const displayCategory = media.category ?? state.category

  return (
    <div className="viewer-backdrop" role="dialog" aria-modal="true" aria-label={displayTitle} onClick={onClose}>
      {hasMultiple && (
        <button
          type="button"
          className="viewer-nav viewer-nav-prev viewer-nav-floating"
          onClick={(event) => {
            event.stopPropagation()
            goPrev()
          }}
          aria-label="Попереднє"
        >
          <ChevronLeft />
        </button>
      )}

      <div className="viewer" ref={dialogRef} tabIndex={-1} onClick={(event) => event.stopPropagation()}>
        <button type="button" className="viewer-close" onClick={onClose} aria-label="Закрити">
          <X />
        </button>

        <div className="viewer-body">
          <div className="viewer-media">
            <ViewerMediaFrame
              ref={media.type === 'video' ? videoPlayerRef : undefined}
              media={media}
              index={index}
              manualVideoStart={manualVideoStart}
            />
          </div>
        </div>

        <div className="viewer-footer">
          <span>
            {String(index + 1).padStart(2, '0')} / {String(state.media.length).padStart(2, '0')}
          </span>
          <div className="viewer-meta">
            <strong>{displayTitle}</strong>
            <small>{displayCategory}</small>
          </div>
          {hasMultiple && (
            <div className="viewer-dots">
              {state.media.map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  type="button"
                  className={dotIndex === index ? 'viewer-dot active' : 'viewer-dot'}
                  onClick={() => setIndex(dotIndex)}
                  aria-label={`Перейти до ${dotIndex + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {hasMultiple && (
        <button
          type="button"
          className="viewer-nav viewer-nav-next viewer-nav-floating"
          onClick={(event) => {
            event.stopPropagation()
            goNext()
          }}
          aria-label="Наступне"
        >
          <ChevronRight />
        </button>
      )}
    </div>
  )
})

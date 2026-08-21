'use client'

import { forwardRef } from 'react'
import type { Media } from '@/entities/project'
import { VideoPlayer, type VideoPlayerHandle } from '@/features/media-viewer/components/video-player'

type ViewerMediaFrameProps = {
  media: Media
  index: number
  manualVideoStart?: boolean
}

export const ViewerMediaFrame = forwardRef<VideoPlayerHandle, ViewerMediaFrameProps>(
  function ViewerMediaFrame({ media, index, manualVideoStart = false }, ref) {
    if (media.type === 'video') {
      return (
        <VideoPlayer
          ref={ref}
          src={media.url}
          keyId={`${index}-${media.url}`}
          autoPlay
          manualStart={manualVideoStart}
        />
      )
    }

    return (
      <div className="viewer-media-frame">
        <img src={media.url} alt="" className="viewer-media-bg" aria-hidden="true" />
        <img src={media.url} alt={media.alt} className="viewer-media-main" />
      </div>
    )
  },
)

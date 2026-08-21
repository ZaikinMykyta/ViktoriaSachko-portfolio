import type { Media } from '@/entities/project'
import { VideoPlayer } from '@/features/media-viewer/components/video-player'

type ViewerMediaFrameProps = {
  media: Media
  index: number
}

export function ViewerMediaFrame({ media, index }: ViewerMediaFrameProps) {
  if (media.type === 'video') {
    return <VideoPlayer src={media.url} keyId={`${index}-${media.url}`} autoPlay />
  }

  return (
    <div className="viewer-media-frame">
      <img src={media.url} alt="" className="viewer-media-bg" aria-hidden="true" />
      <img src={media.url} alt={media.alt} className="viewer-media-main" />
    </div>
  )
}

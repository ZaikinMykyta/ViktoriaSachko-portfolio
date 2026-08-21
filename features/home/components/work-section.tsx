import { Play } from 'lucide-react'
import type { Project } from '@/entities/project'
import type { VideoItem } from '@/entities/video'
import { PhotoGallery } from '@/features/gallery'
import { VideoThumbnail } from '@/features/video'
import { Container } from '@/shared/ui/container'
import { SectionLabel } from '@/shared/ui/section-label'

type WorkSectionProps = {
  photos: Project[]
  videos: VideoItem[]
  viewerOpen: boolean
  onOpenPhoto: (project: Project) => void
  onOpenVideo: (index: number) => void
}

export function WorkSection({
  photos,
  videos,
  viewerOpen,
  onOpenPhoto,
  onOpenVideo,
}: WorkSectionProps) {
  return (
    <section className="work section" id="work">
      <Container>
        <SectionLabel>Photography</SectionLabel>
      </Container>

      <Container className="gallery-container">
        <PhotoGallery photos={photos} onOpen={onOpenPhoto} paused={viewerOpen} />
      </Container>

      <Container>
        <SectionLabel className="section-label-spaced">Videography</SectionLabel>
        <div className="video-grid">
          {videos.map((video, index) => (
            <button
              type="button"
              className="video-card"
              key={video.title}
              onPointerDown={() => onOpenVideo(index)}
            >
              <span className="video-thumb">
                <VideoThumbnail src={video.url} alt={video.title} />
                <span className="video-play"><Play /></span>
              </span>
              <span className="video-info">
                <strong>{video.title}</strong>
                <small>{video.category}</small>
              </span>
            </button>
          ))}
        </div>
      </Container>
    </section>
  )
}

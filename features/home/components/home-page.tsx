'use client'

import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import type { Project } from '@/entities/project'
import { AboutSection } from '@/features/home/components/about-section'
import { ContactSection } from '@/features/home/components/contact-section'
import { HeroSection } from '@/features/home/components/hero-section'
import { WorkSection } from '@/features/home/components/work-section'
import { MediaViewer, type MediaViewerHandle } from '@/features/media-viewer'
import { Navigation } from '@/features/navigation'
import { portfolioService } from '@/services/portfolio.service'
import { viewerService } from '@/services/viewer.service'
import { SiteFooter } from '@/shared/ui/site-footer'
import type { ViewerState } from '@/shared/types/viewer.types'

export function HomePage() {
  const [viewer, setViewer] = useState<ViewerState | null>(null)
  const viewerRef = useRef<MediaViewerHandle>(null)
  const photos = portfolioService.getPhotos()
  const videos = portfolioService.getVideos()

  const openPhoto = (project: Project) => {
    setViewer(viewerService.createPhotoViewerState(project, photos))
  }

  const openVideo = (index: number) => {
    flushSync(() => {
      setViewer(viewerService.createVideoViewerState(index, true))
    })
    void viewerRef.current?.playVideoWithSound()
  }

  return (
    <>
      <Navigation />

      <main id="top">
        <HeroSection imageUrl={portfolioService.getHeroImage()} />
        <AboutSection />
        <WorkSection
          photos={photos}
          videos={videos}
          viewerOpen={viewer !== null}
          onOpenPhoto={openPhoto}
          onOpenVideo={openVideo}
        />
        <ContactSection />
      </main>

      <SiteFooter />

      {viewer && (
        <MediaViewer ref={viewerRef} state={viewer} onClose={() => setViewer(null)} />
      )}
    </>
  )
}

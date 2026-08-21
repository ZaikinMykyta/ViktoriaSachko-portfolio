import type { Project } from '@/entities/project'
import { videos } from '@/entities/video'
import type { ViewerState } from '@/shared/types/viewer.types'

export const viewerService = {
  createPhotoViewerState(project: Project, allPhotos: Project[]): ViewerState {
    const startIndex = Math.max(0, allPhotos.findIndex((item) => item.id === project.id))

    return {
      media: allPhotos.map((item) => ({
        ...item.media[0],
        title: item.title,
        category: item.category,
      })),
      startIndex,
      title: project.title,
      category: project.category,
      year: project.year,
    }
  },

  createVideoViewerState(startIndex: number, userInitiated = false): ViewerState {
    const video = videos[startIndex]

    return {
      media: videos.map((item) => ({
        type: 'video' as const,
        url: item.url,
        alt: item.title,
        title: item.title,
        category: item.category,
      })),
      startIndex,
      title: video.title,
      category: video.category,
      year: '2025',
      userInitiated,
    }
  },
}

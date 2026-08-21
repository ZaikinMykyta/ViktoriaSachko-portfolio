import { photos } from '@/entities/project'
import { videos } from '@/entities/video'

export const portfolioService = {
  getPhotos: () => photos,
  getVideos: () => videos,
  getHeroImage: () => photos[0]?.cover ?? '',
}

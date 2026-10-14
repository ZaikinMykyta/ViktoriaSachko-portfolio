import type { VideoItem } from '@/entities/video/model/types'
import { publicAsset } from '@/shared/lib/public-asset'

export const videos: VideoItem[] = [
  {
    title: 'RICHARD QUIIN\nLFWSS27',
    category: 'Fashion film',
    url: publicAsset('/videos/Richard_Quiin.mp4'),
    poster: publicAsset('/posters/Richard_Quiin.jpg'),
  },
  {
    title: 'FASHIONSCOUT\nLFWSS27',
    category: 'Fashion film',
    url: publicAsset('/videos/Londonscout.mp4'),
    poster: publicAsset('/posters/Londonscout.jpg'),
  },
  {
    title: 'STREETSTYLE FOR DREAMING ELI',
    category: 'Fashion film',
    url: publicAsset('/videos/Dreaming_Eli.mp4'),
    poster: publicAsset('/posters/Dreaming_Eli.jpg'),
  },
  {
    title: 'MBR`26\nCOLABORATION WITH LA TYANA',
    category: 'Short film',
    url: publicAsset('/videos/IMG_9284.mp4'),
    poster: publicAsset('/posters/IMG_9284.jpg'),
  },
  {
    title: 'FASHION SHOW ВІД GRUNGE STUDIO',
    category: 'Fashion film',
    url: publicAsset('/videos/IMG_4157.mp4'),
    poster: publicAsset('/posters/IMG_4157.jpg'),
  },
]

import type { VideoItem } from '@/entities/video/model/types'
import { publicAsset } from '@/shared/lib/public-asset'

export const videos: VideoItem[] = [
  {
    title: 'MBR`26\nКОЛАБОРАЦІЯ З БРЕНДОМ LA TYANA',
    category: 'Short film',
    url: publicAsset('/videos/IMG_9284.mov'),
  },
  {
    title: 'FASHION SHOW ВІД SOUL BRUNCHES\n(ПРЕЗЕНТАЦІЯ У ЧЕРВНІ 2026)',
    category: 'Short film',
    url: publicAsset('/videos/IMG_7153.mov'),
  },
  {
    title: 'FASHION SHOW ВІД GRUNGE STUDIO',
    category: 'Fashion film',
    url: publicAsset('/videos/IMG_4157.mov'),
  },
]

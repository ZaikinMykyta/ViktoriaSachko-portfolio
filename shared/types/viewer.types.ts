import type { Media } from '@/entities/project'

export type ViewerState = {
  media: Media[]
  startIndex: number
  title: string
  category: string
  year: string
}

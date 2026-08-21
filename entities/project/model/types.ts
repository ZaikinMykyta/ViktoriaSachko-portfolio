export type Media = {
  type: 'image' | 'video'
  url: string
  alt: string
  title?: string
  category?: string
  poster?: string
}

export type Project = {
  id: string
  title: string
  category: string
  year: string
  cover: string
  media: Media[]
}

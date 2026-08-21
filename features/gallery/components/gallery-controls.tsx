import { ChevronLeft, ChevronRight } from 'lucide-react'

export function GalleryControls() {
  return (
    <div className="gallery-nav">
      <button type="button" className="gallery-btn gallery-prev" aria-label="Попереднє фото">
        <ChevronLeft />
      </button>
      <button type="button" className="gallery-btn gallery-next" aria-label="Наступне фото">
        <ChevronRight />
      </button>
    </div>
  )
}

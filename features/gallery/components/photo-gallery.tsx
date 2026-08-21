'use client'

import { useEffect, useState } from 'react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import type { Project } from '@/entities/project'
import { GalleryControls } from '@/features/gallery/components/gallery-controls'
import { gallerySwiperConfig } from '@/features/gallery/config/swiper.config'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type PhotoGalleryProps = {
  photos: Project[]
  onOpen: (project: Project) => void
  paused: boolean
}

export function PhotoGallery({ photos, onOpen, paused }: PhotoGalleryProps) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const current = photos[activeIndex]

  useEffect(() => {
    if (!swiper?.autoplay) return
    if (paused) swiper.autoplay.stop()
    else swiper.autoplay.start()
  }, [paused, swiper])

  return (
    <div className="gallery">
      <div className="gallery-head">
        <div>
          <h3 className="gallery-title">{current.title}</h3>
          <p className="gallery-subtitle">{current.category}</p>
        </div>
        <GalleryControls />
      </div>

      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        onSwiper={setSwiper}
        onSlideChange={(instance) => setActiveIndex(instance.realIndex)}
        slidesPerView={gallerySwiperConfig.slidesPerView}
        spaceBetween={gallerySwiperConfig.spaceBetween}
        speed={gallerySwiperConfig.speed}
        grabCursor
        loop={photos.length > 2}
        autoplay={{
          delay: gallerySwiperConfig.autoplayDelay,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{ clickable: true, el: '.gallery-pagination' }}
        navigation={{ prevEl: '.gallery-prev', nextEl: '.gallery-next' }}
        breakpoints={gallerySwiperConfig.breakpoints}
        className="gallery-swiper"
      >
        {photos.map((photo) => (
          <SwiperSlide key={photo.id}>
            <button
              type="button"
              className="gallery-card"
              onClick={() => onOpen(photo)}
              aria-label={`Відкрити ${photo.title}`}
            >
              <img src={photo.cover} alt={photo.media[0].alt} loading="lazy" />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="gallery-pagination" />
    </div>
  )
}

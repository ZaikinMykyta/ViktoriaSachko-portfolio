export const gallerySwiperConfig = {
  slidesPerView: 1.15,
  spaceBetween: 16,
  speed: 500,
  autoplayDelay: 4000,
  breakpoints: {
    640: { slidesPerView: 2, spaceBetween: 16 },
    1024: { slidesPerView: 3, spaceBetween: 20 },
  },
} as const

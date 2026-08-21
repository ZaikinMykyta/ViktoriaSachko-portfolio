const posterCache = new Map<string, string>()

export function captureVideoFrame(src: string, seekTime = 0.1): Promise<string> {
  const cached = posterCache.get(src)
  if (cached) return Promise.resolve(cached)

  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.src = src

    const cleanup = () => {
      video.pause()
      video.removeAttribute('src')
      video.load()
    }

    video.addEventListener(
      'error',
      () => {
        cleanup()
        reject(new Error(`Failed to load video: ${src}`))
      },
      { once: true },
    )

    video.addEventListener(
      'loadeddata',
      () => {
        const targetTime = video.duration ? Math.min(seekTime, video.duration / 2) : seekTime
        video.currentTime = targetTime
      },
      { once: true },
    )

    video.addEventListener(
      'seeked',
      () => {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = video.videoWidth || 1280
          canvas.height = video.videoHeight || 720
          const context = canvas.getContext('2d')

          if (!context) {
            throw new Error('Canvas context unavailable')
          }

          context.drawImage(video, 0, 0, canvas.width, canvas.height)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.82)
          posterCache.set(src, dataUrl)
          cleanup()
          resolve(dataUrl)
        } catch (error) {
          cleanup()
          reject(error)
        }
      },
      { once: true },
    )
  })
}

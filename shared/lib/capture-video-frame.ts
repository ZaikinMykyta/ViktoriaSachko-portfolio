const posterCache = new Map<string, string>()

function appendToDom(video: HTMLVideoElement) {
  video.style.cssText =
    'position:fixed;opacity:0;pointer-events:none;width:1px;height:1px;left:-9999px;top:-9999px'
  document.body.appendChild(video)
}

export function captureVideoFrame(src: string, seekTime = 0.1): Promise<string> {
  const cached = posterCache.get(src)
  if (cached) return Promise.resolve(cached)

  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    video.preload = 'auto'
    video.crossOrigin = 'anonymous'
    appendToDom(video)

    let settled = false

    const finish = (action: 'resolve' | 'reject', value?: string | Error) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeoutId)
      video.pause()
      video.removeAttribute('src')
      video.load()
      video.remove()

      if (action === 'resolve' && value) resolve(value)
      else reject(value ?? new Error(`Failed to load video: ${src}`))
    }

    const capture = () => {
      try {
        const width = video.videoWidth
        const height = video.videoHeight

        if (!width || !height) {
          throw new Error('Video dimensions unavailable')
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const context = canvas.getContext('2d')

        if (!context) {
          throw new Error('Canvas context unavailable')
        }

        context.drawImage(video, 0, 0, width, height)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82)
        posterCache.set(src, dataUrl)
        finish('resolve', dataUrl)
      } catch (error) {
        finish('reject', error instanceof Error ? error : new Error('Capture failed'))
      }
    }

    const seekToPreview = () => {
      const targetTime =
        video.duration && Number.isFinite(video.duration)
          ? Math.min(seekTime, video.duration / 2)
          : 0

      if (targetTime <= 0) {
        requestAnimationFrame(capture)
        return
      }

      video.addEventListener('seeked', () => requestAnimationFrame(capture), { once: true })
      video.currentTime = targetTime
    }

    video.addEventListener(
      'error',
      () => finish('reject', new Error(`Failed to load video: ${src}`)),
      { once: true },
    )

    video.addEventListener('loadedmetadata', seekToPreview, { once: true })

    const timeoutId = window.setTimeout(() => {
      if (settled) return

      if (video.readyState >= 2 && video.videoWidth > 0) {
        capture()
        return
      }

      finish('reject', new Error(`Video thumbnail timeout: ${src}`))
    }, 12000)

    video.src = src
    video.load()
  })
}

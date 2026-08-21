'use client'

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Maximize2, Pause, Play, Volume2, VolumeX } from 'lucide-react'

export type VideoPlayerHandle = {
  playWithSound: () => Promise<void>
}

type VideoPlayerProps = {
  src: string
  keyId: string
  autoPlay?: boolean
  manualStart?: boolean
}

function applyVolume(video: HTMLVideoElement, level: number) {
  const clamped = Math.min(1, Math.max(0, level))

  if (clamped <= 0) {
    video.muted = true
    video.volume = 0
    return
  }

  video.muted = false
  video.volume = clamped
}

export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(function VideoPlayer(
  { src, keyId, autoPlay = true, manualStart = false },
  ref,
) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isScrubbingProgress = useRef(false)
  const isScrubbingVolume = useRef(false)

  const applyAudio = useCallback((video: HTMLVideoElement, level = volume) => {
    applyVolume(video, level)
  }, [volume])

  const playWithSound = useCallback(async () => {
    const video = videoRef.current
    if (!video) return

    applyAudio(video)

    try {
      await video.play()
      setPlaying(true)
    } catch {
      try {
        video.muted = true
        await video.play()
        applyAudio(video)
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    }
  }, [applyAudio])

  useImperativeHandle(ref, () => ({ playWithSound }), [playWithSound])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    applyVolume(video, volume)
  }, [volume])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setPlaying(false)
    setProgress(0)

    if (!autoPlay || manualStart) return

    const startPlayback = async () => {
      try {
        applyAudio(video)
        await video.play()
        setPlaying(true)
        return
      } catch {
        // Fallback: muted autoplay if the browser blocks unmuted start.
      }

      try {
        video.muted = true
        await video.play()
        applyAudio(video)
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    }

    if (video.readyState >= 2) {
      void startPlayback()
      return
    }

    video.addEventListener('loadeddata', startPlayback, { once: true })
    return () => video.removeEventListener('loadeddata', startPlayback)
  }, [keyId, src, autoPlay, manualStart, applyAudio])

  const togglePlay = async () => {
    const video = videoRef.current
    if (!video) return

    if (playing) {
      if (video.muted) {
        applyAudio(video)
        return
      }

      video.pause()
      setPlaying(false)
      return
    }

    await playWithSound()
  }

  const handleVideoPointerDown = () => {
    const video = videoRef.current
    if (!video) return

    if (video.muted && playing) {
      applyAudio(video)
      return
    }

    if (!playing) {
      void playWithSound()
    }
  }

  const handleProgressInput = (value: number) => {
    const video = videoRef.current
    if (!video?.duration) return

    video.currentTime = (value / 100) * video.duration
    setProgress(value)
  }

  const handleVolumeInput = (value: number) => {
    setVolume(value)
    if (videoRef.current) {
      applyVolume(videoRef.current, value)
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    const nextVolume = volume > 0 ? 0 : 1

    setVolume(nextVolume)
    if (video) {
      applyVolume(video, nextVolume)
    }
  }

  const stopVolumeScrub = (event: React.PointerEvent<HTMLInputElement>) => {
    event.stopPropagation()
    isScrubbingVolume.current = false
  }

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        key={keyId}
        src={src}
        playsInline
        preload="auto"
        onTimeUpdate={() => {
          if (isScrubbingProgress.current || isScrubbingVolume.current) return

          const video = videoRef.current
          if (video) {
            setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0)
          }
        }}
        onEnded={() => setPlaying(false)}
        onPointerDown={handleVideoPointerDown}
      />
      <div className="video-controls">
        <button
          type="button"
          onPointerDown={(event) => {
            event.preventDefault()
            void togglePlay()
          }}
          aria-label={playing ? 'Пауза' : 'Відтворити'}
        >
          {playing ? <Pause /> : <Play />}
        </button>
        <input
          aria-label="Прогрес відео"
          className="video-progress"
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={progress}
          onPointerDown={() => {
            isScrubbingProgress.current = true
          }}
          onPointerUp={() => {
            isScrubbingProgress.current = false
          }}
          onPointerCancel={() => {
            isScrubbingProgress.current = false
          }}
          onInput={(event) => {
            event.stopPropagation()
            handleProgressInput(Number(event.currentTarget.value))
          }}
          onChange={(event) => {
            event.stopPropagation()
            handleProgressInput(Number(event.currentTarget.value))
          }}
        />
        <div className="video-volume-desktop">
          {volume > 0 ? <Volume2 /> : <VolumeX />}
          <input
            aria-label="Гучність"
            className="video-volume"
            type="range"
            min={0}
            max={100}
            step={1}
            value={Math.round(volume * 100)}
            onPointerDown={(event) => {
              event.stopPropagation()
              isScrubbingVolume.current = true
            }}
            onPointerUp={stopVolumeScrub}
            onPointerCancel={stopVolumeScrub}
            onInput={(event) => {
              event.stopPropagation()
              handleVolumeInput(Number(event.currentTarget.value) / 100)
            }}
            onChange={(event) => {
              event.stopPropagation()
              handleVolumeInput(Number(event.currentTarget.value) / 100)
            }}
          />
        </div>
        <button
          type="button"
          className="video-mute-mobile"
          onPointerDown={(event) => {
            event.preventDefault()
            event.stopPropagation()
            toggleMute()
          }}
          aria-label={volume > 0 ? 'Вимкнути звук' : 'Увімкнути звук'}
        >
          {volume > 0 ? <Volume2 /> : <VolumeX />}
        </button>
        <button type="button" onClick={() => videoRef.current?.requestFullscreen()} aria-label="На весь екран">
          <Maximize2 />
        </button>
      </div>
    </div>
  )
})

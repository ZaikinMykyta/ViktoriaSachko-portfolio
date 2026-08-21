'use client'

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Maximize2, Pause, Play, Volume2 } from 'lucide-react'

export type VideoPlayerHandle = {
  playWithSound: () => Promise<void>
}

type VideoPlayerProps = {
  src: string
  keyId: string
  autoPlay?: boolean
  manualStart?: boolean
}

export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(function VideoPlayer(
  { src, keyId, autoPlay = true, manualStart = false },
  ref,
) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const videoRef = useRef<HTMLVideoElement>(null)

  const applyAudio = useCallback((video: HTMLVideoElement, level = volume) => {
    video.muted = false
    video.volume = level
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
    video.volume = volume
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

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        key={keyId}
        src={src}
        playsInline
        preload="auto"
        onTimeUpdate={() => {
          const video = videoRef.current
          if (video) setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0)
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
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(event) => {
            const video = videoRef.current
            if (video?.duration) {
              video.currentTime = (Number(event.target.value) / 100) * video.duration
              setProgress(Number(event.target.value))
            }
          }}
        />
        <Volume2 />
        <input
          aria-label="Гучність"
          className="volume"
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={volume}
          onChange={(event) => {
            const value = Number(event.target.value)
            setVolume(value)
            if (videoRef.current) {
              applyAudio(videoRef.current, value)
            }
          }}
        />
        <button type="button" onClick={() => videoRef.current?.requestFullscreen()} aria-label="На весь екран">
          <Maximize2 />
        </button>
      </div>
    </div>
  )
})

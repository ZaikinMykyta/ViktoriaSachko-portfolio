'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Maximize2, Pause, Play, Volume2 } from 'lucide-react'

type VideoPlayerProps = {
  src: string
  keyId: string
  autoPlay?: boolean
}

export function VideoPlayer({ src, keyId, autoPlay = true }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const videoRef = useRef<HTMLVideoElement>(null)

  const applyAudio = useCallback((video: HTMLVideoElement, level = volume) => {
    video.muted = false
    video.volume = level
  }, [volume])

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

    if (!autoPlay) return

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
  }, [keyId, src, autoPlay, applyAudio])

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

    try {
      applyAudio(video)
      await video.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }

  const handleVideoClick = () => {
    const video = videoRef.current
    if (!video) return

    if (video.muted && playing) {
      applyAudio(video)
      return
    }

    void togglePlay()
  }

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        key={keyId}
        src={src}
        playsInline
        onTimeUpdate={() => {
          const video = videoRef.current
          if (video) setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0)
        }}
        onEnded={() => setPlaying(false)}
        onClick={handleVideoClick}
      />
      <div className="video-controls">
        <button type="button" onClick={() => void togglePlay()} aria-label={playing ? 'Пауза' : 'Відтворити'}>
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
}

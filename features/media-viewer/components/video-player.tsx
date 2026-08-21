'use client'

import { useEffect, useRef, useState } from 'react'
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

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setPlaying(false)
    setProgress(0)

    if (!autoPlay) return

    const startPlayback = async () => {
      try {
        await video.play()
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
  }, [keyId, src, autoPlay])

  const togglePlay = async () => {
    const video = videoRef.current
    if (!video) return

    if (playing) {
      video.pause()
      setPlaying(false)
      return
    }

    try {
      await video.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        key={keyId}
        src={src}
        playsInline
        muted={autoPlay}
        onTimeUpdate={() => {
          const video = videoRef.current
          if (video) setProgress(video.duration ? (video.currentTime / video.duration) * 100 : 0)
        }}
        onEnded={() => setPlaying(false)}
        onClick={togglePlay}
      />
      <div className="video-controls">
        <button type="button" onClick={togglePlay} aria-label={playing ? 'Пауза' : 'Відтворити'}>
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
              videoRef.current.muted = false
              videoRef.current.volume = value
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

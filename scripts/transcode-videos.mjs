import { execSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourceDir = path.join(root, 'videos-source')
const outputDir = path.join(root, 'public', 'videos')

/** Max width for web delivery — 4K sources are scaled down to 1080p. */
const MAX_WIDTH = 1920
const CRF = 23
const AUDIO_BITRATE = '128k'

function hasFfmpeg() {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

function isVideoFile(name) {
  return /\.(mov|mp4|m4v|mkv|webm)$/i.test(name)
}

function needsTranscode(sourcePath, outputPath) {
  if (!fs.existsSync(outputPath)) return true

  const sourceStat = fs.statSync(sourcePath)
  const outputStat = fs.statSync(outputPath)
  return sourceStat.mtimeMs > outputStat.mtimeMs
}

function collectSources() {
  const sources = new Map()

  for (const dir of [sourceDir, outputDir]) {
    if (!fs.existsSync(dir)) continue

    for (const file of fs.readdirSync(dir)) {
      if (!isVideoFile(file)) continue
      if (file.toLowerCase().endsWith('.mp4') && dir === outputDir) continue

      const fullPath = path.join(dir, file)
      const baseName = path.parse(file).name
      if (!sources.has(baseName)) {
        sources.set(baseName, fullPath)
      }
    }
  }

  return sources
}

function transcode(inputPath, outputPath) {
  console.log(`Transcoding → ${path.basename(outputPath)}`)

  const result = spawnSync(
    'ffmpeg',
    [
      '-y',
      '-i',
      inputPath,
      '-vf',
      `scale='min(${MAX_WIDTH},iw)':-2`,
      '-c:v',
      'libx264',
      '-preset',
      'medium',
      '-crf',
      String(CRF),
      '-c:a',
      'aac',
      '-b:a',
      AUDIO_BITRATE,
      '-movflags',
      '+faststart',
      outputPath,
    ],
    { stdio: 'inherit' },
  )

  return result.status === 0
}

if (!hasFfmpeg()) {
  console.log('ffmpeg not found — skipping video transcoding')
  console.log('Install: https://ffmpeg.org/download.html')
  process.exit(0)
}

fs.mkdirSync(sourceDir, { recursive: true })
fs.mkdirSync(outputDir, { recursive: true })

const sources = collectSources()

if (sources.size === 0) {
  console.log('No source videos found')
  process.exit(0)
}

let failed = 0

for (const [baseName, inputPath] of sources) {
  const outputPath = path.join(outputDir, `${baseName}.mp4`)

  if (!needsTranscode(inputPath, outputPath)) {
    continue
  }

  if (!transcode(inputPath, outputPath)) {
    console.warn(`Failed to transcode: ${inputPath}`)
    failed += 1
  }
}

if (failed > 0) {
  process.exit(1)
}

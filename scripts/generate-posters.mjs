import { execSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const videosDir = path.join(root, 'public', 'videos')
const postersDir = path.join(root, 'public', 'posters')

function hasFfmpeg() {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

if (!hasFfmpeg()) {
  console.log('ffmpeg not found — skipping video poster generation')
  process.exit(0)
}

if (!fs.existsSync(videosDir)) {
  console.log('No videos directory — skipping poster generation')
  process.exit(0)
}

fs.mkdirSync(postersDir, { recursive: true })

const videos = fs
  .readdirSync(videosDir)
  .filter((file) => /\.(mov|mp4|webm)$/i.test(file))

for (const video of videos) {
  const baseName = path.parse(video).name
  const posterPath = path.join(postersDir, `${baseName}.jpg`)
  const videoPath = path.join(videosDir, video)

  if (fs.existsSync(posterPath)) {
    continue
  }

  console.log(`Generating poster: ${baseName}.jpg`)

  const result = spawnSync(
    'ffmpeg',
    ['-y', '-i', videoPath, '-ss', '00:00:00.100', '-vframes', '1', '-q:v', '2', posterPath],
    { stdio: 'inherit' },
  )

  if (result.status !== 0) {
    console.warn(`Failed to generate poster for ${video}`)
  }
}

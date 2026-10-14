import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

function normalizeDir(relativeDir) {
  const dir = path.join(root, relativeDir)
  if (!fs.existsSync(dir)) return

  for (const entry of fs.readdirSync(dir)) {
    if (!/\.JPG$/.test(entry)) continue

    const from = path.join(dir, entry)
    const targetName = entry.replace(/\.JPG$/, '.jpg')
    const to = path.join(dir, targetName)

    if (from === to) continue

    if (fs.existsSync(to)) {
      console.warn(`Skip ${entry}: ${targetName} already exists`)
      continue
    }

    fs.renameSync(from, to)
    console.log(`Renamed: ${entry} → ${targetName}`)
  }
}

normalizeDir('assets/photos')
normalizeDir('assets/about')

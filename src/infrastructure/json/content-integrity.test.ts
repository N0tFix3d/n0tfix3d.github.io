import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { loadArchive } from '@application/load-archive'
import { createRepositories } from '@composition/create-repositories'
import { JsonDisclosureRepository } from '@infrastructure/json/json-disclosure-repository'
import { blogPostSchema, disclosureDocumentSchema, recognitionFileSchema } from '@infrastructure/json/schemas'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') return []
    const fullPath = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(fullPath) : [fullPath]
  })
}

describe('disclosure JSON on disk', () => {
  it('matches the repository, and every figure and markdown note exists', async () => {
    const files = walk(root).filter((file) => /CVE-\d{4}-\d+\.json$/.test(file))
    expect(files.length).toBeGreaterThan(0)

    const documents = files.map((file) => {
      const parsed = disclosureDocumentSchema.parse(JSON.parse(readFileSync(file, 'utf8')))
      expect(existsSync(path.join(root, parsed.readmePath)), parsed.readmePath).toBe(true)
      for (const section of parsed.sections) {
        for (const block of section.blocks) {
          if (block.type !== 'image') continue
          const figure = path.join(root, block.src)
          expect(statSync(figure).isFile(), block.src).toBe(true)
        }
      }
      return parsed.id
    })

    const loaded = await new JsonDisclosureRepository().list()
    expect(loaded.map((item) => item.id).sort()).toEqual([...documents].sort())
  })

  it('loads a consistent archive through the JSON adapters', async () => {
    const snapshot = await loadArchive(createRepositories())
    expect(snapshot.disclosures.length).toBeGreaterThanOrEqual(4)
    expect(snapshot.catalog.severities.map((level) => level.id)).toContain('critical')
    expect(snapshot.profile.handle).toBe('HiddenCry')
    expect(snapshot.posts.map((post) => post.id)).toContain('how-a-disclosure-moves')
    expect(JSON.stringify(snapshot.profile)).not.toMatch(/@/)
  })

  it('keeps blog posts and recognitions aligned with the files on disk', () => {
    const profileRaw = readFileSync(path.join(root, 'content/profile.json'), 'utf8')
    expect(profileRaw).not.toMatch(/@/)

    const recognitions = recognitionFileSchema.parse(
      JSON.parse(readFileSync(path.join(root, 'content/recognitions.json'), 'utf8')),
    )
    for (const item of recognitions.items) {
      expect(statSync(path.join(root, item.proof.src)).isFile(), item.proof.src).toBe(true)
    }

    const posts = walk(path.join(root, 'content/blog')).filter((file) => file.endsWith('.json'))
    expect(posts.length).toBeGreaterThan(0)
    for (const file of posts) {
      const parsed = blogPostSchema.parse(JSON.parse(readFileSync(file, 'utf8')))
      expect(path.basename(file, '.json')).toBe(parsed.id)
      for (const section of parsed.sections) {
        for (const block of section.blocks) {
          if (block.type !== 'image') continue
          expect(statSync(path.join(root, block.src)).isFile(), block.src).toBe(true)
        }
      }
    }
  })
})

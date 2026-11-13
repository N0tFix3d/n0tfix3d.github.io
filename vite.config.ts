import { copyFileSync, createReadStream, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

const root = path.dirname(fileURLToPath(import.meta.url))
const productRoots = ['YesWiki', 'BluditCMS', 'phpMyFAQ']
const imagePattern = /\.(png|jpe?g|gif|webp)$/i

function walkFiles(directory: string): string[] {
  if (!existsSync(directory)) return []
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name)
    return entry.isDirectory() ? walkFiles(fullPath) : [fullPath]
  })
}

function evidenceFiles(): string[] {
  const productImages = productRoots
    .flatMap((product) => walkFiles(path.join(root, product)))
    .filter((file) => imagePattern.test(file))
  const contentImages = walkFiles(path.join(root, 'content')).filter((file) => imagePattern.test(file))
  return [...productImages, ...contentImages]
}

function contentType(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase()
  if (extension === '.png') return 'image/png'
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg'
  if (extension === '.gif') return 'image/gif'
  if (extension === '.webp') return 'image/webp'
  return 'application/octet-stream'
}

function evidencePlugin(): Plugin {
  return {
    name: 'disclosure-evidence',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const rawUrl = request.url?.split('?')[0]
        if (!rawUrl) return next()
        const marker = '/evidence/'
        const markerIndex = rawUrl.indexOf(marker)
        if (markerIndex === -1) return next()

        const relativePath = decodeURIComponent(rawUrl.slice(markerIndex + marker.length))
        if (relativePath.includes('..') || path.isAbsolute(relativePath)) return next()

        const filePath = path.resolve(root, relativePath)
        const relativeToRoot = path.relative(root, filePath)
        if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) return next()
        if (!existsSync(filePath) || !statSync(filePath).isFile() || !imagePattern.test(filePath)) return next()

        response.statusCode = 200
        response.setHeader('Content-Type', contentType(filePath))
        createReadStream(filePath).pipe(response)
      })
    },
    closeBundle() {
      const outDir = path.resolve(root, 'dist')
      for (const filePath of evidenceFiles()) {
        const destination = path.join(outDir, 'evidence', path.relative(root, filePath))
        mkdirSync(path.dirname(destination), { recursive: true })
        copyFileSync(filePath, destination)
      }
    },
  }
}

function pagesFallbackPlugin(): Plugin {
  return {
    name: 'github-pages-fallback',
    apply: 'build',
    closeBundle() {
      const indexPath = path.resolve(root, 'dist', 'index.html')
      if (existsSync(indexPath)) copyFileSync(indexPath, path.resolve(root, 'dist', '404.html'))
    },
  }
}

export default defineConfig(() => ({
  base: '/',
  plugins: [react(), tsconfigPaths(), evidencePlugin(), pagesFallbackPlugin()],
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 700,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
}))

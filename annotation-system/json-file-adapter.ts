'use server'
import fs from 'fs'
import path from 'path'
import type { Annotation, Comment, AnnotationStore } from './types'
import type { AnnotationAdapter } from './adapter'

export interface JsonFileAdapterOptions {
  filePath?: string
}

export function createJsonFileAdapter(options: JsonFileAdapterOptions = {}): AnnotationAdapter {
  const DATA_PATH =
    options.filePath ||
    process.env.ANNOTATION_SYSTEM_DATA_PATH ||
    path.join(process.cwd(), 'data/annotations.json')

  let store: AnnotationStore | null = null

  function ensureDataDir() {
    const dir = path.dirname(DATA_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }

  function loadStore(): AnnotationStore {
    if (store) return store
    ensureDataDir()
    try {
      const data = fs.readFileSync(DATA_PATH, 'utf-8')
      store = JSON.parse(data) as AnnotationStore
    } catch {
      store = { annotations: [], comments: [] }
      saveStore()
    }
    return store
  }

  function saveStore() {
    if (!store) return
    ensureDataDir()
    fs.writeFileSync(DATA_PATH, JSON.stringify(store, null, 2))
  }

  return {
    async getAnnotationsByPage(page, context = 'default') {
      const s = loadStore()
      return s.annotations.filter((a) => a.page === page && (a.context || 'default') === context)
    },
    async getAnnotationById(id) {
      const s = loadStore()
      return s.annotations.find((a) => a.id === id)
    },
    async createAnnotation(data) {
      const s = loadStore()
      const ann: Annotation = { ...data, id: crypto.randomUUID(), createdAt: Date.now() }
      s.annotations.push(ann)
      saveStore()
      return ann
    },
    async updateAnnotation(id, updates) {
      const s = loadStore()
      const i = s.annotations.findIndex((a) => a.id === id)
      if (i === -1) return undefined
      s.annotations[i] = { ...s.annotations[i], ...updates }
      saveStore()
      return s.annotations[i]
    },
    async deleteAnnotation(id) {
      const s = loadStore()
      const len = s.annotations.length
      s.annotations = s.annotations.filter((a) => a.id !== id)
      s.comments = s.comments.filter((c) => c.annotationId !== id)
      saveStore()
      return s.annotations.length !== len
    },
    async getCommentsByAnnotationId(annotationId) {
      const s = loadStore()
      return s.comments
        .filter((c) => c.annotationId === annotationId)
        .sort((a, b) => a.createdAt - b.createdAt)
    },
    async createComment(data) {
      const s = loadStore()
      const c: Comment = { ...data, id: crypto.randomUUID(), createdAt: Date.now() }
      s.comments.push(c)
      saveStore()
      return c
    },
    async deleteComment(id) {
      const s = loadStore()
      const ids = new Set<string>()
      const queue = [id]
      while (queue.length > 0) {
        const cur = queue.shift()
        if (!cur || ids.has(cur)) continue
        ids.add(cur)
        s.comments.forEach((c) => { if (c.parentId === cur) queue.push(c.id) })
      }
      const len = s.comments.length
      s.comments = s.comments.filter((c) => !ids.has(c.id))
      saveStore()
      return s.comments.length !== len
    },
  }
}

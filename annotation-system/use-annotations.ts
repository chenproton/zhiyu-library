import { useState, useEffect, useCallback } from 'react'
import type { Annotation, Comment, AnnotationMode, UseAnnotationsConfig } from './types'

const STORAGE_KEY_MODE = '@annotation-system/mode'
const STORAGE_KEY_USER = '@annotation-system/user'

function getLocalStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(key)
}

function setLocalStorageItem(key: string, value: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value)
  }
}

export function useAnnotations(config: UseAnnotationsConfig) {
  const { page, context, apiBasePath, defaultMode, currentUser: propUser } = config

  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [comments, setComments] = useState<Record<string, Comment[]>>({})
  const [mode, setModeState] = useState<AnnotationMode>(() => {
    const stored = getLocalStorageItem(STORAGE_KEY_MODE)
    return (stored as AnnotationMode) || defaultMode
  })
  const [user, setUser] = useState(() => {
    if (propUser) return propUser
    return getLocalStorageItem(STORAGE_KEY_USER) || 'Anonymous'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { setLocalStorageItem(STORAGE_KEY_MODE, mode) }, [mode])
  useEffect(() => {
    if (propUser) {
      setUser(propUser)
    } else {
      setLocalStorageItem(STORAGE_KEY_USER, user)
    }
  }, [propUser, user])

  useEffect(() => {
    if (!page) return
    setLoading(true)
    setError(null)
    fetch(`${apiBasePath}/annotations?page=${encodeURIComponent(page)}&context=${encodeURIComponent(context || 'default')}`)
      .then((res) => { if (!res.ok) throw new Error('Failed'); return res.json() })
      .then((data) => setAnnotations(data))
      .catch((err) => { console.error(err); setError('Failed to load annotations') })
      .finally(() => setLoading(false))
  }, [page, context, apiBasePath])

  const setMode = useCallback((newMode: AnnotationMode) => setModeState(newMode), [])

  const refreshAnnotations = useCallback(() => {
    if (!page) return
    fetch(`${apiBasePath}/annotations?page=${encodeURIComponent(page)}&context=${encodeURIComponent(context || 'default')}`)
      .then((res) => res.json())
      .then((data) => setAnnotations(data))
      .catch(console.error)
  }, [page, context, apiBasePath])

  const refreshComments = useCallback((annotationId: string) => {
    fetch(`${apiBasePath}/comments?annotationId=${encodeURIComponent(annotationId)}`)
      .then((res) => res.json())
      .then((data) => setComments((prev) => ({ ...prev, [annotationId]: data })))
      .catch(console.error)
  }, [apiBasePath])

  const createAnnotation = useCallback(async (x: number, y: number, content: string, imageUrl?: string) => {
    const res = await fetch(`${apiBasePath}/annotations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page, context, x, y, content, imageUrl }),
    })
    if (res.ok) await refreshAnnotations()
  }, [page, context, apiBasePath, refreshAnnotations])

  const updateAnnotation = useCallback(async (id: string, updates: Partial<Pick<Annotation, 'x' | 'y' | 'content' | 'imageUrl' | 'closed'>>) => {
    const res = await fetch(`${apiBasePath}/annotations`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    })
    if (res.ok) await refreshAnnotations()
  }, [apiBasePath, refreshAnnotations])

  const deleteAnnotation = useCallback(async (id: string) => {
    const res = await fetch(`${apiBasePath}/annotations?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (res.ok) {
      await refreshAnnotations()
      setComments((prev) => { const next = { ...prev }; delete next[id]; return next })
    }
  }, [apiBasePath, refreshAnnotations])

  const createComment = useCallback(async (annotationId: string, text: string, parentId?: string | null, imageUrl?: string) => {
    const res = await fetch(`${apiBasePath}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ annotationId, user, text, parentId, imageUrl }),
    })
    if (res.ok) await refreshComments(annotationId)
  }, [apiBasePath, user, refreshComments])

  const deleteComment = useCallback(async (id: string, annotationId: string) => {
    const res = await fetch(`${apiBasePath}/comments?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (res.ok) await refreshComments(annotationId)
  }, [apiBasePath, refreshComments])

  return {
    annotations, comments, mode, setMode, user, setUser,
    loading, error, createAnnotation, updateAnnotation,
    deleteAnnotation, createComment, deleteComment, refreshComments,
  }
}

'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAnnotations } from '../use-annotations'
import { AnnotationLayer } from './annotation-layer'
import { AnnotationController } from './annotation-controller'
import type { AnnotationSystemProps } from '../types'

export function AnnotationSystem({
  page: pageProp,
  context = 'default',
  apiBasePath = '/api',
  defaultMode = 'view',
  currentUser,
  zIndex = 2147483647,
  theme,
  onModeChange,
  hideController = false,
  fixed = false,
  containerRef,
}: AnnotationSystemProps & { hideController?: boolean; containerRef?: React.RefObject<HTMLElement | null> }) {
  const pathname = usePathname()
  const [currentPath, setCurrentPath] = useState(pathname || '')

  useEffect(() => { setCurrentPath(pathname || '') }, [pathname])
  useEffect(() => {
    const handler = () => { if (typeof window !== 'undefined') setCurrentPath(window.location.pathname) }
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  const page = pageProp || currentPath
  const { annotations, comments, mode, setMode, user, setUser, loading,
    createAnnotation, updateAnnotation, deleteAnnotation,
    createComment, deleteComment, refreshComments } = useAnnotations({ page, context, apiBasePath, defaultMode, currentUser })

  useEffect(() => { onModeChange?.(mode) }, [mode, onModeChange])

  useEffect(() => {
    if (!hideController) return
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const k = e.key.toLowerCase()
      if (k === 'e') setMode('edit')
      else if (k === 'v') setMode('view')
      else if (k === 'o') setMode('off')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [hideController, setMode])

  return (
    <>
      <AnnotationLayer
        annotations={annotations} comments={comments} mode={mode} loading={loading}
        zIndex={zIndex} theme={theme} fixed={fixed} containerRef={containerRef}
        user={user} setUser={setUser} setMode={setMode}
        onCreateAnnotation={createAnnotation} onUpdateAnnotation={updateAnnotation}
        onDeleteAnnotation={deleteAnnotation} onCreateComment={createComment}
        onDeleteComment={deleteComment} onRefreshComments={refreshComments}
      />
      {!hideController && (
        <AnnotationController mode={mode} setMode={setMode} user={user} setUser={setUser}
          annotationCount={annotations.length} zIndex={zIndex} theme={theme} />
      )}
    </>
  )
}

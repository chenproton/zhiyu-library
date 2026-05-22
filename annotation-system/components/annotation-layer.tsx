'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { Annotation, AnnotationMode, Comment, AnnotationTheme } from '../types'
import { AnnotationEditor } from './annotation-editor'
import { CommentPanel } from './comment-panel'

interface AnnotationLayerProps {
  annotations: Annotation[]
  comments: { [key: string]: Comment[] }
  mode: AnnotationMode
  loading: boolean
  zIndex?: number
  theme?: AnnotationTheme
  fixed?: boolean
  containerRef?: React.RefObject<HTMLElement | null>
  user?: string
  setUser?: (user: string) => void
  setMode?: (mode: AnnotationMode) => void
  onCreateAnnotation: (x: number, y: number, content: string, imageUrl?: string) => void
  onUpdateAnnotation: (id: string, updates: Partial<Pick<Annotation, 'x' | 'y' | 'content' | 'imageUrl' | 'closed'>>) => void
  onDeleteAnnotation: (id: string) => void
  onCreateComment: (annotationId: string, text: string, parentId?: string | null, imageUrl?: string) => void
  onDeleteComment: (id: string, annotationId: string) => void
  onRefreshComments: (annotationId: string) => void
}

function isInteractiveElement(target: HTMLElement): boolean {
  return !!target.closest('button, input, textarea, select, a, [role="button"], [role="link"], label, [contenteditable="true"]')
}

export function AnnotationLayer({
  annotations, comments, mode, loading, zIndex = 2147483647, theme,
  fixed = false, containerRef, user, setUser, setMode,
  onCreateAnnotation, onUpdateAnnotation, onDeleteAnnotation,
  onCreateComment, onDeleteComment, onRefreshComments,
}: AnnotationLayerProps) {
  const [editorPosition, setEditorPosition] = useState<{ x: number; y: number } | null>(null)
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragAnnotationId, setDragAnnotationId] = useState<string | null>(null)
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null)
  const [showPanel, setShowPanel] = useState(false)
  const layerRef = useRef<HTMLDivElement>(null)
  const [docSize, setDocSize] = useState({ width: 0, height: 0 })
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)

  const primaryColor = theme?.primary ?? '#ff0000'

  // 当标注被删除时，自动更新选中状态
  useEffect(() => {
    if (selectedAnnotation && !annotations.find((a) => a.id === selectedAnnotation.id)) {
      if (annotations.length > 0) {
        setSelectedAnnotation(annotations[0])
        onRefreshComments(annotations[0].id)
      } else {
        setShowPanel(false)
        setSelectedAnnotation(null)
      }
    }
  }, [annotations, selectedAnnotation, onRefreshComments])

  // container 模式：等待 containerRef 指向有效 DOM
  useEffect(() => {
    if (!containerRef) return
    let rafId: number
    const check = () => {
      if (containerRef.current) {
        const el = containerRef.current
        if (window.getComputedStyle(el).position === 'static') el.style.position = 'relative'
        setPortalTarget(el)
      } else {
        rafId = requestAnimationFrame(check)
      }
    }
    check()
    return () => cancelAnimationFrame(rafId)
  }, [containerRef])

  // 全局模式：监听文档尺寸
  useEffect(() => {
    if (fixed || containerRef) return
    const update = () => {
      setDocSize({
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      })
    }
    update()
    window.addEventListener('resize', update)
    const observer = new MutationObserver(update)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => { window.removeEventListener('resize', update); observer.disconnect() }
  }, [fixed, containerRef])

  // ESC 关闭
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditorPosition(null); setShowPanel(false); setSelectedAnnotation(null)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const calcPosition = useCallback((clientX: number, clientY: number, pageX?: number, pageY?: number): { x: number; y: number } => {
    if (containerRef?.current) {
      const rect = containerRef.current.getBoundingClientRect()
      return {
        x: Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
        y: Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)),
      }
    }
    if (fixed) {
      return {
        x: Math.max(0, Math.min(100, (clientX / (window.innerWidth || 1)) * 100)),
        y: Math.max(0, Math.min(100, (clientY / (window.innerHeight || 1)) * 100)),
      }
    }
    const px = pageX ?? clientX + window.scrollX
    const py = pageY ?? clientY + window.scrollY
    return {
      x: Math.max(0, Math.min(100, (px / (docSize.width || document.documentElement.scrollWidth || 1)) * 100)),
      y: Math.max(0, Math.min(100, (py / (docSize.height || document.documentElement.scrollHeight || 1)) * 100)),
    }
  }, [fixed, containerRef, docSize])

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    if (mode !== 'edit') return
    const target = e.target as HTMLElement
    if (target.closest('.ann-dot') || target.closest('.ann-panel') || target.closest('.ann-editor')) return
    if (isInteractiveElement(target)) return
    const pos = calcPosition(e.clientX, e.clientY, e.pageX, e.pageY)
    setEditorPosition(pos)
  }, [mode, calcPosition])

  const handleEditorSave = useCallback((content: string, imageUrl?: string) => {
    if (editorPosition) onCreateAnnotation(editorPosition.x, editorPosition.y, content, imageUrl)
    setEditorPosition(null)
  }, [editorPosition, onCreateAnnotation])

  const handleAnnotationClick = useCallback((annotation: Annotation, e: React.MouseEvent) => {
    e.stopPropagation()
    if (mode === 'edit' && isDragging) return
    setSelectedAnnotation(annotation)
    setShowPanel(true)
    onRefreshComments(annotation.id)
  }, [mode, isDragging, onRefreshComments])

  const handleDragStart = useCallback((annotationId: string, e: React.MouseEvent | React.TouchEvent) => {
    if (mode !== 'edit') return
    e.stopPropagation()
    setIsDragging(true)
    setDragAnnotationId(annotationId)
    const ann = annotations.find((a) => a.id === annotationId)
    if (ann) setDragPosition({ x: ann.x, y: ann.y })
  }, [mode, annotations])

  useEffect(() => {
    if (!isDragging || !dragAnnotationId) return
    const handleMouseMove = (e: MouseEvent) => { setDragPosition(calcPosition(e.clientX, e.clientY, e.pageX, e.pageY)) }
    const handleTouchMove = (e: TouchEvent) => { const t = e.touches[0]; setDragPosition(calcPosition(t.clientX, t.clientY, t.pageX, t.pageY)) }
    const handleEnd = () => {
      if (dragPosition) onUpdateAnnotation(dragAnnotationId, { x: dragPosition.x, y: dragPosition.y })
      setIsDragging(false); setDragAnnotationId(null); setDragPosition(null)
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleEnd)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, dragAnnotationId, dragPosition, onUpdateAnnotation, calcPosition])

  const handleClosePanel = useCallback(() => { setShowPanel(false); setSelectedAnnotation(null) }, [])
  const handleSelectAnnotation = useCallback((annotation: Annotation) => {
    setSelectedAnnotation(annotation); onRefreshComments(annotation.id)
  }, [onRefreshComments])

  if (mode === 'off') return null

  const getAnnotationDisplayPosition = (annotation: Annotation) => {
    if (isDragging && dragAnnotationId === annotation.id && dragPosition) return dragPosition
    return { x: annotation.x, y: annotation.y }
  }

  const layerStyle: React.CSSProperties = containerRef
    ? { position: 'absolute', inset: 0, pointerEvents: mode === 'edit' ? 'auto' : 'none', zIndex }
    : fixed
      ? { position: 'fixed', inset: 0, pointerEvents: mode === 'edit' ? 'auto' : 'none', zIndex }
      : { position: 'absolute', top: 0, left: 0, width: docSize.width || '100%', height: docSize.height || '100vh', pointerEvents: mode === 'edit' ? 'auto' : 'none', zIndex }

  const editorWrapperStyle: React.CSSProperties = containerRef
    ? { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: zIndex + 500 }
    : fixed
      ? { position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: zIndex + 500 }
      : { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: zIndex + 500 }

  const layerContent = (
    <>
      <div ref={layerRef} onClick={handleContainerClick} style={layerStyle}>
        {loading && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ zIndex: zIndex + 500 }}>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              <span className="text-sm text-gray-600">加载标注中...</span>
            </div>
          </div>
        )}
        {mode === 'edit' && !loading && !editorPosition && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg text-sm pointer-events-none" style={{ zIndex: zIndex + 100 }}>
            点击页面任意位置创建标注
          </div>
        )}
        {annotations.map((annotation, index) => {
          const pos = getAnnotationDisplayPosition(annotation)
          const isClosed = annotation.closed
          const dotColor = isClosed ? '#9ca3af' : primaryColor
          return (
            <div
              key={annotation.id}
              className={`ann-dot absolute rounded-full text-white flex items-center justify-center cursor-pointer transition-transform hover:scale-125 ${
                mode === 'edit' ? 'cursor-grab active:cursor-grabbing' : ''
              } ${selectedAnnotation?.id === annotation.id && !isClosed ? 'ring-4 ring-white scale-110' : ''}`}
              style={{
                left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)',
                pointerEvents: 'auto', zIndex: zIndex + 100, backgroundColor: dotColor,
                width: theme?.dotSize ?? 32, height: theme?.dotSize ?? 32,
                boxShadow: isClosed ? '0 0 0 2px rgba(255,255,255,0.6)' : `0 0 0 3px rgba(255,255,255,0.8), 0 0 20px 4px ${primaryColor}80`,
                opacity: isClosed ? 0.7 : 1,
              }}
              onClick={(e) => handleAnnotationClick(annotation, e)}
              onMouseDown={(e) => handleDragStart(annotation.id, e)}
              onTouchStart={(e) => handleDragStart(annotation.id, e)}
              title={annotation.content + (isClosed ? ' (已关闭)' : '')}
              role="button"
              aria-label={`标注 ${index + 1}: ${annotation.content}${isClosed ? '，已关闭' : ''}`}
              tabIndex={0}
            >
              {!isClosed && <span className="absolute inset-0 rounded-full animate-ping opacity-60" style={{ backgroundColor: dotColor }} />}
              <span className="relative text-xs font-bold drop-shadow-md">{index + 1}</span>
            </div>
          )
        })}
      </div>
      {editorPosition && mode === 'edit' && (
        <div className="ann-editor pointer-events-none" style={editorWrapperStyle}>
          <AnnotationEditor x={editorPosition.x} y={editorPosition.y} theme={theme} onSave={handleEditorSave} onCancel={() => setEditorPosition(null)} />
        </div>
      )}
      {showPanel && selectedAnnotation && (
        <CommentPanel
          annotations={annotations} selectedAnnotation={selectedAnnotation} comments={comments}
          zIndex={zIndex} theme={theme} fixed={fixed} user={user} setUser={setUser} setMode={setMode}
          onAddComment={onCreateComment} onDeleteComment={onDeleteComment} onClose={handleClosePanel}
          onEditAnnotation={(id, content, imageUrl) => onUpdateAnnotation(id, { content, imageUrl })}
          onToggleClosed={(id, closed) => onUpdateAnnotation(id, { closed })}
          onDeleteAnnotation={onDeleteAnnotation} onRefreshComments={onRefreshComments}
          onSelectAnnotation={handleSelectAnnotation} mode={mode}
        />
      )}
    </>
  )

  if (containerRef) {
    if (!portalTarget) return null
    return createPortal(layerContent, portalTarget)
  }
  return layerContent
}

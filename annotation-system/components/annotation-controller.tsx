'use client'
import { useState, useEffect, useRef } from 'react'
import { EyeOff, Eye, Pencil, GripVertical } from 'lucide-react'
import type { AnnotationMode, AnnotationTheme } from '../types'

interface AnnotationControllerProps {
  mode: AnnotationMode
  setMode: (mode: AnnotationMode) => void
  user: string
  setUser: (user: string) => void
  annotationCount: number
  zIndex?: number
  theme?: AnnotationTheme
}

const STORAGE_KEY_POSITION = '@annotation-system/controller-position'
const STORAGE_KEY_COLLAPSED = '@annotation-system/controller-collapsed'

function getInitialPosition() {
  if (typeof window === 'undefined') return { x: 600, y: 500 }
  const stored = localStorage.getItem(STORAGE_KEY_POSITION)
  if (stored) { try { return JSON.parse(stored) } catch { return { x: window.innerWidth - 200, y: window.innerHeight - 100 } } }
  return { x: window.innerWidth - 200, y: window.innerHeight - 100 }
}
function getInitialCollapsed() {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEY_COLLAPSED) === 'true'
}

export function AnnotationController({ mode, setMode, user, setUser, annotationCount, zIndex = 2147483647, theme }: AnnotationControllerProps) {
  const [position, setPosition] = useState(getInitialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(getInitialCollapsed)
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 })
  const primaryColor = theme?.primary ?? '#ff0000'
  const secondaryColor = theme?.secondary ?? '#3b82f6'

  useEffect(() => { localStorage.setItem(STORAGE_KEY_POSITION, JSON.stringify(position)) }, [position])
  useEffect(() => { localStorage.setItem(STORAGE_KEY_COLLAPSED, String(isCollapsed)) }, [isCollapsed])

  useEffect(() => {
    const handleResize = () => {
      if (!isDragging) setPosition((prev: { x: number; y: number }) => ({ x: Math.min(prev.x, window.innerWidth - 180), y: Math.min(prev.y, window.innerHeight - 160) }))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isDragging])

  useEffect(() => { if (mode === 'off') setIsCollapsed(true) }, [mode])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const k = e.key.toLowerCase()
      if (k === 'e') setMode('edit')
      else if (k === 'v') setMode('view')
      else if (k === 'o') setMode('off')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setMode])

  const modes: { value: AnnotationMode; label: string }[] = [
    { value: 'off', label: '关闭' }, { value: 'view', label: '查看' }, { value: 'edit', label: '编辑' },
  ]

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return
    setIsDragging(true)
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPosX: position.x, startPosY: position.y }
  }

  useEffect(() => {
    if (!isDragging) return
    const move = (e: MouseEvent) => {
      setPosition({ x: Math.max(0, Math.min(window.innerWidth - 180, dragRef.current.startPosX + e.clientX - dragRef.current.startX)),
        y: Math.max(0, Math.min(window.innerHeight - 160, dragRef.current.startPosY + e.clientY - dragRef.current.startY)) })
    }
    const up = () => setIsDragging(false)
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', up)
    return () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up) }
  }, [isDragging])

  return (
    <div className={`fixed select-none transition-all duration-200 ${isCollapsed ? 'w-12 h-12 rounded-full shadow-lg border border-gray-200' : 'bg-white rounded-xl shadow-lg border border-gray-200 p-3'} ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{ left: position.x, top: position.y, zIndex: zIndex + 400, backgroundColor: theme?.panelBg ?? '#ffffff', color: theme?.panelText ?? '#374151' }}
      onMouseDown={handleMouseDown}
      onClick={() => { if (isCollapsed) setIsCollapsed(false) }}>
      {isCollapsed ? (
        <div className="w-full h-full flex items-center justify-center relative">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: mode === 'off' ? '#9ca3af' : mode === 'view' ? secondaryColor : primaryColor,
            boxShadow: `0 0 0 2px rgba(255,255,255,0.9), 0 0 8px ${mode === 'off' ? '#9ca3af' : mode === 'view' ? secondaryColor : primaryColor}` }} />
          {annotationCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">{annotationCount}</span>}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-3">
            <GripVertical className="w-4 h-4 text-gray-400" />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: mode === 'off' ? '#9ca3af' : mode === 'view' ? secondaryColor : primaryColor }} />
            <span className="text-sm font-medium">标注</span>
            {annotationCount > 0 && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{annotationCount}</span>}
            <button onClick={(e) => { e.stopPropagation(); setIsCollapsed(true) }} className="ml-auto p-1 hover:bg-gray-100 rounded-full transition-colors" title="最小化">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
          </div>
          <div className="flex gap-1 mb-3">
            {modes.map((m) => {
              const isActive = mode === m.value
              const activeColor = m.value === 'edit' ? primaryColor : m.value === 'view' ? secondaryColor : '#6b7280'
              return (
                <button key={m.value} onClick={() => setMode(m.value)}
                  className="mode-button flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1 select-none cursor-pointer border-0 whitespace-nowrap"
                  style={{ backgroundColor: isActive ? activeColor : '#f3f4f6', color: isActive ? '#ffffff' : '#4b5563' }}>
                  {m.value === 'off' && <EyeOff className="w-4 h-4" />}
                  {m.value === 'view' && <Eye className="w-4 h-4" />}
                  {m.value === 'edit' && <Pencil className="w-4 h-4" />}
                  {m.label}
                  <span className="ml-0.5 opacity-60 text-[9px]">{m.value === 'off' && '(O)'}{m.value === 'view' && '(V)'}{m.value === 'edit' && '(E)'}</span>
                </button>
              )
            })}
          </div>
          <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
            {mode === 'edit' && <p>点击页面创建标注</p>}
            {mode === 'view' && <p>点击标注查看详情</p>}
            {mode === 'off' && <p>标注已隐藏</p>}
          </div>
        </>
      )}
    </div>
  )
}

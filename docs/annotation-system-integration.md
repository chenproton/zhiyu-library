# 标注系统集成文档

> 版本：v1.0 | 适用于 Next.js 16 + React 19 + Tailwind CSS v4 + shadcn/ui (Radix UI)

## 一、系统概述

本标注系统是一个可直接嵌入 Next.js 项目的全功能页面标注与评论解决方案，特性包括：

- **页面标注**：在任意位置创建带编号的标注点，坐标以百分比存储，自适应不同屏幕尺寸
- **评论系统**：每个标注支持多级嵌套评论，支持图片附件
- **三种模式**：`view`（查看）、`edit`（编辑/拖拽）、`off`（隐藏）
- **弹窗隔离**：Dialog / Sheet 弹窗内的标注与页面标注完全隔离，互不干扰
- **容器跟随**：支持将标注层挂载到弹窗内的滚动容器，跟随容器滚动
- **已关闭状态**：标注可标记为"已关闭"，视觉上淡化，随时可重新打开
- **快捷键**：`E` 编辑、`V` 查看、`O` 关闭
- **数据持久化**：默认使用 JSON 文件存储，可替换为数据库适配器

---

## 二、依赖要求

项目需已安装以下依赖（本项目通常已具备）：

```bash
npm install lucide-react date-fns
```

- `lucide-react` — 图标库
- `date-fns` — 日期格式化
- `@radix-ui/react-dialog` — shadcn/ui Dialog 底层（已随 shadcn 安装）

---

## 三、文件清单 & 安装步骤

将以下文件按路径放入你的项目中：

```
lib/annotations/types.ts                    # 类型定义
lib/annotations/adapter.ts                  # 适配器接口
lib/annotations/json-file-adapter.ts        # JSON 文件持久化（默认）
hooks/use-annotations.ts                    # React Hook
app/api/annotations/route.ts                # 标注 API 路由
app/api/comments/route.ts                   # 评论 API 路由
components/annotations/annotation-system.tsx    # 系统入口
components/annotations/annotation-layer.tsx     # 标注层（渲染点+面板）
components/annotations/annotation-controller.tsx # 悬浮控制面板
components/annotations/annotation-editor.tsx    # 新建标注编辑器
components/annotations/comment-panel.tsx        # 评论抽屉面板
components/annotation-client.tsx            # 客户端包装（防 SSR 水合问题）
```

---

## 四、各文件完整代码

### 4.1 类型定义

**`lib/annotations/types.ts`**

```typescript
export type Annotation = {
  id: string
  page: string
  context?: string
  x: number
  y: number
  content: string
  imageUrl?: string
  closed?: boolean
  createdAt: number
}

export type Comment = {
  id: string
  annotationId: string
  user: string
  text: string
  imageUrl?: string
  createdAt: number
  parentId?: string | null
}

export type AnnotationMode = 'off' | 'view' | 'edit'

export interface AnnotationStore {
  annotations: Annotation[]
  comments: Comment[]
}

export interface AnnotationTheme {
  primary?: string
  secondary?: string
  danger?: string
  dotSize?: number
  panelBg?: string
  panelText?: string
}

export interface AnnotationSystemProps {
  page?: string
  context?: string
  apiBasePath?: string
  defaultMode?: AnnotationMode
  currentUser?: string
  zIndex?: number
  theme?: AnnotationTheme
  onModeChange?: (mode: AnnotationMode) => void
  fixed?: boolean
  containerRef?: React.RefObject<HTMLElement | null>
}

export interface UseAnnotationsConfig {
  page: string
  context?: string
  apiBasePath: string
  defaultMode: AnnotationMode
  currentUser?: string
}
```

### 4.2 适配器接口

**`lib/annotations/adapter.ts`**

```typescript
import type { Annotation, Comment } from './types'

export interface AnnotationAdapter {
  getAnnotationsByPage(page: string, context?: string): Promise<Annotation[]>
  getAnnotationById(id: string): Promise<Annotation | undefined>
  createAnnotation(annotation: Omit<Annotation, 'id' | 'createdAt'>): Promise<Annotation>
  updateAnnotation(
    id: string,
    updates: Partial<Pick<Annotation, 'x' | 'y' | 'content' | 'imageUrl' | 'closed'>>
  ): Promise<Annotation | undefined>
  deleteAnnotation(id: string): Promise<boolean>
  getCommentsByAnnotationId(annotationId: string): Promise<Comment[]>
  createComment(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment>
  deleteComment(id: string): Promise<boolean>
}
```

### 4.3 JSON 文件持久化（默认适配器）

**`lib/annotations/json-file-adapter.ts`**

```typescript
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
```

> **Turbopack NFT 警告**：`path.join(process.cwd(), 'data/annotations.json')` 会导致构建时 NFT 追踪警告（不影响运行）。如需消除警告，可设置环境变量 `ANNOTATION_SYSTEM_DATA_PATH=/绝对路径/data/annotations.json`。

### 4.4 React Hook

**`hooks/use-annotations.ts`**

```typescript
import { useState, useEffect, useCallback } from 'react'
import type { Annotation, Comment, AnnotationMode, UseAnnotationsConfig } from '@/lib/annotations/types'

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
    if (propUser) { setUser(propUser) } else { setLocalStorageItem(STORAGE_KEY_USER, user) }
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
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page, context, x, y, content, imageUrl }),
    })
    if (res.ok) await refreshAnnotations()
  }, [page, context, apiBasePath, refreshAnnotations])

  const updateAnnotation = useCallback(async (id: string, updates: Partial<Pick<Annotation, 'x' | 'y' | 'content' | 'imageUrl' | 'closed'>>) => {
    const res = await fetch(`${apiBasePath}/annotations`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
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
      method: 'POST', headers: { 'Content-Type': 'application/json' },
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
```

### 4.5 API 路由

**`app/api/annotations/route.ts`**

```typescript
import { NextResponse } from 'next/server'
import { createJsonFileAdapter } from '@/lib/annotations/json-file-adapter'

const adapter = createJsonFileAdapter()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    const context = searchParams.get('context') || 'default'
    if (!page) return NextResponse.json({ error: 'Page required' }, { status: 400 })
    return NextResponse.json(await adapter.getAnnotationsByPage(page, context))
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { page, context, x, y, content, imageUrl } = await request.json()
    if (!page || typeof x !== 'number' || typeof y !== 'number' || !content) {
      return NextResponse.json({ error: 'Invalid' }, { status: 400 })
    }
    return NextResponse.json(await adapter.createAnnotation({ page, context, x, y, content, imageUrl }), { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, x, y, content, imageUrl, closed } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    const updated = await adapter.updateAnnotation(id, {
      ...(x !== undefined && { x }), ...(y !== undefined && { y }),
      ...(content !== undefined && { content }), ...(imageUrl !== undefined && { imageUrl }),
      ...(closed !== undefined && { closed }),
    })
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await adapter.deleteAnnotation(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
```

**`app/api/comments/route.ts`**

```typescript
import { NextResponse } from 'next/server'
import { createJsonFileAdapter } from '@/lib/annotations/json-file-adapter'

const adapter = createJsonFileAdapter()

export async function GET(request: Request) {
  try {
    const annotationId = new URL(request.url).searchParams.get('annotationId')
    if (!annotationId) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    return NextResponse.json(await adapter.getCommentsByAnnotationId(annotationId))
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { annotationId, user, text, parentId, imageUrl } = await request.json()
    if (!annotationId || !user || !text) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
    return NextResponse.json(await adapter.createComment({ annotationId, user, text, parentId, imageUrl }), { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await adapter.deleteComment(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
```

### 4.6 组件层

**`components/annotations/annotation-system.tsx`**

```typescript
'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAnnotations } from '@/hooks/use-annotations'
import { AnnotationLayer } from './annotation-layer'
import { AnnotationController } from './annotation-controller'
import type { AnnotationSystemProps } from '@/lib/annotations/types'

export function AnnotationSystem({
  page: pageProp, context = 'default', apiBasePath = '/api',
  defaultMode = 'view', currentUser, zIndex = 2147483647,
  theme, onModeChange, hideController = false, fixed = false, containerRef,
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

  // 隐藏控制器时仍支持键盘快捷键
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
```

**`components/annotations/annotation-layer.tsx`**

```typescript
'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { Annotation, AnnotationMode, Comment, AnnotationTheme } from '@/lib/annotations/types'
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
```

**`components/annotations/annotation-controller.tsx`**

```typescript
'use client'
import { useState, useEffect, useRef } from 'react'
import { EyeOff, Eye, Pencil, GripVertical } from 'lucide-react'
import type { AnnotationMode, AnnotationTheme } from '@/lib/annotations/types'

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
```

**`components/annotations/annotation-editor.tsx`**

```typescript
'use client'
import { useState, useEffect, useRef } from 'react'
import { X, Check, Image as ImageIcon } from 'lucide-react'
import type { AnnotationTheme } from '@/lib/annotations/types'

interface AnnotationEditorProps {
  x: number
  y: number
  theme?: AnnotationTheme
  onSave: (content: string, imageUrl?: string) => void
  onCancel: () => void
}

export function AnnotationEditor({ x, y, theme, onSave, onCancel }: AnnotationEditorProps) {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState<string | undefined>()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const primaryColor = theme?.primary ?? '#ef4444'

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const stop = (e: Event) => e.stopPropagation()
    el.addEventListener('focusin', stop, true)
    return () => el.removeEventListener('focusin', stop, true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) onSave(content.trim(), imageUrl)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImageUrl(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div ref={containerRef} className="absolute bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-72 pointer-events-auto"
      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -10px)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 font-medium">新建标注</span>
        <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-full transition-colors"><X className="w-4 h-4 text-gray-500" /></button>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea ref={inputRef} value={content} onChange={(e) => setContent(e.target.value)} placeholder="输入标注内容..."
          className="w-full h-24 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:border-transparent text-sm"
          style={{ '--tw-ring-color': primaryColor } as React.CSSProperties} />
        {imageUrl && (
          <div className="mt-2 relative">
            <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-gray-100" />
            <button type="button" onClick={() => setImageUrl(undefined)} className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"><X className="w-3 h-3" /></button>
          </div>
        )}
        <div className="flex gap-2 mt-3">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200" title="添加图片"><ImageIcon className="w-5 h-5" /></button>
          <button type="button" onClick={onCancel} className="flex-1 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">取消</button>
          <button type="submit" disabled={!content.trim()} className="flex-1 px-3 py-2 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center justify-center gap-1" style={{ backgroundColor: primaryColor }}><Check className="w-4 h-4" />保存</button>
        </div>
      </form>
    </div>
  )
}
```

**`components/annotations/comment-panel.tsx`**

```typescript
'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Send, Trash2, Reply, User, Image as ImageIcon, Pencil, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { Annotation, Comment, AnnotationMode, AnnotationTheme } from '@/lib/annotations/types'

interface CommentPanelProps {
  annotations: Annotation[]
  selectedAnnotation: Annotation
  comments: { [key: string]: Comment[] }
  zIndex?: number
  theme?: AnnotationTheme
  fixed?: boolean
  user?: string
  setUser?: (user: string) => void
  setMode?: (mode: AnnotationMode) => void
  onAddComment: (annotationId: string, text: string, parentId?: string | null, imageUrl?: string) => void
  onDeleteComment: (id: string, annotationId: string) => void
  onClose: () => void
  onEditAnnotation: (id: string, content: string, imageUrl?: string) => void
  onToggleClosed: (id: string, closed: boolean) => void
  onDeleteAnnotation: (id: string) => void
  onRefreshComments: (annotationId: string) => void
  onSelectAnnotation: (annotation: Annotation) => void
  mode: AnnotationMode
}

export function CommentPanel({ annotations, selectedAnnotation, comments: allComments, zIndex = 2147483647, theme, user, setUser, setMode,
  onAddComment, onDeleteComment, onClose, onEditAnnotation, onToggleClosed, onDeleteAnnotation, onRefreshComments, onSelectAnnotation, mode }: CommentPanelProps) {

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set([selectedAnnotation.id]))
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [editingUser, setEditingUser] = useState(false)
  const [tempUser, setTempUser] = useState(user || 'Anonymous')
  const [replyToMap, setReplyToMap] = useState<Record<string, string | null>>({})
  const [newCommentMap, setNewCommentMap] = useState<Record<string, string>>({})
  const [commentImageMap, setCommentImageMap] = useState<Record<string, string | undefined>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const panelRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const primaryColor = theme?.primary ?? '#ef4444'

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 640)
    update(); window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const stop = (e: Event) => e.stopPropagation()
    el.addEventListener('focusin', stop, true)
    return () => el.removeEventListener('focusin', stop, true)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    if (isMobile) return
    const handler = (e: MouseEvent) => { if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose() }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose, isMobile])

  useEffect(() => {
    setExpandedIds((prev) => {
      if (prev.has(selectedAnnotation.id)) return prev
      const next = new Set(prev); next.add(selectedAnnotation.id); return next
    })
    const timer = setTimeout(() => selectedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
    return () => clearTimeout(timer)
  }, [selectedAnnotation.id])

  const toggleExpand = useCallback((annotation: Annotation) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(annotation.id)) { next.delete(annotation.id) }
      else { next.add(annotation.id); onSelectAnnotation(annotation); onRefreshComments(annotation.id) }
      return next
    })
  }, [onSelectAnnotation, onRefreshComments])

  const handleEditStart = (annotation: Annotation) => { setEditingId(annotation.id); setEditContent(annotation.content) }
  const handleSaveEdit = (annotation: Annotation) => {
    if (editContent.trim()) onEditAnnotation(annotation.id, editContent.trim(), annotation.imageUrl)
    setEditingId(null)
  }

  const handleFileChange = (annotationId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { const reader = new FileReader(); reader.onloadend = () => setCommentImageMap((prev) => ({ ...prev, [annotationId]: reader.result as string })); reader.readAsDataURL(file) }
  }

  const handleAddComment = (annotationId: string) => {
    const text = newCommentMap[annotationId]?.trim()
    if (text) {
      onAddComment(annotationId, text, replyToMap[annotationId] || undefined, commentImageMap[annotationId])
      setNewCommentMap((prev) => ({ ...prev, [annotationId]: '' }))
      setCommentImageMap((prev) => ({ ...prev, [annotationId]: undefined }))
      setReplyToMap((prev) => ({ ...prev, [annotationId]: null }))
    }
  }

  const getNestedComments = (annotationId: string, parentId: string | null = null) => {
    const cs = allComments[annotationId] || []
    return cs.filter((c) => (parentId === null ? c.parentId == null : c.parentId === parentId))
  }

  const renderCommentThread = (annotationId: string, parentId: string | null = null, depth = 0) => {
    const nested = getNestedComments(annotationId, parentId)
    if (nested.length === 0) return null
    return (
      <div className="space-y-3">
        {nested.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-3" style={{ marginLeft: depth > 0 ? '16px' : '0' }}>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${primaryColor}20` }}>
                <User className="w-3 h-3" style={{ color: primaryColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">{comment.user}</span>
                  <span className="text-xs text-gray-400">{format(new Date(comment.createdAt), 'MM月d日 HH:mm', { locale: zhCN })}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap break-words">{comment.text}</p>
                {comment.imageUrl && <div className="mt-2"><img src={comment.imageUrl} alt="Comment" className="max-w-full h-auto rounded-lg border border-gray-100" /></div>}
                <div className="flex gap-3 mt-2">
                  <button onClick={() => setReplyToMap((prev) => ({ ...prev, [annotationId]: prev[annotationId] === comment.id ? null : comment.id }))} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"><Reply className="w-3 h-3" />回复</button>
                  {mode === 'edit' && <button onClick={() => onDeleteComment(comment.id, annotationId)} className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"><Trash2 className="w-3 h-3" />删除</button>}
                </div>
                {replyToMap[annotationId] === comment.id && (
                  <div className="mt-2 flex gap-2">
                    <input type="text" placeholder="写回复..." className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onKeyDown={(e) => { if (e.key === 'Enter' && e.currentTarget.value.trim()) { onAddComment(annotationId, e.currentTarget.value.trim(), comment.id); e.currentTarget.value = ''; setReplyToMap((prev) => ({ ...prev, [annotationId]: null })) } }} />
                  </div>
                )}
                {renderCommentThread(annotationId, comment.id, depth + 1)}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={panelRef} className={`fixed bg-white shadow-xl border-l border-gray-200 flex flex-col pointer-events-auto ann-panel ${isMobile ? 'bottom-0 left-0 right-0 h-[70vh] rounded-t-2xl border-t' : 'right-0 top-0 h-full w-96'}`} style={{ zIndex: zIndex + 500 }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: primaryColor }}>{annotations.length}</div>
          <div><h3 className="font-medium text-gray-800">标注列表</h3><p className="text-xs text-gray-500">共 {annotations.length} 个标注</p></div>
        </div>
        <div className="flex items-center gap-2">
          {editingUser && setUser ? (
            <div className="flex items-center gap-1">
              <input type="text" value={tempUser} onChange={(e) => setTempUser(e.target.value)}
                className="text-xs px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-20"
                onKeyDown={(e) => { if (e.key === 'Enter' && tempUser.trim()) { setUser(tempUser.trim()); setEditingUser(false) } }}
                onClick={(e) => e.stopPropagation()} autoFocus />
              <button onClick={(e) => { e.stopPropagation(); if (tempUser.trim()) setUser(tempUser.trim()); setEditingUser(false) }} className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">确定</button>
            </div>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); setEditingUser(true); setTempUser(user || 'Anonymous') }} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors" title="点击修改用户名">
              <User className="w-3 h-3" /><span className="max-w-[80px] truncate">{user || 'Anonymous'}</span><Pencil className="w-3 h-3 opacity-60" />
            </button>
          )}
          {setMode && mode !== 'edit' && (
            <button onClick={(e) => { e.stopPropagation(); setMode('edit') }} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors" title="进入编辑模式">编辑</button>
          )}
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="关闭面板"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
      </div>

      {/* Annotation List */}
      <div className="flex-1 overflow-y-auto">
        {annotations.length === 0 ? <div className="p-8 text-center text-gray-400"><p className="text-sm">暂无标注</p></div> : (
          <div className="divide-y divide-gray-100">
            {annotations.map((annotation, index) => {
              const isExpanded = expandedIds.has(annotation.id)
              const isSelected = selectedAnnotation.id === annotation.id
              const annComments = allComments[annotation.id] || []
              return (
                <div key={annotation.id} ref={isSelected ? selectedRef : null} className={isSelected ? 'bg-blue-50/40' : ''}>
                  {/* 折叠卡片头部 */}
                  <button onClick={() => toggleExpand(annotation)} className={`w-full flex items-center gap-2 py-2 px-3 hover:bg-gray-50 transition-colors text-left ${annotation.closed ? 'opacity-60' : ''}`}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: annotation.closed ? '#9ca3af' : primaryColor }}>{index + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">
                        位置: {annotation.x.toFixed(1)}%, {annotation.y.toFixed(1)}% · {annComments.length} 条评论
                        {annotation.closed && <span className="ml-2 px-1.5 py-0.5 bg-gray-200 text-gray-500 rounded text-[10px]">已关闭</span>}
                      </p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {/* 展开内容 */}
                  {isExpanded && (
                    <div className="px-4 pb-4">
                      <div className={`rounded-lg p-4 mb-4 ${annotation.closed ? 'bg-gray-100/60' : 'bg-gray-50'}`}>
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: annotation.closed ? '#9ca3af' : primaryColor }}>{index + 1}</div>
                          <div className="flex-1 min-w-0">
                            {editingId === annotation.id ? (
                              <div>
                                <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)}
                                  className="w-full h-20 p-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties} />
                                <div className="flex gap-2 mt-2">
                                  <button onClick={() => { setEditContent(annotation.content); setEditingId(null) }} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">取消</button>
                                  <button onClick={() => handleSaveEdit(annotation)} className="text-xs px-3 py-1 text-white rounded hover:opacity-90" style={{ backgroundColor: primaryColor }}>保存</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap break-words">{annotation.content}</p>
                                {annotation.imageUrl && <div className="mt-2"><img src={annotation.imageUrl} alt="Annotation" className="max-w-full h-auto rounded-lg border border-gray-100 shadow-sm" /></div>}
                                <div className="flex gap-2 mt-3">
                                  <button onClick={() => onToggleClosed(annotation.id, !annotation.closed)} className={`text-xs flex items-center gap-1 ${annotation.closed ? 'text-green-600 hover:text-green-700' : 'text-gray-500 hover:text-gray-700'}`}>
                                    {annotation.closed ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>打开</>
                                      : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>关闭</>}
                                  </button>
                                  {mode === 'edit' && (
                                    <>
                                      <button onClick={() => handleEditStart(annotation)} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"><Pencil className="w-3 h-3" />编辑</button>
                                      <button onClick={() => { if (confirm('确定要删除这个标注吗？')) onDeleteAnnotation(annotation.id) }} className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"><Trash2 className="w-3 h-3" />删除</button>
                                    </>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">评论 ({annComments.length})</h4>
                        {annComments.length === 0 ? <p className="text-sm text-gray-400 italic">暂无评论，在下方添加一条吧！</p> : renderCommentThread(annotation.id)}
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100">
                        {commentImageMap[annotation.id] && (
                          <div className="mb-2 relative inline-block">
                            <img src={commentImageMap[annotation.id]} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-gray-200" />
                            <button onClick={() => setCommentImageMap((prev) => ({ ...prev, [annotation.id]: undefined }))} className="absolute -top-2 -right-2 p-1 bg-gray-800 text-white rounded-full hover:bg-gray-900 shadow-lg"><X className="w-3 h-3" /></button>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <div className="flex-1 relative">
                            <input type="text" value={newCommentMap[annotation.id] || ''} onChange={(e) => setNewCommentMap((prev) => ({ ...prev, [annotation.id]: e.target.value }))} placeholder="添加评论..."
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm" style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddComment(annotation.id)} />
                          </div>
                          <input type="file" ref={(el) => { fileInputRefs.current[annotation.id] = el }} onChange={(e) => handleFileChange(annotation.id, e)} accept="image/*" className="hidden" />
                          <button onClick={() => fileInputRefs.current[annotation.id]?.click()} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200" title="添加图片"><ImageIcon className="w-5 h-5" /></button>
                          <button onClick={() => handleAddComment(annotation.id)} disabled={!newCommentMap[annotation.id]?.trim()} className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md" style={{ backgroundColor: primaryColor }}><Send className="w-5 h-5" /></button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
```

**`components/annotation-client.tsx`**

```typescript
'use client'
import { useEffect, useState } from 'react'
import { AnnotationSystem } from './annotations/annotation-system'

export function AnnotationClient() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return (
    <AnnotationSystem
      defaultMode="view"
      theme={{ primary: '#2563eb', secondary: '#3b82f6', danger: '#ef4444', dotSize: 28, panelBg: '#ffffff', panelText: '#1f2937' }}
      zIndex={50}
    />
  )
}
```

---

## 五、需要修改原系统的位置

### 5.1 全局挂载（app/layout.tsx）

在 `app/layout.tsx` 的 `<body>` 最底部引入 `<AnnotationClient />`：

```tsx
import { AnnotationClient } from '@/components/annotation-client'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <AnnotationClient />
      </body>
    </html>
  )
}
```

### 5.2 Dialog 弹窗隔离（components/ui/dialog.tsx）

**修改目标**：让 `DialogContent` 支持 `annotationContext` 和 `annotationContainerRef` props，使弹窗内的标注与页面隔离。

**修改步骤**：

1. 在文件顶部导入 `AnnotationSystem`：
   ```tsx
   import { AnnotationSystem } from '@/components/annotations/annotation-system'
   ```

2. 在文件内添加 `AnnotationContextConsumer` 组件：
   ```tsx
   function AnnotationContextConsumer({
     annotationContext,
     annotationContainerRef,
   }: {
     annotationContext?: string | boolean
     annotationContainerRef?: React.RefObject<HTMLElement | null>
   }) {
     const idRef = React.useRef<string | null>(null)
     if (idRef.current === null && annotationContext === true) {
       idRef.current = `dialog-${Math.random().toString(36).slice(2, 9)}`
     }
     const ctx = annotationContext === true ? idRef.current : annotationContext || null
     if (!ctx) return null
     return (
       <AnnotationSystem
         context={ctx}
         zIndex={100}
         defaultMode="view"
         hideController
         fixed={!annotationContainerRef}
         containerRef={annotationContainerRef}
       />
     )
   }
   ```

3. 修改 `DialogContent` 的 props 类型，增加两个可选参数：
   ```tsx
   function DialogContent({
     className,
     children,
     showCloseButton = true,
     annotationContext,           // 新增
     annotationContainerRef,      // 新增
     ...props
   }: React.ComponentProps<typeof DialogPrimitive.Content> & {
     showCloseButton?: boolean
     annotationContext?: string | boolean
     annotationContainerRef?: React.RefObject<HTMLElement | null>
   }) {
   ```

4. 在 `DialogPrimitive.Content` 的闭合标签前插入标注系统：
   ```tsx
   <DialogPrimitive.Content ...>
     {children}
     {showCloseButton && <DialogPrimitive.Close ...>...</DialogPrimitive.Close>}
     <AnnotationContextConsumer
       annotationContext={annotationContext}
       annotationContainerRef={annotationContainerRef}
     />
   </DialogPrimitive.Content>
   ```

5. **弹窗使用方式**：
   ```tsx
   // 普通弹窗（无内部滚动）：viewport 模式
   <DialogContent annotationContext="bank-form">
     ...
   </DialogContent>

   // 弹窗含可滚动区域：容器模式
   const scrollRef = useRef<HTMLDivElement>(null)
   <DialogContent annotationContext="exam-form" annotationContainerRef={scrollRef}>
     <div ref={scrollRef} className="max-h-[60vh] overflow-y-auto">
       ...
     </div>
   </DialogContent>
   ```

### 5.3 Sheet 弹窗隔离（components/ui/sheet.tsx）

与 Dialog 完全相同的修改逻辑，只是组件名改为 `Sheet` 系列。在 `SheetContent` 的 props 中增加 `annotationContext` 和 `annotationContainerRef`，并在 `SheetPrimitive.Content` 内渲染 `AnnotationSystem`。

---

## 六、使用方式

### 6.1 页面标注（已自动全局启用）

只要在 `layout.tsx` 中挂载了 `<AnnotationClient />`，所有页面自动具备标注能力：

- `V` 键：查看模式（点击标注点查看评论）
- `E` 键：编辑模式（点击空白处创建标注，拖拽移动标注）
- `O` 键：关闭标注

### 6.2 弹窗标注

在需要标注的弹窗上添加 `annotationContext`（固定字符串，确保弹窗关闭再开后标注恢复）：

```tsx
<DialogContent annotationContext="my-dialog">
  ...弹窗内容...
</DialogContent>
```

如果弹窗内有可滚动容器（如 `ScrollArea` 或 `max-h` + `overflow-y-auto`），需要把滚动容器的 ref 传给 `annotationContainerRef`，让标注层跟随滚动：

```tsx
const scrollRef = useRef<HTMLDivElement>(null)

<DialogContent annotationContext="my-dialog" annotationContainerRef={scrollRef}>
  <div ref={scrollRef} className="max-h-[60vh] overflow-y-auto">
    ...内容...
  </div>
</DialogContent>
```

### 6.3 主题定制

通过 `AnnotationSystem` 的 `theme` prop 定制：

```tsx
<AnnotationSystem
  theme={{
    primary: '#2563eb',   // 标注点主色
    secondary: '#3b82f6', // 查看模式按钮色
    danger: '#ef4444',    // 删除色
    dotSize: 28,          // 标注点直径（px）
    panelBg: '#ffffff',   // 面板背景
    panelText: '#1f2937', // 面板文字
  }}
/>
```

### 6.4 自定义存储后端

如需接入数据库，只需实现 `AnnotationAdapter` 接口：

```typescript
import type { AnnotationAdapter } from '@/lib/annotations/adapter'

export function createDatabaseAdapter(): AnnotationAdapter {
  return {
    getAnnotationsByPage: async (page, context) => { /* ... */ },
    getAnnotationById: async (id) => { /* ... */ },
    createAnnotation: async (data) => { /* ... */ },
    updateAnnotation: async (id, updates) => { /* ... */ },
    deleteAnnotation: async (id) => { /* ... */ },
    getCommentsByAnnotationId: async (annotationId) => { /* ... */ },
    createComment: async (data) => { /* ... */ },
    deleteComment: async (id) => { /* ... */ },
  }
}
```

然后在 API 路由中替换 `createJsonFileAdapter()` 即可。

---

## 七、文件结构速查

```
lib/annotations/
  ├── types.ts                 # 类型定义
  ├── adapter.ts               # 适配器接口
  └── json-file-adapter.ts     # 默认 JSON 持久化

hooks/
  └── use-annotations.ts       # 数据管理 Hook

app/api/
  ├── annotations/route.ts     # 标注 REST API
  └── comments/route.ts        # 评论 REST API

components/annotations/
  ├── annotation-system.tsx    # 系统入口（组合层+控制器）
  ├── annotation-layer.tsx     # 标注层（点渲染+面板）
  ├── annotation-controller.tsx # 悬浮控制面板
  ├── annotation-editor.tsx    # 新建标注编辑器
  └── comment-panel.tsx        # 评论抽屉（可折叠列表）

components/
  └── annotation-client.tsx    # 客户端包装（防 SSR 问题）
```

---

## 八、关键设计决策

| 设计点 | 说明 |
|--------|------|
| 坐标百分比 | 所有坐标以 `0-100` 百分比存储，相对各自容器（文档/弹窗/可滚动 div），确保响应式 |
| 隔离机制 | `page`（pathname）+ `context`（固定字符串）组合作为标注隔离键 |
| 三种定位模式 | 文档模式（absolute 覆盖文档）/ Viewport 模式（fixed）/ 容器模式（Portal 挂载到指定 DOM） |
| 交互穿透 | edit 模式下点击 `button/input/textarea/select/a` 等交互元素不创建标注，避免拦截表单操作 |
| 弹窗上下文 | `annotationContext` 使用固定字符串（如 `"bank-form"`），而非随机数，确保关闭再开后标注恢复 |
| 已关闭状态 | `closed: boolean` 字段控制，视觉上淡化但不删除数据，可随时重新打开 |

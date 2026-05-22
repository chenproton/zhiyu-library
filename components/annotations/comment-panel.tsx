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

export function CommentPanel({
  annotations,
  selectedAnnotation,
  comments: allComments,
  zIndex = 2147483647,
  theme,
  user,
  setUser,
  setMode,
  onAddComment,
  onDeleteComment,
  onClose,
  onEditAnnotation,
  onToggleClosed,
  onDeleteAnnotation,
  onRefreshComments,
  onSelectAnnotation,
  mode,
}: CommentPanelProps) {
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
    const updateIsMobile = () => setIsMobile(window.innerWidth < 640)
    updateIsMobile()
    window.addEventListener('resize', updateIsMobile)
    return () => window.removeEventListener('resize', updateIsMobile)
  }, [])

  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    const stopPropagation = (e: Event) => e.stopPropagation()
    el.addEventListener('focusin', stopPropagation, true)
    return () => el.removeEventListener('focusin', stopPropagation, true)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    if (isMobile) return
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose, isMobile])

  // 选中变化时自动展开并滚动到视图
  useEffect(() => {
    setExpandedIds((prev) => {
      if (prev.has(selectedAnnotation.id)) return prev
      const next = new Set(prev)
      next.add(selectedAnnotation.id)
      return next
    })
    const timer = setTimeout(() => {
      selectedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
    return () => clearTimeout(timer)
  }, [selectedAnnotation.id])

  const toggleExpand = useCallback(
    (annotation: Annotation) => {
      setExpandedIds((prev) => {
        const next = new Set(prev)
        if (next.has(annotation.id)) {
          next.delete(annotation.id)
        } else {
          next.add(annotation.id)
          onSelectAnnotation(annotation)
          onRefreshComments(annotation.id)
        }
        return next
      })
    },
    [onSelectAnnotation, onRefreshComments]
  )

  const handleEditStart = (annotation: Annotation) => {
    setEditingId(annotation.id)
    setEditContent(annotation.content)
  }

  const handleSaveEdit = (annotation: Annotation) => {
    if (editContent.trim()) {
      onEditAnnotation(annotation.id, editContent.trim(), annotation.imageUrl)
    }
    setEditingId(null)
  }

  const handleFileChange = (annotationId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCommentImageMap((prev) => ({ ...prev, [annotationId]: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
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
    const comments = allComments[annotationId] || []
    return comments.filter((c) => (parentId === null ? c.parentId == null : c.parentId === parentId))
  }

  const renderCommentThread = (annotationId: string, parentId: string | null = null, depth = 0) => {
    const nestedComments = getNestedComments(annotationId, parentId)
    if (nestedComments.length === 0) return null

    return (
      <div className="space-y-3">
        {nestedComments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-3" style={{ marginLeft: depth > 0 ? '16px' : '0' }}>
            <div className="flex items-start gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <User className="w-3 h-3" style={{ color: primaryColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">{comment.user}</span>
                  <span className="text-xs text-gray-400">
                    {format(new Date(comment.createdAt), 'MM月d日 HH:mm', { locale: zhCN })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap break-words">{comment.text}</p>
                {comment.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={comment.imageUrl}
                      alt="Comment"
                      className="max-w-full h-auto rounded-lg border border-gray-100"
                    />
                  </div>
                )}
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() =>
                      setReplyToMap((prev) => ({
                        ...prev,
                        [annotationId]: prev[annotationId] === comment.id ? null : comment.id,
                      }))
                    }
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Reply className="w-3 h-3" />
                    回复
                  </button>
                  {mode === 'edit' && (
                    <button
                      onClick={() => onDeleteComment(comment.id, annotationId)}
                      className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      删除
                    </button>
                  )}
                </div>

                {replyToMap[annotationId] === comment.id && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="写回复..."
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          onAddComment(annotationId, e.currentTarget.value.trim(), comment.id)
                          e.currentTarget.value = ''
                          setReplyToMap((prev) => ({ ...prev, [annotationId]: null }))
                        }
                      }}
                    />
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
    <div
      ref={panelRef}
      className={`fixed bg-white shadow-xl border-l border-gray-200 flex flex-col pointer-events-auto ann-panel ${
        isMobile ? 'bottom-0 left-0 right-0 h-[70vh] rounded-t-2xl border-t' : 'right-0 top-0 h-full w-96'
      }`}
      style={{ zIndex: zIndex + 500 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: primaryColor }}
          >
            {annotations.length}
          </div>
          <div>
            <h3 className="font-medium text-gray-800">标注列表</h3>
            <p className="text-xs text-gray-500">共 {annotations.length} 个标注</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {editingUser && setUser ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tempUser}
                onChange={(e) => setTempUser(e.target.value)}
                className="text-xs px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 w-20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tempUser.trim()) {
                    setUser(tempUser.trim())
                    setEditingUser(false)
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (tempUser.trim()) {
                    setUser(tempUser.trim())
                  }
                  setEditingUser(false)
                }}
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                确定
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setEditingUser(true)
                setTempUser(user || 'Anonymous')
              }}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              title="点击修改用户名"
            >
              <User className="w-3 h-3" />
              <span className="max-w-[80px] truncate">{user || 'Anonymous'}</span>
              <Pencil className="w-3 h-3 opacity-60" />
            </button>
          )}
          {setMode && mode !== 'edit' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setMode('edit')
              }}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
              title="进入编辑模式"
            >
              编辑
            </button>
          )}
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="关闭面板">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Annotation List */}
      <div className="flex-1 overflow-y-auto">
        {annotations.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p className="text-sm">暂无标注</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {annotations.map((annotation, index) => {
              const isExpanded = expandedIds.has(annotation.id)
              const isSelected = selectedAnnotation.id === annotation.id
              const annComments = allComments[annotation.id] || []

              return (
                <div key={annotation.id} ref={isSelected ? selectedRef : null} className={isSelected ? 'bg-blue-50/40' : ''}>
                  {/* 折叠卡片头部 */}
                  <button
                    onClick={() => toggleExpand(annotation)}
                    className={`w-full flex items-center gap-2 py-2 px-3 hover:bg-gray-50 transition-colors text-left ${annotation.closed ? 'opacity-60' : ''}`}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: annotation.closed ? '#9ca3af' : primaryColor }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400">
                        位置: {annotation.x.toFixed(1)}%, {annotation.y.toFixed(1)}% · {annComments.length} 条评论
                        {annotation.closed && (
                          <span className="ml-2 px-1.5 py-0.5 bg-gray-200 text-gray-500 rounded text-[10px]">已关闭</span>
                        )}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* 展开内容 */}
                  {isExpanded && (
                    <div className="px-4 pb-4">
                      {/* 标注内容 */}
                      <div className={`rounded-lg p-4 mb-4 ${annotation.closed ? 'bg-gray-100/60' : 'bg-gray-50'}`}>
                        <div className="flex items-start gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                            style={{ backgroundColor: annotation.closed ? '#9ca3af' : primaryColor }}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            {editingId === annotation.id ? (
                              <div>
                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="w-full h-20 p-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                                />
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => {
                                      setEditContent(annotation.content)
                                      setEditingId(null)
                                    }}
                                    className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                                  >
                                    取消
                                  </button>
                                  <button
                                    onClick={() => handleSaveEdit(annotation)}
                                    className="text-xs px-3 py-1 text-white rounded hover:opacity-90"
                                    style={{ backgroundColor: primaryColor }}
                                  >
                                    保存
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap break-words">{annotation.content}</p>
                                {annotation.imageUrl && (
                                  <div className="mt-2">
                                    <img
                                      src={annotation.imageUrl}
                                      alt="Annotation"
                                      className="max-w-full h-auto rounded-lg border border-gray-100 shadow-sm"
                                    />
                                  </div>
                                )}
                                <div className="flex gap-2 mt-3">
                                  <button
                                    onClick={() => onToggleClosed(annotation.id, !annotation.closed)}
                                    className={`text-xs flex items-center gap-1 ${annotation.closed ? 'text-green-600 hover:text-green-700' : 'text-gray-500 hover:text-gray-700'}`}
                                  >
                                    {annotation.closed ? (
                                      <>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
                                        打开
                                      </>
                                    ) : (
                                      <>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        关闭
                                      </>
                                    )}
                                  </button>
                                  {mode === 'edit' && (
                                    <>
                                      <button
                                        onClick={() => handleEditStart(annotation)}
                                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                      >
                                        <Pencil className="w-3 h-3" />
                                        编辑
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm('确定要删除这个标注吗？')) {
                                            onDeleteAnnotation(annotation.id)
                                          }
                                        }}
                                        className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                        删除
                                      </button>
                                    </>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 评论列表 */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          评论 ({annComments.length})
                        </h4>
                        {annComments.length === 0 ? (
                          <p className="text-sm text-gray-400 italic">暂无评论，在下方添加一条吧！</p>
                        ) : (
                          renderCommentThread(annotation.id)
                        )}
                      </div>

                      {/* 添加评论 */}
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        {commentImageMap[annotation.id] && (
                          <div className="mb-2 relative inline-block">
                            <img
                              src={commentImageMap[annotation.id]}
                              alt="Preview"
                              className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              onClick={() => setCommentImageMap((prev) => ({ ...prev, [annotation.id]: undefined }))}
                              className="absolute -top-2 -right-2 p-1 bg-gray-800 text-white rounded-full hover:bg-gray-900 shadow-lg"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={newCommentMap[annotation.id] || ''}
                              onChange={(e) => setNewCommentMap((prev) => ({ ...prev, [annotation.id]: e.target.value }))}
                              placeholder="添加评论..."
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                              onKeyDown={(e) => e.key === 'Enter' && handleAddComment(annotation.id)}
                            />
                          </div>
                          <input
                            type="file"
                            ref={(el) => { fileInputRefs.current[annotation.id] = el }}
                            onChange={(e) => handleFileChange(annotation.id, e)}
                            accept="image/*"
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRefs.current[annotation.id]?.click()}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                            title="添加图片"
                          >
                            <ImageIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleAddComment(annotation.id)}
                            disabled={!newCommentMap[annotation.id]?.trim()}
                            className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            style={{ backgroundColor: primaryColor }}
                          >
                            <Send className="w-5 h-5" />
                          </button>
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

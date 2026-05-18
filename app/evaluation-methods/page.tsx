"use client"

import { useState, useMemo } from "react"
import { Search, Power, CheckCircle2, Link as LinkIcon, FileText, Pencil, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useData } from "@/components/providers/data-provider"
import type { EvaluationMethod } from "@/lib/types"

export default function EvaluationMethodsPage() {
  const {
    evaluationCategories,
    evaluationMethods,
    updateEvaluationMethod,
    getSceneTasksByMethod,
  } = useData()

  const [search, setSearch] = useState("")

  const filteredMethods = useMemo(() => {
    let methods = [...evaluationMethods]
    if (search.trim()) {
      const q = search.toLowerCase()
      methods = methods.filter((m) => m.name.toLowerCase().includes(q))
    }
    return methods
  }, [evaluationMethods, search])

  const enabledCount = evaluationMethods.filter((m) => m.enabled).length
  const disabledCount = evaluationMethods.filter((m) => !m.enabled).length

  const getCategoryName = (categoryId: string) => {
    return evaluationCategories.find((c) => c.id === categoryId)?.name || '-'
  }

  const getCategoryOrder = (categoryId: string) => {
    return evaluationCategories.find((c) => c.id === categoryId)?.order || 0
  }

  // 按分类分组并排序
  const groupedMethods = useMemo(() => {
    const groups = new Map<string, EvaluationMethod[]>()
    filteredMethods.forEach((m) => {
      const list = groups.get(m.categoryId) || []
      list.push(m)
      groups.set(m.categoryId, list)
    })
    return Array.from(groups.entries()).sort((a, b) => getCategoryOrder(a[0]) - getCategoryOrder(b[0]))
  }, [filteredMethods])

  const handleToggle = (method: EvaluationMethod) => {
    updateEvaluationMethod(method.id, { enabled: !method.enabled })
  }

  // 场景任务弹窗
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [selectedMethodForTasks, setSelectedMethodForTasks] = useState<EvaluationMethod | null>(null)

  // 编辑弹窗
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<EvaluationMethod | null>(null)
  const [editDesc, setEditDesc] = useState("")
  const [editLink, setEditLink] = useState("")

  const handleOpenTasks = (method: EvaluationMethod) => {
    setSelectedMethodForTasks(method)
    setTaskDialogOpen(true)
  }

  const handleOpenEdit = (method: EvaluationMethod) => {
    setEditingMethod(method)
    setEditDesc(method.description || "")
    setEditLink(method.docLink || "")
    setEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (editingMethod) {
      updateEvaluationMethod(editingMethod.id, { description: editDesc, docLink: editLink })
      setEditDialogOpen(false)
      setEditingMethod(null)
    }
  }

  return (
    <div className="px-8 py-6">
      {/* 页面标题 */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">测评方式管理</h1>
        <p className="text-muted-foreground">管理测评方式分类与前台展示状态</p>
      </div>

      {/* 统计 */}
      <div className="mb-4 flex gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-emerald-50">
            <CheckCircle2 className="size-4 text-emerald-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground">测评方式</div>
            <div className="flex items-center gap-2 text-xs">
              <span>已启用 <strong className="text-emerald-600">{enabledCount}</strong></span>
              <span className="text-gray-300">|</span>
              <span>未启用 <strong className="text-foreground">{disabledCount}</strong></span>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-blue-50">
            <Power className="size-4 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground">一级分类</div>
            <div className="flex items-center gap-2 text-xs">
              <span>共 <strong className="text-foreground">{evaluationCategories.length}</strong> 个分类</span>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索 */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索测评方式名称..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* 分类表格 */}
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-[130px]">一级分类</TableHead>
              <TableHead className="w-[140px]">二级分类（测评方式）</TableHead>
              <TableHead className="w-[90px] text-center">前台展示</TableHead>
              <TableHead className="min-w-[260px]">测评方式说明</TableHead>
              <TableHead className="w-[180px]">文档链接</TableHead>
              <TableHead className="w-[120px] text-center">管理场景任务</TableHead>
              <TableHead className="w-[100px] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedMethods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  暂无测评方式
                </TableCell>
              </TableRow>
            ) : (
              groupedMethods.map(([categoryId, methods]) => {
                const categoryName = getCategoryName(categoryId)
                return methods.map((method, index) => {
                  const taskCount = getSceneTasksByMethod(method.id).length
                  return (
                    <TableRow key={method.id}>
                      {index === 0 && (
                        <TableCell
                          rowSpan={methods.length}
                          className="align-top font-medium bg-muted/10 border-r"
                        >
                          <Badge variant="outline" className="text-xs">{categoryName}</Badge>
                        </TableCell>
                      )}
                      <TableCell>
                        <span className={`text-sm ${method.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {method.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={method.enabled}
                          onCheckedChange={() => handleToggle(method)}
                        />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground line-clamp-2">
                          {method.description || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {method.docLink ? (
                          <a
                            href={method.docLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline truncate max-w-[160px]"
                          >
                            <ExternalLink className="size-3 shrink-0" />
                            <span className="truncate">{method.docLink}</span>
                          </a>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          className="text-sm font-medium text-primary hover:underline"
                          onClick={() => handleOpenTasks(method)}
                        >
                          {taskCount} 个任务
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 text-xs"
                          onClick={() => handleOpenEdit(method)}
                        >
                          <Pencil className="size-3" />
                          编辑
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* 场景任务列表弹窗 */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>关联场景任务列表</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedMethodForTasks && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground mb-3">
                  测评方式：{selectedMethodForTasks.name}
                </p>
                {getSceneTasksByMethod(selectedMethodForTasks.id).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">暂无关联场景任务</p>
                ) : (
                  getSceneTasksByMethod(selectedMethodForTasks.id).map((task) => (
                    <div key={task.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium">{task.name}</p>
                        <p className="text-xs text-muted-foreground">{task.sceneName}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{task.methodIds.length} 个测评方式</Badge>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 编辑弹窗 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>编辑测评方式</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="mb-2 block text-sm font-medium">测评方式说明</label>
              <Textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="请输入测评方式说明"
                rows={3}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">文档链接</label>
              <Input
                value={editLink}
                onChange={(e) => setEditLink(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>取消</Button>
            <Button onClick={handleSaveEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

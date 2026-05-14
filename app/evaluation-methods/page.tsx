"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Edit3,
  Link2,
  BarChart3,
  X,
  Search,
  CheckCircle2,
  Power,
  MapPin,
  ListTodo,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from "@/components/providers/data-provider"
import type { EvaluationMethod } from "@/lib/types"

export default function EvaluationMethodsPage() {
  const router = useRouter()
  const {
    evaluationCategories,
    evaluationMethods,
    sceneTasks,
    updateEvaluationMethod,
    getSceneTasksByMethod,
    getResultsByMethod,
  } = useData()

  const [search, setSearch] = useState("")
  const [editingMethod, setEditingMethod] = useState<EvaluationMethod | null>(null)
  const [editName, setEditName] = useState("")
  const [viewTasksMethodId, setViewTasksMethodId] = useState<string | null>(null)

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return evaluationCategories
    const matchedMethods = evaluationMethods.filter((m) =>
      m.name.toLowerCase().includes(search.toLowerCase())
    )
    const matchedCategoryIds = new Set(matchedMethods.map((m) => m.categoryId))
    return evaluationCategories.filter((c) => matchedCategoryIds.has(c.id))
  }, [evaluationCategories, evaluationMethods, search])

  const getMethodsByCategory = (categoryId: string) => {
    return evaluationMethods
      .filter((m) => m.categoryId === categoryId)
      .filter((m) => !search.trim() || m.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name, "zh-CN"))
  }

  const handleToggle = (method: EvaluationMethod) => {
    updateEvaluationMethod(method.id, { enabled: !method.enabled })
  }

  const handleEditStart = (method: EvaluationMethod) => {
    setEditingMethod(method)
    setEditName(method.name)
  }

  const handleEditSubmit = () => {
    if (editingMethod && editName.trim()) {
      updateEvaluationMethod(editingMethod.id, { name: editName.trim() })
      setEditingMethod(null)
    }
  }

  const handleViewTasks = (methodId: string) => {
    setViewTasksMethodId(methodId)
  }

  const handleViewResults = (methodId: string) => {
    router.push(`/scene-task-results?methodId=${methodId}`)
  }

  const viewMethod = viewTasksMethodId
    ? evaluationMethods.find((m) => m.id === viewTasksMethodId)
    : null
  const relatedTasks = viewTasksMethodId ? getSceneTasksByMethod(viewTasksMethodId) : []

  const enabledCount = evaluationMethods.filter((m) => m.enabled).length
  const disabledCount = evaluationMethods.filter((m) => !m.enabled).length
  const uniqueScenes = new Set(sceneTasks.map((t) => t.sceneName)).size

  return (
    <div className="px-8 py-6">
      {/* 页面标题 */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">场景任务测评方式管理</h1>
        <p className="text-muted-foreground">管理场景任务中可用的测评方式分类与开关状态</p>
      </div>

      {/* 精简统计 */}
      <div className="mb-4 flex gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-blue-50">
            <Power className="size-4 text-blue-600" />
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
          <div className="flex size-8 items-center justify-center rounded-md bg-amber-50">
            <ListTodo className="size-4 text-amber-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground">测评应用情况</div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-0.5">
                <MapPin className="size-3 text-muted-foreground" />
                关联场景 <strong className="text-foreground">{uniqueScenes}</strong>
              </span>
              <span className="text-gray-300">|</span>
              <span>关联任务 <strong className="text-foreground">{sceneTasks.length}</strong></span>
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

      {/* 分类卡片 */}
      <div className="space-y-4">
        {filteredCategories.map((category) => {
          const methods = getMethodsByCategory(category.id)
          if (methods.length === 0) return null

          return (
            <Card key={category.id} className="overflow-hidden">
              <CardHeader className="border-b bg-muted/30 py-1.5">
                <CardTitle className="text-xs font-semibold leading-none">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                  {methods.map((method) => {
                    const taskCount = getSceneTasksByMethod(method.id).length
                    const resultCount = getResultsByMethod(method.id).length

                    return (
                      <div
                        key={method.id}
                        className={`group relative flex flex-col rounded-lg border p-2.5 transition-shadow hover:shadow-sm ${
                          method.enabled ? "bg-white" : "bg-gray-50/60"
                        }`}
                      >
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-1.5">
                            {method.enabled ? (
                              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                            ) : (
                              <div className="mt-0.5 size-3.5 shrink-0 rounded-full border-2 border-gray-300" />
                            )}
                            <span
                              className={`truncate text-sm font-medium ${
                                method.enabled ? "text-gray-900" : "text-gray-400"
                              }`}
                            >
                              {method.name}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-5 shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                              onClick={() => handleEditStart(method)}
                            >
                              <Edit3 className="size-3" />
                            </Button>
                          </div>
                          <Switch
                            checked={method.enabled}
                            onCheckedChange={() => handleToggle(method)}
                            className="shrink-0 scale-75"
                          />
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          <Badge
                            variant="outline"
                            className="cursor-pointer text-xs font-normal hover:bg-muted"
                            onClick={() => handleViewTasks(method.id)}
                          >
                            <Link2 className="mr-1 size-3" />
                            任务 {taskCount}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="cursor-pointer text-xs font-normal hover:bg-muted"
                            onClick={() => handleViewResults(method.id)}
                          >
                            <BarChart3 className="mr-1 size-3" />
                            结果 {resultCount}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 重命名弹窗 */}
      <Dialog open={!!editingMethod} onOpenChange={(open) => !open && setEditingMethod(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>重命名测评方式</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="请输入新的名称"
              onKeyDown={(e) => e.key === "Enter" && handleEditSubmit()}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingMethod(null)}>
                取消
              </Button>
              <Button onClick={handleEditSubmit} disabled={!editName.trim()}>
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 关联任务查看弹窗 */}
      <Dialog open={!!viewTasksMethodId} onOpenChange={(open) => !open && setViewTasksMethodId(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>「{viewMethod?.name}」关联任务</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setViewTasksMethodId(null)}
              >
                <X className="size-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="py-2">
            {relatedTasks.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Link2 className="mx-auto mb-2 size-8 opacity-30" />
                <p>暂无关联任务</p>
              </div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>任务名称</TableHead>
                      <TableHead>所属场景</TableHead>
                      <TableHead className="w-[100px] text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {relatedTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.name}</TableCell>
                        <TableCell className="text-muted-foreground">{task.sceneName}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => {
                              setViewTasksMethodId(null)
                              router.push(`/scene-task-results?taskId=${task.id}`)
                            }}
                          >
                            查看结果
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

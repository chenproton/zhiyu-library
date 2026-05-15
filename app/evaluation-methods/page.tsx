"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, BarChart3, Power, CheckCircle2 } from "lucide-react"
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
    // 按分类 order 排序
    return Array.from(groups.entries()).sort((a, b) => getCategoryOrder(a[0]) - getCategoryOrder(b[0]))
  }, [filteredMethods])

  const handleToggle = (method: EvaluationMethod) => {
    updateEvaluationMethod(method.id, { enabled: !method.enabled })
  }

  const handleViewResults = (methodId: string) => {
    router.push(`/scene-task-results?methodId=${methodId}`)
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
            <TableRow>
              <TableHead className="w-[160px]">一级分类</TableHead>
              <TableHead className="w-[200px]">二级分类（测评方式）</TableHead>
              <TableHead className="w-[100px] text-center">前台展示</TableHead>
              <TableHead className="w-[100px] text-center">关联任务</TableHead>
              <TableHead className="w-[100px] text-center">关联结果</TableHead>
              <TableHead className="w-[120px] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedMethods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  暂无测评方式
                </TableCell>
              </TableRow>
            ) : (
              groupedMethods.map(([categoryId, methods]) => {
                const categoryName = getCategoryName(categoryId)
                return methods.map((method, index) => {
                  const taskCount = getSceneTasksByMethod(method.id).length
                  const resultCount = getResultsByMethod(method.id).length
                  return (
                    <TableRow key={method.id}>
                      {index === 0 && (
                        <TableCell
                          rowSpan={methods.length}
                          className="align-top font-medium bg-muted/20 border-r"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{categoryName}</Badge>
                          </div>
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
                      <TableCell className="text-center">
                        <span className="text-sm">{taskCount}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-sm">{resultCount}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 text-xs"
                          onClick={() => handleViewResults(method.id)}
                        >
                          <BarChart3 className="size-3" />
                          查看结果
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
    </div>
  )
}

"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import {
  Search,
  User,
  Users,
  Calendar,
  MapPin,
  Award,
  GraduationCap,
  ClipboardList,
  Eye,
  CheckCircle2,
  Clock,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

function SceneTaskResultsContent() {
  const searchParams = useSearchParams()
  const initialMethodId = searchParams.get("methodId") || ""
  const initialTaskId = searchParams.get("taskId") || ""

  const {
    evaluationCategories,
    evaluationMethods,
    sceneEvaluationResults,
  } = useData()

  const [search, setSearch] = useState("")
  const [methodFilter, setMethodFilter] = useState<string>(initialMethodId || "all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [evaluateeTypeFilter, setEvaluateeTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredResults = useMemo(() => {
    let results = [...sceneEvaluationResults]

    if (methodFilter !== "all") {
      results = results.filter((r) => r.methodId === methodFilter)
    }
    if (initialTaskId) {
      results = results.filter((r) => r.taskId === initialTaskId)
    }
    if (categoryFilter !== "all") {
      const methodIdsInCategory = evaluationMethods
        .filter((m) => m.categoryId === categoryFilter)
        .map((m) => m.id)
      results = results.filter((r) => methodIdsInCategory.includes(r.methodId))
    }
    if (evaluateeTypeFilter !== "all") {
      results = results.filter((r) => r.evaluateeType === evaluateeTypeFilter)
    }
    if (statusFilter !== "all") {
      results = results.filter((r) => r.evaluationStatus === statusFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      results = results.filter(
        (r) =>
          r.taskName.toLowerCase().includes(q) ||
          r.sceneName.toLowerCase().includes(q) ||
          r.evaluateeName.toLowerCase().includes(q) ||
          r.evaluatorNames.some((n) => n.toLowerCase().includes(q))
      )
    }

    return results.sort((a, b) => b.evaluationTime.getTime() - a.evaluationTime.getTime())
  }, [
    sceneEvaluationResults,
    methodFilter,
    initialTaskId,
    categoryFilter,
    evaluateeTypeFilter,
    statusFilter,
    search,
    evaluationMethods,
  ])

  const getMethodName = (methodId: string) => {
    return evaluationMethods.find((m) => m.id === methodId)?.name || methodId
  }

  const getCategoryName = (methodId: string) => {
    const method = evaluationMethods.find((m) => m.id === methodId)
    if (!method) return ""
    return evaluationCategories.find((c) => c.id === method.categoryId)?.name || ""
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // 统计计算
  const evaluatedCount = sceneEvaluationResults.filter((r) => r.evaluationStatus === "evaluated").length
  const pendingCount = sceneEvaluationResults.filter((r) => r.evaluationStatus === "pending").length
  const studentCount = sceneEvaluationResults.filter((r) => r.evaluateeType === "student").length
  const groupCount = sceneEvaluationResults.filter((r) => r.evaluateeType === "group").length

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const weekResults = sceneEvaluationResults.filter(
    (r) => r.evaluationStatus === "evaluated" && r.evaluationTime >= weekAgo
  )
  const monthResults = sceneEvaluationResults.filter(
    (r) => r.evaluationStatus === "evaluated" && r.evaluationTime >= monthAgo
  )

  const weekAvg =
    weekResults.length > 0
      ? (weekResults.reduce((sum, r) => sum + r.score, 0) / weekResults.length).toFixed(1)
      : "0"
  const monthAvg =
    monthResults.length > 0
      ? (monthResults.reduce((sum, r) => sum + r.score, 0) / monthResults.length).toFixed(1)
      : "0"

  return (
    <div className="px-8 py-6">
      {/* 页面标题 */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">场景任务测评结果</h1>
        <p className="text-muted-foreground">查看所有场景任务测评的详细结果记录</p>
      </div>

      {/* 精简统计 */}
      <div className="mb-4 flex gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-emerald-50">
            <ClipboardList className="size-4 text-emerald-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground">测评状态</div>
            <div className="flex items-center gap-2 text-xs">
              <span>已评价 <strong className="text-emerald-600">{evaluatedCount}</strong></span>
              <span className="text-gray-300">|</span>
              <span>待评价 <strong className="text-amber-600">{pendingCount}</strong></span>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-blue-50">
            <User className="size-4 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground">测评对象</div>
            <div className="flex items-center gap-2 text-xs">
              <span>学生 <strong className="text-blue-600">{studentCount}</strong></span>
              <span className="text-gray-300">|</span>
              <span>小组 <strong className="text-emerald-600">{groupCount}</strong></span>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-amber-50">
            <Award className="size-4 text-amber-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground">测评结果</div>
            <div className="flex items-center gap-2 text-xs">
              <span>本周均分 <strong className="text-amber-600">{weekAvg}</strong></span>
              <span className="text-gray-300">|</span>
              <span>本月均分 <strong className="text-foreground">{monthAvg}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索任务、场景、对象或评价人..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="全部分类" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">全部分类</SelectItem>
                {evaluationCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="全部方式" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">全部方式</SelectItem>
                {evaluationMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={evaluateeTypeFilter} onValueChange={setEvaluateeTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="全部对象" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">全部对象</SelectItem>
                <SelectItem value="student">学生</SelectItem>
                <SelectItem value="group">小组</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="evaluated">已评价</SelectItem>
                <SelectItem value="pending">待评价</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 结果列表 */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          共 {filteredResults.length} 条记录
        </span>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Download className="size-3.5" />
          导出数据
        </Button>
      </div>
      <div className="rounded-lg border bg-white px-4 py-3">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[130px]">测评方式</TableHead>
                <TableHead className="w-[150px]">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    测评时间
                  </div>
                </TableHead>
                <TableHead>关联任务</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    关联场景
                  </div>
                </TableHead>
                <TableHead className="w-[110px]">
                  <div className="flex items-center gap-1">
                    <User className="size-3.5" />
                    测评对象
                    <span className="text-xs text-muted-foreground">(学生/小组)</span>
                  </div>
                </TableHead>
                <TableHead className="w-[130px]">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="size-3.5" />
                    评价主体
                    <span className="text-xs text-muted-foreground">(教师/专家)</span>
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">评价状态</TableHead>
                <TableHead className="w-[80px] text-right">得分</TableHead>
                <TableHead className="sticky right-0 w-[80px] bg-white text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    {sceneEvaluationResults.length === 0
                      ? "暂无测评结果"
                      : "没有找到匹配的测评结果"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">{getMethodName(result.methodId)}</div>
                        <div className="text-xs text-muted-foreground">
                          {getCategoryName(result.methodId)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(result.evaluationTime)}
                    </TableCell>
                    <TableCell className="text-sm">{result.taskName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {result.sceneName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {result.evaluateeType === "student" ? (
                          <User className="size-3.5 text-blue-500" />
                        ) : (
                          <Users className="size-3.5 text-emerald-500" />
                        )}
                        <span className="text-sm">{result.evaluateeName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {result.evaluatorNames.map((name, i) => (
                          <Badge key={i} variant="secondary" className="text-xs font-normal">
                            {name}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {result.evaluatorType === "expert" ? "专家" : "教师"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {result.evaluationStatus === "evaluated" ? (
                        <Badge variant="secondary" className="gap-1 text-xs font-normal">
                          <CheckCircle2 className="size-3 text-emerald-500" />
                          已评价
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 text-xs font-normal text-amber-600">
                          <Clock className="size-3" />
                          待评价
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {result.evaluationStatus === "evaluated" ? (
                        <div>
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-sm font-semibold">{result.score}</span>
                            <span className="text-xs text-muted-foreground">/ {result.maxScore}</span>
                          </div>
                          <div className="mt-1 text-right">
                            <div
                              className="inline-block h-1.5 rounded-full bg-primary"
                              style={{
                                width: `${Math.min(100, (result.score / result.maxScore) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="sticky right-0 bg-white text-right">
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                        <Eye className="size-3.5" />
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default function SceneTaskResultsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-muted-foreground">加载中...</div>}>
      <SceneTaskResultsContent />
    </Suspense>
  )
}

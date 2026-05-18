"use client"

import { useState, useMemo } from "react"
import { Search, Eye, Briefcase, User, Target, Calendar, TrendingUp, CheckCircle2, AlertCircle, BarChart3, GraduationCap, Building2, BookOpen, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useData } from "@/components/providers/data-provider"
import { StudentPortraitModal } from "@/components/shared/student-portrait-modal"

export default function JobAbilityResultsPage() {
  const { jobAbilityResults, positionsList } = useData()

  const [search, setSearch] = useState("")
  const [selectedPositionId, setSelectedPositionId] = useState<string>("all")
  const [rateFilter, setRateFilter] = useState<string>("all")
  const [portraitOpen, setPortraitOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<typeof filteredResults[0] | null>(null)

  // 左侧岗位列表（只显示有结果的岗位）
  const positionsWithResults = useMemo(() => {
    const positionIds = new Set(jobAbilityResults.map(r => r.positionId))
    return positionsList.filter(p => positionIds.has(p.id))
  }, [positionsList, jobAbilityResults])

  // 右侧筛选后的结果
  const filteredResults = useMemo(() => {
    let results = [...jobAbilityResults]

    if (selectedPositionId !== "all") {
      results = results.filter((r) => r.positionId === selectedPositionId)
    }
    if (rateFilter !== "all") {
      if (rateFilter === "excellent") {
        results = results.filter((r) => r.achievementRate >= 90)
      } else if (rateFilter === "good") {
        results = results.filter((r) => r.achievementRate >= 80 && r.achievementRate < 90)
      } else if (rateFilter === "pass") {
        results = results.filter((r) => r.achievementRate >= 60 && r.achievementRate < 80)
      } else if (rateFilter === "fail") {
        results = results.filter((r) => r.achievementRate < 60)
      }
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      results = results.filter(
        (r) =>
          r.studentName.toLowerCase().includes(q) ||
          r.positionName.toLowerCase().includes(q)
      )
    }

    return results.sort((a, b) => b.evaluationTime.getTime() - a.evaluationTime.getTime())
  }, [jobAbilityResults, selectedPositionId, rateFilter, search])

  const stats = useMemo(() => {
    const total = filteredResults.length
    const excellent = filteredResults.filter((r) => r.achievementRate >= 90).length
    const good = filteredResults.filter((r) => r.achievementRate >= 80 && r.achievementRate < 90).length
    const pass = filteredResults.filter((r) => r.achievementRate >= 60 && r.achievementRate < 80).length
    const fail = filteredResults.filter((r) => r.achievementRate < 60).length
    const avgRate = total > 0
      ? Math.round(filteredResults.reduce((sum, r) => sum + r.achievementRate, 0) / total)
      : 0
    return { total, excellent, good, pass, fail, avgRate }
  }, [filteredResults])

  const getGradeLabel = (grade?: string) => {
    if (!grade || grade === '-') return '-'
    return grade
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

  // 计算每个岗位的结果数量
  const getResultCount = (positionId: string) => {
    return jobAbilityResults.filter(r => r.positionId === positionId).length
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* 左侧岗位导航 */}
      <div className="flex w-64 flex-col border-r bg-white">
        <div className="border-b p-4">
          <h2 className="text-sm font-semibold">岗位列表</h2>
          <p className="text-xs text-muted-foreground">点击岗位查看测评结果</p>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            <button
              onClick={() => setSelectedPositionId("all")}
              className={`flex w-full flex-col rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                selectedPositionId === "all"
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>全部岗位</span>
                <span className="text-xs text-muted-foreground">{jobAbilityResults.length} 人</span>
              </div>
            </button>
            {positionsWithResults.map((pos) => (
              <button
                key={pos.id}
                onClick={() => setSelectedPositionId(pos.id)}
                className={`flex w-full flex-col rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  selectedPositionId === pos.id
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{pos.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{getResultCount(pos.id)} 人</span>
                </div>
                <div className="text-xs text-muted-foreground">{pos.positionCode}</div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* 右侧结果列表 */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">岗位能力测评结果</h1>
            <p className="text-muted-foreground">
              {selectedPositionId === "all"
                ? "查看所有岗位的测评结果"
                : `查看 ${positionsList.find(p => p.id === selectedPositionId)?.name || ''} 的测评结果`}
            </p>
          </div>
        </div>

        {/* 统计 */}
        <div className="mb-4 flex gap-3">
          <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
            <div className="flex size-8 items-center justify-center rounded-md bg-blue-50">
              <Target className="size-4 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-muted-foreground">测评概况</div>
              <div className="flex items-center gap-2 text-xs">
                <span>人次 <strong className="text-foreground">{stats.total}</strong></span>
                <span className="text-gray-300">|</span>
                <span>平均达成率 <strong className="text-emerald-600">{stats.avgRate}%</strong></span>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
            <div className="flex size-8 items-center justify-center rounded-md bg-emerald-50">
              <CheckCircle2 className="size-4 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-muted-foreground">达标分布</div>
              <div className="flex items-center gap-2 text-xs">
                <span>优秀 <strong className="text-emerald-600">{stats.excellent}</strong></span>
                <span className="text-gray-300">|</span>
                <span>良好 <strong className="text-blue-600">{stats.good}</strong></span>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
            <div className="flex size-8 items-center justify-center rounded-md bg-amber-50">
              <BarChart3 className="size-4 text-amber-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-muted-foreground">未达标分布</div>
              <div className="flex items-center gap-2 text-xs">
                <span>合格 <strong className="text-amber-600">{stats.pass}</strong></span>
                <span className="text-gray-300">|</span>
                <span>不合格 <strong className="text-red-600">{stats.fail}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* 筛选栏 */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索学生姓名..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* 结果列表 */}
        <div className="rounded-lg border bg-white px-4 py-3">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">学生名称</TableHead>
                  <TableHead className="w-[100px]">学号</TableHead>
                  <TableHead className="w-[120px]">班级</TableHead>
                  <TableHead className="w-[100px]">专业</TableHead>
                  <TableHead className="w-[100px]">院系</TableHead>
                  <TableHead className="w-[140px]">岗位胜任达成率</TableHead>
                  <TableHead className="w-[80px]">评价赋分</TableHead>
                  <TableHead className="w-[140px]">测评时间</TableHead>
                  <TableHead className="sticky right-0 w-[140px] bg-white text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      {jobAbilityResults.length === 0 ? "暂无测评结果" : "没有找到匹配的测评结果"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <User className="size-3.5 text-blue-500" />
                          <span className="text-sm">{result.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{result.studentId}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{result.className || '-'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{result.major || '-'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{result.department || '-'}</TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{result.achievementRate}%（{result.achievedAbilityPoints}/{result.totalAbilityPoints} 能力点达成）</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{getGradeLabel(result.grade)}</span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDateTime(result.evaluationTime)}
                      </TableCell>
                      <TableCell className="sticky right-0 bg-white text-right">
                        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => { setSelectedStudent(result); setPortraitOpen(true) }}>
                          <Eye className="size-3.5" />
                          查看能力画像详情
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

      <StudentPortraitModal
        open={portraitOpen}
        onOpenChange={setPortraitOpen}
        studentName={selectedStudent?.studentName || '学生'}
        className={selectedStudent?.className || '-'}
        positionId={selectedStudent?.positionId}
        department={selectedStudent?.department}
        major={selectedStudent?.major}
        grade={selectedStudent?.grade}
      />
    </div>
  )
}

"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Settings, FolderTree, Upload, List, LayoutGrid } from "lucide-react"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { StatusBadge } from "@/components/shared/status-badge"
import { StatsCards } from "@/components/shared/stats-cards"
import { ExamFormDialog } from "@/components/exams/exam-form-dialog"
import { ExamStatusActions } from "@/components/exams/exam-status-actions"
import { InviteCollaboratorDialog } from "@/components/shared/invite-collaborator-dialog"
import { useData } from "@/components/providers/data-provider"
import type { Exam, Status, ExamFormData } from "@/lib/types"
import { STATUS_LABELS } from "@/lib/types"

type OwnerTab = 'mine' | 'collaborate' | 'public'
type ViewMode = 'list' | 'batch'

export default function ExamsPage() {
  const router = useRouter()
  const {
    exams,
    createExam,
    updateExam,
    deleteExam,
    updateExamStatus,
  } = useData()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all")
  const [formOpen, setFormOpen] = useState(false)
  const [editingExam, setEditingExam] = useState<Exam | null>(null)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [invitingExam, setInvitingExam] = useState<Exam | null>(null)
  const [ownerTab, setOwnerTab] = useState<OwnerTab>('mine')
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const filteredExams = useMemo(() => {
    return exams
      .filter((exam) => {
        const matchSearch = exam.name.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === "all" || exam.status === statusFilter
        const matchOwner = exam.ownerType === ownerTab
        return matchSearch && matchStatus && matchOwner
      })
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }, [exams, search, statusFilter, ownerTab])

  const handleFormSubmit = (data: ExamFormData) => {
    if (editingExam) {
      updateExam(editingExam.id, data)
    } else {
      const newExam = createExam(data)
      router.push(`/exams/${newExam.id}`)
    }
    setEditingExam(null)
  }

  const handleEdit = (exam: Exam) => {
    setEditingExam(exam)
    setFormOpen(true)
  }

  const handleInvite = (exam: Exam) => {
    setInvitingExam(exam)
    setInviteOpen(true)
  }

  const handleInviteSubmit = (users: { userId: string; role: 'editor' | 'viewer' }[]) => {
    console.log('邀请用户:', users, '到试卷:', invitingExam?.name)
    setInvitingExam(null)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} 分钟`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours} 小时 ${mins} 分钟` : `${hours} 小时`
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">组卷管理</h1>
          <p className="text-muted-foreground">管理所有试卷，进行组卷操作</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="mr-2 size-4" />
            配置审批流程
          </Button>
          <Button variant="outline">
            <FolderTree className="mr-2 size-4" />
            配置批次分组
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 size-4" />
            导入试卷
          </Button>
          <Button onClick={() => { setEditingExam(null); setFormOpen(true) }}>
            <Plus className="mr-2 size-4" />
            新建试卷
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <StatsCards items={exams} type="exam" />

      {/* Tab 切换与视图切换 */}
      <div className="mb-4 flex items-center justify-between">
        <Tabs value={ownerTab} onValueChange={(v) => setOwnerTab(v as OwnerTab)}>
          <TabsList>
            <TabsTrigger value="mine">我的试卷</TabsTrigger>
            <TabsTrigger value="collaborate">共建试卷</TabsTrigger>
            <TabsTrigger value="public">公共试卷</TabsTrigger>
          </TabsList>
        </Tabs>
        <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as ViewMode)}>
          <ToggleGroupItem value="list" aria-label="资源列表">
            <List className="size-4" />
            <span className="ml-1.5">资源列表</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="batch" aria-label="批次分组">
            <LayoutGrid className="size-4" />
            <span className="ml-1.5">批次分组</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* 筛选栏 */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索试卷名称..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as Status | "all")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="全部状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">全部状态</SelectItem>
              {(Object.keys(STATUS_LABELS) as Status[]).map((status) => (
                <SelectItem key={status} value={status}>
                  {STATUS_LABELS[status]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* 试卷列表 */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">试卷名称</TableHead>
              <TableHead className="w-[80px]">题目数</TableHead>
              <TableHead className="w-[80px]">总分</TableHead>
              <TableHead className="w-[100px]">时长</TableHead>
              <TableHead className="w-[100px]">状态</TableHead>
              <TableHead className="w-[180px]">更新时间</TableHead>
              <TableHead className="w-[80px] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  {exams.length === 0 ? "暂无试卷，点击上方按钮创建" : "没有找到匹配的试卷"}
                </TableCell>
              </TableRow>
            ) : (
              filteredExams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>
                    <span
                      className="cursor-pointer font-medium hover:underline"
                      onClick={() => router.push(`/exams/${exam.id}`)}
                    >
                      {exam.name}
                    </span>
                    {exam.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {exam.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>{exam.questions.length}</TableCell>
                  <TableCell>{exam.totalScore} 分</TableCell>
                  <TableCell>{formatDuration(exam.duration)}</TableCell>
                  <TableCell>
                    <StatusBadge status={exam.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(exam.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <ExamStatusActions
                      status={exam.status}
                      onEdit={() => handleEdit(exam)}
                      onDelete={() => deleteExam(exam.id)}
                      onStatusChange={(action) => updateExamStatus(exam.id, action)}
                      onView={() => router.push(`/exams/${exam.id}`)}
                      onCompose={() => router.push(`/exams/${exam.id}`)}
                      onInvite={() => handleInvite(exam)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 新建/编辑弹窗 */}
      <ExamFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        exam={editingExam}
        onSubmit={handleFormSubmit}
      />

      {/* 邀请共建弹窗 */}
      <InviteCollaboratorDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        title={`邀请共建「${invitingExam?.name || ''}」`}
        description="邀请其他用户一起维护此试卷"
        onInvite={handleInviteSubmit}
      />
    </div>
  )
}

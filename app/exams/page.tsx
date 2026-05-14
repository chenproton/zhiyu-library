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
import { mockUsers, mockDepartments, mockBatches } from "@/lib/mock-data"

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
  const [batchFilter, setBatchFilter] = useState<string>("all")
  const [formOpen, setFormOpen] = useState(false)
  const [editingExam, setEditingExam] = useState<Exam | null>(null)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [invitingExam, setInvitingExam] = useState<Exam | null>(null)
  const [ownerTab, setOwnerTab] = useState<OwnerTab>('mine')
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const filteredExams = useMemo(() => {
    return exams
      .filter((exam) => {
        const q = search.toLowerCase().trim()
        const matchSearch = !q || exam.name.toLowerCase().includes(q) || exam.description.toLowerCase().includes(q)
        const matchStatus = statusFilter === "all" || exam.status === statusFilter
        const matchOwner = exam.ownerType === ownerTab
        const matchBatch = batchFilter === "all" || exam.batchId === batchFilter
        return matchSearch && matchStatus && matchOwner && matchBatch
      })
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }, [exams, search, statusFilter, batchFilter, ownerTab])

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

  const getCreatorName = (exam: Exam) => {
    return mockUsers.find(u => u.id === exam.creatorId)?.name || '-'
  }

  const getCollaborators = (exam: Exam) => {
    const users = (exam.collaboratorIds || []).map(id => mockUsers.find(u => u.id === id)?.name).filter(Boolean)
    const depts = (exam.collaboratorDeptIds || []).map(id => mockDepartments.find(d => d.id === id)?.name).filter(Boolean)
    const all = [...users, ...depts]
    return all.length > 0 ? all.join('、') : '-'
  }

  const getBatchName = (exam: Exam) => {
    return mockBatches.find(b => b.id === exam.batchId)?.name || '-'
  }

  return (
    <div className="px-8 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">试卷管理</h1>
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
            placeholder="搜索试卷名称或试卷简介..."
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
        <Select value={batchFilter} onValueChange={setBatchFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="全部批次" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">全部批次</SelectItem>
              {mockBatches.map((batch) => (
                <SelectItem key={batch.id} value={batch.id}>
                  {batch.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* 试卷列表 */}
      <div className="rounded-lg border bg-white px-4 py-3">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">试卷名称</TableHead>
                <TableHead className="w-[200px]">试卷简介</TableHead>
                <TableHead className="w-[80px]">题目数</TableHead>
                <TableHead className="w-[80px]">总分</TableHead>
                <TableHead className="w-[100px]">状态</TableHead>
                <TableHead className="w-[100px]">创建人</TableHead>
                <TableHead className="w-[140px]">共建人/单位</TableHead>
                <TableHead className="w-[120px]">所属批次</TableHead>
                <TableHead className="w-[130px]">创建时间</TableHead>
                <TableHead className="w-[130px]">最后更新时间</TableHead>
                <TableHead className="sticky right-0 w-[80px] bg-white text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
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
                  </TableCell>
                  <TableCell>
                    {exam.description ? (
                      <p className="text-sm text-muted-foreground line-clamp-2">{exam.description}</p>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{exam.questions.length}</TableCell>
                  <TableCell>{exam.totalScore} 分</TableCell>
                  <TableCell>
                    <StatusBadge status={exam.status} />
                  </TableCell>
                  <TableCell>{getCreatorName(exam)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{getCollaborators(exam)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{getBatchName(exam)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(exam.createdAt)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(exam.updatedAt)}</TableCell>
                  <TableCell className="sticky right-0 bg-white text-right">
                    <ExamStatusActions
                      status={exam.status}
                      onEdit={() => handleEdit(exam)}
                      onDelete={() => deleteExam(exam.id)}
                      onStatusChange={(action) => updateExamStatus(exam.id, action)}
                      onView={() => router.push(`/exams/${exam.id}`)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </div>
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

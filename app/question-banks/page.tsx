"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, FileText, CheckCircle, Pencil, Trash2, Eye, FolderOpen, Settings, FolderTree, Upload, List, LayoutGrid } from "lucide-react"
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
import { BankFormDialog } from "@/components/question-banks/bank-form-dialog"
import { useData } from "@/components/providers/data-provider"
import type { QuestionBank, QuestionBankFormData } from "@/lib/types"

type OwnerTab = 'mine' | 'collaborate' | 'public'
type ViewMode = 'list' | 'batch'

export default function QuestionBanksPage() {
  const router = useRouter()
  const {
    questionBanks,
    questions,
    createQuestionBank,
    updateQuestionBank,
    deleteQuestionBank,
  } = useData()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [formOpen, setFormOpen] = useState(false)
  const [editingBank, setEditingBank] = useState<QuestionBank | null>(null)
  const [ownerTab, setOwnerTab] = useState<OwnerTab>('mine')
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const filteredBanks = useMemo(() => {
    return questionBanks
      .filter((bank) => {
        const q = search.toLowerCase().trim()
        const matchSearch = !q || bank.name.toLowerCase().includes(q)
        const matchOwner = bank.ownerType === ownerTab
        const matchStatus = statusFilter === "all" || bank.status === statusFilter
        return matchSearch && matchOwner && matchStatus
      })
      .sort((a, b) => {
        // 草稿库始终置顶
        if (a.isDraftPool && !b.isDraftPool) return -1
        if (!a.isDraftPool && b.isDraftPool) return 1
        return b.updatedAt.getTime() - a.updatedAt.getTime()
      })
  }, [questionBanks, search, statusFilter, ownerTab])

  const stats = useMemo(() => {
    const total = questionBanks.length
    const draft = questionBanks.filter((b) => b.status === 'draft').length
    const published = questionBanks.filter((b) => b.status === 'published').length
    return { total, draft, published }
  }, [questionBanks])

  const handleFormSubmit = (data: QuestionBankFormData) => {
    if (editingBank) {
      updateQuestionBank(editingBank.id, data)
    } else {
      const newBank = createQuestionBank(data)
      router.push(`/question-banks/${newBank.id}`)
    }
    setEditingBank(null)
  }

  const handleEdit = (bank: QuestionBank) => {
    setEditingBank(bank)
    setFormOpen(true)
  }

  const handleDelete = (bank: QuestionBank) => {
    if (bank.isDraftPool) {
      alert('我的草稿库不可删除')
      return
    }
    if (confirm(`确定要删除题库「${bank.name}」吗？题库中的所有题目也会被删除。`)) {
      deleteQuestionBank(bank.id)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date)
  }

  return (
    <div className="px-8 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">题库管理</h1>
          <p className="text-muted-foreground">管理所有题库，点击进入题目列表进行管理</p>
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
            导入题库
          </Button>
          <Button onClick={() => { setEditingBank(null); setFormOpen(true) }}>
            <Plus className="mr-2 size-4" />
            新建题库
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="mb-4 flex gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-blue-50">
            <FileText className="size-4 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground">题库总数</div>
            <div className="flex items-center gap-2 text-xs">
              <span>全部 <strong className="text-foreground">{stats.total}</strong></span>
              <span className="text-gray-300">|</span>
              <span>草稿 <strong className="text-muted-foreground">{stats.draft}</strong></span>
              <span className="text-gray-300">|</span>
              <span>已发布 <strong className="text-emerald-600">{stats.published}</strong></span>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-emerald-50">
            <CheckCircle className="size-4 text-emerald-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground">题目总数</div>
            <div className="flex items-center gap-2 text-xs">
              <span>全部 <strong className="text-foreground">{questions.length}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab 切换与视图切换 */}
      <div className="mb-4 flex items-center justify-between">
        <Tabs value={ownerTab} onValueChange={(v) => setOwnerTab(v as OwnerTab)}>
          <TabsList>
            <TabsTrigger value="mine">我的题库</TabsTrigger>
            <TabsTrigger value="collaborate">共建题库</TabsTrigger>
            <TabsTrigger value="public">公共题库</TabsTrigger>
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
            placeholder="搜索题库名称..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="全部状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="draft">草稿</SelectItem>
              <SelectItem value="published">已发布</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* 题库列表 */}
      <div className="rounded-lg border bg-white px-4 py-3">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">题库名称</TableHead>
                <TableHead className="w-[100px]">题目数量</TableHead>
                <TableHead className="w-[100px]">来源</TableHead>
                <TableHead className="w-[100px]">状态</TableHead>
                <TableHead className="w-[120px]">创建时间</TableHead>
                <TableHead className="w-[120px]">更新时间</TableHead>
                <TableHead className="sticky right-0 w-[200px] bg-white text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBanks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    暂无题库记录
                  </TableCell>
                </TableRow>
              ) : (
                filteredBanks.map((bank) => (
                  <TableRow
                    key={bank.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/question-banks/${bank.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {bank.isDraftPool && (
                          <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                            草稿库
                          </span>
                        )}
                        <span className="text-sm font-medium">{bank.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{bank.description || '-'}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{bank.questionCount} 题</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {bank.ownerType === 'mine' ? '我的' : bank.ownerType === 'collaborate' ? '共建' : '公共'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={bank.status} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{formatDate(bank.createdAt)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{formatDate(bank.updatedAt)}</span>
                    </TableCell>
                    <TableCell className="sticky right-0 bg-white text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 text-xs text-blue-600"
                          onClick={(e) => { e.stopPropagation(); router.push(`/question-banks/${bank.id}`) }}
                        >
                          <FolderOpen className="size-3" />
                          管理题目
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={(e) => { e.stopPropagation(); handleEdit(bank) }}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        {!bank.isDraftPool && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-destructive"
                            onClick={(e) => { e.stopPropagation(); handleDelete(bank) }}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 新建/编辑弹窗 */}
      <BankFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        bank={editingBank}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}

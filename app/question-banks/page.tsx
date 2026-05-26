"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Search,
  FileText,
  Settings,
  FolderTree,
  Upload,
  List,
  LayoutGrid,
  RotateCcw,
  GitBranch,
  ArrowUpFromLine,
  CheckCircle2,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { StatusBadge } from "@/components/shared/status-badge"
import { PageHeaderCard } from "@/components/shared/page-header-card"
import { BankFormDialog } from "@/components/question-banks/bank-form-dialog"
import { BankStatusActions } from "@/components/question-banks/bank-status-actions"
import { InviteCollaboratorDialog } from "@/components/shared/invite-collaborator-dialog"
import { useData } from "@/components/providers/data-provider"
import type { QuestionBank, QuestionBankFormData } from "@/lib/types"
import { mockUsers, mockBatches } from "@/lib/mock-data"

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
    updateQuestionBankStatus,
  } = useData()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [formOpen, setFormOpen] = useState(false)
  const [editingBank, setEditingBank] = useState<QuestionBank | null>(null)
  const [ownerTab, setOwnerTab] = useState<OwnerTab>('mine')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [invitingBank, setInvitingBank] = useState<QuestionBank | null>(null)

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
    const pending = questionBanks.filter((b) => b.status === 'pending').length
    const toPublish = questionBanks.filter((b) => b.status === 'toPublish').length
    const published = questionBanks.filter((b) => b.status === 'published').length
    return { total, draft, pending, toPublish, published }
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

  const handleInvite = (bank: QuestionBank) => {
    setInvitingBank(bank)
    setInviteOpen(true)
  }

  const handleInviteSubmit = (users: { userId: string; role: 'editor' | 'viewer' }[]) => {
    console.log('邀请用户:', users, '到题库:', invitingBank?.name)
    setInvitingBank(null)
  }

  const handleDelete = (bank: QuestionBank) => {
    if (bank.isDraftPool) {
      alert('默认题库不可删除')
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

  const getBatchName = (bank: QuestionBank) => {
    return mockBatches.find(b => b.id === bank.batchId)?.name || '-'
  }

  return (
    <div className="px-8 py-6">
      <PageHeaderCard
        title="题库管理"
        description="管理所有题库，点击进入题目列表进行管理"
        actions={
          <>
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
          </>
        }
        stats={[
          {
            label: "题库总数",
            value: stats.total,
            icon: <FileText className="size-3.5 text-blue-500" />,
            iconClassName: "bg-blue-50",
          },
          {
            label: "草稿",
            value: stats.draft,
            icon: <RotateCcw className="size-3.5 text-gray-500" />,
            iconClassName: "bg-gray-50",
          },
          {
            label: "审批中",
            value: stats.pending,
            icon: <GitBranch className="size-3.5 text-yellow-500" />,
            iconClassName: "bg-yellow-50",
          },
          {
            label: "待发布",
            value: stats.toPublish,
            icon: <ArrowUpFromLine className="size-3.5 text-amber-500" />,
            iconClassName: "bg-amber-50",
          },
          {
            label: "已发布",
            value: stats.published,
            icon: <CheckCircle2 className="size-3.5 text-green-500" />,
            iconClassName: "bg-green-50",
          },
        ]}
        className="mb-4"
      />

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
                <TableHead className="w-[200px]">题库名称</TableHead>
                <TableHead className="w-[200px]">题库简介</TableHead>
                <TableHead className="w-[100px]">题目数量</TableHead>
                <TableHead className="w-[120px]">所属批次</TableHead>
                <TableHead className="w-[100px]">创建人</TableHead>
                <TableHead className="w-[100px]">共建人</TableHead>
                <TableHead className="w-[100px]">状态</TableHead>
                <TableHead className="w-[120px]">创建时间</TableHead>
                <TableHead className="w-[120px]">更新时间</TableHead>
                <TableHead className="sticky right-0 w-[80px] bg-white text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBanks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
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
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground line-clamp-2">{bank.description || '-'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{bank.questionCount} 题</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{getBatchName(bank)}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">张三</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{bank.isDraftPool ? '-' : (bank.collaboratorIds?.length ? bank.collaboratorIds.map(id => mockUsers.find(u => u.id === id)?.name).filter(Boolean).join('、') || '-' : '-')}</span>
                    </TableCell>
                    <TableCell>
                      {bank.isDraftPool ? (
                        <span className="text-sm text-muted-foreground">-</span>
                      ) : (
                        <StatusBadge status={bank.status} />
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{formatDate(bank.createdAt)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{formatDate(bank.updatedAt)}</span>
                    </TableCell>
                    <TableCell className="sticky right-0 bg-white text-right">
                      <BankStatusActions
                        status={bank.status}
                        onView={() => router.push(`/question-banks/${bank.id}`)}
                        onEdit={() => handleEdit(bank)}
                        onDelete={() => handleDelete(bank)}
                        onStatusChange={(action) => updateQuestionBankStatus(bank.id, action)}
                        onInvite={() => handleInvite(bank)}
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
      <BankFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        bank={editingBank}
        onSubmit={handleFormSubmit}
      />

      {/* 邀请共建弹窗 */}
      <InviteCollaboratorDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        title={`邀请共建「${invitingBank?.name || ''}」`}
        description="邀请其他用户一起维护此题库"
        onInvite={handleInviteSubmit}
      />
    </div>
  )
}

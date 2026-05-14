"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
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
import { BankFormDialog } from "@/components/question-banks/bank-form-dialog"
import { BankStatusActions } from "@/components/question-banks/bank-status-actions"
import { InviteCollaboratorDialog } from "@/components/shared/invite-collaborator-dialog"
import { useData } from "@/components/providers/data-provider"
import type { QuestionBank, Status, QuestionBankFormData } from "@/lib/types"
import { STATUS_LABELS } from "@/lib/types"

type OwnerTab = 'mine' | 'collaborate' | 'public'
type ViewMode = 'list' | 'batch'

export default function QuestionBanksPage() {
  const {
    questionBanks,
    createQuestionBank,
    updateQuestionBank,
    deleteQuestionBank,
    updateQuestionBankStatus,
  } = useData()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all")
  const [formOpen, setFormOpen] = useState(false)
  const [editingBank, setEditingBank] = useState<QuestionBank | null>(null)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [invitingBank, setInvitingBank] = useState<QuestionBank | null>(null)
  const [ownerTab, setOwnerTab] = useState<OwnerTab>('mine')
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  const filteredBanks = useMemo(() => {
    return questionBanks
      .filter((bank) => {
        const matchSearch = bank.name.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === "all" || bank.status === statusFilter
        const matchOwner = bank.ownerType === ownerTab
        return matchSearch && matchStatus && matchOwner
      })
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }, [questionBanks, search, statusFilter, ownerTab])

  const handleFormSubmit = (data: QuestionBankFormData) => {
    if (editingBank) {
      updateQuestionBank(editingBank.id, data)
    } else {
      createQuestionBank(data)
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">题库管理</h1>
          <p className="text-muted-foreground">管理所有题库，添加和编辑题目</p>
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
      <StatsCards items={questionBanks} type="bank" />

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

      {/* 题库列表 */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">题库名称</TableHead>
              <TableHead className="w-[100px]">题目数量</TableHead>
              <TableHead className="w-[100px]">状态</TableHead>
              <TableHead className="w-[180px]">更新时间</TableHead>
              <TableHead className="w-[80px] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBanks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  {questionBanks.length === 0 ? "暂无题库，点击上方按钮创建" : "没有找到匹配的题库"}
                </TableCell>
              </TableRow>
            ) : (
              filteredBanks.map((bank) => (
                <TableRow key={bank.id}>
                  <TableCell>
                    <Link
                      href={`/question-banks/${bank.id}`}
                      className="font-medium hover:underline"
                    >
                      {bank.name}
                    </Link>
                    {bank.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {bank.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>{bank.questionCount}</TableCell>
                  <TableCell>
                    <StatusBadge status={bank.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(bank.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <BankStatusActions
                      status={bank.status}
                      onEdit={() => handleEdit(bank)}
                      onDelete={() => deleteQuestionBank(bank.id)}
                      onStatusChange={(action) => updateQuestionBankStatus(bank.id, action)}
                      onView={() => window.location.href = `/question-banks/${bank.id}`}
                      onInvite={() => handleInvite(bank)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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

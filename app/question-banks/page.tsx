"use client"

import { useState, useMemo, useEffect } from "react"
import { Plus, Search, Settings, FolderTree, Upload, FileText, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

import { StatusBadge } from "@/components/shared/status-badge"
import { BankFormDialog } from "@/components/question-banks/bank-form-dialog"
import { QuestionListPanel } from "@/components/question-banks/question-list-panel"
import { InviteCollaboratorDialog } from "@/components/shared/invite-collaborator-dialog"
import { useData } from "@/components/providers/data-provider"
import type { QuestionBank, QuestionBankFormData } from "@/lib/types"

type OwnerTab = 'mine' | 'collaborate' | 'public'

export default function QuestionBanksPage() {
  const {
    questionBanks,
    questions,
    createQuestionBank,
    updateQuestionBank,
    deleteQuestionBank,
  } = useData()

  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingBank, setEditingBank] = useState<QuestionBank | null>(null)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [invitingBank, setInvitingBank] = useState<QuestionBank | null>(null)
  const [ownerTab, setOwnerTab] = useState<OwnerTab>('mine')
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null)

  // 题库指标
  const bankDraft = questionBanks.filter((b) => ['draft', 'unsubmitted'].includes(b.status)).length
  const bankPending = questionBanks.filter((b) => b.status === 'pending').length
  const bankPublished = questionBanks.filter((b) => b.status === 'published').length

  // 题目指标
  const qDraft = questions.filter((q) => ['draft', 'unsubmitted'].includes(q.status)).length
  const qPending = questions.filter((q) => q.status === 'pending').length
  const qPublished = questions.filter((q) => q.status === 'published').length

  const filteredBanks = useMemo(() => {
    const q = search.toLowerCase().trim()
    const banks = questionBanks
      .filter((bank) => {
        const matchOwner = bank.ownerType === ownerTab
        if (!q) return matchOwner
        // 搜索题库名称或题目内容
        const matchBankName = bank.name.toLowerCase().includes(q)
        const matchQuestion = questions.some(
          (question) =>
            question.bankId === bank.id && question.content.toLowerCase().includes(q)
        )
        return matchOwner && (matchBankName || matchQuestion)
      })
    const draftPool = banks.filter((b) => b.isDraftPool)
    const others = banks.filter((b) => !b.isDraftPool).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    return [...draftPool, ...others]
  }, [questionBanks, questions, search, ownerTab])

  // 默认选中第一个题库
  useEffect(() => {
    if (filteredBanks.length > 0 && !selectedBankId) {
      setSelectedBankId(filteredBanks[0].id)
    }
    if (selectedBankId && filteredBanks.length > 0 && !filteredBanks.find((b) => b.id === selectedBankId)) {
      setSelectedBankId(filteredBanks[0].id)
    }
    if (filteredBanks.length === 0) {
      setSelectedBankId(null)
    }
  }, [filteredBanks, selectedBankId])

  const handleFormSubmit = (data: QuestionBankFormData) => {
    if (editingBank) {
      updateQuestionBank(editingBank.id, data)
    } else {
      const newBank = createQuestionBank(data)
      setSelectedBankId(newBank.id)
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
    }).format(date)
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      {/* 页面标题 */}
      <div className="px-8 py-6">
        <div className="mb-4 flex items-center justify-between">
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

        {/* 精简统计卡片 */}
        <div className="mb-4 flex gap-3">
          <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
            <div className="flex size-8 items-center justify-center rounded-md bg-blue-50">
              <FileText className="size-4 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-muted-foreground">题库指标</div>
              <div className="flex items-center gap-2 text-xs">
                <span>编辑中 <strong className="text-foreground">{bankDraft}</strong></span>
                <span className="text-gray-300">|</span>
                <span>审核中 <strong className="text-foreground">{bankPending}</strong></span>
                <span className="text-gray-300">|</span>
                <span>已发布 <strong className="text-emerald-600">{bankPublished}</strong></span>
              </div>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
            <div className="flex size-8 items-center justify-center rounded-md bg-emerald-50">
              <CheckCircle className="size-4 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-muted-foreground">题目指标</div>
              <div className="flex items-center gap-2 text-xs">
                <span>编辑中 <strong className="text-foreground">{qDraft}</strong></span>
                <span className="text-gray-300">|</span>
                <span>审核中 <strong className="text-foreground">{qPending}</strong></span>
                <span className="text-gray-300">|</span>
                <span>已发布 <strong className="text-emerald-600">{qPublished}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 下方左右布局 */}
      <div className="flex flex-1 overflow-hidden px-8 pb-6">
        {/* 左侧题库列表 */}
        <div className="flex w-64 flex-col rounded-l-lg border-y border-l bg-white">
          {/* Tab 切换与搜索 */}
          <div className="space-y-3 border-b p-4">
            <Tabs value={ownerTab} onValueChange={(v) => setOwnerTab(v as OwnerTab)}>
              <TabsList className="grid h-8 w-full grid-cols-3">
                <TabsTrigger value="mine" className="text-xs">我的</TabsTrigger>
                <TabsTrigger value="collaborate" className="text-xs">共建</TabsTrigger>
                <TabsTrigger value="public" className="text-xs">公共</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="搜索题库与题目名称..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-9 text-sm"
              />
            </div>
          </div>

          {/* 题库名称列表 */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredBanks.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  {questionBanks.length === 0 ? "暂无题库" : "没有找到匹配的题库"}
                </div>
              ) : (
                filteredBanks.map((bank) => {
                  const isDraft = bank.isDraftPool === true
                  return (
                    <button
                      key={bank.id}
                      onClick={() => setSelectedBankId(bank.id)}
                      className={`group flex w-full flex-col rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        selectedBankId === bank.id
                          ? "bg-primary/10 font-medium text-primary"
                          : isDraft
                            ? "bg-amber-50/60 text-gray-700 hover:bg-amber-100/60"
                            : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{bank.name}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {bank.questionCount} 题
                        </span>
                      </div>
                      {/* 草稿库：显示创建/更新时间 */}
                      {isDraft ? (
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span>创建于 {formatDate(bank.createdAt)}</span>
                          <span className="text-gray-200">|</span>
                          <span>更新于 {formatDate(bank.updatedAt)}</span>
                        </div>
                      ) : (
                        <div className="mt-1 flex items-center justify-between">
                          <StatusBadge status={bank.status} className="text-xs" />
                          <span className="text-[11px] text-muted-foreground">
                            更新于 {formatDate(bank.updatedAt)}
                          </span>
                        </div>
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* 右侧题目列表 */}
        <div className="flex-1 overflow-auto rounded-r-lg border-y border-r bg-white p-4">
          {selectedBankId ? (
            <QuestionListPanel bankId={selectedBankId} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>请选择一个题库查看题目</p>
              </div>
            </div>
          )}
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

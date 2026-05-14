"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Search, Edit, Trash2, Eye, Upload, Copy, Users, Building2, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/shared/status-badge"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { BankFormDialog } from "@/components/question-banks/bank-form-dialog"
import { BankStatusActions } from "@/components/question-banks/bank-status-actions"
import { QuestionFormDialog } from "@/components/questions/question-form-dialog"
import { QuestionPreview } from "@/components/questions/question-preview"
import { useData } from "@/components/providers/data-provider"
import type { Question, QuestionType, QuestionFormData, QuestionBankFormData } from "@/lib/types"
import { QUESTION_TYPE_LABELS, DIFFICULTY_LABELS } from "@/lib/types"
import { mockUsers, mockDepartments } from "@/lib/mock-data"

export default function QuestionBankDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bankId = params.id as string

  const {
    getQuestionBank,
    updateQuestionBank,
    deleteQuestionBank,
    updateQuestionBankStatus,
    getQuestionsByBank,
    createQuestion,
    updateQuestion,
    deleteQuestion,
  } = useData()

  const bank = getQuestionBank(bankId)
  const questions = getQuestionsByBank(bankId)

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<QuestionType | "all">("all")
  const [creatorFilter, setCreatorFilter] = useState<string>("all")
  
  const [bankFormOpen, setBankFormOpen] = useState(false)
  const [questionFormOpen, setQuestionFormOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Question | null>(null)
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set())
  const [batchDeleteConfirm, setBatchDeleteConfirm] = useState(false)

  // 获取题目创建人列表
  const creators = useMemo(() => {
    const creatorIds = new Set(questions.map(q => q.creatorId).filter(Boolean))
    return Array.from(creatorIds).map(id => {
      const user = mockUsers.find(u => u.id === id)
      return { id: id as string, name: user?.name || id }
    })
  }, [questions])

  const filteredQuestions = useMemo(() => {
    return questions
      .filter((q) => {
        const matchSearch = q.content.toLowerCase().includes(search.toLowerCase())
        const matchType = typeFilter === "all" || q.type === typeFilter
        const matchCreator = creatorFilter === "all" || q.creatorId === creatorFilter
        return matchSearch && matchType && matchCreator
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }, [questions, search, typeFilter, creatorFilter])

  if (!bank) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">题库不存在</h2>
          <p className="mb-4 text-muted-foreground">该题库可能已被删除</p>
          <Button asChild>
            <Link href="/question-banks">返回题库列表</Link>
          </Button>
        </div>
      </div>
    )
  }

  const canEdit = ['draft', 'unsubmitted', 'rejected'].includes(bank.status)

  const handleBankUpdate = (data: QuestionBankFormData) => {
    updateQuestionBank(bankId, data)
  }

  const handleBankDelete = () => {
    deleteQuestionBank(bankId)
    router.push("/question-banks")
  }

  const handleQuestionSubmit = (data: QuestionFormData) => {
    if (editingQuestion) {
      updateQuestion(editingQuestion.id, data)
    } else {
      createQuestion(bankId, data)
    }
    setEditingQuestion(null)
  }

  const handleQuestionEdit = (question: Question) => {
    setEditingQuestion(question)
    setQuestionFormOpen(true)
  }

  const handleQuestionDelete = () => {
    if (deleteConfirm) {
      deleteQuestion(deleteConfirm.id)
      setDeleteConfirm(null)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedQuestions(new Set(filteredQuestions.map(q => q.id)))
    } else {
      setSelectedQuestions(new Set())
    }
  }

  const handleSelectQuestion = (questionId: string, checked: boolean) => {
    const newSelected = new Set(selectedQuestions)
    if (checked) {
      newSelected.add(questionId)
    } else {
      newSelected.delete(questionId)
    }
    setSelectedQuestions(newSelected)
  }

  const handleBatchDelete = () => {
    selectedQuestions.forEach(id => {
      deleteQuestion(id)
    })
    setSelectedQuestions(new Set())
    setBatchDeleteConfirm(false)
  }

  const handleBatchCopy = () => {
    selectedQuestions.forEach(id => {
      const question = questions.find(q => q.id === id)
      if (question) {
        createQuestion(bankId, {
          type: question.type,
          content: question.content + " (复制)",
          options: question.options,
          answer: question.answer,
          analysis: question.analysis,
          score: question.score,
          difficulty: question.difficulty,
          knowledgePoints: question.knowledgePoints,
        })
      }
    })
    setSelectedQuestions(new Set())
  }

  const handleCopyQuestion = (question: Question) => {
    createQuestion(bankId, {
      type: question.type,
      content: question.content + " (复制)",
      options: question.options,
      answer: question.answer,
      analysis: question.analysis,
      score: question.score,
      difficulty: question.difficulty,
      knowledgePoints: question.knowledgePoints,
    })
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date)
  }

  const getCollaboratorNames = () => {
    const users = (bank.collaboratorIds || []).map(id => mockUsers.find(u => u.id === id)?.name).filter(Boolean)
    return users
  }

  const getCollaboratorDeptNames = () => {
    const depts = (bank.collaboratorDeptIds || []).map(id => mockDepartments.find(d => d.id === id)?.name).filter(Boolean)
    return depts
  }

  return (
    <div className="p-6">
      {/* 返回按钮 */}
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/question-banks">
            <ArrowLeft />
            返回题库列表
          </Link>
        </Button>
      </div>

      {/* 题库信息卡片 */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              {/* 封面 */}
              {bank.coverUrl ? (
                <div className="shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={bank.coverUrl}
                    alt={bank.name}
                    className="size-24 object-cover"
                  />
                </div>
              ) : (
                <div className="flex size-24 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <ImageIcon className="size-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-xl">{bank.name}</CardTitle>
                  <StatusBadge status={bank.status} />
                  <Badge variant="outline">{bank.version}</Badge>
                </div>
                <CardDescription className="mt-2">
                  {bank.description || "暂无描述"}
                </CardDescription>
              </div>
            </div>
            <BankStatusActions
              status={bank.status}
              onEdit={() => setBankFormOpen(true)}
              onDelete={handleBankDelete}
              onStatusChange={(action) => updateQuestionBankStatus(bankId, action)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">题目数量:</span>{" "}
              <strong>{bank.questionCount}</strong>
            </div>
            <div>
              <span className="text-muted-foreground">创建时间:</span>{" "}
              {formatDate(bank.createdAt)}
            </div>
            <div>
              <span className="text-muted-foreground">更新时间:</span>{" "}
              {formatDate(bank.updatedAt)}
            </div>
          </div>
          {/* 共建人/共建部门 */}
          {(getCollaboratorNames().length > 0 || getCollaboratorDeptNames().length > 0) && (
            <div className="mt-4 flex flex-wrap gap-4 border-t pt-4">
              {getCollaboratorNames().length > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">共建人:</span>
                  <div className="flex flex-wrap gap-1">
                    {getCollaboratorNames().map((name, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {getCollaboratorDeptNames().length > 0 && (
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">共建部门:</span>
                  <div className="flex flex-wrap gap-1">
                    {getCollaboratorDeptNames().map((name, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 题目管理 */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">题目列表</h2>
        {canEdit && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => alert("导入功能开发中")}>
              <Upload className="mr-2 size-4" />
              导入题目
            </Button>
            <Button
              onClick={() => {
                setEditingQuestion(null)
                setQuestionFormOpen(true)
              }}
            >
              <Plus className="mr-2 size-4" />
              添加题目
            </Button>
          </div>
        )}
      </div>

      {/* 批量操作栏 */}
      {selectedQuestions.size > 0 && canEdit && (
        <div className="mb-4 flex items-center gap-4 rounded-lg border bg-muted/50 px-4 py-2">
          <span className="text-sm text-muted-foreground">
            已选择 {selectedQuestions.size} 道题目
          </span>
          <Button variant="outline" size="sm" onClick={handleBatchCopy}>
            <Copy className="mr-1 size-3" />
            批量复制
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setBatchDeleteConfirm(true)}
          >
            <Trash2 className="mr-1 size-3" />
            批量删除
          </Button>
        </div>
      )}

      {/* 筛选栏 */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索题目内容..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as QuestionType | "all")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="全部类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">全部类型</SelectItem>
              {(Object.keys(QUESTION_TYPE_LABELS) as QuestionType[]).map((type) => (
                <SelectItem key={type} value={type}>
                  {QUESTION_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {creators.length > 0 && (
          <Select value={creatorFilter} onValueChange={setCreatorFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="全部创建人" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">全部创建人</SelectItem>
                {creators.map((creator) => (
                  <SelectItem key={creator.id} value={creator.id}>
                    {creator.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* 题目列表 */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {canEdit && (
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={filteredQuestions.length > 0 && selectedQuestions.size === filteredQuestions.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              <TableHead className="w-[40%]">题目内容</TableHead>
              <TableHead className="w-[100px]">题型</TableHead>
              <TableHead className="w-[80px]">难度</TableHead>
              <TableHead className="w-[120px]">创建时间</TableHead>
              <TableHead className="w-[120px] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canEdit ? 6 : 5} className="h-24 text-center text-muted-foreground">
                  {questions.length === 0 ? "暂无题目，点击上方按钮添加" : "没有找到匹配的题目"}
                </TableCell>
              </TableRow>
            ) : (
              filteredQuestions.map((question) => (
                <TableRow key={question.id}>
                  {canEdit && (
                    <TableCell>
                      <Checkbox
                        checked={selectedQuestions.has(question.id)}
                        onCheckedChange={(checked) => handleSelectQuestion(question.id, !!checked)}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <p className="line-clamp-2">{question.content}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {QUESTION_TYPE_LABELS[question.type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {question.difficulty && (
                      <Badge variant="outline">
                        {DIFFICULTY_LABELS[question.difficulty]}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(question.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => setPreviewQuestion(question)}
                      >
                        <Eye />
                        <span className="sr-only">预览</span>
                      </Button>
                      {canEdit && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => handleCopyQuestion(question)}
                          >
                            <Copy />
                            <span className="sr-only">复制</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => handleQuestionEdit(question)}
                          >
                            <Edit />
                            <span className="sr-only">编辑</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteConfirm(question)}
                          >
                            <Trash2 />
                            <span className="sr-only">删除</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 弹窗 */}
      <BankFormDialog
        open={bankFormOpen}
        onOpenChange={setBankFormOpen}
        bank={bank}
        onSubmit={handleBankUpdate}
      />

      <QuestionFormDialog
        open={questionFormOpen}
        onOpenChange={setQuestionFormOpen}
        question={editingQuestion}
        onSubmit={handleQuestionSubmit}
      />

      <QuestionPreview
        open={!!previewQuestion}
        onOpenChange={(open) => !open && setPreviewQuestion(null)}
        question={previewQuestion}
      />

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        title="确认删除"
        description="删除后将无法恢复。确定要删除这道题目吗？"
        variant="destructive"
        onConfirm={handleQuestionDelete}
      />

      <ConfirmDialog
        open={batchDeleteConfirm}
        onOpenChange={setBatchDeleteConfirm}
        title="批量删除"
        description={`确定要删除选中的 ${selectedQuestions.size} 道题目吗？此操作不可撤销。`}
        variant="destructive"
        onConfirm={handleBatchDelete}
      />
    </div>
  )
}

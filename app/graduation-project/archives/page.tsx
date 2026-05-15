"use client"

import { useState, useMemo } from "react"
import { Search, FolderOpen, AlertCircle, CheckCircle2, Clock, RotateCcw, Eye, GraduationCap, FileText, MessageSquare, FileCheck, XCircle, Pencil, Plus, Trash2, Upload, BookOpen, Wrench, Monitor, Code, Presentation, ScrollText, History } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useData } from "@/components/providers/data-provider"
import { useToast } from "@/hooks/use-toast"
import type { GraduationProjectArchive } from "@/lib/types"

const PHASE_LABELS: Record<GraduationProjectArchive['phase'], string> = {
  proposal: '开题阶段', midterm: '中期阶段', process: '过程阶段', final: '结题阶段',
}
const DOC_STATUS_LABELS: Record<GraduationProjectArchive['docStatus'], string> = {
  pending: '待提交', submitted: '已提交', reviewed: '已批阅', returned: '已退回',
}

type DocCategory = 'proposal' | 'midterm' | 'process' | 'guide' | 'product' | 'thesis' | 'demo' | 'source'

interface ArchiveDoc {
  id: string
  name: string
  category: DocCategory
  status: 'pending' | 'submitted' | 'reviewed' | 'returned' | 'rectified'
  uploadTime: Date
  feedback?: string
  feedbackBy?: string
}

const CATEGORY_META: Record<DocCategory, { label: string; icon: React.ReactNode; phase: string }> = {
  proposal: { label: '开题报告', icon: <BookOpen className="size-4" />, phase: '开题阶段' },
  midterm: { label: '中期检查', icon: <FileCheck className="size-4" />, phase: '中期阶段' },
  process: { label: '过程记录', icon: <History className="size-4" />, phase: '过程阶段' },
  guide: { label: '指导记录', icon: <MessageSquare className="size-4" />, phase: '过程阶段' },
  product: { label: '毕设作品', icon: <Wrench className="size-4" />, phase: '结题阶段' },
  thesis: { label: '论文/报告', icon: <ScrollText className="size-4" />, phase: '结题阶段' },
  demo: { label: '演示材料', icon: <Presentation className="size-4" />, phase: '结题阶段' },
  source: { label: '源代码/工程文件', icon: <Code className="size-4" />, phase: '结题阶段' },
}

const INITIAL_DOCS: Record<string, ArchiveDoc[]> = {
  'gp-arch-1': [
    { id:'d1', name:'开题报告v1.pdf', category:'proposal', status:'reviewed', uploadTime:new Date('2024-03-10'), feedback:'结构完整，技术路线清晰', feedbackBy:'张教授' },
    { id:'d2', name:'中期检查表.docx', category:'midterm', status:'reviewed', uploadTime:new Date('2024-04-15'), feedback:'进展良好，核心模块已完成', feedbackBy:'张教授' },
    { id:'d3', name:'周进展记录-第1周.md', category:'process', status:'reviewed', uploadTime:new Date('2024-03-20'), feedback:'记录详细', feedbackBy:'张教授' },
    { id:'d4', name:'指导记录-3月.pdf', category:'guide', status:'reviewed', uploadTime:new Date('2024-03-25'), feedback:'问题分析到位', feedbackBy:'张教授' },
    { id:'d5', name:'在线教育平台演示.mp4', category:'demo', status:'submitted', uploadTime:new Date('2024-05-20') },
    { id:'d6', name:'毕业设计论文.pdf', category:'thesis', status:'submitted', uploadTime:new Date('2024-05-25') },
  ],
  'gp-arch-2': [
    { id:'d7', name:'开题报告v1.pdf', category:'proposal', status:'reviewed', uploadTime:new Date('2024-03-12'), feedback:'需补充性能测试方案', feedbackBy:'张教授' },
    { id:'d8', name:'中期检查表.docx', category:'midterm', status:'returned', uploadTime:new Date('2024-04-20'), feedback:'数据库设计文档缺失ER图', feedbackBy:'张教授' },
    { id:'d9', name:'周进展记录-第3周.md', category:'process', status:'submitted', uploadTime:new Date('2024-04-22') },
  ],
}

const PROCESS_CATS: DocCategory[] = ['proposal','midterm','process','guide']
const OUTPUT_CATS: DocCategory[] = ['product','thesis','demo','source']

export default function GraduationProjectArchivesPage() {
  const { graduationProjectArchives, processEvaluations, rectificationDetails } = useData()
  const { toast } = useToast()

  const [search, setSearch] = useState("")
  const [phaseFilter, setPhaseFilter] = useState<string>("all")
  const [docStatusFilter, setDocStatusFilter] = useState<string>("all")

  const [detailArchive, setDetailArchive] = useState<GraduationProjectArchive | null>(null)
  const [archiveDocs, setArchiveDocs] = useState<Record<string, ArchiveDoc[]>>(INITIAL_DOCS)

  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackDoc, setFeedbackDoc] = useState<ArchiveDoc | null>(null)
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackAction, setFeedbackAction] = useState<'review'|'return'|'rectify'|'pass'>('review')

  const [addDocOpen, setAddDocOpen] = useState(false)
  const [addDocCategory, setAddDocCategory] = useState<DocCategory>('proposal')
  const [addDocName, setAddDocName] = useState('')

  const filteredArchives = useMemo(() => {
    let list = [...graduationProjectArchives]
    if (phaseFilter !== "all") list = list.filter((a) => a.phase === phaseFilter)
    if (docStatusFilter !== "all") list = list.filter((a) => a.docStatus === docStatusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((a) => a.topicName.toLowerCase().includes(q) || a.studentName.toLowerCase().includes(q) || a.advisorName.toLowerCase().includes(q))
    }
    return list.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
  }, [graduationProjectArchives, phaseFilter, docStatusFilter, search])

  const stats = useMemo(() => {
    const total = graduationProjectArchives.length
    return { total, proposal: graduationProjectArchives.filter((a) => a.phase === 'proposal').length, midterm: graduationProjectArchives.filter((a) => a.phase === 'midterm').length, process: graduationProjectArchives.filter((a) => a.phase === 'process').length, final: graduationProjectArchives.filter((a) => a.phase === 'final').length, returned: graduationProjectArchives.filter((a) => a.docStatus === 'returned').length }
  }, [graduationProjectArchives])

  const getDocs = (archiveId: string) => archiveDocs[archiveId] || []
  const setDocs = (archiveId: string, docs: ArchiveDoc[]) => setArchiveDocs(prev => ({ ...prev, [archiveId]: docs }))

  const openFeedback = (doc: ArchiveDoc, action: typeof feedbackAction) => {
    setFeedbackDoc(doc); setFeedbackAction(action); setFeedbackText(doc.feedback || ''); setFeedbackOpen(true)
  }
  const handleFeedback = () => {
    if (!detailArchive || !feedbackDoc) return
    const docs = getDocs(detailArchive.id)
    const next = docs.map(d => d.id === feedbackDoc.id ? { ...d, feedback: feedbackText, feedbackBy: '张教授', status: feedbackAction === 'pass' ? 'reviewed' : feedbackAction === 'return' ? 'returned' : feedbackAction === 'rectify' ? 'rectified' : 'reviewed' } : d)
    setDocs(detailArchive.id, next)
    toast({ title: feedbackAction === 'pass' ? '已通过该文档' : feedbackAction === 'return' ? '已退回该文档' : feedbackAction === 'rectify' ? '已标记整改' : '批注已保存' })
    setFeedbackOpen(false); setFeedbackDoc(null); setFeedbackText('')
  }
  const handleAddDoc = () => {
    if (!detailArchive || !addDocName.trim()) return
    const docs = getDocs(detailArchive.id)
    const newDoc: ArchiveDoc = { id: `nd-${Date.now()}`, name: addDocName, category: addDocCategory, status: 'submitted', uploadTime: new Date() }
    setDocs(detailArchive.id, [...docs, newDoc])
    toast({ title: '文档已添加' }); setAddDocOpen(false); setAddDocName('')
  }
  const handleDeleteDoc = (docId: string) => {
    if (!detailArchive) return
    const docs = getDocs(detailArchive.id)
    setDocs(detailArchive.id, docs.filter(d => d.id !== docId))
    toast({ title: '文档已删除' })
  }

  const getDocStatusBadge = (status: ArchiveDoc['status']) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary" className="text-xs">待提交</Badge>
      case 'submitted': return <Badge variant="default" className="bg-blue-500 text-xs">已提交</Badge>
      case 'reviewed': return <Badge variant="default" className="bg-emerald-500 text-xs">已通过</Badge>
      case 'returned': return <Badge variant="destructive" className="text-xs">已退回</Badge>
      case 'rectified': return <Badge variant="outline" className="text-amber-600 text-xs">需整改</Badge>
    }
  }
  const getDocStatusBadge2 = (status: GraduationProjectArchive['docStatus']) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary"><Clock className="mr-1 size-3" />{DOC_STATUS_LABELS[status]}</Badge>
      case 'submitted': return <Badge variant="default" className="bg-blue-500"><Upload className="mr-1 size-3" />{DOC_STATUS_LABELS[status]}</Badge>
      case 'reviewed': return <Badge variant="default" className="bg-emerald-500"><CheckCircle2 className="mr-1 size-3" />{DOC_STATUS_LABELS[status]}</Badge>
      case 'returned': return <Badge variant="destructive"><RotateCcw className="mr-1 size-3" />{DOC_STATUS_LABELS[status]}</Badge>
    }
  }
  const formatDate = (date: Date) => new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date)

  return (
    <div className="px-8 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">毕设档案管理</h1><p className="text-muted-foreground">管理毕设全生命周期文档，跟踪过程性数据和成果归档</p></div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.open('/graduation-project/student/archives', '_blank')}><GraduationCap className="mr-2 size-4" />学生档案入口</Button>
        </div>
      </div>
      <div className="mb-4 flex gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-blue-50"><FolderOpen className="size-4 text-blue-600" /></div>
          <div className="min-w-0 flex-1"><div className="text-xs text-muted-foreground">档案总数</div><div className="flex items-center gap-2 text-xs"><span>总档案 <strong className="text-foreground">{stats.total}</strong></span></div></div>
        </div>
        <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-emerald-50"><CheckCircle2 className="size-4 text-emerald-600" /></div>
          <div className="min-w-0 flex-1"><div className="text-xs text-muted-foreground">阶段分布</div><div className="flex items-center gap-2 text-xs"><span>开题 <strong className="text-foreground">{stats.proposal}</strong></span><span className="text-gray-300">|</span><span>中期 <strong className="text-foreground">{stats.midterm}</strong></span><span className="text-gray-300">|</span><span>过程 <strong className="text-foreground">{stats.process}</strong></span><span className="text-gray-300">|</span><span>结题 <strong className="text-emerald-600">{stats.final}</strong></span></div></div>
        </div>
        <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-red-50"><AlertCircle className="size-4 text-red-600" /></div>
          <div className="min-w-0 flex-1"><div className="text-xs text-muted-foreground">待处理</div><div className="flex items-center gap-2 text-xs"><span>退回整改 <strong className="text-red-600">{stats.returned}</strong></span></div></div>
        </div>
      </div>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="搜索选题、学生或导师..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
        <Select value={phaseFilter} onValueChange={setPhaseFilter}><SelectTrigger className="w-[140px]"><SelectValue placeholder="全部阶段" /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="all">全部阶段</SelectItem><SelectItem value="proposal">开题阶段</SelectItem><SelectItem value="midterm">中期阶段</SelectItem><SelectItem value="process">过程阶段</SelectItem><SelectItem value="final">结题阶段</SelectItem></SelectGroup></SelectContent></Select>
        <Select value={docStatusFilter} onValueChange={setDocStatusFilter}><SelectTrigger className="w-[140px]"><SelectValue placeholder="全部文档状态" /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="all">全部文档状态</SelectItem><SelectItem value="pending">待提交</SelectItem><SelectItem value="submitted">已提交</SelectItem><SelectItem value="reviewed">已批阅</SelectItem><SelectItem value="returned">已退回</SelectItem></SelectGroup></SelectContent></Select>
      </div>
      <div className="rounded-lg border bg-white px-4 py-3">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead className="w-[220px]">选题名称</TableHead><TableHead className="w-[90px]">学生</TableHead><TableHead className="w-[110px]">指导教师</TableHead><TableHead className="w-[110px]">关联岗位</TableHead><TableHead className="w-[90px]">当前阶段</TableHead><TableHead className="w-[90px]">文档状态</TableHead><TableHead className="w-[70px]">文档数</TableHead><TableHead className="w-[110px]">最近更新</TableHead><TableHead className="sticky right-0 w-[140px] bg-white text-right">操作</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredArchives.length === 0 ? (<TableRow><TableCell colSpan={9} className="h-24 text-center text-muted-foreground">暂无档案记录</TableCell></TableRow>) : (filteredArchives.map((archive) => (
                <TableRow key={archive.id}>
                  <TableCell><div className="text-sm font-medium">{archive.topicName}</div></TableCell>
                  <TableCell><span className="text-sm">{archive.studentName}</span></TableCell>
                  <TableCell><div className="text-sm">{archive.advisorName}</div>{archive.enterpriseMentorName && <div className="text-xs text-muted-foreground">{archive.enterpriseMentorName}</div>}</TableCell>
                  <TableCell><span className="text-sm text-muted-foreground">{archive.positionName}</span></TableCell>
                  <TableCell><Badge variant="outline" className="text-xs font-normal">{PHASE_LABELS[archive.phase]}</Badge></TableCell>
                  <TableCell>{getDocStatusBadge2(archive.docStatus)}</TableCell>
                  <TableCell><div className="flex items-center gap-1"><FileText className="size-3.5 text-muted-foreground" /><span className="text-sm">{getDocs(archive.id).length}</span></div></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(archive.lastUpdated)}</TableCell>
                  <TableCell className="sticky right-0 bg-white text-right">
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => setDetailArchive(archive)}><Eye className="size-3" />查看档案详情</Button>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 档案详情大弹窗 */}
      <Dialog open={!!detailArchive} onOpenChange={(open) => !open && setDetailArchive(null)}>
        <DialogContent className="sm:max-w-6xl max-h-[92vh] overflow-y-auto p-0">
          {detailArchive && (
            <div className="p-6">
              <DialogHeader className="mb-4">
                <DialogTitle>「{detailArchive.topicName}」毕设档案</DialogTitle>
                <DialogDescription>学生：{detailArchive.studentName}（{detailArchive.studentId}）| 指导教师：{detailArchive.advisorName} | 当前阶段：{PHASE_LABELS[detailArchive.phase]}</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="base">
                <TabsList className="mb-4 grid w-full grid-cols-4">
                  <TabsTrigger value="base">基础信息</TabsTrigger>
                  <TabsTrigger value="process">过程性文档</TabsTrigger>
                  <TabsTrigger value="output">成果性文档</TabsTrigger>
                  <TabsTrigger value="evaluation">评价记录</TabsTrigger>
                </TabsList>

                {/* 基础信息 */}
                <TabsContent value="base" className="space-y-4">
                  <div className="rounded-lg border bg-muted/30 p-5">
                    <h3 className="mb-4 text-sm font-semibold">毕设项目基础信息</h3>
                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                      <div><span className="text-muted-foreground">选题名称：</span><span className="font-medium">{detailArchive.topicName}</span></div>
                      <div><span className="text-muted-foreground">学生姓名：</span>{detailArchive.studentName}（{detailArchive.studentId}）</div>
                      <div><span className="text-muted-foreground">指导教师：</span>{detailArchive.advisorName}</div>
                      <div><span className="text-muted-foreground">企业导师：</span>{detailArchive.enterpriseMentorName || '-'}</div>
                      <div><span className="text-muted-foreground">关联岗位：</span>{detailArchive.positionName}</div>
                      <div><span className="text-muted-foreground">当前阶段：</span><Badge variant="outline">{PHASE_LABELS[detailArchive.phase]}</Badge></div>
                      <div><span className="text-muted-foreground">开始日期：</span>{formatDate(new Date('2024-03-01'))}</div>
                      <div><span className="text-muted-foreground">结束日期：</span>{formatDate(new Date('2024-06-30'))}</div>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-5">
                    <h3 className="mb-3 text-sm font-semibold">选题描述</h3>
                    <p className="text-sm text-muted-foreground">该项目旨在通过微服务架构设计和实现一个完整的在线教育平台，涵盖用户管理、课程管理、直播互动、作业测评等核心模块。</p>
                  </div>
                </TabsContent>

                {/* 过程性文档 */}
                <TabsContent value="process" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">过程性文档管理</h3>
                    <Button size="sm" variant="outline" onClick={() => { setAddDocCategory('proposal'); setAddDocOpen(true) }}><Plus className="mr-1 size-3" />添加文档</Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {PROCESS_CATS.map(cat => {
                      const catDocs = getDocs(detailArchive.id).filter(d => d.category === cat)
                      return (
                        <div key={cat} className="rounded-lg border p-4">
                          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">{CATEGORY_META[cat].icon}{CATEGORY_META[cat].label}</div>
                          {catDocs.length === 0 ? (
                            <div className="py-4 text-center text-xs text-muted-foreground">暂无{CATEGORY_META[cat].label}文档</div>
                          ) : (
                            <div className="space-y-2">
                              {catDocs.map(doc => (
                                <div key={doc.id} className="rounded-md border bg-white p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <FileText className="size-4 text-blue-500" />
                                      <span className="text-sm font-medium">{doc.name}</span>
                                    </div>
                                    {getDocStatusBadge(doc.status)}
                                  </div>
                                  <div className="mt-1 text-xs text-muted-foreground">上传时间：{formatDate(doc.uploadTime)}</div>
                                  {doc.feedback && (
                                    <div className="mt-2 rounded-md bg-amber-50 p-2 text-xs text-amber-700">
                                      <span className="font-medium">教师反馈（{doc.feedbackBy}）：</span>{doc.feedback}
                                    </div>
                                  )}
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => openFeedback(doc, 'review')}><Pencil className="mr-1 size-3" />批注</Button>
                                    <Button size="sm" variant="outline" className="h-7 text-xs text-amber-600" onClick={() => openFeedback(doc, 'return')}><XCircle className="mr-1 size-3" />退回</Button>
                                    <Button size="sm" variant="outline" className="h-7 text-xs text-red-600" onClick={() => openFeedback(doc, 'rectify')}><RotateCcw className="mr-1 size-3" />整改</Button>
                                    <Button size="sm" variant="outline" className="h-7 text-xs text-emerald-600" onClick={() => openFeedback(doc, 'pass')}><CheckCircle2 className="mr-1 size-3" />通过</Button>
                                    <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => handleDeleteDoc(doc.id)}><Trash2 className="size-3" /></Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>

                {/* 成果性文档 */}
                <TabsContent value="output" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">成果性文档管理</h3>
                    <Button size="sm" variant="outline" onClick={() => { setAddDocCategory('product'); setAddDocOpen(true) }}><Plus className="mr-1 size-3" />添加文档</Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {OUTPUT_CATS.map(cat => {
                      const catDocs = getDocs(detailArchive.id).filter(d => d.category === cat)
                      return (
                        <div key={cat} className="rounded-lg border p-4">
                          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">{CATEGORY_META[cat].icon}{CATEGORY_META[cat].label}</div>
                          {catDocs.length === 0 ? (
                            <div className="py-4 text-center text-xs text-muted-foreground">暂无{CATEGORY_META[cat].label}文档</div>
                          ) : (
                            <div className="space-y-2">
                              {catDocs.map(doc => (
                                <div key={doc.id} className="rounded-md border bg-white p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <FileText className="size-4 text-emerald-500" />
                                      <span className="text-sm font-medium">{doc.name}</span>
                                    </div>
                                    {getDocStatusBadge(doc.status)}
                                  </div>
                                  <div className="mt-1 text-xs text-muted-foreground">上传时间：{formatDate(doc.uploadTime)}</div>
                                  {doc.feedback && (
                                    <div className="mt-2 rounded-md bg-amber-50 p-2 text-xs text-amber-700">
                                      <span className="font-medium">教师反馈（{doc.feedbackBy}）：</span>{doc.feedback}
                                    </div>
                                  )}
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => openFeedback(doc, 'review')}><Pencil className="mr-1 size-3" />批注</Button>
                                    <Button size="sm" variant="outline" className="h-7 text-xs text-amber-600" onClick={() => openFeedback(doc, 'return')}><XCircle className="mr-1 size-3" />退回</Button>
                                    <Button size="sm" variant="outline" className="h-7 text-xs text-red-600" onClick={() => openFeedback(doc, 'rectify')}><RotateCcw className="mr-1 size-3" />整改</Button>
                                    <Button size="sm" variant="outline" className="h-7 text-xs text-emerald-600" onClick={() => openFeedback(doc, 'pass')}><CheckCircle2 className="mr-1 size-3" />通过</Button>
                                    <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => handleDeleteDoc(doc.id)}><Trash2 className="size-3" /></Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </TabsContent>

                {/* 评价记录 */}
                <TabsContent value="evaluation" className="space-y-4">
                  <div className="rounded-lg border bg-muted/30 p-5">
                    <h3 className="mb-3 text-sm font-semibold">各阶段评价结果</h3>
                    <div className="space-y-3">
                      {processEvaluations.filter(p => p.archiveId === detailArchive.id).length === 0 ? (
                        <div className="text-sm text-muted-foreground">暂无评价记录</div>
                      ) : (
                        processEvaluations.filter(p => p.archiveId === detailArchive.id).map(proc => (
                          <div key={proc.id} className="flex items-center justify-between rounded-md border bg-white px-4 py-3">
                            <div>
                              <div className="text-sm font-medium">{proc.phase === 'proposal' ? '开题评价' : proc.phase === 'midterm' ? '中期评价' : '过程评价'}</div>
                              <div className="text-xs text-muted-foreground">{proc.comment}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-600">{proc.advisorScore}</div>
                              <div className="text-xs text-muted-foreground">{formatDate(proc.evaluatedAt)}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-5">
                    <h3 className="mb-3 text-sm font-semibold">整改意见</h3>
                    <div className="space-y-3">
                      {rectificationDetails.filter(r => r.archiveId === detailArchive.id).length === 0 ? (
                        <div className="text-sm text-muted-foreground">暂无整改记录</div>
                      ) : (
                        rectificationDetails.filter(r => r.archiveId === detailArchive.id).map(rect => (
                          <div key={rect.id} className="rounded-md bg-red-50 p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-red-700">整改要求</span>
                              <Badge variant="outline" className="text-xs">{rect.status === 'pending' ? '待整改' : rect.status === 'submitted' ? '已提交' : '已通过'}</Badge>
                            </div>
                            <div className="mt-1 text-xs text-red-600">{rect.requirement}</div>
                            <div className="mt-1 text-xs text-muted-foreground">截止日期：{formatDate(rect.deadline)}</div>
                            {rect.studentResponse && <div className="mt-1 text-xs text-emerald-600">学生回复：{rect.studentResponse}</div>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 教师反馈弹窗 */}
      <Dialog open={feedbackOpen} onOpenChange={(open) => !open && setFeedbackOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {feedbackAction === 'review' ? '文档批注' : feedbackAction === 'return' ? '退回文档' : feedbackAction === 'rectify' ? '标记整改' : '通过文档'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="mb-2 text-sm text-muted-foreground">文档：{feedbackDoc?.name}</p>
            <div className="grid gap-2">
              <Label>{feedbackAction === 'pass' ? '通过说明（可选）' : feedbackAction === 'return' ? '退回原因' : feedbackAction === 'rectify' ? '整改要求' : '批注内容'}</Label>
              <Textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="请输入内容..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackOpen(false)}>取消</Button>
            <Button variant={feedbackAction === 'return' ? 'destructive' : feedbackAction === 'pass' ? 'default' : 'default'} onClick={handleFeedback}>
              {feedbackAction === 'review' ? '保存批注' : feedbackAction === 'return' ? '确认退回' : feedbackAction === 'rectify' ? '确认整改' : '确认通过'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 添加文档弹窗 */}
      <Dialog open={addDocOpen} onOpenChange={(open) => !open && setAddDocOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>添加文档</DialogTitle></DialogHeader>
          <div className="py-2">
            <div className="grid gap-3">
              <div className="grid gap-2"><Label>文档类别</Label>
                <Select value={addDocCategory} onValueChange={(v) => setAddDocCategory(v as DocCategory)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_META).map(([key, meta]) => (
                      <SelectItem key={key} value={key}>{meta.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label>文档名称</Label><Input value={addDocName} onChange={(e) => setAddDocName(e.target.value)} placeholder="请输入文档名称" /></div>
              <div className="rounded-lg border border-dashed p-6 text-center">
                <Upload className="mx-auto mb-2 size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">点击或拖拽文件到此处上传</p>
              </div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setAddDocOpen(false)}>取消</Button><Button onClick={handleAddDoc}><Plus className="mr-2 size-4" />添加</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

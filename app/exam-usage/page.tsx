"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, BookOpen, Video, GraduationCap, PlayCircle, X, ChevronDown, Check, MoreHorizontal, Eye, Pencil, Trash2, Clock, CheckCircle2, XCircle, Share2, Link as LinkIcon } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useData } from "@/components/providers/data-provider"

// 使用类型：随堂测、在线考试
type UsageType = 'quiz' | 'exam'

// 使用场景：场景、课程
type SceneType = 'scene' | 'course'

export interface ExamUsage {
  id: string
  examId: string
  examName: string
  displayType: '场景' | '课程' | '教学考试'
  sceneName: string
  usageType: UsageType
  description?: string
  duration?: number
  startTime?: Date
  endTime?: Date
  participantCount: number
  passCount?: number
  status: 'pending' | 'active' | 'ended'
}

// 模拟班级数据
export const mockClasses = [
  { id: 'class-1', name: '2024级前端开发1班' },
  { id: 'class-2', name: '2024级前端开发2班' },
  { id: 'class-3', name: '2024级后端开发1班' },
  { id: 'class-4', name: '2024级后端开发2班' },
  { id: 'class-5', name: '2024级全栈开发班' },
  { id: 'class-6', name: '2024级测试工程班' },
  { id: 'class-7', name: '2024级产品设计班' },
  { id: 'class-8', name: '2023级前端开发1班' },
]

// 模拟使用记录数据
export const mockUsages: ExamUsage[] = [
  {
    id: 'usage-1',
    examId: 'exam-1',
    examName: '前端基础测试',
    displayType: '课程',
    sceneName: 'JavaScript入门到精通',
    usageType: 'quiz',
    description: 'JavaScript基础语法与API测试',
    duration: 60,
    startTime: new Date('2024-03-10 14:00'),
    endTime: new Date('2024-03-10 15:00'),
    participantCount: 156,
    passCount: 128,
    status: 'active',
  },
  {
    id: 'usage-2',
    examId: 'exam-1',
    examName: '前端基础测试',
    displayType: '场景',
    sceneName: '2024春季招聘',
    usageType: 'exam',
    description: '2024年春季校园招聘技术笔试',
    duration: 120,
    startTime: new Date('2024-03-15 09:00'),
    endTime: new Date('2024-03-15 11:00'),
    participantCount: 89,
    passCount: 67,
    status: 'ended',
  },
  {
    id: 'usage-3',
    examId: 'exam-2',
    examName: 'TypeScript 能力测试',
    displayType: '教学考试',
    sceneName: 'TypeScript高级教程',
    usageType: 'quiz',
    description: 'TypeScript类型系统与高级特性测验',
    duration: 45,
    startTime: new Date('2024-03-20 10:00'),
    endTime: new Date('2024-03-20 10:45'),
    participantCount: 42,
    passCount: 38,
    status: 'active',
  },
  {
    id: 'usage-4',
    examId: 'exam-2',
    examName: 'TypeScript 能力测试',
    displayType: '场景',
    sceneName: '技术能力评估',
    usageType: 'exam',
    description: '季度技术能力综合评估',
    duration: 90,
    startTime: new Date('2024-04-01 14:00'),
    endTime: new Date('2024-04-01 15:30'),
    participantCount: 0,
    passCount: 0,
    status: 'pending',
  },
  {
    id: 'usage-5',
    examId: 'exam-3',
    examName: 'React 进阶考核',
    displayType: '教学考试',
    sceneName: 'React实战开发',
    usageType: 'exam',
    description: 'React Hooks与性能优化专项考核',
    duration: 120,
    startTime: new Date('2024-04-10 09:00'),
    endTime: new Date('2024-04-10 11:00'),
    participantCount: 0,
    passCount: 0,
    status: 'pending',
  },
  {
    id: 'usage-6',
    examId: 'exam-4',
    examName: 'Node.js 后端测试',
    displayType: '课程',
    sceneName: '后端开发岗位筛选',
    usageType: 'exam',
    description: 'Node.js基础与Express框架测试',
    duration: 100,
    startTime: new Date('2024-02-28 14:00'),
    endTime: new Date('2024-02-28 15:40'),
    participantCount: 56,
    passCount: 44,
    status: 'ended',
  },
]

const USAGE_TYPE_LABELS: Record<UsageType, string> = {
  quiz: '随堂测',
  exam: '教学考试',
}

const SCENE_TYPE_LABELS: Record<SceneType, string> = {
  scene: '场景',
  course: '课程',
}

const STATUS_LABELS = {
  pending: '未开始',
  active: '进行中',
  ended: '已结束',
}

export default function ExamUsagePage() {
  const router = useRouter()
  const { exams } = useData()

  const [search, setSearch] = useState("")
  const [sceneFilter, setSceneFilter] = useState<SceneType | "all">("all")
  const [usageFilter, setUsageFilter] = useState<UsageType | "all">("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  
  // 创建在线考试表单
  const [selectedExamId, setSelectedExamId] = useState<string>("")
  const [examName, setExamName] = useState("")
  const [examDesc, setExamDesc] = useState("")
  const [examDuration, setExamDuration] = useState(60)
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([])
  const [examOpenType, setExamOpenType] = useState<'anytime' | 'scheduled' | 'manual'>("anytime")
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [publishToFront, setPublishToFront] = useState(false)
  const [examLink, setExamLink] = useState("")

  const selectedExam = exams.find(e => e.id === selectedExamId)

  const filteredUsages = useMemo(() => {
    return mockUsages.filter((usage) => {
      const matchSearch = 
        usage.examName.toLowerCase().includes(search.toLowerCase()) ||
        usage.sceneName.toLowerCase().includes(search.toLowerCase())
      const matchScene = sceneFilter === "all" || usage.sceneType === sceneFilter
      const matchUsage = usageFilter === "all" || usage.usageType === usageFilter
      return matchSearch && matchScene && matchUsage
    })
  }, [search, sceneFilter, usageFilter])

  // 统计数据
  const stats = useMemo(() => {
    const courseCount = mockUsages.filter((u) => u.displayType === '课程').length
    const sceneCount = mockUsages.filter((u) => u.displayType === '场景').length
    const onlineExamCount = mockUsages.filter((u) => u.displayType === '教学考试').length
    const pendingCount = mockUsages.filter((u) => u.status === 'pending').length
    const activeCount = mockUsages.filter((u) => u.status === 'active').length
    const endedCount = mockUsages.filter((u) => u.status === 'ended').length
    return { courseCount, sceneCount, onlineExamCount, pendingCount, activeCount, endedCount }
  }, [])

  const handleToggleClass = (classId: string) => {
    setSelectedClassIds(prev => 
      prev.includes(classId) ? prev.filter(id => id !== classId) : [...prev, classId]
    )
  }

  const handleCreateExam = () => {
    if (!selectedExamId || !examName) return
    setCreateDialogOpen(false)
    // 重置表单
    setSelectedExamId("")
    setExamName("")
    setExamDesc("")
    setExamDuration(60)
    setSelectedClassIds([])
    setExamOpenType("anytime")
    setStartTime("")
    setEndTime("")
    setPublishToFront(false)
    setExamLink("")
  }

  const handleShareExam = (usage: ExamUsage) => {
    const url = `https://exam.example.com/e/${usage.id}`
    navigator.clipboard.writeText(url)
    alert(`已复制考试链接：${url}`)
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

  const getDisplayTypeIcon = (displayType: ExamUsage['displayType']) => {
    switch (displayType) {
      case '场景':
        return <BookOpen className="size-4" />
      case '课程':
        return <Video className="size-4" />
      case '教学考试':
        return <GraduationCap className="size-4" />
    }
  }

  const getStatusBadge = (status: ExamUsage['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">{STATUS_LABELS[status]}</Badge>
      case 'active':
        return <Badge variant="default" className="bg-green-500">{STATUS_LABELS[status]}</Badge>
      case 'ended':
        return <Badge variant="outline">{STATUS_LABELS[status]}</Badge>
    }
  }

  const isFormValid = selectedExamId && examName

  return (
    <div className="px-8 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">考试管理</h1>
          <p className="text-muted-foreground">查看试卷在各模块的使用情况</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 size-4" />
          添加考试
        </Button>
      </div>

      {/* 精简统计 */}
      <div className="mb-4 flex gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-blue-50">
            <GraduationCap className="size-4 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground">考试类型分布</div>
            <div className="flex items-center gap-2 text-xs">
              <span>课程 <strong className="text-foreground">{stats.courseCount}</strong></span>
              <span className="text-gray-300">|</span>
              <span>场景 <strong className="text-foreground">{stats.sceneCount}</strong></span>
              <span className="text-gray-300">|</span>
              <span>教学考试 <strong className="text-emerald-600">{stats.onlineExamCount}</strong></span>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-amber-50">
            <Clock className="size-4 text-amber-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground">考试状态分布</div>
            <div className="flex items-center gap-2 text-xs">
              <span>未开始 <strong className="text-amber-600">{stats.pendingCount}</strong></span>
              <span className="text-gray-300">|</span>
              <span>进行中 <strong className="text-green-600">{stats.activeCount}</strong></span>
              <span className="text-gray-300">|</span>
              <span>已结束 <strong className="text-foreground">{stats.endedCount}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 筛选栏 */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索试卷或场景名称..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sceneFilter} onValueChange={(v) => setSceneFilter(v as SceneType | "all")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="全部场景" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">全部场景</SelectItem>
              <SelectItem value="scene">场景</SelectItem>
              <SelectItem value="course">课程</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={usageFilter} onValueChange={(v) => setUsageFilter(v as UsageType | "all")}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="全部类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="quiz">随堂测</SelectItem>
              <SelectItem value="exam">教学考试</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* 使用记录列表 */}
      <div className="rounded-lg border bg-white px-4 py-3">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">试卷名称</TableHead>
                <TableHead className="w-[120px]">使用场景</TableHead>
                <TableHead className="w-[160px]">考试描述</TableHead>
                <TableHead className="w-[90px]">考试时长</TableHead>
                <TableHead className="w-[90px]">参考人数</TableHead>
                <TableHead className="w-[160px]">考试开放时间</TableHead>
                <TableHead className="w-[90px]">及格人数</TableHead>
                <TableHead className="w-[90px]">考试状态</TableHead>
                <TableHead className="sticky right-0 w-[140px] bg-white text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    暂无使用记录
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsages.map((usage) => (
                  <TableRow key={usage.id}>
                    <TableCell className="font-medium">{usage.examName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDisplayTypeIcon(usage.displayType)}
                        <span className="text-sm">{usage.displayType}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground line-clamp-2">
                        {usage.description || '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{usage.duration ? `${usage.duration} 分钟` : '-'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{usage.participantCount} 人</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {usage.startTime && usage.endTime ? (
                        <div className="text-xs">
                          <div>{formatDate(usage.startTime)}</div>
                          <div>至 {formatDate(usage.endTime)}</div>
                        </div>
                      ) : (
                        <span className="text-xs">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{usage.passCount !== undefined ? `${usage.passCount} 人` : '-'}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(usage.status)}</TableCell>
                    <TableCell className="sticky right-0 bg-white text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-emerald-600" onClick={() => handleShareExam(usage)}>
                          <Share2 className="size-3" />分享考试
                        </Button>
                        {usage.status === 'ended' && (
                          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-blue-600" onClick={() => router.push(`/exam-usage/results?usageId=${usage.id}`)}>
                            <Eye className="size-3" />查看考试结果
                          </Button>
                        )}
                        {usage.status !== 'ended' && (
                          <span className="text-xs text-muted-foreground">-</span>
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

      {/* 创建在线考试弹窗 */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>创建在线考试</DialogTitle>
            <DialogDescription>
              配置考试基本信息，选择试卷并设置考试参数
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <FieldGroup className="py-4">
              <Field>
                <FieldLabel>选择试卷 *</FieldLabel>
                <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择一份试卷" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {exams.length === 0 ? (
                        <SelectItem value="none" disabled>暂无可用试卷</SelectItem>
                      ) : (
                        exams.map((exam) => (
                          <SelectItem key={exam.id} value={exam.id}>
                            {exam.name}（{exam.totalScore}分 / {exam.questions.length}题）
                          </SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>考试名称 *</FieldLabel>
                <Input
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="请输入考试名称"
                />
              </Field>

              <Field>
                <FieldLabel>考试描述</FieldLabel>
                <Textarea
                  value={examDesc}
                  onChange={(e) => setExamDesc(e.target.value)}
                  placeholder="请输入考试描述（可选）"
                  rows={2}
                />
              </Field>

              <Field>
                <FieldLabel>考试时长（分钟）</FieldLabel>
                <Input
                  type="number"
                  min={1}
                  max={300}
                  value={examDuration}
                  onChange={(e) => setExamDuration(Number(e.target.value))}
                />
              </Field>

              <Field>
                <FieldLabel>参考班级</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between font-normal">
                      <span className="truncate">
                        {selectedClassIds.length === 0
                          ? "请选择参考班级"
                          : `已选 ${selectedClassIds.length} 个班级`
                        }
                      </span>
                      <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[320px] p-0" align="start">
                    <ScrollArea className="h-[200px] overflow-hidden">
                      <div className="p-2">
                        {mockClasses.map((cls) => (
                          <label
                            key={cls.id}
                            className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-muted"
                          >
                            <Checkbox
                              checked={selectedClassIds.includes(cls.id)}
                              onCheckedChange={() => handleToggleClass(cls.id)}
                            />
                            <span className="text-sm">{cls.name}</span>
                            {selectedClassIds.includes(cls.id) && (
                              <Check className="ml-auto size-3.5 text-primary" />
                            )}
                          </label>
                        ))}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
              </Field>

              <Field>
                <FieldLabel>考试时间</FieldLabel>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 rounded border p-2 cursor-pointer hover:bg-muted">
                    <input type="radio" name="openType" checked={examOpenType === 'anytime'} onChange={() => setExamOpenType('anytime')} />
                    <span className="text-sm">随时开放</span>
                  </label>
                  <label className="flex items-center gap-2 rounded border p-2 cursor-pointer hover:bg-muted">
                    <input type="radio" name="openType" checked={examOpenType === 'scheduled'} onChange={() => setExamOpenType('scheduled')} />
                    <span className="text-sm">定期开放</span>
                  </label>
                  {examOpenType === 'scheduled' && (
                    <div className="flex items-center gap-2 pl-6">
                      <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="flex-1" />
                      <span className="text-sm text-muted-foreground">至</span>
                      <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="flex-1" />
                    </div>
                  )}
                  <label className="flex items-center gap-2 rounded border p-2 cursor-pointer hover:bg-muted">
                    <input type="radio" name="openType" checked={examOpenType === 'manual'} onChange={() => setExamOpenType('manual')} />
                    <span className="text-sm">手动开放（在列表中点击“开放考试”按钮）</span>
                  </label>
                </div>
              </Field>

              <Field>
                <FieldLabel>是否发布到前台</FieldLabel>
                <div className="flex items-center gap-2">
                  <Switch checked={publishToFront} onCheckedChange={setPublishToFront} />
                  <span className="text-sm text-muted-foreground">{publishToFront ? '已发布' : '未发布'}</span>
                </div>
              </Field>

              <Field>
                <FieldLabel>考试说明链接</FieldLabel>
                <div className="flex items-center gap-2">
                  <LinkIcon className="size-4 text-muted-foreground" />
                  <Input
                    value={examLink}
                    onChange={(e) => setExamLink(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </Field>
            </FieldGroup>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreateExam} disabled={!isFormValid}>
              创建考试
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

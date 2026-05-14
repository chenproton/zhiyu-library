"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, BookOpen, Video, GraduationCap, PlayCircle } from "lucide-react"
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
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { useData } from "@/components/providers/data-provider"

// 使用类型：随堂测、在线考试
type UsageType = 'quiz' | 'exam'

// 使用场景：场景、课程
type SceneType = 'scene' | 'course'

interface ExamUsage {
  id: string
  examId: string
  examName: string
  sceneType: SceneType
  sceneName: string
  usageType: UsageType
  startTime?: Date
  endTime?: Date
  participantCount: number
  status: 'pending' | 'active' | 'ended'
}

// 模拟使用记录数据
const mockUsages: ExamUsage[] = [
  {
    id: 'usage-1',
    examId: 'exam-1',
    examName: '前端基础测试',
    sceneType: 'course',
    sceneName: 'JavaScript入门到精通',
    usageType: 'quiz',
    participantCount: 156,
    status: 'active',
  },
  {
    id: 'usage-2',
    examId: 'exam-1',
    examName: '前端基础测试',
    sceneType: 'scene',
    sceneName: '2024春季招聘',
    usageType: 'exam',
    startTime: new Date('2024-03-15 09:00'),
    endTime: new Date('2024-03-15 11:00'),
    participantCount: 89,
    status: 'ended',
  },
  {
    id: 'usage-3',
    examId: 'exam-2',
    examName: 'TypeScript 能力测试',
    sceneType: 'course',
    sceneName: 'TypeScript高级教程',
    usageType: 'quiz',
    participantCount: 42,
    status: 'active',
  },
  {
    id: 'usage-4',
    examId: 'exam-2',
    examName: 'TypeScript 能力测试',
    sceneType: 'scene',
    sceneName: '技术能力评估',
    usageType: 'exam',
    startTime: new Date('2024-04-01 14:00'),
    endTime: new Date('2024-04-01 16:00'),
    participantCount: 0,
    status: 'pending',
  },
]

const USAGE_TYPE_LABELS: Record<UsageType, string> = {
  quiz: '随堂测',
  exam: '在线考试',
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
  const { exams, createExam } = useData()

  const [search, setSearch] = useState("")
  const [sceneFilter, setSceneFilter] = useState<SceneType | "all">("all")
  const [usageFilter, setUsageFilter] = useState<UsageType | "all">("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  
  // 创建在线考试表单
  const [newExamName, setNewExamName] = useState("")
  const [newExamDesc, setNewExamDesc] = useState("")
  const [newExamDuration, setNewExamDuration] = useState(60)

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

  const handleCreateExam = () => {
    if (!newExamName.trim()) return
    
    const newExam = createExam({
      name: newExamName.trim(),
      description: newExamDesc.trim(),
      duration: newExamDuration,
    })
    
    setCreateDialogOpen(false)
    setNewExamName("")
    setNewExamDesc("")
    setNewExamDuration(60)
    
    // 跳转到组卷页面
    router.push(`/exams/${newExam.id}`)
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

  const getSceneIcon = (sceneType: SceneType) => {
    switch (sceneType) {
      case 'scene':
        return <BookOpen className="size-4" />
      case 'course':
        return <Video className="size-4" />
    }
  }

  const getUsageIcon = (usageType: UsageType) => {
    switch (usageType) {
      case 'quiz':
        return <PlayCircle className="size-4" />
      case 'exam':
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

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">试卷管理</h1>
          <p className="text-muted-foreground">查看试卷在各模块的使用情况，创建在线考试</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 size-4" />
          创建在线考试
        </Button>
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
              <SelectItem value="exam">在线考试</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* 使用记录列表 */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">试卷名称</TableHead>
              <TableHead className="w-[150px]">使用场景</TableHead>
              <TableHead className="w-[100px]">使用类型</TableHead>
              <TableHead className="w-[180px]">考试时间</TableHead>
              <TableHead className="w-[100px]">参与人数</TableHead>
              <TableHead className="w-[100px]">状态</TableHead>
              <TableHead className="w-[100px] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  暂无使用记录
                </TableCell>
              </TableRow>
            ) : (
              filteredUsages.map((usage) => (
                <TableRow key={usage.id}>
                  <TableCell className="font-medium">{usage.examName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getSceneIcon(usage.sceneType)}
                      <span>{usage.sceneName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getUsageIcon(usage.usageType)}
                      <span>{USAGE_TYPE_LABELS[usage.usageType]}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {usage.startTime && usage.endTime ? (
                      <div className="text-xs">
                        <div>{formatDate(usage.startTime)}</div>
                        <div>至 {formatDate(usage.endTime)}</div>
                      </div>
                    ) : (
                      <span className="text-xs">不限时间</span>
                    )}
                  </TableCell>
                  <TableCell>{usage.participantCount} 人</TableCell>
                  <TableCell>{getStatusBadge(usage.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/exams/${usage.examId}`)}
                    >
                      查看试卷
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 创建在线考试弹窗 */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>创建在线考试</DialogTitle>
            <DialogDescription>
              创建一份新的在线考试试卷，创建后可进入组卷页面添加题目
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="exam-name">试卷名称</FieldLabel>
              <Input
                id="exam-name"
                value={newExamName}
                onChange={(e) => setNewExamName(e.target.value)}
                placeholder="请输入试卷名称"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="exam-desc">试卷描述</FieldLabel>
              <Textarea
                id="exam-desc"
                value={newExamDesc}
                onChange={(e) => setNewExamDesc(e.target.value)}
                placeholder="请输入试卷描述（可选）"
                rows={3}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="exam-duration">考试时长（分钟）</FieldLabel>
              <Input
                id="exam-duration"
                type="number"
                min={1}
                value={newExamDuration}
                onChange={(e) => setNewExamDuration(Number(e.target.value))}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreateExam} disabled={!newExamName.trim()}>
              创建并进入组卷
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

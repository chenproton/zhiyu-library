"use client"

import { useState, useEffect, Suspense } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  BookOpen,
  BookOpenCheck,
  ClipboardList,
  Database,
  FileQuestion,
  Gavel,
  GraduationCap,
  PenLine,
  Target,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Bookmark,
  BookMarked,
  Lightbulb,
  Award,
  Link2,
  ExternalLink,
  FileText,
  Video,
  Image,
  Eye,
  File,
  Package,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { studentSubmissions } from "@/lib/scene-mock-data"
import type { LocalSubmission, TaskPhase, SimulatedTask, AssessmentForm } from "../components/types"
import { simulatedTasksMap, paperQuestions, questionBankQuestions, granularLessons } from "../components/task-data"
import { LearningFloat } from "../components/learning-float"
import { ExamPanel } from "../components/exam-panel"
import { ReviewSubmitPanel } from "../components/review-submit"
import { OnSiteQAPanel } from "../components/onsite-qa"
import { SubmissionSuccess } from "../components/submission-success"

const formIcons: Record<string, React.ReactNode> = {
  paper: <ClipboardList className="h-4 w-4" />,
  question_bank: <Database className="h-4 w-4" />,
  random_draw: <FileQuestion className="h-4 w-4" />,
  review: <Gavel className="h-4 w-4" />,
}

const formLabels: Record<string, string> = {
  paper: "试卷",
  question_bank: "题库",
  random_draw: "现场问答",
  review: "评审",
}

const formColors: Record<string, string> = {
  paper: "bg-green-50 text-green-600 border-green-200",
  question_bank: "bg-orange-50 text-orange-600 border-orange-200",
  random_draw: "bg-blue-50 text-blue-600 border-blue-200",
  review: "bg-purple-50 text-purple-600 border-purple-200",
}

const ASSESSMENT_SEQUENCE: AssessmentForm[] = ["paper", "question_bank", "review", "random_draw"]

// ============================================================================
// 关联内容面板常量
// ============================================================================
const resourceTypeIcons: Record<string, React.ReactNode> = {
  link: <ExternalLink className="h-3.5 w-3.5 text-blue-500" />,
  document: <FileText className="h-3.5 w-3.5 text-blue-500" />,
  video: <Video className="h-3.5 w-3.5 text-rose-500" />,
  image: <Image className="h-3.5 w-3.5 text-green-500" />,
  tool: <ExternalLink className="h-3.5 w-3.5 text-cyan-500" />,
  spreadsheet: <FileText className="h-3.5 w-3.5 text-teal-500" />,
  audio: <Video className="h-3.5 w-3.5 text-violet-500" />,
  archive: <FileText className="h-3.5 w-3.5 text-orange-500" />,
  venue: <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />,
  facility: <GraduationCap className="h-3.5 w-3.5 text-gray-500" />,
  software: <ExternalLink className="h-3.5 w-3.5 text-pink-500" />,
  other: <File className="h-3.5 w-3.5 text-gray-500" />,
}

const resourceTypeLabels: Record<string, string> = {
  link: "链接",
  document: "文档",
  video: "视频",
  image: "图片",
  tool: "工具",
  spreadsheet: "表格",
  audio: "音频",
  archive: "压缩包",
  venue: "场地",
  facility: "设备",
  software: "软件",
  other: "其他",
}

const requiredLevelColors: Record<string, string> = {
  "精通": "border-green-200 text-green-700 bg-green-50",
  "熟练": "border-blue-200 text-blue-700 bg-blue-50",
  "掌握": "border-cyan-200 text-cyan-700 bg-cyan-50",
  "理解": "border-amber-200 text-amber-700 bg-amber-50",
  "了解": "border-gray-200 text-gray-700 bg-gray-50",
}

// ============================================================================
// 方案 A：先学后测 - 学习阶段主界面（大卡片任务说明书）
// ============================================================================
function TaskDescriptionDialog({
  task,
  open,
  onOpenChange,
}: {
  task: SimulatedTask
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-[95vw] sm:max-h-[95vh] h-[95vh] w-[95vw] p-0 flex flex-col gap-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/50 shrink-0">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <span className="text-base font-medium">任务说明</span>
              <Badge variant="outline" className="text-xs">{task.scenarioName}</Badge>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onOpenChange(false)} title="退出全屏">
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto">
              <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {task.detailedDescription}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function LearningPhaseView({
  task,
  onStartAssessment,
}: {
  task: SimulatedTask
  onStartAssessment: () => void
}) {
  const [descOpen, setDescOpen] = useState(false)
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 任务说明卡片 */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">任务说明</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setDescOpen(true)} title="全屏查看">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500">请仔细阅读以下任务说明，理解任务目标和要求</p>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 rounded-lg p-4 max-h-[400px] overflow-y-auto">
            {task.detailedDescription}
          </div>
        </CardContent>
      </Card>

      <TaskDescriptionDialog task={task} open={descOpen} onOpenChange={setDescOpen} />

      {/* 底部开始测评按钮 */}
      <div className="flex justify-center pb-8">
        <Button size="lg" onClick={onStartAssessment} className="gap-2 px-8">
          <PenLine className="h-5 w-5" />
          我已阅读任务说明，开始测评
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// 关联内容面板（右侧固定栏）
// ============================================================================
function RelatedContentPanel({ task }: { task: SimulatedTask }) {
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailType, setDetailType] = useState<"knowledge" | "ability" | "resource" | null>(null)
  const [detailItem, setDetailItem] = useState<any>(null)

  const openDetail = (type: "knowledge" | "ability" | "resource", item: any) => {
    setDetailType(type)
    setDetailItem(item)
    setDetailOpen(true)
  }

  return (
    <>
      <Card className="border-l-4 border-l-blue-400 h-fit lg:sticky lg:top-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookMarked className="h-4 w-4 text-blue-500" />
              <CardTitle className="text-sm">关联内容</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setFullscreenOpen(true)}
              title="全屏查看"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs defaultValue="knowledge">
            <TabsList className="grid grid-cols-3 w-full mb-3">
              <TabsTrigger value="knowledge" className="text-xs gap-1">
                <Lightbulb className="h-3 w-3" />
                知识点
              </TabsTrigger>
              <TabsTrigger value="ability" className="text-xs gap-1">
                <Award className="h-3 w-3" />
                能力点
              </TabsTrigger>
              <TabsTrigger value="resources" className="text-xs gap-1">
                <Link2 className="h-3 w-3" />
                资源
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-300px)] min-h-[320px]">
              <TabsContent value="knowledge" className="m-0 space-y-2">
                {task.knowledgePoints.map((kp) => (
                  <div
                    key={kp.id}
                    className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-100 hover:bg-amber-50 transition-colors cursor-pointer"
                    onClick={() => openDetail("knowledge", kp)}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span className="text-sm font-medium text-gray-800">{kp.name}</span>
                      {kp.code && (
                        <Badge variant="outline" className="text-[10px] h-4 px-1 shrink-0">
                          {kp.code}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{kp.description}</p>
                    {kp.category && (
                      <Badge variant="secondary" className="mt-1 text-[10px] h-4">
                        {kp.category}
                      </Badge>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="ability" className="m-0 space-y-2">
                {task.abilityPoints.map((ap) => (
                  <div
                    key={ap.id}
                    className="p-2.5 rounded-lg bg-purple-50/50 border border-purple-100 hover:bg-purple-50 transition-colors cursor-pointer"
                    onClick={() => openDetail("ability", ap)}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Award className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                      <span className="text-sm font-medium text-gray-800">{ap.name}</span>
                      {ap.code && (
                        <Badge variant="outline" className="text-[10px] h-4 px-1 shrink-0">
                          {ap.code}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{ap.description}</p>
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      {ap.domain && (
                        <Badge variant="secondary" className="text-[10px] h-4">
                          {ap.domain}
                        </Badge>
                      )}
                      {ap.requiredLevel && (
                        <Badge
                          variant="outline"
                          className={`text-[10px] h-4 ${requiredLevelColors[ap.requiredLevel] || ""}`}
                        >
                          {ap.requiredLevel}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="resources" className="m-0 space-y-2">
                {task.resources.map((res) => (
                  <div
                    key={res.id}
                    className="p-2.5 rounded-lg bg-cyan-50/50 border border-cyan-100 hover:bg-cyan-50 transition-colors cursor-pointer"
                    onClick={() => openDetail("resource", res)}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {resourceTypeIcons[res.type] || <FileText className="h-3.5 w-3.5 text-gray-400" />}
                      <span className="text-sm font-medium text-gray-800">{res.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{res.description}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="outline" className="text-[10px] h-4">
                        {resourceTypeLabels[res.type] || res.type}
                      </Badge>
                      {res.size && <span className="text-[10px] text-gray-400">{res.size}</span>}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>

      {/* 全屏查看弹窗 */}
      <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-[95vw] sm:max-h-[95vh] h-[95vh] w-[95vw] p-0 flex flex-col gap-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/50 shrink-0">
              <div className="flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-blue-500" />
                <span className="text-base font-medium">关联内容</span>
                <Badge variant="outline" className="text-xs">{task.scenarioName}</Badge>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setFullscreenOpen(false)} title="退出全屏">
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden p-4">
              <Tabs defaultValue="knowledge" className="h-full flex flex-col">
                <TabsList className="shrink-0 grid grid-cols-3 h-10 mb-4">
                  <TabsTrigger value="knowledge" className="text-sm gap-1.5">
                    <Lightbulb className="h-4 w-4" />
                    知识点
                  </TabsTrigger>
                  <TabsTrigger value="ability" className="text-sm gap-1.5">
                    <Award className="h-4 w-4" />
                    能力点
                  </TabsTrigger>
                  <TabsTrigger value="resources" className="text-sm gap-1.5">
                    <Link2 className="h-4 w-4" />
                    资源
                  </TabsTrigger>
                </TabsList>
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <TabsContent value="knowledge" className="m-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {task.knowledgePoints.map((kp) => {
                        const relatedLessons =
                          kp.granularLessons
                            ?.map((gid) => granularLessons.find((g) => g.id === gid))
                            .filter(Boolean) || []
                        return (
                          <Card
                            key={kp.id}
                            className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-amber-300"
                            onClick={() => openDetail("knowledge", kp)}
                          >
                            <div className="flex items-start gap-2 mb-2">
                              <div className="p-1.5 bg-amber-50 rounded-lg shrink-0">
                                <Lightbulb className="h-4 w-4 text-amber-500" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{kp.name}</p>
                                {kp.code && (
                                  <Badge variant="outline" className="text-[10px] h-4 font-mono mt-0.5">
                                    {kp.code}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-2">{kp.description}</p>
                            {kp.category && (
                              <Badge variant="secondary" className="text-[10px] h-4">
                                {kp.category}
                              </Badge>
                            )}
                            {relatedLessons.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {relatedLessons.slice(0, 3).map((gl) => (
                                  <Badge key={gl!.id} variant="outline" className="text-[10px] h-4">
                                    <Sparkles className="h-2.5 w-2.5 mr-0.5 text-blue-400" />
                                    {gl!.name}
                                  </Badge>
                                ))}
                                {relatedLessons.length > 3 && (
                                  <Badge variant="outline" className="text-[10px] h-4">
                                    +{relatedLessons.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </Card>
                        )
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="ability" className="m-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {task.abilityPoints.map((ap) => (
                        <Card
                          key={ap.id}
                          className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-purple-300"
                          onClick={() => openDetail("ability", ap)}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <div className="p-1.5 bg-purple-50 rounded-lg shrink-0">
                              <Award className="h-4 w-4 text-purple-500" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">{ap.name}</p>
                              {ap.code && (
                                <Badge variant="outline" className="text-[10px] h-4 font-mono mt-0.5">
                                  {ap.code}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 mb-2">{ap.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {ap.domain && (
                              <Badge variant="secondary" className="text-[10px] h-4">{ap.domain}</Badge>
                            )}
                            {ap.requiredLevel && (
                              <Badge
                                variant="outline"
                                className={`text-[10px] h-4 ${requiredLevelColors[ap.requiredLevel] || ""}`}
                              >
                                {ap.requiredLevel}
                              </Badge>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="resources" className="m-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {task.resources.map((res) => (
                        <Card
                          key={res.id}
                          className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                          onClick={() => openDetail("resource", res)}
                        >
                          <div className="relative h-24 bg-gray-50 border-b border-gray-100 overflow-hidden">
                            {res.type === "image" ? (
                              <img src={res.url || "/placeholder.svg"} alt={res.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className={`p-2.5 rounded-xl border ${res.type === "document" ? "bg-blue-50 border-blue-200" : res.type === "video" ? "bg-rose-50 border-rose-200" : res.type === "link" ? "bg-cyan-50 border-cyan-200" : "bg-gray-50 border-gray-200"}`}>
                                  {resourceTypeIcons[res.type] || <Package className="h-6 w-6 text-gray-400" />}
                                </div>
                              </div>
                            )}
                            <div className="absolute bottom-1.5 left-1.5">
                              <Badge variant="outline" className="text-[9px] border">
                                {resourceTypeLabels[res.type] || res.type}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-medium text-gray-800 truncate mb-1">{res.name}</p>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-2">{res.description}</p>
                            <div className="flex items-center justify-between text-[11px] text-gray-400">
                              <span>{res.size || "—"}</span>
                              <span className="flex items-center gap-0.5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="h-3 w-3" />查看详情
                              </span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DetailDialog open={detailOpen} onOpenChange={setDetailOpen} type={detailType} item={detailItem} />
    </>
  )
}

// ============================================================================
// 方案 B：学测一体 - 左右分栏布局（主内容 + 关联内容侧边栏）
// ============================================================================
function IntegratedLayout({
  task,
  activeForms,
  assessmentPanels,
}: {
  task: SimulatedTask
  activeForms: AssessmentForm[]
  assessmentPanels: React.ReactNode
}) {
  const [descOpen, setDescOpen] = useState(false)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 items-start">
      {/* 左侧：主内容区（任务说明 + 测评内容上下排列） */}
      <div className="space-y-4">
        {/* 任务说明 */}
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                <CardTitle className="text-base">任务说明</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setDescOpen(true)} title="全屏查看">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 rounded-lg p-3 max-h-[400px] overflow-y-auto">
              {task.detailedDescription}
            </div>
          </CardContent>
        </Card>

        <TaskDescriptionDialog task={task} open={descOpen} onOpenChange={setDescOpen} />

        {/* 测评内容（放在任务说明下方） */}
        <div className="grid grid-cols-2 gap-4">
          {assessmentPanels}
        </div>
      </div>

      {/* 右侧：关联内容面板 */}
      <RelatedContentPanel task={task} />
    </div>
  )
}

// ============================================================================
// 主页面组件
// ============================================================================
function SimulationTaskInner() {
  const params = useParams()
  const searchParams = useSearchParams()
  const taskId = params.taskId as string
  const mode = searchParams.get("mode") as "separate" | "integrated" | null
  const embedded = searchParams.get("embedded") === "1"
  const task = simulatedTasksMap[taskId]

  const methodsParam = searchParams.get("methods")
  const parsedForms = methodsParam
    ? methodsParam.split(",").filter((m): m is AssessmentForm => ASSESSMENT_SEQUENCE.includes(m as AssessmentForm))
    : []
  const activeForms = parsedForms.length > 0 ? parsedForms : ASSESSMENT_SEQUENCE.slice(0, 1)
  const totalSteps = activeForms.length

  const [taskPhase, setTaskPhase] = useState<TaskPhase>(mode === "integrated" ? "assessment" : "learning")
  const [submission, setSubmission] = useState<LocalSubmission | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [submittedForms, setSubmittedForms] = useState<Set<string>>(new Set())

  const currentForm = activeForms[currentStep]

  useEffect(() => {
    setTaskPhase(mode === "integrated" ? "assessment" : "learning")
    setCurrentStep(0)
    setSubmittedForms(new Set())
  }, [mode])

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h1 className="text-xl font-medium text-gray-700">任务不存在</h1>
        <p className="text-sm text-gray-500 mt-2">请返回任务列表选择有效的模拟任务</p>
        <Button className="mt-4" asChild>
          <Link href="/scene-task-results/simulation">返回列表</Link>
        </Button>
      </div>
    )
  }

  const handleStartAssessment = () => {
    setTaskPhase("assessment")
    setCurrentStep(0)
    setSubmittedForms(new Set())
  }

  const handleSubmit = (sub: LocalSubmission) => {
    setSubmission(sub)
    try {
      ;(studentSubmissions as any).push(sub)
    } catch {
      // ignore
    }
    setTaskPhase("submitted")
  }

  const handleStepSubmit = (form: AssessmentForm, sub: LocalSubmission) => {
    const nextSubmitted = new Set([...submittedForms, form])
    setSubmittedForms(nextSubmitted)
    setSubmission(sub)
    try {
      ;(studentSubmissions as any).push(sub)
    } catch {
      // ignore
    }
    if (nextSubmitted.size >= activeForms.length) {
      setTaskPhase("submitted")
    }
  }

  const renderAssessmentPanel = (form: AssessmentForm, onStepSubmit?: (sub: LocalSubmission) => void) => {
    const submitHandler = onStepSubmit || handleSubmit
    switch (form) {
      case "paper":
        return (
          <ExamPanel
            questions={paperQuestions}
            duration={task.paperConfig?.duration || 60}
            taskName={task.name}
            assessmentForm="试卷"
            onSubmit={submitHandler}
            scenarioId={task.scenarioId}
            scenarioName={task.scenarioName}
            taskId={task.id}
          />
        )
      case "question_bank":
        return (
          <ExamPanel
            questions={questionBankQuestions}
            duration={task.questionBankConfig?.duration || 45}
            taskName={task.name}
            assessmentForm="题库"
            onSubmit={submitHandler}
            scenarioId={task.scenarioId}
            scenarioName={task.scenarioName}
            taskId={task.id}
          />
        )
      case "review":
        return (
          <ReviewSubmitPanel
            task={task}
            onSubmit={submitHandler}
            scenarioId={task.scenarioId}
            scenarioName={task.scenarioName}
            taskId={task.id}
          />
        )
      case "random_draw":
        return (
          <OnSiteQAPanel
            task={task}
            onSubmit={submitHandler}
            scenarioId={task.scenarioId}
            scenarioName={task.scenarioName}
            taskId={task.id}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={`space-y-4 pb-20 ${mode === "integrated" ? (embedded ? "px-6" : "") : "max-w-6xl mx-auto"} ${embedded ? "pt-16" : ""}`}>
      {embedded && (
        <button
          onClick={() => window.top?.postMessage({ type: "exit-simulation" }, "*")}
          className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-black/80 text-white rounded-full text-sm backdrop-blur-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          返回任务列表
        </button>
      )}
      {!embedded && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/scene-task-results/simulation">
              <ArrowLeft className="h-4 w-4 mr-1" />
              返回任务列表
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <span>学生端任务学习模拟</span>
          <Separator orientation="vertical" className="h-4" />
          <Badge variant="outline" className="text-xs">
            {mode === "separate" ? "方案 A：先学后测" : "方案 B：学测一体"}
          </Badge>
        </div>
      )}

      {/* 任务标题 */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className={formColors[task.assessmentForm]}>
              {formIcons[task.assessmentForm]}
              <span className="ml-1">{formLabels[task.assessmentForm]}</span>
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <GraduationCap className="h-3 w-3 mr-1" />
              {task.scenarioName}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {mode === "separate" ? (
                <>
                  <BookOpenCheck className="h-3 w-3 mr-1 text-blue-500" />
                  先学后测
                </>
              ) : (
                <>
                  <BookMarked className="h-3 w-3 mr-1 text-emerald-500" />
                  学测一体
                </>
              )}
            </Badge>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">{task.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{task.description}</p>
        </div>
      </div>

      {/* 主内容 */}
      {mode === "separate" ? (
        // 方案 A：先学后测
        <>
          {taskPhase === "learning" && (
            <LearningPhaseView task={task} onStartAssessment={handleStartAssessment} />
          )}
          {taskPhase === "assessment" && (
            <>
              {/* 环节步骤指示器 */}
              {totalSteps > 1 && (
                <div className="flex items-center gap-3 mb-4">
                  {activeForms.map((form, idx) => {
                    const isSubmitted = submittedForms.has(form)
                    const isCurrent = idx === currentStep
                    return (
                      <button
                        key={form}
                        onClick={() => setCurrentStep(idx)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all ${
                          isCurrent
                            ? "bg-amber-50 text-amber-600 border border-amber-200 ring-2 ring-amber-100"
                            : isSubmitted
                            ? "bg-green-50 text-green-600 border border-green-200"
                            : "bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {isSubmitted ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                        )}
                        {formLabels[form]}
                      </button>
                    )
                  })}
                </div>
              )}
              {currentForm && (
                <div key={currentForm + "-" + currentStep}>
                  {submittedForms.has(currentForm) ? (
                    <Card className="border-green-200 bg-green-50/30">
                      <CardContent className="pt-6 pb-6 text-center space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                          <CheckCircle2 className="h-8 w-8 text-green-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-green-700">{formLabels[currentForm]}测评 已完成</h3>
                          <p className="text-sm text-gray-500 mt-1">您可以切换到其他测评环节继续完成</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    renderAssessmentPanel(currentForm, (sub) => handleStepSubmit(currentForm, sub))
                  )}
                </div>
              )}
            </>
          )}
          {taskPhase === "submitted" && submission && (
            <SubmissionSuccess taskName={task.name} assessmentForm={formLabels[currentForm || task.assessmentForm]} />
          )}
          {/* 学习助手默认展开 */}
          <LearningFloat task={task} defaultExpanded={true} />
        </>
      ) : (
        // 方案 B：学测一体 - 左右分栏
        <>
          {taskPhase === "assessment" && (
            <IntegratedLayout
              task={task}
              activeForms={activeForms}
              assessmentPanels={activeForms.map((form) => (
                <div key={form} className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className={formColors[form]}>
                      {formIcons[form]}
                      <span className="ml-1">{formLabels[form]}</span>
                    </Badge>
                  </div>
                  {renderAssessmentPanel(form, (sub) => {
                    setSubmittedForms(prev => new Set([...prev, form]))
                    setSubmission(sub)
                    try { ;(studentSubmissions as any).push(sub) } catch {}
                    const nextSubmitted = new Set([...submittedForms, form])
                    if (nextSubmitted.size >= activeForms.length) {
                      setTaskPhase("submitted")
                    }
                  })}
                </div>
              ))}
            />
          )}
          {taskPhase === "submitted" && submission && (
            <SubmissionSuccess taskName={task.name} assessmentForm="综合测评" />
          )}
          {/* 学习助手 */}
          <LearningFloat task={task} defaultExpanded={false} />
        </>
      )}
    </div>
  )
}

// ============================================================================
// 详情弹窗组件
// ============================================================================
function DetailDialog({
  open,
  onOpenChange,
  type,
  item,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "knowledge" | "ability" | "resource" | null
  item: any
}) {
  if (!item || !type) return null

  if (type === "knowledge") {
    const kp = item
    const relatedLessons =
      kp.granularLessons?.map((gid: string) => granularLessons.find((g) => g.id === gid)).filter(Boolean) || []

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              知识点详情
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <div className="text-xs text-gray-500 mb-1">知识点名称</div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{kp.name}</p>
                {kp.code && <Badge variant="outline" className="text-[10px] h-5 font-mono">{kp.code}</Badge>}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">知识点描述</div>
              <p className="text-sm text-gray-700">{kp.description}</p>
            </div>
            {kp.category && (
              <div>
                <div className="text-xs text-gray-500 mb-1">所属分类</div>
                <Badge variant="secondary">{kp.category}</Badge>
              </div>
            )}
            <div>
              <div className="text-xs text-gray-500 mb-1">关联颗粒课 ({relatedLessons.length})</div>
              <div className="flex flex-wrap gap-1.5">
                {relatedLessons.length > 0 ? (
                  relatedLessons.map((gl: any) => (
                    <Badge key={gl.id} variant="outline" className="text-xs cursor-pointer hover:bg-blue-50">
                      <Sparkles className="h-3 w-3 mr-1 text-blue-400" />
                      {gl.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">暂无关联颗粒课</p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (type === "ability") {
    const ap = item
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              能力点详情
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <div className="text-xs text-gray-500 mb-1">能力点名称</div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-base font-semibold">{ap.name}</p>
                {ap.code && <Badge variant="outline" className="text-[10px] h-5 font-mono">{ap.code}</Badge>}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">能力点描述</div>
              <p className="text-sm text-gray-700">{ap.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ap.domain && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">所属领域</div>
                  <Badge variant="secondary">{ap.domain}</Badge>
                </div>
              )}
              {ap.category && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">分类</div>
                  <Badge variant="outline">{ap.category}</Badge>
                </div>
              )}
            </div>
            {ap.requiredLevel && (
              <div>
                <div className="text-xs text-gray-500 mb-1">掌握程度要求</div>
                <Badge
                  variant="outline"
                  className={requiredLevelColors[ap.requiredLevel] || "border-gray-200 text-gray-700 bg-gray-50"}
                >
                  {ap.requiredLevel}
                </Badge>
              </div>
            )}
            {ap.proficiencyDesc && (
              <div>
                <div className="text-xs text-gray-500 mb-1">熟练程度描述</div>
                <div className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 rounded-lg p-3">
                  {ap.proficiencyDesc}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const res = item
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-cyan-500" />
            资源详情
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              {resourceTypeIcons[res.type] || <FileText className="h-5 w-5 text-gray-400" />}
            </div>
            <div>
              <p className="text-sm font-semibold">{res.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-xs">{resourceTypeLabels[res.type] || res.type}</Badge>
                {res.size && <span className="text-xs text-gray-400">{res.size}</span>}
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">资源描述</div>
            <p className="text-sm text-gray-700">{res.description}</p>
          </div>
          {res.url && (
            <div>
              <div className="text-xs text-gray-500 mb-1">访问链接</div>
              <p className="text-sm text-blue-600 break-all">{res.url}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function SimulationTaskPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto py-12 text-center">加载中...</div>}>
      <SimulationTaskInner />
    </Suspense>
  )
}

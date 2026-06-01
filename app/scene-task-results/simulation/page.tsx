"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  BookOpenCheck,
  ClipboardList,
  Database,
  FileQuestion,
  Gavel,
  GraduationCap,
  ArrowRight,
  Clock,
  BarChart3,
  Layers,
  BookMarked,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// ============================================================================
// 模拟任务定义 - 四种测评类型
// ============================================================================

export interface SimulatedTask {
  id: string
  name: string
  description: string
  scenarioName: string
  scenarioId: string
  assessmentForm: "试卷" | "题库" | "现场问答" | "评审"
  assessmentFormKey: string
  difficulty: number
  estimatedHours: number
  knowledgePoints: string[]
  abilityPoints: string[]
  taskType: "assessment" | "training"
}

const simulatedTasks: SimulatedTask[] = [
  {
    id: "sim-paper",
    name: "项目初始化与架构搭建 — 期中测验",
    description: "使用 React + TypeScript 技术栈搭建项目基础架构，配置开发环境和工具链。本任务通过固定试卷形式进行考核，检验学生对前端工程化基础知识的掌握程度。",
    scenarioName: "企业级前端项目开发实战",
    scenarioId: "scenario-1",
    assessmentForm: "试卷",
    assessmentFormKey: "paper",
    difficulty: 3,
    estimatedHours: 2,
    knowledgePoints: ["React Hooks", "TypeScript 基础", "Git 版本控制"],
    abilityPoints: ["组件封装能力", "状态管理能力"],
    taskType: "assessment",
  },
  {
    id: "sim-question-bank",
    name: "API 设计规范学习 — 知识自测",
    description: "学习 RESTful API 设计原则和规范，通过题库抽题方式进行自测。题库可随时进入练习，帮助学生巩固后端接口设计的基础知识。",
    scenarioName: "RESTful API 设计与开发",
    scenarioId: "scenario-2",
    assessmentForm: "题库",
    assessmentFormKey: "question_bank",
    difficulty: 2,
    estimatedHours: 1,
    knowledgePoints: ["RESTful API", "数据库设计"],
    abilityPoints: ["接口设计能力"],
    taskType: "training",
  },
  {
    id: "sim-random-draw",
    name: "React 核心技术 — 现场问答",
    description: "教师将从题库中随机抽取题目进行现场提问，考察学生对 React 核心概念、生命周期、状态管理等理论知识的理解深度和临场应变能力。",
    scenarioName: "企业级前端项目开发实战",
    scenarioId: "scenario-1",
    assessmentForm: "现场问答",
    assessmentFormKey: "random_draw",
    difficulty: 4,
    estimatedHours: 1,
    knowledgePoints: ["React Hooks", "CSS Flexbox"],
    abilityPoints: ["组件封装能力", "问题排查能力"],
    taskType: "assessment",
  },
  {
    id: "sim-review",
    name: "用户认证模块开发 — 代码评审",
    description: "实现用户登录、注册、权限验证等认证相关功能，提交代码仓库和项目文档，由教师进行多维度评审。",
    scenarioName: "企业级前端项目开发实战",
    scenarioId: "scenario-1",
    assessmentForm: "评审",
    assessmentFormKey: "review",
    difficulty: 4,
    estimatedHours: 12,
    knowledgePoints: ["JWT 认证", "React Hooks"],
    abilityPoints: ["安全编码能力", "团队协作能力"],
    taskType: "assessment",
  },
]

const formConfig: Record<string, { label: string; color: string; icon: React.ReactNode; desc: string }> = {
  paper: {
    label: "试卷",
    color: "bg-green-50 text-green-600 border-green-200",
    icon: <ClipboardList className="h-4 w-4" />,
    desc: "固定试卷，定时考试",
  },
  question_bank: {
    label: "题库",
    color: "bg-orange-50 text-orange-600 border-orange-200",
    icon: <Database className="h-4 w-4" />,
    desc: "题库抽题，随时练习",
  },
  random_draw: {
    label: "现场问答",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    icon: <FileQuestion className="h-4 w-4" />,
    desc: "教师抽题，现场回答",
  },
  review: {
    label: "评审",
    color: "bg-purple-50 text-purple-600 border-purple-200",
    icon: <Gavel className="h-4 w-4" />,
    desc: "提交材料，教师评审",
  },
}

function DifficultyStars({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <BarChart3
          key={i}
          className={`h-3.5 w-3.5 ${i < level ? "text-amber-500" : "text-gray-200"}`}
        />
      ))}
    </div>
  )
}

// 模式选择弹窗
function ModeSelectDialog({
  task,
  open,
  onOpenChange,
}: {
  task: SimulatedTask | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!task) return null
  const config = formConfig[task.assessmentFormKey]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge variant="outline" className={config.color}>
              {config.icon}
              <span className="ml-1">{config.label}</span>
            </Badge>
            选择学习模式
          </DialogTitle>
          <DialogDescription>
            选择您想体验的学生端学习流程方案
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Link
            href={`/scene-task-results/simulation/${task.id}?mode=separate`}
            onClick={() => onOpenChange(false)}
          >
            <Card className="cursor-pointer hover:border-blue-300 hover:shadow-md transition-all border-l-4 border-l-blue-500">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                    <BookOpenCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">方案 A：先学后测</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      学生先阅读任务说明书并完成学习，学习资源以全局浮窗形式随时查阅。学习完成后进入测评阶段。
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">阅读任务说明书</Badge>
                      <Badge variant="outline" className="text-xs">浮窗查阅资源</Badge>
                      <Badge variant="outline" className="text-xs">完成后测评</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link
            href={`/scene-task-results/simulation/${task.id}?mode=integrated`}
            onClick={() => onOpenChange(false)}
          >
            <Card className="cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all border-l-4 border-l-emerald-500">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg shrink-0">
                    <Layers className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">方案 B：学测一体</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      直接进入测评阶段，任务说明书和学习资源以全局浮窗形式随时展开查阅。边做题边参考学习材料。
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">直接进入测评</Badge>
                      <Badge variant="outline" className="text-xs">浮窗随时查阅</Badge>
                      <Badge variant="outline" className="text-xs">学测同步进行</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function SimulationPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedTask, setSelectedTask] = useState<SimulatedTask | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredTasks =
    activeTab === "all"
      ? simulatedTasks
      : simulatedTasks.filter((t) => t.assessmentFormKey === activeTab)

  const handleEnterSimulation = (task: SimulatedTask) => {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">学生端任务学习模拟</h1>
        <p className="text-sm text-gray-500 mt-1">
          模拟学生端任务学习全流程，进入任务前选择「先学后测」或「学测一体」模式进行体验
        </p>
      </div>

      {/* 模式说明 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                <BookOpenCheck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">方案 A：先学后测</h3>
                <p className="text-sm text-gray-500 mt-1">
                  学生先阅读任务说明书完成学习，学习资源以全局浮窗形式随时查阅。确认学习完成后进入测评。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg shrink-0">
                <Layers className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">方案 B：学测一体</h3>
                <p className="text-sm text-gray-500 mt-1">
                  直接进入测评阶段，任务说明书、知识点、资源以全局浮窗形式随时展开。边做题边参考学习材料。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 任务列表 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">全部任务</TabsTrigger>
          <TabsTrigger value="paper">试卷</TabsTrigger>
          <TabsTrigger value="question_bank">题库</TabsTrigger>
          <TabsTrigger value="random_draw">现场问答</TabsTrigger>
          <TabsTrigger value="review">评审</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map((task) => {
              const config = formConfig[task.assessmentFormKey]
              return (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className={config.color}>
                        {config.icon}
                        <span className="ml-1">{config.label}</span>
                      </Badge>
                      <DifficultyStars level={task.difficulty} />
                    </div>
                    <CardTitle className="text-base mt-2">{task.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {task.scenarioName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-3">{task.description}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {task.knowledgePoints.map((kp) => (
                        <Badge key={kp} variant="secondary" className="text-xs font-normal">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {kp}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          预计 {task.estimatedHours} 小时
                        </span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3.5 w-3.5" />
                          {task.taskType === "assessment" ? "考核任务" : "训练任务"}
                        </span>
                      </div>
                      <Button size="sm" onClick={() => handleEnterSimulation(task)}>
                        进入模拟
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      <ModeSelectDialog
        task={selectedTask}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}

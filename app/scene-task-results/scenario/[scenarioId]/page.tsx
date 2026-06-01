"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Layers,
  PenLine,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { studentSubmissions, scenarios } from "@/lib/scene-mock-data"

interface TaskSummary {
  taskId: string
  taskName: string
  assessmentForm: string
  pendingCount: number
  gradedCount: number
  studentCount: number
}

export default function ScenarioTasksPage() {
  const params = useParams()
  const scenarioId = params.scenarioId as string

  const scenario = useMemo(
    () => scenarios.find((s) => s.id === scenarioId),
    [scenarioId]
  )

  const taskSummaries = useMemo<TaskSummary[]>(() => {
    const scenarioSubs = studentSubmissions.filter((s) => s.scenarioId === scenarioId)
    const map = new Map<string, TaskSummary>()

    for (const sub of scenarioSubs) {
      const existing = map.get(sub.taskId)
      if (existing) {
        existing.pendingCount += sub.status === "pending" ? 1 : 0
        existing.gradedCount += sub.status === "graded" ? 1 : 0
      } else {
        map.set(sub.taskId, {
          taskId: sub.taskId,
          taskName: sub.taskName,
          assessmentForm: sub.assessmentForm,
          pendingCount: sub.status === "pending" ? 1 : 0,
          gradedCount: sub.status === "graded" ? 1 : 0,
          studentCount: new Set(scenarioSubs.filter((s) => s.taskId === sub.taskId).map((s) => s.studentId)).size,
        })
      }
    }

    return Array.from(map.values())
  }, [scenarioId])

  if (!scenario) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <Layers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700">场景不存在</h3>
        <p className="text-sm text-gray-500 mt-2">未找到对应的场景数据</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/scene-task-results">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回场景列表
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb & Header */}
      <div className="space-y-4">
        <Button variant="ghost" size="sm" className="text-gray-500 -ml-2" asChild>
          <Link href="/scene-task-results">
            <ArrowLeft className="mr-1 h-4 w-4" />
            返回场景列表
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{scenario.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            选择任务查看学生提交并进行评分
          </p>
        </div>
      </div>

      {/* Scenario info */}
      <div className="flex flex-wrap gap-2">
        {scenario.positionName && (
          <Badge variant="secondary" className="text-xs font-normal">
            {scenario.positionName}
          </Badge>
        )}
        {scenario.batchName && (
          <Badge variant="outline" className="text-xs font-normal text-gray-500">
            {scenario.batchName}
          </Badge>
        )}
        <Badge variant="outline" className="text-xs font-normal text-gray-500">
          {scenario.code}
        </Badge>
      </div>

      {/* Task Cards */}
      {taskSummaries.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <ClipboardCheck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">暂无评分任务</h3>
            <p className="text-sm text-gray-500 mt-1">该场景下暂无有学生提交的任务</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/scene-task-results">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回场景列表
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {taskSummaries.map((task) => (
            <Link
              key={task.taskId}
              href={`/scene-task-results/scenario/${scenarioId}/task/${task.taskId}`}
              className="block group"
            >
              <Card className="transition-all duration-200 hover:shadow-md hover:border-primary/30 cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                          {task.taskName}
                        </h3>
                        <div className="flex items-center gap-3 mt-1.5">
                          <Badge variant="outline" className="text-xs font-normal">
                            {task.assessmentForm}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {task.studentCount} 位学生提交
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex gap-4">
                        {task.pendingCount > 0 && (
                          <div className="text-center">
                            <div className="flex items-center gap-1 text-xs text-amber-600 mb-0.5">
                              <PenLine className="h-3 w-3" />
                              待评分
                            </div>
                            <p className="text-lg font-semibold text-amber-700">{task.pendingCount}</p>
                          </div>
                        )}
                        {task.gradedCount > 0 && (
                          <div className="text-center">
                            <div className="flex items-center gap-1 text-xs text-green-600 mb-0.5">
                              <CheckCircle2 className="h-3 w-3" />
                              已评分
                            </div>
                            <p className="text-lg font-semibold text-green-700">{task.gradedCount}</p>
                          </div>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

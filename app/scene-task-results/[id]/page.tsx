"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from "@/components/providers/data-provider"

export default function SceneTaskResultDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { sceneGradingSubmissions } = useData()

  const submission = sceneGradingSubmissions.find((s) => s.id === id)

  if (!submission) {
    return (
      <div className="h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center text-gray-400">
        <FileText className="h-12 w-12 mb-3 opacity-50" />
        <p className="text-sm">未找到该提交记录</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href="/scene-task-results">
            <ArrowLeft className="mr-1 h-3 w-3" />返回列表
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 shrink-0">
        <div className="max-w-[1600px] mx-auto flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/scene-task-results">
              <ArrowLeft className="mr-1 h-3 w-3" />返回
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-800">评分详情</h1>
            <p className="text-sm text-gray-500">
              {submission.scenarioName} · {submission.taskName} · {submission.assessmentForm}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1600px] mx-auto space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">提交信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500">场景：</span>
                  <span>{submission.scenarioName}</span>
                </div>
                <div>
                  <span className="text-gray-500">任务：</span>
                  <span>{submission.taskName}</span>
                </div>
                <div>
                  <span className="text-gray-500">测评形式：</span>
                  <span>{submission.assessmentForm}</span>
                </div>
                <div>
                  <span className="text-gray-500">提交时间：</span>
                  <span>{submission.submittedAt}</span>
                </div>
                <div>
                  <span className="text-gray-500">状态：</span>
                  <span className={submission.status === "graded" ? "text-green-600" : "text-amber-600"}>
                    {submission.status === "graded" ? "已评分" : "待评分"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">满分：</span>
                  <span>{submission.maxScore}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">评分操作</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                此处为评分详情占位页面。实际评分功能需要进一步开发。
              </p>
              {submission.status === "pending" ? (
                <Button>提交评分</Button>
              ) : (
                <Button variant="outline" disabled>已评分</Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

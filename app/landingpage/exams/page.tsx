"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, ClipboardList, Clock, FileText, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const myExams = [
  { id: 'exam-1', name: "前端基础测试", status: "进行中", type: "随堂测", time: "2024-03-15 14:00", duration: 60, questionCount: 20, description: "考察 JavaScript、React 基础知识" },
  { id: 'exam-2', name: "TypeScript 能力测试", status: "未开始", type: "教学考试", time: "2024-03-20 10:00", duration: 90, questionCount: 30, description: "TypeScript 类型系统与高级特性测验" },
]

const allExams = [
  { id: 'exam-1', name: "前端基础测试", status: "进行中", type: "随堂测", time: "2024-03-15 14:00", duration: 60, questionCount: 20, description: "考察 JavaScript、React 基础知识" },
  { id: 'exam-2', name: "TypeScript 能力测试", status: "未开始", type: "教学考试", time: "2024-03-20 10:00", duration: 90, questionCount: 30, description: "TypeScript 类型系统与高级特性测验" },
  { id: 'exam-3', name: "React 进阶考核", status: "已结束", type: "期末考", time: "2024-03-10 09:00", duration: 120, questionCount: 40, description: "React Hooks 与性能优化专项考核" },
  { id: 'exam-4', name: "Node.js 后端测试", status: "进行中", type: "随堂测", time: "2024-02-28 14:00", duration: 60, questionCount: 25, description: "Node.js 基础与 Express 框架测试" },
  { id: 'exam-5', name: "Vue.js 进阶考核", status: "未开始", type: "期末考", time: "2024-04-05 10:00", duration: 120, questionCount: 35, description: "Vue3 组合式 API 与响应式原理" },
  { id: 'exam-6', name: "全栈开发综合测试", status: "已结束", type: "综合考", time: "2024-03-25 09:00", duration: 150, questionCount: 50, description: "前后端技术栈综合知识考核" },
]

export default function ExamListPage() {
  const [tab, setTab] = useState<'my' | 'all'>('my')
  const exams = tab === 'my' ? myExams : allExams

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/landingpage">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Button>
        </Link>
        <h1 className="text-xl font-bold">考试中心</h1>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as 'my' | 'all')} className="mb-6">
        <TabsList>
          <TabsTrigger value="my">我的考试</TabsTrigger>
          <TabsTrigger value="all">全部考试</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <Link key={exam.id} href={`/landingpage/exams/${exam.id}`} className="block">
            <Card className="transition-shadow hover:shadow-md cursor-pointer h-full">
              <CardContent className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <Badge
                    variant={exam.status === '进行中' ? 'default' : exam.status === '未开始' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {exam.status}
                  </Badge>
                </div>
                <h3 className="mb-1 text-base font-semibold">{exam.name}</h3>
                <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{exam.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {exam.duration} 分钟
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {exam.questionCount} 题
                  </span>
                  <span>{exam.time}</span>
                </div>
                {exam.status === '进行中' && (
                  <div className="mt-4">
                    <Button size="sm" className="w-full gap-1">
                      <PlayCircle className="h-4 w-4" />
                      开始考试
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {exams.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          <ClipboardList className="mx-auto mb-3 h-12 w-12 opacity-30" />
          <p>暂无考试</p>
        </div>
      )}
    </div>
  )
}

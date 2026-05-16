"use client"

import { useState } from "react"
import Link from "next/link"
import {
  GraduationCap,
  Search,
  Users,
  MapPin,
  Clock,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  Award,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const directions = ["全部", "人工智能", "移动开发", "Web开发", "物联网", "大数据", "嵌入式"]

const topics = [
  { id: 1, title: "基于深度学习的图像识别系统", mentor: "王教授", direction: "人工智能", spots: 3, total: 5, status: "开放中" },
  { id: 2, title: "校园二手交易小程序设计与实现", mentor: "李老师", direction: "移动开发", spots: 5, total: 8, status: "开放中" },
  { id: 3, title: "智慧图书馆管理系统", mentor: "张老师", direction: "Web开发", spots: 2, total: 6, status: "即将截止" },
  { id: 4, title: "基于物联网的温室环境监测", mentor: "陈教授", direction: "物联网", spots: 4, total: 5, status: "开放中" },
  { id: 5, title: "电商用户行为分析与推荐系统", mentor: "刘老师", direction: "大数据", spots: 6, total: 10, status: "开放中" },
  { id: 6, title: "智能家居控制系统", mentor: "赵教授", direction: "嵌入式", spots: 1, total: 4, status: "即将截止" },
]

const myProgress = [
  { stage: "选题申请", status: "completed", date: "2024-05-10" },
  { stage: "导师审核", status: "completed", date: "2024-05-12" },
  { stage: "开题报告", status: "inprogress", date: "进行中" },
  { stage: "中期检查", status: "pending", date: "待开始" },
  { stage: "论文答辩", status: "pending", date: "待开始" },
]

export default function GraduationPage() {
  const [activeDir, setActiveDir] = useState("全部")
  const [search, setSearch] = useState("")

  const filtered = topics.filter(
    (t) =>
      (activeDir === "全部" || t.direction === activeDir) &&
      t.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/landingpage">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Button>
        </Link>
        <h1 className="text-xl font-bold">毕业设计</h1>
      </div>

      {/* My Progress */}
      <section className="mb-8">
        <h2 className="mb-4 text-base font-semibold">我的毕设进度</h2>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              {myProgress.map((item, idx) => (
                <div key={item.stage} className="flex items-center gap-2">
                  <div
                    className={`flex h-8 items-center rounded-full px-3 text-xs font-medium ${
                      item.status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : item.status === "inprogress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.status === "completed" ? (
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                    ) : item.status === "inprogress" ? (
                      <Clock3 className="mr-1 h-3 w-3" />
                    ) : (
                      <AlertCircle className="mr-1 h-3 w-3" />
                    )}
                    {item.stage}
                  </div>
                  {idx < myProgress.length - 1 && (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span>当前题目：基于深度学习的图像识别系统</span>
              <span>导师：王教授</span>
              <Badge variant="outline" className="text-[10px]">人工智能方向</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Topic Search */}
      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
          <h2 className="text-base font-semibold">选题广场</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="搜索选题..." className="h-8 pl-9 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
          {directions.map((dir) => (
            <button
              key={dir}
              onClick={() => setActiveDir(dir)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeDir === dir
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {dir}
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((topic) => (
            <Card key={topic.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <GraduationCap className="h-4.5 w-4.5" />
                  </div>
                  <Badge
                    variant={topic.status === "即将截止" ? "destructive" : "secondary"}
                    className="text-[10px]"
                  >
                    {topic.status}
                  </Badge>
                </div>
                <h4 className="mb-2 text-sm font-semibold leading-snug">{topic.title}</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><Users className="h-3 w-3" />导师：{topic.mentor}</div>
                  <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />方向：{topic.direction}</div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t pt-2">
                  <span className={`text-xs font-medium ${topic.spots <= 2 ? "text-red-600" : "text-muted-foreground"}`}>
                    余 {topic.spots}/{topic.total} 名
                  </span>
                  <Button size="sm" className="h-7 text-xs">申请选题</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="rounded-lg border py-12 text-center text-sm text-muted-foreground">暂无匹配选题</div>
        )}
      </section>
    </div>
  )
}

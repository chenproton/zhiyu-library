"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  FileText,
  Search,
  Clock,
  Users,
  ClipboardList,
  Star,
  ChevronRight,
  Filter,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const categories = ["全部", "计算机", "经管", "电子信息", "机械制造", "建筑工程", "医药卫生"]

const questionBanks = [
  { id: 1, title: "Python程序设计基础题库", category: "计算机", questions: 1280, hot: true, author: "张老师" },
  { id: 2, title: "会计基础实务题库", category: "经管", questions: 856, hot: false, author: "李老师" },
  { id: 3, title: "电子电路分析题库", category: "电子信息", questions: 642, hot: false, author: "工学院" },
  { id: 4, title: "机械制图与CAD题库", category: "机械制造", questions: 528, hot: false, author: "王老师" },
  { id: 5, title: "建筑工程测量题库", category: "建筑工程", questions: 430, hot: false, author: "赵老师" },
  { id: 6, title: "护理学基础题库", category: "医药卫生", questions: 760, hot: true, author: "医学院" },
  { id: 7, title: "数据结构与算法题库", category: "计算机", questions: 920, hot: true, author: "陈老师" },
  { id: 8, title: "市场营销学题库", category: "经管", questions: 510, hot: false, author: "刘老师" },
]

const exams = [
  { id: 1, title: "2024年春季《数据结构》期末统考", type: "期末考", duration: 120, questions: 40, participants: 2340 },
  { id: 2, title: "全国计算机等级考试二级Python真题", type: "真题", duration: 120, questions: 40, participants: 2840 },
  { id: 3, title: "2024年春季《数据结构》模拟测试卷（一）", type: "模拟卷", duration: 90, questions: 35, participants: 1256 },
  { id: 4, title: "2024年春季《数据结构》模拟测试卷（二）", type: "模拟卷", duration: 90, questions: 35, participants: 890 },
  { id: 5, title: "2023年《操作系统》期末统考真题", type: "真题", duration: 120, questions: 45, participants: 2100 },
]

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState("全部")
  const [search, setSearch] = useState("")

  const filteredBanks = questionBanks.filter(
    (b) =>
      (activeCategory === "全部" || b.category === activeCategory) &&
      b.title.toLowerCase().includes(search.toLowerCase())
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
        <h1 className="text-xl font-bold">测评资源</h1>
      </div>

      {/* Search + Filter */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索题库、试卷..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Question Banks */}
      <section className="mb-8">
        <h2 className="mb-4 text-base font-semibold">题库中心</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filteredBanks.map((bank) => (
            <Card key={bank.id} className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <BookOpen className="h-4.5 w-4.5" />
                  </div>
                  {bank.hot && (
                    <Badge variant="secondary" className="text-[10px]">
                      <Star className="mr-1 h-3 w-3" />
                      热门
                    </Badge>
                  )}
                </div>
                <h4 className="mb-1 text-sm font-semibold">{bank.title}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-[10px] font-normal">{bank.category}</Badge>
                  <span>{bank.questions} 题</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">出题人：{bank.author}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredBanks.length === 0 && (
          <div className="rounded-lg border py-12 text-center text-sm text-muted-foreground">暂无匹配资源</div>
        )}
      </section>

      {/* Exams */}
      <section>
        <h2 className="mb-4 text-base font-semibold">试卷中心</h2>
        <div className="space-y-2">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="flex flex-col gap-2 rounded-lg border bg-white p-4 transition-colors hover:border-primary/50 sm:flex-row sm:items-center"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium">{exam.title}</h4>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-[10px] font-normal">{exam.type}</Badge>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{exam.duration} 分钟</span>
                  <span className="flex items-center gap-1"><ClipboardList className="h-3 w-3" />{exam.questions} 题</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{exam.participants} 人已考</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="shrink-0 text-xs h-8">查看详情</Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

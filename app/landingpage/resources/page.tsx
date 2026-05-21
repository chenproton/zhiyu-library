"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  BookOpen,
  FileText,
  Search,
  Clock,
  Users,
  ClipboardList,
  Star,
  ArrowLeft,
  BarChart3,
  Database,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useData } from "@/components/providers/data-provider"

const categories = ["全部", "计算机", "经管", "电子信息", "机械制造", "建筑工程", "医药卫生"]

const questionBanks = [
  { id: "bank-1", title: "Python程序设计基础题库", category: "计算机", questions: 1280, hot: true, author: "张老师" },
  { id: "bank-2", title: "会计基础实务题库", category: "经管", questions: 856, hot: false, author: "李老师" },
  { id: "bank-3", title: "电子电路分析题库", category: "电子信息", questions: 642, hot: false, author: "工学院" },
  { id: "bank-4", title: "机械制图与CAD题库", category: "机械制造", questions: 528, hot: false, author: "王老师" },
  { id: "bank-5", title: "建筑工程测量题库", category: "建筑工程", questions: 430, hot: false, author: "赵老师" },
  { id: "bank-6", title: "护理学基础题库", category: "医药卫生", questions: 760, hot: true, author: "医学院" },
  { id: "bank-7", title: "数据结构与算法题库", category: "计算机", questions: 920, hot: true, author: "陈老师" },
  { id: "bank-8", title: "市场营销学题库", category: "经管", questions: 510, hot: false, author: "刘老师" },
]

const exams = [
  { id: "exam-1", title: "2024年春季《数据结构》期末统考", type: "期末考", duration: 120, questions: 40, participants: 2340 },
  { id: "exam-2", title: "全国计算机等级考试二级Python真题", type: "真题", duration: 120, questions: 40, participants: 2840 },
  { id: "exam-3", title: "2024年春季《数据结构》模拟测试卷（一）", type: "模拟卷", duration: 90, questions: 35, participants: 1256 },
  { id: "exam-4", title: "2024年春季《数据结构》模拟测试卷（二）", type: "模拟卷", duration: 90, questions: 35, participants: 890 },
  { id: "exam-5", title: "2023年《操作系统》期末统考真题", type: "真题", duration: 120, questions: 45, participants: 2100 },
]

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState("全部")
  const [search, setSearch] = useState("")
  const { questionBanks: realBanks, exams: realExams } = useData()

  const filteredBanks = useMemo(
    () =>
      questionBanks.filter(
        (b) =>
          (activeCategory === "全部" || b.category === activeCategory) &&
          b.title.toLowerCase().includes(search.toLowerCase())
      ),
    [activeCategory, search]
  )

  const stats = [
    { label: "题库总数", value: realBanks.length, icon: Database, color: "#2563eb" },
    { label: "试卷总数", value: realExams.length, icon: FileText, color: "#f59e0b" },
    { label: "题目总数", value: realBanks.reduce((sum, b) => sum + b.questionCount, 0), icon: BarChart3, color: "#10b981" },
  ]

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Hero */}
      <div
        className="relative overflow-hidden px-6 py-10 text-white"
        style={{ background: "linear-gradient(135deg, #1e3a8a, #2563eb, #3b82f6)" }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center gap-3">
            <Link href="/landingpage">
              <Button variant="ghost" size="sm" className="gap-1 text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4" />
                返回首页
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold">测评资源</h1>
          <p className="mt-1 text-sm text-white/80">丰富的题库与试卷资源，覆盖多学科多场景</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-xl bg-white p-4"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ background: s.color + "15", color: s.color }}
              >
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-bold" style={{ color: s.color }}>
                  {s.value}
                </div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜索题库、试卷..."
              className="h-9 rounded-full border-0 bg-white pl-9 text-sm shadow-sm"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors"
                style={
                  activeCategory === cat
                    ? { background: "#2563eb", color: "#fff" }
                    : { background: "#fff", color: "#666", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Question Banks */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-5 w-1 rounded-full" style={{ background: "#2563eb" }} />
            <h2 className="text-base font-semibold text-gray-900">题库中心</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {filteredBanks.map((bank) => (
              <Link key={bank.id} href={`/landingpage/resources/banks/${bank.id}`} className="block">
                <div
                  className="cursor-pointer rounded-xl bg-white p-4 transition-all duration-300"
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.transform = "translateY(-4px)"
                    el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.transform = "translateY(0)"
                    el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"
                  }}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ background: "#eff6ff", color: "#2563eb" }}
                    >
                      <BookOpen className="h-5 w-5" />
                    </div>
                    {bank.hot && (
                      <span
                        className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{ background: "#fffbeb", color: "#f59e0b" }}
                      >
                        <Star className="h-3 w-3" />
                        热门
                      </span>
                    )}
                  </div>
                  <h4 className="mb-1 text-sm font-semibold text-gray-900">{bank.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Badge
                      variant="outline"
                      className="rounded-full text-[10px] font-normal"
                      style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
                    >
                      {bank.category}
                    </Badge>
                    <span>{bank.questions} 题</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">出题人：{bank.author}</div>
                </div>
              </Link>
            ))}
          </div>
          {filteredBanks.length === 0 && (
            <div
              className="rounded-xl bg-white py-12 text-center text-sm text-gray-400"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
              暂无匹配资源
            </div>
          )}
        </section>

        {/* Exams */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <div className="h-5 w-1 rounded-full" style={{ background: "#2563eb" }} />
            <h2 className="text-base font-semibold text-gray-900">试卷中心</h2>
          </div>
          <div className="space-y-2">
            {exams.map((exam) => (
              <Link
                key={exam.id}
                href={`/landingpage/resources/exams/${exam.id}`}
                className="flex flex-col gap-2 rounded-xl bg-white p-4 transition-all duration-300 sm:flex-row sm:items-center"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.transform = "translateY(-2px)"
                  el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.transform = "translateY(0)"
                  el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"
                }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: "#fff7ed", color: "#f97316" }}
                >
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{exam.title}</h4>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <Badge
                      variant="outline"
                      className="rounded-full text-[10px] font-normal"
                      style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
                    >
                      {exam.type}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {exam.duration} 分钟
                    </span>
                    <span className="flex items-center gap-1">
                      <ClipboardList className="h-3 w-3" />
                      {exam.questions} 题
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {exam.participants} 人已考
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 rounded-lg text-xs h-8"
                  style={{ borderColor: "#2563eb", color: "#2563eb" }}
                >
                  查看详情
                </Button>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

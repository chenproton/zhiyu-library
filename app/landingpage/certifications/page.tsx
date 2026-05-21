"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Award,
  Search,
  Users,
  Briefcase,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Star,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useData } from "@/components/providers/data-provider"

const myCerts = [
  { id: 1, name: "数据库工程师", level: "初级", status: "已通过", date: "2024-05-20", score: 88 },
  { id: 2, name: "Python开发工程师", level: "初级", status: "已通过", date: "2024-04-15", score: 92 },
  { id: 3, name: "Web前端工程师", level: "中级", status: "已通过", date: "2024-03-10", score: 85 },
]

const allCerts = [
  { id: 1, name: "Java开发工程师", level: "中级", org: "软件学院", enrolled: 156, passing: "76%", tags: ["热门", "就业导向"], desc: "涵盖Java核心语法、Spring框架、微服务架构等企业级开发技能。" },
  { id: 2, name: "数据库工程师", level: "初级", org: "计算机学院", enrolled: 128, passing: "82%", tags: ["基础"], desc: "SQL语言、数据库设计、MySQL/PostgreSQL运维基础。" },
  { id: 3, name: "云计算架构师", level: "高级", org: "网络中心", enrolled: 89, passing: "68%", tags: ["新兴"], desc: "Docker容器化、Kubernetes编排、云平台部署与运维。" },
  { id: 4, name: "前端开发工程师", level: "中级", org: "软件学院", enrolled: 203, passing: "79%", tags: ["热门"], desc: "React/Vue框架、TypeScript、前端工程化与性能优化。" },
  { id: 5, name: "人工智能工程师", level: "高级", org: "人工智能学院", enrolled: 67, passing: "65%", tags: ["新兴", "高薪"], desc: "深度学习框架、计算机视觉、NLP自然语言处理基础。" },
  { id: 6, name: "大数据分析师", level: "中级", org: "数据学院", enrolled: 112, passing: "74%", tags: ["热门"], desc: "Hadoop生态、Spark计算、数据可视化与商业分析。" },
]

export default function CertificationsPage() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"my" | "interested">("my")
  const { positionsList } = useData()

  const filtered = useMemo(
    () => allCerts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  )

  const stats = [
    { label: "认证岗位", value: positionsList.length, icon: Award, color: "#2563eb" },
    { label: "已通过", value: myCerts.length, icon: CheckCircle2, color: "#10b981" },
    { label: "热门认证", value: allCerts.filter((c) => c.tags.includes("热门")).length, icon: Star, color: "#f59e0b" },
    { label: "平均通过率", value: "75%", icon: TrendingUp, color: "#8b5cf6" },
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
          <h1 className="text-2xl font-bold">能力认定</h1>
          <p className="mt-1 text-sm text-white/80">岗位技能认证，量化职业能力，助力求职发展</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
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

        {/* Tabs + Search */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {(["my", "interested"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
                style={
                  activeTab === t
                    ? { background: "#2563eb", color: "#fff" }
                    : { background: "#fff", color: "#666", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }
                }
              >
                {t === "my" ? "我的认证岗位" : "我的感兴趣岗位"}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜索认证..."
              className="h-9 rounded-full border-0 bg-white pl-9 text-sm shadow-sm"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* My Certs */}
        {activeTab === "my" && (
          <section className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-5 w-1 rounded-full" style={{ background: "#2563eb" }} />
              <h2 className="text-base font-semibold text-gray-900">我的认证</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {myCerts.map((cert) => (
                <Link key={cert.id} href={`/landingpage/certifications/${cert.id}`} className="block">
                  <div
                    className="cursor-pointer rounded-xl border border-emerald-100 bg-white p-4 transition-all duration-300"
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
                    <div className="flex items-start justify-between">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ background: "#ecfdf5", color: "#10b981" }}
                      >
                        <Award className="h-5 w-5" />
                      </div>
                      <span
                        className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{ background: "#ecfdf5", color: "#10b981" }}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {cert.status}
                      </span>
                    </div>
                    <h4 className="mt-3 text-sm font-semibold text-gray-900">{cert.name}</h4>
                    <div className="mt-1 text-xs text-gray-500">
                      {cert.level} · 获得日期 {cert.date}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Progress value={cert.score} className="h-1.5 flex-1" />
                      <span className="text-xs font-medium text-gray-700">{cert.score}分</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {activeTab === "interested" && (
          <div
            className="mb-8 rounded-xl bg-white py-12 text-center text-sm text-gray-400"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            暂无感兴趣岗位，请前往全部认证项目浏览
          </div>
        )}

        {/* All Certs */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <div className="h-5 w-1 rounded-full" style={{ background: "#2563eb" }} />
            <h2 className="text-base font-semibold text-gray-900">全部认证项目</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cert) => (
              <Link key={cert.id} href={`/landingpage/certifications/${cert.id}`} className="block">
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
                  <div className="mb-2 flex items-start justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg"
                      style={{ background: "#fffbeb", color: "#f59e0b" }}
                    >
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="flex flex-wrap justify-end gap-1">
                      {cert.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="rounded-full text-[10px] font-normal"
                          style={{ background: "#f5f7fa", color: "#666" }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <h4 className="mb-1 text-sm font-semibold text-gray-900">{cert.name}</h4>
                  <p className="mb-2 text-xs text-gray-500 line-clamp-2">{cert.desc}</p>
                  <div className="mb-2 flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {cert.org}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {cert.enrolled}人
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                    <span className="text-xs font-medium" style={{ color: "#10b981" }}>
                      通过率 {cert.passing}
                    </span>
                    <Button
                      size="sm"
                      className="h-7 rounded-lg text-xs"
                      style={{ background: "#2563eb" }}
                    >
                      立即报名
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {filtered.length === 0 && (
            <div
              className="rounded-xl bg-white py-12 text-center text-sm text-gray-400"
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
              暂无匹配认证
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

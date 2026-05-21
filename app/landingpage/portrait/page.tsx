"use client"

import Link from "next/link"
import {
  UserCircle,
  Target,
  BarChart3,
  FileText,
  ArrowLeft,
  Award,
  BookOpen,
  Briefcase,
  TrendingUp,
  Layers,
  Star,
  CheckCircle2,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/components/providers/data-provider"

const dimensions = [
  { name: "专业技能", score: 82, fullMark: 100, icon: BookOpen, color: "#2563eb" },
  { name: "通用能力", score: 76, fullMark: 100, icon: Briefcase, color: "#10b981" },
  { name: "创新能力", score: 68, fullMark: 100, icon: Star, color: "#f59e0b" },
  { name: "实践能力", score: 85, fullMark: 100, icon: Layers, color: "#ef4444" },
  { name: "团队协作", score: 90, fullMark: 100, icon: Users, color: "#8b5cf6" },
]

const archives = [
  { label: "课程成绩", value: "32门", desc: "平均绩点 3.6", icon: BookOpen, color: "#2563eb" },
  { label: "考试成绩", value: "48场", desc: "平均分 82分", icon: BarChart3, color: "#10b981" },
  { label: "获得认证", value: "3个", desc: "初级2个 中级1个", icon: Award, color: "#f59e0b" },
  { label: "项目作品", value: "5个", desc: "毕设1个 课程设计4个", icon: FileText, color: "#ef4444" },
]

const trends = [
  { semester: "2023秋", score: 72 },
  { semester: "2024春", score: 78 },
  { semester: "2024秋", score: 82 },
  { semester: "2025春", score: 85 },
]

export default function PortraitPage() {
  const { studentAbilityPortraits } = useData()
  const topPortraits = studentAbilityPortraits.slice(0, 6)

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
          <h1 className="text-2xl font-bold">学生画像</h1>
          <p className="mt-1 text-sm text-white/80">全方位记录你的成长轨迹，助力职业发展规划</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* 优秀学生画像列表 */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-5 w-1 rounded-full" style={{ background: "#2563eb" }} />
            <h2 className="text-base font-semibold text-gray-900">优秀学生画像</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topPortraits.map((p) => (
              <Link key={p.id} href={`/landingpage/portrait/${p.id}`} className="block">
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
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ background: "#f3e8ff", color: "#8b5cf6" }}
                    >
                      <UserCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{p.studentName}</h4>
                      <div className="text-xs text-gray-500">
                        {p.className} · {p.majorName}
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ color: "#8b5cf6" }}>
                        {p.overallGrade}
                      </div>
                      <div className="text-[10px] text-gray-400">综合评级</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{p.completedCourses}</div>
                      <div className="text-[10px] text-gray-400">课程</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{p.totalCredits}</div>
                      <div className="text-[10px] text-gray-400">学分</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    班级排名 #{p.classRank} / {p.classTotal} · 专业排名 #{p.majorRank} / {p.majorTotal}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Intro */}
        <section className="mb-8">
          <div
            className="overflow-hidden rounded-2xl bg-white"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            <div className="grid lg:grid-cols-2">
              <div className="flex flex-col justify-center p-6 lg:p-10">
                <Badge
                  variant="secondary"
                  className="mb-3 w-fit rounded-full text-xs"
                  style={{ background: "#eff6ff", color: "#2563eb" }}
                >
                  能力画像
                </Badge>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  全方位记录你的成长轨迹
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  基于课程成绩、考试成绩、认证结果、项目作品等多维数据，生成个人能力画像，助力职业发展规划。
                </p>
                <div className="mt-5 space-y-2">
                  {[
                    { icon: Target, text: "多维度能力评估：专业技能、通用能力、创新能力" },
                    { icon: BarChart3, text: "可视化成长趋势：学期对比、能力雷达图" },
                    { icon: FileText, text: "一键生成档案：简历素材、能力证明" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-lg"
                        style={{ background: "#f3e8ff", color: "#8b5cf6" }}
                      >
                        <item.icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs text-gray-700 sm:text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center bg-[#f8fafc] p-6 lg:p-10">
                <div className="relative flex h-56 w-56 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-200" />
                  <div className="absolute inset-4 rounded-full border-2 border-dashed border-gray-200" />
                  <div className="absolute inset-8 rounded-full border-2 border-dashed border-gray-200" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="h-full w-full rounded-full"
                      style={{
                        background:
                          "conic-gradient(from 0deg, rgba(139,92,246,0.25) 0deg 60deg, rgba(59,130,246,0.25) 60deg 140deg, rgba(16,185,129,0.25) 140deg 220deg, rgba(245,158,11,0.25) 220deg 300deg, rgba(236,72,153,0.25) 300deg 360deg)",
                      }}
                    />
                  </div>
                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
                    <UserCircle className="h-8 w-8" style={{ color: "#2563eb" }} />
                  </div>
                  <span className="absolute -top-1 text-[10px] font-medium text-gray-600">专业技能</span>
                  <span className="absolute -right-5 top-[30%] text-[10px] font-medium text-gray-600">通用能力</span>
                  <span className="absolute -right-3 bottom-[20%] text-[10px] font-medium text-gray-600">创新能力</span>
                  <span className="absolute -left-3 bottom-[20%] text-[10px] font-medium text-gray-600">实践能力</span>
                  <span className="absolute -left-5 top-[30%] text-[10px] font-medium text-gray-600">团队协作</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dimensions */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-5 w-1 rounded-full" style={{ background: "#2563eb" }} />
            <h2 className="text-base font-semibold text-gray-900">能力维度分析</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dimensions.map((dim) => (
              <div
                key={dim.name}
                className="rounded-xl bg-white p-4"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                    style={{ background: dim.color }}
                  >
                    <dim.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{dim.name}</span>
                      <span className="text-sm font-bold" style={{ color: dim.color }}>
                        {dim.score}
                      </span>
                    </div>
                    <Progress value={dim.score} className="mt-1.5 h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Archives */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-5 w-1 rounded-full" style={{ background: "#2563eb" }} />
            <h2 className="text-base font-semibold text-gray-900">能力档案</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {archives.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-xl bg-white p-4"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: item.color + "15", color: item.color }}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{item.value}</div>
                  <div className="text-xs text-gray-500">{item.label}</div>
                  <div className="text-[10px] text-gray-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Growth Trend */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <div className="h-5 w-1 rounded-full" style={{ background: "#2563eb" }} />
            <h2 className="text-base font-semibold text-gray-900">成长趋势</h2>
          </div>
          <div
            className="rounded-xl bg-white p-5"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-end gap-4">
              {trends.map((t) => (
                <div key={t.semester} className="flex flex-1 flex-col items-center gap-2">
                  <div className="text-xs font-medium text-gray-700">{t.score}分</div>
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{ height: `${t.score * 1.5}px`, background: "#2563eb", opacity: 0.8 }}
                  />
                  <div className="text-[10px] text-gray-400">{t.semester}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

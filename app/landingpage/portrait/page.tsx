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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const dimensions = [
  { name: "专业技能", score: 82, fullMark: 100, icon: BookOpen, color: "bg-blue-500" },
  { name: "通用能力", score: 76, fullMark: 100, icon: Briefcase, color: "bg-emerald-500" },
  { name: "创新能力", score: 68, fullMark: 100, icon: Star, color: "bg-amber-500" },
  { name: "实践能力", score: 85, fullMark: 100, icon: Layers, color: "bg-rose-500" },
  { name: "团队协作", score: 90, fullMark: 100, icon: Users, color: "bg-purple-500" },
]

const archives = [
  { label: "课程成绩", value: "32门", desc: "平均绩点 3.6", icon: BookOpen },
  { label: "考试成绩", value: "48场", desc: "平均分 82分", icon: BarChart3 },
  { label: "获得认证", value: "3个", desc: "初级2个 中级1个", icon: Award },
  { label: "项目作品", value: "5个", desc: "毕设1个 课程设计4个", icon: FileText },
]

const trends = [
  { semester: "2023秋", score: 72 },
  { semester: "2024春", score: 78 },
  { semester: "2024秋", score: 82 },
  { semester: "2025春", score: 85 },
]

function Users(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export default function PortraitPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/landingpage">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Button>
        </Link>
        <h1 className="text-xl font-bold">学生画像</h1>
      </div>

      {/* Intro */}
      <section className="mb-8">
        <div className="overflow-hidden rounded-2xl border bg-white">
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col justify-center p-6 lg:p-10">
              <Badge variant="secondary" className="mb-3 w-fit">能力画像</Badge>
              <h2 className="text-xl font-bold sm:text-2xl">全方位记录你的成长轨迹</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                基于课程成绩、考试成绩、认证结果、项目作品等多维数据，生成个人能力画像，助力职业发展规划。
              </p>
              <div className="mt-5 space-y-2">
                {[
                  { icon: Target, text: "多维度能力评估：专业技能、通用能力、创新能力" },
                  { icon: BarChart3, text: "可视化成长趋势：学期对比、能力雷达图" },
                  { icon: FileText, text: "一键生成档案：简历素材、能力证明" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                      <item.icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center bg-muted/30 p-6 lg:p-10">
              <div className="relative flex h-56 w-56 items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-muted" />
                <div className="absolute inset-4 rounded-full border-2 border-dashed border-muted" />
                <div className="absolute inset-8 rounded-full border-2 border-dashed border-muted" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-full rounded-full" style={{ background: "conic-gradient(from 0deg, rgba(139,92,246,0.25) 0deg 60deg, rgba(59,130,246,0.25) 60deg 140deg, rgba(16,185,129,0.25) 140deg 220deg, rgba(245,158,11,0.25) 220deg 300deg, rgba(236,72,153,0.25) 300deg 360deg)" }} />
                </div>
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
                  <UserCircle className="h-8 w-8 text-primary" />
                </div>
                <span className="absolute -top-1 text-[10px] font-medium">专业技能</span>
                <span className="absolute -right-5 top-[30%] text-[10px] font-medium">通用能力</span>
                <span className="absolute -right-3 bottom-[20%] text-[10px] font-medium">创新能力</span>
                <span className="absolute -left-3 bottom-[20%] text-[10px] font-medium">实践能力</span>
                <span className="absolute -left-5 top-[30%] text-[10px] font-medium">团队协作</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dimensions */}
      <section className="mb-8">
        <h2 className="mb-4 text-base font-semibold">能力维度分析</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dimensions.map((dim) => (
            <Card key={dim.name}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${dim.color} text-white`}>
                    <dim.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{dim.name}</span>
                      <span className="text-sm font-bold">{dim.score}</span>
                    </div>
                    <Progress value={dim.score} className="mt-1.5 h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Archives */}
      <section className="mb-8">
        <h2 className="mb-4 text-base font-semibold">能力档案</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {archives.map((item) => (
            <Card key={item.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-lg font-bold">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                  <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Growth Trend */}
      <section>
        <h2 className="mb-4 text-base font-semibold">成长趋势</h2>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-end gap-4">
              {trends.map((t, idx) => (
                <div key={t.semester} className="flex flex-1 flex-col items-center gap-2">
                  <div className="text-xs font-medium">{t.score}分</div>
                  <div
                    className="w-full rounded-t-md bg-primary/80 transition-all"
                    style={{ height: `${t.score * 1.5}px` }}
                  />
                  <div className="text-[10px] text-muted-foreground">{t.semester}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Award,
  Search,
  Users,
  Briefcase,
  ChevronRight,
  ArrowLeft,
  Clock,
  CheckCircle2,
  BookOpen,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

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

  const filtered = allCerts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/landingpage">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Button>
        </Link>
        <h1 className="text-xl font-bold">能力认证</h1>
      </div>

      {/* My Certs */}
      <section className="mb-8">
        <h2 className="mb-4 text-base font-semibold">我的认证</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {myCerts.map((cert) => (
            <Card key={cert.id} className="border-emerald-200 bg-emerald-50/30">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <Award className="h-4.5 w-4.5" />
                  </div>
                  <Badge variant="default" className="bg-emerald-500 text-[10px]">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    {cert.status}
                  </Badge>
                </div>
                <h4 className="mt-2 text-sm font-semibold">{cert.name}</h4>
                <div className="mt-1 text-xs text-muted-foreground">
                  {cert.level} · 获得日期 {cert.date}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={cert.score} className="h-1.5 flex-1" />
                  <span className="text-xs font-medium">{cert.score}分</span>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="flex flex-col items-center justify-center border-dashed p-4">
            <Award className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">还有更多认证等你挑战</p>
            <Button variant="outline" size="sm" className="mt-2 text-xs">去报名</Button>
          </Card>
        </div>
      </section>

      {/* All Certs */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">全部认证项目</h2>
          <div className="relative w-56">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="搜索认证..." className="h-8 pl-9 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cert) => (
            <Card key={cert.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <Award className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {cert.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <h4 className="mb-1 text-sm font-semibold">{cert.name}</h4>
                <p className="mb-2 text-xs text-muted-foreground line-clamp-2">{cert.desc}</p>
                <div className="mb-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{cert.org}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{cert.enrolled}人</span>
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="text-xs text-emerald-600">通过率 {cert.passing}</span>
                  <Button size="sm" className="h-7 text-xs">立即报名</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="rounded-lg border py-12 text-center text-sm text-muted-foreground">暂无匹配认证</div>
        )}
      </section>
    </div>
  )
}

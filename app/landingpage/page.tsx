"use client"

import Link from "next/link"
import {
  BookOpen,
  FileText,
  Award,
  GraduationCap,
  UserCircle,
  Search,
  Layers,
  Database,
  ClipboardList,
  ChevronRight,
  Clock,
  Users,
  Star,
  MapPin,
  Briefcase,
  BarChart3,
  Target,
  ArrowRight,
  PlayCircle,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Bell,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"

const platformStats = [
  { label: "题库数量", value: "8,500+", icon: Database },
  { label: "试卷数量", value: "1,200+", icon: ClipboardList },
  { label: "认证项目", value: "45", icon: Award },
  { label: "毕设选题", value: "320", icon: Layers },
]

const serviceEntries = [
  {
    title: "测评资源",
    desc: "海量题库与试卷，覆盖多专业方向",
    icon: BookOpen,
    color: "from-blue-500 to-blue-600",
    href: "/landingpage/resources",
  },
  {
    title: "能力认证",
    desc: "岗位能力测评与职业资格证书",
    icon: Award,
    color: "from-amber-500 to-amber-600",
    href: "/landingpage/certifications",
  },
  {
    title: "毕业设计",
    desc: "选题广场与作品全流程管理",
    icon: GraduationCap,
    color: "from-emerald-500 to-emerald-600",
    href: "/landingpage/graduation",
  },
  {
    title: "学生画像",
    desc: "能力档案与多维画像分析",
    icon: UserCircle,
    color: "from-purple-500 to-purple-600",
    href: "/landingpage/portrait",
  },
]

const workspacePreview = {
  name: "张同学",
  todos: [
    { id: 1, title: "《Python程序设计》期末统考", time: "今天 14:00", type: "exam", urgent: true },
    { id: 2, title: "毕业设计选题截止", time: "3天后", type: "graduation", urgent: false },
    { id: 3, title: '岗位认证"Java开发工程师"作品待提交', time: "5天后", type: "cert", urgent: false },
  ],
  stats: [
    { label: "进行中的考试", value: 2, icon: PlayCircle },
    { label: "已获得认证", value: 3, icon: Award },
    { label: "画像完成度", value: "78%", icon: UserCircle },
  ],
}

const questionBanks = [
  { id: 1, title: "Python程序设计基础题库", category: "计算机", questions: 1280, hot: true },
  { id: 2, title: "会计基础实务题库", category: "经管", questions: 856, hot: false },
  { id: 3, title: "电子电路分析题库", category: "电子信息", questions: 642, hot: false },
  { id: 4, title: "机械制图与CAD题库", category: "机械制造", questions: 528, hot: false },
]

const exams = [
  { id: 1, title: "2024年春季《数据结构》期末统考", type: "期末考", duration: 120, questions: 40, participants: 2340 },
  { id: 2, title: "全国计算机等级考试二级Python真题", type: "真题", duration: 120, questions: 40, participants: 2840 },
  { id: 3, title: "2024年春季《数据结构》模拟测试卷", type: "模拟卷", duration: 90, questions: 35, participants: 1256 },
]

const certifications = [
  { id: 1, name: "Java开发工程师", level: "中级", org: "软件学院", enrolled: 156, passing: "76%", tags: ["热门", "就业导向"] },
  { id: 2, name: "数据库工程师", level: "初级", org: "计算机学院", enrolled: 128, passing: "82%", tags: ["基础"] },
  { id: 3, name: "云计算架构师", level: "高级", org: "网络中心", enrolled: 89, passing: "68%", tags: ["新兴"] },
  { id: 4, name: "前端开发工程师", level: "中级", org: "软件学院", enrolled: 203, passing: "79%", tags: ["热门"] },
]

const topics = [
  { id: 1, title: "基于深度学习的图像识别系统", mentor: "王教授", direction: "人工智能", spots: 3, total: 5 },
  { id: 2, title: "校园二手交易小程序设计与实现", mentor: "李老师", direction: "移动开发", spots: 5, total: 8 },
  { id: 3, title: "智慧图书馆管理系统", mentor: "张老师", direction: "Web开发", spots: 2, total: 6 },
  { id: 4, title: "基于物联网的温室环境监测", mentor: "陈教授", direction: "物联网", spots: 4, total: 5 },
]

export default function LandingHomePage() {
  return (
    <div>
      {/* Platform Intro + Stats */}
      <section className="border-b bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">能力测评认证平台</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            集测评资源、能力认证、毕业设计、学生画像于一体的一站式能力成长平台
          </p>
          <div className="mx-auto mt-6 flex max-w-xl gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索题库、试卷、认证项目..." className="h-10 pl-9" />
            </div>
            <Button className="h-10 gap-1 px-5">
              搜索 <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {platformStats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2 rounded-xl border bg-muted/30 p-4">
                <stat.icon className="h-6 w-6 text-primary" />
                <div className="text-xl font-bold sm:text-2xl">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workspace Preview */}
      <section className="border-b bg-white py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">我的工作台</h2>
              <span className="text-sm text-muted-foreground">欢迎回来，{workspacePreview.name}</span>
            </div>
            <Link href="/landingpage/workspace">
              <Button variant="outline" size="sm" className="gap-1">
                进入工作台 <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Todos */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3 pt-5 px-5">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                  今日待办
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-5 pb-5">
                {workspacePreview.todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 ${
                      todo.urgent ? "border-l-4 border-l-red-500" : ""
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                        todo.type === "exam"
                          ? "bg-blue-50 text-blue-600"
                          : todo.type === "graduation"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {todo.type === "exam" ? (
                        <PlayCircle className="h-4 w-4" />
                      ) : todo.type === "graduation" ? (
                        <GraduationCap className="h-4 w-4" />
                      ) : (
                        <Award className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{todo.title}</p>
                      <p
                        className={`mt-0.5 flex items-center gap-1 text-xs ${
                          todo.urgent ? "font-medium text-red-600" : "text-muted-foreground"
                        }`}
                      >
                        {todo.urgent && <AlertCircle className="h-3 w-3" />}
                        {todo.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3 pt-5 px-5">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                  我的概况
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-5 pb-5">
                {workspacePreview.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <stat.icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Entries */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-5 text-lg font-semibold">平台服务</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {serviceEntries.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${service.color} p-5 text-white transition-transform hover:scale-[1.02]`}
              >
                <service.icon className="h-7 w-7 opacity-90" />
                <h3 className="mt-3 text-base font-semibold">{service.title}</h3>
                <p className="mt-1 text-xs opacity-80">{service.desc}</p>
                <ArrowRight className="absolute right-3 top-3 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Question Banks & Exams */}
      <section className="border-t bg-white py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">测评资源推荐</h2>
            <Link href="/landingpage/resources">
              <Button variant="ghost" size="sm" className="gap-1">
                查看全部 <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">热门题库</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {questionBanks.map((bank) => (
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">热门试卷</h3>
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
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">能力认证</h2>
            <Link href="/landingpage/certifications">
              <Button variant="ghost" size="sm" className="gap-1">
                查看全部 <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((cert) => (
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
                  <div className="mb-2 text-xs text-muted-foreground flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />{cert.org}
                  </div>
                  <div className="flex items-center justify-between border-t pt-2 text-xs">
                    <span className="text-muted-foreground"><Users className="mr-1 inline h-3 w-3" />{cert.enrolled}人报名</span>
                    <span className="text-emerald-600">通过率 {cert.passing}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Graduation Topics */}
      <section className="border-t bg-white py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">毕业设计选题广场</h2>
            <Link href="/landingpage/graduation">
              <Button variant="ghost" size="sm" className="gap-1">
                查看全部 <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map((topic) => (
              <Card key={topic.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <GraduationCap className="h-4.5 w-4.5" />
                    </div>
                    <Badge variant={topic.spots <= 2 ? "destructive" : "secondary"} className="text-[10px]">
                      余 {topic.spots}/{topic.total} 名
                    </Badge>
                  </div>
                  <h4 className="mb-2 text-sm font-semibold leading-snug">{topic.title}</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><Users className="h-3 w-3" />导师：{topic.mentor}</div>
                    <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />方向：{topic.direction}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Student Portrait Demo */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-2xl border bg-white">
            <div className="grid lg:grid-cols-2">
              <div className="flex flex-col justify-center p-6 lg:p-10">
                <Badge variant="secondary" className="mb-3 w-fit">学生能力画像</Badge>
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
                <Link href="/landingpage/portrait">
                  <Button className="mt-6 w-fit gap-1 text-xs sm:text-sm">
                    查看示例画像 <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
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
        </div>
      </section>
    </div>
  )
}

"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
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
  MonitorPlay,
  Eye,
  X,
  Lightbulb,
  Monitor,
  Wrench,
  FolderCheck,
  Presentation,
  Drama,
  Handshake,
  HeartHandshake,
  ClipboardCheck,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useData } from "@/components/providers/data-provider"

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
    { id: 3, title: '岗位认定"Java开发工程师"作品待提交', time: "5天后", type: "cert", urgent: false },
  ],
  stats: [
    { label: "进行中的考试", value: 2, icon: PlayCircle },
    { label: "已获得认定", value: 3, icon: Award },
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
  { id: 'exam-1', title: "2024年春季《数据结构》期末统考", type: "期末考", duration: 120, questions: 40, participants: 2340 },
  { id: 'exam-2', title: "全国计算机等级考试二级Python真题", type: "真题", duration: 120, questions: 40, participants: 2840 },
  { id: 'exam-3', title: "2024年春季《数据结构》模拟测试卷", type: "模拟卷", duration: 90, questions: 35, participants: 1256 },
]

const myExams = [
  { id: 1, examId: 'exam-1', name: "前端基础测试", status: "进行中", type: "随堂测", time: "2024-03-15 14:00", duration: 60, questionCount: 20 },
  { id: 2, examId: 'exam-2', name: "TypeScript 能力测试", status: "未开始", type: "教学考试", time: "2024-03-20 10:00", duration: 90, questionCount: 30 },
]

const allExams = [
  { id: 1, examId: 'exam-1', name: "前端基础测试", status: "进行中", type: "随堂测", time: "2024-03-15 14:00", duration: 60, questionCount: 20 },
  { id: 2, examId: 'exam-2', name: "TypeScript 能力测试", status: "未开始", type: "教学考试", time: "2024-03-20 10:00", duration: 90, questionCount: 30 },
  { id: 3, examId: 'exam-3', name: "React 进阶考核", status: "已结束", type: "期末考", time: "2024-03-10 09:00", duration: 120, questionCount: 40 },
  { id: 4, examId: 'exam-4', name: "Node.js 后端测试", status: "进行中", type: "随堂测", time: "2024-02-28 14:00", duration: 60, questionCount: 25 },
  { id: 5, examId: 'exam-5', name: "Vue.js 进阶考核", status: "未开始", type: "期末考", time: "2024-04-05 10:00", duration: 120, questionCount: 35 },
  { id: 6, examId: 'exam-6', name: "全栈开发综合测试", status: "已结束", type: "综合考", time: "2024-03-25 09:00", duration: 150, questionCount: 50 },
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

const categoryIcons: Record<string, React.ElementType> = {
  '知识测评': Lightbulb,
  '过程测评': Monitor,
  '实操测评': Wrench,
  '成果测评': FolderCheck,
  '展示测评': Presentation,
  '情境模拟测评': Drama,
  '协作互评': Handshake,
  '多元评价': HeartHandshake,
  '综合考核': ClipboardCheck,
}

export default function LandingHomePage() {
  const [previewBank, setPreviewBank] = useState<typeof questionBanks[0] | null>(null)
  const [activeTab, setActiveTab] = useState<'my' | 'interested'>('my')
  const [examCenterTab, setExamCenterTab] = useState<'my' | 'all'>('my')
  const { evaluationCategories, evaluationMethods } = useData()

  const enabledMethods = useMemo(() => {
    return evaluationMethods.filter((m) => m.enabled)
  }, [evaluationMethods])

  const groupedMethods = useMemo(() => {
    const groups = new Map<string, typeof evaluationMethods>()
    enabledMethods.forEach((m) => {
      const list = groups.get(m.categoryId) || []
      list.push(m)
      groups.set(m.categoryId, list)
    })
    return evaluationCategories
      .map((c) => ({ category: c, methods: groups.get(c.id) || [] }))
      .filter((g) => g.methods.length > 0)
  }, [enabledMethods, evaluationCategories])

  return (
    <div>
      {/* Platform Intro + Stats */}
      <section className="border-b bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="mb-4 flex items-center justify-end">
            <Link href="/landingpage/workspace">
              <Button variant="outline" size="sm" className="gap-1">
                进入工作台 <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">能力测评认定平台</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            集测评资源、能力认定、毕业设计、学生画像于一体的一站式能力成长平台
          </p>
          <div className="mx-auto mt-6 flex max-w-xl gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="搜索题库、试卷、认定项目..." className="h-10 pl-9" />
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

      {/* Evaluation Methods */}
      <section className="border-t bg-white py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">测评方式介绍</h2>
              <p className="text-sm text-muted-foreground mt-0.5">平台支持多种科学测评方式，全面评估学生能力</p>
            </div>
            <Link href="/evaluation-methods">
              <Button variant="ghost" size="sm" className="gap-1">
                查看全部 <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-6">
            {groupedMethods.map(({ category, methods }) => {
              const CategoryIcon = categoryIcons[category.name] || Lightbulb
              return (
                <div key={category.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                      <CategoryIcon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold">{category.name}</h3>
                    <span className="text-xs text-muted-foreground">({methods.length})</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {methods.map((method) => (
                      <Card key={method.id} className="transition-shadow hover:shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-medium">{method.name}</h4>
                            {method.docLink && (
                              <a
                                href={method.docLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                                title="查看文档"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                            {method.description || '暂无说明'}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
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
                <Card key={bank.id} className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => setPreviewBank(bank)}>
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
                <Link
                  key={exam.id}
                  href={`/exams/${exam.id}?mode=preview`}
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
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-md border bg-background px-2.5 py-1 text-xs font-medium hover:bg-accent">
                    <Eye className="h-3 w-3" />预览
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Exam Center */}
      <section className="border-t bg-white py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">考试中心</h2>
            <Link href="/landingpage/exams">
              <Button variant="ghost" size="sm" className="gap-1">
                查看全部 <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <Tabs value={examCenterTab} onValueChange={(v) => setExamCenterTab(v as 'my' | 'all')} className="mb-4">
            <TabsList>
              <TabsTrigger value="my">我的考试</TabsTrigger>
              <TabsTrigger value="all">全部考试</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(examCenterTab === 'my' ? myExams : allExams).map((exam) => (
              <Link key={exam.id} href={`/landingpage/exams/${exam.examId}`} className="block">
                <Card className="transition-shadow hover:shadow-md cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                        <ClipboardList className="h-4.5 w-4.5" />
                      </div>
                      <Badge variant={exam.status === '进行中' ? 'default' : exam.status === '未开始' ? 'secondary' : 'outline'} className="text-[10px]">
                        {exam.status}
                      </Badge>
                    </div>
                    <h4 className="mb-1 text-sm font-semibold">{exam.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-[10px] font-normal">{exam.type}</Badge>
                      <span>{exam.time}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{exam.duration} 分钟</span>
                      <span>{exam.questionCount} 题</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">能力认定</h2>
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
                  基于课程成绩、考试成绩、认定结果、项目作品等多维数据，生成个人能力画像，助力职业发展规划。
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

      {/* Preview Dialogs */}
      <Dialog open={!!previewBank} onOpenChange={() => setPreviewBank(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>题库预览</DialogTitle>
          </DialogHeader>
          {previewBank && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{previewBank.title}</h3>
                  <p className="text-sm text-muted-foreground">{previewBank.category} · {previewBank.questions} 题</p>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">题库内容预览区域，展示该题库下的部分题目...</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>


    </div>
  )
}

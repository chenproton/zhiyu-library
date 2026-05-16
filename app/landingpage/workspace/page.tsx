"use client"

import Link from "next/link"
import {
  BookOpen,
  FileText,
  Award,
  GraduationCap,
  UserCircle,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  Calendar,
  PlayCircle,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const todos = [
  { id: 1, type: "exam", title: "《Python程序设计》期末统考", time: "今天 14:00", urgent: true },
  { id: 2, type: "exam", title: "《数据结构》模拟测试", time: "今天 16:30", urgent: true },
  { id: 3, type: "graduation", title: "毕业设计选题截止", time: "3天后", urgent: false },
  { id: 4, type: "cert", title: '岗位认证"Java开发工程师"作品待提交', time: "5天后", urgent: false },
]

const stats = [
  { label: "进行中的考试", value: "2", icon: PlayCircle, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
  { label: "已获得认证", value: "3", icon: Award, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
  { label: "毕业设计阶段", value: "选题中", icon: GraduationCap, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
  { label: "画像完成度", value: "78%", icon: UserCircle, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
]

const quickActions = [
  { label: "进入考试", icon: PlayCircle, desc: "2场待考", bg: "bg-blue-500", hover: "hover:bg-blue-600" },
  { label: "继续练习", icon: BookOpen, desc: "上次：Python题库", bg: "bg-emerald-500", hover: "hover:bg-emerald-600" },
  { label: "报名认证", icon: Award, desc: "3个可报名", bg: "bg-amber-500", hover: "hover:bg-amber-600" },
  { label: "提交作品", icon: FileText, desc: "毕设作品", bg: "bg-rose-500", hover: "hover:bg-rose-600" },
  { label: "查看画像", icon: BarChart3, desc: "最近更新", bg: "bg-purple-500", hover: "hover:bg-purple-600" },
]

const recentActivities = [
  { id: 1, type: "exam", title: "完成《计算机网络》期末考", time: "2小时前", result: "86分", status: "success" },
  { id: 2, type: "cert", title: '获得"数据库工程师"初级认证', time: "昨天", result: "已通过", status: "success" },
  { id: 3, type: "graduation", title: "毕业设计选题已通过导师审核", time: "2天前", result: "通过", status: "success" },
  { id: 4, type: "practice", title: "练习《Java基础题库》Chapter 3", time: "3天前", result: "正确率 72%", status: "neutral" },
]

const deadlines = [
  { title: "《操作系统》期末统考", date: "2024-06-20", daysLeft: 5, type: "exam" },
  { title: "毕业设计选题截止", date: "2024-06-18", daysLeft: 3, type: "graduation" },
  { title: "岗位认证报名截止", date: "2024-06-25", daysLeft: 10, type: "cert" },
]

export default function WorkspacePage() {
  return (
    <div className="pb-8">
      {/* Header */}
      <section className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-4">
          <Link href="/landingpage">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </Button>
          </Link>
          <h1 className="text-lg font-bold">我的工作台</h1>
        </div>
      </section>

      {/* Welcome + Todo */}
      <section className="border-b bg-white py-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold">早上好，张同学 👋</h2>
              <p className="mt-1 text-sm text-muted-foreground">今天是 2024年6月15日，你有 4 项待办事项</p>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Calendar className="h-3.5 w-3.5" />
              2024年春季学期
            </Badge>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {todos.map((todo) => (
              <Card
                key={todo.id}
                className={`cursor-pointer transition-shadow hover:shadow-md ${
                  todo.urgent ? "border-l-4 border-l-red-500" : ""
                }`}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      todo.type === "exam"
                        ? "bg-blue-50 text-blue-600"
                        : todo.type === "graduation"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {todo.type === "exam" ? (
                      <PlayCircle className="h-4.5 w-4.5" />
                    ) : todo.type === "graduation" ? (
                      <GraduationCap className="h-4.5 w-4.5" />
                    ) : (
                      <Award className="h-4.5 w-4.5" />
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="border-b bg-white py-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card
                key={stat.label}
                className={`border ${stat.border} transition-shadow hover:shadow-md`}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="border-b bg-white py-6">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-4 text-base font-semibold">快捷操作</h2>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className={`flex flex-col items-center gap-2 rounded-xl ${action.bg} ${action.hover} px-4 py-5 text-white transition-transform hover:scale-[1.02]`}
              >
                <action.icon className="h-6 w-6" />
                <span className="text-sm font-medium">{action.label}</span>
                <span className="text-[11px] opacity-80">{action.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recent + Deadlines */}
      <section className="py-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Recent Activities */}
            <section className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3 pt-5 px-5">
                  <CardTitle className="text-sm font-semibold">最近动态</CardTitle>
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                    查看全部 <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2 px-5 pb-5">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          activity.status === "success"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {activity.status === "success" ? (
                          <CheckCircle2 className="h-4.5 w-4.5" />
                        ) : (
                          <TrendingUp className="h-4.5 w-4.5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      <Badge
                        variant={activity.status === "success" ? "default" : "secondary"}
                        className="shrink-0 text-xs"
                      >
                        {activity.result}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>

            {/* Deadlines */}
            <section>
              <Card>
                <CardHeader className="pb-3 pt-5 px-5">
                  <CardTitle className="text-sm font-semibold">即将到期</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 px-5 pb-5">
                  {deadlines.map((item) => (
                    <div key={item.title} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.title}</span>
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={Math.max(0, 100 - item.daysLeft * 10)}
                          className="h-2 flex-1"
                        />
                        <span
                          className={`shrink-0 text-xs font-medium ${
                            item.daysLeft <= 3 ? "text-red-600" : "text-muted-foreground"
                          }`}
                        >
                          {item.daysLeft <= 3 ? (
                            <>
                              <AlertCircle className="mr-0.5 inline h-3 w-3" />
                              剩{item.daysLeft}天
                            </>
                          ) : (
                            <>剩{item.daysLeft}天</>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}

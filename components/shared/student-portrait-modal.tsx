"use client"

import { useState, useMemo } from "react"
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import {
  UserCircle,
  GraduationCap,
  Building2,
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  Target,
  Briefcase,
  User,
  UserRound,
  Clock,
  PieChartIcon,
  Medal,
  Trophy,
  Star,
  Flame,
  Zap,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useData } from "@/components/providers/data-provider"
import type { AbilityItem } from "@/lib/types"

// ==================== 模拟数据 ====================

const studyTimeData = [
  { date: "01-06", hours: 2.5 },
  { date: "01-07", hours: 3.2 },
  { date: "01-08", hours: 1.8 },
  { date: "01-09", hours: 4.0 },
  { date: "01-10", hours: 3.5 },
  { date: "01-11", hours: 2.0 },
  { date: "01-12", hours: 5.2 },
]

const sceneTaskData = [
  { name: "已获得", value: 420, total: 600, color: "#3b82f6" },
  { name: "未完成", value: 180, total: 600, color: "#e2e8f0" },
]

const onlineCourseData = [
  { name: "已获得", value: 280, total: 400, color: "#10b981" },
  { name: "未完成", value: 120, total: 400, color: "#f1f5f9" },
]

// 徽章成就数据
const badges = [
  { icon: Trophy, name: "学习先锋", color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" },
  { icon: Medal, name: "全勤达人", color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
  { icon: Flame, name: "连续打卡30天", color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200" },
  { icon: Star, name: "优秀学员", color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-200" },
  { icon: Zap, name: "能力突破", color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" },
]

const masteryLevels = ["不合格", "了解", "理解", "掌握", "熟练", "精通"]

function isPassed(mastery: string, required: string) {
  return masteryLevels.indexOf(mastery) >= masteryLevels.indexOf(required)
}

function generateAbilityDetail(
  abilityItems: AbilityItem[],
  seed: number
): {
  domain: string
  point: string
  score: number
  mastery: string
  required: string
}[] {
  const details: ReturnType<typeof generateAbilityDetail> = []
  let idx = seed
  abilityItems.forEach((item) => {
    item.abilityPoints.forEach((point) => {
      const score = Math.max(50, Math.min(100, 65 + ((idx * 7) % 35)))
      const levelIdx = Math.min(5, Math.floor(score / 20))
      const mastery = masteryLevels[levelIdx]
      details.push({
        domain: item.name,
        point: point.name,
        score,
        mastery,
        required: point.requiredLevel,
      })
      idx++
    })
  })
  return details
}

// 计算表格中能力域的 rowSpan
function computeDomainSpans(data: { domain: string }[]) {
  const spans: number[] = []
  let i = 0
  while (i < data.length) {
    const domain = data[i].domain
    let count = 1
    let j = i + 1
    while (j < data.length && data[j].domain === domain) {
      count++
      j++
    }
    spans.push(count)
    for (let k = 1; k < count; k++) {
      spans.push(0)
    }
    i = j
  }
  return spans
}

interface StudentPortraitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentName?: string
  className?: string
  positionId?: string
  department?: string
  major?: string
  grade?: string
}

export function StudentPortraitModal({
  open,
  onOpenChange,
  studentName = "学生",
  className = "-",
  positionId: defaultPositionId,
  department = "软件学院",
  major = "智能物流技术",
  grade = "2021级",
}: StudentPortraitModalProps) {
  const { positionsList, getPositionAbilityItems } = useData()
  const [selectedGender, setSelectedGender] = useState<"male" | "female">("male")
  const [activePositionId, setActivePositionId] = useState(defaultPositionId || "pos-1")

  const abilityItems = useMemo(
    () => getPositionAbilityItems(activePositionId),
    [activePositionId, getPositionAbilityItems]
  )

  const abilityPortraitData = useMemo(
    () => generateAbilityDetail(abilityItems, activePositionId.length + activePositionId.charCodeAt(3)),
    [abilityItems, activePositionId]
  )

  const domainSpans = useMemo(() => computeDomainSpans(abilityPortraitData), [abilityPortraitData])

  const radarData = useMemo(() => {
    return abilityItems.map((item) => {
      const points = item.abilityPoints
      const avgScore =
        points.reduce((sum, p) => {
          const detail = abilityPortraitData.find((d) => d.point === p.name)
          return sum + (detail?.score || 0)
        }, 0) / (points.length || 1)
      return {
        subject: item.name,
        score: Math.round(avgScore),
        fullMark: 100,
      }
    })
  }, [abilityItems, abilityPortraitData])

  const passedCount = abilityPortraitData.filter((row) => isPassed(row.mastery, row.required)).length
  const totalCount = abilityPortraitData.length
  const passRate = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0

  const activePosition = positionsList.find((p) => p.id === activePositionId)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[95vw] !max-w-none max-h-[92vh] overflow-auto p-0 gap-0">
        <DialogHeader className="px-6 pt-5 pb-2">
          <DialogTitle className="text-lg">学生能力画像详情</DialogTitle>
        </DialogHeader>

        {/* 三列等宽布局 */}
        <div className="flex gap-3 p-5 pt-2">
          {/* ========== 左侧 ========== */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* 个人信息卡片 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200">
                    <UserCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-semibold truncate">{studentName}</p>
                    <p className="text-xs text-muted-foreground">学号：2021001</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span>院系：{department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span>专业：{major}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span>班级：{className}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span>年级：{grade}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 徽章成就展示 */}
            <Card>
              <CardContent className="p-4">
                <h4 className="mb-3 text-sm font-semibold flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  学习成就
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {badges.map((badge) => {
                    const Icon = badge.icon
                    return (
                      <div
                        key={badge.name}
                        className={`group relative flex h-10 w-10 items-center justify-center rounded-lg border ${badge.border} ${badge.bg} cursor-default transition-transform hover:scale-110`}
                        title={badge.name}
                      >
                        <Icon className={`h-5 w-5 ${badge.color}`} />
                        {/* hover tooltip */}
                        <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-50">
                          {badge.name}
                          <div className="absolute left-1/2 -translate-x-1/2 top-full h-0 w-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-slate-800" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 学习时长折线图 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <h4 className="text-sm font-semibold">学习时长趋势</h4>
                </div>
                <div className="h-[140px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={studyTimeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={25} />
                      <Tooltip
                        contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
                        formatter={(value: number) => [`${value} 小时`, "学习时长"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="hours"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* 学习概览：两个饼图 */}
            <Card>
              <CardContent className="p-4">
                <h4 className="mb-2 text-sm font-semibold flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4 text-emerald-500" />
                  学习概览
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {/* 场景任务饼图 */}
                  <div>
                    <div className="text-[10px] text-muted-foreground text-center mb-1">场景任务</div>
                    <div className="h-[130px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sceneTaskData}
                            cx="50%"
                            cy="50%"
                            innerRadius={28}
                            outerRadius={45}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                          >
                            {sceneTaskData.map((entry, index) => (
                              <Cell key={`cell-scene-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ fontSize: 11, borderRadius: 6 }}
                            formatter={(_: number, __: string, props: any) => {
                              const item = props?.payload
                              return [`${item.value}/${item.total}`, item.name]
                            }}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={28}
                            iconType="circle"
                            iconSize={5}
                            formatter={(value: string) => <span className="text-[9px]">{value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 在线课程饼图 */}
                  <div>
                    <div className="text-[10px] text-muted-foreground text-center mb-1">在线课程</div>
                    <div className="h-[130px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={onlineCourseData}
                            cx="50%"
                            cy="50%"
                            innerRadius={28}
                            outerRadius={45}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                          >
                            {onlineCourseData.map((entry, index) => (
                              <Cell key={`cell-course-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ fontSize: 11, borderRadius: 6 }}
                            formatter={(_: number, __: string, props: any) => {
                              const item = props?.payload
                              return [`${item.value}/${item.total}`, item.name]
                            }}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={28}
                            iconType="circle"
                            iconSize={5}
                            formatter={(value: string) => <span className="text-[9px]">{value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ========== 中间 ========== */}
          <div className="flex-1 min-w-0 flex flex-col gap-3">
            <Card className="flex-1 flex flex-col">
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold">学生形象</h4>
                  <div className="flex rounded-md border overflow-hidden">
                    <button
                      onClick={() => setSelectedGender("male")}
                      className={`px-2 py-0.5 text-xs transition-colors ${
                        selectedGender === "male" ? "bg-primary text-primary-foreground" : "bg-white hover:bg-slate-50"
                      }`}
                    >
                      <User className="h-3 w-3 inline mr-0.5" />
                      男
                    </button>
                    <button
                      onClick={() => setSelectedGender("female")}
                      className={`px-2 py-0.5 text-xs transition-colors ${
                        selectedGender === "female" ? "bg-primary text-primary-foreground" : "bg-white hover:bg-slate-50"
                      }`}
                    >
                      <UserRound className="h-3 w-3 inline mr-0.5" />
                      女
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center min-h-[180px]">
                  <div
                    className={`relative flex items-center justify-center rounded-2xl border-2 border-dashed w-full h-full min-h-[200px] ${
                      selectedGender === "male" ? "border-blue-200 bg-blue-50/50" : "border-pink-200 bg-pink-50/50"
                    }`}
                  >
                    {selectedGender === "male" ? (
                      <div className="text-center space-y-2">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                          <User className="h-10 w-10 text-blue-500" />
                        </div>
                        <p className="text-xs text-blue-400 font-medium">男生形象占位</p>
                        <p className="text-[10px] text-blue-300">卡通人物素材待替换</p>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pink-100">
                          <UserRound className="h-10 w-10 text-pink-500" />
                        </div>
                        <p className="text-xs text-pink-400 font-medium">女生形象占位</p>
                        <p className="text-[10px] text-pink-300">卡通人物素材待替换</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">学习天数</span>
                    <span className="font-medium">126 天</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">平均时长</span>
                    <span className="font-medium">3.2 h/天</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">累计学分</span>
                    <span className="font-medium">86.5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ========== 右侧：合成一个大卡片 ========== */}
          <div className="flex-1 min-w-0">
            <Card className="h-full">
              <CardContent className="p-4 space-y-4">
                {/* 顶部：标题 + 岗位 Tab */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-semibold">目标岗位</h4>
                  </div>
                </div>
                <Tabs value={activePositionId} onValueChange={setActivePositionId}>
                  <TabsList className="h-8 gap-1 bg-slate-100/50 p-1">
                    {positionsList.slice(0, 4).map((pos) => (
                      <TabsTrigger
                        key={pos.id}
                        value={pos.id}
                        className="text-xs h-6 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        {pos.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                {/* 中间：雷达图 + 达成率 */}
                <div className="grid grid-cols-5 gap-4">
                  {/* 雷达图 */}
                  <div className="col-span-3">
                      <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#64748b" }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: "#94a3b8" }} />
                          <Radar
                            name="得分"
                            dataKey="score"
                            stroke="#2563eb"
                            fill="#3b82f6"
                            fillOpacity={0.25}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 达成率 */}
                  <div className="col-span-2 flex flex-col justify-center">
                    <div
                      className={`rounded-xl p-4 text-center ${
                        passRate >= 80
                          ? "bg-emerald-50 border border-emerald-100"
                          : passRate >= 60
                          ? "bg-amber-50 border border-amber-100"
                          : "bg-red-50 border border-red-100"
                      }`}
                    >
                      <div
                        className={`text-3xl font-bold mb-1 ${
                          passRate >= 80 ? "text-emerald-600" : passRate >= 60 ? "text-amber-600" : "text-red-600"
                        }`}
                      >
                        {passRate}%
                      </div>
                      <div className="text-xs font-medium mb-2">
                        {passRate >= 80 ? "已达标" : passRate >= 60 ? "基本达标" : "未达标"}
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed mb-3">
                        {passRate >= 80
                          ? "表现优秀，已满足岗位胜任要求"
                          : passRate >= 60
                          ? "建议针对性提升薄弱能力项"
                          : "需要加强学习，提升核心能力"}
                      </p>
                      <div className="flex gap-2 justify-center">
                        <div className="flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px]">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          <span>{passedCount} 通过</span>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px]">
                          <XCircle className="h-3 w-3 text-red-400" />
                          <span>{totalCount - passedCount} 待提升</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 底部分隔线 */}
                <div className="border-t" />

                {/* 底部：能力点认定明细表 */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    能力点认定明细
                  </h4>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                          <TableHead className="w-[90px]">能力域</TableHead>
                          <TableHead className="w-[130px]">能力点</TableHead>
                          <TableHead className="w-[50px] text-center">得分</TableHead>
                          <TableHead className="w-[65px] text-center">掌握度</TableHead>
                          <TableHead className="w-[65px] text-center">所需</TableHead>
                          <TableHead className="w-[75px] text-center">认定结果</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {abilityPortraitData.map((row, idx) => {
                          const passed = isPassed(row.mastery, row.required)
                          const span = domainSpans[idx]
                          return (
                            <TableRow key={idx} className="group">
                              {span > 0 && (
                                <TableCell
                                  className="text-sm font-medium whitespace-nowrap align-middle bg-slate-50/50"
                                  rowSpan={span}
                                >
                                  {row.domain}
                                </TableCell>
                              )}
                              <TableCell className="text-sm whitespace-nowrap">{row.point}</TableCell>
                              <TableCell className="text-sm font-medium text-center whitespace-nowrap">{row.score}</TableCell>
                              <TableCell className="text-center whitespace-nowrap">
                                <Badge variant="outline" className="text-xs">
                                  {row.mastery}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center whitespace-nowrap">
                                <Badge variant="secondary" className="text-xs">
                                  {row.required}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center whitespace-nowrap">
                                {passed ? (
                                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-xs gap-1 cursor-default">
                                    <CheckCircle2 className="h-3 w-3" />
                                    通过
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive" className="text-xs gap-1 cursor-default">
                                    <XCircle className="h-3 w-3" />
                                    不通过
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

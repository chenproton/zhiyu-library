"use client"

import { useState, useMemo } from "react"
import { Search, User, BarChart3, TrendingUp, Award, Target, Users, Settings, Eye, Pencil, RefreshCw, SlidersHorizontal, Briefcase, BookOpen, GraduationCap, Layers, FileText, Star, Medal, MapPin, CheckCircle2, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useData } from "@/components/providers/data-provider"
import { useToast } from "@/hooks/use-toast"
import type { StudentAbilityPortrait, EvaluationGrade, AbilityDomainScore } from "@/lib/types"

export default function StudentAbilityPortraitsPage() {
  const { studentAbilityPortraits, portraitUpdateConfig, updateStudentAbilityPortrait, updatePortraitUpdateConfig } = useData()
  const { toast } = useToast()

  const [search, setSearch] = useState("")
  const [gradeFilter, setGradeFilter] = useState<string>("all")

  const [viewPortrait, setViewPortrait] = useState<StudentAbilityPortrait | null>(null)
  const [editPortrait, setEditPortrait] = useState<StudentAbilityPortrait | null>(null)
  const [editReason, setEditReason] = useState('')
  const [editDomains, setEditDomains] = useState<AbilityDomainScore[]>([])
  const [configOpen, setConfigOpen] = useState(false)
  const [compareOpen, setCompareOpen] = useState(false)
  const [recommendOpen, setRecommendOpen] = useState(false)
  const [generateOpen, setGenerateOpen] = useState(false)

  const filteredPortraits = useMemo(() => {
    let list = [...studentAbilityPortraits]
    if (gradeFilter !== "all") list = list.filter((p) => p.overallGrade === gradeFilter)
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter((p) => p.studentName.toLowerCase().includes(q) || p.studentId.toLowerCase().includes(q) || p.className.toLowerCase().includes(q) || p.positionName.toLowerCase().includes(q)) }
    return list
  }, [studentAbilityPortraits, gradeFilter, search])

  const stats = useMemo(() => {
    const total = studentAbilityPortraits.length
    const avgScore = total > 0 ? Math.round(studentAbilityPortraits.reduce((sum, p) => { const avg = p.domainScores.reduce((s, d) => s + d.score, 0) / p.domainScores.length; return sum + avg }, 0) / total) : 0
    return { total, gradeA: studentAbilityPortraits.filter((p) => p.overallGrade === 'A').length, gradeB: studentAbilityPortraits.filter((p) => p.overallGrade === 'B').length, gradeC: studentAbilityPortraits.filter((p) => p.overallGrade === 'C').length, gradeD: studentAbilityPortraits.filter((p) => p.overallGrade === 'D').length, avgScore }
  }, [studentAbilityPortraits])

  const openEdit = (portrait: StudentAbilityPortrait) => {
    setEditPortrait(portrait)
    setEditDomains([...portrait.domainScores])
    setEditReason('')
  }
  const handleManualAdjust = () => {
    if (editPortrait && editReason.trim()) {
      const avg = editDomains.reduce((s, d) => s + d.score, 0) / editDomains.length
      let grade: EvaluationGrade = 'E'
      if (avg >= 90) grade = 'A'; else if (avg >= 80) grade = 'B'; else if (avg >= 70) grade = 'C'; else if (avg >= 60) grade = 'D'
      updateStudentAbilityPortrait(editPortrait.id, { domainScores: editDomains, overallGrade: grade })
      toast({ title: '画像数据已手动调整' }); setEditPortrait(null); setEditReason('')
    } else { toast({ title: '请填写调整原因', variant: 'destructive' }) }
  }
  const handleGenerate = () => { toast({ title: '画像生成引擎已启动，正在重新计算所有学生能力画像...' }); setGenerateOpen(false) }

  const getGradeBadge = (grade: EvaluationGrade) => {
    const colors: Record<EvaluationGrade, string> = { A: 'bg-emerald-500', B: 'bg-blue-500', C: 'bg-amber-500', D: 'bg-orange-500', E: 'bg-red-500' }
    return <Badge variant="default" className={`${colors[grade]} gap-1`}>{grade}</Badge>
  }
  const formatDate = (date: Date) => new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date)

  return (
    <div className="px-8 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">学生能力画像管理</h1><p className="text-muted-foreground">基于课程任务、实践场景、毕设评价、档案材料等全量数据，自动生成学生能力画像</p></div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setGenerateOpen(true)}><RefreshCw className="mr-2 size-4" />重新生成画像</Button>
          <Button variant="outline" onClick={() => setConfigOpen(true)}><Settings className="mr-2 size-4" />频次配置</Button>
          <Button variant="outline" onClick={() => setCompareOpen(true)}><BarChart3 className="mr-2 size-4" />画像对比分析</Button>
        </div>
      </div>
      <div className="mb-4 flex gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-blue-50"><Users className="size-4 text-blue-600" /></div>
          <div className="min-w-0 flex-1"><div className="text-xs text-muted-foreground">画像总数</div><div className="flex items-center gap-2 text-xs"><span>总画像 <strong className="text-foreground">{stats.total}</strong></span></div></div>
        </div>
        <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-emerald-50"><Award className="size-4 text-emerald-600" /></div>
          <div className="min-w-0 flex-1"><div className="text-xs text-muted-foreground">等级分布</div><div className="flex items-center gap-2 text-xs"><span>A <strong className="text-emerald-600">{stats.gradeA}</strong></span><span className="text-gray-300">|</span><span>B <strong className="text-blue-600">{stats.gradeB}</strong></span><span className="text-gray-300">|</span><span>C <strong className="text-amber-600">{stats.gradeC}</strong></span><span className="text-gray-300">|</span><span>D <strong className="text-red-600">{stats.gradeD}</strong></span></div></div>
        </div>
        <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-amber-50"><TrendingUp className="size-4 text-amber-600" /></div>
          <div className="min-w-0 flex-1"><div className="text-xs text-muted-foreground">平均能力分</div><div className="flex items-center gap-2 text-xs"><span>均分 <strong className="text-amber-600">{stats.avgScore}</strong></span></div></div>
        </div>
      </div>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="搜索姓名、学号、班级或岗位..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
        <Select value={gradeFilter} onValueChange={setGradeFilter}><SelectTrigger className="w-[140px]"><SelectValue placeholder="全部等级" /></SelectTrigger><SelectContent><SelectGroup><SelectItem value="all">全部等级</SelectItem><SelectItem value="A">A - 优秀</SelectItem><SelectItem value="B">B - 良好</SelectItem><SelectItem value="C">C - 中等</SelectItem><SelectItem value="D">D - 及格</SelectItem><SelectItem value="E">E - 不及格</SelectItem></SelectGroup></SelectContent></Select>
      </div>
      <div className="rounded-lg border bg-white px-4 py-3">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead className="w-[100px]">学号</TableHead><TableHead className="w-[100px]">姓名</TableHead><TableHead className="w-[160px]">班级</TableHead><TableHead className="w-[140px]">专业</TableHead><TableHead className="w-[140px]">岗位方向</TableHead><TableHead className="w-[100px]">综合等级</TableHead><TableHead className="w-[200px]">能力领域得分</TableHead><TableHead className="w-[120px]">班级排名</TableHead><TableHead className="w-[120px]">专业排名</TableHead><TableHead className="w-[180px]">推荐岗位</TableHead><TableHead className="sticky right-0 w-[160px] bg-white text-right">操作</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredPortraits.length === 0 ? (<TableRow><TableCell colSpan={11} className="h-24 text-center text-muted-foreground">暂无画像记录</TableCell></TableRow>) : (filteredPortraits.map((portrait) => (
                <TableRow key={portrait.id}>
                  <TableCell><span className="text-sm text-muted-foreground">{portrait.studentId}</span></TableCell>
                  <TableCell><span className="text-sm font-medium">{portrait.studentName}</span></TableCell>
                  <TableCell><span className="text-sm">{portrait.className}</span></TableCell>
                  <TableCell><span className="text-sm text-muted-foreground">{portrait.majorName}</span></TableCell>
                  <TableCell><div className="flex items-center gap-1.5"><Target className="size-3.5 text-blue-500" /><span className="text-sm">{portrait.positionName}</span></div></TableCell>
                  <TableCell>{getGradeBadge(portrait.overallGrade)}</TableCell>
                  <TableCell><div className="flex flex-col gap-1">{portrait.domainScores.map((domain) => (<div key={domain.domain} className="flex items-center gap-2"><span className="w-14 text-[11px] text-muted-foreground">{domain.domainLabel}</span><Progress value={domain.score} className="h-1.5 w-16" /><span className="text-[11px] font-medium">{domain.score}</span></div>))}</div></TableCell>
                  <TableCell><span className="text-sm"><strong className="text-emerald-600">{portrait.classRank}</strong><span className="text-muted-foreground"> / {portrait.classTotal}</span></span></TableCell>
                  <TableCell><span className="text-sm"><strong className="text-blue-600">{portrait.majorRank}</strong><span className="text-muted-foreground"> / {portrait.majorTotal}</span></span></TableCell>
                  <TableCell><div className="flex flex-col gap-0.5">{portrait.recommendPositions.slice(0, 2).map((rec, i) => (<div key={i} className="flex items-center gap-1.5"><span className="text-xs">{rec.positionName}</span><Badge variant="outline" className="text-[10px] font-normal">{rec.matchRate}%</Badge></div>))}</div></TableCell>
                  <TableCell className="sticky right-0 bg-white text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => setViewPortrait(portrait)}><Eye className="size-3" />查看</Button>
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => openEdit(portrait)}><Pencil className="size-3" />维护</Button>
                      <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-blue-600" onClick={() => { setViewPortrait(portrait); setRecommendOpen(true) }}><Briefcase className="size-3" />推荐</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 查看详情大弹窗 - 3个tab */}
      <Dialog open={!!viewPortrait} onOpenChange={(open) => !open && setViewPortrait(null)}>
        <DialogContent className="sm:max-w-6xl max-h-[92vh] overflow-y-auto p-0">
          {viewPortrait && (
            <div className="p-6">
              <DialogHeader className="mb-4">
                <DialogTitle className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">{viewPortrait.studentName[0]}</div>
                  <div>
                    <div>{viewPortrait.studentName} 学生能力画像详情</div>
                    <div className="text-sm font-normal text-muted-foreground">{viewPortrait.studentId} · {viewPortrait.className} · {viewPortrait.majorName} · 岗位方向：{viewPortrait.positionName}</div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="base">
                <TabsList className="mb-4 grid w-full grid-cols-3">
                  <TabsTrigger value="base"><User className="mr-1 size-4" />学生基础档案信息</TabsTrigger>
                  <TabsTrigger value="education"><GraduationCap className="mr-1 size-4" />学生学历评价信息</TabsTrigger>
                  <TabsTrigger value="ability"><Award className="mr-1 size-4" />学生能力评价信息</TabsTrigger>
                </TabsList>

                {/* Tab 1: 学生基础档案信息 */}
                <TabsContent value="base" className="space-y-4">
                  {/* 身份信息 */}
                  <div className="rounded-lg border bg-muted/30 p-5">
                    <h3 className="mb-4 text-sm font-semibold flex items-center gap-2"><User className="size-4 text-blue-600" />身份信息</h3>
                    <div className="grid grid-cols-3 gap-y-3 text-sm">
                      <div><span className="text-muted-foreground">学号：</span><span className="font-medium">{viewPortrait.studentId}</span></div>
                      <div><span className="text-muted-foreground">姓名：</span><span className="font-medium">{viewPortrait.studentName}</span></div>
                      <div><span className="text-muted-foreground">性别：</span><span>{viewPortrait.gender}</span></div>
                      <div><span className="text-muted-foreground">年级：</span><span>{viewPortrait.gradeYear}</span></div>
                      <div><span className="text-muted-foreground">班级：</span><span>{viewPortrait.className}</span></div>
                      <div><span className="text-muted-foreground">专业：</span><span>{viewPortrait.majorName}</span></div>
                    </div>
                  </div>

                  {/* 培养信息 */}
                  <div className="rounded-lg border bg-muted/30 p-5">
                    <h3 className="mb-4 text-sm font-semibold flex items-center gap-2"><BookOpen className="size-4 text-emerald-600" />培养信息</h3>
                    <div className="mb-3">
                      <div className="text-xs text-muted-foreground mb-1">岗位方向</div>
                      <Badge variant="default" className="bg-blue-500">{viewPortrait.positionName}</Badge>
                    </div>
                    <div className="mb-3">
                      <div className="text-xs text-muted-foreground mb-1">所属课程列表</div>
                      <div className="flex flex-wrap gap-2">
                        {viewPortrait.courses.map((c) => (<Badge key={c} variant="secondary" className="text-xs">{c}</Badge>))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">已关联实践场景列表</div>
                      <div className="flex flex-wrap gap-2">
                        {viewPortrait.scenes.map((s) => (<Badge key={s} variant="outline" className="text-xs">{s}</Badge>))}
                      </div>
                    </div>
                  </div>

                  {/* 统计信息 */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="rounded-lg border bg-white p-4 text-center">
                      <div className="text-xs text-muted-foreground">已完成课程数</div>
                      <div className="mt-1 text-2xl font-bold text-blue-600">{viewPortrait.completedCourses}</div>
                    </div>
                    <div className="rounded-lg border bg-white p-4 text-center">
                      <div className="text-xs text-muted-foreground">已完成场景数</div>
                      <div className="mt-1 text-2xl font-bold text-emerald-600">{viewPortrait.completedScenes}</div>
                    </div>
                    <div className="rounded-lg border bg-white p-4 text-center">
                      <div className="text-xs text-muted-foreground">获得学分总数</div>
                      <div className="mt-1 text-2xl font-bold text-amber-600">{viewPortrait.totalCredits}</div>
                    </div>
                    <div className="rounded-lg border bg-white p-4 text-center">
                      <div className="text-xs text-muted-foreground">档案材料数</div>
                      <div className="mt-1 text-2xl font-bold text-purple-600">{viewPortrait.archiveCount}</div>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 2: 学生学历评价信息 */}
                <TabsContent value="education" className="space-y-4">
                  {/* 课程学分 */}
                  <div className="rounded-lg border bg-muted/30 p-5">
                    <h3 className="mb-4 text-sm font-semibold flex items-center gap-2"><BookOpen className="size-4 text-blue-600" />课程学分与评级</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow><TableHead>课程名称</TableHead><TableHead className="w-[100px]">学分</TableHead><TableHead className="w-[100px]">完成等级</TableHead><TableHead className="w-[100px]">期末成绩</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                          {viewPortrait.courseRecords.map((cr, i) => (
                            <TableRow key={i}>
                              <TableCell><span className="text-sm">{cr.courseName}</span></TableCell>
                              <TableCell><span className="text-sm">{cr.credit}</span></TableCell>
                              <TableCell>{getGradeBadge(cr.grade)}</TableCell>
                              <TableCell><span className="text-sm font-medium">{cr.finalScore}</span></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    <div className="mt-3 flex items-center justify-between rounded-md bg-white p-3 text-sm">
                      <span className="text-muted-foreground">课程总学分</span>
                      <span className="font-bold text-blue-600">{viewPortrait.courseRecords.reduce((s, c) => s + c.credit, 0)} 分</span>
                    </div>
                  </div>

                  {/* 学历认定结果 */}
                  <div className="rounded-lg border bg-muted/30 p-5">
                    <h3 className="mb-4 text-sm font-semibold flex items-center gap-2"><GraduationCap className="size-4 text-emerald-600" />学历认定结果</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="rounded-lg border bg-white p-4 text-center">
                        <div className="text-xs text-muted-foreground">毕业学分要求</div>
                        <div className="mt-2 inline-flex items-center gap-2">
                          {viewPortrait.graduationQualified ? (
                            <><CheckCircle2 className="size-5 text-emerald-500" /><span className="font-medium text-emerald-600">已达标</span></>
                          ) : (
                            <><Clock className="size-5 text-amber-500" /><span className="font-medium text-amber-600">未达标</span></>
                          )}
                        </div>
                      </div>
                      <div className="rounded-lg border bg-white p-4 text-center">
                        <div className="text-xs text-muted-foreground">出勤率</div>
                        <div className="mt-1 text-2xl font-bold text-blue-600">{viewPortrait.attendanceRate}%</div>
                      </div>
                      <div className="rounded-lg border bg-white p-4 text-center">
                        <div className="text-xs text-muted-foreground">学历徽章</div>
                        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          <Medal className="size-3" />{viewPortrait.diplomaBadge}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 3: 学生能力评价信息 */}
                <TabsContent value="ability" className="space-y-4">
                  {/* 岗位能力胜任力画像 */}
                  <div className="rounded-lg border bg-muted/30 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold flex items-center gap-2"><BarChart3 className="size-4 text-blue-600" />岗位能力胜任力画像</h3>
                      {getGradeBadge(viewPortrait.overallGrade)}
                    </div>
                    <div className="space-y-3">
                      {viewPortrait.domainScores.map((domain) => (
                        <div key={domain.domain} className="flex items-center gap-3">
                          <span className="w-24 text-sm text-muted-foreground">{domain.domainLabel}</span>
                          <Progress value={domain.score} className="h-2 flex-1" />
                          <span className="w-12 text-right text-sm font-medium">{domain.score}</span>
                          <Badge variant="outline" className="text-xs font-normal w-16 text-center">{domain.level}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 画像排名 */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg border bg-white p-4 text-center">
                      <div className="text-xs text-muted-foreground">班级排名</div>
                      <div className="mt-1 text-2xl font-bold text-emerald-600">{viewPortrait.classRank} <span className="text-sm font-normal text-muted-foreground">/ {viewPortrait.classTotal}</span></div>
                    </div>
                    <div className="rounded-lg border bg-white p-4 text-center">
                      <div className="text-xs text-muted-foreground">专业排名</div>
                      <div className="mt-1 text-2xl font-bold text-blue-600">{viewPortrait.majorRank} <span className="text-sm font-normal text-muted-foreground">/ {viewPortrait.majorTotal}</span></div>
                    </div>
                    <div className="rounded-lg border bg-white p-4 text-center">
                      <div className="text-xs text-muted-foreground">年级排名</div>
                      <div className="mt-1 text-2xl font-bold text-purple-600">{viewPortrait.yearRank} <span className="text-sm font-normal text-muted-foreground">/ {viewPortrait.yearTotal}</span></div>
                    </div>
                  </div>

                  {/* 综合评定 + 推荐 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border bg-muted/30 p-5">
                      <h3 className="mb-3 text-sm font-semibold flex items-center gap-2"><Star className="size-4 text-amber-600" />学历+能力综合评定</h3>
                      <div className="rounded-lg border bg-white p-4 text-center">
                        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-amber-100">
                          <Award className="size-6 text-amber-600" />
                        </div>
                        <div className="text-sm font-medium">{viewPortrait.dualBadge}</div>
                        <div className="mt-1 text-xs text-muted-foreground">综合等级：{viewPortrait.overallGrade} · 岗位：{viewPortrait.positionName}</div>
                      </div>
                    </div>
                    <div className="rounded-lg border bg-muted/30 p-5">
                      <h3 className="mb-3 text-sm font-semibold flex items-center gap-2"><Briefcase className="size-4 text-blue-600" />推荐就业岗位方向</h3>
                      <div className="space-y-2">
                        {viewPortrait.recommendPositions.map((rec, i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg border bg-white px-3 py-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="size-3.5 text-blue-500" />
                              <span className="text-sm">{rec.positionName}</span>
                            </div>
                            <Badge variant="default" className="text-xs bg-blue-500">{rec.matchRate}% 匹配</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 手动维护弹窗 */}
      <Dialog open={!!editPortrait} onOpenChange={(open) => !open && setEditPortrait(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>手动维护画像数据</DialogTitle></DialogHeader>
          {editPortrait && (
            <div className="space-y-4 py-4">
              <div className="text-sm text-muted-foreground">学生：{editPortrait.studentName}（{editPortrait.studentId}）</div>
              <div className="rounded-lg border p-3">
                <h4 className="mb-3 text-xs font-semibold text-muted-foreground">能力领域得分调整</h4>
                <div className="space-y-3">
                  {editDomains.map((domain, i) => (
                    <div key={domain.domain} className="flex items-center gap-3">
                      <span className="w-20 text-sm">{domain.domainLabel}</span>
                      <Input type="number" min={0} max={100} value={domain.score} onChange={(e) => { const next = [...editDomains]; next[i] = { ...next[i], score: Number(e.target.value) }; setEditDomains(next) }} className="w-24" />
                      <Progress value={domain.score} className="h-2 flex-1" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-2"><Label>调整原因 *</Label><Textarea value={editReason} onChange={(e) => setEditReason(e.target.value)} placeholder="请详细说明调整原因..." rows={3} /></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => { setEditPortrait(null); setEditReason('') }}>取消</Button><Button onClick={handleManualAdjust}><Pencil className="mr-2 size-4" />确认维护</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 频次配置弹窗 */}
      <Dialog open={configOpen} onOpenChange={(open) => !open && setConfigOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>画像更新与查询频次配置</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>画像自动更新周期</Label><Select value={portraitUpdateConfig.updateCycle} onValueChange={(v) => updatePortraitUpdateConfig({ updateCycle: v as 'realtime' | 'daily' | 'weekly' })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="realtime">实时更新</SelectItem><SelectItem value="daily">每日更新</SelectItem><SelectItem value="weekly">每周更新</SelectItem></SelectContent></Select></div>
            <div className="grid gap-2"><Label>学生端每日查询次数限制</Label><Input type="number" value={portraitUpdateConfig.queryLimit} onChange={(e) => updatePortraitUpdateConfig({ queryLimit: Number(e.target.value) })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>查询开放开始时间</Label><Input type="time" value={portraitUpdateConfig.queryTimeStart} onChange={(e) => updatePortraitUpdateConfig({ queryTimeStart: e.target.value })} /></div>
              <div className="grid gap-2"><Label>查询开放结束时间</Label><Input type="time" value={portraitUpdateConfig.queryTimeEnd} onChange={(e) => updatePortraitUpdateConfig({ queryTimeEnd: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setConfigOpen(false)}>关闭</Button><Button onClick={() => { toast({ title: '配置已保存' }); setConfigOpen(false) }}><Settings className="mr-2 size-4" />保存配置</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 画像对比分析弹窗 */}
      <Dialog open={compareOpen} onOpenChange={(open) => !open && setCompareOpen(false)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>学生能力画像对比分析</DialogTitle></DialogHeader>
          <div className="py-4">
            <div className="rounded-lg border p-4">
              <h4 className="mb-3 text-sm font-semibold">班级/专业/年级能力分布对比</h4>
              <div className="space-y-3">
                {['2021级全栈开发1班', '2021级后端开发1班', '2021级前端开发1班'].map((cls, i) => (
                  <div key={cls} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium"><span>{cls}</span><span>平均能力分：{[82, 78, 75][i]}</span></div>
                    <Progress value={[82, 78, 75][i]} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 rounded-lg border p-4">
              <h4 className="mb-3 text-sm font-semibold">能力领域横向对比</h4>
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {['行业认知', '专业知识', '专业技能', '通用能力', '职业素养'].map((label, i) => (
                  <div key={label} className="rounded-md bg-muted p-2">
                    <div className="font-medium">{label}</div>
                    <div className="mt-1 text-lg font-bold text-blue-600">{[78, 85, 80, 76, 82][i]}</div>
                    <div className="text-muted-foreground">班级均分</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setCompareOpen(false)}>关闭</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 就业推荐配置弹窗 */}
      <Dialog open={recommendOpen} onOpenChange={(open) => !open && setRecommendOpen(false)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>就业推荐配置</DialogTitle></DialogHeader>
          <div className="py-4">
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between text-sm"><span>AI匹配算法</span><Badge variant="outline">岗位胜任力模型匹配</Badge></div>
              <div className="flex items-center justify-between text-sm"><span>匹配权重-能力得分</span><span className="font-medium">60%</span></div>
              <div className="flex items-center justify-between text-sm"><span>匹配权重-学历评价</span><span className="font-medium">25%</span></div>
              <div className="flex items-center justify-between text-sm"><span>匹配权重-档案材料</span><span className="font-medium">15%</span></div>
              <div className="flex items-center gap-2 pt-2"><Switch defaultChecked /><Label>启用企业招聘人才筛选</Label></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setRecommendOpen(false)}>关闭</Button><Button onClick={() => { toast({ title: '推荐配置已保存' }); setRecommendOpen(false) }}><SlidersHorizontal className="mr-2 size-4" />保存配置</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 画像生成弹窗 */}
      <Dialog open={generateOpen} onOpenChange={(open) => !open && setGenerateOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>重新生成学生能力画像</DialogTitle></DialogHeader>
          <div className="py-4">
            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
              <div className="font-medium mb-1">画像生成引擎将执行以下操作：</div>
              <ul className="list-disc list-inside space-y-1 text-xs text-blue-700">
                <li>聚合课程任务完成情况数据</li>
                <li>聚合实践场景测评结果数据</li>
                <li>聚合毕设评价数据</li>
                <li>聚合档案材料审核数据</li>
                <li>重新计算各能力点得分和综合评级</li>
              </ul>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setGenerateOpen(false)}>取消</Button><Button onClick={handleGenerate}><RefreshCw className="mr-2 size-4" />确认重新生成</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Eye,
  GraduationCap,
  Layers,
  PenLine,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { studentSubmissions, students, scenarios } from "@/lib/scene-mock-data"
import type { StudentSubmission } from "@/lib/scene-mock-data"

interface StudentWithSubmission {
  studentId: string
  studentName: string
  studentNumber: string
  className: string
  enrollmentYear: number
  department: string
  submission: StudentSubmission
}

interface ClassGroup {
  className: string
  students: StudentWithSubmission[]
}

interface YearGroup {
  year: number
  classes: ClassGroup[]
}

export default function TaskStudentsPage() {
  const params = useParams()
  const scenarioId = params.scenarioId as string
  const taskId = params.taskId as string

  const scenario = useMemo(
    () => scenarios.find((s) => s.id === scenarioId),
    [scenarioId]
  )

  const taskName = useMemo(() => {
    const sub = studentSubmissions.find(
      (s) => s.scenarioId === scenarioId && s.taskId === taskId
    )
    return sub?.taskName || "未知任务"
  }, [scenarioId, taskId])

  const yearGroups = useMemo<YearGroup[]>(() => {
    const subs = studentSubmissions.filter(
      (s) => s.scenarioId === scenarioId && s.taskId === taskId
    )

    const studentWithSubs: StudentWithSubmission[] = subs
      .map((sub) => {
        const student = students.find((st) => st.id === sub.studentId)
        return {
          studentId: sub.studentId,
          studentName: student?.name || "未知学生",
          studentNumber: student?.studentNumber || "-",
          className: student?.class || "-",
          enrollmentYear: student?.enrollmentYear || 0,
          department: student?.department || "-",
          submission: sub,
        }
      })
      .filter((s) => s.enrollmentYear > 0)

    // Group by year -> class
    const yearMap = new Map<number, Map<string, StudentWithSubmission[]>>()

    for (const s of studentWithSubs) {
      if (!yearMap.has(s.enrollmentYear)) {
        yearMap.set(s.enrollmentYear, new Map())
      }
      const classMap = yearMap.get(s.enrollmentYear)!
      if (!classMap.has(s.className)) {
        classMap.set(s.className, [])
      }
      classMap.get(s.className)!.push(s)
    }

    const groups: YearGroup[] = []
    for (const [year, classMap] of yearMap) {
      const classes: ClassGroup[] = []
      for (const [className, classStudents] of classMap) {
        classes.push({ className, students: classStudents })
      }
      // Sort classes by name
      classes.sort((a, b) => a.className.localeCompare(b.className, "zh-CN"))
      groups.push({ year, classes })
    }

    // Sort years descending (newest first)
    groups.sort((a, b) => b.year - a.year)
    return groups
  }, [scenarioId, taskId])

  const totalPending = useMemo(
    () =>
      studentSubmissions.filter(
        (s) => s.scenarioId === scenarioId && s.taskId === taskId && s.status === "pending"
      ).length,
    [scenarioId, taskId]
  )

  const totalGraded = useMemo(
    () =>
      studentSubmissions.filter(
        (s) => s.scenarioId === scenarioId && s.taskId === taskId && s.status === "graded"
      ).length,
    [scenarioId, taskId]
  )

  if (!scenario) {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center">
        <Layers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700">场景不存在</h3>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/scene-task-results">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回场景列表
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb & Header */}
      <div className="space-y-4">
        <Button variant="ghost" size="sm" className="text-gray-500 -ml-2" asChild>
          <Link href={`/scene-task-results/scenario/${scenarioId}`}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            返回任务列表
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span>{scenario.name}</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-800 font-medium">{taskName}</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">学生提交列表</h1>
          <p className="text-sm text-gray-500 mt-1">
            按学生入学年份与班级分组，点击学生进行评分
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-2 text-sm">
          <PenLine className="h-4 w-4 text-amber-600" />
          <span className="text-amber-700 font-medium">{totalPending}</span>
          <span className="text-amber-600">待评分</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span className="text-green-700 font-medium">{totalGraded}</span>
          <span className="text-green-600">已评分</span>
        </div>
      </div>

      {/* Year Groups */}
      {yearGroups.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">暂无学生提交</h3>
            <p className="text-sm text-gray-500 mt-1">该任务下暂无有学生提交的记录</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href={`/scene-task-results/scenario/${scenarioId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回任务列表
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {yearGroups.map((yearGroup) => (
            <Card key={yearGroup.year} className="overflow-hidden">
              <CardHeader className="bg-slate-50/80 pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  {yearGroup.year} 届
                  <Badge variant="secondary" className="ml-1 text-xs font-normal">
                    {yearGroup.classes.reduce((sum, c) => sum + c.students.length, 0)} 人
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                {yearGroup.classes.map((classGroup) => (
                  <div key={classGroup.className}>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-3.5 w-3.5 text-gray-400" />
                      <h4 className="text-sm font-medium text-gray-700">
                        {classGroup.className}
                      </h4>
                      <Badge variant="outline" className="text-xs font-normal text-gray-400">
                        {classGroup.students.length} 人
                      </Badge>
                    </div>
                    <div className="rounded-lg border border-slate-200 divide-y divide-slate-100">
                      {classGroup.students.map((item) => (
                        <div
                          key={item.studentId}
                          className="flex items-center justify-between p-3 hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                              {item.studentName.charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-800 text-sm">
                                  {item.studentName}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {item.studentNumber}
                                </span>
                                {item.submission.status === "pending" ? (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-amber-50 text-amber-600 border-amber-200"
                                  >
                                    待评分
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-green-50 text-green-600 border-green-200"
                                  >
                                    已评分
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <ClipboardCheck className="h-3 w-3" />
                                  {item.submission.assessmentForm}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {item.submission.submittedAt}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/scene-task-results/${item.submission.id}`}>
                                <Eye className="mr-1 h-3 w-3" />
                                查看
                              </Link>
                            </Button>
                            {item.submission.status === "pending" ? (
                              <Button size="sm" asChild>
                                <Link href={`/scene-task-results/${item.submission.id}`}>
                                  <PenLine className="mr-1 h-3 w-3" />
                                  去评分
                                </Link>
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm" className="text-green-600" disabled>
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                已评分
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

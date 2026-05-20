"use client"

import { useMemo, useState, Suspense } from "react"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  FileText,
  GraduationCap,
  Layers,
  PenLine,
  Search,
  Users,
  Video,
  Library,
  LayoutList,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useData } from "@/components/providers/data-provider"

// ==================== 在线课堂 Tab ====================

function OnlineClassroomTab({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  const { onlineClassrooms } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(onlineClassrooms[0]?.id || null)

  const filteredClassrooms = useMemo(() => {
    if (!searchQuery.trim()) return onlineClassrooms
    const q = searchQuery.trim().toLowerCase()
    return onlineClassrooms.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.teacherName.toLowerCase().includes(q) ||
        c.students.some((s) => s.name.toLowerCase().includes(q) || s.studentNumber.toLowerCase().includes(q))
    )
  }, [onlineClassrooms, searchQuery])

  const selectedClassroom = useMemo(
    () => onlineClassrooms.find((c) => c.id === selectedClassroomId),
    [onlineClassrooms, selectedClassroomId]
  )

  return (
    <div className="h-full flex max-w-[1600px] mx-auto w-full">
      {/* Left sidebar */}
      <div className="w-72 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="flex gap-1.5">
            <button
              onClick={() => onTabChange("scene")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors border",
                activeTab === "scene"
                  ? "bg-primary/[0.06] text-primary border-primary/30"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              )}
            >
              <LayoutList className="h-3 w-3" />
              场景任务
            </button>
            <button
              onClick={() => onTabChange("online-classroom")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors border",
                activeTab === "online-classroom"
                  ? "bg-primary/[0.06] text-primary border-primary/30"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              )}
            >
              <Video className="h-3 w-3" />
              智慧课堂
            </button>
            <button
              onClick={() => onTabChange("smart-course")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors border",
                activeTab === "smart-course"
                  ? "bg-primary/[0.06] text-primary border-primary/30"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              )}
            >
              <Library className="h-3 w-3" />
              在线课程
            </button>
          </div>
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索课堂、学生..."
              className="pl-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredClassrooms.map((classroom) => (
            <button
              key={classroom.id}
              onClick={() => setSelectedClassroomId(classroom.id)}
              className={cn(
                "w-full text-left rounded-lg p-3 transition-all border",
                selectedClassroomId === classroom.id
                  ? "bg-primary/[0.04] border-primary/30 shadow-sm"
                  : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
              )}
            >
              <div className="flex items-start gap-2">
                <Video className={cn("h-4 w-4 mt-0.5 shrink-0", selectedClassroomId === classroom.id ? "text-primary" : "text-gray-400")} />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium truncate", selectedClassroomId === classroom.id ? "text-primary" : "text-gray-700")}>
                    {classroom.name}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{classroom.code}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {classroom.pendingCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium">
                        待评 {classroom.pendingCount}
                      </span>
                    )}
                    {classroom.gradedCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">
                        已评 {classroom.gradedCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 overflow-y-auto p-6">
        {selectedClassroom ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{selectedClassroom.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs font-normal">{selectedClassroom.category}</Badge>
                  <Badge variant="outline" className="text-xs font-normal text-gray-500">{selectedClassroom.code}</Badge>
                  <span className="text-xs text-gray-500">教师：{selectedClassroom.teacherName}</span>
                </div>
              </div>
            </div>

            <Card>
              <div className="divide-y divide-gray-100">
                {selectedClassroom.students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800 text-sm">{student.name}</span>
                          <span className="text-xs text-gray-400">{student.studentNumber}</span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px]",
                              student.status === "pending"
                                ? "bg-amber-50 text-amber-600 border-amber-200"
                                : "bg-green-50 text-green-600 border-green-200"
                            )}
                          >
                            {student.status === "pending" ? "待评分" : "已评分"}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {student.className} · {student.enrollmentYear}届
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {student.status === "graded" && student.score !== undefined && (
                        <span className="text-sm font-semibold text-gray-700">{student.score}分</span>
                      )}
                      <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                        <Link href="#">
                          <Eye className="mr-1 h-3 w-3" />查看
                        </Link>
                      </Button>
                      {student.status === "pending" ? (
                        <Button size="sm" className="h-7 text-xs" asChild>
                          <Link href="#">
                            <PenLine className="mr-1 h-3 w-3" />评分
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-green-600" disabled>
                          <CheckCircle2 className="mr-1 h-3 w-3" />已评分
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Video className="h-12 w-12 mb-3 opacity-50" />
            <p className="text-sm">请在左侧选择一个课堂</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== 智慧课程 Tab ====================

function SmartCourseTab({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  const { smartCourses } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(smartCourses[0]?.id || null)
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null)
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set(smartCourses[0]?.id ? [smartCourses[0].id] : []))

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return smartCourses
    const q = searchQuery.trim().toLowerCase()
    return smartCourses.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.chapters.some((ch) => ch.name.toLowerCase().includes(q)) ||
        c.students.some((s) => s.name.toLowerCase().includes(q) || s.studentNumber.toLowerCase().includes(q))
    )
  }, [smartCourses, searchQuery])

  const selectedCourse = useMemo(
    () => smartCourses.find((c) => c.id === selectedCourseId),
    [smartCourses, selectedCourseId]
  )

  const selectedChapter = useMemo(
    () => selectedCourse?.chapters.find((ch) => ch.id === selectedChapterId),
    [selectedCourse, selectedChapterId]
  )

  const toggleCourse = (courseId: string) => {
    setExpandedCourses((prev) => {
      const next = new Set(prev)
      if (next.has(courseId)) next.delete(courseId)
      else next.add(courseId)
      return next
    })
  }

  // 为演示简单处理：选中课程后显示所有学生，按章节状态聚合
  // 实际场景中可能需要更复杂的数据关联
  const displayedStudents = useMemo(() => {
    if (!selectedChapter && !selectedCourse) return []
    // 如果选中了章节，过滤出该章节相关学生（mock 数据中简化处理，显示课程下所有学生）
    return selectedCourse?.students || []
  }, [selectedCourse, selectedChapter])

  return (
    <div className="h-full flex max-w-[1600px] mx-auto w-full">
      {/* Left sidebar */}
      <div className="w-72 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="flex gap-1.5">
            <button
              onClick={() => onTabChange("scene")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors border",
                activeTab === "scene"
                  ? "bg-primary/[0.06] text-primary border-primary/30"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              )}
            >
              <LayoutList className="h-3 w-3" />
              场景任务
            </button>
            <button
              onClick={() => onTabChange("online-classroom")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors border",
                activeTab === "online-classroom"
                  ? "bg-primary/[0.06] text-primary border-primary/30"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              )}
            >
              <Video className="h-3 w-3" />
              智慧课堂
            </button>
            <button
              onClick={() => onTabChange("smart-course")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors border",
                activeTab === "smart-course"
                  ? "bg-primary/[0.06] text-primary border-primary/30"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              )}
            >
              <Library className="h-3 w-3" />
              在线课程
            </button>
          </div>
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索课程、章节、学生..."
              className="pl-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredCourses.map((course) => {
            const isExpanded = expandedCourses.has(course.id)
            return (
              <div key={course.id}>
                <button
                  onClick={() => {
                    setSelectedCourseId(course.id)
                    toggleCourse(course.id)
                  }}
                  className={cn(
                    "w-full text-left rounded-lg p-2.5 transition-all border flex items-center gap-2",
                    selectedCourseId === course.id && !selectedChapterId
                      ? "bg-primary/[0.04] border-primary/30 shadow-sm"
                      : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
                  )}
                >
                  <Library className={cn("h-4 w-4 shrink-0", selectedCourseId === course.id ? "text-primary" : "text-gray-400")} />
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium truncate", selectedCourseId === course.id ? "text-primary" : "text-gray-700")}>
                      {course.name}
                    </p>
                    <p className="text-[11px] text-gray-400">{course.code}</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="mt-1 ml-4 space-y-1">
                    {course.chapters.map((chapter) => (
                      <button
                        key={chapter.id}
                        onClick={() => setSelectedChapterId(chapter.id)}
                        className={cn(
                          "w-full text-left rounded-md px-3 py-2 text-xs transition-all border-l-2",
                          selectedChapterId === chapter.id
                            ? "bg-primary/[0.04] border-l-primary text-primary font-medium"
                            : "border-l-gray-200 text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{chapter.name}</span>
                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            {chapter.pendingCount > 0 && (
                              <span className="text-[10px] px-1 py-0.5 rounded bg-amber-50 text-amber-600">
                                {chapter.pendingCount}
                              </span>
                            )}
                            {chapter.gradedCount > 0 && (
                              <span className="text-[10px] px-1 py-0.5 rounded bg-green-50 text-green-600">
                                {chapter.gradedCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 overflow-y-auto p-6">
        {selectedCourse ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {selectedCourse.name}
                  {selectedChapter && <span className="text-gray-500 font-normal"> · {selectedChapter.name}</span>}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs font-normal">{selectedCourse.category}</Badge>
                  <Badge variant="outline" className="text-xs font-normal text-gray-500">{selectedCourse.code}</Badge>
                  <span className="text-xs text-gray-500">教师：{selectedCourse.teacherName}</span>
                </div>
              </div>
            </div>

            <Card>
              <div className="divide-y divide-gray-100">
                {displayedStudents.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-sm">暂无学生记录</div>
                ) : (
                  displayedStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-3 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800 text-sm">{student.name}</span>
                            <span className="text-xs text-gray-400">{student.studentNumber}</span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px]",
                                student.status === "pending"
                                  ? "bg-amber-50 text-amber-600 border-amber-200"
                                  : "bg-green-50 text-green-600 border-green-200"
                              )}
                            >
                              {student.status === "pending" ? "待评分" : "已评分"}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {student.className} · {student.enrollmentYear}届
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {student.status === "graded" && student.score !== undefined && (
                          <span className="text-sm font-semibold text-gray-700">{student.score}分</span>
                        )}
                        <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                          <Link href="#">
                            <Eye className="mr-1 h-3 w-3" />查看
                          </Link>
                        </Button>
                        {student.status === "pending" ? (
                          <Button size="sm" className="h-7 text-xs" asChild>
                            <Link href="#">
                              <PenLine className="mr-1 h-3 w-3" />评分
                            </Link>
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-green-600" disabled>
                            <CheckCircle2 className="mr-1 h-3 w-3" />已评分
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Library className="h-12 w-12 mb-3 opacity-50" />
            <p className="text-sm">请在左侧选择一个课程</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== 场景任务 Tab（从 zhiyu-scene /approvals/grading 迁移）====================

interface TaskStudent {
  studentId: string
  studentName: string
  studentNumber: string
  className: string
  enrollmentYear: number
  submission: { id: string; status: "pending" | "graded"; submittedAt: string; assessmentForm: string }
}

interface TaskFormGroup {
  assessmentForm: string
  students: TaskStudent[]
  pendingCount: number
  gradedCount: number
}

interface TaskGroup {
  taskId: string
  taskName: string
  taskType: string
  forms: TaskFormGroup[]
}

interface ScenarioItem {
  scenarioId: string
  scenarioName: string
  scenarioCode: string
  taskCount: number
  pendingCount: number
  gradedCount: number
  studentCount: number
  taskNames: string[]
  studentNames: string[]
}

interface ScenarioGroup {
  positionName: string
  scenarios: ScenarioItem[]
}

function SceneTaskTab({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
  const { sceneGradingScenarios, sceneGradingStudents, sceneGradingSubmissions } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(sceneGradingScenarios[0]?.id || null)
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())

  const scenarioGroups = useMemo<ScenarioGroup[]>(() => {
    const map = new Map<string, ScenarioGroup>()

    for (const scenario of sceneGradingScenarios) {
      const subs = sceneGradingSubmissions.filter((s) => s.scenarioId === scenario.id)
      const pending = subs.filter((s) => s.status === "pending").length
      const graded = subs.filter((s) => s.status === "graded").length
      const studentIds = new Set(subs.map((s) => s.studentId))
      const taskIds = new Set(subs.map((s) => s.taskId))

      // Collect task names and student names for search
      const taskNames = Array.from(new Set(subs.map((s) => s.taskName)))
      const studentNames = Array.from(
        new Set(
          subs.map((s) => {
            const stu = sceneGradingStudents.find((st) => st.id === s.studentId)
            return stu?.name || ""
          }).filter(Boolean)
        )
      )

      const item: ScenarioItem = {
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        scenarioCode: scenario.code,
        taskCount: taskIds.size,
        pendingCount: pending,
        gradedCount: graded,
        studentCount: studentIds.size,
        taskNames,
        studentNames,
      }

      const pos = scenario.positionName || "未分类"
      if (!map.has(pos)) {
        map.set(pos, { positionName: pos, scenarios: [] })
      }
      map.get(pos)!.scenarios.push(item)
    }

    return Array.from(map.values())
  }, [sceneGradingScenarios, sceneGradingSubmissions, sceneGradingStudents])

  // Extended search: scenario name, scenario code, task name, student name
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return scenarioGroups
    const q = searchQuery.trim().toLowerCase()

    return scenarioGroups
      .map((g) => ({
        ...g,
        scenarios: g.scenarios.filter((s) => {
          const matchScenario =
            s.scenarioName.toLowerCase().includes(q) || s.scenarioCode.toLowerCase().includes(q)
          const matchTask = s.taskNames.some((t) => t.toLowerCase().includes(q))
          const matchStudent = s.studentNames.some((name) => name.toLowerCase().includes(q))
          return matchScenario || matchTask || matchStudent
        }),
      }))
      .filter((g) => g.scenarios.length > 0)
  }, [scenarioGroups, searchQuery])

  const selectedScenario = useMemo(
    () => sceneGradingScenarios.find((s) => s.id === selectedScenarioId),
    [sceneGradingScenarios, selectedScenarioId]
  )

  const taskGroups = useMemo<TaskGroup[]>(() => {
    if (!selectedScenarioId) return []
    const scenarioSubs = sceneGradingSubmissions.filter((s) => s.scenarioId === selectedScenarioId)
    const scenario = sceneGradingScenarios.find((s) => s.id === selectedScenarioId)
    const taskMap = new Map<string, TaskGroup>()

    for (const sub of scenarioSubs) {
      const existing = taskMap.get(sub.taskId)
      const student = sceneGradingStudents.find((st) => st.id === sub.studentId)
      const taskStudent: TaskStudent = {
        studentId: sub.studentId,
        studentName: student?.name || "未知学生",
        studentNumber: student?.studentNumber || "-",
        className: student?.class || "-",
        enrollmentYear: student?.enrollmentYear || 0,
        submission: {
          id: sub.id,
          status: sub.status,
          submittedAt: sub.submittedAt,
          assessmentForm: sub.assessmentForm,
        },
      }

      if (existing) {
        const form = existing.forms.find((f) => f.assessmentForm === sub.assessmentForm)
        if (form) {
          form.students.push(taskStudent)
          form.pendingCount += sub.status === "pending" ? 1 : 0
          form.gradedCount += sub.status === "graded" ? 1 : 0
        } else {
          existing.forms.push({
            assessmentForm: sub.assessmentForm,
            students: [taskStudent],
            pendingCount: sub.status === "pending" ? 1 : 0,
            gradedCount: sub.status === "graded" ? 1 : 0,
          })
        }
      } else {
        const taskInfo = scenario?.tasks.find((t) => t.id === sub.taskId)
        taskMap.set(sub.taskId, {
          taskId: sub.taskId,
          taskName: sub.taskName,
          taskType: taskInfo?.taskType === "assessment" ? "考核" : "训练",
          forms: [{
            assessmentForm: sub.assessmentForm,
            students: [taskStudent],
            pendingCount: sub.status === "pending" ? 1 : 0,
            gradedCount: sub.status === "graded" ? 1 : 0,
          }],
        })
      }
    }

    return Array.from(taskMap.values())
  }, [selectedScenarioId, sceneGradingSubmissions, sceneGradingScenarios, sceneGradingStudents])

  const toggleTask = (taskId: string) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev)
      if (next.has(taskId)) next.delete(taskId)
      else next.add(taskId)
      return next
    })
  }

  const groupStudents = (students: TaskStudent[]) => {
    const yearMap = new Map<number, Map<string, TaskStudent[]>>()
    for (const s of students) {
      if (!yearMap.has(s.enrollmentYear)) yearMap.set(s.enrollmentYear, new Map())
      const classMap = yearMap.get(s.enrollmentYear)!
      if (!classMap.has(s.className)) classMap.set(s.className, [])
      classMap.get(s.className)!.push(s)
    }
    const groups: { year: number; classes: { className: string; students: TaskStudent[] }[] }[] = []
    for (const [year, classMap] of yearMap) {
      const classes: { className: string; students: TaskStudent[] }[] = []
      for (const [className, classStudents] of classMap) {
        classes.push({ className, students: classStudents })
      }
      classes.sort((a, b) => a.className.localeCompare(b.className, "zh-CN"))
      groups.push({ year, classes })
    }
    groups.sort((a, b) => b.year - a.year)
    return groups
  }

  function TaskFormTabs({ task }: { task: TaskGroup }) {
    const [activeForm, setActiveForm] = useState(task.forms[0]?.assessmentForm || "")
    const activeFormData = task.forms.find((f) => f.assessmentForm === activeForm)
    const yearGroups = activeFormData ? groupStudents(activeFormData.students) : []

    return (
      <div className="px-4 pb-4 border-t border-gray-100">
        {task.forms.length > 1 && (
          <div className="flex items-center gap-2 pt-3 mb-3">
            {task.forms.map((form) => (
              <button
                key={form.assessmentForm}
                onClick={() => setActiveForm(form.assessmentForm)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  activeForm === form.assessmentForm
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"
                )}
              >
                {form.assessmentForm}
                <span className="text-[10px] opacity-70">({form.students.length})</span>
              </button>
            ))}
          </div>
        )}
        {activeFormData && activeFormData.students.length === 0 ? (
          <div className="py-6 text-center text-gray-400 text-sm">暂无学生提交记录</div>
        ) : (
          <div className="space-y-4">
            {yearGroups.map((yearGroup) => (
              <div key={yearGroup.year}>
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-xs font-medium text-gray-600">{yearGroup.year} 届</span>
                  <Badge variant="outline" className="text-[10px] font-normal text-gray-400">
                    {yearGroup.classes.reduce((s, c) => s + c.students.length, 0)} 人
                  </Badge>
                </div>
                <div className="space-y-3">
                  {yearGroup.classes.map((classGroup) => (
                    <div key={classGroup.className}>
                      <div className="flex items-center gap-1.5 mb-1.5 px-1">
                        <Users className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{classGroup.className}</span>
                        <span className="text-[10px] text-gray-400">({classGroup.students.length} 人)</span>
                      </div>
                      <div className="rounded-lg border border-slate-200 divide-y divide-slate-100">
                        {classGroup.students.map((item) => (
                          <div
                            key={item.studentId}
                            className="flex items-center justify-between p-2.5 hover:bg-slate-50/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                                {item.studentName.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-800 text-sm">{item.studentName}</span>
                                  <span className="text-xs text-gray-400">{item.studentNumber}</span>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-[10px]",
                                      item.submission.status === "pending"
                                        ? "bg-amber-50 text-amber-600 border-amber-200"
                                        : "bg-green-50 text-green-600 border-green-200"
                                    )}
                                  >
                                    {item.submission.status === "pending" ? "待评分" : "已评分"}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  {item.submission.submittedAt}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                                <Link href={`/scene-task-results/${item.submission.id}`}>
                                  <Eye className="mr-1 h-3 w-3" />查看
                                </Link>
                              </Button>
                              {item.submission.status === "pending" ? (
                                <Button size="sm" className="h-7 text-xs" asChild>
                                  <Link href={`/scene-task-results/${item.submission.id}`}>
                                    <PenLine className="mr-1 h-3 w-3" />评分
                                  </Link>
                                </Button>
                              ) : (
                                <Button variant="ghost" size="sm" className="h-7 text-xs text-green-600" disabled>
                                  <CheckCircle2 className="mr-1 h-3 w-3" />已评分
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-full flex max-w-[1600px] mx-auto w-full">
      {/* Left sidebar — Scenario tree */}
      <div className="w-72 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="flex gap-1.5">
            <button
              onClick={() => onTabChange("scene")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors border",
                activeTab === "scene"
                  ? "bg-primary/[0.06] text-primary border-primary/30"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              )}
            >
              <LayoutList className="h-3 w-3" />
              场景任务
            </button>
            <button
              onClick={() => onTabChange("online-classroom")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors border",
                activeTab === "online-classroom"
                  ? "bg-primary/[0.06] text-primary border-primary/30"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              )}
            >
              <Video className="h-3 w-3" />
              智慧课堂
            </button>
            <button
              onClick={() => onTabChange("smart-course")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors border",
                activeTab === "smart-course"
                  ? "bg-primary/[0.06] text-primary border-primary/30"
                  : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
              )}
            >
              <Library className="h-3 w-3" />
              在线课程
            </button>
          </div>
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索场景、任务、学生..."
              className="pl-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {filteredGroups.map((group) => (
            <div key={group.positionName}>
              <div className="flex items-center gap-1.5 px-2 mb-2">
                <Layers className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs font-semibold text-gray-600">{group.positionName}</span>
                <span className="text-[10px] text-gray-400">({group.scenarios.length})</span>
              </div>
              <div className="space-y-1">
                {group.scenarios.map((scenario) => (
                  <button
                    key={scenario.scenarioId}
                    onClick={() => setSelectedScenarioId(scenario.scenarioId)}
                    className={cn(
                      "w-full text-left rounded-lg p-2.5 transition-all border",
                      selectedScenarioId === scenario.scenarioId
                        ? "bg-primary/[0.04] border-primary/30 shadow-sm"
                        : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <BookOpen
                        className={cn(
                          "h-4 w-4 mt-0.5 shrink-0",
                          selectedScenarioId === scenario.scenarioId ? "text-primary" : "text-gray-400"
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm font-medium truncate",
                            selectedScenarioId === scenario.scenarioId ? "text-primary" : "text-gray-700"
                          )}
                        >
                          {scenario.scenarioName}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{scenario.scenarioCode}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          {scenario.pendingCount > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium">
                              待评 {scenario.pendingCount}
                            </span>
                          )}
                          {scenario.gradedCount > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">
                              已评 {scenario.gradedCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right content — Task list with students */}
      <div className="flex-1 overflow-y-auto p-6">
        {selectedScenario ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{selectedScenario.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs font-normal">
                    {selectedScenario.positionName}
                  </Badge>
                  <Badge variant="outline" className="text-xs font-normal text-gray-500">
                    {selectedScenario.code}
                  </Badge>
                </div>
              </div>
            </div>

            {taskGroups.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-400">
                  <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">该场景下暂无学生提交的任务</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {taskGroups.map((task) => {
                  const isExpanded = expandedTasks.has(task.taskId)
                  const totalStudents = task.forms.reduce((s, f) => s + f.students.length, 0)
                  const totalPending = task.forms.reduce((s, f) => s + f.pendingCount, 0)
                  const totalGraded = task.forms.reduce((s, f) => s + f.gradedCount, 0)

                  return (
                    <Collapsible key={task.taskId} open={isExpanded} onOpenChange={() => toggleTask(task.taskId)}>
                      <Card className="overflow-hidden">
                        <CollapsibleTrigger asChild>
                          <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                                <FileText className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold text-gray-800">{task.taskName}</p>
                                  {task.forms.map((f) => (
                                    <Badge key={f.assessmentForm} variant="outline" className="text-[10px] font-normal">
                                      {f.assessmentForm}
                                    </Badge>
                                  ))}
                                  <Badge variant="secondary" className="text-[10px] font-normal">
                                    {task.taskType}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs text-gray-500">{totalStudents} 位学生</span>
                                  {totalPending > 0 && (
                                    <span className="text-xs text-amber-600 font-medium">待评分 {totalPending}</span>
                                  )}
                                  {totalGraded > 0 && (
                                    <span className="text-xs text-green-600 font-medium">已评分 {totalGraded}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <TaskFormTabs task={task} />
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <BookOpen className="h-12 w-12 mb-3 opacity-50" />
            <p className="text-sm">请在左侧选择一个场景</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== Main Page ====================

function SceneTaskResultsContent() {
  const [activeTab, setActiveTab] = useState("scene")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[calc(100vh-3.5rem)] flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 shrink-0">
        <div className="max-w-[1600px] mx-auto w-full">
          <h1 className="text-xl font-semibold text-gray-800">测评结果管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">查看场景任务、智慧课堂、在线课程的测评结果并进行评分</p>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <TabsContent value="online-classroom" className="h-full mt-0">
          <OnlineClassroomTab activeTab={activeTab} onTabChange={setActiveTab} />
        </TabsContent>
        <TabsContent value="scene" className="h-full mt-0">
          <SceneTaskTab activeTab={activeTab} onTabChange={setActiveTab} />
        </TabsContent>
        <TabsContent value="smart-course" className="h-full mt-0">
          <SmartCourseTab activeTab={activeTab} onTabChange={setActiveTab} />
        </TabsContent>
      </div>
    </Tabs>
  )
}

export default function SceneTaskResultsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-muted-foreground">加载中...</div>}>
      <SceneTaskResultsContent />
    </Suspense>
  )
}

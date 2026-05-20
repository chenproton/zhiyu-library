"use client"

import { useMemo, useState, Suspense } from "react"
import Link from "next/link"
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  FileText,
  PenLine,
  Search,
  Video,
  Library,
  BookOpen,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useData } from "@/components/providers/data-provider"

// ==================== Shared Status Filter ====================

function StatusFilterTabs({
  value,
  onChange,
  allCount,
  pendingCount,
  gradedCount,
}: {
  value: "all" | "pending" | "graded"
  onChange: (v: "all" | "pending" | "graded") => void
  allCount: number
  pendingCount: number
  gradedCount: number
}) {
  const tabs = [
    { key: "all" as const, label: "全部", count: allCount },
    { key: "pending" as const, label: "待评分", count: pendingCount },
    { key: "graded" as const, label: "已评分", count: gradedCount },
  ]
  return (
    <div className="flex gap-1.5 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
            value === tab.key
              ? "bg-primary/10 text-primary border-primary/30"
              : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
          )}
        >
          {tab.label}
          <span className="ml-1 text-[10px] opacity-70">({tab.count})</span>
        </button>
      ))}
    </div>
  )
}

// ==================== Student List Item ====================

function StudentListItem({
  student,
  linkPrefix = "#",
}: {
  student: {
    id: string
    name: string
    studentNumber: string
    className: string
    enrollmentYear: number
    status: "pending" | "graded"
    score?: number
    submittedAt?: string
  }
  linkPrefix?: string
}) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-slate-50/50 transition-colors">
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
          <Link href={linkPrefix === "#" ? "#" : `${linkPrefix}/${student.id}`}>
            <Eye className="mr-1 h-3 w-3" />
            查看
          </Link>
        </Button>
        {student.status === "pending" ? (
          <Button size="sm" className="h-7 text-xs" asChild>
            <Link href={linkPrefix === "#" ? "#" : `${linkPrefix}/${student.id}`}>
              <PenLine className="mr-1 h-3 w-3" />
              评分
            </Link>
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="h-7 text-xs text-green-600" disabled>
            <CheckCircle2 className="mr-1 h-3 w-3" />
            已评分
          </Button>
        )}
      </div>
    </div>
  )
}

// ==================== Online Classroom Tab ====================

function OnlineClassroomTab() {
  const { onlineClassrooms } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(
    onlineClassrooms[0]?.id || null
  )
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "graded">("all")

  const filteredClassrooms = useMemo(() => {
    if (!searchQuery.trim()) return onlineClassrooms
    const q = searchQuery.trim().toLowerCase()
    return onlineClassrooms.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.teacherName.toLowerCase().includes(q) ||
        c.students.some(
          (s) =>
            s.name.toLowerCase().includes(q) || s.studentNumber.toLowerCase().includes(q)
        )
    )
  }, [onlineClassrooms, searchQuery])

  const selectedClassroom = useMemo(
    () => onlineClassrooms.find((c) => c.id === selectedClassroomId),
    [onlineClassrooms, selectedClassroomId]
  )

  const displayedStudents = useMemo(() => {
    if (!selectedClassroom) return []
    if (statusFilter === "all") return selectedClassroom.students
    return selectedClassroom.students.filter((s) => s.status === statusFilter)
  }, [selectedClassroom, statusFilter])

  const statusCounts = useMemo(() => {
    if (!selectedClassroom) return { all: 0, pending: 0, graded: 0 }
    return {
      all: selectedClassroom.students.length,
      pending: selectedClassroom.students.filter((s) => s.status === "pending").length,
      graded: selectedClassroom.students.filter((s) => s.status === "graded").length,
    }
  }, [selectedClassroom])

  return (
    <div className="h-full flex max-w-[1600px] mx-auto w-full">
      {/* Left sidebar */}
      <div className="w-72 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100 space-y-3">
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
                <Video
                  className={cn(
                    "h-4 w-4 mt-0.5 shrink-0",
                    selectedClassroomId === classroom.id ? "text-primary" : "text-gray-400"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium truncate",
                      selectedClassroomId === classroom.id ? "text-primary" : "text-gray-700"
                    )}
                  >
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
                  <Badge variant="secondary" className="text-xs font-normal">
                    {selectedClassroom.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs font-normal text-gray-500">
                    {selectedClassroom.code}
                  </Badge>
                  <span className="text-xs text-gray-500">教师：{selectedClassroom.teacherName}</span>
                </div>
              </div>
            </div>

            <StatusFilterTabs
              value={statusFilter}
              onChange={setStatusFilter}
              allCount={statusCounts.all}
              pendingCount={statusCounts.pending}
              gradedCount={statusCounts.graded}
            />

            <Card>
              <div className="divide-y divide-gray-100">
                {displayedStudents.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-sm">暂无学生记录</div>
                ) : (
                  displayedStudents.map((student) => (
                    <StudentListItem key={student.id} student={student} />
                  ))
                )}
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

// ==================== Smart Course Tab ====================

function SmartCourseTab() {
  const { smartCourses } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    smartCourses[0]?.id || null
  )
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null)
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(
    new Set(smartCourses[0]?.id ? [smartCourses[0].id] : [])
  )
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "graded">("all")

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return smartCourses
    const q = searchQuery.trim().toLowerCase()
    return smartCourses.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.chapters.some((ch) => ch.name.toLowerCase().includes(q)) ||
        c.students.some(
          (s) =>
            s.name.toLowerCase().includes(q) || s.studentNumber.toLowerCase().includes(q)
        )
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

  const displayedStudents = useMemo(() => {
    if (!selectedCourse) return []
    const students = selectedCourse.students
    if (statusFilter === "all") return students
    return students.filter((s) => s.status === statusFilter)
  }, [selectedCourse, statusFilter])

  const statusCounts = useMemo(() => {
    if (!selectedCourse) return { all: 0, pending: 0, graded: 0 }
    return {
      all: selectedCourse.students.length,
      pending: selectedCourse.students.filter((s) => s.status === "pending").length,
      graded: selectedCourse.students.filter((s) => s.status === "graded").length,
    }
  }, [selectedCourse])

  const toggleCourse = (courseId: string) => {
    setExpandedCourses((prev) => {
      const next = new Set(prev)
      if (next.has(courseId)) next.delete(courseId)
      else next.add(courseId)
      return next
    })
  }

  return (
    <div className="h-full flex max-w-[1600px] mx-auto w-full">
      {/* Left sidebar */}
      <div className="w-72 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100 space-y-3">
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
                  <Library
                    className={cn(
                      "h-4 w-4 shrink-0",
                      selectedCourseId === course.id ? "text-primary" : "text-gray-400"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        selectedCourseId === course.id ? "text-primary" : "text-gray-700"
                      )}
                    >
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
                  {selectedChapter && (
                    <span className="text-gray-500 font-normal"> · {selectedChapter.name}</span>
                  )}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs font-normal">
                    {selectedCourse.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs font-normal text-gray-500">
                    {selectedCourse.code}
                  </Badge>
                  <span className="text-xs text-gray-500">教师：{selectedCourse.teacherName}</span>
                </div>
              </div>
            </div>

            <StatusFilterTabs
              value={statusFilter}
              onChange={setStatusFilter}
              allCount={statusCounts.all}
              pendingCount={statusCounts.pending}
              gradedCount={statusCounts.graded}
            />

            <Card>
              <div className="divide-y divide-gray-100">
                {displayedStudents.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-sm">暂无学生记录</div>
                ) : (
                  displayedStudents.map((student) => (
                    <StudentListItem key={student.id} student={student} />
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

// ==================== Scene Task Tab ====================

interface TaskNode {
  taskId: string
  taskName: string
  taskType: string
  assessmentForm?: string
  pendingCount: number
  gradedCount: number
  studentCount: number
}

interface SceneNode {
  scenarioId: string
  scenarioName: string
  scenarioCode: string
  tasks: TaskNode[]
}

interface TaskStudentItem {
  submissionId: string
  studentId: string
  studentName: string
  studentNumber: string
  className: string
  enrollmentYear: number
  status: "pending" | "graded"
  submittedAt: string
  assessmentForm: string
  method: string
  score?: number
}

const METHODS = ["全部", "试卷", "题库", "评审", "现场问答"] as const
type MethodType = (typeof METHODS)[number]

function SceneTaskTab() {
  const { sceneGradingScenarios, sceneGradingSubmissions, sceneGradingStudents } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(
    sceneGradingScenarios[0]?.id || null
  )
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [expandedScenarios, setExpandedScenarios] = useState<Set<string>>(
    new Set(sceneGradingScenarios[0]?.id ? [sceneGradingScenarios[0].id] : [])
  )
  const [methodFilter, setMethodFilter] = useState<MethodType>("全部")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "graded">("all")

  // Build scene + task tree
  const sceneTree = useMemo<SceneNode[]>(() => {
    return sceneGradingScenarios.map((scenario) => {
      const tasks = scenario.tasks.map((task) => {
        const subs = sceneGradingSubmissions.filter(
          (s) => s.scenarioId === scenario.id && s.taskId === task.id
        )
        return {
          taskId: task.id,
          taskName: task.name,
          taskType: task.taskType === "assessment" ? "考核" : "训练",
          assessmentForm: task.assessmentForm,
          pendingCount: subs.filter((s) => s.status === "pending").length,
          gradedCount: subs.filter((s) => s.status === "graded").length,
          studentCount: subs.length,
        }
      })
      return {
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        scenarioCode: scenario.code,
        tasks,
      }
    })
  }, [sceneGradingScenarios, sceneGradingSubmissions])

  // Filter by search
  const filteredTree = useMemo(() => {
    if (!searchQuery.trim()) return sceneTree
    const q = searchQuery.trim().toLowerCase()
    return sceneTree
      .map((node) => ({
        ...node,
        tasks: node.tasks.filter(
          (t) =>
            t.taskName.toLowerCase().includes(q) ||
            (t.assessmentForm && t.assessmentForm.toLowerCase().includes(q))
        ),
      }))
      .filter(
        (node) =>
          node.scenarioName.toLowerCase().includes(q) ||
          node.scenarioCode.toLowerCase().includes(q) ||
          node.tasks.length > 0
      )
  }, [sceneTree, searchQuery])

  // Auto-expand scenario when selected
  const toggleScenario = (scenarioId: string) => {
    setExpandedScenarios((prev) => {
      const next = new Set(prev)
      if (next.has(scenarioId)) next.delete(scenarioId)
      else next.add(scenarioId)
      return next
    })
  }

  // All submissions for selected task (before method filter)
  const selectedTaskAllSubmissions = useMemo(() => {
    if (!selectedScenarioId || !selectedTaskId) return []
    return sceneGradingSubmissions.filter(
      (s) => s.scenarioId === selectedScenarioId && s.taskId === selectedTaskId
    )
  }, [selectedScenarioId, selectedTaskId, sceneGradingSubmissions])

  // Selected task students (after both filters)
  const selectedTaskStudents = useMemo<TaskStudentItem[]>(() => {
    if (!selectedScenarioId || !selectedTaskId) return []
    let subs = selectedTaskAllSubmissions
    if (methodFilter !== "全部") {
      subs = subs.filter((s) => s.method === methodFilter)
    }
    if (statusFilter !== "all") {
      subs = subs.filter((s) => s.status === statusFilter)
    }
    return subs.map((sub) => {
      const student = sceneGradingStudents.find((st) => st.id === sub.studentId)
      return {
        submissionId: sub.id,
        studentId: sub.studentId,
        studentName: student?.name || "未知学生",
        studentNumber: student?.studentNumber || "-",
        className: student?.class || "-",
        enrollmentYear: student?.enrollmentYear || 0,
        status: sub.status,
        submittedAt: sub.submittedAt,
        assessmentForm: sub.assessmentForm,
        method: sub.method,
        score: (sub as any).score,
      }
    })
  }, [
    selectedScenarioId,
    selectedTaskId,
    selectedTaskAllSubmissions,
    sceneGradingStudents,
    methodFilter,
    statusFilter,
  ])

  // Status counts under current method filter
  const statusCounts = useMemo(() => {
    if (!selectedScenarioId || !selectedTaskId) return { all: 0, pending: 0, graded: 0 }
    let all = selectedTaskAllSubmissions
    if (methodFilter !== "全部") {
      all = all.filter((s) => s.method === methodFilter)
    }
    return {
      all: all.length,
      pending: all.filter((s) => s.status === "pending").length,
      graded: all.filter((s) => s.status === "graded").length,
    }
  }, [selectedScenarioId, selectedTaskId, selectedTaskAllSubmissions, methodFilter])

  // Method counts for selected task
  const methodCounts = useMemo(() => {
    if (!selectedScenarioId || !selectedTaskId) return {} as Record<string, number>
    const counts: Record<string, number> = {}
    METHODS.forEach((m) => {
      if (m === "全部") {
        counts[m] = selectedTaskAllSubmissions.length
      } else {
        counts[m] = selectedTaskAllSubmissions.filter((s) => s.method === m).length
      }
    })
    return counts
  }, [selectedScenarioId, selectedTaskId, selectedTaskAllSubmissions])

  const selectedScenario = useMemo(
    () => sceneGradingScenarios.find((s) => s.id === selectedScenarioId),
    [sceneGradingScenarios, selectedScenarioId]
  )

  const selectedTask = useMemo(() => {
    if (!selectedScenario) return null
    return selectedScenario.tasks.find((t) => t.id === selectedTaskId)
  }, [selectedScenario, selectedTaskId])

  return (
    <div className="h-full flex max-w-[1600px] mx-auto w-full">
      {/* Left sidebar — Scene + Task tree */}
      <div className="w-72 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100 space-y-3">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索场景、任务..."
              className="pl-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredTree.map((node) => {
            const isExpanded = expandedScenarios.has(node.scenarioId)
            return (
              <div key={node.scenarioId}>
                <button
                  onClick={() => {
                    setSelectedScenarioId(node.scenarioId)
                    toggleScenario(node.scenarioId)
                  }}
                  className={cn(
                    "w-full text-left rounded-lg p-2.5 transition-all border flex items-center gap-2",
                    selectedScenarioId === node.scenarioId && !selectedTaskId
                      ? "bg-primary/[0.04] border-primary/30 shadow-sm"
                      : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-200"
                  )}
                >
                  <BookOpen
                    className={cn(
                      "h-4 w-4 shrink-0",
                      selectedScenarioId === node.scenarioId ? "text-primary" : "text-gray-400"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        selectedScenarioId === node.scenarioId ? "text-primary" : "text-gray-700"
                      )}
                    >
                      {node.scenarioName}
                    </p>
                    <p className="text-[11px] text-gray-400">{node.scenarioCode}</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="mt-1 ml-4 space-y-1">
                    {node.tasks.map((task) => (
                      <button
                        key={task.taskId}
                        onClick={() => setSelectedTaskId(task.taskId)}
                        className={cn(
                          "w-full text-left rounded-md px-3 py-2 text-xs transition-all border-l-2",
                          selectedTaskId === task.taskId
                            ? "bg-primary/[0.04] border-l-primary text-primary font-medium"
                            : "border-l-gray-200 text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{task.taskName}</span>
                          <div className="flex items-center gap-1 shrink-0 ml-1">
                            {task.pendingCount > 0 && (
                              <span className="text-[10px] px-1 py-0.5 rounded bg-amber-50 text-amber-600">
                                {task.pendingCount}
                              </span>
                            )}
                            {task.gradedCount > 0 && (
                              <span className="text-[10px] px-1 py-0.5 rounded bg-green-50 text-green-600">
                                {task.gradedCount}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Badge variant="outline" className="text-[10px] font-normal">
                            {task.taskType}
                          </Badge>
                          {task.assessmentForm && (
                            <span className="text-[10px] text-gray-400">{task.assessmentForm}</span>
                          )}
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

      {/* Right content — Task students */}
      <div className="flex-1 overflow-y-auto p-6">
        {selectedTask ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {selectedTask.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs font-normal">
                    {selectedScenario?.name}
                  </Badge>
                  <Badge variant="outline" className="text-xs font-normal text-gray-500">
                    {selectedTask.taskType === "assessment" ? "考核" : "训练"}
                  </Badge>
                  {selectedTask.assessmentForm && (
                    <Badge variant="outline" className="text-xs font-normal text-gray-500">
                      {selectedTask.assessmentForm}
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">
                    {selectedTaskStudents.length} 位学生
                  </span>
                </div>
              </div>
            </div>

            {/* 两级筛选栏 */}
            <div className="rounded-lg border bg-white p-3 space-y-2.5">
              {/* 第一级：测评方式 */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 shrink-0">测评方式</span>
                <div className="flex gap-1 flex-wrap">
                  {METHODS.map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setMethodFilter(m)
                        setStatusFilter("all")
                      }}
                      className={cn(
                        "px-3 py-1 rounded-md text-xs font-medium transition-all",
                        methodFilter === m
                          ? "bg-primary text-white shadow-sm"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {m}
                      <span className="ml-1 opacity-80">({methodCounts[m] || 0})</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* 分割线 */}
              <div className="border-t border-dashed" />
              {/* 第二级：评分状态 */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500 shrink-0">评分状态</span>
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    { key: "all" as const, label: "全部", count: statusCounts.all },
                    { key: "pending" as const, label: "待评分", count: statusCounts.pending },
                    { key: "graded" as const, label: "已评分", count: statusCounts.graded },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setStatusFilter(tab.key)}
                      className={cn(
                        "px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all border",
                        statusFilter === tab.key
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      {tab.label}
                      <span className="ml-0.5 text-[10px] opacity-70">({tab.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Card>
              <div className="divide-y divide-gray-100">
                {selectedTaskStudents.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-sm">暂无学生提交记录</div>
                ) : (
                  selectedTaskStudents.map((item) => (
                    <div
                      key={item.submissionId}
                      className="flex items-center justify-between p-3 hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {item.studentName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800 text-sm">
                              {item.studentName}
                            </span>
                            <span className="text-xs text-gray-400">{item.studentNumber}</span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px]",
                                item.status === "pending"
                                  ? "bg-amber-50 text-amber-600 border-amber-200"
                                  : "bg-green-50 text-green-600 border-green-200"
                              )}
                            >
                              {item.status === "pending" ? "待评分" : "已评分"}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] font-normal">
                              {item.method}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {item.submittedAt}
                            <span className="text-gray-300">|</span>
                            {item.className} · {item.enrollmentYear}届
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                          <Link href={`/scene-task-results/${item.submissionId}`}>
                            <Eye className="mr-1 h-3 w-3" />
                            查看
                          </Link>
                        </Button>
                        {item.status === "pending" ? (
                          <Button size="sm" className="h-7 text-xs" asChild>
                            <Link href={`/scene-task-results/${item.submissionId}`}>
                              <PenLine className="mr-1 h-3 w-3" />
                              评分
                            </Link>
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-green-600" disabled>
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            已评分
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
            <FileText className="h-12 w-12 mb-3 opacity-50" />
            <p className="text-sm">请在左侧选择一个任务</p>
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
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 shrink-0">
        <div className="max-w-[1600px] mx-auto w-full">
          <h1 className="text-xl font-semibold text-gray-800">测评结果管理</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            查看场景任务、智慧课堂、在线课程的测评结果并进行评分
          </p>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="mt-3"
          >
            <TabsList className="h-9">
              <TabsTrigger value="scene" className="text-sm px-5">
                场景任务
              </TabsTrigger>
              <TabsTrigger value="online-classroom" className="text-sm px-5">
                智慧课堂
              </TabsTrigger>
              <TabsTrigger value="smart-course" className="text-sm px-5">
                在线课程
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "scene" && <SceneTaskTab />}
        {activeTab === "online-classroom" && <OnlineClassroomTab />}
        {activeTab === "smart-course" && <SmartCourseTab />}
      </div>
    </div>
  )
}

export default function SceneTaskResultsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-muted-foreground">加载中...</div>}>
      <SceneTaskResultsContent />
    </Suspense>
  )
}

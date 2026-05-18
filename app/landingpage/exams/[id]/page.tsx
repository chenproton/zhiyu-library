"use client"

import Link from "next/link"
import { useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Clock, FileText, CheckCircle2, AlertCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

const examDataMap: Record<string, {
  name: string
  description: string
  duration: number
  questionCount: number
  status: string
  questions: {
    id: string
    type: 'single' | 'multiple' | 'essay'
    content: string
    options?: string[]
    score: number
  }[]
}> = {
  'exam-1': {
    name: "前端基础测试",
    description: "考察 JavaScript、React 基础知识",
    duration: 60,
    questionCount: 20,
    status: "进行中",
    questions: [
      { id: 'q1', type: 'single', content: 'JavaScript 中，typeof null 的返回值是什么？', options: ['null', 'undefined', 'object', 'number'], score: 5 },
      { id: 'q2', type: 'multiple', content: '以下哪些是 JavaScript 的原始数据类型？', options: ['String', 'Number', 'Object', 'Boolean', 'Symbol', 'Array'], score: 10 },
      { id: 'q3', type: 'single', content: 'React 中，useEffect 的第二个参数是空数组时，效果等同于？', options: ['componentDidUpdate', 'componentDidMount', 'componentWillUnmount', 'shouldComponentUpdate'], score: 5 },
      { id: 'q4', type: 'essay', content: '请简述 JavaScript 事件循环（Event Loop）的工作原理。', score: 20 },
      { id: 'q5', type: 'single', content: 'CSS 中，以下哪个属性用于设置弹性布局？', options: ['display: grid', 'display: flex', 'display: block', 'position: relative'], score: 5 },
    ],
  },
  'exam-2': {
    name: "TypeScript 能力测试",
    description: "TypeScript 类型系统与高级特性测验",
    duration: 90,
    questionCount: 30,
    status: "未开始",
    questions: [
      { id: 'q1', type: 'single', content: 'TypeScript 中，interface 和 type 的主要区别是什么？', options: ['interface 可以合并，type 不可以', 'type 可以合并，interface 不可以', '没有区别', 'interface 只能用于对象'], score: 5 },
      { id: 'q2', type: 'multiple', content: '以下哪些是 TypeScript 的工具类型？', options: ['Partial', 'Required', 'Readonly', 'Record', 'Map'], score: 10 },
      { id: 'q3', type: 'single', content: '泛型约束使用哪个关键字？', options: ['extends', 'implements', 'infer', 'as'], score: 5 },
      { id: 'q4', type: 'essay', content: '请解释 TypeScript 中的条件类型（Conditional Types）及其使用场景。', score: 20 },
    ],
  },
  'exam-3': {
    name: "React 进阶考核",
    description: "React Hooks 与性能优化专项考核",
    duration: 120,
    questionCount: 40,
    status: "已结束",
    questions: [
      { id: 'q1', type: 'single', content: 'React.memo 的作用是什么？', options: ['优化性能，减少不必要的渲染', '管理状态', '处理副作用', '创建上下文'], score: 5 },
      { id: 'q2', type: 'essay', content: '请比较 useCallback 和 useMemo 的区别与适用场景。', score: 20 },
    ],
  },
  'exam-4': {
    name: "Node.js 后端测试",
    description: "Node.js 基础与 Express 框架测试",
    duration: 60,
    questionCount: 25,
    status: "进行中",
    questions: [
      { id: 'q1', type: 'single', content: 'Node.js 中，哪个模块用于创建 HTTP 服务器？', options: ['http', 'fs', 'path', 'url'], score: 5 },
      { id: 'q2', type: 'multiple', content: 'Express 中间件的执行顺序受哪些因素影响？', options: ['注册顺序', '路径匹配', '请求方法', '响应状态码'], score: 10 },
    ],
  },
  'exam-5': {
    name: "Vue.js 进阶考核",
    description: "Vue3 组合式 API 与响应式原理",
    duration: 120,
    questionCount: 35,
    status: "未开始",
    questions: [
      { id: 'q1', type: 'single', content: 'Vue3 中，reactive 和 ref 的主要区别是什么？', options: ['reactive 只能用于对象，ref 可以用于任何类型', 'ref 只能用于对象，reactive 可以用于任何类型', '没有区别', 'reactive 是同步的，ref 是异步的'], score: 5 },
    ],
  },
  'exam-6': {
    name: "全栈开发综合测试",
    description: "前后端技术栈综合知识考核",
    duration: 150,
    questionCount: 50,
    status: "已结束",
    questions: [
      { id: 'q1', type: 'single', content: 'HTTP 状态码 404 表示什么？', options: ['请求成功', '未授权', '找不到资源', '服务器内部错误'], score: 5 },
    ],
  },
}

export default function ExamDetailPage() {
  const params = useParams()
  const examId = params.id as string
  const exam = examDataMap[examId]

  const [started, setStarted] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [submitted, setSubmitted] = useState(false)

  if (!exam) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="py-20 text-center text-muted-foreground">
          <AlertCircle className="mx-auto mb-3 h-12 w-12 opacity-30" />
          <p>考试不存在或已删除</p>
          <Link href="/landingpage/exams" className="mt-4 inline-block">
            <Button variant="outline" size="sm">返回考试列表</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleSingleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleMultipleChange = (questionId: string, option: string, checked: boolean) => {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) || []
      if (checked) {
        return { ...prev, [questionId]: [...current, option] }
      }
      return { ...prev, [questionId]: current.filter((o) => o !== option) }
    })
  }

  const handleEssayChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const answeredCount = Object.keys(answers).length

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/landingpage/exams">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              返回
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-emerald-500" />
            <h2 className="mb-2 text-xl font-bold">试卷已提交</h2>
            <p className="text-muted-foreground">感谢您的参与，考试结果将在阅卷完成后公布。</p>
            <div className="mt-6">
              <Link href="/landingpage/exams">
                <Button variant="outline">返回考试列表</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/landingpage/exams">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              返回考试列表
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">{exam.name}</h1>
                <p className="mt-2 text-muted-foreground">{exam.description}</p>
              </div>
              <Badge
                variant={exam.status === '进行中' ? 'default' : exam.status === '未开始' ? 'secondary' : 'outline'}
              >
                {exam.status}
              </Badge>
            </div>

            <div className="mb-8 grid grid-cols-3 gap-4 rounded-lg border bg-muted/30 p-4">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">考试时长</div>
                <div className="mt-1 flex items-center justify-center gap-1 text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  {exam.duration} 分钟
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">题目数量</div>
                <div className="mt-1 flex items-center justify-center gap-1 text-sm font-medium">
                  <FileText className="h-4 w-4" />
                  {exam.questionCount} 题
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">总分</div>
                <div className="mt-1 text-sm font-medium">100 分</div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <p>1. 请在规定时间内完成所有题目，超时将自动提交。</p>
              <p>2. 单选题每题只有一个正确答案，多选题有多个正确答案。</p>
              <p>3. 答题过程中请勿刷新页面或关闭浏览器。</p>
              <p>4. 提交后无法修改答案，请确认后再提交。</p>
            </div>

            <div className="mt-8 flex justify-center">
              {exam.status === '进行中' ? (
                <Button size="lg" className="gap-2" onClick={() => setStarted(true)}>
                  <Clock className="h-5 w-5" />
                  开始考试
                </Button>
              ) : exam.status === '已结束' ? (
                <Button size="lg" variant="outline" disabled>
                  考试已结束
                </Button>
              ) : (
                <Button size="lg" variant="outline" disabled>
                  考试未开始
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-bold">{exam.name}</h1>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            剩余 {exam.duration} 分钟
          </span>
          <span className="text-muted-foreground">
            已答 {answeredCount} / {exam.questions.length} 题
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {exam.questions.map((q, idx) => (
          <Card key={q.id}>
            <CardContent className="p-5">
              <div className="mb-4">
                <span className="text-sm font-medium text-muted-foreground">{idx + 1}. </span>
                <span className="text-sm font-medium">{q.content}</span>
                <span className="ml-2 text-xs text-muted-foreground">（{q.score} 分）</span>
              </div>

              {q.type === 'single' && q.options && (
                <RadioGroup
                  value={(answers[q.id] as string) || ''}
                  onValueChange={(v) => handleSingleChange(q.id, v)}
                >
                  <div className="space-y-2">
                    {q.options.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50 cursor-pointer"
                      >
                        <RadioGroupItem value={opt} />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              )}

              {q.type === 'multiple' && q.options && (
                <div className="space-y-2">
                  {q.options.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50 cursor-pointer"
                    >
                      <Checkbox
                        checked={((answers[q.id] as string[]) || []).includes(opt)}
                        onCheckedChange={(checked) =>
                          handleMultipleChange(q.id, opt, checked as boolean)
                        }
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'essay' && (
                <Textarea
                  placeholder="请输入您的答案..."
                  rows={4}
                  value={(answers[q.id] as string) || ''}
                  onChange={(e) => handleEssayChange(q.id, e.target.value)}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button size="lg" className="gap-2" onClick={() => setSubmitted(true)}>
          <Send className="h-5 w-5" />
          提交试卷
        </Button>
      </div>
    </div>
  )
}

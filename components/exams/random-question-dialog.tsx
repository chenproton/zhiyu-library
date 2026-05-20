"use client"

import { useState, useMemo } from "react"
import { Shuffle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MultiSelectSearch } from "@/components/ui/multi-select-search"
import { useData } from "@/components/providers/data-provider"
import { mockKnowledgePoints } from "@/lib/mock-data"
import type { Question, QuestionType, Difficulty } from "@/lib/types"
import { QUESTION_TYPE_LABELS, DIFFICULTY_LABELS } from "@/lib/types"

interface RandomQuestionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedQuestionIds: string[]
  onAddQuestions: (questions: Question[]) => void
}

const questionTypes: QuestionType[] = ['single', 'multiple', 'judge', 'fill', 'short_answer', 'essay']
const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

export function RandomQuestionDialog({
  open,
  onOpenChange,
  selectedQuestionIds,
  onAddQuestions,
}: RandomQuestionDialogProps) {
  const { questionBanks, questions } = useData()

  // 只能从已发布的题库抽题
  const publishedBanks = useMemo(() => 
    questionBanks.filter(bank => bank.status === 'published'),
    [questionBanks]
  )

  const [selectedBankIds, setSelectedBankIds] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([])
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([])
  const [selectedKnowledgePoints, setSelectedKnowledgePoints] = useState<string[]>([])
  const [count, setCount] = useState(5)

  // 计算可用题目池
  const availableQuestions = useMemo(() => {
    let pool = questions.filter(q => {
      // 排除已选题目
      if (selectedQuestionIds.includes(q.id)) return false
      // 只从已发布题库抽题
      const bank = questionBanks.find(b => b.id === q.bankId)
      if (!bank || bank.status !== 'published') return false
      return true
    })

    // 按题库筛选
    if (selectedBankIds.length > 0) {
      pool = pool.filter(q => selectedBankIds.includes(q.bankId))
    }

    // 按题型筛选
    if (selectedTypes.length > 0) {
      pool = pool.filter(q => selectedTypes.includes(q.type))
    }

    // 按难度筛选
    if (selectedDifficulties.length > 0) {
      pool = pool.filter(q => q.difficulty && selectedDifficulties.includes(q.difficulty))
    }

    // 按知识点筛选
    if (selectedKnowledgePoints.length > 0) {
      pool = pool.filter(q => 
        q.knowledgePoints?.some(kp => selectedKnowledgePoints.includes(kp))
      )
    }

    return pool
  }, [questions, questionBanks, selectedQuestionIds, selectedBankIds, selectedTypes, selectedDifficulties, selectedKnowledgePoints])

  const toggleType = (type: QuestionType) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const toggleDifficulty = (difficulty: Difficulty) => {
    setSelectedDifficulties(prev => 
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    )
  }

  const handleRandomSelect = () => {
    // Fisher-Yates 洗牌算法
    const shuffled = [...availableQuestions]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    const selected = shuffled.slice(0, Math.min(count, shuffled.length))
    onAddQuestions(selected)
    handleClose()
  }

  const handleClose = () => {
    setSelectedBankIds([])
    setSelectedTypes([])
    setSelectedDifficulties([])
    setSelectedKnowledgePoints([])
    setCount(5)
    onOpenChange(false)
  }

  const actualCount = Math.min(count, availableQuestions.length)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shuffle className="size-5" />
            随机抽题
          </DialogTitle>
          <DialogDescription>
            根据条件从题库中随机抽取题目添加到试卷
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="flex flex-col gap-6 pr-4">
            {/* 选择题库 */}
            <div>
              <Label className="mb-2 block font-medium">选择题库</Label>
              <p className="mb-3 text-sm text-muted-foreground">
                不选则从全部已发布题库中抽取
              </p>
              {publishedBanks.length === 0 ? (
                <Alert>
                  <Info className="size-4" />
                  <AlertDescription>暂无已发布的题库</AlertDescription>
                </Alert>
              ) : (
                <MultiSelectSearch
                  options={publishedBanks.map(b => ({ label: b.name, value: b.id, subtitle: `${b.questionCount}题` }))}
                  selected={selectedBankIds}
                  onChange={setSelectedBankIds}
                  placeholder="选择题库"
                  searchPlaceholder="搜索题库名称..."
                />
              )}
            </div>

            <Separator />

            {/* 选择题型 */}
            <div>
              <Label className="mb-2 block font-medium">题目类型</Label>
              <p className="mb-3 text-sm text-muted-foreground">
                不选则包含全部题型
              </p>
              <div className="flex flex-wrap gap-2">
                {questionTypes.map((type) => (
                  <Badge
                    key={type}
                    variant={selectedTypes.includes(type) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleType(type)}
                  >
                    {QUESTION_TYPE_LABELS[type]}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* 选择难度 */}
            <div>
              <Label className="mb-2 block font-medium">难度等级</Label>
              <p className="mb-3 text-sm text-muted-foreground">
                不选则包含全部难度
              </p>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((difficulty) => (
                  <Badge
                    key={difficulty}
                    variant={selectedDifficulties.includes(difficulty) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleDifficulty(difficulty)}
                  >
                    {DIFFICULTY_LABELS[difficulty]}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* 选择知识点 */}
            <div>
              <Label className="mb-2 block font-medium">知识点</Label>
              <p className="mb-3 text-sm text-muted-foreground">
                不选则包含全部知识点
              </p>
              <MultiSelectSearch
                options={mockKnowledgePoints.map(kp => ({ label: kp.name, value: kp.id }))}
                selected={selectedKnowledgePoints}
                onChange={setSelectedKnowledgePoints}
                placeholder="选择知识点"
                searchPlaceholder="搜索知识点..."
              />
            </div>

            <Separator />

            {/* 抽取数量 */}
            <div>
              <Label className="mb-2 block font-medium">抽取数量</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={count}
                  onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">
                  道题目（可用题目池共 {availableQuestions.length} 道）
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <div className="flex-1 text-sm text-muted-foreground">
            {availableQuestions.length === 0 ? (
              <span className="text-destructive">当前筛选条件下没有可用题目</span>
            ) : (
              <span>将随机抽取 {actualCount} 道题目</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              取消
            </Button>
            <Button
              onClick={handleRandomSelect}
              disabled={availableQuestions.length === 0}
            >
              <Shuffle className="mr-2 size-4" />
              随机抽题
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

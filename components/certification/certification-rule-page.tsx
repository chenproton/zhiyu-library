'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Edit2, Check, X, Info, Settings, Plus } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  type CertificationRule,
  type LevelMapping,
  type RuleStatus,
  defaultLevelMapping,
} from '@/lib/types'
import { initialRule, positionsList } from '@/lib/mock-data'
import { ActionBar } from './action-bar'
import { LevelMappingDialog } from './level-mapping-dialog'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import Link from 'next/link'

interface CertificationRulePageProps {
  isGlobal?: boolean
  positionId?: string
}

function formatLevelLabel(level: string): string {
  const mapping: Record<string, string> = {
    '了解': '了解L1',
    '理解': '理解L2',
    '掌握': '掌握L3',
    '熟练': '熟练L4',
    '精通': '精通L5',
  }
  return mapping[level] || level
}

function formatLevelMapping(mapping: LevelMapping[]): string {
  return mapping
    .map((level) => `${formatLevelLabel(level.level)}：${level.min}~${level.max}%`)
    .join('，')
}

interface TaskRowData {
  abilityItemId: string
  abilityItemName: string
  abilityPointId: string
  abilityPointName: string
  taskId: string
  taskName: string
  taskMaxScore: number
  levelMapping: string
  weight: number
  requiredLevel: string
  isFirstOfAbilityItem: boolean
  isFirstOfAbilityPoint: boolean
  abilityItemRowSpan: number
  abilityPointRowSpan: number
  mappingType: 'inherit' | 'custom'
  customMapping?: LevelMapping[]
  pointWeight: number
}

interface ScoringRuleCardProps {
  rules: { min: number; max: number; label: string }[]
  setRules: React.Dispatch<React.SetStateAction<{ min: number; max: number; label: string }[]>>
}

function ScoringRuleCard({ rules, setRules }: ScoringRuleCardProps) {
  const addRule = () => { setRules([...rules, { min: 0, max: 0, label: '' }]) }
  const removeRule = (index: number) => { setRules(rules.filter((_, i) => i !== index)) }
  const updateRule = (index: number, field: string, value: string | number) => {
    const newRules = [...rules]
    newRules[index] = { ...newRules[index], [field]: value }
    setRules(newRules)
  }
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="space-y-3">
        {rules.map((rule, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Input type="number" min={0} max={100} value={rule.min} onChange={(e) => updateRule(index, 'min', Number(e.target.value))} className="w-20 h-8 text-center" />
              <span className="text-muted-foreground">%</span>
              <span className="text-muted-foreground">~</span>
              <Input type="number" min={0} max={100} value={rule.max} onChange={(e) => updateRule(index, 'max', Number(e.target.value))} className="w-20 h-8 text-center" />
              <span className="text-muted-foreground">%</span>
            </div>
            <Input value={rule.label} onChange={(e) => updateRule(index, 'label', e.target.value)} placeholder="等级名称" className="w-32 h-8" />
            <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive" onClick={() => removeRule(index)}><X className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="mt-4" onClick={addRule}><Plus className="mr-1 h-3.5 w-3.5" />添加档次</Button>
    </div>
  )
}

function WeightConfigDialog({
  open, onOpenChange, title, items, onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  items: { id: string; name: string; weight: number }[]
  onSave: (weights: Record<string, number>) => void
}) {
  const [localWeights, setLocalWeights] = useState<Record<string, number>>({})
  useMemo(() => {
    if (open) {
      const map: Record<string, number> = {}
      items.forEach((i) => { map[i.id] = i.weight })
      setLocalWeights(map)
    }
  }, [open, items])
  const total = Object.values(localWeights).reduce((s, v) => s + (v || 0), 0)
  const isValid = total === 100
  const handleChange = (id: string, val: string) => {
    const num = parseInt(val, 10) || 0
    setLocalWeights((prev) => ({ ...prev, [id]: num }))
  }
  const handleSave = () => {
    if (!isValid) return
    onSave(localWeights)
    onOpenChange(false)
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>配置各子节点权重，合计必须为 100%</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-md bg-secondary/50 border border-border">
              <span className="flex-1 text-sm font-medium truncate">{item.name}</span>
              <div className="flex items-center gap-2">
                <Input type="number" min={0} max={100} value={localWeights[item.id] ?? item.weight} onChange={(e) => handleChange(item.id, e.target.value)} className="w-20 h-8 text-center" />
                <span className="text-muted-foreground text-sm">%</span>
              </div>
            </div>
          ))}
          <div className={`text-sm font-medium text-right ${isValid ? 'text-green-600' : 'text-red-600'}`}>
            当前合计：{total}% {isValid ? '✓' : '（必须为 100%）'}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={handleSave} disabled={!isValid}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function CertificationRulePage({ isGlobal = false, positionId }: CertificationRulePageProps) {
  const positionInfo = positionId ? positionsList.find((p) => p.id === positionId) : null
  const pageTitle = isGlobal ? '全局能力认定规则配置' : positionInfo?.name || '前端开发工程师'
  const [rule, setRule] = useState<CertificationRule>(initialRule)
  const [globalMapping, setGlobalMapping] = useState<LevelMapping[]>(defaultLevelMapping)
  const [globalConfigDialogOpen, setGlobalConfigDialogOpen] = useState(false)
  const { toast } = useToast()

  const [scoringRules, setScoringRules] = useState([
    { min: 95, max: 100, label: 'A+' },
    { min: 85, max: 95, label: 'A' },
    { min: 75, max: 85, label: 'B+' },
    { min: 60, max: 75, label: 'B' },
    { min: 0, max: 60, label: 'C' },
  ])
  const [scoringDialogOpen, setScoringDialogOpen] = useState(false)

  const [pointWeightDialogOpen, setPointWeightDialogOpen] = useState(false)
  const [taskWeightDialogOpen, setTaskWeightDialogOpen] = useState(false)
  const [weightDialogItemId, setWeightDialogItemId] = useState<string>('')
  const [weightDialogPointId, setWeightDialogPointId] = useState<string>('')

  const [editingTaskMapping, setEditingTaskMapping] = useState<{
    abilityItemId: string
    abilityPointId: string
    taskId: string
    taskName: string
    mapping: LevelMapping[]
  } | null>(null)
  const [overrideConfirmOpen, setOverrideConfirmOpen] = useState(false)

  const isReadOnly = rule.status === 'reviewing'

  const hasValidationErrors = useMemo(() => {
    return rule.abilityItems.some((item) =>
      item.abilityPoints.some((point) => {
        if (point.relatedTasks.length === 0) return false
        const totalWeight = point.relatedTasks.reduce((sum, t) => sum + t.weight, 0)
        return totalWeight !== 100
      }),
    )
  }, [rule.abilityItems])

  const tableRows: TaskRowData[] = useMemo(() => {
    const rows: TaskRowData[] = []
    rule.abilityItems.forEach((item) => {
      let abilityItemRowCount = 0
      item.abilityPoints.forEach((point) => { abilityItemRowCount += Math.max(point.relatedTasks.length, 1) })
      let isFirstOfAbilityItem = true
      item.abilityPoints.forEach((point) => {
        const abilityPointRowCount = Math.max(point.relatedTasks.length, 1)
        let isFirstOfAbilityPoint = true
        if (point.relatedTasks.length === 0) {
          rows.push({
            abilityItemId: item.id, abilityItemName: item.name,
            abilityPointId: point.id, abilityPointName: point.name,
            taskId: '', taskName: '--', taskMaxScore: 0, levelMapping: '--', weight: 0,
            requiredLevel: point.requiredLevel, isFirstOfAbilityItem, isFirstOfAbilityPoint,
            abilityItemRowSpan: isFirstOfAbilityItem ? abilityItemRowCount : 0,
            abilityPointRowSpan: isFirstOfAbilityPoint ? abilityPointRowCount : 0,
            mappingType: point.mappingType, customMapping: point.customMapping,
            pointWeight: point.weight || 0,
          })
          isFirstOfAbilityItem = false
          isFirstOfAbilityPoint = false
        } else {
          point.relatedTasks.forEach((task) => {
            const mapping = point.mappingType === 'custom' && point.customMapping ? point.customMapping : globalMapping
            rows.push({
              abilityItemId: item.id, abilityItemName: item.name,
              abilityPointId: point.id, abilityPointName: point.name,
              taskId: task.id, taskName: task.name, taskMaxScore: task.maxScore,
              levelMapping: formatLevelMapping(mapping), weight: task.weight,
              requiredLevel: point.requiredLevel, isFirstOfAbilityItem, isFirstOfAbilityPoint,
              abilityItemRowSpan: isFirstOfAbilityItem ? abilityItemRowCount : 0,
              abilityPointRowSpan: isFirstOfAbilityPoint ? abilityPointRowCount : 0,
              mappingType: point.mappingType, customMapping: point.customMapping,
              pointWeight: point.weight || 0,
            })
            isFirstOfAbilityItem = false
            isFirstOfAbilityPoint = false
          })
        }
      })
    })
    return rows
  }, [rule.abilityItems, globalMapping])

  const updateStatus = (status: RuleStatus) => { setRule({ ...rule, status }) }

  const handleSaveDraft = () => {
    updateStatus('draft')
    toast({ title: '保存成功', description: '规则已保存为草稿' })
  }

  const handleSubmitReview = () => {
    if (hasValidationErrors) {
      toast({ title: '提交失败', description: '请确保所有能力点的权重合计为100%', variant: 'destructive' })
      return
    }
    updateStatus('reviewing')
    toast({ title: '提交成功', description: '规则已提交审批，请等待审批结果' })
  }

  const handleCancelReview = () => {
    updateStatus('draft')
    toast({ title: '已取消', description: '审批已取消，规则回到草稿状态' })
  }

  const handlePublish = () => {
    updateStatus('published')
    toast({ title: '发布成功', description: '规则已发布生效' })
  }

  const handleCancelPublish = () => {
    updateStatus('none')
    toast({ title: '已取消发布', description: '岗位已变为无规则状态' })
  }

  const handleInviteCollaborate = () => {
    toast({ title: '邀请共建', description: '邀请链接已复制到剪贴板' })
  }

  const handleOpenPointWeightDialog = () => {
    if (isReadOnly) return
    setPointWeightDialogOpen(true)
  }

  const handleSavePointWeights = (weights: Record<string, number>) => {
    setRule((prev) => ({
      ...prev,
      abilityItems: prev.abilityItems.map((item) => ({
        ...item,
        abilityPoints: item.abilityPoints.map((point) =>
          weights[point.id] !== undefined ? { ...point, weight: weights[point.id] } : point
        ),
      })),
    }))
    toast({ title: '保存成功', description: '能力点权重已更新' })
  }

  const handleOpenTaskWeightDialog = (abilityItemId: string, abilityPointId: string) => {
    if (isReadOnly) return
    setWeightDialogItemId(abilityItemId)
    setWeightDialogPointId(abilityPointId)
    setTaskWeightDialogOpen(true)
  }

  const handleSaveTaskWeights = (weights: Record<string, number>) => {
    setRule((prev) => ({
      ...prev,
      abilityItems: prev.abilityItems.map((item) =>
        item.id === weightDialogItemId
          ? {
              ...item,
              abilityPoints: item.abilityPoints.map((point) =>
                point.id === weightDialogPointId
                  ? { ...point, relatedTasks: point.relatedTasks.map((task) => weights[task.id] !== undefined ? { ...task, weight: weights[task.id] } : task) }
                  : point
              ),
            }
          : item
      ),
    }))
    toast({ title: '保存成功', description: '任务权重已更新' })
  }

  const handleToggleMappingType = (abilityItemId: string, abilityPointId: string, newType: 'inherit' | 'custom') => {
    if (isReadOnly) return
    if (newType === 'custom') {
      const abilityItem = rule.abilityItems.find((item) => item.id === abilityItemId)
      const abilityPoint = abilityItem?.abilityPoints.find((point) => point.id === abilityPointId)
      if (!abilityPoint) return
      const currentMapping = abilityPoint.customMapping || globalMapping.map((m) => ({ ...m }))
      setEditingTaskMapping({ abilityItemId, abilityPointId, taskId: '', taskName: abilityPoint.name, mapping: currentMapping })
    } else {
      setRule((prev) => ({
        ...prev,
        abilityItems: prev.abilityItems.map((item) =>
          item.id === abilityItemId
            ? { ...item, abilityPoints: item.abilityPoints.map((point) => point.id === abilityPointId ? { ...point, mappingType: 'inherit' as const } : point) }
            : item
        ),
      }))
      toast({ title: '已切换', description: '已切换为使用全局等级映射' })
    }
  }

  const handleSaveTaskMapping = () => {
    if (!editingTaskMapping) return
    setRule((prev) => ({
      ...prev,
      abilityItems: prev.abilityItems.map((item) =>
        item.id === editingTaskMapping.abilityItemId
          ? { ...item, abilityPoints: item.abilityPoints.map((point) => point.id === editingTaskMapping.abilityPointId ? { ...point, mappingType: 'custom' as const, customMapping: editingTaskMapping.mapping } : point) }
          : item
      ),
    }))
    setEditingTaskMapping(null)
    toast({ title: '保存成功', description: '自定义映射已更新' })
  }

  const handleOpenEditMapping = (row: TaskRowData) => {
    if (isReadOnly) return
    const abilityItem = rule.abilityItems.find((item) => item.id === row.abilityItemId)
    const abilityPoint = abilityItem?.abilityPoints.find((point) => point.id === row.abilityPointId)
    if (!abilityPoint) return
    const currentMapping = abilityPoint.mappingType === 'custom' && abilityPoint.customMapping ? abilityPoint.customMapping : globalMapping
    setEditingTaskMapping({ abilityItemId: row.abilityItemId, abilityPointId: row.abilityPointId, taskId: row.taskId, taskName: row.abilityPointName, mapping: currentMapping.map((m) => ({ ...m })) })
  }

  const scoreCalculationTip = '完成任务后，系统根据实际得分和任务权重计算换算分。完成某能力点关联的全部任务后，系统汇总换算分得出最终得分，并匹配对应掌握度等级。若无已完成任务，则不显示等级。'

  const pointWeightItems = useMemo(() => {
    const items: { id: string; name: string; weight: number }[] = []
    rule.abilityItems.forEach((item) => {
      item.abilityPoints.forEach((point) => {
        items.push({ id: point.id, name: `${item.name} · ${point.name}`, weight: point.weight || 0 })
      })
    })
    return items
  }, [rule.abilityItems])

  const taskWeightItems = useMemo(() => {
    const item = rule.abilityItems.find((i) => i.id === weightDialogItemId)
    const point = item?.abilityPoints.find((p) => p.id === weightDialogPointId)
    return point ? point.relatedTasks.map((t) => ({ id: t.id, name: t.name, weight: t.weight })) : []
  }, [rule.abilityItems, weightDialogItemId, weightDialogPointId])

  return (
    <TooltipProvider>
      <div className={cn('min-h-screen bg-background pb-24', isReadOnly && 'pointer-events-none')}>
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/job-ability">
              <Button variant="ghost" size="sm" className={cn('gap-2', isReadOnly && 'pointer-events-auto')}>
                <ArrowLeft className="size-4" />
                返回岗位列表
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className={cn('gap-2', isReadOnly && 'pointer-events-auto')} onClick={() => setGlobalConfigDialogOpen(true)}>
                <Settings className="size-4" />
                配置全局等级映射
              </Button>
              <Button variant="default" size="sm" className={cn('gap-2', isReadOnly && 'pointer-events-auto')} onClick={() => toast({ title: '保存成功', description: '规则已保存' })}>
                <Check className="size-4" />
                保存规则
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto px-6 py-8">
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">{pageTitle}</h1>
            </div>
            <p className="mt-2 text-muted-foreground">配置能力认定规则 · 为每个能力点选择关联任务并分配权重</p>
          </div>

          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/30">
                  <TableHead className="w-[120px] font-medium">能力域</TableHead>
                  <TableHead className="w-[130px] font-medium">能力点</TableHead>
                  <TableHead className="w-[90px] text-center font-medium">能力点权重</TableHead>
                  <TableHead className="w-[200px] font-medium">关联场景任务</TableHead>
                  <TableHead className="w-[80px] text-center font-medium">任务权重</TableHead>
                  <TableHead className="w-[180px] font-medium">
                    <div className="flex items-center gap-1">
                      任务能力掌握度
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                            <Info className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs">
                          <p className="text-xs">{scoreCalculationTip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  <TableHead className="w-[110px] text-center font-medium">岗位所需掌握度</TableHead>
                  <TableHead className="w-[150px] text-center font-medium">岗位能力认定毕业标准</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableRows.map((row, index) => (
                  <TableRow key={`${row.abilityPointId}-${row.taskId || index}`} className="group">
                    {row.isFirstOfAbilityItem && (
                      <TableCell rowSpan={row.abilityItemRowSpan} className="align-top font-medium bg-muted/10 border-r border-border">
                        {row.abilityItemName}
                      </TableCell>
                    )}
                    {row.isFirstOfAbilityPoint && (
                      <TableCell rowSpan={row.abilityPointRowSpan} className="align-top text-muted-foreground border-r border-border">
                        {row.abilityPointName}
                      </TableCell>
                    )}
                    {row.isFirstOfAbilityPoint && (
                      <TableCell rowSpan={row.abilityPointRowSpan} className="text-center align-top border-r border-border">
                        <button
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm transition-colors',
                            !isReadOnly && 'hover:bg-secondary cursor-pointer',
                          )}
                          onClick={() => handleOpenPointWeightDialog()}
                          disabled={isReadOnly}
                        >
                          <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {row.pointWeight > 0 ? `${row.pointWeight}%` : '--'}
                        </button>
                      </TableCell>
                    )}
                    <TableCell className="text-primary">
                      {row.taskName !== '--' ? row.taskName : <span className="text-muted-foreground">--</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.weight > 0 ? (
                        <button
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm transition-colors',
                            !isReadOnly && 'hover:bg-secondary cursor-pointer',
                          )}
                          onClick={() => handleOpenTaskWeightDialog(row.abilityItemId, row.abilityPointId)}
                          disabled={isReadOnly}
                        >
                          <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {row.weight}%
                        </button>
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </TableCell>
                    {row.isFirstOfAbilityPoint && (
                      <TableCell rowSpan={row.abilityPointRowSpan} className="text-sm text-muted-foreground align-top border-r border-border">
                        <div className="flex items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="max-w-[120px] truncate cursor-default">{row.levelMapping}</span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-xs">
                              <p className="text-xs">{row.levelMapping}</p>
                            </TooltipContent>
                          </Tooltip>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs shrink-0" onClick={() => handleOpenEditMapping(row)}>
                            <Edit2 className="h-3 w-3 mr-1" />
                            修改
                          </Button>
                        </div>
                      </TableCell>
                    )}
                    {row.isFirstOfAbilityPoint && (
                      <TableCell rowSpan={row.abilityPointRowSpan} className="text-center align-top">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-sm font-medium">
                          {formatLevelLabel(row.requiredLevel)}
                        </span>
                      </TableCell>
                    )}
                    {index === 0 && (
                      <TableCell rowSpan={tableRows.length} className="text-center align-middle cursor-pointer hover:bg-secondary/50 border-l border-border" onClick={() => setScoringDialogOpen(true)}>
                        <div className="space-y-1">
                          {scoringRules.map((r) => (
                            <div key={r.label} className="text-sm">{r.label}: {r.min}~{r.max}%</div>
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">点击配置</div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>

        <Dialog open={!!editingTaskMapping} onOpenChange={(open) => !open && setEditingTaskMapping(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>配置自定义等级映射</DialogTitle>
              <DialogDescription>为能力点「{editingTaskMapping?.taskName}」配置自定义等级映射规则</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3">
              {editingTaskMapping?.mapping.map((level, idx) => (
                <div key={level.level} className="flex items-center gap-3 p-3 rounded-md bg-secondary/50 border border-border">
                  <span className="w-16 font-medium text-sm">{formatLevelLabel(level.level)}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <Input type="number" min={0} max={100} value={level.min} onChange={(e) => { const newMapping = [...editingTaskMapping.mapping]; newMapping[idx] = { ...newMapping[idx], min: parseInt(e.target.value, 10) || 0 }; setEditingTaskMapping({ ...editingTaskMapping, mapping: newMapping }) }} className="w-20 h-8 text-center" />
                    <span className="text-muted-foreground">~</span>
                    <Input type="number" min={0} max={100} value={level.max} onChange={(e) => { const newMapping = [...editingTaskMapping.mapping]; newMapping[idx] = { ...newMapping[idx], max: parseInt(e.target.value, 10) || 0 }; setEditingTaskMapping({ ...editingTaskMapping, mapping: newMapping }) }} className="w-20 h-8 text-center" />
                    <span className="text-muted-foreground text-sm">%</span>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTaskMapping(null)}>取消</Button>
              <Button onClick={handleSaveTaskMapping}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={scoringDialogOpen} onOpenChange={setScoringDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>岗位能力认定毕业标准</DialogTitle>
              <DialogDescription>为岗位能力认定配置得分与等级的映射关系</DialogDescription>
            </DialogHeader>
            <ScoringRuleCard rules={scoringRules} setRules={setScoringRules} />
            <DialogFooter>
              <Button onClick={() => setScoringDialogOpen(false)}>确定</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <WeightConfigDialog
          open={pointWeightDialogOpen}
          onOpenChange={setPointWeightDialogOpen}
          title="配置能力点权重"
          items={pointWeightItems}
          onSave={handleSavePointWeights}
        />

        <WeightConfigDialog
          open={taskWeightDialogOpen}
          onOpenChange={setTaskWeightDialogOpen}
          title="配置任务权重"
          items={taskWeightItems}
          onSave={handleSaveTaskWeights}
        />

        <LevelMappingDialog
          open={globalConfigDialogOpen}
          onOpenChange={setGlobalConfigDialogOpen}
          mapping={globalMapping}
          onSave={setGlobalMapping}
          title="配置全局等级映射"
          description="配置全局等级映射规则，所有岗位默认继承此配置"
          onOverride={() => setOverrideConfirmOpen(true)}
        />

        <Dialog open={overrideConfirmOpen} onOpenChange={(open) => !open && setOverrideConfirmOpen(false)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>确认覆盖</DialogTitle>
              <DialogDescription>确定要用当前全局等级映射覆盖该岗位下所有能力点的自定义配置吗？此操作不可撤销。</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOverrideConfirmOpen(false)}>取消</Button>
              <Button onClick={() => {
                setRule((prev) => ({
                  ...prev,
                  abilityItems: prev.abilityItems.map((item) => ({
                    ...item,
                    abilityPoints: item.abilityPoints.map((point) => ({
                      ...point,
                      mappingType: 'inherit' as const,
                      customMapping: undefined,
                    })),
                  })),
                }))
                toast({ title: '已覆盖', description: '当前岗位所有能力点已恢复使用全局等级映射' })
                setOverrideConfirmOpen(false)
              }}>确定覆盖</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toaster />
      </div>
    </TooltipProvider>
  )
}

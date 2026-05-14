'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Edit2, Check, X, Info } from 'lucide-react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { StatusBadge } from './status-badge'
import { ActionBar } from './action-bar'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import Link from 'next/link'

interface CertificationRulePageProps {
  isGlobal?: boolean
  positionId?: string
}

// 格式化等级映射为字符串
function formatLevelMapping(mapping: LevelMapping[]): string {
  return mapping
    .map((level) => `${level.level}：${level.min}~${level.max}分`)
    .join('，')
}

// 单个任务行的组件
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
}

export function CertificationRulePage({
  isGlobal = false,
  positionId,
}: CertificationRulePageProps) {
  const positionInfo = positionId
    ? positionsList.find((p) => p.id === positionId)
    : null

  const pageTitle = isGlobal
    ? '全局能力认证规则配置'
    : positionInfo?.name || '前端开发工程师'
  const [rule, setRule] = useState<CertificationRule>(initialRule)
  const [globalMapping] = useState<LevelMapping[]>(defaultLevelMapping)
  const { toast } = useToast()

  // 编辑权重状态
  const [editingTask, setEditingTask] = useState<{
    abilityItemId: string
    abilityPointId: string
    taskId: string
  } | null>(null)
  const [editingWeight, setEditingWeight] = useState<string>('')

  // 编辑任务映射弹窗
  const [editingTaskMapping, setEditingTaskMapping] = useState<{
    abilityItemId: string
    abilityPointId: string
    taskId: string
    taskName: string
    mapping: LevelMapping[]
  } | null>(null)

  // 判断是否为只读状态
  const isReadOnly = rule.status === 'reviewing'

  // 校验是否有错误
  const hasValidationErrors = useMemo(() => {
    return rule.abilityItems.some((item) =>
      item.abilityPoints.some((point) => {
        if (point.relatedTasks.length === 0) return false
        const totalWeight = point.relatedTasks.reduce(
          (sum, t) => sum + t.weight,
          0,
        )
        return totalWeight !== 100
      }),
    )
  }, [rule.abilityItems])

  // 将数据扁平化为表格行
  const tableRows: TaskRowData[] = useMemo(() => {
    const rows: TaskRowData[] = []

    rule.abilityItems.forEach((item) => {
      // 计算能力域的行数
      let abilityItemRowCount = 0
      item.abilityPoints.forEach((point) => {
        abilityItemRowCount += Math.max(point.relatedTasks.length, 1)
      })

      let isFirstOfAbilityItem = true

      item.abilityPoints.forEach((point) => {
        const abilityPointRowCount = Math.max(point.relatedTasks.length, 1)
        let isFirstOfAbilityPoint = true

        if (point.relatedTasks.length === 0) {
          // 无关联任务
          rows.push({
            abilityItemId: item.id,
            abilityItemName: item.name,
            abilityPointId: point.id,
            abilityPointName: point.name,
            taskId: '',
            taskName: '--',
            taskMaxScore: 0,
            levelMapping: '--',
            weight: 0,
            requiredLevel: point.requiredLevel,
            isFirstOfAbilityItem,
            isFirstOfAbilityPoint,
            abilityItemRowSpan: isFirstOfAbilityItem ? abilityItemRowCount : 0,
            abilityPointRowSpan: isFirstOfAbilityPoint
              ? abilityPointRowCount
              : 0,
            mappingType: point.mappingType,
            customMapping: point.customMapping,
          })
          isFirstOfAbilityItem = false
          isFirstOfAbilityPoint = false
        } else {
          point.relatedTasks.forEach((task) => {
            const mapping =
              point.mappingType === 'custom' && point.customMapping
                ? point.customMapping
                : globalMapping
            rows.push({
              abilityItemId: item.id,
              abilityItemName: item.name,
              abilityPointId: point.id,
              abilityPointName: point.name,
              taskId: task.id,
              taskName: task.name,
              taskMaxScore: task.maxScore,
              levelMapping: formatLevelMapping(mapping),
              weight: task.weight,
              requiredLevel: point.requiredLevel,
              isFirstOfAbilityItem,
              isFirstOfAbilityPoint,
              abilityItemRowSpan: isFirstOfAbilityItem
                ? abilityItemRowCount
                : 0,
              abilityPointRowSpan: isFirstOfAbilityPoint
                ? abilityPointRowCount
                : 0,
              mappingType: point.mappingType,
              customMapping: point.customMapping,
            })
            isFirstOfAbilityItem = false
            isFirstOfAbilityPoint = false
          })
        }
      })
    })

    return rows
  }, [rule.abilityItems, globalMapping])

  const updateStatus = (status: RuleStatus) => {
    setRule({ ...rule, status })
  }

  const handleSaveDraft = () => {
    updateStatus('draft')
    toast({
      title: '保存成功',
      description: '规则已保存为草稿',
    })
  }

  const handleSubmitReview = () => {
    if (hasValidationErrors) {
      toast({
        title: '提交失败',
        description: '请确保所有能力点的权重合计为100%',
        variant: 'destructive',
      })
      return
    }
    updateStatus('reviewing')
    toast({
      title: '提交成功',
      description: '规则已提交审批，请等待审批结果',
    })
  }

  const handleCancelReview = () => {
    updateStatus('draft')
    toast({
      title: '已取消',
      description: '审批已取消，规则回到草稿状态',
    })
  }

  const handlePublish = () => {
    updateStatus('published')
    toast({
      title: '发布成功',
      description: '规则已发布生效',
    })
  }

  const handleCancelPublish = () => {
    updateStatus('none')
    toast({
      title: '已取消发布',
      description: '岗位已变为无规则状态',
    })
  }

  const handleInviteCollaborate = () => {
    toast({
      title: '邀请共建',
      description: '邀请链接已复制到剪贴板',
    })
  }

  // 开始编辑权重
  const handleStartEditWeight = (
    abilityItemId: string,
    abilityPointId: string,
    taskId: string,
    currentWeight: number,
  ) => {
    if (isReadOnly) return
    setEditingTask({ abilityItemId, abilityPointId, taskId })
    setEditingWeight(currentWeight.toString())
  }

  // 保存权重
  const handleSaveWeight = () => {
    if (!editingTask) return
    const newWeight = parseInt(editingWeight, 10)
    if (Number.isNaN(newWeight) || newWeight < 0 || newWeight > 100) {
      toast({
        title: '权重无效',
        description: '请输入0-100之间的整数',
        variant: 'destructive',
      })
      return
    }

    setRule((prev) => ({
      ...prev,
      abilityItems: prev.abilityItems.map((item) =>
        item.id === editingTask.abilityItemId
          ? {
              ...item,
              abilityPoints: item.abilityPoints.map((point) =>
                point.id === editingTask.abilityPointId
                  ? {
                      ...point,
                      relatedTasks: point.relatedTasks.map((task) =>
                        task.id === editingTask.taskId
                          ? { ...task, weight: newWeight }
                          : task,
                      ),
                    }
                  : point,
              ),
            }
          : item,
      ),
    }))

    setEditingTask(null)
    setEditingWeight('')
  }

  // 取消编辑权重
  const handleCancelEditWeight = () => {
    setEditingTask(null)
    setEditingWeight('')
  }

  // 切换映射类型
  const handleToggleMappingType = (
    abilityItemId: string,
    abilityPointId: string,
    newType: 'inherit' | 'custom',
  ) => {
    if (isReadOnly) return

    if (newType === 'custom') {
      // 打开自定义映射编辑弹窗
      const abilityItem = rule.abilityItems.find(
        (item) => item.id === abilityItemId,
      )
      const abilityPoint = abilityItem?.abilityPoints.find(
        (point) => point.id === abilityPointId,
      )
      if (!abilityPoint) return

      const currentMapping =
        abilityPoint.customMapping || globalMapping.map((m) => ({ ...m }))

      setEditingTaskMapping({
        abilityItemId,
        abilityPointId,
        taskId: '',
        taskName: abilityPoint.name,
        mapping: currentMapping,
      })
    } else {
      // 直接切换为继承
      setRule((prev) => ({
        ...prev,
        abilityItems: prev.abilityItems.map((item) =>
          item.id === abilityItemId
            ? {
                ...item,
                abilityPoints: item.abilityPoints.map((point) =>
                  point.id === abilityPointId
                    ? {
                        ...point,
                        mappingType: 'inherit' as const,
                      }
                    : point,
                ),
              }
            : item,
        ),
      }))
      toast({
        title: '已切换',
        description: '已切换为使用全局等级映射',
      })
    }
  }

  // 保存任务映射
  const handleSaveTaskMapping = () => {
    if (!editingTaskMapping) return

    setRule((prev) => ({
      ...prev,
      abilityItems: prev.abilityItems.map((item) =>
        item.id === editingTaskMapping.abilityItemId
          ? {
              ...item,
              abilityPoints: item.abilityPoints.map((point) =>
                point.id === editingTaskMapping.abilityPointId
                  ? {
                      ...point,
                      mappingType: 'custom' as const,
                      customMapping: editingTaskMapping.mapping,
                    }
                  : point,
              ),
            }
          : item,
      ),
    }))

    setEditingTaskMapping(null)
    toast({
      title: '保存成功',
      description: '自定义映射已更新',
    })
  }

  // 打开编辑映射弹窗（用于修改按钮）
  const handleOpenEditMapping = (row: TaskRowData) => {
    if (isReadOnly) return

    const abilityItem = rule.abilityItems.find(
      (item) => item.id === row.abilityItemId,
    )
    const abilityPoint = abilityItem?.abilityPoints.find(
      (point) => point.id === row.abilityPointId,
    )

    if (!abilityPoint) return

    const currentMapping =
      abilityPoint.mappingType === 'custom' && abilityPoint.customMapping
        ? abilityPoint.customMapping
        : globalMapping

    setEditingTaskMapping({
      abilityItemId: row.abilityItemId,
      abilityPointId: row.abilityPointId,
      taskId: row.taskId,
      taskName: row.abilityPointName,
      mapping: currentMapping.map((m) => ({ ...m })),
    })
  }

  // 得分计算说明文案
  const scoreCalculationTip = '完成任务后，系统根据实际得分和任务权重计算换算分。完成某能力点关联的全部任务后，系统汇总换算分得出最终得分，并匹配对应掌握度等级。若无已完成任务，则不显示等级。'

  return (
    <TooltipProvider>
      <div
        className={cn(
          'min-h-screen bg-background pb-24',
          isReadOnly && 'pointer-events-none',
        )}
      >
        {/* 顶部导航 */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="mx-auto flex items-center justify-between px-6 py-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className={cn('gap-2', isReadOnly && 'pointer-events-auto')}
              >
                <ArrowLeft className="size-4" />
                返回岗位列表
              </Button>
            </Link>
          </div>
        </header>

        {/* 主内容区 */}
        <main className="mx-auto px-6 py-8">
          {/* 标题区 */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">{pageTitle}</h1>
              <StatusBadge status={rule.status} />
            </div>
            <p className="mt-2 text-muted-foreground">
              配置能力认证规则 · 为每个能力点选择关联任务并分配权重
            </p>
          </div>

          {/* 表格区域 */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/30">
                  <TableHead className="w-[140px] font-medium">能力域</TableHead>
                  <TableHead className="w-[140px] font-medium">能力点</TableHead>
                  <TableHead className="w-[160px] font-medium">关联任务</TableHead>
                  <TableHead className="w-[80px] text-center font-medium">任务满分</TableHead>
                  <TableHead className="min-w-[280px] font-medium">
                    <div className="flex items-center gap-1">
                      各任务能力掌握度
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
                  <TableHead className="w-[100px] text-center font-medium">岗位所需掌握度</TableHead>
                  <TableHead className="w-[80px] text-center font-medium">权重</TableHead>
                  <TableHead className="w-[180px] font-medium">
                    <div className="flex items-center gap-1">
                      操作
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableRows.map((row, index) => (
                  <TableRow key={`${row.abilityPointId}-${row.taskId || index}`} className="group">
                    {row.isFirstOfAbilityItem && (
                      <TableCell
                        rowSpan={row.abilityItemRowSpan}
                        className="align-top font-medium bg-muted/10 border-r border-border"
                      >
                        {row.abilityItemName}
                      </TableCell>
                    )}
                    {row.isFirstOfAbilityPoint && (
                      <TableCell
                        rowSpan={row.abilityPointRowSpan}
                        className="align-top text-muted-foreground border-r border-border"
                      >
                        {row.abilityPointName}
                      </TableCell>
                    )}
                    <TableCell className="text-primary">
                      {row.taskName !== '--' ? row.taskName : <span className="text-muted-foreground">--</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.taskMaxScore > 0 ? row.taskMaxScore : <span className="text-muted-foreground">--</span>}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="flex-1 truncate" title={row.levelMapping}>
                          {row.levelMapping}
                        </span>
                        {row.taskId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs shrink-0"
                            onClick={() => handleOpenEditMapping(row)}
                            disabled={isReadOnly}
                          >
                            <Edit2 className="h-3 w-3 mr-1" />
                            修改
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    {row.isFirstOfAbilityPoint && (
                      <TableCell
                        rowSpan={row.abilityPointRowSpan}
                        className="text-center align-top border-l border-border"
                      >
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-sm font-medium">
                          {row.requiredLevel}
                        </span>
                      </TableCell>
                    )}
                    <TableCell className="text-center">
                      {editingTask &&
                      editingTask.abilityItemId === row.abilityItemId &&
                      editingTask.abilityPointId === row.abilityPointId &&
                      editingTask.taskId === row.taskId ? (
                        <div className="flex items-center justify-center gap-1">
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={editingWeight}
                            onChange={(e) => setEditingWeight(e.target.value)}
                            className="h-7 w-14 text-center text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveWeight()
                              if (e.key === 'Escape') handleCancelEditWeight()
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={handleSaveWeight}
                          >
                            <Check className="h-3 w-3 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={handleCancelEditWeight}
                          >
                            <X className="h-3 w-3 text-red-600" />
                          </Button>
                        </div>
                      ) : row.weight > 0 ? (
                        <button
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm transition-colors',
                            !isReadOnly && 'hover:bg-secondary cursor-pointer',
                          )}
                          onClick={() =>
                            handleStartEditWeight(
                              row.abilityItemId,
                              row.abilityPointId,
                              row.taskId,
                              row.weight,
                            )
                          }
                          disabled={isReadOnly}
                        >
                          <Edit2 className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          {row.weight}
                        </button>
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </TableCell>
                    {row.isFirstOfAbilityPoint && (
                      <TableCell
                        rowSpan={row.abilityPointRowSpan}
                        className="align-top border-l border-border"
                      >
                        <Select
                          value={row.mappingType}
                          onValueChange={(value: 'inherit' | 'custom') =>
                            handleToggleMappingType(
                              row.abilityItemId,
                              row.abilityPointId,
                              value,
                            )
                          }
                          disabled={isReadOnly}
                        >
                          <SelectTrigger className="w-full h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inherit">使用全局映射</SelectItem>
                            <SelectItem value="custom">自定义映射</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>

        {/* 底部操作栏 */}
        <div className={cn(isReadOnly && 'pointer-events-auto')}>
          <ActionBar
            status={rule.status}
            onSaveDraft={handleSaveDraft}
            onSubmitReview={handleSubmitReview}
            onCancelReview={handleCancelReview}
            onPublish={handlePublish}
            onCancelPublish={handleCancelPublish}
            onInviteCollaborate={handleInviteCollaborate}
            hasValidationErrors={hasValidationErrors}
          />
        </div>

        {/* 编辑任务映射弹窗 */}
        <Dialog
          open={!!editingTaskMapping}
          onOpenChange={(open) => !open && setEditingTaskMapping(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>配置自定义等级映射</DialogTitle>
              <DialogDescription>
                为能力点「{editingTaskMapping?.taskName}」配置自定义等级映射规则
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-3">
              {editingTaskMapping?.mapping.map((level, idx) => (
                <div
                  key={level.level}
                  className="flex items-center gap-3 p-3 rounded-md bg-secondary/50 border border-border"
                >
                  <span className="w-16 font-medium text-sm">{level.level}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={level.min}
                      onChange={(e) => {
                        const newMapping = [...editingTaskMapping.mapping]
                        newMapping[idx] = { ...newMapping[idx], min: parseInt(e.target.value, 10) || 0 }
                        setEditingTaskMapping({ ...editingTaskMapping, mapping: newMapping })
                      }}
                      className="w-20 h-8 text-center"
                    />
                    <span className="text-muted-foreground">~</span>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={level.max}
                      onChange={(e) => {
                        const newMapping = [...editingTaskMapping.mapping]
                        newMapping[idx] = { ...newMapping[idx], max: parseInt(e.target.value, 10) || 0 }
                        setEditingTaskMapping({ ...editingTaskMapping, mapping: newMapping })
                      }}
                      className="w-20 h-8 text-center"
                    />
                    <span className="text-muted-foreground text-sm">分</span>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTaskMapping(null)}>
                取消
              </Button>
              <Button onClick={handleSaveTaskMapping}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Toaster />
      </div>
    </TooltipProvider>
  )
}

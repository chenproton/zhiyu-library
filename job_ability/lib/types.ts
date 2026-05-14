// 规则状态类型
export type RuleStatus =
  | 'draft' // 草稿
  | 'not_submitted' // 未提交
  | 'reviewing' // 审批中
  | 'rejected' // 已驳回
  | 'ready' // 待发布
  | 'published' // 已发布
  | 'none' // 无规则

// 等级映射
export interface LevelMapping {
  level: string
  min: number
  max: number
}

// 关联任务
export interface RelatedTask {
  id: string
  name: string
  maxScore: number
  weight: number
}

// 能力点
export interface AbilityPoint {
  id: string
  name: string
  description: string
  mappingType: 'inherit' | 'custom'
  customMapping?: LevelMapping[]
  requiredLevel: string // 岗位所需掌握度
  relatedTasks: RelatedTask[]
}

// 能力项
export interface AbilityItem {
  id: string
  name: string
  abilityPoints: AbilityPoint[]
}

// 岗位认证规则
export interface CertificationRule {
  id: string
  positionName: string
  status: RuleStatus
  ruleSource: 'inherit' | 'custom'
  abilityItems: AbilityItem[]
}

// 岗位信息（列表页使用）
export interface Position {
  id: string
  name: string
  positionCode: string
  professionalDirection: string
  relatedAbilityCount: number
  ruleStatus: RuleStatus
  lastUpdated: string
  updatedBy: string
}

// 操作项配置
export const actionConfig: Record<string, {
  label: string
  showInStatus: RuleStatus[]
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
}> = {
  config: {
    label: '配置规则',
    showInStatus: ['draft', 'not_submitted', 'rejected', 'ready', 'published', 'none'],
    variant: 'default',
  },
  invite: {
    label: '邀请共建',
    showInStatus: ['draft', 'not_submitted'],
    variant: 'outline',
  },
  cancelApproval: {
    label: '取消审批',
    showInStatus: ['reviewing'],
    variant: 'destructive',
  },
  publish: {
    label: '发布',
    showInStatus: ['ready'],
    variant: 'default',
  },
  unpublish: {
    label: '取消发布',
    showInStatus: ['published'],
    variant: 'destructive',
  },
}

// 状态配置
export const statusConfig: Record<
  RuleStatus,
  { label: string; color: string; bgColor: string }
> = {
  draft: {
    label: '草稿',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
  },
  not_submitted: {
    label: '未提交',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
  },
  reviewing: {
    label: '审批中',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  rejected: {
    label: '已驳回',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  ready: {
    label: '待发布',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  published: {
    label: '已发布',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  none: {
    label: '无规则',
    color: 'text-slate-500',
    bgColor: 'bg-slate-50',
  },
}

// 默认等级映射表
export const defaultLevelMapping: LevelMapping[] = [
  { level: '不合格', min: 0, max: 60 },
  { level: '了解', min: 61, max: 70 },
  { level: '理解', min: 71, max: 80 },
  { level: '掌握', min: 81, max: 85 },
  { level: '熟练', min: 86, max: 95 },
  { level: '精通', min: 96, max: 100 },
]

// 根据分数计算等级
export function calculateLevel(
  score: number,
  mapping: LevelMapping[],
): string {
  for (const level of mapping) {
    if (score >= level.min && score <= level.max) {
      return level.level
    }
  }
  return '不合格'
}

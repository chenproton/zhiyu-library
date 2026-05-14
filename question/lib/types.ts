// 用户接口
export interface User {
  id: string
  name: string
  avatar?: string
  email: string
  department?: string
}

// 协作者接口
export interface Collaborator {
  userId: string
  role: 'owner' | 'editor' | 'viewer'
  addedAt: Date
}

// 难度等级
export type Difficulty = 'easy' | 'medium' | 'hard'

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
}

// 知识点
export interface KnowledgePoint {
  id: string
  name: string
}

// 批次分组
export interface Batch {
  id: string
  name: string
  description?: string
}

// 部门
export interface Department {
  id: string
  name: string
}

// 状态枚举
export type Status = 'draft' | 'unsubmitted' | 'pending' | 'rejected' | 'toPublish' | 'published'

// 状态中文映射
export const STATUS_LABELS: Record<Status, string> = {
  draft: '草稿',
  unsubmitted: '未提交',
  pending: '审批中',
  rejected: '已驳回',
  toPublish: '待发布',
  published: '已发布',
}

// 题目类型枚举
export type QuestionType = 'single' | 'multiple' | 'judge' | 'fill' | 'essay' | 'short_answer'

// 题目类型中文映射
export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  single: '单选题',
  multiple: '多选题',
  judge: '判断题',
  fill: '填空题',
  essay: '问答题',
  short_answer: '简答题',
}

// 题库接口
export interface QuestionBank {
  id: string
  name: string
  description: string
  coverUrl?: string
  status: Status
  questionCount: number
  collaboratorIds?: string[]
  collaboratorDeptIds?: string[]
  batchId?: string
  version: string
  ownerType: 'mine' | 'collaborate' | 'public'
  createdAt: Date
  updatedAt: Date
}

// 题目接口
export interface Question {
  id: string
  bankId: string
  type: QuestionType
  content: string
  options?: string[]
  answer: string | string[]
  analysis?: string
  score: number
  difficulty?: Difficulty
  knowledgePoints?: string[]
  creatorId?: string
  createdAt: Date
}

// 试卷中的题目（快照）
export interface ExamQuestion {
  id: string
  questionId: string
  type: QuestionType
  content: string
  options?: string[]
  answer: string | string[]
  analysis?: string
  score: number
  order: number
}

// 试卷接口
export interface Exam {
  id: string
  name: string
  description: string
  status: Status
  totalScore: number
  duration: number // 分钟
  questions: ExamQuestion[]
  collaboratorIds?: string[]
  collaboratorDeptIds?: string[]
  batchId?: string
  version: string
  ownerType: 'mine' | 'collaborate' | 'public'
  createdAt: Date
  updatedAt: Date
}

// 创建题库表单数据
export interface QuestionBankFormData {
  name: string
  description: string
  coverUrl?: string
  collaboratorIds?: string[]
  collaboratorDeptIds?: string[]
  batchId?: string
}

// 创建题目表单数据
export interface QuestionFormData {
  type: QuestionType
  content: string
  options?: string[]
  answer: string | string[]
  analysis?: string
  score: number
  difficulty?: Difficulty
  knowledgePoints?: string[]
}

// 随机抽题筛选条件
export interface RandomQuestionFilter {
  bankIds: string[]
  types: QuestionType[]
  difficulties: Difficulty[]
  knowledgePoints: string[]
  count: number
}

// 创建试卷表单数据
export interface ExamFormData {
  name: string
  description: string
  duration: number
  collaboratorIds?: string[]
  collaboratorDeptIds?: string[]
  batchId?: string
}

// 状态流转操作
export type StatusAction = 
  | 'save_draft'      // 保存草稿
  | 'submit'          // 提交审批
  | 'withdraw'        // 撤回
  | 'approve'         // 通过
  | 'reject'          // 驳回
  | 'publish'         // 发布

// 状态流转规则
export const STATUS_TRANSITIONS: Record<StatusAction, { from: Status[], to: Status }> = {
  save_draft: { from: ['draft', 'unsubmitted', 'rejected'], to: 'draft' },
  submit: { from: ['draft', 'unsubmitted', 'rejected'], to: 'pending' },
  withdraw: { from: ['pending'], to: 'unsubmitted' },
  approve: { from: ['pending'], to: 'toPublish' },
  reject: { from: ['pending'], to: 'rejected' },
  publish: { from: ['toPublish'], to: 'published' },
}

// 判断操作是否可用
export function canPerformAction(currentStatus: Status, action: StatusAction): boolean {
  const transition = STATUS_TRANSITIONS[action]
  return transition.from.includes(currentStatus)
}

// 获取下一个状态
export function getNextStatus(action: StatusAction): Status {
  return STATUS_TRANSITIONS[action].to
}

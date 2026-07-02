export type ResourceType = 'video' | 'document' | 'spreadsheet' | 'image' | 'link' | 'audio' | 'venue' | 'equipment' | 'software' | 'simulation' | 'other' | 'knowledge-point' | 'ability-point'

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  video: '视频',
  document: '文档',
  spreadsheet: '表格',
  image: '图片',
  link: '链接',
  audio: '音频',
  venue: '场地',
  equipment: '仪器设备',
  software: '软件',
  simulation: '仿真',
  other: '其他',
  'knowledge-point': '知识点',
  'ability-point': '能力点',
}

export type ResourceStatus = 'pending' | 'approved' | 'rejected'

export const RESOURCE_STATUS_LABELS: Record<ResourceStatus, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已驳回',
}

export type AbilityAttribute = '知识' | '素养' | '技能'
export type AbilityMastery = 'understand' | 'comprehend' | 'master' | 'proficient' | 'expert'

export const ALL_ABILITY_ATTRIBUTES: AbilityAttribute[] = ['知识', '素养', '技能']

export const ABILITY_MASTERY_LABELS: Record<AbilityMastery, string> = {
  understand: '了解',
  comprehend: '理解',
  master: '掌握',
  proficient: '熟练',
  expert: '精通',
}

export type UserRole = 'teacher' | 'admin'

export interface User {
  id: string
  name: string
  department: string
  avatar?: string
  role: UserRole
}

export interface Resource {
  id: string
  title: string
  type: ResourceType
  description: string
  content: string
  tags: string[]
  status: ResourceStatus
  usageCount: number
  favoriteCount: number
  uploaderId: string
  uploaderName: string
  uploaderDepartment: string
  department: string
  major?: string
  rejectReason?: string
  venueCapacity?: number
  venueLocation?: string
  venueOpenTime?: string
  venueContact?: string
  equipmentLocation?: string
  equipmentQuantity?: number
  softwareVersion?: string
  softwareLicense?: string
  softwareDownloadUrl?: string
  softwareInstallerUrl?: string
  linkUrl?: string
  fileUrl?: string
  knowledgeCode?: string
  knowledgeCourses?: string
  abilityAttribute?: AbilityAttribute
  isShared?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ResourceFormData {
  title: string
  type: ResourceType
  content: string
  description: string
  tags: string[]
  major?: string
  venueCapacity?: number
  venueLocation?: string
  venueOpenTime?: string
  venueContact?: string
  equipmentLocation?: string
  equipmentQuantity?: number
  softwareVersion?: string
  softwareLicense?: string
  softwareDownloadUrl?: string
  softwareInstallerUrl?: string
  linkUrl?: string
  fileUrl?: string
  knowledgeCode?: string
  knowledgeCourses?: string
  abilityAttribute?: AbilityAttribute
}

export const COLLEGES = [
  '计算机科学与技术学院',
  '电子信息工程学院',
  '机械工程学院',
  '土木工程学院',
  '经济管理学院',
  '外国语学院',
  '理学院',
  '艺术学院',
 ]

export const MAJORS: Record<string, string[]> = {
  '计算机科学与技术学院': ['计算机科学与技术', '软件工程', '人工智能', '网络工程'],
  '电子信息工程学院': ['电子信息工程', '通信工程', '微电子科学与工程'],
  '机械工程学院': ['机械设计制造及其自动化', '车辆工程'],
  '土木工程学院': ['土木工程', '建筑学', '给排水科学与工程'],
  '经济管理学院': ['工商管理', '会计学', '金融学'],
  '外国语学院': ['英语', '日语'],
  '理学院': ['数学与应用数学', '物理学', '应用化学'],
  '艺术学院': ['视觉传达设计', '环境设计'],
}

export function getAllMajors(): string[] {
  return Object.values(MAJORS).flat()
}

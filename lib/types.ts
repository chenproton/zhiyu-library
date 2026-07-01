export type ResourceType = 'video' | 'document' | 'spreadsheet' | 'image' | 'link' | 'audio' | 'venue' | 'equipment' | 'software' | 'simulation' | 'other'

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
}

export type ResourceStatus = 'pending' | 'approved' | 'rejected'

export const RESOURCE_STATUS_LABELS: Record<ResourceStatus, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已驳回',
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
  rejectReason?: string
  venueCapacity?: number
  venueLocation?: string
  venueFacilities?: string
  venueOpenTime?: string
  venueContact?: string
  equipmentModel?: string
  equipmentSpec?: string
  equipmentLocation?: string
  equipmentManager?: string
  equipmentQuantity?: number
  softwareVersion?: string
  softwareEnv?: string
  softwareLicense?: string
  softwareDownloadUrl?: string
  simulationPlatform?: string
  simulationDomain?: string
  simulationInstructions?: string
  linkUrl?: string
  linkSource?: string
  fileUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface ResourceFormData {
  title: string
  type: ResourceType
  content: string
  description: string
  tags: string[]
  venueCapacity?: number
  venueLocation?: string
  venueFacilities?: string
  venueOpenTime?: string
  venueContact?: string
  equipmentModel?: string
  equipmentSpec?: string
  equipmentLocation?: string
  equipmentManager?: string
  equipmentQuantity?: number
  softwareVersion?: string
  softwareEnv?: string
  softwareLicense?: string
  softwareDownloadUrl?: string
  simulationPlatform?: string
  simulationDomain?: string
  simulationInstructions?: string
  linkUrl?: string
  linkSource?: string
  fileUrl?: string
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

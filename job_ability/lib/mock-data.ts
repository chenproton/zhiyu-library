import type { CertificationRule, AbilityItem, RelatedTask, Position } from './types'

// 可选任务列表（用于任务选择器）
export const availableTasks: RelatedTask[] = [
  { id: 'task-1', name: '前端基础知识测试', maxScore: 100, weight: 0 },
  { id: 'task-2', name: 'JavaScript 编程实践', maxScore: 100, weight: 0 },
  { id: 'task-3', name: 'React 框架应用', maxScore: 100, weight: 0 },
  { id: 'task-4', name: 'CSS 布局与样式', maxScore: 100, weight: 0 },
  { id: 'task-5', name: '项目实战考核', maxScore: 150, weight: 0 },
  { id: 'task-6', name: '代码审查能力测试', maxScore: 100, weight: 0 },
  { id: 'task-7', name: '技术文档撰写', maxScore: 80, weight: 0 },
  { id: 'task-8', name: '团队协作评估', maxScore: 100, weight: 0 },
  { id: 'task-9', name: '性能优化实践', maxScore: 100, weight: 0 },
  { id: 'task-10', name: '安全编码规范', maxScore: 100, weight: 0 },
]

// 能力项数据
export const abilityItems: AbilityItem[] = [
  {
    id: 'item-1',
    name: '岗位与行业认知',
    abilityPoints: [
      {
        id: 'point-1-1',
        name: '行业发展趋势理解',
        description:
          '能够理解前端开发行业的发展趋势，包括新技术、新框架、新工具的出现和演进。具备对技术发展方向的敏锐洞察力。',
        mappingType: 'inherit',
        requiredLevel: '掌握',
        relatedTasks: [
          { id: 'task-1', name: '前端基础知识测试', maxScore: 100, weight: 60 },
          { id: 'task-7', name: '技术文档撰写', maxScore: 80, weight: 40 },
        ],
      },
      {
        id: 'point-1-2',
        name: '岗位职责认知',
        description:
          '清晰理解前端开发工程师的岗位职责，包括页面开发、性能优化、用户体验提升等核心工作内容。',
        mappingType: 'inherit',
        requiredLevel: '理解',
        relatedTasks: [],
      },
    ],
  },
  {
    id: 'item-2',
    name: '专业技能',
    abilityPoints: [
      {
        id: 'point-2-1',
        name: 'JavaScript 编程能力',
        description:
          '熟练掌握 JavaScript 语言特性，包括 ES6+ 语法、异步编程、面向对象编程等核心概念和实践技能。',
        mappingType: 'custom',
        requiredLevel: '熟练',
        customMapping: [
          { level: '不合格', min: 0, max: 50 },
          { level: '了解', min: 51, max: 65 },
          { level: '理解', min: 66, max: 75 },
          { level: '掌握', min: 76, max: 85 },
          { level: '熟练', min: 86, max: 92 },
          { level: '精通', min: 93, max: 100 },
        ],
        relatedTasks: [
          {
            id: 'task-2',
            name: 'JavaScript 编程实践',
            maxScore: 100,
            weight: 50,
          },
          { id: 'task-5', name: '项目实战考核', maxScore: 150, weight: 30 },
          { id: 'task-9', name: '性能优化实践', maxScore: 100, weight: 20 },
        ],
      },
      {
        id: 'point-2-2',
        name: 'React 框架应用',
        description:
          '熟练使用 React 框架进行组件化开发，理解虚拟 DOM、Hooks、状态管理等核心概念。',
        mappingType: 'inherit',
        requiredLevel: '熟练',
        relatedTasks: [
          { id: 'task-3', name: 'React 框架应用', maxScore: 100, weight: 70 },
          { id: 'task-5', name: '项目实战考核', maxScore: 150, weight: 30 },
        ],
      },
      {
        id: 'point-2-3',
        name: 'CSS 布局能力',
        description:
          '精通 CSS 布局技术，包括 Flexbox、Grid、响应式设计等，能够实现复杂的页面布局。',
        mappingType: 'inherit',
        requiredLevel: '掌握',
        relatedTasks: [
          { id: 'task-4', name: 'CSS 布局与样式', maxScore: 100, weight: 100 },
        ],
      },
    ],
  },
  {
    id: 'item-3',
    name: '软技能',
    abilityPoints: [
      {
        id: 'point-3-1',
        name: '团队协作能力',
        description:
          '具备良好的团队协作能力，能够与产品、设计、后端等角色有效沟通，推动项目顺利进行。',
        mappingType: 'inherit',
        requiredLevel: '掌握',
        relatedTasks: [
          { id: 'task-8', name: '团队协作评估', maxScore: 100, weight: 100 },
        ],
      },
      {
        id: 'point-3-2',
        name: '技术文档能力',
        description:
          '能够编写清晰、规范的技术文档，包括接口文档、组件文档、项目说明等。',
        mappingType: 'inherit',
        requiredLevel: '理解',
        relatedTasks: [
          { id: 'task-7', name: '技术文档撰写', maxScore: 80, weight: 100 },
        ],
      },
    ],
  },
]

// 初始认证规则数据
export const initialRule: CertificationRule = {
  id: 'rule-1',
  positionName: '前端开发工程师',
  status: 'draft',
  ruleSource: 'custom',
  abilityItems: abilityItems,
}

// 岗位列表数据
export const positionsList: Position[] = [
  {
    id: 'pos-1',
    name: '前端开发工程师',
    positionCode: 'FE-001',
    professionalDirection: '前端开发',
    relatedAbilityCount: 12,
    ruleStatus: 'published',
    lastUpdated: '2024-01-15',
    updatedBy: '张三',
  },
  {
    id: 'pos-2',
    name: '后端开发工程师',
    positionCode: 'BE-001',
    professionalDirection: '后端开发',
    relatedAbilityCount: 15,
    ruleStatus: 'published',
    lastUpdated: '2024-01-12',
    updatedBy: '李四',
  },
  {
    id: 'pos-3',
    name: '产品经理',
    positionCode: 'PM-001',
    professionalDirection: '产品管理',
    relatedAbilityCount: 8,
    ruleStatus: 'ready',
    lastUpdated: '2024-01-18',
    updatedBy: '王五',
  },
  {
    id: 'pos-4',
    name: 'UI设计师',
    positionCode: 'UI-001',
    professionalDirection: '视觉设计',
    relatedAbilityCount: 10,
    ruleStatus: 'reviewing',
    lastUpdated: '2024-01-20',
    updatedBy: '赵六',
  },
  {
    id: 'pos-5',
    name: '测试工程师',
    positionCode: 'QA-001',
    professionalDirection: '质量保障',
    relatedAbilityCount: 9,
    ruleStatus: 'draft',
    lastUpdated: '2024-01-10',
    updatedBy: '钱七',
  },
  {
    id: 'pos-6',
    name: '运维工程师',
    positionCode: 'OPS-001',
    professionalDirection: '运维管理',
    relatedAbilityCount: 11,
    ruleStatus: 'rejected',
    lastUpdated: '2024-01-08',
    updatedBy: '孙八',
  },
  {
    id: 'pos-7',
    name: '数据分析师',
    positionCode: 'DA-001',
    professionalDirection: '数据分析',
    relatedAbilityCount: 7,
    ruleStatus: 'not_submitted',
    lastUpdated: '2024-01-05',
    updatedBy: '周九',
  },
  {
    id: 'pos-8',
    name: '项目经理',
    positionCode: 'PJM-001',
    professionalDirection: '项目管理',
    relatedAbilityCount: 6,
    ruleStatus: 'published',
    lastUpdated: '2024-01-02',
    updatedBy: '吴十',
  },
  {
    id: 'pos-9',
    name: '技术总监',
    positionCode: 'CTO-001',
    professionalDirection: '技术管理',
    relatedAbilityCount: 0,
    ruleStatus: 'none',
    lastUpdated: '-',
    updatedBy: '-',
  },
  {
    id: 'pos-10',
    name: '架构师',
    positionCode: 'ARCH-001',
    professionalDirection: '架构设计',
    relatedAbilityCount: 14,
    ruleStatus: 'draft',
    lastUpdated: '2024-01-19',
    updatedBy: '郑十一',
  },
]

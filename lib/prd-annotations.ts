/**
 * PRD 需求文档标注内容 —— 能力测评中心
 * 覆盖：题库管理、试卷管理、考试管理、岗位能力认定、测评结果管理等核心模块
 */

export interface AnnotationItem {
  id: string
  title: string
  content: string
}

// ==================== 题库管理 (question-banks) ====================

export const questionBankAnnotations: Record<string, AnnotationItem> = {
  "qb-page-title": {
    id: "qb-page-title",
    title: "题库管理",
    content: "题库管理是能力测评中心的资源管理中心，支持教研管理员和教师查看、筛选、管理自己创建/共建/公共的题库资源。支持列表视图和批次分组视图两种展示模式。",
  },
  "qb-btn-config-approval": {
    id: "qb-btn-config-approval",
    title: "配置审批流程",
    content: "点击打开「审批流程管理」弹窗。教研管理员可预设校内审批流模板，供批次关联使用。包含流程名称、流程说明、审批步骤数等信息。",
  },
  "qb-btn-config-batch": {
    id: "qb-btn-config-batch",
    title: "配置批次分组",
    content: "点击打开「批次分组管理」弹窗。用于管理题库/试卷建设批次分组，关联审批流程。支持新增批次，列表展示分组名称、批次编号、审批流程、状态。",
  },
  "qb-btn-import": {
    id: "qb-btn-import",
    title: "导入题库",
    content: "点击打开「导入题库」弹窗。支持 Excel/JSON 格式批量导入题目数据，上传区域为虚线边框拖拽区。提示：支持 .xlsx, .json 格式，单个文件不超过 10MB。",
  },
  "qb-btn-create": {
    id: "qb-btn-create",
    title: "新建题库",
    content: "点击打开「新建题库」弹窗，填写题库名称、简介等信息后创建。创建后自动跳转到题库详情页，可继续添加题目。",
  },
  "qb-tab-mine": {
    id: "qb-tab-mine",
    title: "我的题库",
    content: "展示当前用户创建的题库。切换 Tab 时清空已选项和筛选条件。",
  },
  "qb-tab-collab": {
    id: "qb-tab-collab",
    title: "共建题库",
    content: "展示当前用户在共建人列表中的题库。切换 Tab 时清空已选项和筛选条件。",
  },
  "qb-tab-public": {
    id: "qb-tab-public",
    title: "公共题库",
    content: "展示全部已发布题库，不展示统计面板。切换 Tab 时清空已选项和筛选条件。",
  },
  "qb-view-list": {
    id: "qb-view-list",
    title: "资源列表视图",
    content: "以表格形式展示题库列表，包含题库名称、简介、题目数量、所属批次、创建人、共建人、状态、创建/更新时间等字段。",
  },
  "qb-view-batch": {
    id: "qb-view-batch",
    title: "批次分组视图",
    content: "按批次分组展示题库，每个批次作为一个卡片/分组，展示该批次下的所有题库。",
  },
  "qb-stat-total": {
    id: "qb-stat-total",
    title: "题库总数",
    content: "当前用户可见的题库总数量（根据 Tab 筛选条件统计）。",
  },
  "qb-stat-draft": {
    id: "qb-stat-draft",
    title: "草稿",
    content: "草稿状态的题库数量。草稿状态可编辑、可删除、可克隆。",
  },
  "qb-stat-pending": {
    id: "qb-stat-pending",
    title: "审批中",
    content: "审批中状态的题库数量。审批中状态可撤回审批、可删除、可克隆。",
  },
  "qb-stat-toPublish": {
    id: "qb-stat-toPublish",
    title: "待发布",
    content: "待发布状态的题库数量。待发布状态可发布、可编辑、可删除、可克隆。",
  },
  "qb-stat-published": {
    id: "qb-stat-published",
    title: "已发布",
    content: "已发布状态的题库数量。已发布状态可取消发布、可克隆。",
  },
  "qb-search": {
    id: "qb-search",
    title: "搜索题库",
    content: "按题库名称关键词搜索，支持实时过滤。",
  },
  "qb-filter-status": {
    id: "qb-filter-status",
    title: "状态筛选",
    content: "按题库状态筛选：全部、草稿、已发布。",
  },
  "qb-col-name": {
    id: "qb-col-name",
    title: "题库名称",
    content: "题库的名称标识。默认题库会显示「草稿库」标签，不可删除。点击名称可进入题库详情页。",
  },
  "qb-col-desc": {
    id: "qb-col-desc",
    title: "题库简介",
    content: "题库的简要描述信息，帮助用户快速了解题库内容。",
  },
  "qb-col-count": {
    id: "qb-col-count",
    title: "题目数量",
    content: "该题库中包含的题目总数量。",
  },
  "qb-col-batch": {
    id: "qb-col-batch",
    title: "所属批次",
    content: "题库关联的批次分组名称。未关联批次显示为「-」。",
  },
  "qb-col-creator": {
    id: "qb-col-creator",
    title: "创建人",
    content: "创建该题库的用户名称。",
  },
  "qb-col-collaborators": {
    id: "qb-col-collaborators",
    title: "共建人",
    content: "参与共建该题库的用户列表。默认题库不显示共建人。",
  },
  "qb-col-status": {
    id: "qb-col-status",
    title: "状态",
    content: "题库当前状态：草稿、已发布。不同状态下可操作的功能不同。",
  },
  "qb-col-actions": {
    id: "qb-col-actions",
    title: "操作",
    content: "对题库进行查看、编辑、删除、状态变更、邀请共建等操作。默认题库不可删除。",
  },
}

// ==================== 题库详情 (question-banks/[id]) ====================

export const questionBankDetailAnnotations: Record<string, AnnotationItem> = {
  "qbd-btn-back": {
    id: "qbd-btn-back",
    title: "返回题库列表",
    content: "点击返回题库管理列表页。",
  },
  "qbd-btn-edit-bank": {
    id: "qbd-btn-edit-bank",
    title: "编辑题库信息",
    content: "点击打开弹窗，修改题库名称和简介。",
  },
  "qbd-btn-delete-bank": {
    id: "qbd-btn-delete-bank",
    title: "删除题库",
    content: "删除当前题库及其中的所有题目。默认题库不可删除，会提示「默认题库不可删除」。",
  },
  "qbd-btn-add-question": {
    id: "qbd-btn-add-question",
    title: "添加题目",
    content: "点击打开「添加题目」弹窗，支持单选题、多选题、判断题、填空题、简答题、编程题等多种题型。",
  },
  "qbd-btn-import": {
    id: "qbd-btn-import",
    title: "导入题目",
    content: "点击打开「导入题目」弹窗，支持 Excel 批量导入。",
  },
  "qbd-btn-batch-delete": {
    id: "qbd-btn-batch-delete",
    title: "批量删除",
    content: "勾选题目后点击批量删除选中的题目。",
  },
  "qbd-btn-batch-move": {
    id: "qbd-btn-batch-move",
    title: "批量移动",
    content: "勾选题目后点击批量移动到其他题库。",
  },
  "qbd-search": {
    id: "qbd-search",
    title: "搜索题目",
    content: "按题目内容关键词搜索。",
  },
  "qbd-filter-type": {
    id: "qbd-filter-type",
    title: "题型筛选",
    content: "按题目类型筛选：全部、单选题、多选题、判断题、填空题、简答题、编程题。",
  },
  "qbd-filter-creator": {
    id: "qbd-filter-creator",
    title: "创建人筛选",
    content: "按题目创建人筛选，下拉列表展示所有有题目的创建人。",
  },
  "qbd-col-content": {
    id: "qbd-col-content",
    title: "题目内容",
    content: "题目的题干内容，过长时自动截断显示。",
  },
  "qbd-col-type": {
    id: "qbd-col-type",
    title: "题型",
    content: "题目的类型标识，如单选、多选、判断、填空、简答、编程等。",
  },
  "qbd-col-difficulty": {
    id: "qbd-col-difficulty",
    title: "难度",
    content: "题目的难度等级：简单、中等、困难。",
  },
  "qbd-col-score": {
    id: "qbd-col-score",
    title: "分值",
    content: "该题目的默认分值。",
  },
  "qbd-col-creator": {
    id: "qbd-col-creator",
    title: "创建人",
    content: "创建该题目的用户。",
  },
  "qbd-col-dept": {
    id: "qbd-col-dept",
    title: "所属院系",
    content: "题目关联的院系/部门。",
  },
  "qbd-col-actions": {
    id: "qbd-col-actions",
    title: "题目操作",
    content: "对单个题目进行预览、编辑、删除操作。以纯文字 DropdownMenu 形式展示。",
  },
  "qbd-col-source": {
    id: "qbd-col-source",
    title: "添加来源",
    content: "题目的添加来源渠道，如手动添加、导入等。",
  },
}

// ==================== 试卷管理 (exams) ====================

export const examAnnotations: Record<string, AnnotationItem> = {
  "exam-page-title": {
    id: "exam-page-title",
    title: "试卷管理",
    content: "试卷管理是能力测评中心的核心功能之一，支持教研管理员和教师创建、编辑、管理试卷资源。支持列表视图和批次分组视图。",
  },
  "exam-btn-config-approval": {
    id: "exam-btn-config-approval",
    title: "配置审批流程",
    content: "点击打开「审批流程管理」弹窗。教研管理员可预设校内审批流模板，供试卷批次关联使用。",
  },
  "exam-btn-config-batch": {
    id: "exam-btn-config-batch",
    title: "配置批次分组",
    content: "点击打开「批次分组管理」弹窗。用于管理试卷建设批次分组，关联审批流程。",
  },
  "exam-btn-import": {
    id: "exam-btn-import",
    title: "导入试卷",
    content: "点击打开「导入试卷」弹窗，支持 Excel/JSON 格式批量导入试卷数据。",
  },
  "exam-btn-create": {
    id: "exam-btn-create",
    title: "新建试卷",
    content: "点击打开「新建试卷」弹窗，填写试卷名称、简介等信息后创建。创建后自动跳转到试卷编辑页。",
  },
  "exam-tab-mine": {
    id: "exam-tab-mine",
    title: "我的试卷",
    content: "展示当前用户创建的试卷。",
  },
  "exam-tab-collab": {
    id: "exam-tab-collab",
    title: "共建试卷",
    content: "展示当前用户在共建人列表中的试卷。",
  },
  "exam-tab-public": {
    id: "exam-tab-public",
    title: "公共试卷",
    content: "展示全部已发布试卷。",
  },
  "exam-stat-total": {
    id: "exam-stat-total",
    title: "试卷总数",
    content: "当前用户可见的试卷总数量。",
  },
  "exam-stat-draft": {
    id: "exam-stat-draft",
    title: "草稿",
    content: "草稿状态的试卷数量。",
  },
  "exam-stat-pending": {
    id: "exam-stat-pending",
    title: "审批中",
    content: "审批中状态的试卷数量。",
  },
  "exam-stat-toPublish": {
    id: "exam-stat-toPublish",
    title: "待发布",
    content: "待发布状态的试卷数量。",
  },
  "exam-stat-published": {
    id: "exam-stat-published",
    title: "已发布",
    content: "已发布状态的试卷数量。",
  },
  "exam-col-name": {
    id: "exam-col-name",
    title: "试卷名称",
    content: "试卷的名称标识。点击可进入试卷详情/编辑页。",
  },
  "exam-col-desc": {
    id: "exam-col-desc",
    title: "试卷简介",
    content: "试卷的简要描述信息。",
  },
  "exam-col-question-count": {
    id: "exam-col-question-count",
    title: "题目数量",
    content: "试卷中包含的题目数量。",
  },
  "exam-col-total-score": {
    id: "exam-col-total-score",
    title: "总分",
    content: "试卷的总分值。",
  },
  "exam-col-batch": {
    id: "exam-col-batch",
    title: "所属批次",
    content: "试卷关联的批次分组。",
  },
  "exam-col-creator": {
    id: "exam-col-creator",
    title: "创建人",
    content: "创建该试卷的用户。",
  },
  "exam-col-collaborators": {
    id: "exam-col-collaborators",
    title: "共建人",
    content: "参与共建该试卷的用户列表。",
  },
  "exam-col-status": {
    id: "exam-col-status",
    title: "状态",
    content: "试卷当前状态。",
  },
  "exam-col-created": {
    id: "exam-col-created",
    title: "创建时间",
    content: "试卷的创建时间。",
  },
  "exam-col-updated": {
    id: "exam-col-updated",
    title: "更新时间",
    content: "试卷的最后更新时间。",
  },
  "exam-col-actions": {
    id: "exam-col-actions",
    title: "操作",
    content: "对试卷进行查看、编辑、删除、状态变更、预览、邀请共建等操作。",
  },
}

// ==================== 考试管理 (exam-usage) ====================

export const examUsageAnnotations: Record<string, AnnotationItem> = {
  "eu-page-title": {
    id: "eu-page-title",
    title: "考试管理",
    content: "考试管理用于查看和管理试卷在各模块（场景、课程、教学考试）的使用情况。支持创建在线考试、配置考试参数、查看考试结果。",
  },
  "eu-btn-create": {
    id: "eu-btn-create",
    title: "添加考试",
    content: "点击打开「创建在线考试」弹窗，配置考试基本信息，选择试卷并设置考试参数。包含选择试卷、考试名称、简介、须知、封面、面向对象（学生/教师）、参考学生/人员、考试时间、时长等配置项。",
  },
  "eu-stat-total": {
    id: "eu-stat-total",
    title: "考试总数",
    content: "所有考试记录的总数量。",
  },
  "eu-stat-pending": {
    id: "eu-stat-pending",
    title: "未开始",
    content: "状态为「未开始」的考试数量。",
  },
  "eu-stat-active": {
    id: "eu-stat-active",
    title: "进行中",
    content: "状态为「进行中」的考试数量。",
  },
  "eu-stat-ended": {
    id: "eu-stat-ended",
    title: "已结束",
    content: "状态为「已结束」的考试数量。",
  },
  "eu-search": {
    id: "eu-search",
    title: "搜索考试",
    content: "按试卷名称或场景名称关键词搜索。",
  },
  "eu-filter-scene": {
    id: "eu-filter-scene",
    title: "场景筛选",
    content: "按使用场景筛选：全部、场景、课程。",
  },
  "eu-filter-type": {
    id: "eu-filter-type",
    title: "类型筛选",
    content: "按考试类型筛选：全部、随堂测、教学考试。",
  },
  "eu-col-exam-name": {
    id: "eu-col-exam-name",
    title: "试卷名称",
    content: "关联的试卷名称。",
  },
  "eu-col-scene": {
    id: "eu-col-scene",
    title: "使用场景",
    content: "考试的使用场景类型：场景、课程、教学考试。",
  },
  "eu-col-target": {
    id: "eu-col-target",
    title: "面向对象",
    content: "考试的面向对象：学生或教师。非教学考试显示为「-」。",
  },
  "eu-col-desc": {
    id: "eu-col-desc",
    title: "考试描述",
    content: "考试的描述信息。",
  },
  "eu-col-duration": {
    id: "eu-col-duration",
    title: "考试时长",
    content: "考试规定的时长，单位为分钟。",
  },
  "eu-col-participants": {
    id: "eu-col-participants",
    title: "参考人数",
    content: "参加考试的学生/教师人数。",
  },
  "eu-col-time": {
    id: "eu-col-time",
    title: "考试开放时间",
    content: "考试的开始时间和结束时间。",
  },
  "eu-col-pass": {
    id: "eu-col-pass",
    title: "及格人数",
    content: "考试及格的人数统计。",
  },
  "eu-col-status": {
    id: "eu-col-status",
    title: "考试状态",
    content: "考试当前状态：未开始（灰色）、进行中（绿色）、已结束（边框）。",
  },
  "eu-col-actions": {
    id: "eu-col-actions",
    title: "操作",
    content: "分享考试、查看考试结果、编辑、删除等操作。以 DropdownMenu 形式展示。已结束考试可查看结果。",
  },
  "eu-dialog-exam-select": {
    id: "eu-dialog-exam-select",
    title: "选择试卷",
    content: "使用 Popover + Command 搜索组件选择试卷。支持下拉展开和关键词搜索，展示试卷名称、总分、题目数量。",
  },
  "eu-dialog-target-student": {
    id: "eu-dialog-target-student",
    title: "参考学生",
    content: "选择参考学生时，使用组织树结构（学院→年级→班级→学生）进行多选。支持搜索学生或班级，已选学生在底部以标签形式展示，可单个移除。",
  },
  "eu-dialog-target-teacher": {
    id: "eu-dialog-target-teacher",
    title: "参考人员",
    content: "面向教师时，从用户列表中选择参考人员。",
  },
  "eu-dialog-open-type": {
    id: "eu-dialog-open-type",
    title: "考试时间类型",
    content: "考试时间配置：随时开放、定时开放、手动开放三种模式。",
  },
}

// ==================== 考试结果 (exam-usage/results) ====================

export const examUsageResultsAnnotations: Record<string, AnnotationItem> = {
  "eur-page-title": {
    id: "eur-page-title",
    title: "考试结果",
    content: "展示某次在线考试的详细结果，包括所有参考学生的成绩、排名、及格情况等信息。",
  },
  "eur-btn-back": {
    id: "eur-btn-back",
    title: "返回考试管理",
    content: "点击返回考试管理列表页。",
  },
  "eur-btn-export": {
    id: "eur-btn-export",
    title: "导出成绩",
    content: "点击导出考试成绩数据。",
  },
  "eur-col-rank": {
    id: "eur-col-rank",
    title: "排名",
    content: "学生按分数从高到低排序后的名次。同分情况下按提交时间先后排序。",
  },
  "eur-col-student": {
    id: "eur-col-student",
    title: "学生名称",
    content: "参考学生的姓名。",
  },
  "eur-col-student-id": {
    id: "eur-col-student-id",
    title: "学号",
    content: "学生的学号。",
  },
  "eur-col-class": {
    id: "eur-col-class",
    title: "班级",
    content: "学生所属班级。",
  },
  "eur-col-grade": {
    id: "eur-col-grade",
    title: "年级",
    content: "学生所属年级。",
  },
  "eur-col-major": {
    id: "eur-col-major",
    title: "专业",
    content: "学生所属专业。",
  },
  "eur-col-score": {
    id: "eur-col-score",
    title: "成绩",
    content: "学生的考试得分。",
  },
  "eur-col-total": {
    id: "eur-col-total",
    title: "总分",
    content: "试卷的总分值。",
  },
  "eur-col-pass": {
    id: "eur-col-pass",
    title: "是否及格",
    content: "学生成绩是否达到及格线（60分）。显示为「及格」或「不及格」。",
  },
  "eur-col-submit-time": {
    id: "eur-col-submit-time",
    title: "提交时间",
    content: "学生提交答卷的时间。",
  },
  "eur-col-actions": {
    id: "eur-col-actions",
    title: "操作",
    content: "查看学生答卷详情。",
  },
}

// ==================== 岗位能力认定结果 (job-ability/results) ====================

export const jobAbilityResultsAnnotations: Record<string, AnnotationItem> = {
  "jar-page-title": {
    id: "jar-page-title",
    title: "岗位能力认定结果",
    content: "展示各岗位下学生的能力认定结果，包括达标率、胜任度、认定得分等核心指标。左侧为岗位导航，右侧为选中岗位的结果列表。",
  },
  "jar-position-list": {
    id: "jar-position-list",
    title: "岗位列表",
    content: "左侧岗位导航栏，只展示有认定结果的岗位。默认自动选中第一个岗位。点击岗位切换右侧结果展示。显示岗位名称、岗位编码和该岗位的结果人数。",
  },
  "jar-search": {
    id: "jar-search",
    title: "搜索学生",
    content: "按学生姓名或岗位名称搜索认定结果。",
  },
  "jar-col-student": {
    id: "jar-col-student",
    title: "学生名称",
    content: "参与岗位能力认定的学生姓名。",
  },
  "jar-col-student-id": {
    id: "jar-col-student-id",
    title: "学号",
    content: "学生的学号。",
  },
  "jar-col-class": {
    id: "jar-col-class",
    title: "班级",
    content: "学生所属班级。",
  },
  "jar-col-major": {
    id: "jar-col-major",
    title: "专业",
    content: "学生所属专业。",
  },
  "jar-col-dept": {
    id: "jar-col-dept",
    title: "院系",
    content: "学生所属院系/学院。",
  },
  "jar-col-achievement": {
    id: "jar-col-achievement",
    title: "岗位能力达标率",
    content: "学生在该岗位下已达成能力点数量占总能力点数量的百分比。格式：XX%（已达成/总能力点 能力点达成）。",
  },
  "jar-col-competency": {
    id: "jar-col-competency",
    title: "岗位胜任度",
    content: "基于学生综合表现计算的岗位胜任度百分比，反映学生适应该岗位的程度。",
  },
  "jar-col-score": {
    id: "jar-col-score",
    title: "岗位能力认定得分",
    content: "学生在岗位能力认定中的综合得分。",
  },
  "jar-col-time": {
    id: "jar-col-time",
    title: "更新时间",
    content: "该认定结果的最后更新时间。",
  },
}

// ==================== 测评结果管理 (scene-task-results) ====================

export const sceneTaskResultsAnnotations: Record<string, AnnotationItem> = {
  "str-page-title": {
    id: "str-page-title",
    title: "测评结果管理",
    content: "查看场景任务、智慧课堂、在线课程的测评结果并进行评分。包含三个 Tab：场景任务、智慧课堂、在线课程。",
  },
  "str-tab-scene": {
    id: "str-tab-scene",
    title: "场景任务",
    content: "展示场景任务下的学生测评结果。左侧为场景+任务树，右侧为选中任务的学生提交列表。",
  },
  "str-tab-online": {
    id: "str-tab-online",
    title: "智慧课堂",
    content: "展示智慧课堂下的学生测评结果。左侧为课堂列表，右侧为选中课堂的学生列表。",
  },
  "str-tab-course": {
    id: "str-tab-course",
    title: "在线课程",
    content: "展示在线课程下的学生测评结果。左侧为课程+章节树，右侧为选中课程的学生列表。",
  },
  "str-scene-search": {
    id: "str-scene-search",
    title: "搜索场景/任务",
    content: "按场景名称、任务名称或考核形式关键词搜索。",
  },
  "str-scene-tree": {
    id: "str-scene-tree",
    title: "场景+任务树",
    content: "左侧树形结构，一级为场景（可展开/折叠），二级为任务。显示场景名称、场景编码、任务名称、任务类型（考核/训练）、考核形式、待评/已评数量。",
  },
  "str-scene-task-name": {
    id: "str-scene-task-name",
    title: "任务名称",
    content: "当前选中任务的名称，格式为「任务名称：xxx」。",
  },
  "str-scene-scenario-name": {
    id: "str-scene-scenario-name",
    title: "场景名称",
    content: "当前任务所属的场景名称，格式为「场景名称：xxx」。",
  },
  "str-scene-method-filter": {
    id: "str-scene-method-filter",
    title: "测评方式筛选",
    content: "第一级筛选：全部、试卷、题库、评审、现场问答。切换后自动重置评分状态筛选为「全部」。",
  },
  "str-scene-status-filter": {
    id: "str-scene-status-filter",
    title: "评分状态筛选",
    content: "第二级筛选：全部、待评分、已评分。在已选测评方式的基础上进一步筛选。",
  },
  "str-scene-student-list": {
    id: "str-scene-student-list",
    title: "学生提交列表",
    content: "展示当前任务下符合条件的学生提交记录。每条记录包含：学生头像（首字母）、姓名、学号、评分状态（待评分/已评分）、测评方式、提交时间、班级、年级。操作按钮：查看、评分/已评分。",
  },
}

// ==================== 岗位能力认定规则配置 (job-ability/config) ====================

export const jobAbilityConfigAnnotations: Record<string, AnnotationItem> = {
  "jac-page-title": {
    id: "jac-page-title",
    title: "岗位能力认定规则配置",
    content: "配置岗位的能力点权重和任务权重，定义岗位能力认定的计算规则。包含能力点权重配置和任务权重配置两个主要部分。",
  },
  "jac-btn-point-weight": {
    id: "jac-btn-point-weight",
    title: "能力点占岗位权重",
    content: "点击打开能力点权重配置弹窗。以表格形式展示：关联场景任务列 | 能力点名（rowSpan） | 权重输入（rowSpan）。弹窗宽度 900px，可修改各能力点在岗位总权重中的占比，所有能力点权重总和为 100%。",
  },
  "jac-btn-task-weight": {
    id: "jac-btn-task-weight",
    title: "任务占能力点权重",
    content: "点击打开任务权重配置弹窗。以卡片列表形式展示各任务的名称和权重输入，可修改各任务在对应能力点中的占比。",
  },
  "jac-table-scenario": {
    id: "jac-table-scenario",
    title: "关联场景任务",
    content: "表格列：展示能力点关联的场景任务名称。同一能力点可能关联多个场景任务。",
  },
  "jac-table-ability-point": {
    id: "jac-table-ability-point",
    title: "能力点",
    content: "表格列：展示能力点名称。同一能力点跨多行时自动合并（rowSpan）。",
  },
  "jac-table-weight": {
    id: "jac-table-weight",
    title: "权重",
    content: "表格列：展示各能力点在岗位总权重中的占比，支持在弹窗中修改。所有能力点权重总和为 100%。",
  },
}

// ==================== 首页 / 导航 ====================

export const homeAnnotations: Record<string, AnnotationItem> = {
  "nav-question-banks": {
    id: "nav-question-banks",
    title: "题库管理",
    content: "通用测评资源管理模块，支持题库和题目的创建、编辑、导入、导出等操作。",
  },
  "nav-exams": {
    id: "nav-exams",
    title: "试卷管理",
    content: "通用测评资源管理模块，支持试卷的组卷、编辑、审批、发布等操作。",
  },
  "nav-exam-usage": {
    id: "nav-exam-usage",
    title: "考试管理",
    content: "管理试卷在各模块的使用情况，支持创建在线考试、配置考试参数、查看考试结果。",
  },
  "nav-approval-center": {
    id: "nav-approval-center",
    title: "审批中心",
    content: "集中处理题库、试卷等资源的审批流程。",
  },
  "nav-job-ability": {
    id: "nav-job-ability",
    title: "岗位能力认定管理",
    content: "配置岗位能力认定规则，查看学生岗位能力认定结果。",
  },
  "nav-scene-task": {
    id: "nav-scene-task",
    title: "测评方式库",
    content: "管理测评方式（场景任务、智慧课堂、在线课程），查看和管理测评结果。",
  },
  "nav-graduation": {
    id: "nav-graduation",
    title: "毕业设计管理",
    content: "管理毕业设计选题、档案、评价、查询等全流程。",
  },
  "nav-student-portrait": {
    id: "nav-student-portrait",
    title: "学生画像管理",
    content: "管理学生档案和画像，展示学生综合能力分析。",
  },
}

// ==================== 合并所有标注 ====================

const allAnnotations: Record<string, AnnotationItem> = {
  ...questionBankAnnotations,
  ...questionBankDetailAnnotations,
  ...examAnnotations,
  ...examUsageAnnotations,
  ...examUsageResultsAnnotations,
  ...jobAbilityResultsAnnotations,
  ...sceneTaskResultsAnnotations,
  ...jobAbilityConfigAnnotations,
  ...homeAnnotations,
}

/** 从 localStorage 读取用户覆盖 */
function getOverrides(): Record<string, AnnotationItem> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem("prd-annotations-overrides")
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/** 通过 ID 快速获取标注内容（优先 localStorage 覆盖） */
export function getAnnotation(id: string): AnnotationItem | undefined {
  const overrides = getOverrides()
  return overrides[id] ?? allAnnotations[id]
}

/** 获取所有用户覆盖数据（供导出使用） */
export function getAllOverrides(): Record<string, AnnotationItem> {
  return getOverrides()
}

/** 按页面获取标注字典 */
export function getAnnotationsByPage(page: string): Record<string, AnnotationItem> {
  switch (page) {
    case "question-banks":
      return questionBankAnnotations
    case "question-banks-detail":
      return questionBankDetailAnnotations
    case "exams":
      return examAnnotations
    case "exam-usage":
      return examUsageAnnotations
    case "exam-usage-results":
      return examUsageResultsAnnotations
    case "job-ability-results":
      return jobAbilityResultsAnnotations
    case "scene-task-results":
      return sceneTaskResultsAnnotations
    case "job-ability-config":
      return jobAbilityConfigAnnotations
    default:
      return {}
  }
}

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
  "grading-title": {
    id: "grading-title",
    title: "场景评分管理",
    content:
      "教师查看已发布场景下的学生提交，按任务和测评形式维度进行评分管理。页面采用左右分栏布局。",
  },
  "grading-sidebar-search": {
    id: "grading-sidebar-search",
    title: "场景搜索",
    content: "按场景名称/编码搜索左侧场景列表。",
  },
  "grading-sidebar-position": {
    id: "grading-sidebar-position",
    title: "岗位分组",
    content:
      "左侧场景列表按岗位分组折叠展示。岗位名 + 场景数量，点击展开/折叠。",
  },
  "grading-sidebar-scenario": {
    id: "grading-sidebar-scenario",
    title: "场景卡片",
    content:
      "每个场景卡片展示：场景名称 + 编码 + 统计（任务数、待评分、已评分、学生数）。点击选中后右侧展示该场景的任务分组。",
  },
  "grading-task-header": {
    id: "grading-task-header",
    title: "任务评分区",
    content:
      "右侧展示选中场景的任务列表，每个任务为一个折叠面板。头部：任务名 + 任务类型（训练/考核）+ 测评形式 + 待评分/已评分数量。",
  },
  "grading-task-expand": {
    id: "grading-task-expand",
    title: "任务展开",
    content:
      "展开后按测评形式分 Tab 展示学生提交列表。学生提交列表表格：学生姓名、学号、班级、入学年份、提交状态、操作（进入评分）。",
  },
  "grading-action-view": {
    id: "grading-action-view",
    title: "查看",
    content: "查看学生提交的测评详情。",
  },
  "grading-action-grade": {
    id: "grading-action-grade",
    title: "评分",
    content:
      "跳转不同类型的评分详情页。试卷/题库：展示学生客观题答案与正误对比，主观题需教师人工评分。现场问答：记录教师现场抽题和学生回答情况，按评价点打分。现场评审：查看学生提交的材料，按评审量规的多维度评价点打分。",
  },
  "grading-task-form-tabs": {
    id: "grading-task-form-tabs",
    title: "测评形式切换",
    content:
      "展开任务后，若该任务配置了多种测评形式（如现场问答+现场评审），则以 Tab 形式切换展示不同测评形式下的学生提交列表。当前选中的测评形式以主色高亮显示。",
  },
  "dialog-approve-confirm": {
    id: "dialog-approve-confirm",
    title: "通过确认弹窗",
    content:
      "审批意见输入框（非必填，默认文案「审批通过。」）。操作：取消 / 确认通过。通过后场景状态变为已通过(approved)。",
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

// ==================== 弹窗：新建/编辑题库 ====================

export const bankFormAnnotations: Record<string, AnnotationItem> = {
  "bf-name": {
    id: "bf-name",
    title: "题库名称",
    content: "题库的名称标识，必填项。",
  },
  "bf-description": {
    id: "bf-description",
    title: "题库简介",
    content: "题库的简要描述信息，帮助用户了解题库内容。",
  },
  "bf-cover": {
    id: "bf-cover",
    title: "封面",
    content: "题库的封面图片，支持上传 5MB 以内的图片文件。",
  },
  "bf-collaborators": {
    id: "bf-collaborators",
    title: "共建人",
    content: "选择可以共同维护此题库的用户。点击「选择共建人」打开用户选择弹窗。",
  },
  "bf-batch": {
    id: "bf-batch",
    title: "所属批次",
    content: "题库关联的批次分组，下拉选择。可选择「不设置批次」。",
  },
  "bf-version": {
    id: "bf-version",
    title: "当前版本号",
    content: "编辑时显示，不可修改。",
  },
}

// ==================== 弹窗：新建/编辑试卷 ====================

export const examFormAnnotations: Record<string, AnnotationItem> = {
  "ef-name": {
    id: "ef-name",
    title: "试卷名称",
    content: "试卷的名称标识，必填项。",
  },
  "ef-description": {
    id: "ef-description",
    title: "试卷简介",
    content: "试卷的简要描述信息。",
  },
  "ef-cover": {
    id: "ef-cover",
    title: "封面",
    content: "试卷的封面图片，支持上传 5MB 以内的图片文件。",
  },
  "ef-collaborators": {
    id: "ef-collaborators",
    title: "共建人",
    content: "选择可以共同维护此试卷的用户。",
  },
  "ef-batch": {
    id: "ef-batch",
    title: "所属批次",
    content: "试卷关联的批次分组。可选择「不设置批次」。",
  },
  "ef-version": {
    id: "ef-version",
    title: "当前版本号",
    content: "编辑时显示，不可修改。",
  },
}

// ==================== 弹窗：创建在线考试 ====================

export const examCreateDialogAnnotations: Record<string, AnnotationItem> = {
  "ecd-exam-select": {
    id: "ecd-exam-select",
    title: "选择试卷",
    content: "使用 Popover + Command 搜索组件选择试卷。支持下拉展开和关键词搜索，展示试卷名称、总分、题目数量。",
  },
  "ecd-exam-name": {
    id: "ecd-exam-name",
    title: "考试名称",
    content: "在线考试的名称标识，必填项。",
  },
  "ecd-exam-desc": {
    id: "ecd-exam-desc",
    title: "考试简介",
    content: "考试的简要描述信息。",
  },
  "ecd-exam-notice": {
    id: "ecd-exam-notice",
    title: "考试须知",
    content: "考试开始前向考生展示的注意事项和规则说明。默认包含 5 条常见考试须知。",
  },
  "ecd-cover": {
    id: "ecd-cover",
    title: "考试封面",
    content: "考试的封面图片，支持上传 5MB 以内的图片文件。",
  },
  "ecd-target-audience": {
    id: "ecd-target-audience",
    title: "面向对象",
    content: "选择考试的面向对象：学生或教师。选择学生时需配置「参考学生」，选择教师时需配置「参考人员」。",
  },
  "ecd-target-student": {
    id: "ecd-target-student",
    title: "参考学生",
    content: "使用组织树结构（学院→年级→班级→学生）进行多选。支持搜索学生或班级，已选学生在底部以标签形式展示，可单个移除。",
  },
  "ecd-target-teacher": {
    id: "ecd-target-teacher",
    title: "参考人员",
    content: "面向教师时，从用户列表中选择参考人员。",
  },
  "ecd-open-type": {
    id: "ecd-open-type",
    title: "考试时间类型",
    content: "考试时间配置：随时开放、定时开放、手动开放三种模式。",
  },
  "ecd-duration": {
    id: "ecd-duration",
    title: "考试时长",
    content: "考试的限时长度，单位为分钟。",
  },
}

// ==================== 组卷编辑页 (exams/[id]) ====================

export const examComposerAnnotations: Record<string, AnnotationItem> = {
  "ec-page-title": {
    id: "ec-page-title",
    title: "组卷编辑",
    content: "试卷的组卷编辑页面，支持查看试卷基本信息、拖拽调整题目顺序、修改题目分值、自动/手动抽题、预览试卷等操作。",
  },
  "ec-btn-edit-info": {
    id: "ec-btn-edit-info",
    title: "修改试卷基本信息",
    content: "点击打开弹窗，修改试卷的名称、简介、封面、共建人、所属批次等基本信息。",
  },
  "ec-btn-submit": {
    id: "ec-btn-submit",
    title: "提交审批",
    content: "将试卷提交审批。提交后试卷进入审批中状态，不可编辑。",
  },
  "ec-btn-delete": {
    id: "ec-btn-delete",
    title: "删除试卷",
    content: "删除当前试卷。仅在草稿/未提交/已驳回状态下可操作。",
  },
  "ec-btn-preview": {
    id: "ec-btn-preview",
    title: "预览试卷",
    content: "以前台考生视角预览试卷效果。",
  },
  "ec-btn-save": {
    id: "ec-btn-save",
    title: "保存试卷",
    content: "保存当前试卷的题目和分值配置。",
  },
  "ec-btn-random": {
    id: "ec-btn-random",
    title: "自动抽题",
    content: "点击打开自动抽题弹窗，按条件（题库、题型、难度、数量）从题库中自动抽取题目加入试卷。",
  },
  "ec-btn-manual": {
    id: "ec-btn-manual",
    title: "手动抽题",
    content: "点击打开手动抽题弹窗，从题库中手动选择题加入试卷。",
  },
  "ec-btn-add-question": {
    id: "ec-btn-add-question",
    title: "新增题目",
    content: "直接在当前试卷中新增一道题目。",
  },
  "ec-btn-batch-import": {
    id: "ec-btn-batch-import",
    title: "批量导入题目",
    content: "批量导入题目到当前试卷。",
  },
  "ec-question-list": {
    id: "ec-question-list",
    content: "试卷题目列表。每道题显示：序号、题目内容、题型标签、分值输入框。在编辑模式下可拖拽调整顺序。",
    title: "试卷题目列表",
  },
  "ec-question-score": {
    id: "ec-question-score",
    title: "题目分值",
    content: "每道题在试卷中的分值。点击可修改，范围 1-100 分。",
  },
}

// ==================== 审批中心 (approval-center) ====================

export const approvalCenterAnnotations: Record<string, AnnotationItem> = {
  "ac-page-title": {
    id: "ac-page-title",
    title: "审批中心",
    content: "统一审批题目、题库、试卷、在线考试的提交申请。支持按审批类型（题库/试卷/考试）和状态筛选。",
  },
  "ac-stat-total": {
    id: "ac-stat-total",
    title: "审批总数",
    content: "所有审批记录的总数量。",
  },
  "ac-stat-pending": {
    id: "ac-stat-pending",
    title: "待审批",
    content: "状态为「待审批」的记录数量。",
  },
  "ac-stat-approved": {
    id: "ac-stat-approved",
    title: "已通过",
    content: "状态为「已通过」的记录数量。",
  },
  "ac-stat-rejected": {
    id: "ac-stat-rejected",
    title: "已驳回",
    content: "状态为「已驳回」的记录数量。",
  },
  "ac-tab-questionBank": {
    id: "ac-tab-questionBank",
    title: "题库审批",
    content: "展示题库相关的审批申请。",
  },
  "ac-tab-exam": {
    id: "ac-tab-exam",
    title: "试卷审批",
    content: "展示试卷相关的审批申请。",
  },
  "ac-tab-onlineExam": {
    id: "ac-tab-onlineExam",
    title: "考试审批",
    content: "展示在线考试相关的审批申请。",
  },
  "ac-col-type": {
    id: "ac-col-type",
    title: "审批类型",
    content: "审批对象的类型：题库、试卷、在线考试。",
  },
  "ac-col-title": {
    id: "ac-col-title",
    title: "标题",
    content: "审批对象的名称（题库名称/试卷名称/考试名称）。",
  },
  "ac-col-desc": {
    id: "ac-col-desc",
    title: "描述",
    content: "审批对象的描述信息。",
  },
  "ac-col-submitter": {
    id: "ac-col-submitter",
    title: "提交人",
    content: "提交该审批申请的用户。",
  },
  "ac-col-submit-time": {
    id: "ac-col-submit-time",
    title: "提交时间",
    content: "审批申请的提交时间。",
  },
  "ac-col-status": {
    id: "ac-col-status",
    title: "状态",
    content: "审批当前状态：待审批（黄色）、已通过（绿色）、已驳回（红色）。",
  },
  "ac-col-remark": {
    id: "ac-col-remark",
    title: "备注",
    content: "审批的备注信息。",
  },
  "ac-col-actions": {
    id: "ac-col-actions",
    title: "操作",
    content: "查看详情、同意、驳回。待审批状态下显示同意和驳回按钮。",
  },
  "ac-btn-approve": {
    id: "ac-btn-approve",
    title: "同意审批",
    content: "点击打开确认弹窗，填写审批备注（非必填）后确认通过。",
  },
  "ac-btn-reject": {
    id: "ac-btn-reject",
    title: "驳回审批",
    content: "点击打开确认弹窗，填写驳回原因（非必填）后确认驳回。",
  },
}

// ==================== 岗位能力认定规则配置列表 (job-ability) ====================

export const positionListAnnotations: Record<string, AnnotationItem> = {
  "pl-page-title": {
    id: "pl-page-title",
    title: "岗位能力认定规则配置",
    content: "管理各岗位的能力认定规则配置。列表展示所有岗位，支持搜索、按行业筛选、批量发布等操作。点击「配置认定规则」进入详细配置页面。",
  },
  "pl-search": {
    id: "pl-search",
    title: "搜索岗位",
    content: "按岗位名称或岗位编码关键词搜索。",
  },
  "pl-filter-direction": {
    id: "pl-filter-direction",
    title: "所属行业筛选",
    content: "按岗位所属行业/专业方向筛选。",
  },
  "pl-col-name": {
    id: "pl-col-name",
    title: "岗位名称",
    content: "岗位的名称标识。",
  },
  "pl-col-code": {
    id: "pl-col-code",
    title: "岗位编码",
    content: "岗位的唯一编码标识。",
  },
  "pl-col-direction": {
    id: "pl-col-direction",
    title: "所属行业",
    content: "岗位所属的行业或专业方向。",
  },
  "pl-col-ability-count": {
    id: "pl-col-ability-count",
    title: "关联能力数",
    content: "该岗位关联的能力项数量。",
  },
  "pl-col-updater": {
    id: "pl-col-updater",
    title: "最后更新者",
    content: "最后一次更新该岗位规则的用户。",
  },
  "pl-col-update-time": {
    id: "pl-col-update-time",
    title: "更新时间",
    content: "规则的最后更新时间。",
  },
  "pl-col-actions": {
    id: "pl-col-actions",
    title: "操作",
    content: "配置认定规则：点击进入岗位能力认定规则详细配置页面（/job-ability/config/[id]）。",
  },
  "pl-btn-config": {
    id: "pl-btn-config",
    title: "配置认定规则",
    content: "点击进入该岗位的详细规则配置页面，可配置能力点权重、任务权重、等级映射等。",
  },
}

// ==================== 测评方式管理 (evaluation-methods) ====================

export const evaluationMethodsAnnotations: Record<string, AnnotationItem> = {
  "em-page-title": {
    id: "em-page-title",
    title: "测评方式管理",
    content: "管理测评方式分类与前台展示状态。支持按一级分类和二级分类组织测评方式，可控制是否在前台展示。",
  },
  "em-search": {
    id: "em-search",
    title: "搜索测评方式",
    content: "按测评方式名称关键词搜索。",
  },
  "em-col-category": {
    id: "em-col-category",
    title: "一级分类",
    content: "测评方式所属的一级分类，如过程评价、结果评价等。",
  },
  "em-col-sub-category": {
    id: "em-col-sub-category",
    title: "二级分类",
    content: "测评方式所属的二级分类。",
  },
  "em-col-method": {
    id: "em-col-method",
    title: "测评方式",
    content: "测评方式的具体名称。",
  },
  "em-col-enabled": {
    id: "em-col-enabled",
    title: "前台展示",
    content: "控制该测评方式是否在前台（landingpage）展示。关闭后前台不显示。",
  },
  "em-col-description": {
    id: "em-col-description",
    title: "测评方式说明",
    content: "测评方式的详细说明描述。",
  },
  "em-col-doc-link": {
    id: "em-col-doc-link",
    title: "文档链接",
    content: "测评方式相关文档的外部链接，点击可跳转到对应文档页面。",
  },
  "em-col-tasks": {
    id: "em-col-tasks",
    title: "管理场景任务",
    content: "查看和管理该测评方式关联的场景任务数量。",
  },
  "em-col-actions": {
    id: "em-col-actions",
    title: "操作",
    content: "编辑测评方式的说明和文档链接。",
  },
}

// ==================== 学生画像管理 (student-portrait/portraits) ====================

export const studentPortraitAnnotations: Record<string, AnnotationItem> = {
  "sp-page-title": {
    id: "sp-page-title",
    title: "学生画像管理",
    content: "基于课程任务、实践场景、毕设评价、档案材料等全量数据，自动生成学生能力画像。支持按专业和班级筛选，手动调整画像数据。",
  },
  "sp-btn-generate": {
    id: "sp-btn-generate",
    title: "手动更新画像",
    content: "点击启动画像生成引擎，重新计算所有学生能力画像。",
  },
  "sp-btn-config-time": {
    id: "sp-btn-config-time",
    title: "画像更新时间",
    content: "配置画像数据的自动更新周期和时间。",
  },
  "sp-btn-module-config": {
    id: "sp-btn-module-config",
    title: "学生画像模块配置",
    content: "配置学生画像页面展示哪些模块和数据维度。",
  },
  "sp-nav-major-class": {
    id: "sp-nav-major-class",
    title: "专业-班级导航",
    content: "左侧导航栏，按专业分组展示班级。点击班级可筛选右侧学生列表。支持搜索专业和班级。",
  },
  "sp-search": {
    id: "sp-search",
    title: "搜索学生",
    content: "按姓名、学号、班级或岗位关键词搜索学生画像。",
  },
  "sp-filter-grade": {
    id: "sp-filter-grade",
    title: "等级筛选",
    content: "按能力画像等级筛选：全部、A-优秀、B-良好、C-中等、D-及格、E-不及格。",
  },
  "sp-col-student-id": {
    id: "sp-col-student-id",
    title: "学号",
    content: "学生的学号。",
  },
  "sp-col-student-name": {
    id: "sp-col-student-name",
    title: "姓名",
    content: "学生姓名。",
  },
  "sp-col-class": {
    id: "sp-col-class",
    title: "班级",
    content: "学生所属班级。",
  },
  "sp-col-major": {
    id: "sp-col-major",
    title: "专业",
    content: "学生所属专业。",
  },
  "sp-col-actions": {
    id: "sp-col-actions",
    title: "操作",
    content: "查看学生画像详情。",
  },
}

// ==================== 前台首页 (landingpage) ====================

export const landingPageAnnotations: Record<string, AnnotationItem> = {
  "lp-hero": {
    id: "lp-hero",
    title: "能力测评中心前台首页",
    content: "前台门户首页，面向学生和教师展示测评资源、考试、岗位认证、毕业设计等内容。所有展示数据均来源于后台管理页面的配置。",
  },
  "lp-stats": {
    id: "lp-stats",
    title: "数据看板",
    content: "展示平台核心数据指标。数据来源：\n- 测评方式数量 → 后台「测评方式管理」/evaluation-methods\n- 题库数量 → 后台「题库管理」/question-banks（已发布状态）\n- 试卷数量 → 后台「试卷管理」/exams（已发布状态）\n- 考试场次 → 后台「考试管理」/exam-usage（已发布状态）\n- 岗位认证项目 → 后台「岗位能力认定规则配置」/job-ability\n- 毕业选题 → 后台「毕业设计选题管理」/graduation-project/topics",
  },
  "lp-exam-center": {
    id: "lp-exam-center",
    title: "考试中心",
    content: "展示所有已发布的考试卡片。数据来源：后台「考试管理」/exam-usage 中状态为「已发布」的考试。包含考试名称、描述、时长、题量、日期、考试对象等信息。",
  },
  "lp-certifications": {
    id: "lp-certifications",
    title: "岗位能力认证项目库",
    content: "展示岗位能力认证项目卡片。数据来源：后台「岗位能力认定规则配置」/job-ability 中的岗位列表。包含岗位名称、创建人、更新时间、适用专业、能力项数量等。",
  },
  "lp-evaluation-methods": {
    id: "lp-evaluation-methods",
    title: "测评方式库",
    content: "展示前台启用的测评方式卡片。数据来源：后台「测评方式管理」/evaluation-methods 中「前台展示」开关为开启状态的测评方式。包含测评方式名称、说明、文档链接等。",
  },
  "lp-resources": {
    id: "lp-resources",
    title: "测评资源库",
    content: "展示已发布的题库和试卷资源。数据来源：\n- 题库 → 后台「题库管理」/question-banks（已发布状态）\n- 试卷 → 后台「试卷管理」/exams（已发布状态）",
  },
  "lp-graduation": {
    id: "lp-graduation",
    title: "毕业设计选题",
    content: "展示已发布的毕业设计选题。数据来源：后台「毕业设计选题管理」/graduation-project/topics（已发布状态）。",
  },
  "lp-portraits": {
    id: "lp-portraits",
    title: "学生能力画像",
    content: "展示优秀学生能力画像排行。数据来源：后台「学生画像管理」/student-portrait/portraits。按总学分排序展示前 8 名。",
  },
  "lp-stat-eval": {
    id: "lp-stat-eval",
    title: "测评方式数量",
    content: "数据来源：后台「测评方式管理」/evaluation-methods 中 enabled=true（前台展示开启）的测评方式总数。",
  },
  "lp-stat-bank": {
    id: "lp-stat-bank",
    title: "题库数量",
    content: "数据来源：后台「题库管理」/question-banks 中状态为「已发布」的题库总数。",
  },
  "lp-stat-exam": {
    id: "lp-stat-exam",
    title: "试卷数量",
    content: "数据来源：后台「试卷管理」/exams 中的试卷总数（包含所有状态）。",
  },
  "lp-stat-usage": {
    id: "lp-stat-usage",
    title: "考试场次",
    content: "数据来源：后台「考试管理」/exam-usage 中状态为「已发布」的考试场次数量。",
  },
  "lp-stat-position": {
    id: "lp-stat-position",
    title: "岗位认证项目",
    content: "数据来源：后台「岗位能力认定规则配置」/job-ability 中的岗位列表总数。",
  },
  "lp-stat-topic": {
    id: "lp-stat-topic",
    title: "毕业选题",
    content: "数据来源：后台「毕业设计选题管理」/graduation-project/topics 中的选题总数。",
  },
  "lp-exam-card": {
    id: "lp-exam-card",
    title: "考试卡片字段",
    content: "考试卡片各字段来源：\n- 考试名称 → 后台「考试管理」/exam-usage → exam.name\n- 状态标签 → 后台「考试管理」→ exam.status\n- 考试描述 → 模拟数据（实际应来源于 exam.description）\n- 考试时长 → 后台「试卷管理」/exams → exam.duration\n- 题目数量 → 后台「试卷管理」→ exam.questions.length\n- 创建日期 → 后台「考试管理」→ exam.createdAt\n- 考试对象 → 模拟数据（实际应来源于 exam.targetAudience）",
  },
  "lp-cert-card": {
    id: "lp-cert-card",
    title: "岗位认证卡片字段",
    content: "岗位认证卡片各字段来源：\n- 岗位名称 → 后台「岗位能力认定规则配置」/job-ability → pos.name\n- 创建人 → 后台岗位配置 → pos.updatedBy\n- 更新时间 → 后台岗位配置 → pos.lastUpdated\n- 适用专业 → 后台岗位配置 → pos.professionalDirection\n- 能力项数 → 后台岗位配置 → pos.relatedAbilityCount",
  },
  "lp-method-card": {
    id: "lp-method-card",
    title: "测评方式卡片字段",
    content: "测评方式卡片各字段来源：\n- 方式名称 → 后台「测评方式管理」/evaluation-methods → method.name\n- 方式说明 → 后台「测评方式管理」→ method.description\n- 使用说明链接 → 后台「测评方式管理」→ method.docLink",
  },
  "lp-resource-bank-card": {
    id: "lp-resource-bank-card",
    title: "题库卡片字段",
    content: "题库卡片各字段来源：\n- 题库名称 → 后台「题库管理」/question-banks → bank.name\n- 题目数量 → 后台「题库管理」→ bank.questionCount\n- 创建人 → 后台「题库管理」→ bank.creatorId\n- 共建人数 → 后台「题库管理」→ bank.collaboratorIds.length\n- 创建日期 → 后台「题库管理」→ bank.createdAt\n- 更新日期 → 后台「题库管理」→ bank.updatedAt\n- 版本号 → 后台「题库管理」→ bank.version",
  },
  "lp-resource-exam-card": {
    id: "lp-resource-exam-card",
    title: "试卷卡片字段",
    content: "试卷卡片各字段来源：\n- 试卷名称 → 后台「试卷管理」/exams → exam.name\n- 考试时长 → 后台「试卷管理」→ exam.duration\n- 题目数量 → 后台「试卷管理」→ exam.questions.length\n- 总分 → 后台「试卷管理」→ 各题目分值累加\n- 版本号 → 后台「试卷管理」→ exam.version\n- 创建/更新日期 → 后台「试卷管理」→ exam.createdAt / exam.updatedAt",
  },
  "lp-grad-card": {
    id: "lp-grad-card",
    title: "毕业设计选题卡片字段",
    content: "毕业设计选题卡片各字段来源：\n- 选题名称 → 后台「毕业设计选题管理」/graduation-project/topics → topic.name\n- 岗位方向 → 后台选题管理 → topic.positionName\n- 导师 → 后台选题管理 → topic.advisorName\n- 来源 → 后台选题管理 → topic.source（校内/企业）\n- 浏览次数 → 后台选题管理 → topic.appliedCount",
  },
  "lp-portrait-card": {
    id: "lp-portrait-card",
    title: "学生画像专业卡片字段",
    content: "学生画像专业卡片各字段来源：\n- 专业名称 → 后台「学生画像管理」/student-portrait/portraits → majorName\n- 学生数量 → 后台「学生画像管理」→ 该专业下学生总数\n- 平均评级 → 后台「学生画像管理」→ 该专业学生 overallGrade 平均值\n- 平均学分 → 后台「学生画像管理」→ 该专业学生 totalCredits 平均值\n- 平均排名 → 后台「学生画像管理」→ 该专业学生 majorRank/majorTotal 平均值",
  },
}

// ==================== 前台二级页面 ====================

/** 考试详情页 /landingpage/exams/[id] */
export const landingExamAnnotations: Record<string, AnnotationItem> = {
  "le-page": {
    id: "le-page",
    title: "考试详情页",
    content: "前台考试详情页，展示考试基本信息和题目列表。学生可在此页面查看考试详情并开始答题。所有数据来源于后台「考试管理」/exam-usage 和「试卷管理」/exams。",
  },
  "le-title": {
    id: "le-title",
    title: "考试名称",
    content: "数据来源：后台「考试管理」/exam-usage → 考试名称字段。创建考试时填写，发布后在考试中心展示。",
  },
  "le-desc": {
    id: "le-desc",
    title: "考试描述",
    content: "数据来源：后台「考试管理」/exam-usage → 考试描述字段。用于说明考试的目的、范围、注意事项等。",
  },
  "le-status": {
    id: "le-status",
    title: "考试状态",
    content: "数据来源：后台「考试管理」/exam-usage → 状态字段。包括：草稿、未提交、审核中、已驳回、待发布、已发布。前台仅展示已发布状态的考试。",
  },
  "le-duration": {
    id: "le-duration",
    title: "考试时长",
    content: "数据来源：后台「试卷管理」/exams → 考试时长字段。组卷时设置，单位为分钟。学生开始答题后开始倒计时。",
  },
  "le-question-count": {
    id: "le-question-count",
    title: "题目数量",
    content: "数据来源：后台「试卷管理」/exams → 组卷结果中的题目总数。通过自动抽题或手动添加题目后生成。",
  },
  "le-total-score": {
    id: "le-total-score",
    title: "总分",
    content: "数据来源：后台「试卷管理」/exams → 各题目分值之和。每道题在组卷时设置分值，系统累加计算总分。",
  },
  "le-time-status": {
    id: "le-time-status",
    title: "时间状态",
    content: "模拟数据。实际应来源于后台「考试管理」/exam-usage 的考试时间配置（开始时间、结束时间），判断当前处于进行中/未开始/已结束状态。",
  },
  "le-target": {
    id: "le-target",
    title: "考试对象",
    content: "数据来源：后台「考试管理」/exam-usage → 考试对象设置。可配置为学生（按班级/年级）或教师（指定人员）。",
  },
  "le-start-btn": {
    id: "le-start-btn",
    title: "开始考试按钮",
    content: "学生点击后进入答题界面，开始倒计时。需判断考试时间状态，未开始或已结束则不可点击。",
  },
  "le-question-list": {
    id: "le-question-list",
    title: "题目列表",
    content: "数据来源：后台「试卷管理」/exams → 组卷结果。展示所有题目内容、选项、分值。题目来源于关联题库或手动录入。",
  },
}

/** 岗位认证详情页 /landingpage/certifications/[id] */
export const landingCertAnnotations: Record<string, AnnotationItem> = {
  "lc-page": {
    id: "lc-page",
    title: "岗位能力认证详情页",
    content: "前台岗位能力认证详情页，展示岗位基本信息、能力项要求和达成标准。数据来源于后台「岗位能力认定规则配置」/job-ability。",
  },
  "lc-title": {
    id: "lc-title",
    title: "岗位名称",
    content: "数据来源：后台「岗位能力认定规则配置」/job-ability → 岗位名称。岗位列表中配置的岗位信息。",
  },
  "lc-stats": {
    id: "lc-stats",
    title: "统计指标",
    content: "数据来源：后台「岗位能力认定规则配置」/job-ability。\n- 能力项数 → 该岗位配置的能力项总数\n- 平均达成率 → 参与认证学生的平均达成率\n- 参与人数 → 选择该岗位的学生画像数量\n- 综合评级 → 按达成率分布计算的评级分布",
  },
  "lc-competency": {
    id: "lc-competency",
    title: "能力项列表",
    content: "数据来源：后台「岗位能力认定规则配置」/job-ability → 能力项配置。每个能力项包含：能力名称、目标等级、达成标准说明。等级分为：了解、理解、掌握、熟练、精通。",
  },
  "lc-leaderboard": {
    id: "lc-leaderboard",
    title: "学生排行榜",
    content: "模拟数据。实际应来源于后台「学生画像管理」/student-portrait/portraits 中该岗位关联学生的达成率和评级数据。",
  },
  "lc-grade-switch": {
    id: "lc-grade-switch",
    title: "届别切换",
    content: "筛选不同年级（届别）的学生数据。模拟 2024/2025/2026 三届数据。",
  },
}

/** 题库详情页 /landingpage/resources/banks/[id] */
export const landingBankAnnotations: Record<string, AnnotationItem> = {
  "lb-page": {
    id: "lb-page",
    title: "题库详情页",
    content: "前台题库详情页，展示题库基本信息和题目预览。数据来源于后台「题库管理」/question-banks。",
  },
  "lb-title": {
    id: "lb-title",
    title: "题库名称",
    content: "数据来源：后台「题库管理」/question-banks → 题库名称。新建题库时填写，支持编辑修改。",
  },
  "lb-desc": {
    id: "lb-desc",
    title: "题库描述",
    content: "数据来源：后台「题库管理」/question-banks → 题库简介。描述题库的内容范围、适用场景等信息。",
  },
  "lb-question-count": {
    id: "lb-question-count",
    title: "题目数量",
    content: "数据来源：后台「题库管理」/question-banks → questionCount 字段。题库中实际包含的题目总数，添加/删除题目后自动更新。",
  },
  "lb-creator": {
    id: "lb-creator",
    title: "创建者",
    content: "数据来源：后台「题库管理」/question-banks → 创建人信息。记录创建该题库的用户。",
  },
  "lb-version": {
    id: "lb-version",
    title: "版本号",
    content: "数据来源：后台「题库管理」/question-banks → version 字段。每次编辑保存后自动递增版本号。",
  },
  "lb-view-count": {
    id: "lb-view-count",
    title: "浏览次数",
    content: "模拟数据。实际应记录前台用户访问该题库详情页的次数。",
  },
  "lb-apply-btn": {
    id: "lb-apply-btn",
    title: "申请共建按钮",
    content: "学生/教师可申请成为该题库的共建人，获得编辑权限。申请需题库所有者审批。",
  },
  "lb-fav-btn": {
    id: "lb-fav-btn",
    title: "收藏题库按钮",
    content: "用户可将题库加入个人收藏，方便快速访问。收藏状态保存在用户个人数据中。",
  },
  "lb-questions": {
    id: "lb-questions",
    title: "题目预览",
    content: "数据来源：后台「题库管理」/question-banks 关联的题目数据。展示题目内容、题型、难度、知识点标签和选项。未登录用户仅展示前 8 题。",
  },
}

/** 试卷详情页 /landingpage/resources/exams/[id] */
export const landingPaperAnnotations: Record<string, AnnotationItem> = {
  "lpr-page": {
    id: "lpr-page",
    title: "试卷详情页",
    content: "前台试卷详情页，展示试卷基本信息、题型分布统计和题目概览。数据来源于后台「试卷管理」/exams。",
  },
  "lpr-title": {
    id: "lpr-title",
    title: "试卷名称",
    content: "数据来源：后台「试卷管理」/exams → 试卷名称。新建/编辑试卷时填写。",
  },
  "lpr-desc": {
    id: "lpr-desc",
    title: "试卷描述",
    content: "数据来源：后台「试卷管理」/exams → 试卷描述。说明试卷用途、适用范围等。",
  },
  "lpr-status": {
    id: "lpr-status",
    title: "试卷状态",
    content: "数据来源：后台「试卷管理」/exams → 状态字段。包括：草稿、未提交、审核中、已驳回、待发布、已发布。前台仅展示已发布状态的试卷。",
  },
  "lpr-duration": {
    id: "lpr-duration",
    title: "考试时长",
    content: "数据来源：后台「试卷管理」/exams → 考试时长。组卷时设置，单位为分钟。",
  },
  "lpr-question-count": {
    id: "lpr-question-count",
    title: "题目数量",
    content: "数据来源：后台「试卷管理」/exams → 组卷结果中的题目总数。通过自动抽题或手动添加生成。",
  },
  "lpr-total-score": {
    id: "lpr-total-score",
    title: "总分",
    content: "数据来源：后台「试卷管理」/exams → 各题目分值之和。组卷时为每道题设置分值。",
  },
  "lpr-version": {
    id: "lpr-version",
    title: "版本号",
    content: "数据来源：后台「试卷管理」/exams → version 字段。每次编辑保存后自动递增。",
  },
  "lpr-type-stats": {
    id: "lpr-type-stats",
    title: "题型分布统计",
    content: "数据来源：后台「试卷管理」/exams → 组卷结果。按题型（单选/多选/判断/填空/问答）统计题目数量和分值占比，以饼图形式展示。",
  },
  "lpr-questions": {
    id: "lpr-questions",
    title: "题目概览",
    content: "数据来源：后台「试卷管理」/exams → 组卷结果。展示试卷中所有题目的内容、题型、难度、知识点标签和选项。",
  },
}

/** 毕业设计详情页 /landingpage/graduation/[id] */
export const landingGraduationAnnotations: Record<string, AnnotationItem> = {
  "lg-page": {
    id: "lg-page",
    title: "毕业设计选题详情页",
    content: "前台毕业设计选题详情页，展示选题信息、描述、已选学生等。数据来源于后台「毕业设计选题管理」/graduation-project/topics 和「毕业设计档案管理」/graduation-project/archives。",
  },
  "lg-title": {
    id: "lg-title",
    title: "选题名称",
    content: "数据来源：后台「毕业设计选题管理」/graduation-project/topics → 课题名称。发布选题时填写。",
  },
  "lg-position": {
    id: "lg-position",
    title: "岗位/方向",
    content: "数据来源：后台「毕业设计选题管理」/graduation-project/topics → 关联岗位。选题与岗位能力认定体系中的岗位关联。",
  },
  "lg-college": {
    id: "lg-college",
    title: "所属学院",
    content: "数据来源：后台「毕业设计选题管理」/graduation-project/topics → 所属学院。选题发布时选择的学院/院系。",
  },
  "lg-status": {
    id: "lg-status",
    title: "选题状态",
    content: "数据来源：后台「毕业设计选题管理」/graduation-project/topics → 状态字段。包括：草稿、待审核、已发布、已锁定。前台仅展示已发布状态的选题。",
  },
  "lg-advisor": {
    id: "lg-advisor",
    title: "导师",
    content: "数据来源：后台「毕业设计选题管理」/graduation-project/topics → 导师姓名。发布选题时指定的指导教师。",
  },
  "lg-time-range": {
    id: "lg-time-range",
    title: "时间范围",
    content: "数据来源：后台「毕业设计选题管理」/graduation-project/topics → 开始日期/结束日期。选题的有效时间范围。",
  },
  "lg-capacity": {
    id: "lg-capacity",
    title: "容量/剩余名额",
    content: "数据来源：后台「毕业设计选题管理」/graduation-project/topics → 容量和已申请数。capacity 为选题最大容纳人数，appliedCount 为已申请人数，剩余名额 = capacity - appliedCount。",
  },
  "lg-desc": {
    id: "lg-desc",
    title: "选题描述",
    content: "数据来源：后台「毕业设计选题管理」/graduation-project/topics → 选题描述。详细介绍选题背景、目标、要求等。",
  },
  "lg-source": {
    id: "lg-source",
    title: "选题来源",
    content: "数据来源：后台「毕业设计选题管理」/graduation-project/topics → 来源字段。包括：校内场景课题（校内导师发布）和企业合作课题（企业导师参与）。",
  },
  "lg-students": {
    id: "lg-students",
    title: "已选学生",
    content: "数据来源：后台「毕业设计档案管理」/graduation-project/archives。展示已选择该选题的学生列表、学号和当前阶段（开题/中期/过程/答辩）。",
  },
  "lg-info": {
    id: "lg-info",
    title: "侧边栏选题信息",
    content: "集中展示选题的完整信息：课题名称、所属学院、导师、专业方向、容量、已申请、开始时间、结束时间。全部来源于后台「毕业设计选题管理」。",
  },
  "lg-apply-btn": {
    id: "lg-apply-btn",
    title: "申请选题按钮",
    content: "学生点击后申请选择该毕业设计选题。需判断剩余名额，名额已满时按钮置灰不可点击。申请成功后更新已申请人数。",
  },
}

/** 学生画像详情页 /landingpage/portrait/[id] */
export const landingPortraitAnnotations: Record<string, AnnotationItem> = {
  "lpo-page": {
    id: "lpo-page",
    title: "学生能力画像详情页",
    content: "前台学生能力画像详情页，展示学生的综合能力分析、排名、课程成绩和成长趋势。数据来源于后台「学生画像管理」/student-portrait/portraits。",
  },
  "lpo-name": {
    id: "lpo-name",
    title: "学生姓名",
    content: "数据来源：后台「学生画像管理」/student-portrait/portraits → 学生姓名。由系统根据学生档案自动生成。",
  },
  "lpo-class": {
    id: "lpo-class",
    title: "班级与专业",
    content: "数据来源：后台「学生画像管理」/student-portrait/portraits → 班级名称、专业名称。与学生学籍信息关联。",
  },
  "lpo-grade": {
    id: "lpo-grade",
    title: "综合评级",
    content: "数据来源：后台「学生画像管理」/student-portrait/portraits → 综合评级。根据各能力维度得分加权计算，分为 A/B/C/D/E 五级。",
  },
  "lpo-stats": {
    id: "lpo-stats",
    title: "统计指标",
    content: "数据来源：后台「学生画像管理」/student-portrait/portraits。\n- 已完成课程 → completedCourses\n- 已完成场景 → completedScenes\n- 总学分 → totalCredits\n- 档案数 → archiveCount\n- 出勤率 → attendanceRate",
  },
  "lpo-domains": {
    id: "lpo-domains",
    title: "能力维度分析",
    content: "数据来源：后台「学生画像管理」/student-portrait/portraits → domainScores。包含五个维度：行业认知(industry)、专业技能(professional)、实操技能(skill)、通用能力(general)、综合素质(quality)。每个维度包含得分和等级评定。",
  },
  "lpo-rank": {
    id: "lpo-rank",
    title: "排名信息",
    content: "数据来源：后台「学生画像管理」/student-portrait/portraits → 排名数据。包含班级排名(classRank/classTotal)、专业排名(majorRank/majorTotal)、年级排名(yearRank/yearTotal)。",
  },
  "lpo-recommend": {
    id: "lpo-recommend",
    title: "推荐岗位",
    content: "数据来源：后台「学生画像管理」/student-portrait/portraits → recommendPositions。根据学生能力维度得分与岗位要求匹配度计算，展示匹配度最高的前 3 个岗位。",
  },
  "lpo-courses": {
    id: "lpo-courses",
    title: "课程成绩",
    content: "数据来源：后台「学生画像管理」/student-portrait/portraits → courseRecords。展示学生各门课程的最终成绩(finalScore)、等级(grade)和学分(credit)。",
  },
  "lpo-trend": {
    id: "lpo-trend",
    title: "成长趋势",
    content: "数据来源：后台「学生画像管理」/student-portrait/portraits → domainScores。以柱状图形式展示各能力维度的得分分布，直观反映学生的能力优势与短板。",
  },
}

// ==================== Landingpage 列表页 ====================

export const landingExamListAnnotations: Record<string, AnnotationItem> = {
  "lex-page": {
    id: "lex-page",
    title: "考试中心列表页",
    content: "展示当前学生的考试列表，支持查看我的考试和全部考试。包含考试状态筛选、院系/专业筛选和搜索功能。",
  },
  "lex-hero": {
    id: "lex-hero",
    title: "页面标题区",
    content: "考试中心页面头部，展示页面标题和简介说明。",
  },
  "lex-stats": {
    id: "lex-stats",
    title: "统计面板",
    content: "展示考试数量统计：全部考试、进行中、未开始、已结束。",
  },
  "lex-tabs": {
    id: "lex-tabs",
    title: "Tab 切换",
    content: "切换「我的考试」和「全部考试」两个视图。",
  },
  "lex-filter": {
    id: "lex-filter",
    title: "筛选与搜索",
    content: "支持按考试名称搜索，按二级院系和适用专业筛选。",
  },
  "lex-list": {
    id: "lex-list",
    title: "考试卡片列表",
    content: "以卡片形式展示考试信息，包含考试名称、状态、时长、题量、考试时间、考试对象等。点击卡片进入考试详情页。",
  },
}

export const landingCertListAnnotations: Record<string, AnnotationItem> = {
  "lcl-page": {
    id: "lcl-page",
    title: "能力认定列表页",
    content: "展示当前学生的能力认定/证书列表。支持查看我的认证岗位、感兴趣岗位和全部岗位。",
  },
  "lcl-hero": {
    id: "lcl-hero",
    title: "页面标题区",
    content: "能力认定页面头部，展示页面标题和简介说明。",
  },
  "lcl-stats": {
    id: "lcl-stats",
    title: "统计面板",
    content: "展示认证岗位、行业、专业、通过率等统计数据。",
  },
  "lcl-tabs": {
    id: "lcl-tabs",
    title: "Tab 切换",
    content: "切换「我的认证岗位」「感兴趣岗位」「全部岗位」三个视图。",
  },
  "lcl-filter": {
    id: "lcl-filter",
    title: "筛选与搜索",
    content: "支持按岗位名称搜索，按院系和专业筛选。",
  },
  "lcl-list": {
    id: "lcl-list",
    title: "岗位认证卡片列表",
    content: "以卡片形式展示岗位认证信息，包含岗位名称、编码、方向、关联能力数、状态等。点击查看详情进入岗位能力认定详情页。",
  },
}

export const landingEvalMethodAnnotations: Record<string, AnnotationItem> = {
  "lem-page": {
    id: "lem-page",
    title: "测评方式页",
    content: "展示学校支持的各类测评方式说明，帮助学生了解不同测评形式的要求和特点。",
  },
  "lem-hero": {
    id: "lem-hero",
    title: "页面标题区",
    content: "测评方式页面头部，展示页面标题和简介说明。",
  },
  "lem-list": {
    id: "lem-list",
    title: "测评方式列表",
    content: "展示各种测评方式的详细介绍，包括考试、项目实践、作品评审等。",
  },
}

export const landingGraduationListAnnotations: Record<string, AnnotationItem> = {
  "lgl-page": {
    id: "lgl-page",
    title: "毕设列表页",
    content: "展示毕业设计相关资源和信息列表。支持查看毕设课题、进度和成果。",
  },
  "lgl-hero": {
    id: "lgl-hero",
    title: "页面标题区",
    content: "毕业设计页面头部，展示页面标题和简介说明。",
  },
  "lgl-stats": {
    id: "lgl-stats",
    title: "统计面板",
    content: "展示毕设相关统计信息。",
  },
  "lgl-list": {
    id: "lgl-list",
    title: "毕设资源列表",
    content: "展示毕业设计课题、档案、评价等相关信息列表。点击查看详情。",
  },
}

export const landingPortraitListAnnotations: Record<string, AnnotationItem> = {
  "lpl-page": {
    id: "lpl-page",
    title: "学生画像列表页",
    content: "展示学生画像相关列表信息，支持查看学生能力画像和成长档案。",
  },
  "lpl-hero": {
    id: "lpl-hero",
    title: "页面标题区",
    content: "学生画像页面头部，展示页面标题和简介说明。",
  },
  "lpl-stats": {
    id: "lpl-stats",
    title: "统计面板",
    content: "展示学生画像相关统计数据。",
  },
  "lpl-list": {
    id: "lpl-list",
    title: "学生画像列表",
    content: "展示学生能力画像列表，包含学生基本信息、能力维度得分等。点击可查看详情。",
  },
}

export const landingPortraitMajorAnnotations: Record<string, AnnotationItem> = {
  "lpm-page": {
    id: "lpm-page",
    title: "专业画像页",
    content: "展示按专业维度统计的学生能力画像数据，反映各专业学生的整体能力水平。",
  },
  "lpm-hero": {
    id: "lpm-hero",
    title: "页面标题区",
    content: "专业画像页面头部，展示当前专业名称和统计概览。",
  },
  "lpm-chart": {
    id: "lpm-chart",
    title: "能力维度图表",
    content: "以图表形式展示该专业学生在各能力维度上的平均得分分布。",
  },
  "lpm-list": {
    id: "lpm-list",
    title: "学生列表",
    content: "展示该专业下的学生能力画像列表。",
  },
}

export const landingResourceListAnnotations: Record<string, AnnotationItem> = {
  "lrl-page": {
    id: "lrl-page",
    title: "资源列表页",
    content: "展示学习资源列表，包括试卷资源和题库资源。支持查看资源详情。",
  },
  "lrl-hero": {
    id: "lrl-hero",
    title: "页面标题区",
    content: "资源中心页面头部，展示页面标题和简介说明。",
  },
  "lrl-tabs": {
    id: "lrl-tabs",
    title: "资源分类",
    content: "切换查看试卷资源和题库资源。",
  },
  "lrl-list": {
    id: "lrl-list",
    title: "资源卡片列表",
    content: "以卡片形式展示试卷或题库资源信息。点击卡片可查看详情。",
  },
}

export const landingWorkspaceAnnotations: Record<string, AnnotationItem> = {
  "lw-page": {
    id: "lw-page",
    title: "工作台页",
    content: "学生个人工作台，汇总展示待办事项、最近考试、学习进度等个人相关信息。",
  },
  "lw-hero": {
    id: "lw-hero",
    title: "页面标题区",
    content: "工作台页面头部，展示欢迎语和个人信息概览。",
  },
  "lw-todo": {
    id: "lw-todo",
    title: "待办事项",
    content: "展示当前学生的待办任务列表，包括待考试、待提交作业等。",
  },
  "lw-recent": {
    id: "lw-recent",
    title: "最近活动",
    content: "展示最近参与的考试、学习的资源等近期活动记录。",
  },
  "lw-progress": {
    id: "lw-progress",
    title: "学习进度",
    content: "展示当前学习进度和完成情况统计。",
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
  ...bankFormAnnotations,
  ...examFormAnnotations,
  ...examCreateDialogAnnotations,
  ...examComposerAnnotations,
  ...approvalCenterAnnotations,
  ...positionListAnnotations,
  ...evaluationMethodsAnnotations,
  ...studentPortraitAnnotations,
  ...landingPageAnnotations,
  ...landingExamAnnotations,
  ...landingCertAnnotations,
  ...landingBankAnnotations,
  ...landingPaperAnnotations,
  ...landingGraduationAnnotations,
  ...landingPortraitAnnotations,
  ...landingExamListAnnotations,
  ...landingCertListAnnotations,
  ...landingEvalMethodAnnotations,
  ...landingGraduationListAnnotations,
  ...landingPortraitListAnnotations,
  ...landingPortraitMajorAnnotations,
  ...landingResourceListAnnotations,
  ...landingWorkspaceAnnotations,
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
    case "bank-form":
      return bankFormAnnotations
    case "exam-form":
      return examFormAnnotations
    case "exam-create-dialog":
      return examCreateDialogAnnotations
    case "exam-composer":
      return examComposerAnnotations
    case "approval-center":
      return approvalCenterAnnotations
    case "position-list":
      return positionListAnnotations
    case "evaluation-methods":
      return evaluationMethodsAnnotations
    case "student-portrait":
      return studentPortraitAnnotations
    case "landingpage":
      return landingPageAnnotations
    case "landingpage-exams":
      return landingExamAnnotations
    case "landingpage-certifications":
      return landingCertAnnotations
    case "landingpage-banks":
      return landingBankAnnotations
    case "landingpage-papers":
      return landingPaperAnnotations
    case "landingpage-graduation":
      return landingGraduationAnnotations
    case "landingpage-portrait":
      return landingPortraitAnnotations
    case "landingpage-exams-list":
      return landingExamListAnnotations
    case "landingpage-certifications-list":
      return landingCertListAnnotations
    case "landingpage-evaluation-methods":
      return landingEvalMethodAnnotations
    case "landingpage-graduation-list":
      return landingGraduationListAnnotations
    case "landingpage-portrait-list":
      return landingPortraitListAnnotations
    case "landingpage-portrait-major":
      return landingPortraitMajorAnnotations
    case "landingpage-resources-list":
      return landingResourceListAnnotations
    case "landingpage-workspace":
      return landingWorkspaceAnnotations
    default:
      return {}
  }
}

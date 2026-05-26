# 能力测评认证平台 — 产品需求文档（PRD）

> 版本：v2.0
> 生成日期：2026-05-26
> 基于代码功能与 PRD 标注内容生成，包含前后台字段映射关系。

---

## 1. 产品概述

### 1.1 项目背景
能力测评认证平台是一套面向高校/职业教育机构的综合性能力评估与认证管理系统，覆盖从题库建设、组卷考试、岗位能力认定、毕业设计管理到学生能力画像的全链路业务。

### 1.2 技术栈
- **框架**：Next.js 16.2.6 + React 19
- **样式**：Tailwind CSS 4.2 + tw-animate-css
- **UI 组件库**：Radix UI（全套基础组件）+ shadcn/ui 风格
- **状态管理**：React Context（DataProvider）+ 本地 Mock 数据
- **图表**：Recharts
- **字体/图标**：Lucide React

### 1.3 系统角色
- **管理员**：具备全部功能权限（当前默认角色）
- **教师/共建人**：可参与题库/试卷共建、评分、评价
- **学生**：通过门户端参与考试、申请选题、查询毕业状态、查看画像

---

## 2. 全局架构与公共功能

### 2.1 页面布局模式

#### 2.1.1 管理平台布局（非预览模式）
- **顶部导航栏**：固定顶部，高度 56px，白色背景 + 底部阴影
  - 左侧：品牌 Logo + "能力测评认证平台" 标题（点击返回首页 `/`）
  - 中左：顶部导航项（门户首页 / 我的服务台 / 应用服务中心），均为外部链接，激活项带底部蓝色指示条
  - 中右：**学院筛选下拉框**（仅在非 `/landingpage` 路径显示），通过 URL Query 参数切换学院
  - 右侧：**企业登录按钮**（仅在非 `/landingpage` 路径显示）
  - 右侧：**当前时间**（实时显示，格式：`2024年06月15日 星期六 09:53`，每分钟刷新）
  - 右侧：**用户菜单**（头像 + 用户名 + 角色标签 + 下拉箭头）
- **侧边导航栏**：宽度 224px，粘性定位
  - 顶部：返回按钮 + 平台图标 + "能力测评认证平台" 标签
  - 菜单：5 大模块，14 个子项，支持父子展开/折叠；当前路径高亮
  - **landingpage 路径下自动隐藏侧边栏**
- **主体内容区**：背景色 `#f5f7fa`，内边距 24px

#### 2.1.2 预览模式
- URL 参数 `?mode=preview` 时，仅渲染纯白背景的主体区域，不显示平台壳（顶部/侧边导航），用于试卷/题库对外预览。

#### 2.1.3 门户首页布局（landingpage）
- 无侧边栏，白色背景，内容区 max-w-7xl 居中
- 顶部保留品牌栏和 Hero Banner

### 2.2 用户菜单（顶部导航右侧）
点击用户头像区域展开下拉菜单：

| 按钮 | 图标 | 功能说明 |
|------|------|----------|
| 个人中心 | `user` | 点击后暂无实际路由，UI 占位 |
| 账号设置 | `settings` | 点击后暂无实际路由，UI 占位 |
| 退出登录 | — | 红色文字（danger 色调），点击后暂无实际逻辑，UI 占位 |

### 2.3 全局状态流转规则
题库、试卷共用同一套状态机：

| 当前状态 | 可执行操作 |
|----------|-----------|
| 草稿 (draft) | 保存草稿、编辑、删除、提交审批 |
| 未提交 (unsubmitted) | 编辑、删除、提交审批 |
| 审批中 (pending) | 撤回、通过、驳回 |
| 已驳回 (rejected) | 编辑、删除、提交审批 |
| 待发布 (toPublish) | 发布 |
| 已发布 (published) | 取消发布（仅试卷支持） |

状态流转函数：`canPerformAction(currentStatus, action)` 控制按钮显隐，`getNextStatus(action)` 计算目标状态。

### 2.4 公共弹窗/组件说明

#### 2.4.1 CoBuilderDialog（共建人选择）
- 左右穿梭框布局
- 左侧：组织架构树（部门 → 用户），支持搜索
- 右侧：已选用户列表
- **按钮**：完成（关闭弹窗并保存选择）

#### 2.4.2 InviteCollaboratorDialog（邀请共建人）
- 搜索用户输入框
- 已选用户以 Badge 形式展示，可切换角色（editor/viewer），可删除
- **按钮**：取消 / 邀请

#### 2.4.3 ConfirmDialog（通用确认）
- 标题 + 描述文本 + 操作对象名称
- **按钮**：取消 / 确认（支持 destructive 变体，红色）

---

## 3. 通用测评资源管理

### 3.1 题库管理

#### 3.1.1 题库列表页 (`/question-banks`)

**页面入口**：侧边导航 → 通用测评资源管理 → 题库管理

**统计卡片（顶部）**：
- 题库总数 / 草稿 / 审批中 / 待发布 / 已发布
> 数据来源：后台「题库管理」/question-banks → stats.total / stats.draft / stats.pending / stats.toPublish / stats.published

**头部操作按钮**：

| 按钮 | 功能说明 |
|------|----------|
| 配置审批流程 | 占位按钮，点击无实际路由 |
> 数据来源：后台「题库管理」/question-banks → configApprovalFlow
| 配置批次分组 | 占位按钮，点击无实际路由 |
> 数据来源：后台「题库管理」/question-banks → configBatchGroup
| 导入题库 | 占位按钮，点击无实际逻辑 |
> 数据来源：后台「题库管理」/question-banks → importBank
| 新建题库 | 打开 `BankFormDialog` 弹窗，填写后创建并自动跳转至新建题库详情页 `/question-banks/{id}` |
> 数据来源：后台「题库管理」/question-banks → createBank

**Tab 切换**：
- **我的题库**：显示 ownerType = 'mine' 的题库
> 数据来源：后台「题库管理」/question-banks → tab.mine
- **共建题库**：显示 ownerType = 'collaborate' 的题库
> 数据来源：后台「题库管理」/question-banks → tab.collaborate
- **公共题库**：显示 ownerType = 'public' 的题库
> 数据来源：后台「题库管理」/question-banks → tab.public

**视图切换**：
- **资源列表**：标准表格视图
> 数据来源：后台「题库管理」/question-banks → view.list
- **批次分组**：按批次分组折叠展示
> 数据来源：后台「题库管理」/question-banks → view.batch

**搜索与筛选**：
- 搜索框：按题库名称实时过滤
> 数据来源：后台「题库管理」/question-banks → search.keyword
- 状态下拉：全部状态 / 草稿 / 已发布
> 数据来源：后台「题库管理」/question-banks → filter.status

**列表字段**：
| 字段 | 说明 |
|------|------|
| 题库名称 | 含"草稿库"标签（如果是草稿库） |
> 数据来源：后台「题库管理」/question-banks → bank.name
| 题库简介 | 最多两行，无则显示 "-" |
> 数据来源：后台「题库管理」/question-banks → bank.description
| 题目数量 | 格式：N 题 |
> 数据来源：后台「题库管理」/question-banks → bank.questionCount
| 所属批次 | 从批次数据映射 |
> 数据来源：后台「题库管理」/question-banks → bank.batchName
| 创建人 | 固定显示 "张三" |
> 数据来源：后台「题库管理」/question-banks → bank.creatorName
| 共建人 | 草稿库固定显示"李四、王五"，其他显示实际共建人 |
> 数据来源：后台「题库管理」/question-banks → bank.collaboratorNames
| 状态 | 状态徽章（草稿/未提交/审批中/已驳回/待发布/已发布） |
> 数据来源：后台「题库管理」/question-banks → bank.status
| 创建时间 / 更新时间 | 格式化日期 |
> 数据来源：后台「题库管理」/question-banks → bank.createdAt / bank.updatedAt
| 操作 | 右侧固定列，DropdownMenu |
> 数据来源：后台「题库管理」/question-banks → actions

**表格行操作按钮**（点击更多按钮展开下拉菜单）：

| 按钮 | 显示条件 | 功能说明 |
|------|----------|----------|
| 查看详情 | 始终显示 | 跳转到 `/question-banks/{id}` 题库详情页 |
> 数据来源：后台「题库管理」/question-banks → action.viewDetail
| 编辑 | 状态为 draft / unsubmitted / rejected | 打开 `BankFormDialog` 编辑弹窗 |
> 数据来源：后台「题库管理」/question-banks → action.edit
| 邀请共建 | 始终显示 | 打开 `InviteCollaboratorDialog` 弹窗 |
> 数据来源：后台「题库管理」/question-banks → action.inviteCollaborator
| 提交审批 | `canPerformAction(status, 'submit')` | 打开确认弹窗，确认后状态变为"审批中" |
> 数据来源：后台「题库管理」/question-banks → action.submitApproval
| 撤回 | `canPerformAction(status, 'withdraw')` | 打开确认弹窗，确认后状态变为"未提交" |
> 数据来源：后台「题库管理」/question-banks → action.withdraw
| 通过 | `canPerformAction(status, 'approve')` | 打开确认弹窗，确认后状态变为"待发布" |
> 数据来源：后台「题库管理」/question-banks → action.approve
| 驳回 | `canPerformAction(status, 'reject')` | 打开确认弹窗（destructive），确认后状态变为"已驳回" |
> 数据来源：后台「题库管理」/question-banks → action.reject
| 发布 | `canPerformAction(status, 'publish')` | 打开确认弹窗，确认后状态变为"已发布" |
> 数据来源：后台「题库管理」/question-banks → action.publish
| 删除 | 状态为 draft / unsubmitted / rejected | 打开确认弹窗（destructive），确认后删除；**草稿库不可删除** |
> 数据来源：后台「题库管理」/question-banks → action.delete

**新建/编辑题库弹窗 (`BankFormDialog`)**：
- 题库名称 *（必填）
> 数据来源：后台「题库管理」/question-banks → form.name
- 题库简介
> 数据来源：后台「题库管理」/question-banks → form.description
- 封面上传（图片上传组件，支持预览和删除）
> 数据来源：后台「题库管理」/question-banks → form.coverImage
- 共建人选择（点击打开 `CoBuilderDialog`）
> 数据来源：后台「题库管理」/question-banks → form.collaboratorIds
- 所属批次（下拉选择）
> 数据来源：后台「题库管理」/question-banks → form.batchId
- 当前版本号（编辑时只读）
> 数据来源：后台「题库管理」/question-banks → form.version
- **按钮**：取消 / 创建（或保存）

---

#### 3.1.2 题库详情页 (`/question-banks/{id}`)

**页面入口**：题库列表页点击"查看详情"

**头部区域**：
- **返回题库列表**：Link 返回 `/question-banks`
> 数据来源：后台「题库管理」/question-banks → navigation.back

**题库信息卡片**：
- 封面图 / 默认图标
- 题库名称 + 草稿库标签 + 版本号 Badge
> 数据来源：后台「题库管理」/question-banks → bank.name / bank.version
- 描述文本
> 数据来源：后台「题库管理」/question-banks → bank.description
- 题目数量 / 创建时间 / 更新时间
> 数据来源：后台「题库管理」/question-banks → bank.questionCount / bank.createdAt / bank.updatedAt
- 共建人 / 共建部门（如有）
> 数据来源：后台「题库管理」/question-banks → bank.collaborators

**题目管理区域操作按钮**：
| 按钮 | 功能说明 |
|------|----------|
| 导入题目 | `alert("此处参考 1.0 版本页面功能即可")` |
> 数据来源：后台「题库管理」/question-banks → question.import
| 添加题目 | `alert("此处参考 1.0 版本页面功能即可")` |
> 数据来源：后台「题库管理」/question-banks → question.add

**批量操作栏**（选中题目后显示）：
| 按钮 | 功能说明 |
|------|----------|
| 批量复制 | 复制选中题目到当前题库（内容加" (复制)"后缀） |
> 数据来源：后台「题库管理」/question-banks → question.batchCopy
| 批量移动 | 打开批量移动弹窗，选择目标题库后移动 |
> 数据来源：后台「题库管理」/question-banks → question.batchMove
| 批量删除 | 打开确认弹窗，确认后删除选中题目 |
> 数据来源：后台「题库管理」/question-banks → question.batchDelete

**搜索与筛选**：
- 搜索框：按题目内容实时过滤
> 数据来源：后台「题库管理」/question-banks → question.searchKeyword
- 题型筛选：全部、单选题、多选题、判断题、填空题、简答题、编程题
> 数据来源：后台「题库管理」/question-banks → question.filter.type
- 创建人筛选：动态从题目创建人列表生成下拉选项
> 数据来源：后台「题库管理」/question-banks → question.filter.creator

**题目列表字段**：
| 字段 | 说明 |
|------|------|
| 复选框 | 全选 / 单选 |
| 题目内容 | 最多两行 |
> 数据来源：后台「题库管理」/question-banks → question.content
| 题型 | Badge（单选题/多选题/判断题/填空题/简答题/问答题） |
> 数据来源：后台「题库管理」/question-banks → question.type
| 难度 | Badge（简单/中等/困难） |
> 数据来源：后台「题库管理」/question-banks → question.difficulty
| 分值 | 该题目的默认分值 |
> 数据来源：后台「题库管理」/question-banks → question.score
| 添加来源 | 显示 source 或 "-" |
> 数据来源：后台「题库管理」/question-banks → question.source
| 创建人 | 创建该题目的用户 |
> 数据来源：后台「题库管理」/question-banks → question.creatorName
| 所属院系 | 题目关联的院系/部门 |
> 数据来源：后台「题库管理」/question-banks → question.department
| 创建时间 | 格式化日期 |
> 数据来源：后台「题库管理」/question-banks → question.createdAt
| 操作 | 预览 / 复制 / 编辑 / 删除 |
> 数据来源：后台「题库管理」/question-banks → question.actions

**题目行操作按钮**：
| 按钮 | 功能说明 |
|------|----------|
| 预览 | 打开 `QuestionPreview` 弹窗 |
> 数据来源：后台「题库管理」/question-banks → question.action.preview
| 复制 | 复制该题目到当前题库 |
> 数据来源：后台「题库管理」/question-banks → question.action.copy
| 编辑 | 打开 `QuestionFormDialog` 弹窗 |
> 数据来源：后台「题库管理」/question-banks → question.action.edit
| 删除 | 打开 `ConfirmDialog` 确认删除 |
> 数据来源：后台「题库管理」/question-banks → question.action.delete

**题目表单弹窗 (`QuestionFormDialog`)**：
- 题目类型 *（单选/多选/判断/填空/简答/问答）
- 难度（简单/中等/困难）
- 关联知识点（下拉选择 + Badge 标签形式展示）
- 题目内容 *（富文本/文本输入）
- 选项（单选/多选时显示，支持增删，最多 A-H）
- 正确答案（根据题型动态渲染输入方式）
- 答案解析
- **按钮**：取消 / 创建（或保存）

**题目预览弹窗 (`QuestionPreview`)**：
- 题目内容、选项、正确答案、解析

---

### 3.2 试卷管理

#### 3.2.1 试卷列表页 (`/exams`)

**页面入口**：侧边导航 → 通用测评资源管理 → 试卷管理

**统计卡片**：试卷总数 / 草稿 / 审批中 / 待发布 / 已发布
> 数据来源：后台「试卷管理」/exams → stats.total / stats.draft / stats.pending / stats.toPublish / stats.published

**头部操作按钮**：

| 按钮 | 功能说明 |
|------|----------|
| 配置审批流程 | 占位按钮 |
> 数据来源：后台「试卷管理」/exams → configApprovalFlow
| 配置批次分组 | 占位按钮 |
> 数据来源：后台「试卷管理」/exams → configBatchGroup
| 导入试卷 | 占位按钮 |
> 数据来源：后台「试卷管理」/exams → importExam
| 新建试卷 | 打开 `ExamFormDialog` 弹窗，创建后自动跳转至 `/exams/{id}` |
> 数据来源：后台「试卷管理」/exams → createExam

**Tab 切换**：我的试卷 / 共建试卷 / 公共试卷
> 数据来源：后台「试卷管理」/exams → tab.mine / tab.collaborate / tab.public

**视图切换**：资源列表 / 批次分组
> 数据来源：后台「试卷管理」/exams → view.list / view.batch

**搜索与筛选**：
- 搜索框：按试卷名称或简介过滤
> 数据来源：后台「试卷管理」/exams → search.keyword
- 状态筛选：全部状态 + 所有 Status 类型
> 数据来源：后台「试卷管理」/exams → filter.status
- 批次筛选：全部批次 + 批次列表
> 数据来源：后台「试卷管理」/exams → filter.batch

**列表字段**：
| 字段 | 说明 |
|------|------|
| 试卷名称 | 可点击，跳转 landingpage 预览 |
> 数据来源：后台「试卷管理」/exams → exam.name
| 试卷简介 | 最多两行 |
> 数据来源：后台「试卷管理」/exams → exam.description
| 题目数量 | `exam.questions.length` |
> 数据来源：后台「试卷管理」/exams → exam.questionCount
| 总分 | `exam.totalScore` 分 |
> 数据来源：后台「试卷管理」/exams → exam.totalScore
| 所属批次 | 从批次数据映射 |
> 数据来源：后台「试卷管理」/exams → exam.batchName
| 创建人 | 从用户数据映射 |
> 数据来源：后台「试卷管理」/exams → exam.creatorName
| 共建人 | collaboratorIds 映射 |
> 数据来源：后台「试卷管理」/exams → exam.collaboratorNames
| 状态 | 状态徽章 |
> 数据来源：后台「试卷管理」/exams → exam.status
| 创建时间 / 更新时间 | 含时分 |
> 数据来源：后台「试卷管理」/exams → exam.createdAt / exam.updatedAt
| 操作 | DropdownMenu |
> 数据来源：后台「试卷管理」/exams → actions

**表格行操作按钮**：

| 按钮 | 显示条件 | 功能说明 |
|------|----------|----------|
| 配置试卷 | `status === 'draft'` | 跳转到 `/exams/{id}` 组卷页面 |
> 数据来源：后台「试卷管理」/exams → action.config
| 预览试卷 | 始终显示 | 跳转 landingpage 预览 |
> 数据来源：后台「试卷管理」/exams → action.preview
| 修改试卷基本信息 | `canEdit` | 打开 `ExamFormDialog` 编辑弹窗 |
> 数据来源：后台「试卷管理」/exams → action.editInfo
| 邀请共建 | 始终显示 | 打开 `InviteCollaboratorDialog` |
> 数据来源：后台「试卷管理」/exams → action.inviteCollaborator
| 提交审批 | `canSubmit` | 确认弹窗后提交 |
> 数据来源：后台「试卷管理」/exams → action.submitApproval
| 撤回审批 | `canWithdraw` | 确认弹窗后撤回 |
> 数据来源：后台「试卷管理」/exams → action.withdraw
| 通过 | `canApprove` | 确认弹窗后通过 |
> 数据来源：后台「试卷管理」/exams → action.approve
| 驳回 | `canReject` | 确认弹窗后驳回（destructive） |
> 数据来源：后台「试卷管理」/exams → action.reject
| 发布 | `canPublish` | 确认弹窗后发布 |
> 数据来源：后台「试卷管理」/exams → action.publish
| 取消发布 | `canUnpublish` | 确认弹窗后取消发布（destructive） |
> 数据来源：后台「试卷管理」/exams → action.unpublish
| 删除 | `canDelete` | 确认弹窗后删除（destructive） |
> 数据来源：后台「试卷管理」/exams → action.delete

**新建/编辑试卷弹窗 (`ExamFormDialog`)**：
- 试卷名称 *（必填）
> 数据来源：后台「试卷管理」/exams → form.name
- 试卷简介
> 数据来源：后台「试卷管理」/exams → form.description
- 封面上传
> 数据来源：后台「试卷管理」/exams → form.coverImage
- 共建人选择（打开 `CoBuilderDialog`）
> 数据来源：后台「试卷管理」/exams → form.collaboratorIds
- 所属批次
> 数据来源：后台「试卷管理」/exams → form.batchId
- 当前版本号（编辑时只读）
> 数据来源：后台「试卷管理」/exams → form.version
- **按钮**：取消 / 创建（或保存）

---

#### 3.2.2 试卷详情（组卷）页 (`/exams/{id}`)

**页面入口**：试卷列表页点击"配置试卷"

**页面状态**：
- 正常编辑模式
- 预览模式：`?mode=preview`，隐藏所有操作按钮

**头部操作按钮**：

| 按钮 | 显示条件 | 功能说明 |
|------|----------|----------|
| 返回组卷列表 | 非预览模式 | Link 返回 `/exams` |
> 数据来源：后台「试卷管理」/exams → navigation.back
| 返回 | 预览模式 | `router.back()` |
> 数据来源：后台「试卷管理」/exams → navigation.backPreview
| 修改试卷基本信息 | `canEdit` | 打开 `ExamFormDialog` |
> 数据来源：后台「试卷管理」/exams → action.editInfo
| 提交审批 | `canSubmit` | 更新状态为 submit |
> 数据来源：后台「试卷管理」/exams → action.submitApproval
| 删除 | `canDelete` | 删除试卷并跳回列表 |
> 数据来源：后台「试卷管理」/exams → action.delete
| 预览试卷 | 始终显示 | 跳转 landingpage 预览 |
> 数据来源：后台「试卷管理」/exams → action.preview
| 保存试卷 | 始终显示 | Toast 提示"保存成功" |
> 数据来源：后台「试卷管理」/exams → action.save

**工具栏按钮**（`canEdit` 时显示）：

| 按钮 | 功能说明 |
|------|----------|
| 自动抽题 | 打开 `RandomQuestionDialog` |
> 数据来源：后台「试卷管理」/exams → action.randomPick
| 手动抽题 | `alert("此处参考 1.0 版本页面功能即可")` |
> 数据来源：后台「试卷管理」/exams → action.manualPick
| 新增题目 | `alert("此处参考 1.0 版本页面功能即可")` |
> 数据来源：后台「试卷管理」/exams → action.addQuestion
| 批量导入题目 | `alert("此处参考 1.0 版本页面功能即可")` |
> 数据来源：后台「试卷管理」/exams → action.batchImport

**题目列表操作**：
- 拖拽排序（使用 HTML5 dragstart/dragover/dragend）
- 分值输入框：直接修改每题分值
> 数据来源：后台「试卷管理」/exams → question.score
- 每题右侧：**预览按钮**（打开 `QuestionPreview`）、**删除按钮**（打开 `ConfirmDialog` 确认移除）

**自动抽题弹窗 (`RandomQuestionDialog`)**：
- 筛选维度：
  - 题库（多选搜索）
  - 题型（Badge 切换：单选/多选/判断/填空/简答/问答）
  - 难度（Badge 切换：简单/中等/困难）
  - 知识点（多选搜索）
- 每个维度可启用权重（Switch），权重配置输入框（自动校准总和 100%）
- 抽取数量输入（1-50）
- 底部显示预估可抽取数量
- **按钮**：取消 / 随机抽题（disabled 当无可用题目）

**手动抽题弹窗 (`ManualQuestionDialog`)**：
- 选择题库 → 搜索题目 / 题型筛选 → 勾选题目（全选/单选）→ 添加选中
- **按钮**：添加选中 (N)

**新增题目到试卷弹窗 (`AddQuestionToExamDialog`)**：
- 关联题库 * / 题目类型 * / 题目内容 * / 选项/答案（根据题型）/ 难度 / 知识点（Badge 切换）/ 解析
- **按钮**：取消 / 添加到试卷

---

### 3.3 考试管理

#### 3.3.1 考试列表页 (`/exam-usage`)

**页面入口**：侧边导航 → 通用测评资源管理 → 考试管理

**统计卡片**：考试总数 / 未开始 / 进行中 / 已结束
> 数据来源：后台「考试管理」/exam-usage → stats.total / stats.pending / stats.active / stats.ended

**头部操作按钮**：

| 按钮 | 功能说明 |
|------|----------|
| 添加考试 | 打开创建在线考试弹窗 |
> 数据来源：后台「考试管理」/exam-usage → action.create

**搜索与筛选**：
- 搜索框：按试卷名称或场景名称搜索
> 数据来源：后台「考试管理」/exam-usage → search.keyword
- 场景筛选：全部场景 / 场景 / 课程
> 数据来源：后台「考试管理」/exam-usage → filter.scene
- 类型筛选：全部类型 / 随堂测 / 教学考试
> 数据来源：后台「考试管理」/exam-usage → filter.type

**列表字段**：
| 字段 | 说明 |
|------|------|
| 试卷名称 | |
> 数据来源：后台「考试管理」/exam-usage → examUsage.examName
| 使用场景 | 场景/课程/教学考试，带图标 |
> 数据来源：后台「考试管理」/exam-usage → examUsage.sceneType
| 面向对象 | 教学考试显示"教师"或"学生"，其他显示 "-" |
> 数据来源：后台「考试管理」/exam-usage → examUsage.targetAudience
| 考试描述 | 最多两行 |
> 数据来源：后台「考试管理」/exam-usage → examUsage.description
| 考试时长 | N 分钟 或 "-" |
> 数据来源：后台「考试管理」/exam-usage → examUsage.duration
| 参考人数 | N 人 |
> 数据来源：后台「考试管理」/exam-usage → examUsage.participantCount
| 考试开放时间 | 起止时间，分两行显示 |
> 数据来源：后台「考试管理」/exam-usage → examUsage.openTimeRange
| 及格人数 | N 人 或 "-" |
> 数据来源：后台「考试管理」/exam-usage → examUsage.passCount
| 考试状态 | pending(未开始, secondary) / active(进行中, green) / ended(已结束, outline) |
> 数据来源：后台「考试管理」/exam-usage → examUsage.status
| 操作 | DropdownMenu |
> 数据来源：后台「考试管理」/exam-usage → actions

**表格行操作按钮**（DropdownMenu）：

| 按钮 | 显示条件 | 功能说明 |
|------|----------|----------|
| 分享考试 | 始终显示 | 打开分享弹窗，复制考试链接到剪贴板 |
> 数据来源：后台「考试管理」/exam-usage → action.share
| 查看考试结果 | `status === 'ended'` | 跳转到 `/exam-usage/results?usageId={id}` |
> 数据来源：后台「考试管理」/exam-usage → action.viewResults
| 编辑 | `displayType === '教学考试'` | `alert("此处参考 1.0")` |
> 数据来源：后台「考试管理」/exam-usage → action.edit
| 删除 | `displayType === '教学考试'` | `alert("此处参考 1.0")`（destructive） |
> 数据来源：后台「考试管理」/exam-usage → action.delete

**创建在线考试弹窗**：

| 字段 | 说明 |
|------|------|
| 选择试卷 * | Select，从 exams 列表选择 |
> 数据来源：后台「考试管理」/exam-usage → dialog.examSelect
| 考试名称 * | Input |
> 数据来源：后台「考试管理」/exam-usage → dialog.examName
| 考试简介 | Textarea |
> 数据来源：后台「考试管理」/exam-usage → dialog.description
| 考试须知 | Textarea（默认 5 条须知） |
> 数据来源：后台「考试管理」/exam-usage → dialog.notice
| 考试封面 | 文件上传（图片，≤5MB），支持预览和删除 |
> 数据来源：后台「考试管理」/exam-usage → dialog.coverImage
| 面向对象 | 单选：学生 / 教师 |
> 数据来源：后台「考试管理」/exam-usage → dialog.targetAudience
| 参考班级 | 学生时显示，Popover 组织架构树形选择（学院→年级→班级），支持搜索和批量勾选 |
> 数据来源：后台「考试管理」/exam-usage → dialog.targetStudents
| 参考人员 | 教师时显示，打开 `CoBuilderDialog` 选择教师 |
> 数据来源：后台「考试管理」/exam-usage → dialog.targetTeachers
| 考试时间 | 单选：随时开放 / 定期开放（datetime-local 起止）/ 手动开放 |
> 数据来源：后台「考试管理」/exam-usage → dialog.openType
| 考试时长 | 单位为分钟 |
> 数据来源：后台「考试管理」/exam-usage → dialog.duration
| 是否发布到前台考试中心 | Switch |
> 数据来源：后台「考试管理」/exam-usage → dialog.publishToLanding

- **按钮**：取消 / 创建考试（disabled 当未选试卷或未填名称）

**分享考试弹窗**：
- 显示考试信息和链接
- **复制到剪贴板按钮**
- **关闭按钮**

---

#### 3.3.2 考试结果页 (`/exam-usage/results?usageId={id}`)

**页面入口**：考试列表页点击"查看考试结果"

**头部操作按钮**：

| 按钮 | 功能说明 |
|------|----------|
| 返回考试管理 | Link 返回 `/exam-usage` |
> 数据来源：后台「考试管理」/exam-usage/results → navigation.back
| 导出数据 | 占位按钮（仅 UI） |
> 数据来源：后台「考试管理」/exam-usage/results → action.export

**统计卡片（6 个）**：参考人数 / 平均分 / 最高分 / 最低分 / 及格人数 / 不及格人数
> 数据来源：后台「考试管理」/exam-usage/results → stats.participants / stats.average / stats.max / stats.min / stats.pass / stats.fail

**搜索与筛选**：
- 搜索框：按学生姓名搜索
- 及格状态筛选按钮：全部 / 及格 / 不及格

**列表字段**：
| 字段 | 说明 |
|------|------|
| 排名 | 学生按分数从高到低排序后的名次 |
> 数据来源：后台「考试管理」/exam-usage/results → result.rank
| 学生名称 | 带 User 图标 |
> 数据来源：后台「考试管理」/exam-usage/results → result.studentName
| 学号 | |
> 数据来源：后台「考试管理」/exam-usage/results → result.studentId
| 班级 | |
> 数据来源：后台「考试管理」/exam-usage/results → result.className
| 年级 | |
> 数据来源：后台「考试管理」/exam-usage/results → result.grade
| 专业 | |
> 数据来源：后台「考试管理」/exam-usage/results → result.major
| 考试时间 | 提交时间 |
> 数据来源：后台「考试管理」/exam-usage/results → result.submitTime
| 考试得分 | 分数 + 总分，带进度条可视化 |
> 数据来源：后台「考试管理」/exam-usage/results → result.score / result.totalScore
| 是否及格 | 绿色 Badge(及格) / 红色 Badge(不及格) |
> 数据来源：后台「考试管理」/exam-usage/results → result.isPass
| 操作 | 查看详情（占位按钮） |
> 数据来源：后台「考试管理」/exam-usage/results → actions

---

## 4. 岗位能力认定管理

### 4.1 岗位能力认定规则配置 (`/job-ability`)

**页面入口**：侧边导航 → 岗位能力认定管理 → 岗位能力认定规则配置

**搜索与筛选**：
- 搜索框：按岗位名称、岗位编码搜索
> 数据来源：后台「岗位能力认定管理」/job-ability → search.keyword
- 下拉筛选：按"所属行业"筛选（动态从数据中拉取所有专业方向）
> 数据来源：后台「岗位能力认定管理」/job-ability → filter.direction

**列表字段**：
| 字段 | 说明 |
|------|------|
| 复选框 | 全选/单选 |
| 岗位名称 | |
> 数据来源：后台「岗位能力认定管理」/job-ability → position.name
| 岗位编码 | |
> 数据来源：后台「岗位能力认定管理」/job-ability → position.code
| 所属行业 | 专业方向 |
> 数据来源：后台「岗位能力认定管理」/job-ability → position.direction
| 关联能力数 | 关联的能力数量（居中） |
> 数据来源：后台「岗位能力认定管理」/job-ability → position.abilityCount
| 最后更新者 | |
> 数据来源：后台「岗位能力认定管理」/job-ability → position.lastUpdater
| 更新时间 | 最后更新时间 |
> 数据来源：后台「岗位能力认定管理」/job-ability → position.updateTime
| 操作 | 按钮 |
> 数据来源：后台「岗位能力认定管理」/job-ability → actions

**表格行操作按钮**：

| 按钮 | 功能说明 |
|------|----------|
| 配置认定规则 | 带 Settings2 图标，点击跳转到 `/job-ability/config/{position.id}` |
> 数据来源：后台「岗位能力认定管理」/job-ability → action.configRule

**批量操作栏**（选中多项时）：
- 显示"已选择 X 项"
- **取消选择** 按钮
- **批量发布** 按钮（仅发布状态为 ready 的岗位）

**分页**：
- 底部显示共 X 条记录
- 上一页/下一页/页码按钮（当前均为 disabled 状态，仅展示）

---

### 4.2 规则配置详情页 (`/job-ability/config/{id}`)

**页面入口**：岗位列表页点击"配置认定规则"

**头部操作按钮**：

| 按钮 | 功能说明 |
|------|----------|
| 返回岗位列表 | 返回 `/job-ability` |
> 数据来源：后台「岗位能力认定管理」/job-ability/config → navigation.back
| 配置全局等级映射 | 打开全局等级映射配置弹窗 |
> 数据来源：后台「岗位能力认定管理」/job-ability/config → action.globalLevelMap
| 保存规则 | 保存当前配置 |
> 数据来源：后台「岗位能力认定管理」/job-ability/config → action.save

**主表格字段（8 列）**：
| 字段 | 说明 |
|------|------|
| 能力域 | 能力大项，支持 rowspan |
| 能力点 | 能力子项，支持 rowspan |
| 能力点权重 | 可点击编辑，打开权重配置弹窗 |
> 数据来源：后台「岗位能力认定管理」/job-ability/config → abilityPointWeight
| 关联场景任务 | 任务名称 |
> 数据来源：后台「岗位能力认定管理」/job-ability/config → table.scenarioTask
| 任务权重 | 可点击编辑，打开任务权重配置弹窗 |
> 数据来源：后台「岗位能力认定管理」/job-ability/config → taskWeight
| 任务能力掌握度 | 等级映射区间显示，可修改 |
> 数据来源：后台「岗位能力认定管理」/job-ability/config → table.masteryLevel
| 岗位所需掌握度 | 显示掌握度等级标签（如"精通L5"） |
> 数据来源：后台「岗位能力认定管理」/job-ability/config → table.requiredLevel
| 岗位能力认定毕业标准 | 整表合并显示，点击配置 |
> 数据来源：后台「岗位能力认定管理」/job-ability/config → table.graduationStandard

**表格内可点击操作**：
- 能力点权重：悬停显示 Edit2 图标，点击打开**配置能力点权重弹窗**
- 任务权重：悬停显示 Edit2 图标，点击打开**配置任务权重弹窗**
- 任务能力掌握度右侧有 **修改** 按钮，点击打开**配置自定义等级映射弹窗**
- 岗位能力认定毕业标准列：整列点击打开**毕业标准配置弹窗**

**弹窗说明**：

| 弹窗名称 | 功能说明 |
|---------|----------|
| 配置自定义等级映射 | 为能力点设置 min/max 百分比区间，**保存** / **取消** |
> 数据来源：后台「岗位能力认定管理」/job-ability/config → dialog.customLevelMap
| 岗位能力认定毕业标准 | 配置得分档次（如 A+: 95~100%），支持添加/删除档次，**保存** / **取消** |
> 数据来源：后台「岗位能力认定管理」/job-ability/config → dialog.graduationStandard
| 配置能力点权重 | 所有能力点权重分配，合计必须 100%，**保存** / **取消** |
> 数据来源：后台「岗位能力认定管理」/job-ability/config → dialog.abilityPointWeight
| 配置任务权重 | 单能力点下各任务权重分配，合计必须 100%，**保存** / **取消** |
> 数据来源：后台「岗位能力认定管理」/job-ability/config → dialog.taskWeight
| 配置全局等级映射 | 全局等级映射配置（L1~L5 的百分比区间），含**覆盖**操作 |
> 数据来源：后台「岗位能力认定管理」/job-ability/config → dialog.globalLevelMap
| 确认覆盖 | 确认用全局映射覆盖所有自定义配置，不可撤销，**确认覆盖** / **取消** |
> 数据来源：后台「岗位能力认定管理」/job-ability/config → dialog.confirmOverride

**状态控制**：
- `isReadOnly = rule.status === 'reviewing'`：审批中状态时整个页面 pointer-events-none（只读）

**内部状态流转操作**：
- 保存草稿 / 提交审批（需权重校验通过）/ 取消审批 / 发布规则 / 取消发布 / 邀请共建

---

### 4.3 岗位能力认定结果查看 (`/job-ability/results`)

**页面入口**：侧边导航 → 岗位能力认定管理 → 岗位能力认定结果查看

**布局**：左右分栏（左侧岗位导航 + 右侧结果列表）

**左侧岗位导航**：
- 顶部标题"岗位列表"，提示"点击岗位查看测评结果"
- **全部岗位** 按钮：显示总人数
> 数据来源：后台「岗位能力认定管理」/job-ability/results → positionList.all
- 各岗位按钮：显示岗位名称、编码、该岗位结果人数
> 数据来源：后台「岗位能力认定管理」/job-ability/results → positionList.item
- 点击切换选中岗位

**右侧筛选栏**：
- 搜索框：搜索学生姓名或岗位名称
> 数据来源：后台「岗位能力认定管理」/job-ability/results → search.keyword

**列表字段（10 列）**：
| 字段 | 说明 |
|------|------|
| 学生名称 | 带 User 图标 |
> 数据来源：后台「岗位能力认定管理」/job-ability/results → result.studentName
| 学号 | |
> 数据来源：后台「岗位能力认定管理」/job-ability/results → result.studentId
| 班级 | |
> 数据来源：后台「岗位能力认定管理」/job-ability/results → result.className
| 专业 | |
> 数据来源：后台「岗位能力认定管理」/job-ability/results → result.major
| 院系 | |
> 数据来源：后台「岗位能力认定管理」/job-ability/results → result.department
| 岗位能力达标率 | 如"XX%（X/X 能力点达成）" |
> 数据来源：后台「岗位能力认定管理」/job-ability/results → result.achievementRate
| 岗位胜任度 | 百分比（紫色） |
> 数据来源：后台「岗位能力认定管理」/job-ability/results → result.competencyRate
| 岗位能力认定得分 | 分数（蓝色） |
> 数据来源：后台「岗位能力认定管理」/job-ability/results → result.score
| 岗位能力认定毕业标准 | 等级标签 |
> 数据来源：后台「岗位能力认定管理」/job-ability/results → result.graduationStandard
| 更新时间 | 格式化日期时间 |
> 数据来源：后台「岗位能力认定管理」/job-ability/results → result.updateTime

**弹窗**：
- `StudentPortraitModal`：学生画像弹窗（状态已定义）

---

## 5. 测评方式库

### 5.1 测评方式管理 (`/evaluation-methods`)

**页面入口**：侧边导航 → 测评方式库 → 测评方式管理

**搜索**：
- 搜索框：按测评方式名称搜索
> 数据来源：后台「测评方式库」/evaluation-methods → search.keyword

**列表字段（7 列）**：
| 字段 | 说明 |
|------|------|
| 一级分类 | 合并单元格显示分类 Badge |
> 数据来源：后台「测评方式库」/evaluation-methods → method.category
| 二级分类（测评方式） | 测评方式名称 |
> 数据来源：后台「测评方式库」/evaluation-methods → method.subCategory
| 前台展示 | Switch 开关，可切换 enabled 状态 |
> 数据来源：后台「测评方式库」/evaluation-methods → method.enabled
| 测评方式说明 | 文本，最多两行截断 |
> 数据来源：后台「测评方式库」/evaluation-methods → method.description
| 文档链接 | 有则显示为可点击外链（ExternalLink 图标） |
> 数据来源：后台「测评方式库」/evaluation-methods → method.docLink
| 管理场景任务 | 显示关联任务数量，如"X 个任务"（可点击） |
> 数据来源：后台「测评方式库」/evaluation-methods → method.taskCount
| 操作 | 编辑按钮 |
> 数据来源：后台「测评方式库」/evaluation-methods → actions

**操作按钮**：
- **Switch 开关**：切换测评方式的前台展示状态（enabled/disabled）
> 数据来源：后台「测评方式库」/evaluation-methods → action.toggleEnabled
- **X 个任务**（链接）：点击打开"关联场景任务列表"弹窗
> 数据来源：后台「测评方式库」/evaluation-methods → action.viewTasks
- **编辑**（Pencil 图标）：点击打开编辑弹窗
> 数据来源：后台「测评方式库」/evaluation-methods → action.edit

**弹窗说明**：

| 弹窗名称 | 功能说明 |
|---------|----------|
| 关联场景任务列表 | 显示该测评方式关联的所有场景任务，含任务名称、所属场景、关联测评方式数量 |
> 数据来源：后台「测评方式库」/evaluation-methods → dialog.taskList
| 编辑测评方式 | 编辑"测评方式说明"（Textarea）和"文档链接"（Input），**取消** / **保存** |
> 数据来源：后台「测评方式库」/evaluation-methods → dialog.edit

---

### 5.2 测评方式详情页（学生端） (`/evaluation-methods/student/{id}`)

**页面入口**：学生端入口

**头部按钮**：
- **返回测评方式列表**：返回 `/evaluation-methods`

**信息展示**：
- 顶部卡片：测评方式名称 + 分类标签 + 启用状态
- 三个统计项（网格布局）：所属分类 / 关联任务 X 个 / 文档链接 有/无

**下方双栏布局**：
- **左侧：测评方式说明**
  - 显示详细说明文本
  - 如有文档链接，显示"查看完整文档"外链
- **右侧：相关场景任务**
  - 列表展示关联任务，每项显示：图标（BarChart3）、任务名称、所属场景、ChevronRight 箭头

---

### 5.3 测评结果管理 (`/scene-task-results`)

**页面入口**：侧边导航 → 测评方式库 → 测评结果管理

**顶部 Tab 切换**：场景任务 / 智慧课堂 / 在线课程
> 数据来源：后台「测评方式库」/scene-task-results → tab.scene / tab.onlineClassroom / tab.smartCourse

---

#### Tab 1: 场景任务 (`SceneTaskTab`)

**布局**：左右分栏

**左侧边栏（场景+任务树）**：
- 搜索框：搜索场景、任务
> 数据来源：后台「测评方式库」/scene-task-results → scene.search
- 场景列表（可展开/收起）：
  - 显示场景名称、场景编码
> 数据来源：后台「测评方式库」/scene-task-results → scene.tree.scenarioName / scene.tree.scenarioCode
  - 展开后显示任务列表：
    - 任务名称
    - 待评数量（amber badge）
    - 已评数量（green badge）
    - 任务类型（考核/训练）
    - 测评形式
  - 点击任务选中

**右侧内容区**：
- 任务标题 + 场景标签 + 任务类型标签 + 测评形式标签 + 学生人数
> 数据来源：后台「测评方式库」/scene-task-results → scene.taskName / scene.scenarioName

**两级筛选栏**：
1. **测评方式**：全部 / 试卷 / 题库 / 评审 / 现场问答（显示各方式数量）
> 数据来源：后台「测评方式库」/scene-task-results → scene.methodFilter
2. **评分状态**：全部 / 待评分 / 已评分（显示各状态数量）
> 数据来源：后台「测评方式库」/scene-task-results → scene.statusFilter

**学生列表项字段**：
- 头像（姓名首字）
- 学生姓名
- 学号
- 状态 Badge（待评分/已评分）
- 测评方式 Badge
- 提交时间
- 班级 · 届

**操作按钮（每行）**：

| 按钮 | 显示条件 | 功能说明 |
|------|----------|----------|
| 查看 | 始终显示 | 跳转 `/scene-task-results/{submissionId}` |
> 数据来源：后台「测评方式库」/scene-task-results → action.view
| 评分 | 仅待评分 | 跳转 `/scene-task-results/{submissionId}` |
> 数据来源：后台「测评方式库」/scene-task-results → action.score
| 已评分 | 仅已评分 | disabled 状态的 ghost 按钮 |
> 数据来源：后台「测评方式库」/scene-task-results → action.scored

---

#### Tab 2: 智慧课堂 (`OnlineClassroomTab`)

**布局**：左右分栏

**左侧边栏**：
- 搜索框：搜索课堂、学生
- 课堂列表：
  - 课堂名称、课堂编码
  - 待评/已评数量 badge
  - 点击选中课堂

**右侧内容区**：
- 课堂名称 + 分类 Badge + 编码 Badge + 教师名

**状态筛选标签**：
- 全部 / 待评分 / 已评分（显示数量）

**学生列表字段/操作**：
- 头像、姓名、学号、状态 Badge
- 已评分显示分数
- **查看** 按钮（未绑定实际链接）
- **评分** 按钮（未绑定实际链接）
- **已评分** 按钮（disabled）

---

#### Tab 3: 在线课程 (`SmartCourseTab`)

**布局**：左右分栏

**左侧边栏**：
- 搜索框：搜索课程、章节、学生
- 课程列表（可展开/收起）：
  - 课程名称、课程编码
  - 展开后显示章节列表：
    - 章节名称
    - 待评/已评数量
  - 点击课程或章节选中

**右侧内容区**：
- 课程名称（+ 当前章节名）
- 分类 Badge + 编码 Badge + 教师名
- 状态筛选标签（全部/待评分/已评分）
- 学生列表（与智慧课堂类似，查看/评分/已评分按钮）

---

### 5.4 场景任务评分详情页 (`/scene-task-results/{id}`)

**页面入口**：测评结果管理页点击"查看"或"评分"

**头部**：
- **返回** 按钮：返回 `/scene-task-results`
- 标题"评分详情"
- 副标题：场景名 · 任务名 · 测评形式

**内容卡片 1：提交信息**
- 场景 / 任务 / 测评形式 / 提交时间 / 状态（已评分/待评分，带颜色区分）/ 满分

**内容卡片 2：评分操作**
- 提示文本："此处为评分详情占位页面。实际评分功能需要进一步开发。"
- **提交评分** 按钮（仅待评分状态显示）
- **已评分** 按钮（disabled，仅已评分状态显示）

---

## 6. 毕业设计管理

### 6.1 毕业设计选题管理 (`/graduation-project/topics`)

**页面入口**：侧边导航 → 毕业设计管理 → 毕业设计选题管理

**统计卡片**：选题概况（总数/草稿/审批中/已发布/已锁定）、选题来源（场景库/企业需求）

**搜索与筛选**：
- 顶部学院 Tab 切换（全部学院、计算机学院、软件学院等）
- 搜索框：按选题名称、岗位、导师搜索
- 状态下拉：全部/草稿/审批中/已发布/已锁定
- 来源下拉：全部/场景库/企业需求

**列表字段**：
| 字段 | 说明 |
|------|------|
| 选题名称 | 含描述 |
| 所属学院 | |
| 关联岗位 | 带图标 |
| 来源 | 场景库 / 企业需求 |
| 状态 | 草稿/审批中/已发布/已锁定 |
| 容量 | 已申请/总容量 |
| 指导教师 | |
| 企业导师 | |
| 起止时间 | |
| 操作 | DropdownMenu |

**表格行操作按钮**（按状态区分）：

| 状态 | 按钮 | 功能说明 |
|------|------|----------|
| 全部 | 查看 | 打开选题详情弹窗 |
| 草稿 | 编辑 | 打开编辑弹窗 |
| 草稿 | 删除 | 打开删除确认弹窗 |
| 草稿 | 提交审批 | 状态变为审批中 |
| 审批中 | 撤回 | 状态退回草稿 |
| 审批中 | 通过 | 状态变为已发布 |
| 审批中 | 驳回 | 状态退回草稿 |
| 已发布 | 申请(N) | 查看该选题的申请列表 |
| 已发布 | 取消发布 | 状态退回草稿 |
| 已发布 | 锁定 | 打开锁定确认弹窗，锁定后生成毕设档案 |
| 已锁定 | 申请(N) | 查看该选题的申请列表 |
| 已锁定 | 取消锁定 | 状态退回已发布 |

**弹窗说明**：

| 弹窗名称 | 功能说明 |
|---------|----------|
| 发布/编辑弹窗 | 选题名称、所属二级学院、选题来源、关联岗位、关联场景（场景库时显示场景卡片，含能力点/知识点/任务链）、企业项目配置（企业需求时）、能力要求配置（待开发占位）、学生容量、起止日期、选题描述、指导教师选择（支持多选，弹窗内搜索）、企业导师选择（支持多选，弹窗内搜索） |
| 指导教师搜索弹窗 | 按姓名/学院搜索，点击勾选 |
| 企业导师搜索弹窗 | 按姓名/企业搜索，点击勾选 |
| 查看详情弹窗 | 展示所有基础信息，底部根据状态显示对应的操作按钮（编辑/提交审批/撤回/通过/驳回/取消发布/锁定/取消锁定） |
| 删除确认弹窗 | 确认后删除选题 |
| 锁定确认弹窗 | 确认后锁定并自动生成毕设档案 |
| 申请列表弹窗 | 展示该选题下的学生申请记录（学生、班级、申请理由、负责教师、申请时间） |

**页面跳转**：
- 右上角 **「学生申请入口」** 按钮 → 新标签页打开 `/graduation-project/student/apply`

---

### 6.2 毕设档案管理 (`/graduation-project/archives`)

**页面入口**：侧边导航 → 毕业设计管理 → 毕设档案管理

**布局**：左右分栏。左侧选题导航（全部选题 + 各选题列表，显示人数）；右侧档案列表。

**统计卡片**：档案总数、制作中、待审核、已通过

**左侧选题导航**：
- 点击按选题筛选

**搜索**：
- 搜索框：搜索学生或导师

**列表字段**：
| 字段 | 说明 |
|------|------|
| 选题名称 | |
| 学生 | |
| 负责教师 | 含企业导师 |
| 文档数 | |
| 当前阶段 | 开题/中期/过程/结题 |
| 档案状态 | 制作中/待审核/已退回/已通过 |
| 最近更新 | |
| 操作 | 按钮 |

**表格行操作按钮**：

| 按钮 | 显示条件 | 功能说明 |
|------|----------|----------|
| 查看 | 始终显示 | 打开档案详情弹窗（Tab 形式） |
| 通过 | 仅待审核状态 | 档案状态变为已通过 |
| 退回 | 仅待审核状态 | 档案状态变为已退回 |

**档案详情弹窗**（`sm:max-w-6xl`，四个 Tab）：

| Tab | 内容说明 |
|-----|----------|
| 基础信息 | 选题名称、学生姓名、指导教师、企业导师、关联岗位、当前阶段、档案状态、最近更新、文档总数 |
| 过程性文档（8 类） | 开题报告、中期检查、过程记录、指导记录。每类展示文档卡片（名称、状态徽章、上传时间、大小、教师反馈） |
| 成果性文档（8 类） | 毕设作品、论文/报告、演示材料、源代码/工程文件。展示方式同上 |
| 评价记录 | 暂无评价记录 / 暂无整改记录（占位） |

**页面跳转**：
- 右上角 **「学生档案入口」** 按钮 → 新标签页打开 `/graduation-project/student/archives`

---

### 6.3 毕设评价管理 (`/graduation-project/evaluation`)

**页面入口**：侧边导航 → 毕业设计管理 → 毕设评价管理

**搜索与筛选**：
- 搜索框：搜索选题或学生
- 等级下拉：全部等级/A/B/C/D/E
- 状态下拉：全部状态/已完成/待评价

**统计卡片**：评价概况（总数/已完成/待评价）、优秀毕设（标杆案例数）、平均指导分

**列表字段**：
| 字段 | 说明 |
|------|------|
| 选题名称 | |
| 学生 | |
| 指导教师评分 | |
| 企业导师评分 | |
| 答辩评分 | |
| 综合等级 | A-优秀/B-良好/C-中等/D-及格/E-不及格，带颜色徽章 |
| 状态 | 已完成/待评价 |
| 操作 | 按钮 |

**表格行操作按钮**：

| 按钮 | 显示条件 | 功能说明 |
|------|----------|----------|
| 详情 | 始终显示 | 打开评价详情弹窗 |
| 评价 | 始终显示 | 打开评价弹窗（当前为占位提示，待开发现场评审模块） |
| 认定 | 仅已完成状态 | 打开认定弹窗，可勾选同步选项 |
| 标杆徽章 | 仅展示 | 表示已标记为优秀案例 |

**弹窗说明**：

| 弹窗名称 | 功能说明 |
|---------|----------|
| 评价详情弹窗 | 展示各项评分、综合等级、是否优秀、状态 |
| 评价弹窗 | 占位提示，说明将集成现场评审模块。底部 **「提交评价」** 按钮 |
| 评价标准配置弹窗 | 选择关联岗位，展示评价维度与权重（只读） |
| 认定弹窗 | 展示学生与综合等级，提供三个勾选框：同步至学历认定模块、同步至能力画像模块、标记为标杆案例。底部 **「确认认定」** 按钮 |

---

### 6.4 毕业查询管理 (`/graduation-project/query`)

**页面入口**：侧边导航 → 毕业设计管理 → 毕业查询管理

**统计卡片**：毕业状态分布（已达标/未达标/审核中）、能力认证（已认证/总计）

**搜索与筛选**：
- 搜索框：搜索姓名、学号、班级
- 毕业状态下拉：全部/已达标/未达标/审核中

**列表字段**：
| 字段 | 说明 |
|------|------|
| 学号 | |
| 姓名 | |
| 班级 | |
| 专业 | |
| 学分完成 | 含进度条 |
| 场景达标 | |
| 毕设等级 | |
| 毕业状态 | 已达标/未达标/审核中 |
| 能力认证 | 已认证/未认证/审核中 |
| 整改数 | |
| 操作 | 按钮 |

**顶部操作按钮**：

| 按钮 | 功能说明 |
|------|----------|
| 导出报表 | 打开导出弹窗 |
| 结果申诉 | 打开申诉管理列表弹窗 |
| 学生查询入口 | 新标签页打开 `/graduation-project/student/query` |

**表格行操作按钮**：

| 按钮 | 显示条件 | 功能说明 |
|------|----------|----------|
| 查看申诉 | 仅当该学生有申诉时 | 打开详情弹窗 |
| 详情 | 始终显示 | 打开毕业状态详情弹窗 |
| 证明 | 始终显示 | 打开毕业证明预览弹窗 |

**弹窗说明**：

| 弹窗名称 | 功能说明 |
|---------|----------|
| 毕业状态详情弹窗 | 学生基础信息、学历认定进度（学分/场景进度条）、毕设各阶段评价、整改意见、申诉记录 |
| 申诉管理列表弹窗 | 展示所有学生申诉记录（学号、姓名、申诉类型、申诉理由、提交时间、状态、操作）。待处理状态可点击 **「回复」** |
| 回复申诉弹窗 | 展示申诉信息，输入回复内容，**确认回复** 后状态变为已处理 |
| 毕业证明预览弹窗 | 学历认定证书、能力认定徽章（可视化展示） |
| 导出报表弹窗 | 选择 Excel 报表 或 PDF 汇总报告 |

---

### 6.5 学生端 - 选题申请 (`/graduation-project/student/apply`)

**页面入口**：学生申请入口

**页面布局**：学生视角，顶部返回按钮，max-w-5xl 居中

**搜索与筛选**：
- 搜索框：搜索选题名称或岗位
- 来源下拉：全部/场景库/企业需求

**我的申请记录**：顶部展示当前学生的申请历史（Badge 形式）

**卡片字段（卡片式布局）**：
- 选题名称
- 来源标签（场景库/企业需求）
- 描述
- 关联岗位
- 已申请/容量
- 指导教师/企业导师
- 起止时间

**卡片操作按钮**：

| 按钮 | 功能说明 |
|------|----------|
| 查看详情 | 打开选题详情弹窗 |
| 申请选题 | 打开申请弹窗 |

**弹窗说明**：

| 弹窗名称 | 功能说明 |
|---------|----------|
| 申请弹窗 | 填写学号、姓名、班级、申请理由，**提交申请** |
| 选题详情弹窗 | 左侧：选题基础信息、关联场景信息（场景库）/ 企业项目配置（企业需求）/ 能力要求；右侧：指导团队、当前负责教师、申请信息、**申请该选题** 按钮 |

---

### 6.6 学生端 - 毕设档案 (`/graduation-project/student/archives`)

**页面入口**：学生档案入口

**页面布局**：学生视角，固定学生 `MOCK_STUDENT_ID = '2021001'`

**四个 Tab**：

| Tab | 内容说明 |
|-----|----------|
| 基础信息 | 选题名称、学生姓名、指导教师、企业导师、关联岗位、当前阶段、起止日期、选题描述 |
| 过程性文档（4 类） | 开题报告、中期检查、过程记录、指导记录。每类可上传文档、删除文档。文档卡片展示名称、状态（待提交/已提交/已通过/已退回/需整改）、上传时间、教师反馈 |
| 成果性文档（4 类） | 毕设作品、论文/报告、演示材料、源代码/工程文件。同上 |
| 评价记录 | 各阶段评价结果（开题/中期，展示分数和评语）、整改任务（如有）。整改任务可点击 **「提交整改结果」** |

**操作按钮**：

| 按钮 | 位置 | 功能说明 |
|------|------|----------|
| 上传文档 | 过程性/成果性 Tab | 打开上传弹窗 |
| 删除 | 每个文档卡片 | 删除该文档 |
| 提交整改结果 | 整改任务卡片 | 打开整改回复弹窗 |

**弹窗说明**：

| 弹窗名称 | 功能说明 |
|---------|----------|
| 上传文档弹窗 | 选择文档类别（8 类下拉）、输入文档名称、上传区域（点击/拖拽）。**确认上传** |
| 整改回复弹窗 | 展示整改要求，输入整改说明/补充材料，**提交整改** |

---

### 6.7 学生端 - 毕业查询 (`/graduation-project/student/query`)

**页面入口**：学生查询入口

**页面布局**：学生视角，顶部搜索学号

**查询结果展示**：
- 学生基础信息 + 毕业状态徽章
- 毕业资格进度：学分完成（进度条）、场景达标（进度条）
- 毕设评价结果：各阶段评价分数和评语、综合等级
- 整改意见：展示整改要求和截止日期
- 能力认证：认证状态
- 我的申诉：历史申诉记录

**底部操作按钮**：

| 按钮 | 功能说明 |
|------|----------|
| 毕业证明预览 | 打开证书预览弹窗 |
| 结果申诉 | 打开申诉弹窗 |

**弹窗说明**：

| 弹窗名称 | 功能说明 |
|---------|----------|
| 证书预览弹窗 | 学历认定证书 + 能力认定徽章 |
| 申诉弹窗 | 选择申诉类型（成绩申诉/毕业资格申诉/能力认证申诉），填写申诉理由，**提交申诉** |

---

## 7. 学生画像管理

### 7.1 学生档案管理（教师端） (`/student-portrait/archives`)

**页面入口**：侧边导航 → 学生画像管理 → 学生档案管理

**布局**：左右分栏。左侧学生导航（按班级分组，支持搜索）；右侧档案记录。

**左侧学生导航**：
- 搜索框：搜索学生姓名/学号/班级
- 班级分组列表，点击切换学生。有数据的学生显示绿色圆点。

**右侧档案记录**：
- 学生基本信息（姓名/学号/班级）
- 操作按钮：**上传新档案** / **添加学生违纪/处分记录**

**表格字段（正向/负向档案各一个表格）**：
| 字段 | 说明 |
|------|------|
| 材料类型 | 荣誉证书/竞赛成果/社会活动/实习证明/技能证书 |
| 材料名称 | 含审核意见 |
| 颁发机构 | |
| 获得时间 | |
| 等级 | |
| 审核状态 | 待审核/已审核/已驳回 |
| 转换学分 | 正向显示绿色 `+N`，负向显示红色 `-N` |
| 操作列 | 按钮 |

**表格操作按钮**：

| 按钮 | 显示条件 | 功能说明 |
|------|----------|----------|
| 查看 | 始终显示 | 打开档案详情弹窗 |
| 审核 | 仅待审核状态 | 打开审核弹窗 |
| 版本 | 始终显示 | 打开版本历史弹窗 |
| 删除 | 始终显示 | 打开删除确认弹窗（destructive） |

**顶部操作按钮**：
- **学分转换配置**：打开学分转换规则配置弹窗

**弹窗说明**：

| 弹窗名称 | 功能说明 |
|---------|----------|
| 上传新档案弹窗 | 材料类型下拉、等级下拉（根据类型动态变化）、材料名称、颁发机构、获得日期、附件上传区域。**确认上传** 后状态为待审核 |
| 添加违纪/处分记录弹窗 | 扣分内容、扣分分值、扣分时间。**确认添加** 后生成负向档案 |
| 审核弹窗 | 审核结果（通过/驳回）、转换学分（可手动输入，支持自动计算按钮）、审核意见。**确认审核** |
| 档案详情弹窗 | 展示所有字段及审核意见 |
| 学分转换规则配置弹窗 | 展示各材料类型+等级对应的学分，可编辑，**保存规则** |
| 版本历史弹窗 | 展示该档案的变更记录（版本号、变更摘要、变更人、时间） |
| 删除确认弹窗 | 确认后删除档案 |

---

### 7.2 学生画像管理（教师端） (`/student-portrait/portraits`)

**页面入口**：侧边导航 → 学生画像管理 → 学生画像管理

**布局**：左右分栏。左侧专业-班级导航；右侧学生列表。

**左侧专业-班级导航**：
- 搜索框：搜索专业或班级
- **「全部班级」** 按钮
- 按专业分组，专业下展示各班级及人数

**右侧学生列表字段**：
| 字段 | 说明 |
|------|------|
| 学号 | |
| 姓名 | |
| 班级 | |
| 专业 | |
| 班级排名 | `classRank / classTotal` |
| 专业排名 | `majorRank / majorTotal` |

**搜索与筛选**：
- 搜索框：搜索姓名、学号、班级或岗位
- 等级下拉：全部等级 / A/B/C/D/E

**顶部操作按钮**：

| 按钮 | 功能说明 |
|------|----------|
| 手动更新画像 | 打开画像生成弹窗 |
| 画像更新时间 | 打开更新时间配置弹窗（展示自动更新周期，只读） |
| 学生画像模块配置 | 打开模块配置弹窗，可开关课程成绩/毕业设计/荣誉模块 |

**表格操作按钮**：

| 按钮 | 功能说明 |
|------|----------|
| 查看学生画像 | 打开 `StudentPortraitModal`（全屏 iframe，加载 `/student_portrait.html`） |

**弹窗说明**：

| 弹窗名称 | 功能说明 |
|---------|----------|
| 手动维护画像数据弹窗 | 调整各能力领域得分（输入框+进度条），填写调整原因，**确认维护** |
| 画像更新时间弹窗 | 展示自动更新周期（每日凌晨 2 点）、最后更新时间（只读） |
| 画像对比分析弹窗 | 展示班级/专业/年级能力分布对比（进度条）、能力领域横向对比（5 个维度均分） |
| 就业推荐配置弹窗 | AI 匹配算法、匹配权重（能力得分 60%/学历评价 25%/档案材料 15%）、启用企业招聘人才筛选 Switch |
| 画像生成弹窗 | 说明画像生成引擎将聚合的数据来源，**确认手动更新** |
| 学生画像详情弹窗 | 全屏弹窗，iframe 嵌入 `/student_portrait.html` |

---

### 7.3 学生档案管理（学生端） (`/student-portrait/student/archives`)

**页面入口**：学生端入口

**页面布局**：学生视角，固定学生 `MOCK_SELF = { name: '张三', id: '2021001' }`

**展示内容**：
- 学生基本信息（姓名/学号/班级）
- 操作按钮：**上传新档案**

**表格字段（两个表格：正向档案 + 负向档案）**：
与教师端档案表格相同：材料类型、材料名称、颁发机构、获得时间、等级、审核状态、转换学分。
（学生端无操作列，点击整行可查看详情）

**弹窗说明**：

| 弹窗名称 | 功能说明 |
|---------|----------|
| 上传新档案弹窗 | 材料类型、等级、名称、颁发机构、日期、附件上传。**提交** 后进入待审核 |
| 档案详情弹窗 | 展示档案所有字段及审核意见 |

---

## 8. 门户首页（Landing Page）

### 8.1 门户首页 (`/landingpage`)

**页面入口**：直接访问 `/landingpage`

**页面结构**：

**Hero Banner + 全局搜索框**：
- 大标题 + 副标题
- 圆角搜索框（带 Search 图标），纯 UI 展示，未连接实际搜索逻辑

**数据看板（6 项统计）**：
- 测评方式数 / 题库数 / 试卷数 / 考试场次 / 岗位认证数 / 毕业选题数

**考试中心卡片**：
- 展示近期考试
- **去考试** 按钮（跳转考试详情）

**岗位能力认证项目库**：
- 5 列卡片网格
- 岗位名称、编码、方向、关联能力数

**测评方式库**：
- 分类 Tab 切换（全部/专业技能/通用素质/行业认知）
- 卡片网格展示

**测评资源库**：
- Tab：题库中心 / 试卷中心
- 3 列卡片网格，含封面、名称、简介、数量

**毕业设计选题中心**：
- 筛选标签（全部/计算机/软件工程/人工智能）
- 选题卡片：名称、导师、容量、时间
- **申请选题** 按钮

**学生画像排行榜**：
- 20 个岗位可展开筛选
- 关联专业卡片
- **查看画像** 按钮

---

### 8.2 能力认定列表页 (`/landingpage/certifications`)

**Hero + 4 项统计**：认证岗位 / 行业 / 专业 / 通过率

**Tab 切换**：
- 我的认证岗位
- 感兴趣岗位
- 全部岗位

**搜索 + 筛选**：搜索框 + 院系/专业筛选

**5 列岗位认证卡片**：
- 岗位名称、编码、方向、关联能力数、状态
- **查看详情** 按钮 → 跳转 `/landingpage/certifications/{id}`

---

### 8.3 认证详情页 (`/landingpage/certifications/{id}`)

**届别 Tab**：2024 / 2025 / 2026

**能力认定要求**：
- 左侧：职责菜单
- 右侧：能力项，含 5 级进度刻度（了解 → 精通）

**岗位能力认定排行榜**：
- 专业筛选 + 学生排名表格
- **查看画像** 按钮

---

### 8.4 考试中心列表 (`/landingpage/exams`)

**Hero + 4 项统计**

**Tab 切换**：我的考试 / 全部考试

**搜索 + 院系/专业筛选**

**考试卡片网格**：
- 状态标签（未开始/进行中/已结束）
- **开始考试** 按钮 → 跳转 `/landingpage/exams/{id}`

---

### 8.5 考试详情/答题页 (`/landingpage/exams/{id}`)

**三态页面**：

| 状态 | 说明 |
|------|------|
| ① 概览页 | 题型分布饼图 + 考试须知 + **开始考试** 按钮 |
| ② 答题中 | 单选/多选/判断/填空/问答题型 + 倒计时 + 右侧答题卡 5 列网格 + **提交试卷** 按钮 |
| ③ 提交成功页 | 成功提示 + 成绩概览 + **返回考试中心** 按钮 |

---

### 8.6 毕业设计广场 (`/landingpage/graduation`)

**Hero + 3 项统计**

**我的毕设进度时间线**：5 阶段（选题/开题/中期/结题/毕业）

**选题广场**：
- 方向筛选 + 搜索
- 选题卡片：名称、导师、容量、时间
- **申请选题** 按钮 → 跳转 `/landingpage/graduation/{id}`

---

### 8.7 选题详情页 (`/landingpage/graduation/{id}`)

**头部信息 + 4 项指标**

**选题描述 / 来源（校内/企业）/ 已选学生列表**

**侧边栏选题信息 + 申请选题按钮**

---

### 8.8 学生画像首页 (`/landingpage/portrait`)

**Hero + 优秀学生画像卡片（6 人）**

**能力画像介绍**

**5 项能力维度分析**：进度条展示

**能力档案**：课程 / 考试 / 认证 / 项目

**成长趋势柱状图**

---

### 8.9 个人画像详情 (`/landingpage/portrait/{id}`)

**头部 + 综合评级**

**5 项指标**

**能力维度分析**：各领域得分 + 等级

**班级/专业/年级排名 + 推荐岗位**

**课程成绩**

**成长趋势**

---

### 8.10 专业排行榜 (`/landingpage/portrait/major/{majorName}`)

**Hero + 2 项统计**

**班级筛选**

**专业排名表格**：
- 排名 / 姓名 / 专业 / 班级 / 综合分 / **查看画像** 操作
- 点击打开 `StudentPortraitModal`

---

### 8.11 测评资源首页 (`/landingpage/resources`)

**Hero + 3 项统计**

**Tab：题库中心 / 试卷中心**

**搜索 + 3 列卡片网格**

---

### 8.12 题库详情 (`/landingpage/resources/banks/{id}`)

**头部 + 申请共建按钮 + 收藏按钮**

**5 项指标**

**题目预览**（最多 8 题）：题型 / 难度 / 知识点 / 选项

---

### 8.13 试卷详情 (`/landingpage/resources/exams/{id}`)

**头部 + 4 项指标**

**试卷信息**：饼图 + 题型标签

**题目概览**（最多 8 题）

---

### 8.14 我的工作台 (`/landingpage/workspace`)

**欢迎语 + 4 项待办卡片**

**4 项统计概览**

**5 个快捷操作按钮**（彩色大按钮，hover 放大效果）：

| 按钮 | 功能说明 |
|------|----------|
| 去考试 | 跳转考试中心 |
| 查成绩 | 跳转成绩查询 |
| 申请选题 | 跳转选题广场 |
| 查看画像 | 跳转个人画像 |
| 能力认证 | 跳转认证列表 |

**最近动态 + 即将到期**（含进度条）

---

## 9. 附录：页面间跳转关系汇总

| 来源页面 | 操作 | 目标页面 |
|----------|------|----------|
| `/` (首页) | 自动重定向 | `/question-banks` |
| `/question-banks` | 新建题库 | 自动跳转 `/question-banks/{id}` |
| `/question-banks` | 查看详情 | `/question-banks/{id}` |
| `/question-banks/{id}` | 返回题库列表 | `/question-banks` |
| `/exams` | 新建试卷 | 自动跳转 `/exams/{id}` |
| `/exams` | 配置试卷 | `/exams/{id}` |
| `/exams` | 预览试卷 | `/landingpage/resources/exams/{id}` |
| `/exams/{id}` | 返回组卷列表 | `/exams` |
| `/exams/{id}` | 预览试卷 | landingpage |
| `/exam-usage` | 查看考试结果 | `/exam-usage/results?usageId={id}` |
| `/exam-usage/results` | 返回考试管理 | `/exam-usage` |
| `/job-ability` | 配置认定规则 | `/job-ability/config/{id}` |
| `/job-ability/config/{id}` | 返回岗位列表 | `/job-ability` |
| `/evaluation-methods` | 测评方式详情 | `/evaluation-methods/student/{id}` |
| `/evaluation-methods/student/{id}` | 返回测评方式列表 | `/evaluation-methods` |
| `/scene-task-results` | 查看/评分 | `/scene-task-results/{id}` |
| `/scene-task-results/{id}` | 返回 | `/scene-task-results` |
| `/graduation-project/topics` | 学生申请入口 | 新标签页 `/graduation-project/student/apply` |
| `/graduation-project/archives` | 学生档案入口 | 新标签页 `/graduation-project/student/archives` |
| `/graduation-project/query` | 学生查询入口 | 新标签页 `/graduation-project/student/query` |
| `/graduation-project/student/apply` | 关闭 | `window.close()` |
| `/graduation-project/student/archives` | 关闭 | `window.close()` |
| `/graduation-project/student/query` | 关闭 | `window.close()` |
| `/landingpage` | 去考试 | `/landingpage/exams/{id}` |
| `/landingpage` | 申请选题 | `/landingpage/graduation/{id}` |
| `/landingpage/exams` | 开始考试 | `/landingpage/exams/{id}` |
| `/landingpage/graduation` | 申请选题 | `/landingpage/graduation/{id}` |
| `/landingpage/certifications` | 查看详情 | `/landingpage/certifications/{id}` |
| `/landingpage/portrait/major/{majorName}` | 查看画像 | `StudentPortraitModal` |

---

## 10. 附录：核心状态与类型定义

### 10.1 题目类型
| 类型 | 标签 |
|------|------|
| single | 单选题 |
| multiple | 多选题 |
| judge | 判断题 |
| fill | 填空题 |
| essay | 问答题 |
| short_answer | 简答题 |

### 10.2 难度等级
| 等级 | 标签 |
|------|------|
| easy | 简单 |
| medium | 中等 |
| hard | 困难 |

### 10.3 通用状态（题库/试卷）
| 状态 | 标签 |
|------|------|
| draft | 草稿 |
| unsubmitted | 未提交 |
| pending | 审批中 |
| rejected | 已驳回 |
| toPublish | 待发布 |
| published | 已发布 |

### 10.4 岗位规则状态
| 状态 | 标签 |
|------|------|
| draft | 草稿 |
| not_submitted | 未提交 |
| reviewing | 审批中 |
| rejected | 已驳回 |
| ready | 待发布 |
| published | 已发布 |
| none | 无规则 |

### 10.5 毕设选题状态
| 状态 | 标签 |
|------|------|
| draft | 草稿 |
| pending | 审批中 |
| published | 已发布 |
| locked | 已锁定 |

### 10.6 毕设评价等级
| 等级 | 标签 |
|------|------|
| A | 优秀 |
| B | 良好 |
| C | 中等 |
| D | 及格 |
| E | 不及格 |

### 10.7 档案材料类型
| 类型 | 说明 |
|------|------|
| certificate | 荣誉证书 |
| competition | 竞赛成果 |
| activity | 社会活动 |
| internship | 实习证明 |
| skill | 技能证书 |

---

## 11. 数据溯源总表

> 以下表格汇总了系统中所有展示字段与后台数据源的映射关系，按模块分类。

### 创建考试弹窗

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| ecd-exam-select | 选择试卷 | 使用 Popover + Command 搜索组件选择试卷。支持下拉展开和关键词搜索，展示试卷名称、总分、题目数量。 |
| ecd-exam-name | 考试名称 | 在线考试的名称标识，必填项。 |
| ecd-exam-desc | 考试简介 | 考试的简要描述信息。 |
| ecd-exam-notice | 考试须知 | 考试开始前向考生展示的注意事项和规则说明。默认包含 5 条常见考试须知。 |
| ecd-cover | 考试封面 | 考试的封面图片，支持上传 5MB 以内的图片文件。 |
| ecd-target-audience | 面向对象 | 选择考试的面向对象：学生或教师。选择学生时需配置「参考学生」，选择教师时需配置「参考人员」。 |
| ecd-target-student | 参考学生 | 使用组织树结构（学院→年级→班级→学生）进行多选。支持搜索学生或班级，已选学生在底部以标签形式展示，可单个移除。 |
| ecd-target-teacher | 参考人员 | 面向教师时，从用户列表中选择参考人员。 |
| ecd-open-type | 考试时间类型 | 考试时间配置：随时开放、定时开放、手动开放三种模式。 |
| ecd-duration | 考试时长 | 考试的限时长度，单位为分钟。 |

### 前台毕业设计详情

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| lg-page | 毕业设计选题详情页 | 前台毕业设计选题详情页，展示选题信息、描述、已选学生等。数据来源于后台「毕业设计选题管理」/graduation-project/topics 和「毕业设计档案管理」/graduation-project/archives。 |
| lg-title | 选题名称 | 数据来源：后台「毕业设计选题管理」/graduation-project/topics → 课题名称。发布选题时填写。 |
| lg-position | 岗位/方向 | 数据来源：后台「毕业设计选题管理」/graduation-project/topics → 关联岗位。选题与岗位能力认定体系中的岗位关联。 |
| lg-college | 所属学院 | 数据来源：后台「毕业设计选题管理」/graduation-project/topics → 所属学院。选题发布时选择的学院/院系。 |
| lg-status | 选题状态 | 数据来源：后台「毕业设计选题管理」/graduation-project/topics → 状态字段。包括：草稿、待审核、已发布、已锁定。前台仅展示已发布状态的选题。 |
| lg-advisor | 导师 | 数据来源：后台「毕业设计选题管理」/graduation-project/topics → 导师姓名。发布选题时指定的指导教师。 |
| lg-time-range | 时间范围 | 数据来源：后台「毕业设计选题管理」/graduation-project/topics → 开始日期/结束日期。选题的有效时间范围。 |
| lg-capacity | 容量/剩余名额 | 数据来源：后台「毕业设计选题管理」/graduation-project/topics → 容量和已申请数。capacity 为选题最大容纳人数，appliedCount 为已申请人数，剩余名额 = capacity - appliedCount。 |
| lg-desc | 选题描述 | 数据来源：后台「毕业设计选题管理」/graduation-project/topics → 选题描述。详细介绍选题背景、目标、要求等。 |
| lg-source | 选题来源 | 数据来源：后台「毕业设计选题管理」/graduation-project/topics → 来源字段。包括：校内场景课题（校内导师发布）和企业合作课题（企业导师参与）。 |
| lg-students | 已选学生 | 数据来源：后台「毕业设计档案管理」/graduation-project/archives。展示已选择该选题的学生列表、学号和当前阶段（开题/中期/过程/答辩）。 |
| lg-info | 侧边栏选题信息 | 集中展示选题的完整信息：课题名称、所属学院、导师、专业方向、容量、已申请、开始时间、结束时间。全部来源于后台「毕业设计选题管理」。 |
| lg-apply-btn | 申请选题按钮 | 学生点击后申请选择该毕业设计选题。需判断剩余名额，名额已满时按钮置灰不可点击。申请成功后更新已申请人数。 |

### 前台画像详情

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| lpo-page | 学生能力画像详情页 | 前台学生能力画像详情页，展示学生的综合能力分析、排名、课程成绩和成长趋势。数据来源于后台「学生画像管理」/student-portrait/portraits。 |
| lpo-name | 学生姓名 | 数据来源：后台「学生画像管理」/student-portrait/portraits → 学生姓名。由系统根据学生档案自动生成。 |
| lpo-class | 班级与专业 | 数据来源：后台「学生画像管理」/student-portrait/portraits → 班级名称、专业名称。与学生学籍信息关联。 |
| lpo-grade | 综合评级 | 数据来源：后台「学生画像管理」/student-portrait/portraits → 综合评级。根据各能力维度得分加权计算，分为 A/B/C/D/E 五级。 |
| lpo-stats | 统计指标 | 数据来源：后台「学生画像管理」/student-portrait/portraits。 - 已完成课程 → completedCourses - 已完成场景 → completedScenes - 总学分 → totalCredits - 档案数 → archiveCount - 出勤率 → attendanceRate |
| lpo-domains | 能力维度分析 | 数据来源：后台「学生画像管理」/student-portrait/portraits → domainScores。包含五个维度：行业认知(industry)、专业技能(professional)、实操技能(skill)、通用能力(general)、综合素质(quality)。每个维度包含得分和等级评定。 |
| lpo-rank | 排名信息 | 数据来源：后台「学生画像管理」/student-portrait/portraits → 排名数据。包含班级排名(classRank/classTotal)、专业排名(majorRank/majorTotal)、年级排名(yearRank/yearTotal)。 |
| lpo-recommend | 推荐岗位 | 数据来源：后台「学生画像管理」/student-portrait/portraits → recommendPositions。根据学生能力维度得分与岗位要求匹配度计算，展示匹配度最高的前 3 个岗位。 |
| lpo-courses | 课程成绩 | 数据来源：后台「学生画像管理」/student-portrait/portraits → courseRecords。展示学生各门课程的最终成绩(finalScore)、等级(grade)和学分(credit)。 |
| lpo-trend | 成长趋势 | 数据来源：后台「学生画像管理」/student-portrait/portraits → domainScores。以柱状图形式展示各能力维度的得分分布，直观反映学生的能力优势与短板。 |

### 前台考试详情

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| le-page | 考试详情页 | 前台考试详情页，展示考试基本信息和题目列表。学生可在此页面查看考试详情并开始答题。所有数据来源于后台「考试管理」/exam-usage 和「试卷管理」/exams。 |
| le-title | 考试名称 | 数据来源：后台「考试管理」/exam-usage → 考试名称字段。创建考试时填写，发布后在考试中心展示。 |
| le-desc | 考试描述 | 数据来源：后台「考试管理」/exam-usage → 考试描述字段。用于说明考试的目的、范围、注意事项等。 |
| le-status | 考试状态 | 数据来源：后台「考试管理」/exam-usage → 状态字段。包括：草稿、未提交、审核中、已驳回、待发布、已发布。前台仅展示已发布状态的考试。 |
| le-duration | 考试时长 | 数据来源：后台「试卷管理」/exams → 考试时长字段。组卷时设置，单位为分钟。学生开始答题后开始倒计时。 |
| le-question-count | 题目数量 | 数据来源：后台「试卷管理」/exams → 组卷结果中的题目总数。通过自动抽题或手动添加题目后生成。 |
| le-total-score | 总分 | 数据来源：后台「试卷管理」/exams → 各题目分值之和。每道题在组卷时设置分值，系统累加计算总分。 |
| le-time-status | 时间状态 | 模拟数据。实际应来源于后台「考试管理」/exam-usage 的考试时间配置（开始时间、结束时间），判断当前处于进行中/未开始/已结束状态。 |
| le-target | 考试对象 | 数据来源：后台「考试管理」/exam-usage → 考试对象设置。可配置为学生（按班级/年级）或教师（指定人员）。 |
| le-start-btn | 开始考试按钮 | 学生点击后进入答题界面，开始倒计时。需判断考试时间状态，未开始或已结束则不可点击。 |
| le-question-list | 题目列表 | 数据来源：后台「试卷管理」/exams → 组卷结果。展示所有题目内容、选项、分值。题目来源于关联题库或手动录入。 |

### 前台认证详情

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| lc-page | 岗位能力认证详情页 | 前台岗位能力认证详情页，展示岗位基本信息、能力项要求和达成标准。数据来源于后台「岗位能力认定规则配置」/job-ability。 |
| lc-title | 岗位名称 | 数据来源：后台「岗位能力认定规则配置」/job-ability → 岗位名称。岗位列表中配置的岗位信息。 |
| lc-stats | 统计指标 | 数据来源：后台「岗位能力认定规则配置」/job-ability。 - 能力项数 → 该岗位配置的能力项总数 - 平均达成率 → 参与认证学生的平均达成率 - 参与人数 → 选择该岗位的学生画像数量 - 综合评级 → 按达成率分布计算的评级分布 |
| lc-competency | 能力项列表 | 数据来源：后台「岗位能力认定规则配置」/job-ability → 能力项配置。每个能力项包含：能力名称、目标等级、达成标准说明。等级分为：了解、理解、掌握、熟练、精通。 |
| lc-leaderboard | 学生排行榜 | 模拟数据。实际应来源于后台「学生画像管理」/student-portrait/portraits 中该岗位关联学生的达成率和评级数据。 |
| lc-grade-switch | 届别切换 | 筛选不同年级（届别）的学生数据。模拟 2024/2025/2026 三届数据。 |

### 前台试卷详情

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| lpr-page | 试卷详情页 | 前台试卷详情页，展示试卷基本信息、题型分布统计和题目概览。数据来源于后台「试卷管理」/exams。 |
| lpr-title | 试卷名称 | 数据来源：后台「试卷管理」/exams → 试卷名称。新建/编辑试卷时填写。 |
| lpr-desc | 试卷描述 | 数据来源：后台「试卷管理」/exams → 试卷描述。说明试卷用途、适用范围等。 |
| lpr-status | 试卷状态 | 数据来源：后台「试卷管理」/exams → 状态字段。包括：草稿、未提交、审核中、已驳回、待发布、已发布。前台仅展示已发布状态的试卷。 |
| lpr-duration | 考试时长 | 数据来源：后台「试卷管理」/exams → 考试时长。组卷时设置，单位为分钟。 |
| lpr-question-count | 题目数量 | 数据来源：后台「试卷管理」/exams → 组卷结果中的题目总数。通过自动抽题或手动添加生成。 |
| lpr-total-score | 总分 | 数据来源：后台「试卷管理」/exams → 各题目分值之和。组卷时为每道题设置分值。 |
| lpr-version | 版本号 | 数据来源：后台「试卷管理」/exams → version 字段。每次编辑保存后自动递增。 |
| lpr-type-stats | 题型分布统计 | 数据来源：后台「试卷管理」/exams → 组卷结果。按题型（单选/多选/判断/填空/问答）统计题目数量和分值占比，以饼图形式展示。 |
| lpr-questions | 题目概览 | 数据来源：后台「试卷管理」/exams → 组卷结果。展示试卷中所有题目的内容、题型、难度、知识点标签和选项。 |

### 前台题库详情

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| lb-page | 题库详情页 | 前台题库详情页，展示题库基本信息和题目预览。数据来源于后台「题库管理」/question-banks。 |
| lb-title | 题库名称 | 数据来源：后台「题库管理」/question-banks → 题库名称。新建题库时填写，支持编辑修改。 |
| lb-desc | 题库描述 | 数据来源：后台「题库管理」/question-banks → 题库简介。描述题库的内容范围、适用场景等信息。 |
| lb-question-count | 题目数量 | 数据来源：后台「题库管理」/question-banks → questionCount 字段。题库中实际包含的题目总数，添加/删除题目后自动更新。 |
| lb-creator | 创建者 | 数据来源：后台「题库管理」/question-banks → 创建人信息。记录创建该题库的用户。 |
| lb-version | 版本号 | 数据来源：后台「题库管理」/question-banks → version 字段。每次编辑保存后自动递增版本号。 |
| lb-view-count | 浏览次数 | 模拟数据。实际应记录前台用户访问该题库详情页的次数。 |
| lb-apply-btn | 申请共建按钮 | 学生/教师可申请成为该题库的共建人，获得编辑权限。申请需题库所有者审批。 |
| lb-fav-btn | 收藏题库按钮 | 用户可将题库加入个人收藏，方便快速访问。收藏状态保存在用户个人数据中。 |
| lb-questions | 题目预览 | 数据来源：后台「题库管理」/question-banks 关联的题目数据。展示题目内容、题型、难度、知识点标签和选项。未登录用户仅展示前 8 题。 |

### 前台首页

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| lp-hero | 能力测评中心前台首页 | 前台门户首页，面向学生和教师展示测评资源、考试、岗位认证、毕业设计等内容。所有展示数据均来源于后台管理页面的配置。 |
| lp-stats | 数据看板 | 展示平台核心数据指标。数据来源： - 测评方式数量 → 后台「测评方式管理」/evaluation-methods - 题库数量 → 后台「题库管理」/question-banks（已发布状态） - 试卷数量 → 后台「试卷管理」/exams（已发布状态） - 考试场次 → 后台「考试管理」/exam-usage（已发布状态） - 岗位认证项目 → 后台「岗位能力认定规则配置」/job-ability - 毕业选题 → 后台「毕业设计选题管理」/graduation-project/topics |
| lp-exam-center | 考试中心 | 展示所有已发布的考试卡片。数据来源：后台「考试管理」/exam-usage 中状态为「已发布」的考试。包含考试名称、描述、时长、题量、日期、考试对象等信息。 |
| lp-certifications | 岗位能力认证项目库 | 展示岗位能力认证项目卡片。数据来源：后台「岗位能力认定规则配置」/job-ability 中的岗位列表。包含岗位名称、创建人、更新时间、适用专业、能力项数量等。 |
| lp-evaluation-methods | 测评方式库 | 展示前台启用的测评方式卡片。数据来源：后台「测评方式管理」/evaluation-methods 中「前台展示」开关为开启状态的测评方式。包含测评方式名称、说明、文档链接等。 |
| lp-resources | 测评资源库 | 展示已发布的题库和试卷资源。数据来源： - 题库 → 后台「题库管理」/question-banks（已发布状态） - 试卷 → 后台「试卷管理」/exams（已发布状态） |
| lp-graduation | 毕业设计选题 | 展示已发布的毕业设计选题。数据来源：后台「毕业设计选题管理」/graduation-project/topics（已发布状态）。 |
| lp-portraits | 学生能力画像 | 展示优秀学生能力画像排行。数据来源：后台「学生画像管理」/student-portrait/portraits。按总学分排序展示前 8 名。 |
| lp-stat-eval | 测评方式数量 | 数据来源：后台「测评方式管理」/evaluation-methods 中 enabled=true（前台展示开启）的测评方式总数。 |
| lp-stat-bank | 题库数量 | 数据来源：后台「题库管理」/question-banks 中状态为「已发布」的题库总数。 |
| lp-stat-exam | 试卷数量 | 数据来源：后台「试卷管理」/exams 中的试卷总数（包含所有状态）。 |
| lp-stat-usage | 考试场次 | 数据来源：后台「考试管理」/exam-usage 中状态为「已发布」的考试场次数量。 |
| lp-stat-position | 岗位认证项目 | 数据来源：后台「岗位能力认定规则配置」/job-ability 中的岗位列表总数。 |
| lp-stat-topic | 毕业选题 | 数据来源：后台「毕业设计选题管理」/graduation-project/topics 中的选题总数。 |
| lp-exam-card | 考试卡片字段 | 考试卡片各字段来源： - 考试名称 → 后台「考试管理」/exam-usage → exam.name - 状态标签 → 后台「考试管理」→ exam.status - 考试描述 → 模拟数据（实际应来源于 exam.description） - 考试时长 → 后台「试卷管理」/exams → exam.duration - 题目数量 → 后台「试卷管理」→ exam.questions.length - 创建日期 → 后台「考试管理」→ exam.createdAt - 考试对象 → 模拟数据（实际应来源于 exam.targetAudience） |
| lp-cert-card | 岗位认证卡片字段 | 岗位认证卡片各字段来源： - 岗位名称 → 后台「岗位能力认定规则配置」/job-ability → pos.name - 创建人 → 后台岗位配置 → pos.updatedBy - 更新时间 → 后台岗位配置 → pos.lastUpdated - 适用专业 → 后台岗位配置 → pos.professionalDirection - 能力项数 → 后台岗位配置 → pos.relatedAbilityCount |
| lp-method-card | 测评方式卡片字段 | 测评方式卡片各字段来源： - 方式名称 → 后台「测评方式管理」/evaluation-methods → method.name - 方式说明 → 后台「测评方式管理」→ method.description - 使用说明链接 → 后台「测评方式管理」→ method.docLink |
| lp-resource-bank-card | 题库卡片字段 | 题库卡片各字段来源： - 题库名称 → 后台「题库管理」/question-banks → bank.name - 题目数量 → 后台「题库管理」→ bank.questionCount - 创建人 → 后台「题库管理」→ bank.creatorId - 共建人数 → 后台「题库管理」→ bank.collaboratorIds.length - 创建日期 → 后台「题库管理」→ bank.createdAt - 更新日期 → 后台「题库管理」→ bank.updatedAt - 版本号 → 后台「题库管理」→ bank.version |
| lp-resource-exam-card | 试卷卡片字段 | 试卷卡片各字段来源： - 试卷名称 → 后台「试卷管理」/exams → exam.name - 考试时长 → 后台「试卷管理」→ exam.duration - 题目数量 → 后台「试卷管理」→ exam.questions.length - 总分 → 后台「试卷管理」→ 各题目分值累加 - 版本号 → 后台「试卷管理」→ exam.version - 创建/更新日期 → 后台「试卷管理」→ exam.createdAt / exam.updatedAt |
| lp-grad-card | 毕业设计选题卡片字段 | 毕业设计选题卡片各字段来源： - 选题名称 → 后台「毕业设计选题管理」/graduation-project/topics → topic.name - 岗位方向 → 后台选题管理 → topic.positionName - 导师 → 后台选题管理 → topic.advisorName - 来源 → 后台选题管理 → topic.source（校内/企业） - 浏览次数 → 后台选题管理 → topic.appliedCount |
| lp-portrait-card | 学生画像专业卡片字段 | 学生画像专业卡片各字段来源： - 专业名称 → 后台「学生画像管理」/student-portrait/portraits → majorName - 学生数量 → 后台「学生画像管理」→ 该专业下学生总数 - 平均评级 → 后台「学生画像管理」→ 该专业学生 overallGrade 平均值 - 平均学分 → 后台「学生画像管理」→ 该专业学生 totalCredits 平均值 - 平均排名 → 后台「学生画像管理」→ 该专业学生 majorRank/majorTotal 平均值 |

### 场景任务结果

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| str-page-title | 测评结果管理 | 查看场景任务、智慧课堂、在线课程的测评结果并进行评分。包含三个 Tab：场景任务、智慧课堂、在线课程。 |
| str-tab-scene | 场景任务 | 展示场景任务下的学生测评结果。左侧为场景+任务树，右侧为选中任务的学生提交列表。 |
| str-tab-online | 智慧课堂 | 展示智慧课堂下的学生测评结果。左侧为课堂列表，右侧为选中课堂的学生列表。 |
| str-tab-course | 在线课程 | 展示在线课程下的学生测评结果。左侧为课程+章节树，右侧为选中课程的学生列表。 |
| str-scene-search | 搜索场景/任务 | 按场景名称、任务名称或考核形式关键词搜索。 |
| str-scene-tree | 场景+任务树 | 左侧树形结构，一级为场景（可展开/折叠），二级为任务。显示场景名称、场景编码、任务名称、任务类型（考核/训练）、考核形式、待评/已评数量。 |
| str-scene-task-name | 任务名称 | 当前选中任务的名称，格式为「任务名称：xxx」。 |
| str-scene-scenario-name | 场景名称 | 当前任务所属的场景名称，格式为「场景名称：xxx」。 |
| str-scene-method-filter | 测评方式筛选 | 第一级筛选：全部、试卷、题库、评审、现场问答。切换后自动重置评分状态筛选为「全部」。 |
| str-scene-status-filter | 评分状态筛选 | 第二级筛选：全部、待评分、已评分。在已选测评方式的基础上进一步筛选。 |
| str-scene-student-list | 学生提交列表 | 展示当前任务下符合条件的学生提交记录。每条记录包含：学生头像（首字母）、姓名、学号、评分状态（待评分/已评分）、测评方式、提交时间、班级、年级。操作按钮：查看、评分/已评分。 |

### 学生画像管理

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| sp-page-title | 学生画像管理 | 基于课程任务、实践场景、毕设评价、档案材料等全量数据，自动生成学生能力画像。支持按专业和班级筛选，手动调整画像数据。 |
| sp-btn-generate | 手动更新画像 | 点击启动画像生成引擎，重新计算所有学生能力画像。 |
| sp-btn-config-time | 画像更新时间 | 配置画像数据的自动更新周期和时间。 |
| sp-btn-module-config | 学生画像模块配置 | 配置学生画像页面展示哪些模块和数据维度。 |
| sp-nav-major-class | 专业-班级导航 | 左侧导航栏，按专业分组展示班级。点击班级可筛选右侧学生列表。支持搜索专业和班级。 |
| sp-search | 搜索学生 | 按姓名、学号、班级或岗位关键词搜索学生画像。 |
| sp-filter-grade | 等级筛选 | 按能力画像等级筛选：全部、A-优秀、B-良好、C-中等、D-及格、E-不及格。 |
| sp-col-student-id | 学号 | 学生的学号。 |
| sp-col-student-name | 姓名 | 学生姓名。 |
| sp-col-class | 班级 | 学生所属班级。 |
| sp-col-major | 专业 | 学生所属专业。 |
| sp-col-actions | 操作 | 查看学生画像详情。 |

### 审批中心

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| ac-page-title | 审批中心 | 统一审批题目、题库、试卷、在线考试的提交申请。支持按审批类型（题库/试卷/考试）和状态筛选。 |
| ac-stat-total | 审批总数 | 所有审批记录的总数量。 |
| ac-stat-pending | 待审批 | 状态为「待审批」的记录数量。 |
| ac-stat-approved | 已通过 | 状态为「已通过」的记录数量。 |
| ac-stat-rejected | 已驳回 | 状态为「已驳回」的记录数量。 |
| ac-tab-questionBank | 题库审批 | 展示题库相关的审批申请。 |
| ac-tab-exam | 试卷审批 | 展示试卷相关的审批申请。 |
| ac-tab-onlineExam | 考试审批 | 展示在线考试相关的审批申请。 |
| ac-col-type | 审批类型 | 审批对象的类型：题库、试卷、在线考试。 |
| ac-col-title | 标题 | 审批对象的名称（题库名称/试卷名称/考试名称）。 |
| ac-col-desc | 描述 | 审批对象的描述信息。 |
| ac-col-submitter | 提交人 | 提交该审批申请的用户。 |
| ac-col-submit-time | 提交时间 | 审批申请的提交时间。 |
| ac-col-status | 状态 | 审批当前状态：待审批（黄色）、已通过（绿色）、已驳回（红色）。 |
| ac-col-remark | 备注 | 审批的备注信息。 |
| ac-col-actions | 操作 | 查看详情、同意、驳回。待审批状态下显示同意和驳回按钮。 |
| ac-btn-approve | 同意审批 | 点击打开确认弹窗，填写审批备注（非必填）后确认通过。 |
| ac-btn-reject | 驳回审批 | 点击打开确认弹窗，填写驳回原因（非必填）后确认驳回。 |

### 岗位列表

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| pl-page-title | 岗位能力认定规则配置 | 管理各岗位的能力认定规则配置。列表展示所有岗位，支持搜索、按行业筛选、批量发布等操作。点击「配置认定规则」进入详细配置页面。 |
| pl-search | 搜索岗位 | 按岗位名称或岗位编码关键词搜索。 |
| pl-filter-direction | 所属行业筛选 | 按岗位所属行业/专业方向筛选。 |
| pl-col-name | 岗位名称 | 岗位的名称标识。 |
| pl-col-code | 岗位编码 | 岗位的唯一编码标识。 |
| pl-col-direction | 所属行业 | 岗位所属的行业或专业方向。 |
| pl-col-ability-count | 关联能力数 | 该岗位关联的能力项数量。 |
| pl-col-updater | 最后更新者 | 最后一次更新该岗位规则的用户。 |
| pl-col-update-time | 更新时间 | 规则的最后更新时间。 |
| pl-col-actions | 操作 | 配置认定规则：点击进入岗位能力认定规则详细配置页面（/job-ability/config/[id]）。 |
| pl-btn-config | 配置认定规则 | 点击进入该岗位的详细规则配置页面，可配置能力点权重、任务权重、等级映射等。 |

### 岗位能力结果

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| jar-page-title | 岗位能力认定结果 | 展示各岗位下学生的能力认定结果，包括达标率、胜任度、认定得分等核心指标。左侧为岗位导航，右侧为选中岗位的结果列表。 |
| jar-position-list | 岗位列表 | 左侧岗位导航栏，只展示有认定结果的岗位。默认自动选中第一个岗位。点击岗位切换右侧结果展示。显示岗位名称、岗位编码和该岗位的结果人数。 |
| jar-search | 搜索学生 | 按学生姓名或岗位名称搜索认定结果。 |
| jar-col-student | 学生名称 | 参与岗位能力认定的学生姓名。 |
| jar-col-student-id | 学号 | 学生的学号。 |
| jar-col-class | 班级 | 学生所属班级。 |
| jar-col-major | 专业 | 学生所属专业。 |
| jar-col-dept | 院系 | 学生所属院系/学院。 |
| jar-col-achievement | 岗位能力达标率 | 学生在该岗位下已达成能力点数量占总能力点数量的百分比。格式：XX%（已达成/总能力点 能力点达成）。 |
| jar-col-competency | 岗位胜任度 | 基于学生综合表现计算的岗位胜任度百分比，反映学生适应该岗位的程度。 |
| jar-col-score | 岗位能力认定得分 | 学生在岗位能力认定中的综合得分。 |
| jar-col-time | 更新时间 | 该认定结果的最后更新时间。 |

### 岗位能力配置

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| jac-page-title | 岗位能力认定规则配置 | 配置岗位的能力点权重和任务权重，定义岗位能力认定的计算规则。包含能力点权重配置和任务权重配置两个主要部分。 |
| jac-btn-point-weight | 能力点占岗位权重 | 点击打开能力点权重配置弹窗。以表格形式展示：关联场景任务列 \| 能力点名（rowSpan） \| 权重输入（rowSpan）。弹窗宽度 900px，可修改各能力点在岗位总权重中的占比，所有能力点权重总和为 100%。 |
| jac-btn-task-weight | 任务占能力点权重 | 点击打开任务权重配置弹窗。以卡片列表形式展示各任务的名称和权重输入，可修改各任务在对应能力点中的占比。 |
| jac-table-scenario | 关联场景任务 | 表格列：展示能力点关联的场景任务名称。同一能力点可能关联多个场景任务。 |
| jac-table-ability-point | 能力点 | 表格列：展示能力点名称。同一能力点跨多行时自动合并（rowSpan）。 |
| jac-table-weight | 权重 | 表格列：展示各能力点在岗位总权重中的占比，支持在弹窗中修改。所有能力点权重总和为 100%。 |

### 测评方式管理

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| em-page-title | 测评方式管理 | 管理测评方式分类与前台展示状态。支持按一级分类和二级分类组织测评方式，可控制是否在前台展示。 |
| em-search | 搜索测评方式 | 按测评方式名称关键词搜索。 |
| em-col-category | 一级分类 | 测评方式所属的一级分类，如过程评价、结果评价等。 |
| em-col-sub-category | 二级分类 | 测评方式所属的二级分类。 |
| em-col-method | 测评方式 | 测评方式的具体名称。 |
| em-col-enabled | 前台展示 | 控制该测评方式是否在前台（landingpage）展示。关闭后前台不显示。 |
| em-col-description | 测评方式说明 | 测评方式的详细说明描述。 |
| em-col-doc-link | 文档链接 | 测评方式相关文档的外部链接，点击可跳转到对应文档页面。 |
| em-col-tasks | 管理场景任务 | 查看和管理该测评方式关联的场景任务数量。 |
| em-col-actions | 操作 | 编辑测评方式的说明和文档链接。 |

### 组卷编辑

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| ec-page-title | 组卷编辑 | 试卷的组卷编辑页面，支持查看试卷基本信息、拖拽调整题目顺序、修改题目分值、自动/手动抽题、预览试卷等操作。 |
| ec-btn-edit-info | 修改试卷基本信息 | 点击打开弹窗，修改试卷的名称、简介、封面、共建人、所属批次等基本信息。 |
| ec-btn-submit | 提交审批 | 将试卷提交审批。提交后试卷进入审批中状态，不可编辑。 |
| ec-btn-delete | 删除试卷 | 删除当前试卷。仅在草稿/未提交/已驳回状态下可操作。 |
| ec-btn-preview | 预览试卷 | 以前台考生视角预览试卷效果。 |
| ec-btn-save | 保存试卷 | 保存当前试卷的题目和分值配置。 |
| ec-btn-random | 自动抽题 | 点击打开自动抽题弹窗，按条件（题库、题型、难度、数量）从题库中自动抽取题目加入试卷。 |
| ec-btn-manual | 手动抽题 | 点击打开手动抽题弹窗，从题库中手动选择题加入试卷。 |
| ec-btn-add-question | 新增题目 | 直接在当前试卷中新增一道题目。 |
| ec-btn-batch-import | 批量导入题目 | 批量导入题目到当前试卷。 |
| ec-question-score | 题目分值 | 每道题在试卷中的分值。点击可修改，范围 1-100 分。 |

### 考试管理

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| eu-page-title | 考试管理 | 考试管理用于查看和管理试卷在各模块（场景、课程、教学考试）的使用情况。支持创建在线考试、配置考试参数、查看考试结果。 |
| eu-btn-create | 添加考试 | 点击打开「创建在线考试」弹窗，配置考试基本信息，选择试卷并设置考试参数。包含选择试卷、考试名称、简介、须知、封面、面向对象（学生/教师）、参考学生/人员、考试时间、时长等配置项。 |
| eu-stat-total | 考试总数 | 所有考试记录的总数量。 |
| eu-stat-pending | 未开始 | 状态为「未开始」的考试数量。 |
| eu-stat-active | 进行中 | 状态为「进行中」的考试数量。 |
| eu-stat-ended | 已结束 | 状态为「已结束」的考试数量。 |
| eu-search | 搜索考试 | 按试卷名称或场景名称关键词搜索。 |
| eu-filter-scene | 场景筛选 | 按使用场景筛选：全部、场景、课程。 |
| eu-filter-type | 类型筛选 | 按考试类型筛选：全部、随堂测、教学考试。 |
| eu-col-exam-name | 试卷名称 | 关联的试卷名称。 |
| eu-col-scene | 使用场景 | 考试的使用场景类型：场景、课程、教学考试。 |
| eu-col-target | 面向对象 | 考试的面向对象：学生或教师。非教学考试显示为「-」。 |
| eu-col-desc | 考试描述 | 考试的描述信息。 |
| eu-col-duration | 考试时长 | 考试规定的时长，单位为分钟。 |
| eu-col-participants | 参考人数 | 参加考试的学生/教师人数。 |
| eu-col-time | 考试开放时间 | 考试的开始时间和结束时间。 |
| eu-col-pass | 及格人数 | 考试及格的人数统计。 |
| eu-col-status | 考试状态 | 考试当前状态：未开始（灰色）、进行中（绿色）、已结束（边框）。 |
| eu-col-actions | 操作 | 分享考试、查看考试结果、编辑、删除等操作。以 DropdownMenu 形式展示。已结束考试可查看结果。 |
| eu-dialog-exam-select | 选择试卷 | 使用 Popover + Command 搜索组件选择试卷。支持下拉展开和关键词搜索，展示试卷名称、总分、题目数量。 |
| eu-dialog-target-student | 参考学生 | 选择参考学生时，使用组织树结构（学院→年级→班级→学生）进行多选。支持搜索学生或班级，已选学生在底部以标签形式展示，可单个移除。 |
| eu-dialog-target-teacher | 参考人员 | 面向教师时，从用户列表中选择参考人员。 |
| eu-dialog-open-type | 考试时间类型 | 考试时间配置：随时开放、定时开放、手动开放三种模式。 |

### 考试结果

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| eur-page-title | 考试结果 | 展示某次在线考试的详细结果，包括所有参考学生的成绩、排名、及格情况等信息。 |
| eur-btn-back | 返回考试管理 | 点击返回考试管理列表页。 |
| eur-btn-export | 导出成绩 | 点击导出考试成绩数据。 |
| eur-col-rank | 排名 | 学生按分数从高到低排序后的名次。同分情况下按提交时间先后排序。 |
| eur-col-student | 学生名称 | 参考学生的姓名。 |
| eur-col-student-id | 学号 | 学生的学号。 |
| eur-col-class | 班级 | 学生所属班级。 |
| eur-col-grade | 年级 | 学生所属年级。 |
| eur-col-major | 专业 | 学生所属专业。 |
| eur-col-score | 成绩 | 学生的考试得分。 |
| eur-col-total | 总分 | 试卷的总分值。 |
| eur-col-pass | 是否及格 | 学生成绩是否达到及格线（60分）。显示为「及格」或「不及格」。 |
| eur-col-submit-time | 提交时间 | 学生提交答卷的时间。 |
| eur-col-actions | 操作 | 查看学生答卷详情。 |

### 试卷管理

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| exam-page-title | 试卷管理 | 试卷管理是能力测评中心的核心功能之一，支持教研管理员和教师创建、编辑、管理试卷资源。支持列表视图和批次分组视图。 |
| exam-btn-config-approval | 配置审批流程 | 点击打开「审批流程管理」弹窗。教研管理员可预设校内审批流模板，供试卷批次关联使用。 |
| exam-btn-config-batch | 配置批次分组 | 点击打开「批次分组管理」弹窗。用于管理试卷建设批次分组，关联审批流程。 |
| exam-btn-import | 导入试卷 | 点击打开「导入试卷」弹窗，支持 Excel/JSON 格式批量导入试卷数据。 |
| exam-btn-create | 新建试卷 | 点击打开「新建试卷」弹窗，填写试卷名称、简介等信息后创建。创建后自动跳转到试卷编辑页。 |
| exam-tab-mine | 我的试卷 | 展示当前用户创建的试卷。 |
| exam-tab-collab | 共建试卷 | 展示当前用户在共建人列表中的试卷。 |
| exam-tab-public | 公共试卷 | 展示全部已发布试卷。 |
| exam-stat-total | 试卷总数 | 当前用户可见的试卷总数量。 |
| exam-stat-draft | 草稿 | 草稿状态的试卷数量。 |
| exam-stat-pending | 审批中 | 审批中状态的试卷数量。 |
| exam-stat-toPublish | 待发布 | 待发布状态的试卷数量。 |
| exam-stat-published | 已发布 | 已发布状态的试卷数量。 |
| exam-col-name | 试卷名称 | 试卷的名称标识。点击可进入试卷详情/编辑页。 |
| exam-col-desc | 试卷简介 | 试卷的简要描述信息。 |
| exam-col-question-count | 题目数量 | 试卷中包含的题目数量。 |
| exam-col-total-score | 总分 | 试卷的总分值。 |
| exam-col-batch | 所属批次 | 试卷关联的批次分组。 |
| exam-col-creator | 创建人 | 创建该试卷的用户。 |
| exam-col-collaborators | 共建人 | 参与共建该试卷的用户列表。 |
| exam-col-status | 状态 | 试卷当前状态。 |
| exam-col-created | 创建时间 | 试卷的创建时间。 |
| exam-col-updated | 更新时间 | 试卷的最后更新时间。 |
| exam-col-actions | 操作 | 对试卷进行查看、编辑、删除、状态变更、预览、邀请共建等操作。 |

### 试卷表单

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| ef-name | 试卷名称 | 试卷的名称标识，必填项。 |
| ef-description | 试卷简介 | 试卷的简要描述信息。 |
| ef-cover | 封面 | 试卷的封面图片，支持上传 5MB 以内的图片文件。 |
| ef-collaborators | 共建人 | 选择可以共同维护此试卷的用户。 |
| ef-batch | 所属批次 | 试卷关联的批次分组。可选择「不设置批次」。 |
| ef-version | 当前版本号 | 编辑时显示，不可修改。 |

### 题库管理

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| qb-page-title | 题库管理 | 题库管理是能力测评中心的资源管理中心，支持教研管理员和教师查看、筛选、管理自己创建/共建/公共的题库资源。支持列表视图和批次分组视图两种展示模式。 |
| qb-btn-config-approval | 配置审批流程 | 点击打开「审批流程管理」弹窗。教研管理员可预设校内审批流模板，供批次关联使用。包含流程名称、流程说明、审批步骤数等信息。 |
| qb-btn-config-batch | 配置批次分组 | 点击打开「批次分组管理」弹窗。用于管理题库/试卷建设批次分组，关联审批流程。支持新增批次，列表展示分组名称、批次编号、审批流程、状态。 |
| qb-btn-import | 导入题库 | 点击打开「导入题库」弹窗。支持 Excel/JSON 格式批量导入题目数据，上传区域为虚线边框拖拽区。提示：支持 .xlsx, .json 格式，单个文件不超过 10MB。 |
| qb-btn-create | 新建题库 | 点击打开「新建题库」弹窗，填写题库名称、简介等信息后创建。创建后自动跳转到题库详情页，可继续添加题目。 |
| qb-tab-mine | 我的题库 | 展示当前用户创建的题库。切换 Tab 时清空已选项和筛选条件。 |
| qb-tab-collab | 共建题库 | 展示当前用户在共建人列表中的题库。切换 Tab 时清空已选项和筛选条件。 |
| qb-tab-public | 公共题库 | 展示全部已发布题库，不展示统计面板。切换 Tab 时清空已选项和筛选条件。 |
| qb-view-list | 资源列表视图 | 以表格形式展示题库列表，包含题库名称、简介、题目数量、所属批次、创建人、共建人、状态、创建/更新时间等字段。 |
| qb-view-batch | 批次分组视图 | 按批次分组展示题库，每个批次作为一个卡片/分组，展示该批次下的所有题库。 |
| qb-stat-total | 题库总数 | 当前用户可见的题库总数量（根据 Tab 筛选条件统计）。 |
| qb-stat-draft | 草稿 | 草稿状态的题库数量。草稿状态可编辑、可删除、可克隆。 |
| qb-stat-pending | 审批中 | 审批中状态的题库数量。审批中状态可撤回审批、可删除、可克隆。 |
| qb-stat-toPublish | 待发布 | 待发布状态的题库数量。待发布状态可发布、可编辑、可删除、可克隆。 |
| qb-stat-published | 已发布 | 已发布状态的题库数量。已发布状态可取消发布、可克隆。 |
| qb-search | 搜索题库 | 按题库名称关键词搜索，支持实时过滤。 |
| qb-filter-status | 状态筛选 | 按题库状态筛选：全部、草稿、已发布。 |
| qb-col-name | 题库名称 | 题库的名称标识。默认题库会显示「草稿库」标签，不可删除。点击名称可进入题库详情页。 |
| qb-col-desc | 题库简介 | 题库的简要描述信息，帮助用户快速了解题库内容。 |
| qb-col-count | 题目数量 | 该题库中包含的题目总数量。 |
| qb-col-batch | 所属批次 | 题库关联的批次分组名称。未关联批次显示为「-」。 |
| qb-col-creator | 创建人 | 创建该题库的用户名称。 |
| qb-col-collaborators | 共建人 | 参与共建该题库的用户列表。默认题库不显示共建人。 |
| qb-col-status | 状态 | 题库当前状态：草稿、已发布。不同状态下可操作的功能不同。 |
| qb-col-actions | 操作 | 对题库进行查看、编辑、删除、状态变更、邀请共建等操作。默认题库不可删除。 |

### 题库表单

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| bf-name | 题库名称 | 题库的名称标识，必填项。 |
| bf-description | 题库简介 | 题库的简要描述信息，帮助用户了解题库内容。 |
| bf-cover | 封面 | 题库的封面图片，支持上传 5MB 以内的图片文件。 |
| bf-collaborators | 共建人 | 选择可以共同维护此题库的用户。点击「选择共建人」打开用户选择弹窗。 |
| bf-batch | 所属批次 | 题库关联的批次分组，下拉选择。可选择「不设置批次」。 |
| bf-version | 当前版本号 | 编辑时显示，不可修改。 |

### 题库详情

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| qbd-btn-back | 返回题库列表 | 点击返回题库管理列表页。 |
| qbd-btn-edit-bank | 编辑题库信息 | 点击打开弹窗，修改题库名称和简介。 |
| qbd-btn-delete-bank | 删除题库 | 删除当前题库及其中的所有题目。默认题库不可删除，会提示「默认题库不可删除」。 |
| qbd-btn-add-question | 添加题目 | 点击打开「添加题目」弹窗，支持单选题、多选题、判断题、填空题、简答题、编程题等多种题型。 |
| qbd-btn-import | 导入题目 | 点击打开「导入题目」弹窗，支持 Excel 批量导入。 |
| qbd-btn-batch-delete | 批量删除 | 勾选题目后点击批量删除选中的题目。 |
| qbd-btn-batch-move | 批量移动 | 勾选题目后点击批量移动到其他题库。 |
| qbd-search | 搜索题目 | 按题目内容关键词搜索。 |
| qbd-filter-type | 题型筛选 | 按题目类型筛选：全部、单选题、多选题、判断题、填空题、简答题、编程题。 |
| qbd-filter-creator | 创建人筛选 | 按题目创建人筛选，下拉列表展示所有有题目的创建人。 |
| qbd-col-content | 题目内容 | 题目的题干内容，过长时自动截断显示。 |
| qbd-col-type | 题型 | 题目的类型标识，如单选、多选、判断、填空、简答、编程等。 |
| qbd-col-difficulty | 难度 | 题目的难度等级：简单、中等、困难。 |
| qbd-col-score | 分值 | 该题目的默认分值。 |
| qbd-col-creator | 创建人 | 创建该题目的用户。 |
| qbd-col-dept | 所属院系 | 题目关联的院系/部门。 |
| qbd-col-actions | 题目操作 | 对单个题目进行预览、编辑、删除操作。以纯文字 DropdownMenu 形式展示。 |
| qbd-col-source | 添加来源 | 题目的添加来源渠道，如手动添加、导入等。 |

### 首页导航

| 标注ID | 字段/元素 | 数据来源说明 |
|--------|----------|-------------|
| nav-question-banks | 题库管理 | 通用测评资源管理模块，支持题库和题目的创建、编辑、导入、导出等操作。 |
| nav-exams | 试卷管理 | 通用测评资源管理模块，支持试卷的组卷、编辑、审批、发布等操作。 |
| nav-exam-usage | 考试管理 | 管理试卷在各模块的使用情况，支持创建在线考试、配置考试参数、查看考试结果。 |
| nav-approval-center | 审批中心 | 集中处理题库、试卷等资源的审批流程。 |
| nav-job-ability | 岗位能力认定管理 | 配置岗位能力认定规则，查看学生岗位能力认定结果。 |
| nav-scene-task | 测评方式库 | 管理测评方式（场景任务、智慧课堂、在线课程），查看和管理测评结果。 |
| nav-graduation | 毕业设计管理 | 管理毕业设计选题、档案、评价、查询等全流程。 |
| nav-student-portrait | 学生画像管理 | 管理学生档案和画像，展示学生综合能力分析。 |

## 6. 毕业设计管理

### 6.1 毕业设计选题管理 (`/graduation-project/topics`)

**页面入口**：侧边导航 → 毕业设计管理 → 毕业设计选题管理

**统计卡片**：选题概况（总数/草稿/审批中/已发布/已锁定）、选题来源（场景库/企业需求）

**搜索与筛选**：
- 顶部学院 Tab 切换（全部学院、计算机学院、软件学院等）
- 搜索框：按选题名称、岗位、导师搜索
- 状态下拉：全部/草稿/审批中/已发布/已锁定
- 来源下拉：全部/场景库/企业需求

**列表字段**：
| 字段 | 说明 |
|------|------|
| 选题名称 | 含描述 |
| 所属学院 | |
| 关联岗位 | 带图标 |
| 来源 | 场景库 / 企业需求 |
| 状态 | 草稿/审批中/已发布/已锁定 |
| 容量 | 已申请/总容量 |
| 指导教师 | |
| 企业导师 | |
| 起止时间 | |
| 操作 | DropdownMenu |

**表格行操作按钮**（按状态区分）：

| 状态 | 按钮 | 功能说明 |
|------|------|----------|
| 全部 | 查看 | 打开选题详情弹窗 |
| 草稿 | 编辑 | 打开编辑弹窗 |
| 草稿 | 删除 | 打开删除确认弹窗 |
| 草稿 | 提交审批 | 状态变为审批中 |
| 审批中 | 撤回 | 状态退回草稿 |
| 审批中 | 通过 | 状态变为已发布 |
| 审批中 | 驳回 | 状态退回草稿 |
| 已发布 | 申请(N) | 查看该选题的申请列表 |
| 已发布 | 取消发布 | 状态退回草稿 |
| 已发布 | 锁定 | 打开锁定确认弹窗，锁定后生成毕设档案 |
| 已锁定 | 申请(N) | 查看该选题的申请列表 |
| 已锁定 | 取消锁定 | 状态退回已发布 |

**弹窗说明**：

| 弹窗名称 | 功能说明 |
|---------|----------|
| 发布/编辑弹窗 | 选题名称、所属二级学院、选题来源、关联岗位、关联场景（场景库时显示场景卡片，含能力点/知识点/任务链）、企业项目配置（企业需求时）、能力要求配置（待开发占位）、学生容量、起止日期、选题描述、指导教师选择（支持多选，弹窗内搜索）、企业导师选择（支持多选，弹窗内搜索） |
| 指导教师搜索弹窗 | 按姓名/学院搜索，点击勾选 |
| 企业导师搜索弹窗 | 按姓名/企业搜索，点击勾选 |
| 查看详情弹窗 | 展示所有基础信息，底部根据状态显示对应的操作按钮（编辑/提交审批/撤回/通过/驳回/取消发布/锁定/取消锁定） |
| 删除确认弹窗 | 确认后删除选题 |
| 锁定确认弹窗 | 确认后锁定并自动生成毕设档案 |
| 申请列表弹窗 | 展示该选题下的学生申请记录（学生、班级、申请理由、负责教师、申请时间） |

**页面跳转**：
- 右上角 **「学生申请入口」** 按钮 → 新标签页打开 `/graduation-project/student/apply`

---

### 6.2 毕设档案管理 (`/graduation-project/archives`)

**页面入口**：侧边导航 → 毕业设计管理 → 毕设档案管理

**布局**：左右分栏。左侧选题导航（全部选题 + 各选题列表，显示人数）；右侧档案列表。

**统计卡片**：档案总数、制作中、待审核、已通过

**左侧选题导航**：
- 点击按选题筛选

**搜索**：
- 搜索框：搜索学生或导师

**列表字段**：
| 字段 | 说明 |
|------|------|
| 选题名称 | |
| 学生 | |
| 负责教师 | 含企业导师 |
| 文档数 | |
| 当前阶段 | 开题/中期/过程/结题 |
| 档案状态 | 制作中/待审核/已退回/已通过 |
| 最近更新 | |
| 操作 | 按钮 |

**表格行操作按钮**：

| 按钮 | 显示条件 | 功能说明 |
|------|----------|----------|
| 查看 | 始终显示 | 打开档案详情弹窗（Tab 形式） |
| 通过 | 仅待审核状态 | 档案状态变为已通过 |
| 退回 | 仅待审核状态 | 档案状态变为已退回 |

**档案详情弹窗**（`sm:max-w-6xl`，四个 Tab）：

| Tab | 内容说明 |
|-----|----------|
| 基础信息 | 选题名称、学生姓名、指导教师、企业导师、关联岗位、当前阶段、档案状态、最近更新、文档总数 |
| 过程性文档（8 类） | 开题报告、中期检查、过程记录、指导记录。每类展示文档卡片（名称、状态徽章、上传时间、大小、教师反馈） |
| 成果性文档（8 类） | 毕设作品、论文/报告、演示材料、源代码/工程文件。展示方式同上 |
| 评价记录 | 暂无评价记录 / 暂无整改记录（占位） |

**页面跳转**：
- 右上角 **「学生档案入口」** 按钮 → 新标签页打开 `/graduation-project/student/archives`

---

### 6.3 毕设评价管理 (`/graduation-project/evaluation`)

**页面入口**：侧边导航 → 毕业设计管理 → 毕设评价管理

**搜索与筛选**：
- 搜索框：搜索选题或学生
- 等级下拉：全部等级/A/B/C/D/E
- 状态下拉：全部状态/已完成/待评价

**统计卡片**：评价概况（总数/已完成/待评价）、优秀毕设（标杆案例数）、平均指导分

**列表字段**：
| 字段 | 说明 |
|------|------|
| 选题名称 | |
| 学生 | |
| 指导教师评分 | |
| 企业导师评分 | |
| 答辩评分 | |
| 综合等级 | A-优秀/B-良好/C-中等/D-及格/E-不及格，带颜色徽章 |
| 状态 | 已完成/待评价 |
| 操作 | 按钮 |

**表格行操作按钮**：

| 按钮 | 显示条件 | 功能说明 |
|------|----------|----------|
| 详情 | 始终显示 | 打开评价详情弹窗 |
| 评价 | 始终显示 | 打开评价弹窗（当前为占位提示，待开发现场评审模块） |
| 认定 | 仅已完成状态 | 打开认定弹窗，可勾选同步选项 |
| 标杆徽章 | 仅展示 | 表示已标记为优秀案例 |

**弹窗说明**：

| 弹窗名称 | 功能说明 |
|---------|----------|
| 评价详情弹窗 | 展示各项评分、综合等级、是否优秀、状态 |
| 评价弹窗 | 占位提示，说明将集成现场评审模块。底部 **「提交评价」** 按钮 |
| 评价标准配置弹窗 | 选择关联岗位，展示评价维度与权重（只读） |
| 认定弹窗 | 展示学生与综合等级，提供三个勾选框：同步至学历认定模块、同步至能力画像模块、标记为标杆案例。底部 **「确认认定」** 按钮 |

---

### 6.4 毕业查询管理 (`/graduation-project/query`)

**页面入口**：侧边导航 → 毕业设计管理 → 毕业查询管理

**统计卡片**：毕业状态分布（已达标/未达标/审核中）、能力认证（已认证/总计）

**搜索与筛选**：
- 搜索框：搜索姓名、学号、班级
- 毕业状态下拉：全部/已达标/未达标/审核中

**列表字段**：
| 字段 | 说明 |
|------|------|
| 学号 | |
| 姓名 | |
| 班级 | |
| 专业 | |
| 学分完成 | 含进度条 |
| 场景达标 | |
| 毕设等级 | |
| 毕业状态 | 已达标/未达标/审核中 |
| 能力认证 | 已认证/未认证/审核中 |
| 整改数 | |
| 操作 | 按钮 |

**顶部操作按钮**：

| 按钮 | 功能说明 |
|------|----------|
| 导出报表 | 打开导出弹窗 |
| 结果申诉 | 打开申诉管理列表弹窗 |
| 学生查询入口 | 新标签页打开 `/graduation-project/student/query` |

**表格行操作按钮**：

| 按钮 | 显示条件 | 功能说明 |
|------|----------|----------|
| 查看申诉 | 仅当该学生有申诉时 | 打开详情弹窗 |
| 详情 | 始终显示 | 打开毕业状态详情弹窗 |
| 证明 | 始终显示 | 打开毕业证明预览弹窗 |

**弹窗说明**：

| 弹窗名称 | 功能说明 |
|---------|----------|
| 毕业状态详情弹窗 | 学生基础信息、学历认定进度（学分/场景进度条）、毕设各阶段评价、整改意见、申诉记录 |
| 申诉管理列表弹窗 | 展示所有学生申诉记录（学号、姓名、申诉类型、申诉理由、提交时间、状态、操作）。待处理状态可点击 **「回复」** |
| 回复申诉弹窗 | 展示申诉信息，输入回复内容，**确认回复** 后状态变为已处理 |
| 毕业证明预览弹窗 | 学历认定证书、能力认定徽章（可视化展示） |
| 导出报表弹窗 | 选择 Excel 报表 或 PDF 汇总报告 |

---

### 6.5 学生端 - 选题申请 (`/graduation-project/student/apply`)

**页面入口**：学生申请入口

**页面布局**：学生视角，顶部返回按钮，max-w-5xl 居中

**搜索与筛选**：
- 搜索框：搜索选题名称或岗位
- 来源下拉：全部/场景库/企业需求

**我的申请记录**：顶部展示当前学生的申请历史（Badge 形式）

**卡片字段（卡片式布局）**：
- 选题名称
- 来源标签（场景库/企业需求）
- 描述
- 关联岗位
- 已申请/容量
- 指导教师/企业导师
- 起止时间

**卡片操作按钮**：

| 按钮 | 功能说明 |
|------|----------|
| 查看详情 | 打开选题详情弹窗 |
| 申请选题 | 打开申请弹窗 |

**弹窗说明**：

| 弹窗名称 | 功能说明 |
|---------|----------|
| 申请弹窗 | 填写学号、姓名、班级、申请理由，**提交申请** |
| 选题详情弹窗 | 左侧：选题基础信息、关联场景信息（场景库）/ 企业项目配置（企业需求）/ 能力要求；右侧：指导团队、当前负责教师、申请信息、**申请该选题** 按钮 |

---

### 6.6 学生端 - 毕设档案 (`/graduation-project/student/archives`)

**页面入口**：学生档案入口

**页面布局**：学生视角，固定学生 `MOCK_STUDENT_ID = '2021001'`

**四个 Tab**：

| Tab | 内容说明 |
|-----|----------|
| 基础信息 | 选题名称、学生姓名、指导教师、企业导师、关联岗位、当前阶段、起止日期、选题描述 |
| 过程性文档（4 类） | 开题报告、中期检查、过程记录、指导记录。每类可上传文档、删除文档。文档卡片展示名称、状态（待提交/已提交/已通过/已退回/需整改）、上传时间、教师反馈 |
| 成果性文档（4 类） | 毕设作品、论文/报告、演示材料、源代码/工程文件。同上 |
| 评价记录 | 各阶段评价结果（开题/中期，展示分数和评语）、整改任务（如有）。整改任务可点击 **「提交整改结果」** |

**操作按钮**：

| 按钮 | 位置 | 功能说明 |
|------|------|----------|
| 上传文档 | 过程性/成果性 Tab | 打开上传弹窗 |
| 删除 | 每个文档卡片 | 删除该文档 |
| 提交整改结果 | 整改任务卡片 | 打开整改回复弹窗 |

**弹窗说明**：

| 弹窗名称 | 功能说明 |
|---------|----------|
| 上传文档弹窗 | 选择文档类别（8 类下拉）、输入文档名称、上传区域（点击/拖拽）。**确认上传** |
| 整改回复弹窗 | 展示整改要求，输入整改说明/补充材料，**提交整改** |

---

### 6.7 学生端 - 毕业查询 (`/graduation-project/student/query`)

**页面入口**：学生查询入口

**页面布局**：学生视角，顶部搜索学号

**查询结果展示**：
- 学生基础信息 + 毕业状态徽章
- 毕业资格进度：学分完成（进度条）、场景达标（进度条）
- 毕设评价结果：各阶段评价分数和评语、综合等级
- 整改意见：展示整改要求和截止日期
- 能力认证：认证状态
- 我的申诉：历史申诉记录

**底部操作按钮**：

| 按钮 | 功能说明 |
|------|----------|
| 毕业证明预览 | 打开证书预览弹窗 |
| 结果申诉 | 打开申诉弹窗 |

**弹窗说明**：

| 弹窗名称 | 功能说明 |
|---------|----------|
| 证书预览弹窗 | 学历认定证书 + 能力认定徽章 |
| 申诉弹窗 | 选择申诉类型（成绩申诉/毕业资格申诉/能力认证申诉），填写申诉理由，**提交申诉** |

---

## 7. 学生画像管理

### 7.1 学生档案管理（教师端） (`/student-portrait/archives`)

**页面入口**：侧边导航 → 学生画像管理 → 学生档案管理

**布局**：左右分栏。左侧学生导航（按班级分组，支持搜索）；右侧档案记录。

**左侧学生导航**：
- 搜索框：搜索学生姓名/学号/班级
- 班级分组列表，点击切换学生。有数据的学生显示绿色圆点。

**右侧档案记录**：
- 学生基本信息（姓名/学号/班级）
- 操作按钮：**上传新档案** / **添加学生违纪/处分记录**

**表格字段（正向/负向档案各一个表格）**：
| 字段 | 说明 |
|------|------|
| 材料类型 | 荣誉证书/竞赛成果/社会活动/实习证明/技能证书 |
| 材料名称 | 含审核意见 |
| 颁发机构 | |
| 获得时间 | |
| 等级 | |
| 审核状态 | 待审核/已审核/已驳回 |
| 转换学分 | 正向显示绿色 `+N`，负向显示红色 `-N` |
| 操作列 | 按钮 |

**表格操作按钮**：

| 按钮 | 显示条件 | 功能说明 |
|------|----------|----------|
| 查看 | 始终显示 | 打开档案详情弹窗 |
| 审核 | 仅待审核状态 | 打开审核弹窗 |
| 版本 | 始终显示 | 打开版本历史弹窗 |
| 删除 | 始终显示 | 打开删除确认弹窗（destructive） |

**顶部操作按钮**：
- **学分转换配置**：打开学分转换规则配置弹窗

**弹窗说明**：

| 弹窗名称 | 功能说明 |
|---------|----------|
| 上传新档案弹窗 | 材料类型下拉、等级下拉（根据类型动态变化）、材料名称、颁发机构、获得日期、附件上传区域。**确认上传** 后状态为待审核 |
| 添加违纪/处分记录弹窗 | 扣分内容、扣分分值、扣分时间。**确认添加** 后生成负向档案 |
| 审核弹窗 | 审核结果（通过/驳回）、转换学分（可手动输入，支持自动计算按钮）、审核意见。**确认审核** |
| 档案详情弹窗 | 展示所有字段及审核意见 |
| 学分转换规则配置弹窗 | 展示各材料类型+等级对应的学分，可编辑，**保存规则** |
| 版本历史弹窗 | 展示该档案的变更记录（版本号、变更摘要、变更人、时间） |
| 删除确认弹窗 | 确认后删除档案 |

---

### 7.2 学生画像管理（教师端） (`/student-portrait/portraits`)

**页面入口**：侧边导航 → 学生画像管理 → 学生画像管理

**布局**：左右分栏。左侧专业-班级导航；右侧学生列表。

**左侧专业-班级导航**：
- 搜索框：搜索专业或班级
> 数据来源：后台「学生画像管理」/student-portrait → nav.search
- **「全部班级」** 按钮
- 按专业分组，专业下展示各班级及人数
> 数据来源：后台「学生画像管理」/student-portrait → nav.majorClass

**右侧学生列表字段**：
| 字段 | 说明 |
|------|------|
| 学号 | |
> 数据来源：后台「学生画像管理」/student-portrait → student.id
| 姓名 | |
> 数据来源：后台「学生画像管理」/student-portrait → student.name
| 班级 | |
> 数据来源：后台「学生画像管理」/student-portrait → student.className
| 专业 | |
> 数据来源：后台「学生画像管理」/student-portrait → student.major
| 班级排名 | `classRank / classTotal` |
> 数据来源：后台「学生画像管理」/student-portrait → student.classRank / student.classTotal
| 专业排名 | `majorRank / majorTotal` |
> 数据来源：后台「学生画像管理」/student-portrait → student.majorRank / student.majorTotal

**搜索与筛选**：
- 搜索框：搜索姓名、学号、班级或岗位
> 数据来源：后台「学生画像管理」/student-portrait → search.keyword
- 等级下拉：全部等级 / A/B/C/D/E
> 数据来源：后台「学生画像管理」/student-portrait → filter.grade

**顶部操作按钮**：

| 按钮 | 功能说明 |
|------|----------|
| 手动更新画像 | 打开画像生成弹窗 |
> 数据来源：后台「学生画像管理」/student-portrait → action.generate
| 画像更新时间 | 打开更新时间配置弹窗（展示自动更新周期，只读） |
> 数据来源：后台「学生画像管理」/student-portrait → action.configTime
| 学生画像模块配置 | 打开模块配置弹窗，可开关课程成绩/毕业设计/荣誉模块 |
> 数据来源：后台「学生画像管理」/student-portrait → action.moduleConfig

**表格操作按钮**：

| 按钮 | 功能说明 |
|------|----------|
| 查看学生画像 | 打开 `StudentPortraitModal`（全屏 iframe，加载 `/student_portrait.html`） |
> 数据来源：后台「学生画像管理」/student-portrait → action.viewPortrait

**弹窗说明**：

| 弹窗名称 | 功能说明 |
|---------|----------|
| 手动维护画像数据弹窗 | 调整各能力领域得分（输入框+进度条），填写调整原因，**确认维护** |
| 画像更新时间弹窗 | 展示自动更新周期（每日凌晨 2 点）、最后更新时间（只读） |
| 画像对比分析弹窗 | 展示班级/专业/年级能力分布对比（进度条）、能力领域横向对比（5 个维度均分） |
| 就业推荐配置弹窗 | AI 匹配算法、匹配权重（能力得分 60%/学历评价 25%/档案材料 15%）、启用企业招聘人才筛选 Switch |
| 画像生成弹窗 | 说明画像生成引擎将聚合的数据来源，**确认手动更新** |
| 学生画像详情弹窗 | 全屏弹窗，iframe 嵌入 `/student_portrait.html` |

---

### 7.3 学生档案管理（学生端） (`/student-portrait/student/archives`)

**页面入口**：学生端入口

**页面布局**：学生视角，固定学生 `MOCK_SELF = { name: '张三', id: '2021001' }`

**展示内容**：
- 学生基本信息（姓名/学号/班级）
- 操作按钮：**上传新档案**

**表格字段（两个表格：正向档案 + 负向档案）**：
与教师端档案表格相同：材料类型、材料名称、颁发机构、获得时间、等级、审核状态、转换学分。
（学生端无操作列，点击整行可查看详情）

**弹窗说明**：

| 弹窗名称 | 功能说明 |
|---------|----------|
| 上传新档案弹窗 | 材料类型、等级、名称、颁发机构、日期、附件上传。**提交** 后进入待审核 |
| 档案详情弹窗 | 展示档案所有字段及审核意见 |

---


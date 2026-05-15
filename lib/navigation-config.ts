import type { PlatformNavigationConfig } from "@/platform-navigation-shell"

export const evaluationNavigationConfig: PlatformNavigationConfig = {
  brandTitle: "测评管理系统",
  currentPlatformId: "evaluation",
  currentPlatformLabel: "测评管理系统",
  brandHref: "/",
  brandIcon: "settings",
  platformIcon: "settings",
  sideBackHref: "/",
  currentUserName: "管理员",
  currentUserRoleLabel: "测评管理系统",
  showCurrentTime: true,
  userMenuItems: [
    { id: "profile", label: "个人中心", icon: "user" },
    { id: "account", label: "账号设置", icon: "settings" },
    { id: "logout", label: "退出登录", tone: "danger" },
  ],
  topNavItems: [
    { id: "portal", label: "门户首页", href: "http://47.251.48.187:3001/portal", icon: "home" },
    { id: "workspace", label: "我的服务台", href: "http://47.251.48.187:3001/portal/workspace", icon: "briefcase" },
    { id: "apps", label: "应用服务中心", href: "http://47.251.48.187:3001/portal/apps", icon: "layoutGrid" },
  ],
  sideNavItems: [
    {
      id: "general-evaluation",
      label: "通用测评资源管理",
      icon: "folderKanban",
      children: [
        { id: "question-banks", label: "题库管理", href: "/question-banks", matchers: ["/question-banks"] },
        { id: "exams", label: "试卷管理", href: "/exams", matchers: ["/exams"] },
        { id: "exam-usage", label: "考试管理", href: "/exam-usage", matchers: ["/exam-usage$", "/exam-usage/results"] },
        { id: "approval-center", label: "审批中心", href: "/approval-center", matchers: ["/approval-center"] },
      ],
    },
    {
      id: "job-ability",
      label: "岗位能力测评管理",
      icon: "briefcase",
      children: [
        { id: "job-ability-rules", label: "岗位能力认证规则管理", href: "/job-ability", matchers: ["/job-ability$"] },
        { id: "job-ability-results", label: "岗位能力测评结果", href: "/job-ability/results", matchers: ["/job-ability/results"] },
      ],
    },
    {
      id: "scene-task",
      label: "场景任务测评管理",
      icon: "layers3",
      children: [
        { id: "scene-task-methods", label: "场景任务测评方式管理", href: "/evaluation-methods", matchers: ["/evaluation-methods"] },
        { id: "scene-task-results", label: "场景任务测评结果", href: "/scene-task-results", matchers: ["/scene-task-results"] },
      ],
    },
    {
      id: "graduation-project",
      label: "毕业设计管理",
      icon: "graduationCap",
      children: [
        { id: "gp-topics", label: "毕业设计选题管理", href: "/graduation-project/topics", matchers: ["/graduation-project/topics"] },
        { id: "gp-archives", label: "毕设档案管理", href: "/graduation-project/archives", matchers: ["/graduation-project/archives"] },
        { id: "gp-evaluation", label: "毕设评价管理", href: "/graduation-project/evaluation", matchers: ["/graduation-project/evaluation"] },
        { id: "gp-query", label: "毕业查询管理", href: "/graduation-project/query", matchers: ["/graduation-project/query"] },
      ],
    },
    {
      id: "student-portrait",
      label: "学生能力画像管理",
      icon: "userCircle",
      children: [
        { id: "sp-archives", label: "学生能力档案管理", href: "/student-portrait/archives", matchers: ["/student-portrait/archives"] },
        { id: "sp-portraits", label: "学生能力画像管理", href: "/student-portrait/portraits", matchers: ["/student-portrait/portraits"] },
      ],
    },
  ],
}

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
  ],
}

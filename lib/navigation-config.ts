import type { PlatformNavigationConfig } from "@/components/platform-shell"
import { COLLEGES } from "@/lib/types"

const baseConfig: Omit<PlatformNavigationConfig, 'sideNavItems' | 'hideSideNav'> = {
  brandTitle: "教学资源共享服务平台",
  currentPlatformId: "resource-platform",
  currentPlatformLabel: "教学资源共享服务平台",
  brandHref: "/home",
  brandIcon: "library",
  platformIcon: "library",
  sideBackHref: "/home",
  currentUserName: "管理员",
  currentUserRoleLabel: "平台管理员",
  showCurrentTime: true,
  userMenuItems: [
    { id: "my", label: "个人中心", href: "/my", icon: "user" },
    { id: "account", label: "账号设置", icon: "settings" },
    { id: "logout", label: "退出登录", tone: "danger" },
  ],
  topNavItems: [
    { id: "portal", label: "门户首页", href: "http://111.170.170.202:3001/portal", icon: "home" },
    { id: "workspace", label: "我的服务台", href: "http://111.170.170.202:3001/portal/workspace", icon: "briefcase" },
    { id: "apps", label: "应用服务中心", href: "http://111.170.170.202:3001/portal/apps", icon: "layoutGrid" },
  ],
}

export const frontendNavigationConfig: PlatformNavigationConfig = {
  ...baseConfig,
  hideSideNav: true,
  sideNavItems: [],
  showCollegeFilter: false,
}

export const backendNavigationConfig: PlatformNavigationConfig = {
  ...baseConfig,
  showCollegeFilter: true,
  collegeOptions: COLLEGES,
  sideNavItems: [
    {
      id: "resource-management",
      label: "公共资源库",
      icon: "folderKanban",
      children: [
        { id: "admin-video", label: "视频", href: "/admin/resources/video", matchers: ["/admin/resources/video"] },
        { id: "admin-document", label: "文档", href: "/admin/resources/document", matchers: ["/admin/resources/document"] },
        { id: "admin-spreadsheet", label: "表格", href: "/admin/resources/spreadsheet", matchers: ["/admin/resources/spreadsheet"] },
        { id: "admin-image", label: "图片", href: "/admin/resources/image", matchers: ["/admin/resources/image"] },
        { id: "admin-link", label: "链接", href: "/admin/resources/link", matchers: ["/admin/resources/link"] },
        { id: "admin-venue", label: "场地", href: "/admin/resources/venue", matchers: ["/admin/resources/venue"] },
        { id: "admin-equipment", label: "仪器设备", href: "/admin/resources/equipment", matchers: ["/admin/resources/equipment"] },
        { id: "admin-software", label: "软件", href: "/admin/resources/software", matchers: ["/admin/resources/software"] },
        { id: "admin-simulation", label: "仿真", href: "/admin/resources/simulation", matchers: ["/admin/resources/simulation"] },
        { id: "admin-audio", label: "音频", href: "/admin/resources/audio", matchers: ["/admin/resources/audio"] },
        { id: "admin-other", label: "其他", href: "/admin/resources/other", matchers: ["/admin/resources/other"] },
        { id: "admin-knowledge-point", label: "知识点", href: "/admin/resources/knowledge-point", matchers: ["/admin/resources/knowledge-point"] },
        { id: "admin-ability-point", label: "能力点", href: "/admin/resources/ability-point", matchers: ["/admin/resources/ability-point"] },
      ],
    },
    {
      id: "audit-center",
      label: "资源审核管理",
      icon: "badgeCheck",
      href: "/admin/audit",
      matchers: ["/admin/audit"],
    },
    {
      id: "admin-my-resources",
      label: "我的资源",
      icon: "user",
      href: "/admin/my-resources",
      matchers: ["/admin/my-resources"],
    },
  ],
}

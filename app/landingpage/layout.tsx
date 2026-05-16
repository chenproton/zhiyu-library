"use client"

import Link from "next/link"
import { GraduationCap } from "lucide-react"

const footerLinks = [
  {
    title: "平台服务",
    links: ["测评资源", "能力认证", "毕业设计", "学生画像"],
  },
  {
    title: "帮助中心",
    links: ["使用指南", "常见问题", "考试须知", "认证流程"],
  },
  {
    title: "关于我们",
    links: ["平台介绍", "联系我们", "意见反馈", "隐私政策"],
  },
]

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-background">
      {children}
      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="text-lg font-semibold">能力测评认证平台</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                一站式能力成长与认证服务平台，助力每一位学生成长成才。
              </p>
            </div>
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h4 className="text-sm font-semibold">{group.title}</h4>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
            © 2024 能力测评认证平台. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

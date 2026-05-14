import type { Metadata } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { PlatformShell } from '@/platform-navigation-shell'
import { evaluationNavigationConfig } from '@/lib/navigation-config'
import { DataProvider } from '@/components/providers/data-provider'
import './globals.css'

// const geist = Geist({ subsets: ["latin"] })
// const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: '测评管理系统',
  description: '题库、组卷、试卷、岗位能力认证规则管理系统',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`font-sans antialiased`}>
        <DataProvider>
          <PlatformShell config={evaluationNavigationConfig}>
            {children}
          </PlatformShell>
        </DataProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

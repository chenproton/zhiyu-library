import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { DataProvider } from '@/components/providers/data-provider'
import ShellWrapper from './shell-wrapper'
import './globals.css'

export const metadata: Metadata = {
  title: '教学资源共享服务平台',
  description: '教学资源共享服务平台，提供视频、文档、软件、仿真等多种教学资源的共享与管理',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        <DataProvider>
          <Suspense fallback={
            <div className="flex min-h-screen bg-[#f5f7fa] pt-14">
              <main className="min-w-0 flex-1 p-6">{children}</main>
            </div>
          }>
            <ShellWrapper>{children}</ShellWrapper>
          </Suspense>
        </DataProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

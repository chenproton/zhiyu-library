"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, Clock, AlertCircle, XCircle, CheckCircle } from "lucide-react"
import type { Status } from "@/lib/types"

interface StatsCardsProps {
  items: { status: Status }[]
  type: 'bank' | 'exam'
}

export function StatsCards({ items, type }: StatsCardsProps) {
  const total = items.length
  const unsubmitted = items.filter(i => i.status === 'unsubmitted' || i.status === 'draft').length
  const pending = items.filter(i => i.status === 'pending').length
  const rejected = items.filter(i => i.status === 'rejected').length
  const published = items.filter(i => i.status === 'published').length

  const label = type === 'bank' ? '题库' : '试卷'

  const stats = [
    {
      label: `${label}总数`,
      value: total,
      icon: FileText,
      color: 'text-foreground',
      bgColor: 'bg-muted',
    },
    {
      label: '未提交',
      value: unsubmitted,
      icon: Clock,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
    {
      label: '审批中',
      value: pending,
      icon: AlertCircle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      label: '已驳回',
      value: rejected,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: '已发布',
      value: published,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ]

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-none shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`flex size-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`size-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

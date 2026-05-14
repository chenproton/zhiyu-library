"use client"

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

  return (
    <div className="mb-4 flex gap-3">
      <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
        <div className="flex size-8 items-center justify-center rounded-md bg-blue-50">
          <FileText className="size-4 text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs text-muted-foreground">{label}指标</div>
          <div className="flex items-center gap-2 text-xs">
            <span>总数 <strong className="text-foreground">{total}</strong></span>
            <span className="text-gray-300">|</span>
            <span>未提交 <strong className="text-foreground">{unsubmitted}</strong></span>
            <span className="text-gray-300">|</span>
            <span>审批中 <strong className="text-amber-600">{pending}</strong></span>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center gap-3 rounded-lg border bg-white px-4 py-3">
        <div className="flex size-8 items-center justify-center rounded-md bg-emerald-50">
          <CheckCircle className="size-4 text-emerald-600" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs text-muted-foreground">审批结果</div>
          <div className="flex items-center gap-2 text-xs">
            <span>已驳回 <strong className="text-red-600">{rejected}</strong></span>
            <span className="text-gray-300">|</span>
            <span>已发布 <strong className="text-emerald-600">{published}</strong></span>
          </div>
        </div>
      </div>
    </div>
  )
}

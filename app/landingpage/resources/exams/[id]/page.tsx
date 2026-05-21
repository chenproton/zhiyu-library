"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft, FileText, ListOrdered, Clock, Signal, Users,
  BarChart3, CheckCircle2, AlertCircle, PlayCircle, Eye,
  BookOpen, ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/components/providers/data-provider"

export default function PaperDetailPage() {
  const params = useParams()
  const paperId = params.id as string
  const { exams } = useData()

  const paper = exams.find((e) => e.id === paperId)

  if (!paper) {
    return (
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
        <Link href="/landingpage/resources">
          <Button variant="ghost" size="sm" style={{ gap: 6 }}>
            <ArrowLeft style={{ width: 16, height: 16 }} /> 返回资源库
          </Button>
        </Link>
        <div style={{ textAlign: "center", padding: "80px 0", color: "#8f959e" }}>
          <FileText style={{ width: 48, height: 48, margin: "0 auto 12px", opacity: 0.3 }} />
          <p>试卷不存在</p>
        </div>
      </div>
    )
  }

  const statusMap: Record<string, { bg: string; color: string; label: string }> = {
    draft: { bg: "#f5f6f7", color: "#8f959e", label: "草稿" },
    unsubmitted: { bg: "#fef3c7", color: "#d97706", label: "未提交" },
    pending: { bg: "#dbeafe", color: "#3b82f6", label: "审核中" },
    rejected: { bg: "#fee2e2", color: "#dc2626", label: "已驳回" },
    toPublish: { bg: "#e0e7ff", color: "#4f46e5", label: "待发布" },
    published: { bg: "#dcfce7", color: "#16a34a", label: "已发布" },
  }
  const st = statusMap[paper.status] || statusMap.draft
  const totalScore = paper.questions.reduce((s, q) => s + (q.score || 0), 0)

  const typeLabels: Record<string, string> = {
    single: "单选题", multiple: "多选题", judge: "判断题",
    fill: "填空题", essay: "论述题", short_answer: "简答题",
  }

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/landingpage/resources">
          <Button variant="ghost" size="sm" style={{ gap: 6 }}>
            <ArrowLeft style={{ width: 16, height: 16 }} /> 返回资源库
          </Button>
        </Link>
      </div>

      {/* 头部 */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e6eb", overflow: "hidden", marginBottom: 24 }}>
        <div style={{ padding: "24px 32px", background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{paper.name}</h1>
            <p style={{ fontSize: 14, opacity: 0.9 }}>{paper.description}</p>
          </div>
          <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500, background: "rgba(255,255,255,0.2)" }}>
            {st.label}
          </span>
        </div>
        <div style={{ padding: "24px 32px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {[
            { icon: <Clock style={{ width: 18, height: 18 }} />, label: "考试时长", value: `${paper.duration} 分钟` },
            { icon: <ListOrdered style={{ width: 18, height: 18 }} />, label: "题目数量", value: `${paper.questions.length} 题` },
            { icon: <BarChart3 style={{ width: 18, height: 18 }} />, label: "总分", value: `${totalScore} 分` },
            { icon: <Signal style={{ width: 18, height: 18 }} />, label: "版本", value: paper.version },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: "16px 0", background: "#f5f6f7", borderRadius: 8 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#f59e0b", marginBottom: 6 }}>
                {item.icon} <span style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* 题目概览 */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e6eb", padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <BookOpen style={{ width: 18, height: 18, color: "#f59e0b" }} /> 题目概览
          </h3>
          {paper.questions.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#8f959e" }}>暂无题目数据</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {paper.questions.map((q, i) => (
                <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#f5f6f7", borderRadius: 8 }}>
                  <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#f59e0b", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: 14, color: "#1f2329", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.content}</span>
                  <Badge variant="outline" style={{ fontSize: 10 }}>{typeLabels[q.type] || q.type}</Badge>
                  <span style={{ fontSize: 12, color: "#8f959e", flexShrink: 0 }}>{q.score}分</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 侧边栏 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e6eb", padding: 24 }}>
            <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>试卷信息</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8f959e" }}>试卷名称</span>
                <span style={{ fontWeight: 500 }}>{paper.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8f959e" }}>状态</span>
                <span style={{ fontWeight: 500, color: st.color }}>{st.label}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8f959e" }}>时长</span>
                <span style={{ fontWeight: 500 }}>{paper.duration} 分钟</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8f959e" }}>题数</span>
                <span style={{ fontWeight: 500 }}>{paper.questions.length} 题</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8f959e" }}>总分</span>
                <span style={{ fontWeight: 500 }}>{totalScore} 分</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8f959e" }}>版本</span>
                <span style={{ fontWeight: 500 }}>{paper.version}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8f959e" }}>归属</span>
                <span style={{ fontWeight: 500 }}>{paper.ownerType === "mine" ? "个人" : paper.ownerType === "collaborate" ? "协作" : "公共"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8f959e" }}>创建时间</span>
                <span style={{ fontWeight: 500 }}>{new Date(paper.createdAt).toLocaleDateString("zh-CN")}</span>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e6eb", padding: 24 }}>
            <Link href={`/landingpage/exams/${paper.id}`}>
              <Button size="lg" style={{ width: "100%", gap: 6, background: "#f59e0b" }}>
                <PlayCircle style={{ width: 18, height: 18 }} /> 开始测试
              </Button>
            </Link>
            <Button size="lg" variant="outline" style={{ width: "100%", gap: 6, marginTop: 12 }}>
              <Eye style={{ width: 18, height: 18 }} /> 预览试卷
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

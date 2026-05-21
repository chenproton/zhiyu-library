"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft, BookOpen, ListOrdered, User, Clock, Search,
  FileText, ChevronRight, Star, CheckCircle2, AlertCircle,
  Heart, Plus, Database,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/components/providers/data-provider"

export default function QuestionBankDetailPage() {
  const params = useParams()
  const bankId = params.id as string
  const { questionBanks, questions } = useData()

  const bank = questionBanks.find((b) => b.id === bankId)
  const bankQuestions = questions.filter((q) => q.bankId === bankId)

  if (!bank) {
    return (
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
        <Link href="/landingpage/resources">
          <Button variant="ghost" size="sm" style={{ gap: 6 }}>
            <ArrowLeft style={{ width: 16, height: 16 }} /> 返回资源库
          </Button>
        </Link>
        <div style={{ textAlign: "center", padding: "80px 0", color: "#8f959e" }}>
          <BookOpen style={{ width: 48, height: 48, margin: "0 auto 12px", opacity: 0.3 }} />
          <p>题库不存在</p>
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
  const st = statusMap[bank.status] || statusMap.draft

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
        <div style={{ padding: "24px 32px", background: "linear-gradient(135deg, #3370ff, #60a5fa)", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{bank.name}</h1>
            <p style={{ fontSize: 14, opacity: 0.9 }}>{bank.description}</p>
          </div>
          <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500, background: "rgba(255,255,255,0.2)" }}>
            {st.label}
          </span>
        </div>
        <div style={{ padding: "24px 32px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {[
            { icon: <ListOrdered style={{ width: 18, height: 18 }} />, label: "题目数量", value: `${bank.questionCount} 题` },
            { icon: <User style={{ width: 18, height: 18 }} />, label: "创建者", value: bank.creatorId || "系统" },
            { icon: <Clock style={{ width: 18, height: 18 }} />, label: "版本", value: bank.version },
            { icon: <Database style={{ width: 18, height: 18 }} />, label: "归属", value: bank.ownerType === "mine" ? "个人" : bank.ownerType === "collaborate" ? "协作" : "公共" },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: "16px 0", background: "#f5f6f7", borderRadius: 8 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#3370ff", marginBottom: 6 }}>
                {item.icon} <span style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* 题目列表 */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e6eb", padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <FileText style={{ width: 18, height: 18, color: "#3370ff" }} /> 题目预览
          </h3>
          {bankQuestions.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#8f959e" }}>暂无题目数据</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {bankQuestions.slice(0, 8).map((q, i) => (
                <div key={q.id} style={{ padding: 14, background: "#f5f6f7", borderRadius: 8 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                    <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#3370ff", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{q.content}</span>
                      <span style={{ marginLeft: 8, fontSize: 11, color: "#8f959e" }}>({q.score}分)</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <Badge variant="outline" style={{ fontSize: 10 }}>{typeLabels[q.type] || q.type}</Badge>
                    {q.difficulty && <Badge variant="outline" style={{ fontSize: 10, color: q.difficulty === "easy" ? "#16a34a" : q.difficulty === "hard" ? "#dc2626" : "#f59e0b" }}>{q.difficulty === "easy" ? "简单" : q.difficulty === "hard" ? "困难" : "中等"}</Badge>}
                    {q.knowledgePoints?.map((kp, j) => (
                      <span key={j} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "#f0f5ff", color: "#3370ff" }}>{kp}</span>
                    ))}
                  </div>
                  {q.options && q.options.length > 0 && (
                    <div style={{ marginTop: 8, paddingLeft: 32, display: "flex", flexDirection: "column", gap: 4 }}>
                      {q.options.map((opt, j) => (
                        <span key={j} style={{ fontSize: 13, color: "#646a73" }}>{String.fromCharCode(65 + j)}. {opt}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {bankQuestions.length > 8 && (
                <div style={{ textAlign: "center", fontSize: 13, color: "#8f959e", padding: 8 }}>
                  共 {bankQuestions.length} 题，{bank.ownerType === "public" ? "登录后查看全部" : "查看更多题目"}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 侧边栏 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e6eb", padding: 24 }}>
            <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>题库信息</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8f959e" }}>题库名称</span>
                <span style={{ fontWeight: 500 }}>{bank.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8f959e" }}>状态</span>
                <span style={{ fontWeight: 500, color: st.color }}>{st.label}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8f959e" }}>题目数量</span>
                <span style={{ fontWeight: 500 }}>{bank.questionCount} 题</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8f959e" }}>版本</span>
                <span style={{ fontWeight: 500 }}>{bank.version}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8f959e" }}>归属</span>
                <span style={{ fontWeight: 500 }}>{bank.ownerType === "mine" ? "个人" : bank.ownerType === "collaborate" ? "协作" : "公共"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8f959e" }}>创建时间</span>
                <span style={{ fontWeight: 500 }}>{new Date(bank.createdAt).toLocaleDateString("zh-CN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#8f959e" }}>更新时间</span>
                <span style={{ fontWeight: 500 }}>{new Date(bank.updatedAt).toLocaleDateString("zh-CN")}</span>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e6eb", padding: 24 }}>
            <Button size="lg" style={{ width: "100%", gap: 6, background: "#3370ff" }}>
              <Plus style={{ width: 16, height: 16 }} /> 加入我的题库
            </Button>
            <Button size="lg" variant="outline" style={{ width: "100%", gap: 6, marginTop: 12 }}>
              <Heart style={{ width: 16, height: 16 }} /> 收藏题库
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

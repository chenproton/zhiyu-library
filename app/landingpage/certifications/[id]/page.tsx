"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft, Award, Users, Briefcase, CheckCircle2, TrendingUp,
  BarChart3, Target, BookOpen, ChevronRight, Medal, Building2,
  FileText, Clock, Zap, Star, Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useData } from "@/components/providers/data-provider"

export default function CertificationDetailPage() {
  const params = useParams()
  const certId = params.id as string
  const { positionsList, jobAbilityResults, getPositionAbilityItems } = useData()

  const cert = positionsList.find((p) => p.id === certId)
  const abilityItems = cert ? (getPositionAbilityItems ? getPositionAbilityItems(certId) : []) : []
  const results = jobAbilityResults.filter((r) => r.positionId === certId)

  if (!cert) {
    return (
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
        <Link href="/landingpage/certifications">
          <Button variant="ghost" size="sm" style={{ gap: 6 }}>
            <ArrowLeft style={{ width: 16, height: 16 }} /> 返回列表
          </Button>
        </Link>
        <div style={{ textAlign: "center", padding: "80px 0", color: "#8f959e" }}>
          <Award style={{ width: 48, height: 48, margin: "0 auto 12px", opacity: 0.3 }} />
          <p>认证项目不存在</p>
        </div>
      </div>
    )
  }

  const statusMap: Record<string, { bg: string; color: string; label: string }> = {
    draft: { bg: "#f5f6f7", color: "#8f959e", label: "草稿" },
    not_submitted: { bg: "#fef3c7", color: "#d97706", label: "未提交" },
    reviewing: { bg: "#dbeafe", color: "#3b82f6", label: "审核中" },
    rejected: { bg: "#fee2e2", color: "#dc2626", label: "已驳回" },
    ready: { bg: "#e0e7ff", color: "#4f46e5", label: "待发布" },
    published: { bg: "#dcfce7", color: "#16a34a", label: "已发布" },
    none: { bg: "#f5f6f7", color: "#8f959e", label: "无规则" },
  }
  const st = statusMap[cert.ruleStatus] || statusMap.draft

  const totalPoints = abilityItems.reduce((sum, item) => sum + item.abilityPoints.length, 0)
  const avgRate = results.length > 0
    ? Math.round(results.reduce((s, r) => s + r.achievementRate, 0) / results.length)
    : 0

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/landingpage/certifications">
          <Button variant="ghost" size="sm" style={{ gap: 6 }}>
            <ArrowLeft style={{ width: 16, height: 16 }} /> 返回认证列表
          </Button>
        </Link>
      </div>

      {/* 头部 */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e6eb", overflow: "hidden", marginBottom: 24 }}>
        <div style={{ padding: "24px 32px", background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{cert.name}</h1>
            <p style={{ fontSize: 14, opacity: 0.9 }}>岗位代码：{cert.positionCode} · 专业方向：{cert.professionalDirection}</p>
          </div>
          <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500, background: "rgba(255,255,255,0.2)" }}>
            {st.label}
          </span>
        </div>
        <div style={{ padding: "24px 32px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {[
            { icon: <Target style={{ width: 18, height: 18 }} />, label: "能力点数量", value: `${totalPoints} 个` },
            { icon: <Users style={{ width: 18, height: 18 }} />, label: "已认证人数", value: `${results.length} 人` },
            { icon: <TrendingUp style={{ width: 18, height: 18 }} />, label: "平均达成率", value: `${avgRate}%` },
            { icon: <Clock style={{ width: 18, height: 18 }} />, label: "最近更新", value: cert.lastUpdated },
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

      {/* 能力要求 */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e6eb", padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Medal style={{ width: 18, height: 18, color: "#f59e0b" }} /> 能力要求
        </h3>
        {abilityItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#8f959e" }}>暂无能力要求数据</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {abilityItems.map((item) => (
              <div key={item.id}>
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #e5e6eb" }}>{item.name}</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {item.abilityPoints.map((point) => (
                    <div key={point.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: 12, background: "#f5f6f7", borderRadius: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{point.name}</div>
                        <div style={{ fontSize: 12, color: "#8f959e" }}>{point.description}</div>
                      </div>
                      <div style={{ width: 160 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                          <span style={{ color: "#8f959e" }}>掌握度要求</span>
                          <span style={{ fontWeight: 600 }}>{point.requiredLevel}</span>
                        </div>
                        <div style={{ width: "100%", height: 6, background: "#e5e6eb", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", background: "linear-gradient(90deg, #3370ff, #06b6d4)", borderRadius: 3, width: "60%" }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 相关任务 + 认证记录 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e6eb", padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <FileText style={{ width: 18, height: 18, color: "#3370ff" }} /> 测评任务
          </h3>
          {abilityItems.flatMap((i) => i.abilityPoints).slice(0, 5).map((point, idx) => (
            <div key={point.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderBottom: idx < 4 ? "1px solid #e5e6eb" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#f0f5ff", color: "#3370ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap style={{ width: 16, height: 16 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{point.name}</div>
                <div style={{ fontSize: 12, color: "#8f959e" }}>{point.relatedTasks.length} 个关联任务</div>
              </div>
              <ChevronRight style={{ width: 16, height: 16, color: "#8f959e" }} />
            </div>
          ))}
          {abilityItems.flatMap((i) => i.abilityPoints).length === 0 && (
            <div style={{ textAlign: "center", padding: 24, color: "#8f959e" }}>暂无测评任务</div>
          )}
        </div>

        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e6eb", padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Star style={{ width: 18, height: 18, color: "#f59e0b" }} /> 认证记录
          </h3>
          {results.length === 0 ? (
            <div style={{ textAlign: "center", padding: 24, color: "#8f959e" }}>暂无认证记录</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {results.slice(0, 5).map((r) => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#f5f6f7", borderRadius: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: r.achievementRate >= 80 ? "#dcfce7" : r.achievementRate >= 60 ? "#fef3c7" : "#fee2e2", color: r.achievementRate >= 80 ? "#16a34a" : r.achievementRate >= 60 ? "#d97706" : "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                    {r.achievementRate}%
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{r.studentName}</div>
                    <div style={{ fontSize: 12, color: "#8f959e" }}>{r.className} · {r.major}</div>
                  </div>
                  <Badge variant="outline" style={{ fontSize: 11 }}>{r.grade || "待评级"}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

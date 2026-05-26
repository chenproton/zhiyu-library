"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft, UserCircle, Target, BarChart3, FileText, Award,
  BookOpen, Briefcase, TrendingUp, Layers, Star, CheckCircle2,
  MapPin, Calendar, GraduationCap, Medal, ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/components/providers/data-provider"
import { PrdAnnotation } from "@/components/prd-annotation"
import { getAnnotation } from "@/lib/prd-annotations"

const domainColors: Record<string, string> = {
  industry: "#3b82f6",
  professional: "#10b981",
  skill: "#f59e0b",
  general: "#8b5cf6",
  quality: "#ec4899",
}

const domainLabels: Record<string, string> = {
  industry: "行业认知",
  professional: "专业技能",
  skill: "实操技能",
  general: "通用能力",
  quality: "综合素质",
}

export default function PortraitDetailPage() {
  const params = useParams()
  const portraitId = params.id as string
  const { studentAbilityPortraits } = useData()

  const portrait = studentAbilityPortraits.find((p) => p.id === portraitId)

  if (!portrait) {
    return (
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
        <Link href="/landingpage/portrait">
          <Button variant="ghost" size="sm" style={{ gap: 6 }}>
            <ArrowLeft style={{ width: 16, height: 16 }} /> 返回列表
          </Button>
        </Link>
        <div style={{ textAlign: "center", padding: "80px 0", color: "#8f959e" }}>
          <UserCircle style={{ width: 48, height: 48, margin: "0 auto 12px", opacity: 0.3 }} />
          <p>画像不存在</p>
        </div>
      </div>
    )
  }

  const gradeColors: Record<string, string> = {
    A: "#16a34a", B: "#3b82f6", C: "#f59e0b", D: "#f97316", E: "#dc2626",
  }

  return (
    <PrdAnnotation data={getAnnotation("lpo-page")}>
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/landingpage/portrait">
          <Button variant="ghost" size="sm" style={{ gap: 6 }}>
            <ArrowLeft style={{ width: 16, height: 16 }} /> 返回画像列表
          </Button>
        </Link>
      </div>

      {/* 头部 */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e6eb", overflow: "hidden", marginBottom: 24 }}>
        <div style={{ padding: "24px 32px", background: "linear-gradient(135deg, #3370ff, #7c3aed)", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UserCircle style={{ width: 32, height: 32 }} />
            </div>
            <div>
              <PrdAnnotation data={getAnnotation("lpo-name")}>
              <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{portrait.studentName}</h1>
              </PrdAnnotation>
              <PrdAnnotation data={getAnnotation("lpo-class")}>
              <p style={{ fontSize: 14, opacity: 0.9 }}>{portrait.className} · {portrait.majorName}</p>
              </PrdAnnotation>
            </div>
          </div>
          <PrdAnnotation data={getAnnotation("lpo-grade")}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{portrait.overallGrade}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>综合评级</div>
          </div>
          </PrdAnnotation>
        </div>
        <PrdAnnotation data={getAnnotation("lpo-stats")}>
        <div style={{ padding: "24px 32px", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 24 }}>
          {[
            { icon: <BookOpen style={{ width: 18, height: 18 }} />, label: "已完成课程", value: `${portrait.completedCourses} 门` },
            { icon: <Layers style={{ width: 18, height: 18 }} />, label: "已完成场景", value: `${portrait.completedScenes} 个` },
            { icon: <Star style={{ width: 18, height: 18 }} />, label: "总学分", value: `${portrait.totalCredits}` },
            { icon: <Award style={{ width: 18, height: 18 }} />, label: "档案数", value: `${portrait.archiveCount}` },
            { icon: <TrendingUp style={{ width: 18, height: 18 }} />, label: "出勤率", value: `${Math.round(portrait.attendanceRate * 100)}%` },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: "16px 0", background: "#f5f6f7", borderRadius: 8 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#3370ff", marginBottom: 6 }}>
                {item.icon} <span style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{item.value}</div>
            </div>
          ))}
        </div>
        </PrdAnnotation>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        {/* 能力维度 */}
        <PrdAnnotation data={getAnnotation("lpo-domains")}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e6eb", padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Target style={{ width: 18, height: 18, color: "#3370ff" }} /> 能力维度分析
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {portrait.domainScores.map((ds) => (
              <div key={ds.domain} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#f5f6f7", borderRadius: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: `${domainColors[ds.domain]}20`, color: domainColors[ds.domain], display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BarChart3 style={{ width: 18, height: 18 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{ds.domainLabel}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: domainColors[ds.domain] }}>{ds.score} 分 · {ds.level}</span>
                  </div>
                  <div style={{ width: "100%", height: 8, background: "#e5e6eb", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: domainColors[ds.domain], borderRadius: 4, width: `${Math.min(ds.score, 100)}%`, transition: "width 0.5s" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </PrdAnnotation>

        {/* 排名信息 */}
        <PrdAnnotation data={getAnnotation("lpo-rank")}>
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e6eb", padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Medal style={{ width: 18, height: 18, color: "#f59e0b" }} /> 排名信息
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "班级排名", rank: portrait.classRank, total: portrait.classTotal },
              { label: "专业排名", rank: portrait.majorRank, total: portrait.majorTotal },
              { label: "年级排名", rank: portrait.yearRank, total: portrait.yearTotal },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#f5f6f7", borderRadius: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "#8f959e" }}>共 {item.total} 人</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#3370ff" }}>#{item.rank}</div>
                  <div style={{ fontSize: 12, color: "#8f959e" }}>前 {Math.round((item.rank / item.total) * 100)}%</div>
                </div>
              </div>
            ))}
          </div>

          <PrdAnnotation data={getAnnotation("lpo-recommend")}>
          <h4 style={{ fontSize: 15, fontWeight: 600, margin: "20px 0 12px" }}>推荐岗位</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {portrait.recommendPositions.slice(0, 3).map((pos, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 10, background: "#f0f5ff", borderRadius: 8 }}>
                <Briefcase style={{ width: 16, height: 16, color: "#3370ff" }} />
                <span style={{ flex: 1, fontSize: 14 }}>{pos.positionName}</span>
                <Badge variant="outline" style={{ fontSize: 11, color: "#3370ff", borderColor: "#3370ff" }}>匹配度 {pos.matchRate}%</Badge>
              </div>
            ))}
          </div>
          </PrdAnnotation>
        </div>
        </PrdAnnotation>
      </div>

      {/* 课程成绩 */}
      <PrdAnnotation data={getAnnotation("lpo-courses")}>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e6eb", padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <BookOpen style={{ width: 18, height: 18, color: "#3370ff" }} /> 课程成绩
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {portrait.courseRecords.map((cr, i) => (
            <div key={i} style={{ padding: 16, background: "#f5f6f7", borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#8f959e", marginBottom: 6 }}>{cr.courseName}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: gradeColors[cr.grade] || "#1f2329" }}>{cr.grade}</div>
              <div style={{ fontSize: 12, color: "#8f959e", marginTop: 4 }}>{cr.finalScore} 分 · {cr.credit} 学分</div>
            </div>
          ))}
        </div>
      </div>

      </PrdAnnotation>

      {/* 成长趋势 */}
      <PrdAnnotation data={getAnnotation("lpo-trend")}>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e6eb", padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <TrendingUp style={{ width: 18, height: 18, color: "#3370ff" }} /> 成长趋势
        </h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 200, padding: "0 16px" }}>
          {portrait.domainScores.map((ds) => (
            <div key={ds.domain} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{ds.score}</div>
              <div style={{ width: "100%", borderRadius: "4px 4px 0 0", background: domainColors[ds.domain], height: `${Math.max(ds.score * 1.5, 20)}px`, transition: "height 0.5s", opacity: 0.8 }} />
              <div style={{ fontSize: 11, color: "#8f959e", textAlign: "center" }}>{ds.domainLabel}</div>
            </div>
          ))}
        </div>
      </div>
      </PrdAnnotation>
    </div>
    </PrdAnnotation>
  )
}

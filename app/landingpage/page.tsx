"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import {
  Clock, Calendar, FileText, BookOpen, Users, Award,
  BarChart3, Target, TrendingUp, Layers, Star, CheckCircle2,
  MapPin, Zap, Eye, Search,
} from "lucide-react"
import { useData } from "@/components/providers/data-provider"

function SectionHeader({ title, subtitle, moreHref = "#" }: { title: string; subtitle?: string; moreHref?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <h2 style={{ fontSize: 20, fontWeight: "bold", color: "#1e293b", position: "relative", paddingLeft: 12 }}>
          <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 4, height: 20, background: "linear-gradient(180deg, #2563eb, #3b82f6)", borderRadius: 2 }} />
          {title}
        </h2>
        {subtitle && <span style={{ color: "#94a3b8", fontSize: 13 }}>{subtitle}</span>}
      </div>
      <Link href={moreHref} style={{ color: "#2563eb", fontSize: 13, textDecoration: "none" }}
        onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline" }}
        onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none" }}>
        查看全部 ›
      </Link>
    </div>
  )
}

const examStatusMap: Record<string, { bg: string; color: string; label: string }> = {
  published: { bg: "#dcfce7", color: "#16a34a", label: "进行中" },
  draft: { bg: "#f1f5f9", color: "#64748b", label: "草稿" },
  pending: { bg: "#dbeafe", color: "#2563eb", label: "审核中" },
}

const certStatusMap: Record<string, string> = {
  published: "进行中", ready: "待发布", reviewing: "审核中",
  rejected: "已驳回", draft: "草稿", none: "无规则",
}

export default function LandingHomePage() {
  const {
    exams, questionBanks, evaluationCategories, evaluationMethods,
    graduationProjectTopics, studentAbilityPortraits, positionsList,
  } = useData()

  const [activeMethodTab, setActiveMethodTab] = useState("全部")
  const [activeResourceTab, setActiveResourceTab] = useState("题库")
  const [portraitMajor, setPortraitMajor] = useState("全部")
  const [portraitPosition, setPortraitPosition] = useState("全部")

  /* ── 统计数据 ── */
  const stats = useMemo(() => [
    { num: evaluationMethods.length, label: "测评方式" },
    { num: questionBanks.length, label: "题库数量" },
    { num: exams.length, label: "试卷数量" },
    { num: exams.filter((e) => e.status === "published").length, label: "考试场次" },
    { num: positionsList.length, label: "岗位认证项目" },
    { num: graduationProjectTopics.length, label: "毕业选题" },
  ], [evaluationMethods, questionBanks, exams, positionsList, graduationProjectTopics])

  /* ── 考试中心 ── */
  const publishedExams = exams.filter((e) => e.status === "published").slice(0, 4)

  /* ── 测评方式 ── */
  const methodTabs = ["全部", ...evaluationCategories.map((c) => c.name)]
  const filteredMethods = activeMethodTab === "全部"
    ? evaluationMethods.filter((m) => m.enabled).slice(0, 4)
    : evaluationMethods.filter((m) => {
        const cat = evaluationCategories.find((c) => c.id === m.categoryId)
        return m.enabled && cat?.name === activeMethodTab
      }).slice(0, 4)

  /* ── 测评资源 ── */
  const resourceBanks = questionBanks.filter((b) => b.status === "published").slice(0, 3)
  const resourceExams = exams.filter((e) => e.status === "published").slice(0, 3)

  /* ── 毕业设计 ── */
  const publishedTopics = graduationProjectTopics.filter((t) => t.status === "published").slice(0, 6)

  /* ── 画像 ── */
  const topPortraits = studentAbilityPortraits.slice().sort((a, b) => b.totalCredits - a.totalCredits).slice(0, 8)
  const majors = ["全部", ...Array.from(new Set(studentAbilityPortraits.map((p) => p.majorName)))]
  const positions = ["全部", ...Array.from(new Set(positionsList.map((p) => p.name)))]

  const filteredPortraits = topPortraits.filter((p) => {
    const matchMajor = portraitMajor === "全部" || p.majorName === portraitMajor
    const matchPos = portraitPosition === "全部" || p.positionName === portraitPosition
    return matchMajor && matchPos
  })

  return (
    <div>
      {/* ═══ Hero Banner ═══ */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)",
        color: "#fff", padding: "60px 20px 50px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, background: "rgba(255,255,255,0.04)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -60, left: "5%", width: 200, height: 200, background: "rgba(255,255,255,0.04)", borderRadius: "50%" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h1 style={{ fontSize: 40, fontWeight: "bold", marginBottom: 12, letterSpacing: 1 }}>能力测评认定平台</h1>
          <p style={{ fontSize: 15, opacity: 0.85, marginBottom: 28 }}>集测评资源、岗位能力认定、毕业设计、学生画像于一体的一站式能力成长平台</p>
          <div style={{
            background: "#fff", borderRadius: 50, padding: "5px 5px 5px 24px",
            display: "flex", alignItems: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          }}>
            <Search style={{ width: 18, height: 18, color: "#94a3b8", marginRight: 10 }} />
            <input type="text" placeholder="搜索题库、试卷、考试、岗位能力认证、毕业设计、学生画像"
              style={{ flex: 1, border: "none", outline: "none", fontSize: 14, padding: "12px 0", color: "#333", background: "transparent" }} />
            <button style={{
              background: "linear-gradient(135deg, #2563eb, #3b82f6)", color: "#fff", border: "none",
              padding: "11px 32px", borderRadius: 50, cursor: "pointer", fontSize: 14, fontWeight: 500,
            }}>搜索</button>
          </div>
        </div>
      </div>

      {/* ═══ 主内容 ═══ */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 20px 0" }}>

        {/* ── 数据看板 ── */}
        <section style={{ marginBottom: 50 }}>
          <div style={{
            background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", padding: 24,
            display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 20,
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: "center", borderRight: i < stats.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                <div style={{ fontSize: 28, fontWeight: "bold", color: "#2563eb", lineHeight: 1.2 }}>{s.num}</div>
                <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 考试中心 ── */}
        <section style={{ marginBottom: 50 }}>
          <SectionHeader title="考试中心" subtitle="所有已发布的考试" moreHref="/landingpage/exams" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {publishedExams.map((exam) => {
              const st = examStatusMap[exam.status] || examStatusMap.draft
              return (
                <Link key={exam.id} href={`/landingpage/exams/${exam.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{
                    background: "#fff", borderRadius: 10, padding: 20,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "all 0.25s",
                    cursor: "pointer", borderTop: "3px solid #2563eb",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)" }}>
                    <span style={{
                      display: "inline-block", padding: "3px 10px", background: st.bg, color: st.color,
                      borderRadius: 12, fontSize: 12, marginBottom: 10, fontWeight: 500,
                    }}>{st.label}</span>
                    <h3 style={{ fontSize: 15, marginBottom: 10, color: "#1e293b", fontWeight: 600, lineHeight: 1.4 }}>{exam.name}</h3>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock style={{ width: 12, height: 12 }} /> {exam.duration}分钟 · {exam.questions.length}题
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                      <Calendar style={{ width: 12, height: 12 }} /> {new Date(exam.createdAt).toLocaleDateString("zh-CN")}
                    </div>
                    <span style={{
                      display: "block", textAlign: "center", background: "#2563eb", color: "#fff",
                      padding: "8px 0", borderRadius: 6, fontSize: 13, marginTop: 12, fontWeight: 500,
                    }}>进入答题</span>
                  </div>
                </Link>
              )
            })}
            {publishedExams.length === 0 && (
              <div style={{ gridColumn: "span 4", textAlign: "center", padding: 40, color: "#94a3b8", background: "#fff", borderRadius: 10 }}>暂无已发布考试</div>
            )}
          </div>
        </section>

        {/* ── 岗位能力认证 ── */}
        <section style={{ marginBottom: 50 }}>
          <SectionHeader title="岗位能力认证项目库" moreHref="/landingpage/certifications" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {positionsList.slice(0, 3).map((pos, i) => {
              const covers = [
                "linear-gradient(135deg, #667eea, #764ba2)",
                "linear-gradient(135deg, #f093fb, #f5576c)",
                "linear-gradient(135deg, #4facfe, #00f2fe)",
              ]
              const st = certStatusMap[pos.ruleStatus] || "草稿"
              const isEnded = pos.ruleStatus === "none" || pos.ruleStatus === "rejected"
              return (
                <Link key={pos.id} href={`/landingpage/certifications/${pos.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{
                    background: "#fff", borderRadius: 10, overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "all 0.25s", cursor: "pointer",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)" }}>
                    <div style={{
                      height: 140, background: covers[i % 3], position: "relative",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: 18, fontWeight: "bold",
                    }}>
                      {pos.name}
                      <span style={{
                        position: "absolute", top: 10, right: 10,
                        background: "rgba(255,255,255,0.9)", color: isEnded ? "#94a3b8" : "#16a34a",
                        padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 500,
                      }}>{st}</span>
                    </div>
                    <div style={{ padding: 18 }}>
                      <h3 style={{ fontSize: 15, marginBottom: 10, color: "#1e293b", fontWeight: 600 }}>{pos.name}认证</h3>
                      <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.8 }}>
                        创建人：{pos.updatedBy} &nbsp; 更新：{pos.lastUpdated}<br />
                        专业方向：{pos.professionalDirection}
                      </div>
                      <div style={{
                        display: "flex", justifyContent: "space-between", marginTop: 12,
                        paddingTop: 12, borderTop: "1px dashed #f1f5f9",
                      }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 18, fontWeight: "bold", color: "#2563eb" }}>{pos.relatedAbilityCount}</div>
                          <div style={{ fontSize: 12, color: "#94a3b8" }}>能力项</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 18, fontWeight: "bold", color: "#2563eb" }}>{pos.ruleStatus === "published" ? "已发布" : "未发布"}</div>
                          <div style={{ fontSize: 12, color: "#94a3b8" }}>规则状态</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── 测评方式 ── */}
        <section style={{ marginBottom: 50 }}>
          <SectionHeader title="测评方式库" moreHref="/evaluation-methods" />
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            {methodTabs.map((tab) => (
              <button key={tab} onClick={() => setActiveMethodTab(tab)} style={{
                padding: "7px 16px", background: activeMethodTab === tab ? "#2563eb" : "#fff",
                color: activeMethodTab === tab ? "#fff" : "#64748b", borderRadius: 20, fontSize: 13,
                cursor: "pointer", border: activeMethodTab === tab ? "1px solid #2563eb" : "1px solid #e2e8f0",
                transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6, fontWeight: 500,
              }}>
                {tab}
                <span style={{
                  background: activeMethodTab === tab ? "rgba(255,255,255,0.25)" : "#f1f5f9",
                  color: activeMethodTab === tab ? "#fff" : "#64748b",
                  padding: "1px 7px", borderRadius: 10, fontSize: 11,
                }}>
                  {tab === "全部" ? evaluationMethods.filter((m) => m.enabled).length :
                    evaluationMethods.filter((m) => {
                      const cat = evaluationCategories.find((c) => c.id === m.categoryId)
                      return m.enabled && cat?.name === tab
                    }).length}
                </span>
              </button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {filteredMethods.map((method, i) => {
              const covers = [
                "linear-gradient(135deg, #a8edea, #fed6e3)",
                "linear-gradient(135deg, #ffecd2, #fcb69f)",
                "linear-gradient(135deg, #84fab0, #8fd3f4)",
                "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
              ]
              const icons = ["📝", "💻", "🎤", "📁"]
              return (
                <Link key={method.id} href={`/evaluation-methods/student/${method.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{
                    background: "#fff", borderRadius: 10, overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "all 0.25s", cursor: "pointer",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)" }}>
                    <div style={{
                      height: 110, background: covers[i % 4],
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36,
                    }}>{icons[i % 4]}</div>
                    <div style={{ padding: 16 }}>
                      <h3 style={{ fontSize: 14, marginBottom: 8, color: "#1e293b", fontWeight: 600 }}>{method.name}</h3>
                      <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, marginBottom: 12, height: 36, overflow: "hidden" }}>
                        {method.description || "暂无说明"}
                      </p>
                      <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 500 }}>查看使用说明 ›</span>
                    </div>
                  </div>
                </Link>
              )
            })}
            {filteredMethods.length === 0 && (
              <div style={{ gridColumn: "span 4", textAlign: "center", padding: 40, color: "#94a3b8", background: "#fff", borderRadius: 10 }}>暂无测评方式</div>
            )}
          </div>
        </section>

        {/* ── 测评资源 ── */}
        <section style={{ marginBottom: 50 }}>
          <SectionHeader title="测评资源库" moreHref="/landingpage/resources" />
          <div style={{ display: "flex", gap: 30, borderBottom: "1px solid #e2e8f0", marginBottom: 20 }}>
            {["题库", "试卷库"].map((tab) => (
              <button key={tab} onClick={() => setActiveResourceTab(tab)} style={{
                padding: "10px 0", fontSize: 15, cursor: "pointer", position: "relative",
                color: activeResourceTab === tab ? "#2563eb" : "#64748b",
                fontWeight: activeResourceTab === tab ? "bold" : "normal",
                border: "none", background: "none",
              }}>
                {tab}
                {activeResourceTab === tab && (
                  <span style={{ position: "absolute", bottom: -1, left: 0, right: 0, height: 2, background: "#2563eb" }} />
                )}
              </button>
            ))}
          </div>

          {activeResourceTab === "题库" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {resourceBanks.map((bank, i) => {
                const covers = [
                  "linear-gradient(135deg, #fa709a, #fee140)",
                  "linear-gradient(135deg, #30cfd0, #330867)",
                  "linear-gradient(135deg, #a8c0ff, #3f2b96)",
                ]
                return (
                  <Link key={bank.id} href={`/landingpage/resources/banks/${bank.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{
                      background: "#fff", borderRadius: 10, overflow: "hidden",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "all 0.25s", cursor: "pointer",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)" }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)" }}>
                      <div style={{
                        height: 100, background: covers[i % 3],
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: 20, fontWeight: "bold",
                      }}>{bank.name.slice(0, 6)}</div>
                      <div style={{ padding: 16 }}>
                        <h3 style={{ fontSize: 15, marginBottom: 10, color: "#1e293b", fontWeight: 600 }}>{bank.name}</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12, color: "#64748b" }}>
                          <span>题目数量：<strong style={{ color: "#2563eb" }}>{bank.questionCount}</strong></span>
                          <span>题型：选择/编程</span>
                          <span>创建人：{bank.creatorId || "系统"}</span>
                          <span>共建：{bank.collaboratorIds?.length || 0}人</span>
                          <span>创建：{new Date(bank.createdAt).toLocaleDateString("zh-CN")}</span>
                          <span>更新：{new Date(bank.updatedAt).toLocaleDateString("zh-CN")}</span>
                          <span>版本：{bank.version}</span>
                          <span>编码：{bank.id.slice(0, 6).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
              {resourceBanks.length === 0 && (
                <div style={{ gridColumn: "span 3", textAlign: "center", padding: 40, color: "#94a3b8", background: "#fff", borderRadius: 10 }}>暂无题库</div>
              )}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {resourceExams.map((exam, i) => {
                const covers = [
                  "linear-gradient(135deg, #fa709a, #fee140)",
                  "linear-gradient(135deg, #30cfd0, #330867)",
                  "linear-gradient(135deg, #a8c0ff, #3f2b96)",
                ]
                return (
                  <Link key={exam.id} href={`/landingpage/resources/exams/${exam.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{
                      background: "#fff", borderRadius: 10, overflow: "hidden",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "all 0.25s", cursor: "pointer",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)" }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)" }}>
                      <div style={{
                        height: 100, background: covers[i % 3],
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: 20, fontWeight: "bold",
                      }}>{exam.name.slice(0, 6)}</div>
                      <div style={{ padding: 16 }}>
                        <h3 style={{ fontSize: 15, marginBottom: 10, color: "#1e293b", fontWeight: 600 }}>{exam.name}</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12, color: "#64748b" }}>
                          <span>时长：<strong style={{ color: "#2563eb" }}>{exam.duration}分钟</strong></span>
                          <span>题数：{exam.questions.length}题</span>
                          <span>总分：{exam.questions.reduce((s, q) => s + q.score, 0)}分</span>
                          <span>版本：{exam.version}</span>
                          <span>创建：{new Date(exam.createdAt).toLocaleDateString("zh-CN")}</span>
                          <span>更新：{new Date(exam.updatedAt).toLocaleDateString("zh-CN")}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
              {resourceExams.length === 0 && (
                <div style={{ gridColumn: "span 3", textAlign: "center", padding: 40, color: "#94a3b8", background: "#fff", borderRadius: 10 }}>暂无试卷</div>
              )}
            </div>
          )}
        </section>

        {/* ── 毕业设计 ── */}
        <section style={{ marginBottom: 50 }}>
          <SectionHeader title="毕业设计选题中心" subtitle="去选题中心" moreHref="/landingpage/graduation" />
          <div style={{ background: "#fff", padding: "15px 20px", borderRadius: 10, marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            {[
              { label: "院系：", tags: ["全部", "计算机学院", "软件学院", "信息学院", "大数据学院"] },
              { label: "专业：", tags: ["全部", "计算机科学与技术", "软件工程", "网络工程", "数据科学"] },
              { label: "岗位：", tags: ["全部", "Java开发", "前端开发", "算法工程师", "运维工程师"] },
              { label: "标签：", tags: ["全部", "热门", "创新", "实战", "前沿"] },
            ].map((row, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: idx < 3 ? "1px dashed #f1f5f9" : "none", fontSize: 13 }}>
                <span style={{ color: "#94a3b8", width: 60, flexShrink: 0 }}>{row.label}</span>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {row.tags.map((tag) => (
                    <span key={tag} style={{
                      padding: "4px 12px", borderRadius: 4, cursor: "pointer", color: "#64748b",
                      transition: "all 0.3s",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.color = "#2563eb" }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {publishedTopics.map((topic) => (
              <Link key={topic.id} href={`/landingpage/graduation/${topic.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{
                  background: "#fff", borderRadius: 10, padding: 18,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "all 0.25s",
                  cursor: "pointer", borderLeft: "4px solid #3b82f6",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <h3 style={{ fontSize: 14, marginBottom: 10, lineHeight: 1.5, color: "#1e293b", fontWeight: 600 }}>{topic.name}</h3>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>
                    📚 {topic.positionName} · 👨‍🏫 {topic.advisorName} · 🏷️ {topic.source === "scene" ? "校内" : "企业"}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: "1px dashed #f1f5f9" }}>
                    <span style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
                      <Eye style={{ width: 12, height: 12 }} /> {topic.appliedCount}次浏览
                    </span>
                    <button style={{
                      background: "#2563eb", color: "#fff", padding: "6px 14px",
                      borderRadius: 4, fontSize: 12, cursor: "pointer", border: "none",
                    }}>加入毕设选题</button>
                  </div>
                </div>
              </Link>
            ))}
            {publishedTopics.length === 0 && (
              <div style={{ gridColumn: "span 3", textAlign: "center", padding: 40, color: "#94a3b8", background: "#fff", borderRadius: 10 }}>暂无选题</div>
            )}
          </div>
        </section>

        {/* ── 优秀学生画像 ── */}
        <section style={{ marginBottom: 50 }}>
          <SectionHeader title="优秀学生能力画像" subtitle="实时能力排名榜单" moreHref="/landingpage/portrait" />
          <div style={{ background: "#fff", borderRadius: 10, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            {/* 筛选 */}
            <div style={{ display: "flex", alignItems: "center", gap: 30, marginBottom: 16, borderBottom: "1px solid #f1f5f9", paddingBottom: 14, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>专业：</span>
                {majors.slice(0, 5).map((m) => (
                  <span key={m} onClick={() => setPortraitMajor(m)} style={{
                    padding: "4px 12px", borderRadius: 12, fontSize: 13, cursor: "pointer",
                    color: portraitMajor === m ? "#fff" : "#64748b",
                    background: portraitMajor === m ? "#2563eb" : "#f8fafc",
                    transition: "all 0.2s", fontWeight: 500,
                  }}>{m}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>岗位：</span>
              {positions.slice(0, 6).map((p) => (
                <span key={p} onClick={() => setPortraitPosition(p)} style={{
                  padding: "4px 12px", borderRadius: 12, fontSize: 13, cursor: "pointer",
                  color: portraitPosition === p ? "#fff" : "#64748b",
                  background: portraitPosition === p ? "#2563eb" : "#f8fafc",
                  transition: "all 0.2s", fontWeight: 500,
                }}>{p}</span>
              ))}
            </div>

            {/* 排名 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
              {filteredPortraits.map((p, i) => {
                const isTop = i < 3
                const noBg = isTop
                  ? i === 0 ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                    : i === 1 ? "linear-gradient(135deg, #cbd5e1, #94a3b8)"
                      : "linear-gradient(135deg, #fdba74, #f97316)"
                  : "#e2e8f0"
                const noColor = isTop ? "#fff" : "#94a3b8"
                const score = 98.5 - i * 1.6
                return (
                  <Link key={p.id} href={`/landingpage/portrait/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{
                      display: "flex", alignItems: "center", padding: 14,
                      background: "#fafbfc", borderRadius: 8, transition: "all 0.25s",
                      cursor: "pointer", border: "1px solid #f1f5f9",
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.transform = "translateX(3px)" }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#fafbfc"; e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.transform = "none" }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: "50%", background: noBg, color: noColor,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: "bold", fontSize: 13, marginRight: 14, flexShrink: 0,
                      }}>{i + 1}</div>
                      <div style={{
                        width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, marginRight: 14, flexShrink: 0,
                      }}>{i % 2 === 0 ? "👨‍🎓" : "👩‍🎓"}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3, display: "flex", alignItems: "center", gap: 6, color: "#1e293b" }}>
                          {p.studentName}
                          <span style={{ fontSize: 11, background: "#dbeafe", color: "#2563eb", padding: "1px 6px", borderRadius: 4, fontWeight: 500 }}>{p.majorName}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#94a3b8" }}>
                          {p.positionName} · 已认证 {p.completedScenes} 项岗位能力
                        </div>
                        <div style={{ height: 4, background: "#e2e8f0", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                          <div style={{ height: "100%", background: "linear-gradient(90deg, #3b82f6, #2563eb)", borderRadius: 2, width: `${Math.min(score, 100)}%` }} />
                        </div>
                      </div>
                      <div style={{ textAlign: "right", marginLeft: 10, flexShrink: 0 }}>
                        <div style={{ fontSize: 20, fontWeight: "bold", color: "#2563eb", lineHeight: 1 }}>{score.toFixed(1)}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>综合分</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
              {filteredPortraits.length === 0 && (
                <div style={{ gridColumn: "span 2", textAlign: "center", padding: 40, color: "#94a3b8" }}>暂无画像数据</div>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

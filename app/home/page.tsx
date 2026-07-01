"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import {
  Video, FileText, Table, Image, LinkIcon, Music, MapPin, Cpu,
  Monitor, FlaskConical, Ellipsis, Heart, Eye, User, Building2,
  Search, Clock, Sparkles, TrendingUp, RotateCcw, Download,
  Flame, ArrowRight, Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useData } from "@/components/providers/data-provider"
import { RESOURCE_TYPE_LABELS, COLLEGES } from "@/lib/types"
import { getResourceTypeStats } from "@/lib/mock-data"
import type { ResourceType, Resource } from "@/lib/types"

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: "bold", color: "#1e293b", position: "relative", paddingLeft: 12 }}>
        <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 4, height: 20, background: "linear-gradient(180deg, #2563eb, #3b82f6)", borderRadius: 2 }} />
        {title}
      </h2>
      {subtitle && <span style={{ color: "#94a3b8", fontSize: 13 }}>{subtitle}</span>}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: 12, fontSize: 13 }}>
      <span style={{ color: "#94a3b8", minWidth: 70, flexShrink: 0 }}>{label}</span>
      <span style={{ color: "#334155" }}>{value}</span>
    </div>
  )
}

const TYPE_EMOJI: Record<ResourceType, string> = {
  video: "🎬", document: "📄", spreadsheet: "📊", image: "🖼️",
  link: "🔗", audio: "🎵", venue: "📍", equipment: "🔧",
  software: "💻", simulation: "🧪", other: "📦",
}

const TYPE_GRADIENTS: Record<ResourceType, string> = {
  video: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
  document: "linear-gradient(135deg, #ffedd5, #fed7aa)",
  spreadsheet: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
  image: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
  link: "linear-gradient(135deg, #ecfeff, #cffafe)",
  audio: "linear-gradient(135deg, #fce7f3, #fbcfe8)",
  venue: "linear-gradient(135deg, #fee2e2, #fecaca)",
  equipment: "linear-gradient(135deg, #e2e8f0, #cbd5e1)",
  software: "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
  simulation: "linear-gradient(135deg, #ccfbf1, #99f6e4)",
  other: "linear-gradient(135deg, #e7e5e4, #d6d3d1)",
}

const TYPE_COLORS: Record<ResourceType, string> = {
  video: "#3b82f6",
  document: "#f97316",
  spreadsheet: "#22c55e",
  image: "#a855f7",
  link: "#06b6d4",
  audio: "#ec4899",
  venue: "#ef4444",
  equipment: "#64748b",
  software: "#6366f1",
  simulation: "#14b8a6",
  other: "#78716c",
}

const TYPE_ICONS: Record<ResourceType, React.ReactNode> = {
  video: <Video className="size-5" />,
  document: <FileText className="size-5" />,
  spreadsheet: <Table className="size-5" />,
  image: <Image className="size-5" />,
  link: <LinkIcon className="size-5" />,
  audio: <Music className="size-5" />,
  venue: <MapPin className="size-5" />,
  equipment: <Cpu className="size-5" />,
  software: <Monitor className="size-5" />,
  simulation: <FlaskConical className="size-5" />,
  other: <Ellipsis className="size-5" />,
}

const ALL_TYPES: ResourceType[] = ["video", "document", "spreadsheet", "image", "link", "audio", "venue", "equipment", "software", "simulation", "other"]
const ALL_COLLEGES = ["全部", ...COLLEGES]

const TIME_RANGES = [
  { value: "all", label: "全部时间" },
  { value: "week", label: "近一周" },
  { value: "month", label: "近一月" },
  { value: "year", label: "近一年" },
]

export default function HomePage() {
  const {
    resources, isFavorite, toggleFavorite, incrementUsage,
    getApprovedResources, getFavorites,
  } = useData()

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<ResourceType | "全部">("全部")
  const [collegeFilter, setCollegeFilter] = useState("全部")
  const [timeFilter, setTimeFilter] = useState("all")
  const [hotTab, setHotTab] = useState<"hot" | "new">("hot")
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailResource, setDetailResource] = useState<Resource | null>(null)

  const stats = useMemo(() => getResourceTypeStats(resources), [resources])
  const approvedResources = useMemo(() => getApprovedResources(), [getApprovedResources])
  const favorites = useMemo(() => getFavorites(), [getFavorites])
  const totalUsage = useMemo(() => approvedResources.reduce((s, r) => s + r.usageCount, 0), [approvedResources])

  const sortedByUsage  = useMemo(() => [...approvedResources].sort((a, b) => b.usageCount - a.usageCount).slice(0, 4), [approvedResources])
  const sortedByNewest = useMemo(() => [...approvedResources].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 4), [approvedResources])
  const hotNewResources = hotTab === "hot" ? sortedByUsage : sortedByNewest

  const filteredResources = useMemo(() => {
    let list = approvedResources
    if (typeFilter !== "全部") list = list.filter((r) => r.type === typeFilter)
    if (collegeFilter !== "全部") list = list.filter((r) => r.department === collegeFilter)
    if (timeFilter !== "all") {
      const now = Date.now()
      const ms = timeFilter === "week" ? 7 * 86400000 : timeFilter === "month" ? 30 * 86400000 : 365 * 86400000
      list = list.filter((r) => now - r.createdAt.getTime() < ms)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q)) || r.uploaderName.toLowerCase().includes(q))
    }
    return list
  }, [approvedResources, typeFilter, collegeFilter, timeFilter, search])

  const filterCount = (typeFilter !== "全部" ? 1 : 0) + (collegeFilter !== "全部" ? 1 : 0) + (timeFilter !== "all" ? 1 : 0)

  const handleCardClick = (resource: Resource) => {
    setDetailResource(resource)
    setDetailOpen(true)
    incrementUsage(resource.id)
  }

  return (
    <div>
      {/* ═══ Hero Banner ═══ */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)",
        color: "#fff", padding: "60px 20px 50px", textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, background: "rgba(255,255,255,0.04)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -60, left: "5%", width: 200, height: 200, background: "rgba(255,255,255,0.04)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: "30%", right: "15%", width: 100, height: 100, background: "rgba(255,255,255,0.03)", borderRadius: "50%" }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h1 style={{ fontSize: 40, fontWeight: "bold", marginBottom: 12, letterSpacing: 1 }}>教学资源共享平台</h1>
          <p style={{ fontSize: 15, opacity: 0.85, marginBottom: 28 }}>
            汇聚视频、文档、软件、仿真等 11 类教学资源，为教师提供一站式资源共享服务
          </p>
          <div style={{
            background: "#fff", borderRadius: 50, padding: "5px 5px 5px 24px",
            display: "flex", alignItems: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.15)", marginBottom: 28,
          }}>
            <Search style={{ width: 18, height: 18, color: "#94a3b8", marginRight: 10, flexShrink: 0 }} />
            <input type="text" placeholder="搜索视频、文档、软件、仿真等教学资源..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, border: "none", outline: "none", fontSize: 14, padding: "12px 0", color: "#333", background: "transparent" }} />
            <button onClick={() => document.getElementById("resource-list")?.scrollIntoView({ behavior: "smooth" })}
              style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)", color: "#fff", border: "none", padding: "11px 32px", borderRadius: 50, cursor: "pointer", fontSize: 14, fontWeight: 500, whiteSpace: "nowrap" }}>
              搜索
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 48 }}>
            {[
              { num: stats.total, label: "资源总量" },
              { num: totalUsage.toLocaleString(), label: "累计使用" },
              { num: COLLEGES.length, label: "覆盖院系" },
              { num: favorites.length, label: "我的收藏" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: "bold", lineHeight: 1.2 }}>{s.num}</div>
                <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 20px 0" }}>

        {/* ── 数据看板 ── */}
        <section style={{ marginBottom: 50 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <h2 style={{ fontSize: 20, fontWeight: "bold", color: "#1e293b", position: "relative", paddingLeft: 12 }}>
                <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 4, height: 20, background: "linear-gradient(180deg, #2563eb, #3b82f6)", borderRadius: 2 }} />
                数据看板
              </h2>
              <span style={{ color: "#94a3b8", fontSize: 13 }}>点击分类可快速筛选</span>
            </div>
            <span style={{ fontSize: 13, color: "#64748b" }}>
              共计 <strong style={{ color: "#2563eb" }}>{stats.total}</strong> 个资源
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            {ALL_TYPES.map((type) => {
              const count = stats[type]
              const active = typeFilter === type
              return (
                <button key={type}
                  onClick={() => {
                    setTypeFilter(active ? "全部" : type)
                    document.getElementById("resource-list")?.scrollIntoView({ behavior: "smooth" })
                  }}
                  style={{
                    background: TYPE_GRADIENTS[type],
                    border: active ? `2px solid ${TYPE_COLORS[type]}` : "2px solid transparent",
                    borderRadius: 14, padding: "14px 16px", cursor: "pointer",
                    transition: "all 0.2s ease",
                    position: "relative", overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = `0 6px 18px ${TYPE_COLORS[type]}1a`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, justifyContent: "center" }}>
                    <span style={{ color: TYPE_COLORS[type], display: "flex" }}>{TYPE_ICONS[type]}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>{RESOURCE_TYPE_LABELS[type]}</span>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: TYPE_COLORS[type], lineHeight: 1, textAlign: "center" as const }}>
                    {count}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── 热门/最新 资源 ── */}
        <section style={{ marginBottom: 50 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: "bold", color: "#1e293b", position: "relative", paddingLeft: 12 }}>
              <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 4, height: 20, background: "linear-gradient(180deg, #2563eb, #3b82f6)", borderRadius: 2 }} />
              {hotTab === "hot" ? "热门资源" : "最新资源"}
            </h2>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => setHotTab("hot")} style={{ padding: "6px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer", border: "none", fontWeight: 500, background: hotTab === "hot" ? "#2563eb" : "#f1f5f9", color: hotTab === "hot" ? "#fff" : "#64748b", transition: "all 0.2s" }}>
                <Flame style={{ width: 14, height: 14, display: "inline", marginRight: 4, verticalAlign: "middle" }} />热门
              </button>
              <button onClick={() => setHotTab("new")} style={{ padding: "6px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer", border: "none", fontWeight: 500, background: hotTab === "new" ? "#2563eb" : "#f1f5f9", color: hotTab === "new" ? "#fff" : "#64748b", transition: "all 0.2s" }}>
                <Sparkles style={{ width: 14, height: 14, display: "inline", marginRight: 4, verticalAlign: "middle" }} />最新
              </button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {hotNewResources.map((resource) => (
              <button key={resource.id} onClick={() => handleCardClick(resource)}
                style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "all 0.25s", cursor: "pointer", border: "none", textAlign: "left" as const, width: "100%", display: "block" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)" }}
              >
                <div style={{ height: 90, background: TYPE_GRADIENTS[resource.type], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, position: "relative" }}>
                  {TYPE_EMOJI[resource.type]}
                  {hotTab === "hot" && resource.usageCount > 2000 && (
                    <span style={{ position: "absolute", top: 8, right: 8, background: "#ef4444", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>HOT</span>
                  )}
                </div>
                <div style={{ padding: 14 }}>
                  <h3 style={{ fontSize: 14, marginBottom: 8, lineHeight: 1.4, color: "#1e293b", fontWeight: 600 }}>{resource.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "#64748b" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Eye style={{ width: 12, height: 12 }} /> {resource.usageCount}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Heart style={{ width: 12, height: 12 }} /> {resource.favoriteCount}</span>
                    <span style={{ marginLeft: "auto", color: TYPE_COLORS[resource.type], fontWeight: 500 }}>{RESOURCE_TYPE_LABELS[resource.type]}</span>
                  </div>
                </div>
              </button>
            ))}
            {hotNewResources.length === 0 && (
              <div style={{ gridColumn: "span 4", textAlign: "center", padding: 40, color: "#94a3b8", background: "#fff", borderRadius: 10 }}>暂无资源</div>
            )}
          </div>
        </section>

        {/* ── 筛选条件 ── */}
        <section style={{ marginBottom: 50 }}>
          <SectionHeader title="筛选条件" />
          <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: "1px dashed #f1f5f9", fontSize: 13 }}>
              <span style={{ color: "#94a3b8", width: 80, flexShrink: 0 }}>院系筛选：</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {ALL_COLLEGES.map((college) => (
                  <span key={college} onClick={() => setCollegeFilter(college)}
                    style={{ padding: "4px 12px", borderRadius: 4, cursor: "pointer", color: collegeFilter === college ? "#2563eb" : "#64748b", background: collegeFilter === college ? "#eff6ff" : "transparent", fontWeight: collegeFilter === college ? 500 : 400, transition: "all 0.3s" }}>
                    {college}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", padding: "8px 0", fontSize: 13 }}>
              <span style={{ color: "#94a3b8", width: 80, flexShrink: 0 }}>时间范围：</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TIME_RANGES.map((range) => (
                  <span key={range.value} onClick={() => setTimeFilter(range.value)}
                    style={{ padding: "4px 12px", borderRadius: 4, cursor: "pointer", color: timeFilter === range.value ? "#2563eb" : "#64748b", background: timeFilter === range.value ? "#eff6ff" : "transparent", fontWeight: timeFilter === range.value ? 500 : 400, transition: "all 0.3s" }}>
                    {range.label}
                  </span>
                ))}
              </div>
            </div>
            {filterCount > 0 && (
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "#64748b" }}>已筛选到 <strong style={{ color: "#2563eb" }}>{filteredResources.length}</strong> 个资源</span>
                <button onClick={() => { setSearch(""); setTypeFilter("全部"); setCollegeFilter("全部"); setTimeFilter("all") }}
                  style={{ padding: "6px 16px", borderRadius: 6, fontSize: 13, cursor: "pointer", border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = "#334155" }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b" }}
                >
                  <RotateCcw style={{ width: 14, height: 14 }} />重置筛选
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── 资源列表 ── */}
        <section id="resource-list" style={{ marginBottom: 50 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: "bold", color: "#1e293b", position: "relative", paddingLeft: 12 }}>
              <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 4, height: 20, background: "linear-gradient(180deg, #2563eb, #3b82f6)", borderRadius: 2 }} />
              公共资源库
            </h2>
            <span style={{ color: "#94a3b8", fontSize: 13 }}>共 {filteredResources.length} 个资源</span>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", padding: "12px 16px", marginBottom: 20, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#94a3b8", marginRight: 4 }}>分类：</span>
            {[{ value: "全部" as const, label: "全部" }, ...ALL_TYPES.map(t => ({ value: t, label: `${TYPE_EMOJI[t]} ${RESOURCE_TYPE_LABELS[t]}` }))].map((item) => (
              <button key={item.value} onClick={() => setTypeFilter(item.value)}
                style={{ padding: "5px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: "none", fontWeight: 500, transition: "all 0.2s", background: typeFilter === item.value ? "#2563eb" : "#f1f5f9", color: typeFilter === item.value ? "#fff" : "#64748b", whiteSpace: "nowrap" }}
                onMouseEnter={(e) => { if (typeFilter !== item.value) e.currentTarget.style.background = "#e2e8f0" }}
                onMouseLeave={(e) => { if (typeFilter !== item.value) e.currentTarget.style.background = "#f1f5f9" }}
              >
                {item.label}
              </button>
            ))}
          </div>
          {filteredResources.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#94a3b8", background: "#fff", borderRadius: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <Filter style={{ width: 32, height: 32, margin: "0 auto 12", opacity: 0.4 }} />
              <div>暂无符合条件的资源</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {filteredResources.map((resource) => (
                <button key={resource.id} onClick={() => handleCardClick(resource)}
                  style={{ background: "#fff", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "all 0.25s", cursor: "pointer", border: "none", textAlign: "left" as const, width: "100%", display: "block" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                  <div style={{ height: 100, background: TYPE_GRADIENTS[resource.type], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, position: "relative" }}>
                    {TYPE_EMOJI[resource.type]}
                    {resource.usageCount > 2000 && (
                      <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(255,255,255,0.25)", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 8, backdropFilter: "blur(4px)", fontWeight: 600 }}>热门</span>
                    )}
                  </div>
                  <div style={{ padding: 16 }}>
                    <h3 style={{ fontSize: 15, marginBottom: 8, lineHeight: 1.5, color: "#1e293b", fontWeight: 600 }}>{resource.title}</h3>
                    {resource.tags.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                        {resource.tags.map((tag) => (
                          <span key={tag} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "#f1f5f9", color: "#64748b" }}>{tag}</span>
                        ))}
                      </div>
                    )}
                    <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5, marginBottom: 12, height: 36, overflow: "hidden" }}>{resource.description}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 12, color: "#64748b", marginBottom: 12 }}>
                      <span>类型：<strong style={{ color: TYPE_COLORS[resource.type] }}>{RESOURCE_TYPE_LABELS[resource.type]}</strong></span>
                      <span style={{ display: "flex", alignItems: "center", gap: 2 }}><Building2 style={{ width: 12, height: 12 }} /> {resource.department.slice(0, 8)}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 2 }}><Eye style={{ width: 12, height: 12 }} /> 使用：<strong style={{ color: "#2563eb" }}>{resource.usageCount}</strong></span>
                      <span style={{ display: "flex", alignItems: "center", gap: 2 }}><Heart style={{ width: 12, height: 12 }} /> 收藏：<strong style={{ color: "#2563eb" }}>{resource.favoriteCount}</strong></span>
                      <span style={{ display: "flex", alignItems: "center", gap: 2 }}><User style={{ width: 12, height: 12 }} /> {resource.uploaderName}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 2 }}><Clock style={{ width: 12, height: 12 }} /> {resource.createdAt.toLocaleDateString("zh-CN")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px dashed #f1f5f9" }}>
                      <button onClick={(e) => { e.stopPropagation(); toggleFavorite(resource.id) }}
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: isFavorite(resource.id) ? "#ef4444" : "#94a3b8", fontSize: 12, display: "flex", alignItems: "center", gap: 4, padding: 0, transition: "all 0.2s" }}
                        onMouseEnter={(e) => { if (!isFavorite(resource.id)) e.currentTarget.style.color = "#fca5a5" }}
                        onMouseLeave={(e) => { if (!isFavorite(resource.id)) e.currentTarget.style.color = "#94a3b8" }}
                      >
                        <Heart style={{ width: 14, height: 14 }} fill={isFavorite(resource.id) ? "currentColor" : "none"} />
                        {isFavorite(resource.id) ? "已收藏" : "收藏"}
                      </button>
                      <span style={{ background: TYPE_COLORS[resource.type], color: "#fff", padding: "5px 14px", borderRadius: 4, fontSize: 12, fontWeight: 500 }}>查看详情</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ═══ 资源详情弹窗 ═══ */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent style={{ maxWidth: 640, maxHeight: "85vh", overflow: "auto" }}>
          {detailResource && (
            <>
              <DialogHeader>
                <DialogTitle>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 10, background: TYPE_GRADIENTS[detailResource.type], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{TYPE_EMOJI[detailResource.type]}</div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600 }}>{detailResource.title}</div>
                      <div style={{ fontSize: 13, fontWeight: 400, color: "#94a3b8", marginTop: 2 }}>{RESOURCE_TYPE_LABELS[detailResource.type]} · {detailResource.department} · {detailResource.uploaderName}</div>
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 4 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>资源描述</div>
                  <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>{detailResource.description}</p>
                </div>
                {detailResource.tags.length > 0 && (
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>关键词标签</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{detailResource.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}</div>
                  </div>
                )}
                {detailResource.type === "venue" && (
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 4 }}>场地信息</div>
                    <DetailRow label="容纳人数" value={`${detailResource.venueCapacity} 人`} />
                    <DetailRow label="位置" value={detailResource.venueLocation || "-"} />
                    <DetailRow label="配套设施" value={detailResource.venueFacilities || "-"} />
                  </div>
                )}
                {detailResource.type === "equipment" && (
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 4 }}>设备信息</div>
                    <DetailRow label="型号" value={detailResource.equipmentModel || "-"} />
                    <DetailRow label="规格" value={detailResource.equipmentSpec || "-"} />
                    <DetailRow label="存放地点" value={detailResource.equipmentLocation || "-"} />
                    <DetailRow label="负责人" value={detailResource.equipmentManager || "-"} />
                  </div>
                )}
                {detailResource.type === "software" && (
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 4 }}>软件信息</div>
                    <DetailRow label="版本" value={detailResource.softwareVersion || "-"} />
                    <DetailRow label="运行环境" value={detailResource.softwareEnv || "-"} />
                    <DetailRow label="授权方式" value={detailResource.softwareLicense || "-"} />
                    <DetailRow label="下载地址" value={detailResource.softwareDownloadUrl || "-"} />
                  </div>
                )}
                {detailResource.type === "simulation" && (
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 4 }}>仿真信息</div>
                    <DetailRow label="仿真平台" value={detailResource.simulationPlatform || "-"} />
                    <DetailRow label="学科领域" value={detailResource.simulationDomain || "-"} />
                    <DetailRow label="操作说明" value={detailResource.simulationInstructions || "-"} />
                  </div>
                )}
                {detailResource.type === "link" && (
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 4 }}>链接信息</div>
                    <DetailRow label="URL" value={detailResource.linkUrl || "-"} />
                    <DetailRow label="来源网站" value={detailResource.linkSource || "-"} />
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #e2e8f0", fontSize: 13, color: "#94a3b8" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Eye className="size-4" /> {detailResource.usageCount} 次使用</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Heart className="size-4" /> {detailResource.favoriteCount} 人收藏</span>
                  </div>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock className="size-3.5" /> {detailResource.createdAt.toLocaleDateString("zh-CN")}</span>
                </div>
                <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
                  <Button variant={isFavorite(detailResource.id) ? "default" : "outline"} size="sm" onClick={() => toggleFavorite(detailResource.id)}>
                    <Heart className="size-4 mr-1.5" fill={isFavorite(detailResource.id) ? "currentColor" : "none"} />
                    {isFavorite(detailResource.id) ? "已收藏" : "取消收藏"}
                  </Button>
                  <Button size="sm" onClick={() => incrementUsage(detailResource.id)}>
                    <Download className="size-4 mr-1.5" />下载
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState, useMemo } from "react"
import {
  Video, FileText, Table, Image, LinkIcon, Music, MapPin, Cpu,
  Monitor, FlaskConical, Ellipsis, Heart, Eye, User, Building2,
  Search, Clock, Sparkles, TrendingUp, RotateCcw,
  Flame, ArrowRight, Filter, BookOpen, Target,
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
import { useToast } from "@/hooks/use-toast"
import { RESOURCE_TYPE_LABELS, COLLEGES, MAJORS } from "@/lib/types"
import { getResourceTypeStats, mockGranularLessons } from "@/lib/mock-data"
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
  "knowledge-point": "📚", "ability-point": "🎯",
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
  "knowledge-point": "linear-gradient(135deg, #e0f2fe, #bae6fd)",
  "ability-point": "linear-gradient(135deg, #ede9fe, #ddd6fe)",
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
  "knowledge-point": "#0284c7",
  "ability-point": "#7c3aed",
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
  "knowledge-point": <BookOpen className="size-5" />,
  "ability-point": <Target className="size-5" />,
}

const ALL_TYPES: ResourceType[] = ["knowledge-point", "ability-point", "video", "document", "spreadsheet", "image", "link", "audio", "venue", "equipment", "software", "simulation", "other"]
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
    getAllUsedTagNames, getTagColor,
  } = useData()
  const { toast } = useToast()

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<ResourceType | "全部">("全部")
  const [collegeFilter, setCollegeFilter] = useState("全部")
  const [majorFilter, setMajorFilter] = useState("全部")
  const [timeFilter, setTimeFilter] = useState("all")
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest")
  const [titleSearch, setTitleSearch] = useState("")
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailResource, setDetailResource] = useState<Resource | null>(null)

  const stats = useMemo(() => getResourceTypeStats(resources), [resources])
  const approvedResources = useMemo(() => getApprovedResources(), [getApprovedResources])
  const favorites = useMemo(() => getFavorites(), [getFavorites])
  const totalUsage = useMemo(() => approvedResources.reduce((s, r) => s + r.usageCount, 0), [approvedResources])

  const filteredResources = useMemo(() => {
    let list = approvedResources
    if (typeFilter !== "全部") list = list.filter((r) => r.type === typeFilter)
    if (collegeFilter !== "全部") list = list.filter((r) => r.department === collegeFilter)
    if (majorFilter !== "全部") list = list.filter((r) => r.major === majorFilter)
    if (timeFilter !== "all") {
      const now = Date.now()
      const ms = timeFilter === "week" ? 7 * 86400000 : timeFilter === "month" ? 30 * 86400000 : 365 * 86400000
      list = list.filter((r) => now - r.createdAt.getTime() < ms)
    }
    if (titleSearch.trim()) {
      list = list.filter((r) => r.title.toLowerCase().includes(titleSearch.toLowerCase()))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q)) || r.uploaderName.toLowerCase().includes(q))
    }
    if (tagFilter.length > 0) {
      list = list.filter((r) => tagFilter.some((t) => r.tags.includes(t)))
    }
    if (sortBy === "popular") {
      list = [...list].sort((a, b) => b.usageCount - a.usageCount)
    } else {
      list = [...list].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }
    return list
  }, [approvedResources, typeFilter, collegeFilter, majorFilter, timeFilter, search, titleSearch, sortBy])

  const allUsedTags = useMemo(() => {
    const tagCounts = new Map<string, number>()
    for (const r of approvedResources) {
      for (const t of r.tags) {
        tagCounts.set(t, (tagCounts.get(t) || 0) + 1)
      }
    }
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([name, count]) => ({ name, count }))
  }, [approvedResources])

  const filterCount = (typeFilter !== "全部" ? 1 : 0) + (collegeFilter !== "全部" ? 1 : 0) + (majorFilter !== "全部" ? 1 : 0) + (timeFilter !== "all" ? 1 : 0) + (tagFilter.length > 0 ? 1 : 0) + (tagFilter.length > 0 ? 1 : 0)

  const handleCardClick = (resource: Resource) => {
    setDetailResource(resource)
    setDetailOpen(true)
    incrementUsage(resource.id)
  }

  return (
    <div>
      {/* ═══ Hero Banner ═══ */}
      <div style={{
        color: "#fff", padding: "60px 20px 50px", textAlign: "center",
        position: "relative", overflow: "hidden", minHeight: 360,
        backgroundImage: "url('/资源共享平台.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(15, 23, 42, 0.55)",
        }} />
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h1 style={{ fontSize: 40, fontWeight: "bold", marginBottom: 12, letterSpacing: 1 }}>教学资源共享服务平台</h1>
          <p style={{ fontSize: 15, opacity: 0.9, marginBottom: 28 }}>
            汇聚视频、文档、软件、仿真等 13 类教学资源，为教师提供一站式资源共享服务
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
                <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>{s.label}</div>
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
            <div style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: "1px dashed #f1f5f9", fontSize: 13 }}>
              <span style={{ color: "#94a3b8", width: 80, flexShrink: 0 }}>专业筛选：</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["全部", ...(collegeFilter === "全部" ? [] : MAJORS[collegeFilter] || [])].map((major) => (
                  <span key={major} onClick={() => setMajorFilter(major)}
                    style={{ padding: "4px 12px", borderRadius: 4, cursor: collegeFilter === "全部" ? "not-allowed" : "pointer", color: majorFilter === major ? "#2563eb" : "#64748b", background: majorFilter === major ? "#eff6ff" : "transparent", fontWeight: majorFilter === major ? 500 : 400, opacity: collegeFilter === "全部" ? 0.4 : 1, transition: "all 0.3s" }}>
                    {major}
                  </span>
                ))}
                {collegeFilter === "全部" && <span style={{ color: "#94a3b8", fontSize: 12, fontStyle: "italic" }}>请先选择院系</span>}
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
            <div style={{ display: "flex", alignItems: "flex-start", padding: "8px 0", fontSize: 13 }}>
              <span style={{ color: "#94a3b8", width: 80, flexShrink: 0, lineHeight: "28px" }}>标签筛选：</span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {allUsedTags.map(({ name, count }) => {
                  const active = tagFilter.includes(name)
                  const color = getTagColor(name)
                  return (
                    <span
                      key={name}
                      onClick={() => {
                        if (active) {
                          setTagFilter(tagFilter.filter(t => t !== name))
                        } else {
                          setTagFilter([...tagFilter, name])
                        }
                      }}
                      style={{
                        padding: "3px 10px", borderRadius: 4, cursor: "pointer",
                        color: active ? "#fff" : color,
                        background: active ? color : `${color}10`,
                        border: `1px solid ${active ? color : `${color}30`}`,
                        fontWeight: active ? 500 : 400,
                        fontSize: 12, transition: "all 0.2s",
                        display: "inline-flex", alignItems: "center", gap: 4,
                      }}
                    >
                      {name}
                      <span style={{ opacity: active ? 0.8 : 0.5, fontSize: 11 }}>
                        {count}
                      </span>
                    </span>
                  )
                })}
                {allUsedTags.length === 0 && (
                  <span style={{ color: "#94a3b8", fontSize: 12, fontStyle: "italic" }}>暂无可用标签</span>
                )}
              </div>
            </div>
            {filterCount > 0 && (
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "#64748b" }}>已筛选到 <strong style={{ color: "#2563eb" }}>{filteredResources.length}</strong> 个资源</span>
                <button onClick={() => { setSearch(""); setTitleSearch(""); setTypeFilter("全部"); setCollegeFilter("全部"); setMajorFilter("全部"); setTimeFilter("all"); setTagFilter([]) }}
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
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ position: "relative" }}>
                <Search style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#94a3b8" }} />
                <input type="text" placeholder="搜索资源名称..." value={titleSearch}
                  onChange={(e) => setTitleSearch(e.target.value)}
                  style={{ width: 180, padding: "6px 12px 6px 32px", borderRadius: 20, fontSize: 12, border: "1px solid #e2e8f0", outline: "none", color: "#334155", background: "#f8fafc", transition: "all 0.2s" }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.background = "#fff" }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#f8fafc" }} />
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => setSortBy("newest")} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: "none", fontWeight: 500, background: sortBy === "newest" ? "#2563eb" : "#f1f5f9", color: sortBy === "newest" ? "#fff" : "#64748b", transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Sparkles style={{ width: 13, height: 13 }} />最新
                </button>
                <button onClick={() => setSortBy("popular")} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: "none", fontWeight: 500, background: sortBy === "popular" ? "#2563eb" : "#f1f5f9", color: sortBy === "popular" ? "#fff" : "#64748b", transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Flame style={{ width: 13, height: 13 }} />热门
                </button>
              </div>
              <span style={{ color: "#94a3b8", fontSize: 13 }}>共 {filteredResources.length} 个资源</span>
            </div>
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
                  style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "all 0.25s", cursor: "pointer", border: "1px solid #f1f5f9", textAlign: "left" as const, width: "100%", display: "block", borderTop: `3px solid ${TYPE_COLORS[resource.type]}` }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.08)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                  <div style={{ padding: 16 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: TYPE_GRADIENTS[resource.type], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                        {TYPE_EMOJI[resource.type]}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{resource.title}</h3>
                          {resource.usageCount > 2000 && (
                            <span style={{ flexShrink: 0, background: "#fee2e2", color: "#ef4444", fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>热门</span>
                          )}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 12, color: TYPE_COLORS[resource.type], background: `${TYPE_COLORS[resource.type]}15`, padding: "2px 8px", borderRadius: 4, fontWeight: 500 }}>
                            {RESOURCE_TYPE_LABELS[resource.type]}
                          </span>
                          <span style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 2 }}>
                            <Building2 style={{ width: 12, height: 12 }} />
                            {resource.department.slice(0, 8)}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6, marginBottom: 12, height: 38, overflow: "hidden" }}>{resource.description}</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px dashed #f1f5f9" }}>
                          <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#94a3b8" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                              <Eye style={{ width: 12, height: 12 }} />
                              {resource.usageCount}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                              <Heart style={{ width: 12, height: 12 }} />
                              {resource.favoriteCount}
                            </span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); toggleFavorite(resource.id) }}
                            style={{ background: "transparent", border: "none", cursor: "pointer", color: isFavorite(resource.id) ? "#ef4444" : "#94a3b8", fontSize: 12, display: "flex", alignItems: "center", gap: 4, padding: 0, transition: "all 0.2s" }}
                            onMouseEnter={(e) => { if (!isFavorite(resource.id)) e.currentTarget.style.color = "#fca5a5" }}
                            onMouseLeave={(e) => { if (!isFavorite(resource.id)) e.currentTarget.style.color = "#94a3b8" }}
                          >
                            <Heart style={{ width: 14, height: 14 }} fill={isFavorite(resource.id) ? "currentColor" : "none"} />
                            {isFavorite(resource.id) ? "已收藏" : "收藏"}
                          </button>
                        </div>
                      </div>
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

              {/* ── Preview area ── */}
              {(detailResource.type === "video" || detailResource.type === "image" || detailResource.type === "document" || detailResource.type === "audio" || detailResource.type === "spreadsheet" || detailResource.type === "link") && (
                <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", marginTop: 8 }}>
                  {detailResource.type === "video" && (
                    <div style={{ background: "#0f172a", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                      <Video style={{ width: 48, height: 48, color: "rgba(255,255,255,0.2)" }} />
                      <div style={{ position: "absolute", width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)", transition: "background 0.2s" }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="8,5 19,12 8,19" /></svg>
                      </div>
                      <div style={{ position: "absolute", bottom: 10, left: 14, right: 14, display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.5)", fontSize: 11 }}>
                        <span>00:00 / 45:32</span>
                        <span style={{ background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: 4 }}>系统内预览</span>
                      </div>
                    </div>
                  )}
                  {detailResource.type === "image" && (
                    <div style={{ aspectRatio: "16/10", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", position: "relative", flexDirection: "column", gap: 12 }}>
                      <Image style={{ width: 48, height: 48, color: "#cbd5e1" }} />
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>图片预览 · 仅限系统内查看</span>
                      <span style={{ position: "absolute", bottom: 10, right: 12, fontSize: 11, color: "#94a3b8", background: "#fff", padding: "3px 10px", borderRadius: 6, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>{detailResource.fileUrl?.replace("/files/", "") || "预览"}</span>
                    </div>
                  )}
                  {detailResource.type === "document" && (
                    <div style={{ padding: 20, background: "#fff", minHeight: 200, display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #e2e8f0", paddingBottom: 12 }}>
                        <FileText style={{ width: 22, height: 22, color: "#f97316" }} />
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{detailResource.title}</div>
                      </div>
                      <div style={{ flex: 1, background: "#fafaf9", borderRadius: 8, padding: 24, display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 13, flexDirection: "column", gap: 8 }}>
                        <FileText style={{ width: 28, height: 28, opacity: 0.25 }} />
                        <span>文档内容仅限系统内在线预览</span>
                      </div>
                    </div>
                  )}
                  {detailResource.type === "audio" && (
                    <div style={{ padding: 16, background: "linear-gradient(135deg, #fce7f3, #fbcfe8)", display: "flex", alignItems: "center", gap: 14 }}>
                      <Music style={{ width: 28, height: 28, color: "#ec4899" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{detailResource.title}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{detailResource.uploaderName}</div>
                      </div>
                      <div style={{ width: 120, height: 4, background: "rgba(236,72,153,0.15)", borderRadius: 2, position: "relative" }}>
                        <div style={{ width: "35%", height: "100%", background: "#ec4899", borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>03:24 / 12:18</span>
                    </div>
                  )}
                  {detailResource.type === "spreadsheet" && (
                    <div style={{ padding: 14, background: "#fff" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "#e2e8f0", borderRadius: 6, overflow: "hidden", fontSize: 11 }}>
                        {["名称", "数量", "单价", "总价"].map(h => (
                          <div key={h} style={{ background: "#f8fafc", padding: "7px 10px", fontWeight: 600, color: "#475569", textAlign: "center" }}>{h}</div>
                        ))}
                        {Array.from({ length: 3 }).map((_, i) => [
                          `项目 ${i + 1}`, String(Math.floor(Math.random() * 100) + 1),
                          `¥${(Math.random() * 1000).toFixed(2)}`, `¥${(Math.random() * 10000).toFixed(2)}`,
                        ].map((c, j) => (
                          <div key={j} style={{ background: "#fff", padding: "7px 10px", color: "#64748b", textAlign: "center" }}>{c}</div>
                        )))}
                      </div>
                      <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "#94a3b8" }}>表格预览 · 仅限系统内查看</div>
                    </div>
                  )}
                  {detailResource.type === "link" && (
                    <div style={{ padding: 14, background: "#ecfeff", display: "flex", alignItems: "center", gap: 10 }}>
                      <LinkIcon style={{ width: 24, height: 24, color: "#06b6d4", flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0e7490" }}>{detailResource.title}</div>
                        <div style={{ fontSize: 11, color: "#0891b2", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{detailResource.linkUrl}</div>
                      </div>
                      <a href={detailResource.linkUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#2563eb", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0 }}>
                        前往查看 →
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 4 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                    {detailResource.type === "knowledge-point" ? "知识点描述" : detailResource.type === "ability-point" ? "能力点描述" : "资源描述"}
                  </div>
                  <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>{detailResource.description}</p>
                </div>
                {detailResource.type === "venue" && (
                  <div style={{ background: "#fff7ed", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#c2410c", marginBottom: 4 }}>场地信息</div>
                    <DetailRow label="场地地址" value={detailResource.venueLocation || "-"} />
                    <DetailRow label="开放时间" value={detailResource.venueOpenTime || "-"} />
                    <DetailRow label="容纳人数" value={detailResource.venueCapacity ? `${detailResource.venueCapacity} 人` : "-"} />
                    <DetailRow label="联系人/电话" value={detailResource.venueContact || "-"} />
                  </div>
                )}
                {detailResource.type === "equipment" && (
                  <div style={{ background: "#fff1f2", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#be123c", marginBottom: 4 }}>设备信息</div>
                    <DetailRow label="所在位置" value={detailResource.equipmentLocation || "-"} />
                    <DetailRow label="数量" value={detailResource.equipmentQuantity ? `${detailResource.equipmentQuantity}` : "-"} />
                  </div>
                )}
                {detailResource.type === "software" && (
                  <div style={{ background: "#faf5ff", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#7e22ce", marginBottom: 4 }}>软件信息</div>
                    <DetailRow label="版本号" value={detailResource.softwareVersion || "-"} />
                    <DetailRow label="授权信息" value={detailResource.softwareLicense || "-"} />
                    <DetailRow label="下载链接" value={detailResource.softwareDownloadUrl || "-"} />
                    <DetailRow label="安装包" value={detailResource.softwareInstallerUrl || "-"} />
                  </div>
                )}
                {detailResource.type === "knowledge-point" && (
                  <div style={{ background: "#f0f9ff", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0369a1" }}>知识点信息</div>
                    {detailResource.knowledgeCode && <DetailRow label="编码" value={detailResource.knowledgeCode} />}
                    <div>
                      <div style={{ fontSize: 13, color: "#0369a1", marginBottom: 8 }}>关联颗粒课</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {detailResource.knowledgeCourses?.split(',').filter(Boolean).map((id) => {
                          const lesson = mockGranularLessons.find((l) => l.id === id)
                          if (!lesson) return null
                          return (
                            <button
                              key={id}
                              onClick={() => toast({ title: `即将跳转：${lesson.name}`, description: '颗粒课详情页面开发中' })}
                              style={{ textAlign: "left", background: "#fff", border: "1px solid #bae6fd", borderRadius: 8, padding: "8px 12px", minWidth: 140, cursor: "pointer", transition: "all 0.2s" }}
                              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(2,132,199,0.12)"; e.currentTarget.style.borderColor = "#7dd3fc" }}
                              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#bae6fd" }}
                            >
                              <div style={{ fontSize: 13, fontWeight: 500, color: "#0369a1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lesson.name}</div>
                              <div style={{ fontSize: 11, color: "#38bdf8" }}>{lesson.code}</div>
                            </button>
                          )
                        })}
                        {!detailResource.knowledgeCourses && <span style={{ fontSize: 13, color: "#7dd3fc" }}>暂无关联颗粒课</span>}
                      </div>
                    </div>
                  </div>
                )}
                {detailResource.type === "ability-point" && (
                  <div style={{ background: "#f5f3ff", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#6d28d9" }}>能力点信息</div>
                    {detailResource.abilityAttribute && <DetailRow label="能力属性" value={detailResource.abilityAttribute} />}
                    {!detailResource.abilityAttribute && <span style={{ fontSize: 13, color: "#a78bfa" }}>暂无能力属性</span>}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #e2e8f0", fontSize: 13, color: "#94a3b8" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Eye className="size-4" /> {detailResource.usageCount} 次使用</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Heart className="size-4" /> {detailResource.favoriteCount} 人收藏</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><User className="size-3.5" /> {detailResource.uploaderName}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock className="size-3.5" /> 创建 {detailResource.createdAt.toLocaleString("zh-CN")}</span>
                    <span>更新 {detailResource.updatedAt.toLocaleString("zh-CN")}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
                  <Button variant={isFavorite(detailResource.id) ? "default" : "outline"} size="sm" onClick={() => toggleFavorite(detailResource.id)}>
                    <Heart className="size-4 mr-1.5" fill={isFavorite(detailResource.id) ? "currentColor" : "none"} />
                    {isFavorite(detailResource.id) ? "已收藏" : "取消收藏"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      {/* Footer */}
      <footer style={{background: '#141a2e', marginTop: 60, width: '100%'}}>
        <div style={{height: 3, background: 'linear-gradient(90deg, #8b5cf6, #818cf8, #22d3ee)'}} />
        <div style={{padding: '48px 5% 32px'}}>
          <div style={{maxWidth: 1280, margin: '0 auto'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32}}>
            <div>
              <h3 style={{fontSize: 15, fontWeight: 600, color: '#fff', margin: '0 0 12px 0'}}>场景化数智教学服务平台</h3>
              <p style={{fontSize: 13, color: '#a8b3cf', lineHeight: 1.8, margin: 0}}>专注职业教育数字化</p>
              <div style={{fontSize: 12, color: '#6b7a99', marginTop: 8}}>版本：V3.2.1</div>
              <a href="#" style={{color: '#22d3ee', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8}}>访问官网 →</a>
            </div>
            <div>
              <h3 style={{fontSize: 15, fontWeight: 600, color: '#fff', margin: '0 0 12px 0'}}>教学资源</h3>
              <p style={{fontSize: 13, color: '#a8b3cf', lineHeight: 1.8, margin: 0}}>岗位标准、实践场景、企业导师</p>
              <a href="#" style={{color: '#22d3ee', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8}}>进入资源商城 →</a>
            </div>
            <div>
              <h3 style={{fontSize: 15, fontWeight: 600, color: '#fff', margin: '0 0 12px 0'}}>技术支持</h3>
              <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                <li style={{fontSize: 13, color: '#a8b3cf', lineHeight: 1.8}}>服务热线：400-888-8888</li>
                <li style={{fontSize: 13, color: '#a8b3cf', lineHeight: 1.8}}>邮箱：support@example.com</li>
                <li><a href="#" style={{color: '#22d3ee', fontSize: 13, textDecoration: 'none'}}>使用手册</a></li>
                <li><a href="#" style={{color: '#22d3ee', fontSize: 13, textDecoration: 'none'}}>常见问题</a></li>
              </ul>
            </div>
            <div>
              <h3 style={{fontSize: 15, fontWeight: 600, color: '#fff', margin: '0 0 12px 0'}}>校内支持</h3>
              <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                <li style={{fontSize: 13, color: '#a8b3cf', lineHeight: 1.8}}>授权院校：XX职业技术学院</li>
                <li style={{fontSize: 13, color: '#a8b3cf', lineHeight: 1.8}}>校内管理员：张老师</li>
                <li style={{fontSize: 13, color: '#a8b3cf', lineHeight: 1.8}}>管理员电话：0000-12345678</li>
              </ul>
            </div>
          </div>
          <hr style={{border: 'none', borderTop: '1px solid #29324a', margin: '40px 0 24px'}} />
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontSize: 12, color: '#6b7a99'}}>
            <div>
              <a href="#" style={{color: '#6b7a99', textDecoration: 'none'}}>隐私政策</a>
              <span style={{color: '#29324a'}}>&nbsp;|&nbsp;</span>
              <a href="#" style={{color: '#6b7a99', textDecoration: 'none'}}>用户协议</a>
            </div>
            <div style={{textAlign: 'right'}}>版权所有 © 2020-2026 杭州知与未来科技有限公司 ｜ 软件著作权登记号：2020SR0123456 ｜ 京ICP备2025105397号-1</div>
          </div>
        </div>
        </div>
      </footer>
    </div>
  )
}

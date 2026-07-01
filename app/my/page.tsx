"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Heart, Eye, User, Building2, Upload, FolderOpen,
  ArrowRight, Clock, Search,
} from "lucide-react"
import { useData } from "@/components/providers/data-provider"
import { RESOURCE_TYPE_LABELS } from "@/lib/types"
import type { ResourceType } from "@/lib/types"

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 style={{
      fontSize: 18, fontWeight: "bold", color: "#1e293b", marginBottom: 18,
      position: "relative", paddingLeft: 12,
    }}>
      <span style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 4, height: 16, background: "linear-gradient(180deg, #2563eb, #3b82f6)", borderRadius: 2 }} />
      {title}
    </h3>
  )
}

const TYPE_GRADIENTS: Record<ResourceType, string> = {
  video: "linear-gradient(135deg, #667eea, #764ba2)",
  document: "linear-gradient(135deg, #f093fb, #f5576c)",
  spreadsheet: "linear-gradient(135deg, #4facfe, #00f2fe)",
  image: "linear-gradient(135deg, #fa709a, #fee140)",
  link: "linear-gradient(135deg, #30cfd0, #330867)",
  audio: "linear-gradient(135deg, #a8edea, #fed6e3)",
  venue: "linear-gradient(135deg, #ffecd2, #fcb69f)",
  equipment: "linear-gradient(135deg, #84fab0, #8fd3f4)",
  software: "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
  simulation: "linear-gradient(135deg, #d4a5a5, #7c8fd4)",
  other: "linear-gradient(135deg, #a8c0ff, #3f2b96)",
}

const TYPE_EMOJI: Record<ResourceType, string> = {
  video: "🎬", document: "📄", spreadsheet: "📊", image: "🖼️",
  link: "🔗", audio: "🎵", venue: "📍", equipment: "🔧",
  software: "💻", simulation: "🧪", other: "📦",
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

const FAVORITE_TABS: { value: ResourceType | "all"; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "video", label: "视频" },
  { value: "document", label: "文档" },
  { value: "spreadsheet", label: "表格" },
  { value: "image", label: "图片" },
  { value: "link", label: "链接" },
  { value: "audio", label: "音频" },
  { value: "venue", label: "场地" },
  { value: "equipment", label: "仪器设备" },
  { value: "software", label: "软件" },
  { value: "simulation", label: "仿真" },
  { value: "other", label: "其他" },
]

export default function MyPage() {
  const router = useRouter()
  const { currentUser, getFavorites, toggleFavorite, getMyUploads } = useData()
  const [favTab, setFavTab] = useState<ResourceType | "all">("all")

  const myUploads = useMemo(() => getMyUploads(), [getMyUploads])
  const allFavorites = useMemo(() => getFavorites(), [getFavorites])
  const favorites = useMemo(() => {
    if (favTab === "all") return allFavorites
    return allFavorites.filter((r) => r.type === favTab)
  }, [allFavorites, favTab])

  return (
    <div>
      {/* ═══ Hero Banner ═══ */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)",
        color: "#fff", padding: "48px 20px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, background: "rgba(255,255,255,0.04)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -40, left: "10%", width: 150, height: 150, background: "rgba(255,255,255,0.04)", borderRadius: "50%" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 18, background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, fontWeight: 700, flexShrink: 0,
            }}>
              {currentUser.name.slice(0, 1)}
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 6 }}>{currentUser.name}</h1>
              <div style={{ fontSize: 13, opacity: 0.8, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Building2 style={{ width: 14, height: 14 }} />
                  {currentUser.department}
                </span>
                <span style={{
                  background: "rgba(255,255,255,0.15)", padding: "3px 12px",
                  borderRadius: 10, fontSize: 12,
                }}>
                  {currentUser.role === "admin" ? "平台管理员" : "普通教师"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 主内容 ═══ */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 20px 0" }}>

        {/* ── 快捷入口 ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
          marginBottom: 40,
        }}>
          {[
            {
              icon: "📂", iconBg: "linear-gradient(135deg, #667eea, #764ba2)",
              title: "我上传的", subtitle: `${myUploads.length} 个资源`,
              onClick: () => router.push("/admin/my-resources"),
            },
            {
              icon: "❤️", iconBg: "linear-gradient(135deg, #f093fb, #f5576c)",
              title: "我的收藏", subtitle: `${allFavorites.length} 个资源`,
            },
            {
              icon: "📤", iconBg: "linear-gradient(135deg, #4facfe, #00f2fe)",
              title: "上传资源", subtitle: "分享教学资源",
              onClick: () => router.push("/admin/upload"),
            },
          ].map((item, i) => {
            const inner = (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: item.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{item.subtitle}</div>
                </div>
                {item.onClick && <ArrowRight style={{ width: 16, height: 16, color: "#94a3b8" }} />}
              </div>
            )
            return item.onClick ? (
              <button
                key={i}
                onClick={item.onClick}
                style={{
                  background: "#fff", borderRadius: 12, padding: 18, border: "1px solid #e2e8f0",
                  cursor: "pointer", textAlign: "left" as const, width: "100%",
                  transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#93c5fd"
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0"
                  e.currentTarget.style.transform = "none"
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"
                }}
              >
                {inner}
              </button>
            ) : (
              <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 18, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                {inner}
              </div>
            )
          })}
        </div>

        {/* ── 我的收藏 ── */}
        <SectionHeader title="我的收藏" />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {FAVORITE_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFavTab(tab.value)}
              style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                border: "none", fontWeight: 500, transition: "all 0.2s",
                background: favTab === tab.value ? "#2563eb" : "#f1f5f9",
                color: favTab === tab.value ? "#fff" : "#64748b",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {favorites.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "#94a3b8", background: "#fff", borderRadius: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <Heart style={{ width: 32, height: 32, margin: "0 auto 12", opacity: 0.4 }} />
            <div style={{ fontSize: 14, marginBottom: 4 }}>暂无收藏的资源</div>
            <div style={{ fontSize: 12 }}>前往首页浏览并收藏你感兴趣的资源</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {favorites.map((resource) => (
              <div
                key={resource.id}
                style={{
                  background: "#fff", borderRadius: 10, overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "all 0.25s",
                  border: "none", textAlign: "left" as const,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)"
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none"
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"
                }}
              >
                <div style={{
                  height: 90, background: TYPE_GRADIENTS[resource.type],
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 32, position: "relative",
                }}>
                  {TYPE_EMOJI[resource.type]}
                </div>
                <div style={{ padding: 14 }}>
                  <h3 style={{ fontSize: 14, marginBottom: 8, lineHeight: 1.4, color: "#1e293b", fontWeight: 600 }}>
                    {resource.title}
                  </h3>
                  <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5, marginBottom: 10, height: 36, overflow: "hidden" }}>
                    {resource.description}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "#64748b", marginBottom: 10 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Eye style={{ width: 12, height: 12 }} /> {resource.usageCount}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <User style={{ width: 12, height: 12 }} /> {resource.uploaderName}
                    </span>
                    <span style={{ marginLeft: "auto", color: TYPE_COLORS[resource.type], fontWeight: 500 }}>
                      {RESOURCE_TYPE_LABELS[resource.type]}
                    </span>
                  </div>
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    paddingTop: 10, borderTop: "1px dashed #f1f5f9",
                  }}>
                    <span style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 3 }}>
                      <Clock style={{ width: 11, height: 11 }} /> {resource.createdAt.toLocaleDateString("zh-CN")}
                    </span>
                    <button
                      onClick={() => toggleFavorite(resource.id)}
                      style={{
                        background: "transparent", border: "none", cursor: "pointer",
                        color: "#ef4444", fontSize: 12, display: "flex", alignItems: "center", gap: 4, padding: 0,
                      }}
                    >
                      <Heart style={{ width: 14, height: 14 }} fill="currentColor" />
                      取消收藏
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

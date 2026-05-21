"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft, Search, Link as LinkIcon, FileText, ChevronRight,
  Layers, CheckCircle2, AlertCircle, BookOpen, ExternalLink,
  Target, BarChart3, Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/components/providers/data-provider"

export default function EvaluationMethodStudentPage() {
  const params = useParams()
  const methodId = params.id as string
  const { evaluationMethods, evaluationCategories, sceneTasks, getSceneTasksByMethod } = useData()

  const method = evaluationMethods.find((m) => m.id === methodId)
  const category = method ? evaluationCategories.find((c) => c.id === method.categoryId) : null
  const tasks = method ? (getSceneTasksByMethod ? getSceneTasksByMethod(methodId) : sceneTasks.filter((t) => t.methodIds.includes(methodId))) : []

  if (!method) {
    return (
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
        <Link href="/evaluation-methods">
          <Button variant="ghost" size="sm" style={{ gap: 6 }}>
            <ArrowLeft style={{ width: 16, height: 16 }} /> 返回列表
          </Button>
        </Link>
        <div style={{ textAlign: "center", padding: "80px 0", color: "#8f959e" }}>
          <Search style={{ width: 48, height: 48, margin: "0 auto 12px", opacity: 0.3 }} />
          <p>测评方式不存在</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/evaluation-methods">
          <Button variant="ghost" size="sm" style={{ gap: 6 }}>
            <ArrowLeft style={{ width: 16, height: 16 }} /> 返回测评方式列表
          </Button>
        </Link>
      </div>

      {/* 头部 */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e6eb", overflow: "hidden", marginBottom: 24 }}>
        <div style={{ padding: "24px 32px", background: "linear-gradient(135deg, #10b981, #34d399)", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700 }}>{method.name}</h1>
              <span style={{ padding: "2px 10px", borderRadius: 10, fontSize: 11, fontWeight: 500, background: "rgba(255,255,255,0.2)" }}>
                {category?.name || "未分类"}
              </span>
            </div>
            <p style={{ fontSize: 14, opacity: 0.9 }}>
              {method.enabled ? "该测评方式已启用，可用于场景任务评价" : "该测评方式当前未启用"}
            </p>
          </div>
          <div style={{ padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 500, background: method.enabled ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)", color: "white" }}>
            {method.enabled ? "已启用" : "未启用"}
          </div>
        </div>
        <div style={{ padding: "24px 32px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            { icon: <Layers style={{ width: 18, height: 18 }} />, label: "所属分类", value: category?.name || "未分类" },
            { icon: <Zap style={{ width: 18, height: 18 }} />, label: "关联任务", value: `${tasks.length} 个` },
            { icon: <BookOpen style={{ width: 18, height: 18 }} />, label: "文档链接", value: method.docLink ? "有" : "无" },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center", padding: "16px 0", background: "#f5f6f7", borderRadius: 8 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#10b981", marginBottom: 6 }}>
                {item.icon} <span style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* 说明文档 */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e6eb", padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <BookOpen style={{ width: 18, height: 18, color: "#10b981" }} /> 测评方式说明
          </h3>
          <div style={{ fontSize: 14, color: "#646a73", lineHeight: 1.8, padding: 16, background: "#f5f6f7", borderRadius: 8 }}>
            {method.description || "暂无详细说明。"}
          </div>
          {method.docLink && (
            <a href={method.docLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, fontSize: 14, color: "#3370ff", textDecoration: "none" }}>
              <ExternalLink style={{ width: 14, height: 14 }} /> 查看完整文档
            </a>
          )}
        </div>

        {/* 相关场景任务 */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e6eb", padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Target style={{ width: 18, height: 18, color: "#10b981" }} /> 相关场景任务
          </h3>
          {tasks.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#8f959e" }}>暂无关联场景任务</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {tasks.map((task) => (
                <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#f5f6f7", borderRadius: 8, cursor: "pointer", transition: "background 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f0f5ff" }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#f5f6f7" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "#d1fae5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <BarChart3 style={{ width: 18, height: 18 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{task.name}</div>
                    <div style={{ fontSize: 12, color: "#8f959e" }}>场景：{task.sceneName}</div>
                  </div>
                  <ChevronRight style={{ width: 16, height: 16, color: "#8f959e" }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

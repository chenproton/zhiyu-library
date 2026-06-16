"use client"

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div style={{ background: "#f5f7fa", color: "#333", fontFamily: '"Microsoft YaHei", Arial, sans-serif', minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>{children}</div>
      {/* 页脚 */}
      <footer style={{
        borderTop: "1px solid #334155",
        background: "#0f172a",
        height: 48,
        padding: "0 32px",
        flexShrink: 0,
        marginTop: "auto"
      }}>
        <div style={{
          maxWidth: 1600,
          height: "100%",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 12,
          color: "#94a3b8"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#fff"} onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}>关于平台</span>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#fff"} onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}>使用帮助</span>
            <span style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#fff"} onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}>留言反馈</span>
          </div>
          <div>杭州知与未来科技有限公司 · 浙ICP xxxxxxxx</div>
        </div>
      </footer>
    </div>
  )
}

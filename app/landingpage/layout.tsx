"use client"

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div style={{ background: "#f5f7fa", color: "#333", fontFamily: '"Microsoft YaHei", Arial, sans-serif', minHeight: "100vh" }}>
      {children}
      {/* 页脚 */}
      <footer style={{ background: "#1e293b", color: "#94a3b8", padding: "24px 20px", textAlign: "center", fontSize: 13, marginTop: 40 }}>
        <p>© 2024 能力测评认定平台 | 一站式能力成长平台</p>
      </footer>
    </div>
  )
}

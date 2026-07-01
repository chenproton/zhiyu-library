"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { PlatformShell } from "@/components/platform-shell"
import { frontendNavigationConfig, backendNavigationConfig } from "@/lib/navigation-config"

export default function ShellWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isPreviewMode = searchParams.get("mode") === "preview"

  if (isPreviewMode) {
    return <div className="min-h-screen bg-white">{children}</div>
  }

  const isBackend = pathname.startsWith("/admin")
  const config = isBackend ? backendNavigationConfig : frontendNavigationConfig

  return (
    <PlatformShell config={config}>
      {children}
    </PlatformShell>
  )
}

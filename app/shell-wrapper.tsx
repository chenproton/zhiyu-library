"use client"

import { useSearchParams } from "next/navigation"
import { PlatformShell } from "@/platform-navigation-shell"
import { evaluationNavigationConfig } from "@/lib/navigation-config"

export default function ShellWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const searchParams = useSearchParams()
  const isPreviewMode = searchParams.get("mode") === "preview"

  if (isPreviewMode) {
    return <div className="min-h-screen bg-white">{children}</div>
  }

  return (
    <PlatformShell config={evaluationNavigationConfig}>
      {children}
    </PlatformShell>
  )
}

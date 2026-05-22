'use client'

import { useEffect, useState } from 'react'
import { AnnotationSystem } from './annotations/annotation-system'

export function AnnotationClient() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <AnnotationSystem
      defaultMode="view"
      theme={{
        primary: '#2563eb',
        secondary: '#3b82f6',
        danger: '#ef4444',
        dotSize: 28,
        panelBg: '#ffffff',
        panelText: '#1f2937',
      }}
      zIndex={50}
    />
  )
}

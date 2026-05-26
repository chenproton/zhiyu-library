'use client'

import { useEffect, useRef, useState } from 'react'
import { AnnotationSystem } from './annotations/annotation-system'

export function AnnotationClient() {
  const [mounted, setMounted] = useState(false)
  const mainRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 将全局标注绑定到 <main> 内容区域，而不是整个文档。
  // 这样侧边栏、header 等布局变化不会影响内容区内的相对坐标。
  useEffect(() => {
    if (!mounted) return

    const findMain = () => {
      const main = document.querySelector('main')
      if (main && main !== mainRef.current) {
        // 确保 main 可以作为定位容器
        const style = window.getComputedStyle(main)
        if (style.position === 'static') {
          main.style.position = 'relative'
        }
        mainRef.current = main
      }
    }

    findMain()

    // 监听 DOM 变化（路由切换时 main 可能被重新挂载）
    const observer = new MutationObserver(findMain)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [mounted])

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
      containerRef={mainRef}
    />
  )
}

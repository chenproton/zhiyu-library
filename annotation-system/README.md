# 页面标注系统（Next.js 集成包）

> 适用于 Next.js 16 + React 19 + Tailwind CSS v4 + shadcn/ui

## 功能一览

- 页面任意位置创建带编号标注点，百分比坐标自适应
- 每个标注支持多级嵌套评论 + 图片附件
- 三种模式：`view`（查看）、`edit`（编辑/拖拽）、`off`（隐藏）
- 弹窗隔离：Dialog / Sheet 内的标注与页面完全隔离
- 容器跟随：标注层可挂载到弹窗内的滚动容器，跟随滚动
- 已关闭状态：标注可标记为关闭，视觉上淡化，随时可重新打开
- 快捷键：`E` 编辑、`V` 查看、`O` 关闭
- 默认 JSON 文件持久化，可替换为数据库

---

## 安装依赖

```bash
npm install lucide-react date-fns
```

确保项目已有：
- Tailwind CSS v4
- shadcn/ui（Radix UI Dialog / Sheet）
- Next.js App Router

---

## 集成方式（推荐：分散复制到项目目录）

> 推荐把 `annotation-system/` 包内的文件**分散复制**到你项目的标准目录中（`lib/`、`hooks/`、`components/`、`app/api/`），复制完成后 `annotation-system/` 文件夹即可删除。这样项目结构更规范，也符合 Next.js 习惯。

### 第 1 步：把包复制到项目根目录（临时）

```bash
cp -r annotation-system /path/to/your-project/
cd /path/to/your-project
```

### 第 2 步：把文件复制到项目对应目录

执行以下命令，把包内文件复制到项目的标准位置：

```bash
# 1. 类型定义 + 适配器（放到 lib/annotations/）
mkdir -p lib/annotations
cp annotation-system/types.ts lib/annotations/types.ts
cp annotation-system/adapter.ts lib/annotations/adapter.ts
cp annotation-system/json-file-adapter.ts lib/annotations/json-file-adapter.ts

# 2. React Hook（放到 hooks/）
cp annotation-system/use-annotations.ts hooks/use-annotations.ts

# 3. API 路由（必须放到 app/api/）
mkdir -p app/api/annotations
mkdir -p app/api/comments
cp annotation-system/api/annotations/route.ts app/api/annotations/route.ts
cp annotation-system/api/comments/route.ts app/api/comments/route.ts

# 4. 组件（放到 components/annotations/ + components/）
mkdir -p components/annotations
cp annotation-system/components/annotation-system.tsx components/annotations/annotation-system.tsx
cp annotation-system/components/annotation-layer.tsx components/annotations/annotation-layer.tsx
cp annotation-system/components/annotation-controller.tsx components/annotations/annotation-controller.tsx
cp annotation-system/components/annotation-editor.tsx components/annotations/annotation-editor.tsx
cp annotation-system/components/comment-panel.tsx components/annotations/comment-panel.tsx
cp annotation-system/components/annotation-client.tsx components/annotation-client.tsx
```

复制完成后，你的项目结构如下：

```
你的项目/
  ├── app/
  │   └── api/
  │         ├── annotations/
  │         │     └── route.ts
  │         └── comments/
  │               └── route.ts
  ├── components/
  │   ├── annotations/
  │   │     ├── annotation-system.tsx
  │   │     ├── annotation-layer.tsx
  │   │     ├── annotation-controller.tsx
  │   │     ├── annotation-editor.tsx
  │   │     └── comment-panel.tsx
  │   └── annotation-client.tsx
  ├── hooks/
  │   └── use-annotations.ts
  ├── lib/
  │   └── annotations/
  │         ├── types.ts
  │         ├── adapter.ts
  │         └── json-file-adapter.ts
  └── ...其他项目文件
```

### 第 3 步：删除临时包文件夹

```bash
rm -rf annotation-system
```

### 第 4 步：修改项目内文件的导入路径

因为文件已经分散到项目的标准目录中，需要把 `annotation-system/` 包内使用的**相对路径**改成你项目的**路径别名**。

以 `@/` 别名（指向项目根目录）为例，需要修改以下文件中的 import 路径：

**`components/annotations/annotation-system.tsx`**
```tsx
// 修改前（包内相对路径）
import { useAnnotations } from '../use-annotations'
import { AnnotationLayer } from './annotation-layer'
import type { AnnotationSystemProps } from '../types'

// 修改后（项目路径别名）
import { useAnnotations } from '@/hooks/use-annotations'
import { AnnotationLayer } from './annotation-layer'
import type { AnnotationSystemProps } from '@/lib/annotations/types'
```

**`components/annotations/annotation-layer.tsx`**
```tsx
// 修改前
import type { Annotation, ... } from '../types'
import { AnnotationEditor } from './annotation-editor'

// 修改后
import type { Annotation, ... } from '@/lib/annotations/types'
import { AnnotationEditor } from './annotation-editor'
```

**`components/annotations/annotation-controller.tsx`**
```tsx
// 修改前
import type { AnnotationMode, AnnotationTheme } from '../types'

// 修改后
import type { AnnotationMode, AnnotationTheme } from '@/lib/annotations/types'
```

**`components/annotations/annotation-editor.tsx`**
```tsx
// 修改前
import type { AnnotationTheme } from '../types'

// 修改后
import type { AnnotationTheme } from '@/lib/annotations/types'
```

**`components/annotations/comment-panel.tsx`**
```tsx
// 修改前
import type { Annotation, ... } from '../types'

// 修改后
import type { Annotation, ... } from '@/lib/annotations/types'
```

**`components/annotation-client.tsx`**
```tsx
// 修改前
import { AnnotationSystem } from './annotation-system'

// 修改后
import { AnnotationSystem } from './annotations/annotation-system'
```

**`hooks/use-annotations.ts`**
```tsx
// 修改前
import type { Annotation, ... } from './types'

// 修改后
import type { Annotation, ... } from '@/lib/annotations/types'
```

**`app/api/annotations/route.ts`** 和 **`app/api/comments/route.ts`**
```tsx
// 修改前
import { createJsonFileAdapter } from '../../json-file-adapter'

// 修改后
import { createJsonFileAdapter } from '@/lib/annotations/json-file-adapter'
```

> **提示**：如果项目没有配置 `@/` 别名，可以改用相对路径，例如 `../../../lib/annotations/types`。但强烈建议配置 `@/` 别名，这是 Next.js 项目的标准做法。

### 第 5 步：全局挂载到 layout

在 `app/layout.tsx` 中引入 `<AnnotationClient />`，放到 `<body>` 底部：

```tsx
import { AnnotationClient } from '@/components/annotation-client'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <AnnotationClient />
      </body>
    </html>
  )
}
```

---

## 弹窗标注隔离（可选）

如果你的项目使用 shadcn/ui 的 Dialog 或 Sheet，需要扩展它们以支持弹窗内标注。

### Dialog 扩展

修改你项目的 `components/ui/dialog.tsx`，在 `DialogContent` 的 props 和 JSX 中增加标注系统：

```tsx
import * as React from 'react'
import { AnnotationSystem } from '@/components/annotations/annotation-system'

function AnnotationContextConsumer({
  annotationContext,
  annotationContainerRef,
}: {
  annotationContext?: string | boolean
  annotationContainerRef?: React.RefObject<HTMLElement | null>
}) {
  const idRef = React.useRef<string | null>(null)
  if (idRef.current === null && annotationContext === true) {
    idRef.current = `dialog-${Math.random().toString(36).slice(2, 9)}`
  }
  const ctx = annotationContext === true ? idRef.current : annotationContext || null
  if (!ctx) return null
  return (
    <AnnotationSystem
      context={ctx}
      zIndex={100}
      defaultMode="view"
      hideController
      fixed={!annotationContainerRef}
      containerRef={annotationContainerRef}
    />
  )
}

// 修改 DialogContent 的 props 类型
function DialogContent({
  className,
  children,
  showCloseButton = true,
  annotationContext,           // 新增
  annotationContainerRef,      // 新增
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
  annotationContext?: string | boolean
  annotationContainerRef?: React.RefObject<HTMLElement | null>
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content ... {...props}>
        {children}
        {showCloseButton && <DialogPrimitive.Close ... />}
        <AnnotationContextConsumer
          annotationContext={annotationContext}
          annotationContainerRef={annotationContainerRef}
        />
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}
```

### Sheet 扩展

与 Dialog 完全相同的逻辑，修改 `components/ui/sheet.tsx` 的 `SheetContent`。

### 弹窗使用方式

```tsx
// 普通弹窗（无内部滚动）
<DialogContent annotationContext="bank-form">
  ...弹窗内容...
</DialogContent>

// 弹窗含可滚动区域（容器跟随模式）
const scrollRef = useRef<HTMLDivElement>(null)
<DialogContent annotationContext="exam-form" annotationContainerRef={scrollRef}>
  <div ref={scrollRef} className="max-h-[60vh] overflow-y-auto">
    ...内容...
  </div>
</DialogContent>
```

---

## 主题定制

```tsx
<AnnotationSystem
  theme={{
    primary: '#2563eb',    // 标注点主色
    secondary: '#3b82f6',  // 查看模式按钮色
    danger: '#ef4444',     // 删除色
    dotSize: 28,           // 标注点直径
    panelBg: '#ffffff',    // 面板背景
    panelText: '#1f2937',  // 面板文字
  }}
/>
```

---

## 自定义存储后端

实现 `AnnotationAdapter` 接口即可接入数据库：

```typescript
import type { AnnotationAdapter } from '@/lib/annotations/adapter'

export function createDatabaseAdapter(): AnnotationAdapter {
  return {
    getAnnotationsByPage: async (page, context) => { /* ... */ },
    // ... 实现所有方法
  }
}
```

然后在 `app/api/annotations/route.ts` 和 `app/api/comments/route.ts` 中替换 `createJsonFileAdapter()` 即可。

---

## 关键设计

| 设计点 | 说明 |
|--------|------|
| 坐标系统 | 百分比（0-100），相对各自容器，响应式 |
| 隔离机制 | `page`（pathname）+ `context`（固定字符串）组合 |
| 定位模式 | 文档模式（absolute）/ Viewport 模式（fixed）/ 容器模式（Portal） |
| 交互穿透 | edit 模式下不拦截 button/input/textarea/select/a 点击 |
| 弹窗上下文 | 使用固定字符串（如 `"bank-form"`），确保关闭再开后标注恢复 |
| 已关闭状态 | `closed: boolean`，视觉上淡化但不删除 |

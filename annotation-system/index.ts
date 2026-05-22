// 类型
export type {
  Annotation,
  Comment,
  AnnotationMode,
  AnnotationStore,
  AnnotationTheme,
  AnnotationSystemProps,
  UseAnnotationsConfig,
} from './types'

// 适配器
export type { AnnotationAdapter } from './adapter'
export { createJsonFileAdapter } from './json-file-adapter'
export type { JsonFileAdapterOptions } from './json-file-adapter'

// Hook
export { useAnnotations } from './use-annotations'

// 组件
export { AnnotationSystem } from './components/annotation-system'
export { AnnotationLayer } from './components/annotation-layer'
export { AnnotationController } from './components/annotation-controller'
export { AnnotationEditor } from './components/annotation-editor'
export { CommentPanel } from './components/comment-panel'
export { AnnotationClient } from './components/annotation-client'

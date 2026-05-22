export type Annotation = {
  id: string
  page: string
  context?: string
  x: number
  y: number
  content: string
  imageUrl?: string
  closed?: boolean
  createdAt: number
}

export type Comment = {
  id: string
  annotationId: string
  user: string
  text: string
  imageUrl?: string
  createdAt: number
  parentId?: string | null
}

export type AnnotationMode = 'off' | 'view' | 'edit'

export interface AnnotationStore {
  annotations: Annotation[]
  comments: Comment[]
}

export interface AnnotationTheme {
  primary?: string
  secondary?: string
  danger?: string
  dotSize?: number
  panelBg?: string
  panelText?: string
}

export interface AnnotationSystemProps {
  page?: string
  context?: string
  apiBasePath?: string
  defaultMode?: AnnotationMode
  currentUser?: string
  zIndex?: number
  theme?: AnnotationTheme
  onModeChange?: (mode: AnnotationMode) => void
  fixed?: boolean
  containerRef?: React.RefObject<HTMLElement | null>
}

export interface UseAnnotationsConfig {
  page: string
  context?: string
  apiBasePath: string
  defaultMode: AnnotationMode
  currentUser?: string
}

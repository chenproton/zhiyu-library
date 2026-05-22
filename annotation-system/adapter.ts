import type { Annotation, Comment } from './types'

export interface AnnotationAdapter {
  getAnnotationsByPage(page: string, context?: string): Promise<Annotation[]>
  getAnnotationById(id: string): Promise<Annotation | undefined>
  createAnnotation(annotation: Omit<Annotation, 'id' | 'createdAt'>): Promise<Annotation>
  updateAnnotation(
    id: string,
    updates: Partial<Pick<Annotation, 'x' | 'y' | 'content' | 'imageUrl' | 'closed'>>
  ): Promise<Annotation | undefined>
  deleteAnnotation(id: string): Promise<boolean>
  getCommentsByAnnotationId(annotationId: string): Promise<Comment[]>
  createComment(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment>
  deleteComment(id: string): Promise<boolean>
}

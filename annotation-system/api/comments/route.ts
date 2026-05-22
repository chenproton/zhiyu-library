import { NextResponse } from 'next/server'
import { createJsonFileAdapter } from '../../json-file-adapter'

const adapter = createJsonFileAdapter()

export async function GET(request: Request) {
  try {
    const annotationId = new URL(request.url).searchParams.get('annotationId')
    if (!annotationId) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    return NextResponse.json(await adapter.getCommentsByAnnotationId(annotationId))
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { annotationId, user, text, parentId, imageUrl } = await request.json()
    if (!annotationId || !user || !text) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
    return NextResponse.json(await adapter.createComment({ annotationId, user, text, parentId, imageUrl }), { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await adapter.deleteComment(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { createJsonFileAdapter } from '../../json-file-adapter'

const adapter = createJsonFileAdapter()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    const context = searchParams.get('context') || 'default'
    if (!page) return NextResponse.json({ error: 'Page required' }, { status: 400 })
    return NextResponse.json(await adapter.getAnnotationsByPage(page, context))
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { page, context, x, y, content, imageUrl } = await request.json()
    if (!page || typeof x !== 'number' || typeof y !== 'number' || !content) {
      return NextResponse.json({ error: 'Invalid' }, { status: 400 })
    }
    return NextResponse.json(await adapter.createAnnotation({ page, context, x, y, content, imageUrl }), { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, x, y, content, imageUrl, closed } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    const updated = await adapter.updateAnnotation(id, {
      ...(x !== undefined && { x }), ...(y !== undefined && { y }),
      ...(content !== undefined && { content }), ...(imageUrl !== undefined && { imageUrl }),
      ...(closed !== undefined && { closed }),
    })
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
    await adapter.deleteAnnotation(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

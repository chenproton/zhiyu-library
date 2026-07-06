"use client"

import { useState, useMemo } from "react"
import { Plus, Pencil, Trash2, Tag, FolderOpen, Hash, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { useData } from "@/components/providers/data-provider"
import { RESOURCE_TYPE_LABELS, RESOURCE_STATUS_LABELS } from "@/lib/types"
import type { Resource, ResourceStatus } from "@/lib/types"

export default function TagsPage() {
  const {
    resources, tagCategories, tagDefinitions,
    addTagCategory, updateTagCategory, deleteTagCategory,
    addTag, updateTag, deleteTag,
  } = useData()

  const [selectedCatId, setSelectedCatId] = useState<string>(tagCategories[0]?.id || "")
  const [catDialogOpen, setCatDialogOpen] = useState(false)
  const [catEditTarget, setCatEditTarget] = useState<string | null>(null)
  const [catName, setCatName] = useState("")
  const [tagDialogOpen, setTagDialogOpen] = useState(false)
  const [tagEditTarget, setTagEditTarget] = useState<string | null>(null)
  const [tagName, setTagName] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: "cat" | "tag"; id: string } | null>(null)
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false)
  const [resourceDialogTag, setResourceDialogTag] = useState<string>("")

  const selectedCategory = tagCategories.find(c => c.id === selectedCatId)

  const categoryTags = useMemo(() => {
    if (!selectedCategory) return []
    return tagDefinitions.filter(t => t.categoryId === selectedCatId)
  }, [tagDefinitions, selectedCatId, selectedCategory])

  const getTagUsageCount = (tagName: string) => {
    return resources.filter(r => r.tags.includes(tagName)).length
  }

  const getResourcesByTag = (tagName: string) => {
    return resources.filter(r => r.tags.includes(tagName))
  }

  const STATUS_COLORS: Record<ResourceStatus, string> = {
    pending: "bg-amber-50 text-amber-600 border-amber-200",
    approved: "bg-green-50 text-green-600 border-green-200",
    rejected: "bg-red-50 text-red-600 border-red-200",
  }

  const getResourceCountForCategory = (catId: string) => {
    return tagDefinitions.filter(t => t.categoryId === catId).length
  }

  const openAddCat = () => {
    setCatEditTarget(null)
    setCatName("")
    setCatDialogOpen(true)
  }

  const openRenameCat = (id: string) => {
    const cat = tagCategories.find(c => c.id === id)
    if (!cat) return
    setCatEditTarget(id)
    setCatName(cat.name)
    setCatDialogOpen(true)
  }

  const handleCatSave = () => {
    if (!catName.trim()) return
    if (catEditTarget) {
      updateTagCategory(catEditTarget, catName.trim())
    } else {
      const created = addTagCategory(catName.trim())
      if (!catEditTarget) setSelectedCatId(created.id)
    }
    setCatDialogOpen(false)
  }

  const confirmDeleteCat = (id: string) => {
    setDeleteConfirm({ type: "cat", id })
  }

  const handleDeleteCat = () => {
    if (deleteConfirm && deleteConfirm.type === "cat") {
      deleteTagCategory(deleteConfirm.id)
      if (selectedCatId === deleteConfirm.id) {
        setSelectedCatId(tagCategories.find(c => c.id !== deleteConfirm.id)?.id || "")
      }
      setDeleteConfirm(null)
    }
  }

  const openAddTag = () => {
    setTagEditTarget(null)
    setTagName("")
    setTagDialogOpen(true)
  }

  const openRenameTag = (id: string) => {
    const tag = tagDefinitions.find(t => t.id === id)
    if (!tag) return
    setTagEditTarget(id)
    setTagName(tag.name)
    setTagDialogOpen(true)
  }

  const handleTagSave = () => {
    if (!tagName.trim()) return
    if (tagEditTarget) {
      updateTag(tagEditTarget, tagName.trim())
    } else {
      addTag(tagName.trim(), selectedCatId)
    }
    setTagDialogOpen(false)
  }

  const confirmDeleteTag = (id: string) => {
    setDeleteConfirm({ type: "tag", id })
  }

  const handleDeleteTag = () => {
    if (deleteConfirm && deleteConfirm.type === "tag") {
      deleteTag(deleteConfirm.id)
      setDeleteConfirm(null)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-800 mb-1">标签管理</h1>
        <p className="text-sm text-gray-500">管理资源标签分类与标签，修改/删除标签将同步更新所有关联资源</p>
      </div>

      <div className="grid grid-cols-[260px_1fr] gap-4 items-start">
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
                <FolderOpen className="size-4" />分类
              </span>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={openAddCat}>
                <Plus className="size-4" />
              </Button>
            </div>
            <div className="space-y-0.5">
              {tagCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCatId === cat.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {cat.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">
                      {getResourceCountForCategory(cat.id)}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); openRenameCat(cat.id) }}
                      className="p-0.5 rounded hover:bg-gray-200 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="size-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); confirmDeleteCat(cat.id) }}
                      className="p-0.5 rounded hover:bg-red-100 text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </span>
                </button>
              ))}
              {tagCategories.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-4">暂无分类</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            {selectedCategory ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Tag className="size-4 text-primary" />
                    <span className="text-sm font-medium text-gray-700">
                      {selectedCategory.name}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {categoryTags.length} 个标签
                    </Badge>
                  </div>
                  <Button size="sm" onClick={openAddTag}>
                    <Plus className="size-3.5 mr-1" />新增标签
                  </Button>
                </div>

                <ScrollArea className="max-h-[500px]">
                  <div className="space-y-1">
                    {categoryTags.length === 0 ? (
                      <div className="text-sm text-muted-foreground text-center py-8">
                        暂无标签，点击"新增标签"添加
                      </div>
                    ) : (
                      categoryTags.map(tag => {
                        const usageCount = getTagUsageCount(tag.name)
                        return (
                          <div
                            key={tag.id}
                            className="flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: tag.color }}
                              />
                              <span className="text-sm text-gray-700">{tag.name}</span>
                              <Badge
                                variant="outline"
                                className="text-[10px] py-0 h-5 flex items-center gap-0.5"
                              >
                                <Hash className="size-2.5" />
                                {usageCount}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs"
                                onClick={() => {
                                  setResourceDialogTag(tag.name)
                                  setResourceDialogOpen(true)
                                }}
                              >
                                <Eye className="size-3 mr-1" />查看 ({usageCount})
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs"
                                onClick={() => openRenameTag(tag.id)}
                              >
                                <Pencil className="size-3 mr-1" />编辑
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs text-red-500"
                                onClick={() => confirmDeleteTag(tag.id)}
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-12">
                请选择一个分类
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{catEditTarget ? "编辑分类" : "新增分类"}</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="输入分类名称"
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleCatSave() }}
            maxLength={20}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCatDialogOpen(false)}>取消</Button>
            <Button onClick={handleCatSave} disabled={!catName.trim()}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{tagEditTarget ? "编辑标签" : "新增标签"}</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="输入标签名称"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleTagSave() }}
            maxLength={20}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setTagDialogOpen(false)}>取消</Button>
            <Button onClick={handleTagSave} disabled={!tagName.trim()}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirm !== null} onOpenChange={(v) => { if (!v) setDeleteConfirm(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            {deleteConfirm?.type === "cat"
              ? "删除该分类将同时删除其下所有标签，并从所有资源中移除对应标签。确定继续？"
              : "删除该标签将从所有关联资源中移除。确定继续？"
            }
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>取消</Button>
            <Button
              variant="destructive"
              onClick={deleteConfirm?.type === "cat" ? handleDeleteCat : handleDeleteTag}
            >
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={resourceDialogOpen} onOpenChange={setResourceDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="size-4 text-primary" />
              使用标签「{resourceDialogTag}」的资源
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto -mx-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>资源标题</TableHead>
                  <TableHead className="w-20">类型</TableHead>
                  <TableHead className="w-20">状态</TableHead>
                  <TableHead className="w-24">院系</TableHead>
                  <TableHead className="w-28">上传时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getResourcesByTag(resourceDialogTag).map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <div className="text-sm font-medium text-gray-800 line-clamp-1 max-w-[280px]">
                        {resource.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {RESOURCE_TYPE_LABELS[resource.type]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs border ${STATUS_COLORS[resource.status]}`}>
                        {RESOURCE_STATUS_LABELS[resource.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-500">{resource.department}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-400">
                        {resource.createdAt.toLocaleDateString("zh-CN")}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {getResourcesByTag(resourceDialogTag).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                      暂无使用该标签的资源
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
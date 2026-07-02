"use client"

import { useState, useMemo } from "react"
import {
  Search, Pencil, Trash2, Eye, XCircle, Heart, Upload, Share2, Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useData } from "@/components/providers/data-provider"
import { RESOURCE_TYPE_LABELS, RESOURCE_STATUS_LABELS } from "@/lib/types"
import type { ResourceType, ResourceStatus, Resource } from "@/lib/types"

const STATUS_COLORS: Record<ResourceStatus, string> = {
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  approved: "bg-green-50 text-green-600 border-green-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
}

const TYPE_GRADIENTS: Record<ResourceType, string> = {
  video: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
  document: "linear-gradient(135deg, #ffedd5, #fed7aa)",
  spreadsheet: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
  image: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
  link: "linear-gradient(135deg, #ecfeff, #cffafe)",
  audio: "linear-gradient(135deg, #fce7f3, #fbcfe8)",
  venue: "linear-gradient(135deg, #fee2e2, #fecaca)",
  equipment: "linear-gradient(135deg, #e2e8f0, #cbd5e1)",
  software: "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
  simulation: "linear-gradient(135deg, #ccfbf1, #99f6e4)",
  other: "linear-gradient(135deg, #e7e5e4, #d6d3d1)",
  "knowledge-point": "linear-gradient(135deg, #e0f2fe, #bae6fd)",
  "ability-point": "linear-gradient(135deg, #ede9fe, #ddd6fe)",
}

const TYPE_COLORS: Record<ResourceType, string> = {
  video: "#3b82f6", document: "#f97316", spreadsheet: "#22c55e",
  image: "#a855f7", link: "#06b6d4", audio: "#ec4899",
  venue: "#ef4444", equipment: "#64748b", software: "#6366f1",
  simulation: "#14b8a6", other: "#78716c",
  "knowledge-point": "#0284c7", "ability-point": "#7c3aed",
}

const TYPE_EMOJI: Record<ResourceType, string> = {
  video: "🎬", document: "📄", spreadsheet: "📊", image: "🖼️",
  link: "🔗", audio: "🎵", venue: "📍", equipment: "🔧",
  software: "💻", simulation: "🧪", other: "📦",
  "knowledge-point": "📚", "ability-point": "🎯",
}

export default function MyResourcesPage() {
  const {
    getMyUploads, getFavorites, getMySharedResources, getMyUnsharedResources,
    updateResource, deleteResource,
    toggleFavorite, isFavorite,
  } = useData()

  const [activeTab, setActiveTab] = useState<"mine" | "shared" | "unshared" | "favorites">("mine")
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<ResourceType | "all">("all")
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | "all">("all")

  const [editOpen, setEditOpen] = useState(false)
  const [editResource, setEditResource] = useState<Resource | null>(null)
  const [editDescription, setEditDescription] = useState("")
  const [editTags, setEditTags] = useState("")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailResource, setDetailResource] = useState<Resource | null>(null)

  const myUploads = useMemo(() => getMyUploads(), [getMyUploads])
  const favorites = useMemo(() => getFavorites(), [getFavorites])
  const myShared = useMemo(() => getMySharedResources(), [getMySharedResources])
  const myUnshared = useMemo(() => getMyUnsharedResources(), [getMyUnsharedResources])

  const filteredUploads = useMemo(() => {
    let list = [...myUploads]
    if (typeFilter !== "all") list = list.filter((r) => r.type === typeFilter)
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q)))
    }
    return list
  }, [myUploads, typeFilter, statusFilter, search])

  const filteredFavorites = useMemo(() => {
    let list = [...favorites]
    if (typeFilter !== "all") list = list.filter((r) => r.type === typeFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q)))
    }
    return list
  }, [favorites, typeFilter, search])

  const filteredShared = useMemo(() => {
    let list = [...myShared]
    if (typeFilter !== "all") list = list.filter((r) => r.type === typeFilter)
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q)))
    }
    return list
  }, [myShared, typeFilter, statusFilter, search])

  const filteredUnshared = useMemo(() => {
    let list = [...myUnshared]
    if (typeFilter !== "all") list = list.filter((r) => r.type === typeFilter)
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q)))
    }
    return list
  }, [myUnshared, typeFilter, statusFilter, search])

  const handleEdit = () => {
    if (editResource && editDescription.trim()) {
      updateResource(editResource.id, {
        description: editDescription.trim(),
        tags: editTags.split(/[,，]/).map((t) => t.trim()).filter((t) => t.length > 0).slice(0, 5),
      })
      setEditOpen(false)
      setEditResource(null)
    }
  }

  const renderResourceTable = (list: Resource[], emptyText: string) => (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>资源标题</TableHead>
              <TableHead className="w-20">类型</TableHead>
              <TableHead className="w-20">状态</TableHead>
              <TableHead className="w-24">是否共享</TableHead>
              <TableHead className="w-20">使用次数</TableHead>
              <TableHead className="w-28">上传时间</TableHead>
              <TableHead className="w-52">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell><div className="text-sm font-medium text-gray-800 line-clamp-1 max-w-[300px]">{resource.title}</div></TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">{RESOURCE_TYPE_LABELS[resource.type]}</Badge></TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge className={`text-xs ${STATUS_COLORS[resource.status]}`}>{RESOURCE_STATUS_LABELS[resource.status]}</Badge>
                    {resource.rejectReason && <span className="text-[10px] text-red-500 line-clamp-1" title={resource.rejectReason}>{resource.rejectReason}</span>}
                  </div>
                </TableCell>
                <TableCell>
                  {resource.isShared ? (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                      <Share2 className="size-3 mr-1" />已共享
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-500 border-gray-200">
                      <Lock className="size-3 mr-1" />未共享
                    </Badge>
                  )}
                </TableCell>
                <TableCell><span className="text-xs text-gray-500">{resource.usageCount}</span></TableCell>
                <TableCell><span className="text-xs text-gray-400">{resource.createdAt.toLocaleDateString("zh-CN")}</span></TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setDetailResource(resource); setDetailOpen(true) }}><Eye className="size-3 mr-1" />预览</Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setEditResource(resource); setEditDescription(resource.description); setEditTags(resource.tags.join("，")); setEditOpen(true) }}><Pencil className="size-3 mr-1" />编辑</Button>
                    {(resource.status === "pending" || resource.status === "rejected") && (
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-red-500" onClick={() => { setDeleteTarget(resource); setDeleteOpen(true) }}><Trash2 className="size-3" /></Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {list.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-12 text-gray-400">{emptyText}</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </Card>
  )

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-800 mb-1">我的资源</h1>
        <p className="text-sm text-gray-500">管理我上传的资源与收藏</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as "mine" | "shared" | "unshared" | "favorites"); setSearch(""); setTypeFilter("all"); setStatusFilter("all") }}>
        <TabsList>
          <TabsTrigger value="mine">
            <Upload className="size-4 mr-1.5" />我的资源 ({myUploads.length})
          </TabsTrigger>
          <TabsTrigger value="shared">
            <Share2 className="size-4 mr-1.5" />已共享资源 ({myShared.length})
          </TabsTrigger>
          <TabsTrigger value="unshared">
            <Lock className="size-4 mr-1.5" />未共享资源 ({myUnshared.length})
          </TabsTrigger>
          <TabsTrigger value="favorites">
            <Heart className="size-4 mr-1.5" />我收藏的资源 ({favorites.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[180px] max-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input placeholder={`搜索${activeTab === "mine" ? "我的" : activeTab === "favorites" ? "收藏的" : activeTab === "shared" ? "已共享的" : "未共享的"}资源...`} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as ResourceType | "all")}>
              <SelectTrigger className="w-[130px]"><SelectValue placeholder="类型" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                {Object.entries(RESOURCE_TYPE_LABELS).map(([k, v]) => (<SelectItem key={k} value={k}>{v}</SelectItem>))}
              </SelectContent>
            </Select>
            {(activeTab === "mine" || activeTab === "shared" || activeTab === "unshared") && (
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ResourceStatus | "all")}>
                <SelectTrigger className="w-[120px]"><SelectValue placeholder="状态" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待审核</SelectItem>
                  <SelectItem value="approved">已通过</SelectItem>
                  <SelectItem value="rejected">已驳回</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-3">
          <Tabs value={typeFilter} onValueChange={(v) => setTypeFilter(v as ResourceType | "all")}>
            <TabsList className="flex-wrap h-auto gap-1">
              <TabsTrigger value="all" className="text-xs">全部</TabsTrigger>
              {Object.entries(RESOURCE_TYPE_LABELS).map(([key, label]) => (
                <TabsTrigger key={key} value={key} className="text-xs">{label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {activeTab === "favorites" ? (
        <>
          {filteredFavorites.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Heart className="size-10 mx-auto mb-3 opacity-30" />
              <p>暂无收藏的资源</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFavorites.map((resource) => (
                <Card key={resource.id} className="transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background: TYPE_GRADIENTS[resource.type] }}>
                        {TYPE_EMOJI[resource.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">{resource.title}</h3>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1 mb-2">{resource.description}</p>
                    <div className="text-xs text-gray-500 mb-2">{RESOURCE_TYPE_LABELS[resource.type]} · {resource.department}</div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-0.5"><Eye className="size-3" />{resource.usageCount}</span>
                      <div className="flex items-center gap-2">
                        <span className={resource.isShared ? "text-green-600" : "text-gray-400"}>
                          {resource.isShared ? "已共享" : "未共享"}
                        </span>
                        <button onClick={() => toggleFavorite(resource.id)} className="text-red-500"><Heart className="size-4" fill="currentColor" /></button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        renderResourceTable(
          activeTab === "mine" ? filteredUploads : activeTab === "shared" ? filteredShared : filteredUnshared,
          activeTab === "mine" ? "暂无我的资源" : activeTab === "shared" ? "暂无已共享的资源" : "暂无未共享的资源"
        )
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>编辑资源</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>资源标题</Label><Input value={editResource?.title || ""} disabled className="bg-gray-50" /></div>
            <div><Label>描述</Label><Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} maxLength={500} rows={3} /></div>
            <div><Label>标签（逗号分隔）</Label><Input value={editTags} onChange={(e) => setEditTags(e.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>取消</Button>
            <Button onClick={handleEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          {detailResource && (
            <>
              <DialogHeader><DialogTitle>{detailResource.title}</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{RESOURCE_TYPE_LABELS[detailResource.type]}</Badge>
                  <Badge className={STATUS_COLORS[detailResource.status]}>{RESOURCE_STATUS_LABELS[detailResource.status]}</Badge>
                </div>
                <div><Label className="text-gray-500">描述</Label><p className="text-sm">{detailResource.description}</p></div>
                <div className="flex flex-wrap gap-1">{detailResource.tags.map((tag) => (<Badge key={tag} variant="secondary">{tag}</Badge>))}</div>
                {detailResource.rejectReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <Label className="text-red-600 flex items-center gap-1"><XCircle className="size-3" />驳回原因</Label>
                    <p className="text-sm text-red-600 mt-1">{detailResource.rejectReason}</p>
                  </div>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500 pt-2 border-t">
                  <span>使用 {detailResource.usageCount} 次</span>
                  <span>收藏 {detailResource.favoriteCount} 次</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>确认删除</DialogTitle></DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={() => { if (deleteTarget) { deleteResource(deleteTarget.id); setDeleteOpen(false); setDeleteTarget(null) } }}>确认删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

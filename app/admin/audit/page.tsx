"use client"

import { useState, useMemo } from "react"
import {
  Search, RotateCcw, CheckCircle2, XCircle, Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useData } from "@/components/providers/data-provider"
import { RESOURCE_TYPE_LABELS, RESOURCE_STATUS_LABELS, COLLEGES } from "@/lib/types"
import type { ResourceType, ResourceStatus, Resource } from "@/lib/types"

const STATUS_COLORS: Record<ResourceStatus, string> = {
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  approved: "bg-green-50 text-green-600 border-green-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
}

export default function AuditPage() {
  const { resources, approveResource, rejectResource, batchApprove, batchReject } = useData()

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<ResourceType | "all">("all")
  const [collegeFilter, setCollegeFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [detailOpen, setDetailOpen] = useState(false)
  const [detailResource, setDetailResource] = useState<Resource | null>(null)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectTarget, setRejectTarget] = useState<Resource | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [batchRejectOpen, setBatchRejectOpen] = useState(false)
  const [batchRejectReason, setBatchRejectReason] = useState("")

  const pendingResources = useMemo(
    () => resources.filter((r) => r.status === "pending"),
    [resources]
  )

  const filteredResources = useMemo(() => {
    let list = [...pendingResources]
    if (typeFilter !== "all") list = list.filter((r) => r.type === typeFilter)
    if (collegeFilter !== "all") list = list.filter((r) => r.department === collegeFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          r.uploaderName.toLowerCase().includes(q)
      )
    }
    return list
  }, [pendingResources, typeFilter, collegeFilter, search])

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredResources.length) setSelectedIds([])
    else setSelectedIds(filteredResources.map((r) => r.id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800 mb-1">审核中心</h1>
          <p className="text-sm text-gray-500">
            审核用户上传的资源 · 待审核共 {pendingResources.length} 个
          </p>
        </div>
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 mr-1">已选 {selectedIds.length} 项</span>
            <Button
              size="sm"
              onClick={() => {
                batchApprove(selectedIds)
                setSelectedIds([])
              }}
            >
              <CheckCircle2 className="size-4 mr-1" />
              批量通过
            </Button>
            <Button size="sm" variant="outline" onClick={() => setBatchRejectOpen(true)}>
              <XCircle className="size-4 mr-1" />
              批量拒绝
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
              取消选择
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <CheckCircle2 className="size-5 text-amber-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{pendingResources.length}</div>
              <div className="text-xs text-gray-500">待审核</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="size-5 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {resources.filter((r) => r.status === "approved").length}
              </div>
              <div className="text-xs text-gray-500">已通过</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <XCircle className="size-5 text-red-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {resources.filter((r) => r.status === "rejected").length}
              </div>
              <div className="text-xs text-gray-500">已驳回</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[180px] max-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="搜索待审核资源..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as ResourceType | "all")}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                {Object.entries(RESOURCE_TYPE_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={collegeFilter} onValueChange={setCollegeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="院系" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部院系</SelectItem>
                {COLLEGES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("")
                setTypeFilter("all")
                setCollegeFilter("all")
              }}
            >
              <RotateCcw className="size-4 mr-1" />
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={selectedIds.length === filteredResources.length && filteredResources.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>资源标题</TableHead>
                <TableHead className="w-20">类型</TableHead>
                <TableHead className="w-28">院系</TableHead>
                <TableHead className="w-24">上传人</TableHead>
                <TableHead className="w-28">提交时间</TableHead>
                <TableHead className="w-48">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(resource.id)}
                      onCheckedChange={() => toggleSelect(resource.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-gray-800 line-clamp-1 max-w-[300px]">
                      {resource.title}
                    </div>
                    {resource.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {resource.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {RESOURCE_TYPE_LABELS[resource.type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-500">{resource.department}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-500">{resource.uploaderName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-400">
                      {resource.createdAt.toLocaleDateString("zh-CN")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => approveResource(resource.id)}
                      >
                        <CheckCircle2 className="size-3 mr-1" />
                        通过
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs text-red-500 hover:text-red-600"
                        onClick={() => {
                          setRejectTarget(resource)
                          setRejectOpen(true)
                          setRejectReason("")
                        }}
                      >
                        <XCircle className="size-3 mr-1" />
                        驳回
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => {
                          setDetailResource(resource)
                          setDetailOpen(true)
                        }}
                      >
                        <Eye className="size-3 mr-1" />
                        查看详情
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredResources.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16 text-gray-400">
                    <CheckCircle2 className="size-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">暂无待审核资源</p>
                    <p className="text-xs mt-1">所有资源已处理完毕</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          {detailResource && (
            <>
              <DialogHeader>
                <DialogTitle>{detailResource.title}</DialogTitle>
                <DialogDescription>
                  上传人：{detailResource.uploaderName} · {detailResource.uploaderDepartment}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                <div>
                  <Label className="text-gray-500">类型</Label>
                  <Badge variant="secondary" className="ml-2">{RESOURCE_TYPE_LABELS[detailResource.type]}</Badge>
                </div>
                <div>
                  <Label className="text-gray-500">描述</Label>
                  <p className="text-sm text-gray-600 mt-1">{detailResource.description || "暂无描述"}</p>
                </div>
                <div>
                  <Label className="text-gray-500">院系</Label>
                  <p className="text-sm">{detailResource.department}</p>
                </div>
                <div>
                  <Label className="text-gray-500">标签</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {detailResource.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-gray-500">提交时间</Label>
                  <p className="text-sm">{detailResource.createdAt.toLocaleDateString("zh-CN")}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>驳回资源</DialogTitle>
            <DialogDescription>
              请输入驳回原因，将通知上传人修改后重提。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>驳回原因</Label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="请输入驳回原因..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (rejectTarget) {
                  rejectResource(rejectTarget.id, rejectReason)
                  setRejectOpen(false)
                  setRejectTarget(null)
                  setRejectReason("")
                }
              }}
              disabled={!rejectReason.trim()}
            >
              确认驳回
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={batchRejectOpen} onOpenChange={setBatchRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>批量驳回</DialogTitle>
            <DialogDescription>
              将对选中的 {selectedIds.length} 个资源进行驳回操作。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>驳回原因</Label>
            <Textarea
              value={batchRejectReason}
              onChange={(e) => setBatchRejectReason(e.target.value)}
              placeholder="请输入驳回原因..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBatchRejectOpen(false)}>
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                batchReject(selectedIds, batchRejectReason)
                setSelectedIds([])
                setBatchRejectOpen(false)
                setBatchRejectReason("")
              }}
              disabled={!batchRejectReason.trim()}
            >
              确认批量驳回
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

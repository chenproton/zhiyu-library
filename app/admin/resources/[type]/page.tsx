"use client"

import { useState, useMemo, use } from "react"
import {
  Search, RotateCcw, Trash2,
  Eye, Pencil, Plus, Upload, BookOpen, X, ChevronRight, Target,
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { useData } from "@/components/providers/data-provider"
import { TagSelector } from "@/components/tag-selector"
import { useToast } from "@/hooks/use-toast"
import { RESOURCE_TYPE_LABELS, RESOURCE_STATUS_LABELS, COLLEGES, ALL_ABILITY_ATTRIBUTES } from "@/lib/types"
import type { ResourceType, ResourceStatus, Resource, AbilityAttribute } from "@/lib/types"
import { mockGranularLessons } from "@/lib/mock-data"

const STATUS_COLORS: Record<ResourceStatus, string> = {
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  approved: "bg-green-50 text-green-600 border-green-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
}

interface TransferOption {
  label: string
  value: string
  subtitle?: string
}

function TransferLessonsSelector({
  options,
  selected,
  onChange,
}: {
  options: TransferOption[]
  selected: string[]
  onChange: (selected: string[]) => void
}) {
  const [leftSearch, setLeftSearch] = useState("")
  const [rightSearch, setRightSearch] = useState("")

  const selectedSet = new Set(selected)

  const leftOptions = useMemo(() => {
    const available = options.filter((o) => !selectedSet.has(o.value))
    if (!leftSearch.trim()) return available
    const q = leftSearch.toLowerCase()
    return available.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.subtitle && o.subtitle.toLowerCase().includes(q))
    )
  }, [options, selected, leftSearch])

  const rightOptions = useMemo(() => {
    const chosen = options.filter((o) => selectedSet.has(o.value))
    if (!rightSearch.trim()) return chosen
    const q = rightSearch.toLowerCase()
    return chosen.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.subtitle && o.subtitle.toLowerCase().includes(q))
    )
  }, [options, selected, rightSearch])

  const moveToRight = (value: string) => {
    if (!selected.includes(value)) onChange([...selected, value])
  }

  const moveToLeft = (value: string) => {
    onChange(selected.filter((v) => v !== value))
  }

  return (
    <div className="grid grid-cols-2 gap-4 h-[360px]">
      <div className="border rounded-lg flex flex-col overflow-hidden">
        <div className="px-3 py-2 border-b bg-gray-50 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">全部颗粒课</span>
          <span className="text-xs text-gray-400">{leftOptions.length}</span>
        </div>
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜索颗粒课..."
              value={leftSearch}
              onChange={(e) => setLeftSearch(e.target.value)}
              className="pl-7 h-8 text-sm"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {leftOptions.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-400 p-4">暂无可用颗粒课</div>
          ) : (
            <div className="p-1">
              {leftOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => moveToRight(option.value)}
                  className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded hover:bg-gray-50 text-left"
                >
                  <div className="min-w-0">
                    <div className="text-sm text-gray-700 truncate">{option.label}</div>
                    {option.subtitle && <div className="text-xs text-gray-400">{option.subtitle}</div>}
                  </div>
                  <ChevronRight className="size-4 text-gray-300 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="border rounded-lg flex flex-col overflow-hidden">
        <div className="px-3 py-2 border-b bg-blue-50 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-700">已关联颗粒课</span>
          <span className="text-xs text-blue-400">{rightOptions.length}</span>
        </div>
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="搜索已关联..."
              value={rightSearch}
              onChange={(e) => setRightSearch(e.target.value)}
              className="pl-7 h-8 text-sm"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {rightOptions.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-400 p-4">暂无已关联颗粒课</div>
          ) : (
            <div className="p-1">
              {rightOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center justify-between gap-2 px-2 py-1.5 rounded bg-blue-50/50 border border-blue-100 mb-1"
                >
                  <div className="min-w-0">
                    <div className="text-sm text-blue-700 truncate">{option.label}</div>
                    {option.subtitle && <div className="text-xs text-blue-400">{option.subtitle}</div>}
                  </div>
                  <button
                    onClick={() => moveToLeft(option.value)}
                    className="shrink-0 p-0.5 rounded hover:bg-blue-100 text-blue-400 hover:text-blue-600"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}

function FileIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
}

export default function ResourceTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params)
  const typeLabel = RESOURCE_TYPE_LABELS[type as ResourceType] || type

  const {
    resources, deleteResource,
    batchDelete,
    updateResource, createResource,
    getTagColor,
  } = useData()
  const { toast } = useToast()

  const [search, setSearch] = useState("")
  const [collegeFilter, setCollegeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | "all">("all")
  const [tagFilter, setTagFilter] = useState<string[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editResource, setEditResource] = useState<Resource | null>(null)
  const [formTitle, setFormTitle] = useState("")
  const [formContent, setFormContent] = useState("")
  const [formDesc, setFormDesc] = useState("")
  const [formTags, setFormTags] = useState<string[]>([])
  const [formKnowledgeCode, setFormKnowledgeCode] = useState("")
  const [formKnowledgeCourses, setFormKnowledgeCourses] = useState<string[]>([])
  const [formAbilityAttribute, setFormAbilityAttribute] = useState<AbilityAttribute | "">("")
  // 类型特定字段
  const [formVenueLocation, setFormVenueLocation] = useState("")
  const [formVenueOpenTime, setFormVenueOpenTime] = useState("")
  const [formVenueCapacity, setFormVenueCapacity] = useState("")
  const [formVenueContact, setFormVenueContact] = useState("")
  const [formEquipmentLocation, setFormEquipmentLocation] = useState("")
  const [formEquipmentQuantity, setFormEquipmentQuantity] = useState("")
  const [formSoftwareVersion, setFormSoftwareVersion] = useState("")
  const [formSoftwareDownloadUrl, setFormSoftwareDownloadUrl] = useState("")
  const [formSoftwareLicense, setFormSoftwareLicense] = useState("")
  const [formSoftwareInstallerUrl, setFormSoftwareInstallerUrl] = useState("")
  const [formLinkUrl, setFormLinkUrl] = useState("")
  const [formFileUrl, setFormFileUrl] = useState("")
  const [batchUploadOpen, setBatchUploadOpen] = useState(false)

  const [detailOpen, setDetailOpen] = useState(false)
  const [detailResource, setDetailResource] = useState<Resource | null>(null)
  const [coursesEditOpen, setCoursesEditOpen] = useState(false)
  const [coursesEditTarget, setCoursesEditTarget] = useState<Resource | null>(null)
  const [coursesEditValue, setCoursesEditValue] = useState<string[]>([])
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null)

  const filtered = useMemo(() => {
    let list = resources.filter((r) => r.type === type)
    if (collegeFilter !== "all") list = list.filter((r) => r.department === collegeFilter)
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((r) =>
        r.title.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        r.uploaderName.toLowerCase().includes(q) ||
        (r.knowledgeCode && r.knowledgeCode.toLowerCase().includes(q)) ||
        (r.knowledgeCourses && r.knowledgeCourses.includes(q)) ||
        (r.abilityAttribute && r.abilityAttribute.toLowerCase().includes(q))
      )
    }
    if (tagFilter.length > 0) {
      list = list.filter((r) => tagFilter.some((t) => r.tags.includes(t)))
    }
    return list
  }, [resources, type, collegeFilter, statusFilter, search, tagFilter])

  const allUsedTags = useMemo(() => {
    const tagCounts = new Map<string, number>()
    const list = resources.filter((r) => r.type === type)
    for (const r of list) {
      for (const t of r.tags) {
        tagCounts.set(t, (tagCounts.get(t) || 0) + 1)
      }
    }
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }))
  }, [resources, type])

  const toggleSelect = (id: string) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  const toggleSelectAll = () => { if (selectedIds.length === filtered.length) setSelectedIds([]); else setSelectedIds(filtered.map((r) => r.id)) }

  const resetForm = () => {
    setFormTitle(""); setFormContent(""); setFormDesc("");
    setFormTags([]);
    setFormKnowledgeCode(""); setFormKnowledgeCourses([]);
    setFormAbilityAttribute("");
    setFormVenueLocation(""); setFormVenueOpenTime(""); setFormVenueCapacity(""); setFormVenueContact("");
    setFormEquipmentLocation(""); setFormEquipmentQuantity("");
    setFormSoftwareVersion(""); setFormSoftwareDownloadUrl(""); setFormSoftwareLicense(""); setFormSoftwareInstallerUrl("");
    setFormLinkUrl(""); setFormFileUrl("");
  }

  const openAdd = () => {
    resetForm()
    setAddOpen(true)
  }

  const openEdit = (resource: Resource) => {
    setEditResource(resource)
    setFormTitle(resource.title)
    setFormContent(resource.content)
    setFormDesc(resource.description)
    setFormTags([...resource.tags])
    setFormKnowledgeCode(resource.knowledgeCode || "")
    setFormKnowledgeCourses(resource.knowledgeCourses?.split(',').filter(Boolean) || [])
    setFormAbilityAttribute(resource.abilityAttribute || "")
    setFormVenueLocation(resource.venueLocation || "")
    setFormVenueOpenTime(resource.venueOpenTime || "")
    setFormVenueCapacity(resource.venueCapacity?.toString() || "")
    setFormVenueContact(resource.venueContact || "")
    setFormEquipmentLocation(resource.equipmentLocation || "")
    setFormEquipmentQuantity(resource.equipmentQuantity?.toString() || "")
    setFormSoftwareVersion(resource.softwareVersion || "")
    setFormSoftwareDownloadUrl(resource.softwareDownloadUrl || "")
    setFormSoftwareLicense(resource.softwareLicense || "")
    setFormSoftwareInstallerUrl(resource.softwareInstallerUrl || "")
    setFormLinkUrl(resource.linkUrl || "")
    setFormFileUrl(resource.fileUrl || "")
    setEditOpen(true)
  }

  const buildFormData = (): Partial<ResourceFormData> => {
    const base: Partial<ResourceFormData> = {
      title: formTitle.trim(),
      description: formDesc.trim(),
      tags: formTags.filter(t => t.length > 0).slice(0, 10),
    }
    switch (type) {
      case "knowledge-point":
        return {
          ...base,
          content: formTitle.trim(),
          knowledgeCode: formKnowledgeCode.trim() || undefined,
          knowledgeCourses: formKnowledgeCourses.join(',') || undefined,
        }
      case "ability-point":
        return {
          ...base,
          content: formTitle.trim(),
          abilityAttribute: formAbilityAttribute || undefined,
        }
      case "link":
        return { ...base, content: formLinkUrl.trim(), linkUrl: formLinkUrl.trim() }
      case "venue":
        return {
          ...base,
          content: formVenueLocation.trim(),
          venueLocation: formVenueLocation.trim() || undefined,
          venueOpenTime: formVenueOpenTime.trim() || undefined,
          venueCapacity: formVenueCapacity ? Number(formVenueCapacity) : undefined,
          venueContact: formVenueContact.trim() || undefined,
        }
      case "equipment":
        return {
          ...base,
          content: formTitle.trim(),
          equipmentLocation: formEquipmentLocation.trim() || undefined,
          equipmentQuantity: formEquipmentQuantity ? Number(formEquipmentQuantity) : undefined,
        }
      case "software":
        return {
          ...base,
          content: formTitle.trim(),
          softwareVersion: formSoftwareVersion.trim() || undefined,
          softwareDownloadUrl: formSoftwareDownloadUrl.trim() || undefined,
          softwareLicense: formSoftwareLicense.trim() || undefined,
          softwareInstallerUrl: formSoftwareInstallerUrl.trim() || undefined,
        }
      case "simulation":
        return { ...base, content: formTitle.trim() }
      case "document":
      case "spreadsheet":
      case "image":
      case "audio":
      case "video":
      case "other":
        return { ...base, content: formFileUrl.trim(), fileUrl: formFileUrl.trim() || undefined }
      default:
        return { ...base, content: formTitle.trim() }
    }
  }

  const handleAdd = () => {
    if (!formTitle.trim()) return
    if (type === "link" && !formLinkUrl.trim()) return
    createResource(buildFormData() as ResourceFormData)
    setAddOpen(false)
  }

  const handleEdit = () => {
    if (editResource && formTitle.trim()) {
      updateResource(editResource.id, buildFormData())
      setEditOpen(false); setEditResource(null)
    }
  }

  const openCoursesEdit = (resource: Resource) => {
    setCoursesEditTarget(resource)
    setCoursesEditValue(resource.knowledgeCourses?.split(',').filter(Boolean) || [])
    setCoursesEditOpen(true)
  }

  const handleCoursesEditSave = () => {
    if (coursesEditTarget) {
      updateResource(coursesEditTarget.id, {
        knowledgeCourses: coursesEditValue.join(',') || undefined,
      })
      setCoursesEditOpen(false)
      setCoursesEditTarget(null)
      setCoursesEditValue([])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800 mb-1">{typeLabel}资源</h1>
          <p className="text-sm text-gray-500">管理全平台{typeLabel}类资源 · 共 {filtered.length} 个</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={openAdd}><Plus className="size-4 mr-1" />新增{typeLabel}</Button>
          <Button size="sm" variant="outline" onClick={() => setBatchUploadOpen(true)}><Upload className="size-4 mr-1" />批量上传</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[180px] max-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input placeholder={`搜索${typeLabel}资源...`} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={collegeFilter} onValueChange={setCollegeFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="院系" /></SelectTrigger>
              <SelectContent><SelectItem value="all">全部院系</SelectItem>{COLLEGES.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ResourceStatus | "all")}>
              <SelectTrigger className="w-[120px]"><SelectValue placeholder="状态" /></SelectTrigger>
              <SelectContent><SelectItem value="all">全部状态</SelectItem><SelectItem value="pending">待审核</SelectItem><SelectItem value="approved">已通过</SelectItem><SelectItem value="rejected">已驳回</SelectItem></SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => { setSearch(""); setCollegeFilter("all"); setStatusFilter("all"); setTagFilter([]) }}><RotateCcw className="size-4 mr-1" />重置</Button>
          </div>
          {allUsedTags.length > 0 && (
            <div className="flex items-start gap-3 mt-3 pt-3 border-t border-dashed">
              <span className="text-xs text-gray-400 mt-1 shrink-0">标签：</span>
              <div className="flex gap-1.5 flex-wrap">
                {allUsedTags.map(({ name, count }) => {
                  const active = tagFilter.includes(name)
                  const color = getTagColor(name)
                  return (
                    <span
                      key={name}
                      onClick={() => {
                        if (active) setTagFilter(tagFilter.filter(t => t !== name))
                        else setTagFilter([...tagFilter, name])
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors border"
                      style={{
                        color: active ? '#fff' : color,
                        backgroundColor: active ? color : `${color}10`,
                        borderColor: active ? color : `${color}30`,
                      }}
                    >
                      {name}
                      <span style={{ opacity: active ? 0.7 : 0.4 }}>{count}</span>
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedIds.length > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-3 flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-600">已选 {selectedIds.length} 项</span>
            <Button size="sm" variant="destructive" onClick={() => { batchDelete(selectedIds); setSelectedIds([]) }}><Trash2 className="size-4 mr-1" />批量删除</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={selectedIds.length === filtered.length && filtered.length > 0} onCheckedChange={toggleSelectAll} /></TableHead>
                <TableHead>资源标题</TableHead>
                <TableHead className="w-24">院系</TableHead>
                <TableHead className="w-24">上传人</TableHead>
                <TableHead className="w-20">状态</TableHead>
                <TableHead className="w-20">使用次数</TableHead>
                <TableHead className="w-28">上传时间</TableHead>
                <TableHead className="w-48">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell><Checkbox checked={selectedIds.includes(resource.id)} onCheckedChange={() => toggleSelect(resource.id)} /></TableCell>
                  <TableCell><div className="text-sm font-medium text-gray-800 line-clamp-1 max-w-[300px]">{resource.title}</div></TableCell>
                  <TableCell><span className="text-xs text-gray-500">{resource.department}</span></TableCell>
                  <TableCell><span className="text-xs text-gray-500">{resource.uploaderName}</span></TableCell>
                  <TableCell><Badge className={`text-xs border ${STATUS_COLORS[resource.status]}`}>{RESOURCE_STATUS_LABELS[resource.status]}</Badge></TableCell>
                  <TableCell><span className="text-xs text-gray-500">{resource.usageCount}</span></TableCell>
                  <TableCell><span className="text-xs text-gray-400">{resource.createdAt.toLocaleDateString("zh-CN")}</span></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setDetailResource(resource); setDetailOpen(true) }}><Eye className="size-3 mr-1" />预览</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => openEdit(resource)}><Pencil className="size-3 mr-1" />编辑</Button>
                      {type === "knowledge-point" && (
                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => openCoursesEdit(resource)}><BookOpen className="size-3 mr-1" />关联颗粒课</Button>
                      )}
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-red-500" onClick={() => { setDeleteTarget(resource); setDeleteConfirmOpen(true) }}><Trash2 className="size-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={8} className="text-center py-12 text-gray-400">暂无{typeLabel}资源</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className={`${type === "knowledge-point" ? "max-w-2xl" : "max-w-md"} max-h-[80vh] overflow-y-auto`}>
          <DialogHeader>
            <DialogTitle>上传{typeLabel}资源到公共库</DialogTitle>
            <DialogDescription>补充本地资源，上传后将进入待审核状态</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-2">
            {!["knowledge-point", "ability-point"].includes(type) && (
              <div>
                <Label>资源名称 <span className="text-red-500">*</span></Label>
                <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="输入资源名称" className="mt-1.5" maxLength={50} />
              </div>
            )}

            {type === "link" && (
              <div>
                <Label>URL 地址</Label>
                <Input value={formLinkUrl} onChange={(e) => setFormLinkUrl(e.target.value)} placeholder="https://..." className="mt-1.5" />
              </div>
            )}

            {type === "venue" && (
              <>
                <div><Label>场地地址</Label><Input value={formVenueLocation} onChange={(e) => setFormVenueLocation(e.target.value)} placeholder="输入场地详细地址" className="mt-1.5" /></div>
                <div><Label>开放时间</Label><Input value={formVenueOpenTime} onChange={(e) => setFormVenueOpenTime(e.target.value)} placeholder="例如：周一至周五 09:00-18:00" className="mt-1.5" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>容纳人数</Label><Input value={formVenueCapacity} onChange={(e) => setFormVenueCapacity(e.target.value)} placeholder="例如：50" className="mt-1.5" /></div>
                  <div><Label>联系人/电话</Label><Input value={formVenueContact} onChange={(e) => setFormVenueContact(e.target.value)} placeholder="输入联系人或电话" className="mt-1.5" /></div>
                </div>
              </>
            )}

            {type === "equipment" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>所在位置</Label><Input value={formEquipmentLocation} onChange={(e) => setFormEquipmentLocation(e.target.value)} placeholder="输入设备所在位置" className="mt-1.5" /></div>
                  <div><Label>数量</Label><Input value={formEquipmentQuantity} onChange={(e) => setFormEquipmentQuantity(e.target.value)} placeholder="例如：5" className="mt-1.5" /></div>
                </div>
              </>
            )}

            {type === "software" && (
              <>
                <div><Label>版本号</Label><Input value={formSoftwareVersion} onChange={(e) => setFormSoftwareVersion(e.target.value)} placeholder="例如：v2.1.0" className="mt-1.5" /></div>
                <div><Label>下载链接</Label><Input value={formSoftwareDownloadUrl} onChange={(e) => setFormSoftwareDownloadUrl(e.target.value)} placeholder="https://..." className="mt-1.5" /></div>
                <div><Label>授权信息</Label><Input value={formSoftwareLicense} onChange={(e) => setFormSoftwareLicense(e.target.value)} placeholder="例如：MIT / 商业授权 / 校内授权" className="mt-1.5" /></div>
                <div className="space-y-1.5">
                  <Label>安装包</Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center space-y-2 hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">点击或拖拽上传安装包</p>
                      <p className="text-xs text-gray-500 mt-1">支持 exe、zip、dmg 等格式</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {type === "knowledge-point" && (
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-700">知识点名称 <span className="text-red-500">*</span></Label>
                <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="输入知识点名称" />
              </div>
            )}

            {type === "knowledge-point" && (
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-700">编码</Label>
                <Input value={formKnowledgeCode} onChange={(e) => setFormKnowledgeCode(e.target.value)} placeholder="例如：KP-001" />
              </div>
            )}

            {type === "ability-point" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-700">能力点名称 <span className="text-red-500">*</span></Label>
                  <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="输入能力点名称" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-gray-700">能力属性</Label>
                  <Select value={formAbilityAttribute} onValueChange={(v) => setFormAbilityAttribute(v as AbilityAttribute)}>
                    <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      {ALL_ABILITY_ATTRIBUTES.map((attr) => (
                        <SelectItem key={attr} value={attr}>{attr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {["document", "spreadsheet", "image", "audio", "video", "archive", "other"].includes(type) && (
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-700">资源文件 <span className="text-red-500">*</span></Label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center space-y-3 hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">点击或拖拽上传文件</p>
                    <p className="text-xs text-gray-500 mt-1">支持多种格式，最大 100MB</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-sm text-gray-700">{type === "ability-point" ? "能力点描述" : "资源描述"}</Label>
              <Textarea placeholder={type === "ability-point" ? "输入能力点描述" : "输入资源简介、用途说明等"} rows={2} onChange={(e) => setFormDesc(e.target.value)} value={formDesc} maxLength={500} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-gray-700">标签</Label>
              <TagSelector selected={formTags} onChange={setFormTags} />
            </div>

            {type === "knowledge-point" && (
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-700">关联颗粒课</Label>
                <TransferLessonsSelector
                  options={mockGranularLessons.map((l) => ({ label: l.name, value: l.id, subtitle: l.code }))}
                  selected={formKnowledgeCourses}
                  onChange={setFormKnowledgeCourses}
                />
              </div>
            )}
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setAddOpen(false)}>取消</Button>
             <Button onClick={handleAdd} disabled={!formTitle.trim() || (type === "link" && !formLinkUrl.trim())}>
              上传并提交审核
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className={`${type === "knowledge-point" ? "max-w-2xl" : "max-w-lg"} max-h-[80vh] overflow-y-auto`}>
          <DialogHeader><DialogTitle>编辑资源</DialogTitle></DialogHeader>
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-sm text-gray-700">{typeLabel}名称</Label>
              <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} maxLength={50} />
            </div>

            {type === "knowledge-point" && (
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-700">编码</Label>
                <Input value={formKnowledgeCode} onChange={(e) => setFormKnowledgeCode(e.target.value)} placeholder="例如：KP-001" />
              </div>
            )}

            {type === "ability-point" && (
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-700">能力属性</Label>
                <Select value={formAbilityAttribute} onValueChange={(v) => setFormAbilityAttribute(v as AbilityAttribute)}>
                  <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                  <SelectContent>
                    {ALL_ABILITY_ATTRIBUTES.map((attr) => (
                      <SelectItem key={attr} value={attr}>{attr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {type === "link" && (
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-700">URL 地址</Label>
                <Input value={formLinkUrl} onChange={(e) => setFormLinkUrl(e.target.value)} placeholder="https://..." />
              </div>
            )}

            {type === "venue" && (
              <>
                <div className="space-y-1.5"><Label className="text-sm text-gray-700">场地地址</Label><Input value={formVenueLocation} onChange={(e) => setFormVenueLocation(e.target.value)} placeholder="输入场地详细地址" /></div>
                <div className="space-y-1.5"><Label className="text-sm text-gray-700">开放时间</Label><Input value={formVenueOpenTime} onChange={(e) => setFormVenueOpenTime(e.target.value)} placeholder="例如：周一至周五 09:00-18:00" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label className="text-sm text-gray-700">容纳人数</Label><Input value={formVenueCapacity} onChange={(e) => setFormVenueCapacity(e.target.value)} placeholder="例如：50" /></div>
                  <div className="space-y-1.5"><Label className="text-sm text-gray-700">联系人/电话</Label><Input value={formVenueContact} onChange={(e) => setFormVenueContact(e.target.value)} placeholder="输入联系人或电话" /></div>
                </div>
              </>
            )}

            {type === "equipment" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-sm text-gray-700">所在位置</Label><Input value={formEquipmentLocation} onChange={(e) => setFormEquipmentLocation(e.target.value)} placeholder="输入设备所在位置" /></div>
                <div className="space-y-1.5"><Label className="text-sm text-gray-700">数量</Label><Input value={formEquipmentQuantity} onChange={(e) => setFormEquipmentQuantity(e.target.value)} placeholder="例如：5" /></div>
              </div>
            )}

            {type === "software" && (
              <>
                <div className="space-y-1.5"><Label className="text-sm text-gray-700">版本号</Label><Input value={formSoftwareVersion} onChange={(e) => setFormSoftwareVersion(e.target.value)} placeholder="例如：v2.1.0" /></div>
                <div className="space-y-1.5"><Label className="text-sm text-gray-700">下载链接</Label><Input value={formSoftwareDownloadUrl} onChange={(e) => setFormSoftwareDownloadUrl(e.target.value)} placeholder="https://..." /></div>
                <div className="space-y-1.5"><Label className="text-sm text-gray-700">授权信息</Label><Input value={formSoftwareLicense} onChange={(e) => setFormSoftwareLicense(e.target.value)} placeholder="例如：MIT / 商业授权 / 校内授权" /></div>
                <div className="space-y-1.5"><Label className="text-sm text-gray-700">安装包</Label><Input value={formSoftwareInstallerUrl} onChange={(e) => setFormSoftwareInstallerUrl(e.target.value)} placeholder="/files/installer.zip" /></div>
              </>
            )}

            <div className="space-y-1.5">
              <Label className="text-sm text-gray-700">{type === "ability-point" ? "能力点描述" : "资源描述"}</Label>
              <Textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} maxLength={500} rows={3} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-gray-700">标签</Label>
              <TagSelector selected={formTags} onChange={setFormTags} />
            </div>

            {type === "knowledge-point" && (
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-700">关联颗粒课</Label>
                <TransferLessonsSelector
                  options={mockGranularLessons.map((l) => ({ label: l.name, value: l.id, subtitle: l.code }))}
                  selected={formKnowledgeCourses}
                  onChange={setFormKnowledgeCourses}
                />
              </div>
            )}
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setEditOpen(false)}>取消</Button>
            <Button onClick={handleEdit}>保存修改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={coursesEditOpen} onOpenChange={setCoursesEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>关联颗粒课</DialogTitle></DialogHeader>
          <TransferLessonsSelector
            options={mockGranularLessons.map((l) => ({ label: l.name, value: l.id, subtitle: l.code }))}
            selected={coursesEditValue}
            onChange={setCoursesEditValue}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCoursesEditOpen(false)}>取消</Button>
            <Button onClick={handleCoursesEditSave}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={batchUploadOpen} onOpenChange={setBatchUploadOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>批量上传{typeLabel}资源</DialogTitle><DialogDescription>支持一次性上传多个{typeLabel}资源文件（演示）</DialogDescription></DialogHeader>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="size-10 mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500 mb-1">点击或拖拽文件到此区域上传</p>
            <p className="text-xs text-gray-400">支持多种文件格式</p>
          </div>
          <div className="space-y-2 mt-2">
            <div className="text-xs text-gray-400 flex items-center gap-2 py-2 px-3 bg-gray-50 rounded"><FileIcon className="size-3 text-green-500" />示例文件1 ({typeLabel}) <span className="ml-auto text-green-500">就绪</span></div>
            <div className="text-xs text-gray-400 flex items-center gap-2 py-2 px-3 bg-gray-50 rounded"><FileIcon className="size-3 text-green-500" />示例文件2 ({typeLabel}) <span className="ml-auto text-green-500">就绪</span></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBatchUploadOpen(false)}>取消</Button>
            <Button>确认上传</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          {detailResource && (
            <>
              <DialogHeader><DialogTitle>{detailResource.title}</DialogTitle></DialogHeader>
              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-2"><Badge variant="secondary">{RESOURCE_TYPE_LABELS[detailResource.type]}</Badge><Badge className={STATUS_COLORS[detailResource.status]}>{RESOURCE_STATUS_LABELS[detailResource.status]}</Badge></div>
                {detailResource.type === "knowledge-point" && (
                  <>
                    <div><Label className="text-gray-500">知识点名称</Label><p className="text-sm">{detailResource.title}</p></div>
                    <div><Label className="text-gray-500">知识点描述</Label><p className="text-sm">{detailResource.description}</p></div>
                    <div className="bg-blue-50 rounded-lg p-3 space-y-3">
                      <div className="text-xs font-medium text-blue-700">知识点信息</div>
                      {detailResource.knowledgeCode && <div className="text-xs text-blue-600"><span className="text-blue-400">编码：</span>{detailResource.knowledgeCode}</div>}
                      <div>
                        <div className="text-xs text-blue-600 mb-2"><span className="text-blue-400">关联颗粒课：</span></div>
                        <div className="flex flex-wrap gap-2">
                          {detailResource.knowledgeCourses?.split(',').filter(Boolean).map((id) => {
                            const lesson = mockGranularLessons.find((l) => l.id === id)
                            if (!lesson) return null
                            return (
                              <button
                                key={id}
                                onClick={() => toast({ title: `即将跳转：${lesson.name}`, description: '颗粒课详情页面开发中' })}
                                className="text-left bg-white border border-blue-200 rounded-lg p-2 min-w-[140px] hover:shadow-md hover:border-blue-300 transition-all"
                              >
                                <div className="text-xs font-medium text-blue-700 line-clamp-1">{lesson.name}</div>
                                <div className="text-[10px] text-blue-400">{lesson.code}</div>
                              </button>
                            )
                          })}
                          {!detailResource.knowledgeCourses && <span className="text-xs text-blue-400">暂无关联颗粒课</span>}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {detailResource.type === "ability-point" && (
                  <>
                    <div><Label className="text-gray-500">能力点名称</Label><p className="text-sm">{detailResource.title}</p></div>
                    <div><Label className="text-gray-500">能力点描述</Label><p className="text-sm">{detailResource.description}</p></div>
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 text-purple-700">
                        <Target className="size-4" />
                        <span className="text-sm font-semibold">能力点信息</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/70 rounded-lg p-2.5">
                          <div className="text-[10px] text-purple-400 mb-0.5">能力属性</div>
                          <div className="text-sm font-medium text-purple-700">{detailResource.abilityAttribute || "-"}</div>
                        </div>
                        <div className="bg-white/70 rounded-lg p-2.5">
                          <div className="text-[10px] text-purple-400 mb-0.5">状态</div>
                          <div className="text-sm font-medium text-purple-700">{RESOURCE_STATUS_LABELS[detailResource.status]}</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {detailResource.type === "link" && (
                  <div className="bg-cyan-50 rounded-lg p-3 space-y-2">
                    <div className="text-xs font-medium text-cyan-700">链接信息</div>
                    <div className="text-xs text-cyan-600"><span className="text-cyan-400">URL：</span>{detailResource.linkUrl || "-"}</div>
                  </div>
                )}
                {detailResource.type === "venue" && (
                  <div className="bg-orange-50 rounded-lg p-3 space-y-2">
                    <div className="text-xs font-medium text-orange-700">场地信息</div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-orange-600">
                      <div><span className="text-orange-400">场地地址：</span>{detailResource.venueLocation || "-"}</div>
                      <div><span className="text-orange-400">开放时间：</span>{detailResource.venueOpenTime || "-"}</div>
                      <div><span className="text-orange-400">容纳人数：</span>{detailResource.venueCapacity || "-"}</div>
                      <div><span className="text-orange-400">联系人/电话：</span>{detailResource.venueContact || "-"}</div>
                    </div>
                  </div>
                )}
                {detailResource.type === "equipment" && (
                  <div className="bg-rose-50 rounded-lg p-3 space-y-2">
                    <div className="text-xs font-medium text-rose-700">设备信息</div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-rose-600">
                      <div><span className="text-rose-400">所在位置：</span>{detailResource.equipmentLocation || "-"}</div>
                      <div><span className="text-rose-400">数量：</span>{detailResource.equipmentQuantity || "-"}</div>
                    </div>
                  </div>
                )}
                {detailResource.type === "software" && (
                  <div className="bg-purple-50 rounded-lg p-3 space-y-2">
                    <div className="text-xs font-medium text-purple-700">软件信息</div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-purple-600">
                      <div><span className="text-purple-400">版本号：</span>{detailResource.softwareVersion || "-"}</div>
                      <div><span className="text-purple-400">授权信息：</span>{detailResource.softwareLicense || "-"}</div>
                      <div className="col-span-2"><span className="text-purple-400">下载链接：</span>{detailResource.softwareDownloadUrl || "-"}</div>
                      <div className="col-span-2"><span className="text-purple-400">安装包：</span>{detailResource.softwareInstallerUrl || "-"}</div>
                    </div>
                  </div>
                )}
                {!["knowledge-point", "ability-point", "link", "venue", "equipment", "software"].includes(detailResource.type) && (
                  <div><Label className="text-gray-500">{type === "ability-point" ? "能力点描述" : "资源描述"}</Label><p className="text-sm">{detailResource.description}</p></div>
                )}
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="text-xs font-medium text-gray-600">元信息</div>
                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
                    <div><span className="text-gray-400">创建人：</span>{detailResource.uploaderName}</div>
                    <div><span className="text-gray-400">所属院系：</span>{detailResource.uploaderDepartment}</div>
                    <div><span className="text-gray-400">创建时间：</span>{detailResource.createdAt.toLocaleString("zh-CN")}</div>
                    <div><span className="text-gray-400">最后更新：</span>{detailResource.updatedAt.toLocaleString("zh-CN")}</div>
                  </div>
                </div>
                {detailResource.rejectReason && <p className="text-sm text-red-600">驳回原因：{detailResource.rejectReason}</p>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>确认删除</DialogTitle></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>取消</Button><Button variant="destructive" onClick={() => { if (deleteTarget) { deleteResource(deleteTarget.id); setDeleteConfirmOpen(false); setDeleteTarget(null) } }}>确认删除</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

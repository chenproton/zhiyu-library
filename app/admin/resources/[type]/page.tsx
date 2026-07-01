"use client"

import { useState, useMemo, use } from "react"
import {
  Search, RotateCcw, CheckCircle2, XCircle, Trash2,
  Eye, Pencil, Plus, Upload,
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
import { MultiSelectSearch } from "@/components/ui/multi-select-search"
import { RESOURCE_TYPE_LABELS, RESOURCE_STATUS_LABELS, COLLEGES, ALL_ABILITY_ATTRIBUTES, ABILITY_MASTERY_LABELS, ABILITY_MASTERY_DESCRIPTIONS, ABILITY_DOMAINS } from "@/lib/types"
import type { ResourceType, ResourceStatus, Resource, AbilityAttribute, AbilityMastery } from "@/lib/types"
import { mockGranularLessons } from "@/lib/mock-data"

const STATUS_COLORS: Record<ResourceStatus, string> = {
  pending: "bg-amber-50 text-amber-600 border-amber-200",
  approved: "bg-green-50 text-green-600 border-green-200",
  rejected: "bg-red-50 text-red-600 border-red-200",
}

function FileIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
}

export default function ResourceTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = use(params)
  const typeLabel = RESOURCE_TYPE_LABELS[type as ResourceType] || type

  const {
    resources, approveResource, rejectResource, deleteResource,
    batchApprove, batchReject, batchDelete,
    updateResource, createResource,
  } = useData()

  const [search, setSearch] = useState("")
  const [collegeFilter, setCollegeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState<ResourceStatus | "all">("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editResource, setEditResource] = useState<Resource | null>(null)
  const [formTitle, setFormTitle] = useState("")
  const [formContent, setFormContent] = useState("")
  const [formDesc, setFormDesc] = useState("")
  const [formTags, setFormTags] = useState("")
  const [formKnowledgeCode, setFormKnowledgeCode] = useState("")
  const [formKnowledgeCourses, setFormKnowledgeCourses] = useState<string[]>([])
  const [formAbilityDomain, setFormAbilityDomain] = useState("")
  const [formAbilityCode, setFormAbilityCode] = useState("")
  const [formAbilityAttribute, setFormAbilityAttribute] = useState<AbilityAttribute | "">("")
  const [formAbilityMastery, setFormAbilityMastery] = useState<AbilityMastery | "">("")
  const [formAbilityStandard, setFormAbilityStandard] = useState("")
  const [batchUploadOpen, setBatchUploadOpen] = useState(false)

  const [detailOpen, setDetailOpen] = useState(false)
  const [detailResource, setDetailResource] = useState<Resource | null>(null)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectTarget, setRejectTarget] = useState<Resource | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [batchRejectOpen, setBatchRejectOpen] = useState(false)
  const [batchRejectReason, setBatchRejectReason] = useState("")
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
        (r.abilityDomain && r.abilityDomain.toLowerCase().includes(q)) ||
        (r.abilityCode && r.abilityCode.toLowerCase().includes(q)) ||
        (r.abilityStandard && r.abilityStandard.toLowerCase().includes(q))
      )
    }
    return list
  }, [resources, type, collegeFilter, statusFilter, search])

  const toggleSelect = (id: string) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  const toggleSelectAll = () => { if (selectedIds.length === filtered.length) setSelectedIds([]); else setSelectedIds(filtered.map((r) => r.id)) }

  const openAdd = () => {
    setFormTitle(""); setFormContent(""); setFormDesc(""); setFormTags("");
    setFormKnowledgeCode(""); setFormKnowledgeCourses([]);
    setFormAbilityDomain(""); setFormAbilityCode(""); setFormAbilityAttribute(""); setFormAbilityMastery(""); setFormAbilityStandard("");
    setAddOpen(true)
  }

  const openEdit = (resource: Resource) => {
    setEditResource(resource)
    setFormTitle(resource.title)
    setFormContent(resource.content)
    setFormDesc(resource.description)
    setFormTags(resource.tags.join("，"))
    setFormKnowledgeCode(resource.knowledgeCode || "")
    setFormKnowledgeCourses(resource.knowledgeCourses?.split(',').filter(Boolean) || [])
    setFormAbilityDomain(resource.abilityDomain || "")
    setFormAbilityCode(resource.abilityCode || "")
    setFormAbilityAttribute(resource.abilityAttribute || "")
    setFormAbilityMastery(resource.abilityMastery || "")
    setFormAbilityStandard(resource.abilityStandard || "")
    setEditOpen(true)
  }

  const handleAdd = () => {
    if (!formTitle.trim() || !formContent.trim()) return
    createResource({
      title: formTitle.trim(), type: type as ResourceType, content: formContent.trim(),
      description: formDesc.trim(),
      tags: formTags.split(/[,，]/).map((t) => t.trim()).filter((t) => t.length > 0).slice(0, 5),
      knowledgeCode: formKnowledgeCode.trim() || undefined,
      knowledgeCourses: formKnowledgeCourses.join(',') || undefined,
      abilityDomain: formAbilityDomain || undefined,
      abilityCode: formAbilityCode.trim() || undefined,
      abilityAttribute: formAbilityAttribute || undefined,
      abilityMastery: formAbilityMastery || undefined,
      abilityStandard: formAbilityStandard.trim() || undefined,
    })
    setAddOpen(false)
  }

  const handleEdit = () => {
    if (editResource && formTitle.trim()) {
      updateResource(editResource.id, {
        title: formTitle.trim(), description: formDesc.trim(),
        tags: formTags.split(/[,，]/).map((t) => t.trim()).filter((t) => t.length > 0).slice(0, 5),
        knowledgeCode: formKnowledgeCode.trim() || undefined,
        knowledgeCourses: formKnowledgeCourses.join(',') || undefined,
        abilityDomain: formAbilityDomain || undefined,
        abilityCode: formAbilityCode.trim() || undefined,
        abilityAttribute: formAbilityAttribute || undefined,
        abilityMastery: formAbilityMastery || undefined,
        abilityStandard: formAbilityStandard.trim() || undefined,
      })
      setEditOpen(false); setEditResource(null)
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
            <Button variant="outline" size="sm" onClick={() => { setSearch(""); setCollegeFilter("all"); setStatusFilter("all") }}><RotateCcw className="size-4 mr-1" />重置</Button>
          </div>
        </CardContent>
      </Card>

      {selectedIds.length > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-3 flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-600">已选 {selectedIds.length} 项</span>
            <Button size="sm" onClick={() => { batchApprove(selectedIds); setSelectedIds([]) }}><CheckCircle2 className="size-4 mr-1" />批量通过</Button>
            <Button size="sm" variant="outline" onClick={() => setBatchRejectOpen(true)}><XCircle className="size-4 mr-1" />批量驳回</Button>
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
                      {resource.status === "pending" && (
                        <>
                          <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => approveResource(resource.id)}><CheckCircle2 className="size-3 mr-1" />通过</Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-red-500" onClick={() => { setRejectTarget(resource); setRejectOpen(true); setRejectReason("") }}><XCircle className="size-3 mr-1" />驳回</Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setDetailResource(resource); setDetailOpen(true) }}><Eye className="size-3 mr-1" />预览</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => openEdit(resource)}><Pencil className="size-3 mr-1" />编辑</Button>
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
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>上传{typeLabel}资源到公共库</DialogTitle>
            <DialogDescription>补充本地资源，上传后将进入待审核状态</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>资源名称 <span className="text-red-500">*</span></Label>
              <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="输入资源名称" className="mt-1.5" maxLength={50} />
            </div>

            {type === "link" && (
              <div>
                <Label>URL 地址</Label>
                <Input value={formContent} onChange={(e) => setFormContent(e.target.value)} placeholder="https://..." className="mt-1.5" />
              </div>
            )}

            {type === "venue" && (
              <>
                <div><Label>场地地址</Label><Input value={formContent} onChange={(e) => setFormContent(e.target.value)} placeholder="输入场地详细地址" className="mt-1.5" /></div>
                <div><Label>开放时间</Label><Input placeholder="例如：周一至周五 09:00-18:00" className="mt-1.5" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>容纳人数</Label><Input type="number" placeholder="例如：50" className="mt-1.5" /></div>
                  <div><Label>联系人/电话</Label><Input placeholder="输入联系人或电话" className="mt-1.5" /></div>
                </div>
              </>
            )}

            {type === "equipment" && (
              <>
                <div><Label>设备名称</Label><Input value={formContent} onChange={(e) => setFormContent(e.target.value)} placeholder="输入设备名称" className="mt-1.5" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>所在位置</Label><Input placeholder="输入设备所在位置" className="mt-1.5" /></div>
                  <div><Label>数量</Label><Input type="number" placeholder="例如：5" className="mt-1.5" /></div>
                </div>
              </>
            )}

            {type === "software" && (
              <>
                <div><Label>软件名称</Label><Input value={formContent} onChange={(e) => setFormContent(e.target.value)} placeholder="输入软件名称" className="mt-1.5" /></div>
                <div><Label>版本号</Label><Input placeholder="例如：v2.1.0" className="mt-1.5" /></div>
                <div><Label>下载链接</Label><Input placeholder="https://..." className="mt-1.5" /></div>
                <div><Label>授权信息</Label><Input placeholder="例如：MIT / 商业授权 / 校内授权" className="mt-1.5" /></div>
              </>
            )}

            {type === "simulation" && (
              <>
                <div><Label>仿真名称</Label><Input value={formContent} onChange={(e) => setFormContent(e.target.value)} placeholder="输入仿真资源名称" className="mt-1.5" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>仿真平台</Label><Input placeholder="例如：Web-based SPICE" className="mt-1.5" /></div>
                  <div><Label>学科领域</Label><Input placeholder="例如：电子电路" className="mt-1.5" /></div>
                </div>
              </>
            )}

            {type === "knowledge-point" && (
              <>
                <div><Label>知识点名称 <span className="text-red-500">*</span></Label><Input value={formContent} onChange={(e) => setFormContent(e.target.value)} placeholder="输入知识点名称" className="mt-1.5" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>编码</Label><Input value={formKnowledgeCode} onChange={(e) => setFormKnowledgeCode(e.target.value)} placeholder="例如：KP-001" className="mt-1.5" /></div>
                  <div>
                    <Label>关联颗粒课</Label>
                    <MultiSelectSearch
                      options={mockGranularLessons.map((l) => ({ label: l.name, value: l.id, subtitle: l.code }))}
                      selected={formKnowledgeCourses}
                      onChange={setFormKnowledgeCourses}
                      placeholder="选择关联颗粒课"
                      searchPlaceholder="搜索颗粒课..."
                    />
                  </div>
                </div>
              </>
            )}

            {type === "ability-point" && (
              <>
                <div><Label>能力点名称 <span className="text-red-500">*</span></Label><Input value={formContent} onChange={(e) => setFormContent(e.target.value)} placeholder="输入能力点名称" className="mt-1.5" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>所属能力领域</Label>
                    <Select value={formAbilityDomain} onValueChange={setFormAbilityDomain}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="选择能力领域" /></SelectTrigger>
                      <SelectContent>
                        {ABILITY_DOMAINS.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>编码</Label><Input value={formAbilityCode} onChange={(e) => setFormAbilityCode(e.target.value)} placeholder="例如：SD-001" className="mt-1.5" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>编码</Label><Input value={formAbilityCode} onChange={(e) => setFormAbilityCode(e.target.value)} placeholder="例如：SD-001" className="mt-1.5" /></div>
                  <div>
                    <Label>能力属性</Label>
                    <Select value={formAbilityAttribute} onValueChange={(v) => setFormAbilityAttribute(v as AbilityAttribute)}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        {ALL_ABILITY_ATTRIBUTES.map((attr) => (
                          <SelectItem key={attr} value={attr}>{attr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>掌握程度</Label>
                  <Select value={formAbilityMastery} onValueChange={(v) => setFormAbilityMastery(v as AbilityMastery)}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(ABILITY_MASTERY_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label} - {ABILITY_MASTERY_DESCRIPTIONS[value as AbilityMastery]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>胜任标准描述</Label>
                  <Textarea value={formAbilityStandard} onChange={(e) => setFormAbilityStandard(e.target.value)} placeholder="描述该能力点对应的胜任标准，包括可衡量的达成指标..." className="mt-1.5" rows={3} maxLength={500} />
                </div>
              </>
            )}

            {["document", "spreadsheet", "image", "audio", "video", "other"].includes(type) && (
              <div>
                <Label>资源文件 <span className="text-red-500">*</span></Label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center space-y-3 mt-1.5 hover:border-primary/50 transition-colors cursor-pointer">
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

            <div>
              <Label>资源描述</Label>
              <Textarea placeholder="输入资源简介、用途说明等" className="mt-1.5" rows={2} onChange={(e) => setFormDesc(e.target.value)} value={formDesc} maxLength={500} />
            </div>
            {!["knowledge-point", "ability-point"].includes(type) && (
              <div>
                <Label>关键词标签（逗号分隔，≤5个）</Label>
                <Input value={formTags} onChange={(e) => setFormTags(e.target.value)} placeholder="标签1，标签2" className="mt-1.5" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>取消</Button>
             <Button onClick={handleAdd} disabled={!formTitle.trim() || (!formContent.trim() && !["venue", "equipment", "software", "simulation", "knowledge-point", "ability-point"].includes(type))}>
              上传并提交审核
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>编辑资源</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>资源标题</Label><Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} maxLength={50} /></div>

            {type === "knowledge-point" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>编码</Label><Input value={formKnowledgeCode} onChange={(e) => setFormKnowledgeCode(e.target.value)} placeholder="例如：KP-001" className="mt-1.5" /></div>
                  <div>
                    <Label>关联颗粒课</Label>
                    <MultiSelectSearch
                      options={mockGranularLessons.map((l) => ({ label: l.name, value: l.id, subtitle: l.code }))}
                      selected={formKnowledgeCourses}
                      onChange={setFormKnowledgeCourses}
                      placeholder="选择关联颗粒课"
                      searchPlaceholder="搜索颗粒课..."
                    />
                  </div>
                </div>
              </>
            )}

            {type === "ability-point" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>所属能力领域</Label>
                    <Select value={formAbilityDomain} onValueChange={setFormAbilityDomain}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="选择能力领域" /></SelectTrigger>
                      <SelectContent>
                        {ABILITY_DOMAINS.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>编码</Label><Input value={formAbilityCode} onChange={(e) => setFormAbilityCode(e.target.value)} placeholder="例如：SD-001" className="mt-1.5" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>编码</Label><Input value={formAbilityCode} onChange={(e) => setFormAbilityCode(e.target.value)} placeholder="例如：SD-001" className="mt-1.5" /></div>
                  <div>
                    <Label>能力属性</Label>
                    <Select value={formAbilityAttribute} onValueChange={(v) => setFormAbilityAttribute(v as AbilityAttribute)}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="请选择" /></SelectTrigger>
                      <SelectContent>
                        {ALL_ABILITY_ATTRIBUTES.map((attr) => (
                          <SelectItem key={attr} value={attr}>{attr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>掌握程度</Label>
                  <Select value={formAbilityMastery} onValueChange={(v) => setFormAbilityMastery(v as AbilityMastery)}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="请选择" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(ABILITY_MASTERY_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label} - {ABILITY_MASTERY_DESCRIPTIONS[value as AbilityMastery]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>胜任标准描述</Label>
                  <Textarea value={formAbilityStandard} onChange={(e) => setFormAbilityStandard(e.target.value)} placeholder="描述该能力点对应的胜任标准..." className="mt-1.5" rows={3} maxLength={500} />
                </div>
              </>
            )}

            <div><Label>描述</Label><Textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} maxLength={500} rows={3} /></div>
            {!["knowledge-point", "ability-point"].includes(type) && (
              <div><Label>标签（逗号分隔）</Label><Input value={formTags} onChange={(e) => setFormTags(e.target.value)} /></div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>取消</Button>
            <Button onClick={handleEdit}>保存修改</Button>
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
                <div><Label className="text-gray-500">描述</Label><p className="text-sm">{detailResource.description}</p></div>
                {detailResource.type !== "knowledge-point" && detailResource.type !== "ability-point" && (
                  <div className="flex flex-wrap gap-1">{detailResource.tags.map((tag) => (<Badge key={tag} variant="secondary">{tag}</Badge>))}</div>
                )}
                {detailResource.type === "knowledge-point" && (
                  <div className="bg-blue-50 rounded-lg p-3 space-y-1">
                    {detailResource.knowledgeCode && <p className="text-xs font-medium text-blue-700">编码：{detailResource.knowledgeCode}</p>}
                    {detailResource.knowledgeCourses && <p className="text-xs text-blue-600">关联颗粒课：{detailResource.knowledgeCourses.split(',').map(id => mockGranularLessons.find(l => l.id === id)?.name || id).filter(Boolean).join('、')}</p>}
                  </div>
                )}
                {detailResource.type === "ability-point" && (
                  <div className="bg-purple-50 rounded-lg p-3 space-y-1">
                    {detailResource.abilityDomain && <p className="text-xs font-medium text-purple-700">所属能力领域：{detailResource.abilityDomain}</p>}
                    {detailResource.abilityCode && <p className="text-xs text-purple-600">编码：{detailResource.abilityCode}</p>}
                    {detailResource.abilityAttribute && <p className="text-xs text-purple-600">能力属性：{detailResource.abilityAttribute}</p>}
                    {detailResource.abilityMastery && <p className="text-xs text-purple-600">掌握程度：{ABILITY_MASTERY_LABELS[detailResource.abilityMastery]}</p>}
                    {detailResource.abilityStandard && <p className="text-xs text-purple-600">胜任标准：{detailResource.abilityStandard}</p>}
                  </div>
                )}
                <div><Label className="text-gray-500">上传人</Label><p className="text-sm">{detailResource.uploaderName} · {detailResource.uploaderDepartment}</p></div>
                {detailResource.rejectReason && <p className="text-sm text-red-600">驳回原因：{detailResource.rejectReason}</p>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>驳回资源</DialogTitle></DialogHeader>
          <div className="space-y-2"><Label>驳回原因</Label><Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={3} /></div>
          <DialogFooter><Button variant="outline" onClick={() => setRejectOpen(false)}>取消</Button><Button variant="destructive" onClick={() => { if (rejectTarget) { rejectResource(rejectTarget.id, rejectReason); setRejectOpen(false); setRejectTarget(null); setRejectReason("") } }} disabled={!rejectReason.trim()}>确认驳回</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={batchRejectOpen} onOpenChange={setBatchRejectOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>批量驳回</DialogTitle></DialogHeader>
          <div className="space-y-2"><Label>驳回原因</Label><Textarea value={batchRejectReason} onChange={(e) => setBatchRejectReason(e.target.value)} rows={3} /></div>
          <DialogFooter><Button variant="outline" onClick={() => setBatchRejectOpen(false)}>取消</Button><Button variant="destructive" onClick={() => { batchReject(selectedIds, batchRejectReason); setSelectedIds([]); setBatchRejectOpen(false); setBatchRejectReason("") }} disabled={!batchRejectReason.trim()}>确认批量驳回</Button></DialogFooter>
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

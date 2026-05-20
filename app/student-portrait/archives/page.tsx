"use client"

import { useState, useMemo } from "react"
import { Search, FileText, CheckCircle2, Clock, XCircle, Award, Plus, Trash2, Eye, UserCheck, UserX, Settings, History, Calculator, Upload, GraduationCap, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useData } from "@/components/providers/data-provider"
import { useToast } from "@/hooks/use-toast"
import type { StudentAbilityArchive, ArchiveMaterialType, ArchiveAuditStatus, CreditConversionRule } from "@/lib/types"
import { MOCK_STUDENTS } from "@/lib/mock-data"

const MATERIAL_TYPE_LABELS: Record<ArchiveMaterialType, string> = { certificate: '荣誉证书', competition: '竞赛成果', activity: '社会活动', internship: '实习证明', skill: '技能证书' }
const AUDIT_STATUS_LABELS: Record<ArchiveAuditStatus, string> = { pending: '待审核', approved: '已审核', rejected: '已驳回' }

const TYPE_LEVELS: Record<ArchiveMaterialType, string[]> = {
  certificate: ['国家级', '省级', '校级', '国际认证', '行业认证'],
  competition: ['国家级一等奖', '国家级二等奖', '国家级三等奖', '省级一等奖', '省级二等奖', '省级三等奖', '校级一等奖'],
  activity: ['国家级优秀志愿者', '省级优秀志愿者', '校级优秀志愿者', '院级优秀志愿者'],
  internship: '知名企业3个月以上 知名企业1-3个月 一般企业3个月以上 一般企业1-3个月'.split(' '),
  skill: ['高级', '中级', '初级', '培训合格'],
}

export default function StudentAbilityArchivesPage() {
  const { studentAbilityArchives, creditConversionRules, archiveVersions, createStudentAbilityArchive, updateStudentAbilityArchive, deleteStudentAbilityArchive, updateCreditConversionRules } = useData()
  const { toast } = useToast()

  const [selectedStudent, setSelectedStudent] = useState(MOCK_STUDENTS[0])
  const [studentSearch, setStudentSearch] = useState("")

  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({ materialType: 'certificate' as ArchiveMaterialType, materialName: '', issuingOrg: '', obtainDate: '', level: '', attachmentName: '' })

  const [disciplineOpen, setDisciplineOpen] = useState(false)
  const [disciplineForm, setDisciplineForm] = useState({ content: '', score: 0, date: '' })

  const [viewArchive, setViewArchive] = useState<StudentAbilityArchive | null>(null)
  const [auditArchive, setAuditArchive] = useState<StudentAbilityArchive | null>(null)
  const [deleteArchive, setDeleteArchive] = useState<StudentAbilityArchive | null>(null)
  const [configOpen, setConfigOpen] = useState(false)
  const [versionOpen, setVersionOpen] = useState(false)
  const [versionArchiveId, setVersionArchiveId] = useState<string | null>(null)

  const [auditForm, setAuditForm] = useState({ auditStatus: 'approved' as ArchiveAuditStatus, auditRemark: '', convertedCredit: 0 })
  const [configRules, setConfigRules] = useState<CreditConversionRule[]>([])

  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return MOCK_STUDENTS
    const q = studentSearch.toLowerCase()
    return MOCK_STUDENTS.filter((s) => s.name.toLowerCase().includes(q) || s.id.includes(q) || s.className.toLowerCase().includes(q))
  }, [studentSearch])

  const studentArchives = useMemo(() => {
    const list = studentAbilityArchives.filter((a) => a.studentId === selectedStudent.id)
    return {
      positive: list.filter((a) => a.direction === 'positive').sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      negative: list.filter((a) => a.direction === 'negative').sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    }
  }, [studentAbilityArchives, selectedStudent])

  const stats = useMemo(() => {
    const total = studentAbilityArchives.length
    return { total, approved: studentAbilityArchives.filter((a) => a.auditStatus === 'approved').length, pending: studentAbilityArchives.filter((a) => a.auditStatus === 'pending').length, rejected: studentAbilityArchives.filter((a) => a.auditStatus === 'rejected').length, totalCredit: studentAbilityArchives.filter((a) => a.auditStatus === 'approved').reduce((sum, a) => sum + a.convertedCredit, 0) }
  }, [studentAbilityArchives])

  const archiveVers = useMemo(() => (archiveId: string) => archiveVersions.filter((v) => v.archiveId === archiveId), [archiveVersions])

  const handleUpload = () => {
    if (!uploadForm.materialName.trim()) { toast({ title: '请填写材料名称', variant: 'destructive' }); return }
    const rule = creditConversionRules.find((r) => r.materialType === uploadForm.materialType && r.level === uploadForm.level)
    createStudentAbilityArchive({
      studentName: selectedStudent.name,
      studentId: selectedStudent.id,
      className: selectedStudent.className,
      materialType: uploadForm.materialType,
      materialName: uploadForm.materialName,
      issuingOrg: uploadForm.issuingOrg,
      obtainDate: uploadForm.obtainDate,
      direction: 'positive',
    })
    // 更新刚创建的档案的学分和level
    setTimeout(() => {
      const created = studentAbilityArchives.filter(a => a.studentId === selectedStudent.id).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
      if (created) {
        updateStudentAbilityArchive(created.id, { convertedCredit: rule?.credit || 0, level: uploadForm.level })
      }
    }, 0)
    toast({ title: '新档案已上传，进入待审核状态' })
    setUploadOpen(false)
    setUploadForm({ materialType: 'certificate', materialName: '', issuingOrg: '', obtainDate: '', level: '', attachmentName: '' })
  }

  const handleDiscipline = () => {
    if (!disciplineForm.content.trim()) { toast({ title: '请填写扣分内容', variant: 'destructive' }); return }
    createStudentAbilityArchive({
      studentName: selectedStudent.name,
      studentId: selectedStudent.id,
      className: selectedStudent.className,
      materialType: 'certificate',
      materialName: disciplineForm.content,
      issuingOrg: '教务处',
      obtainDate: disciplineForm.date,
      direction: 'negative',
    })
    setTimeout(() => {
      const created = studentAbilityArchives.filter(a => a.studentId === selectedStudent.id).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
      if (created) {
        updateStudentAbilityArchive(created.id, { convertedCredit: -disciplineForm.score })
      }
    }, 0)
    toast({ title: '违纪记录已添加，进入待审核状态' })
    setDisciplineOpen(false)
    setDisciplineForm({ content: '', score: 0, date: '' })
  }

  const openAudit = (archive: StudentAbilityArchive) => {
    setAuditArchive(archive)
    setAuditForm({ auditStatus: archive.auditStatus === 'pending' ? 'approved' : archive.auditStatus, auditRemark: archive.auditRemark || '', convertedCredit: archive.convertedCredit })
  }
  const handleAudit = () => {
    if (auditArchive) { updateStudentAbilityArchive(auditArchive.id, { auditStatus: auditForm.auditStatus, auditRemark: auditForm.auditRemark, convertedCredit: auditForm.convertedCredit }); toast({ title: auditForm.auditStatus === 'approved' ? '审核已通过' : '审核已驳回' }); setAuditArchive(null) }
  }
  const handleDelete = () => { if (deleteArchive) { deleteStudentAbilityArchive(deleteArchive.id); toast({ title: '档案已删除' }); setDeleteArchive(null) } }

  const autoCalculateCredit = () => {
    if (auditArchive) {
      const rule = creditConversionRules.find((r) => r.materialType === auditArchive.materialType)
      if (rule) { setAuditForm((prev) => ({ ...prev, convertedCredit: rule.credit })); toast({ title: `已按规则自动计算学分：${rule.credit}分` }) }
      else { toast({ title: '未找到匹配的学分转换规则', variant: 'destructive' }) }
    }
  }

  const openConfig = () => { setConfigRules([...creditConversionRules]); setConfigOpen(true) }
  const handleConfigSave = () => { updateCreditConversionRules(configRules); toast({ title: '学分转换规则已保存' }); setConfigOpen(false) }

  const getAuditBadge = (status: ArchiveAuditStatus) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary" className="gap-1"><Clock className="size-3" />{AUDIT_STATUS_LABELS[status]}</Badge>
      case 'approved': return <Badge variant="default" className="bg-emerald-500 gap-1"><CheckCircle2 className="size-3" />{AUDIT_STATUS_LABELS[status]}</Badge>
      case 'rejected': return <Badge variant="destructive" className="gap-1"><XCircle className="size-3" />{AUDIT_STATUS_LABELS[status]}</Badge>
    }
  }
  const formatDate = (date: Date) => new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date)

  const groupedStudents = useMemo(() => {
    const map = new Map<string, typeof MOCK_STUDENTS>()
    filteredStudents.forEach((s) => {
      if (!map.has(s.className)) map.set(s.className, [])
      map.get(s.className)!.push(s)
    })
    return Array.from(map.entries()).sort()
  }, [filteredStudents])

  const ArchiveTable = ({ archives, title, icon }: { archives: StudentAbilityArchive[]; title: string; icon: React.ReactNode }) => (
    <div className="rounded-lg border bg-white">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        {icon}
        <h3 className="text-sm font-semibold">{title}</h3>
        <Badge variant="outline" className="text-xs">{archives.length} 条</Badge>
      </div>
      {archives.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">暂无记录</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">材料类型</TableHead>
                <TableHead className="w-[200px]">材料名称</TableHead>
                <TableHead className="w-[120px]">颁发机构</TableHead>
                <TableHead className="w-[100px]">获得时间</TableHead>
                <TableHead className="w-[100px]">等级</TableHead>
                <TableHead className="w-[100px]">审核状态</TableHead>
                <TableHead className="w-[90px]">转换学分</TableHead>
                <TableHead className="sticky right-0 w-[140px] bg-white text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {archives.map((archive) => (
                <TableRow key={archive.id}>
                  <TableCell><span className="text-sm">{MATERIAL_TYPE_LABELS[archive.materialType]}</span></TableCell>
                  <TableCell><div className="text-sm font-medium">{archive.materialName}</div>{archive.auditRemark && <div className="text-xs text-muted-foreground">{archive.auditRemark}</div>}</TableCell>
                  <TableCell><span className="text-sm text-muted-foreground">{archive.issuingOrg}</span></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(archive.obtainDate)}</TableCell>
                  <TableCell><span className="text-sm text-muted-foreground">{archive.level || '-'}</span></TableCell>
                  <TableCell>{getAuditBadge(archive.auditStatus)}</TableCell>
                  <TableCell><span className={`text-sm font-semibold ${archive.convertedCredit > 0 ? 'text-emerald-600' : archive.convertedCredit < 0 ? 'text-red-600' : ''}`}>{archive.convertedCredit > 0 ? `+${archive.convertedCredit}` : archive.convertedCredit}</span></TableCell>
                  <TableCell className="sticky right-0 bg-white text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-7" onClick={() => setViewArchive(archive)}><Eye className="size-3.5" /></Button>
                      {archive.auditStatus === 'pending' && (<Button variant="ghost" size="icon" className="size-7 text-emerald-600" onClick={() => openAudit(archive)}><UserCheck className="size-3.5" /></Button>)}
                      <Button variant="ghost" size="icon" className="size-7" onClick={() => { setVersionArchiveId(archive.id); setVersionOpen(true) }}><History className="size-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="size-7 text-destructive" onClick={() => setDeleteArchive(archive)}><Trash2 className="size-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )

  return (
    <div className="px-8 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">学生档案管理</h1><p className="text-muted-foreground">管理学生正向/负向档案材料，审核学分转换，记录能力认定依据</p></div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={openConfig}><Settings className="mr-2 size-4" />学分转换配置</Button>
        </div>
      </div>

      {/* 左右两列布局 */}
      <div className="grid grid-cols-12 gap-6">
        {/* 左侧学生导航 */}
        <div className="col-span-3">
          <div className="rounded-lg border bg-white">
            <div className="border-b p-3">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="搜索学生..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} className="h-8 pl-7 text-xs" />
              </div>
            </div>
            <div className="max-h-[calc(100vh-280px)] overflow-y-auto p-2">
              {groupedStudents.map(([className, students]) => (
                <div key={className} className="mb-2">
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">{className}</div>
                  <div className="space-y-1">
                    {students.map((student) => {
                      const isActive = selectedStudent.id === student.id
                      const hasData = studentAbilityArchives.some((a) => a.studentId === student.id)
                      return (
                        <button
                          key={student.id}
                          onClick={() => setSelectedStudent(student)}
                          className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-muted'}`}
                        >
                          <span>{student.name}</span>
                          {hasData && <span className="size-1.5 rounded-full bg-emerald-500" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧档案记录 */}
        <div className="col-span-9 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">{selectedStudent.name}（{selectedStudent.id}）</h2>
              <p className="text-xs text-muted-foreground">{selectedStudent.className}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setUploadOpen(true)}><Upload className="mr-1 size-3" />上传新档案</Button>
              <Button size="sm" variant="outline" className="text-red-600" onClick={() => setDisciplineOpen(true)}><AlertTriangle className="mr-1 size-3" />添加学生违纪/处分记录</Button>
            </div>
          </div>

          <ArchiveTable archives={studentArchives.positive} title="正向档案" icon={<Award className="size-4 text-emerald-600" />} />
          <ArchiveTable archives={studentArchives.negative} title="负向档案（违纪/处分）" icon={<AlertTriangle className="size-4 text-red-600" />} />
        </div>
      </div>

      {/* 上传新档案弹窗 */}
      <Dialog open={uploadOpen} onOpenChange={(open) => { if (!open) { setUploadOpen(false); setUploadForm({ materialType: 'certificate', materialName: '', issuingOrg: '', obtainDate: '', level: '', attachmentName: '' }) } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>上传新档案</DialogTitle><DialogDescription>为 {selectedStudent.name}（{selectedStudent.id}）上传能力档案材料</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="rounded-lg bg-muted p-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">学生姓名</span><span className="font-medium">{selectedStudent.name}</span></div>
              <div className="flex justify-between mt-1"><span className="text-muted-foreground">学号</span><span>{selectedStudent.id}</span></div>
              <div className="flex justify-between mt-1"><span className="text-muted-foreground">班级</span><span>{selectedStudent.className}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>材料类型 *</Label>
                <Select value={uploadForm.materialType} onValueChange={(v) => setUploadForm({ ...uploadForm, materialType: v as ArchiveMaterialType, level: '' })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="certificate">荣誉证书</SelectItem>
                    <SelectItem value="competition">竞赛成果</SelectItem>
                    <SelectItem value="activity">社会活动</SelectItem>
                    <SelectItem value="internship">实习证明</SelectItem>
                    <SelectItem value="skill">技能证书</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label>等级 *</Label>
                <Select value={uploadForm.level} onValueChange={(v) => setUploadForm({ ...uploadForm, level: v })}>
                  <SelectTrigger><SelectValue placeholder="选择等级" /></SelectTrigger>
                  <SelectContent>
                    {TYPE_LEVELS[uploadForm.materialType].map((lvl) => (
                      <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2"><Label>材料名称 *</Label><Input value={uploadForm.materialName} onChange={(e) => setUploadForm({ ...uploadForm, materialName: e.target.value })} placeholder="请输入材料名称" /></div>
            <div className="grid gap-2"><Label>颁发机构</Label><Input value={uploadForm.issuingOrg} onChange={(e) => setUploadForm({ ...uploadForm, issuingOrg: e.target.value })} placeholder="请输入颁发机构" /></div>
            <div className="grid gap-2"><Label>获得日期</Label><Input type="date" value={uploadForm.obtainDate} onChange={(e) => setUploadForm({ ...uploadForm, obtainDate: e.target.value })} /></div>
            <div className="rounded-lg border border-dashed p-6 text-center">
              <Upload className="mx-auto mb-2 size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">点击或拖拽文件到此处上传附件</p>
              <p className="text-xs text-muted-foreground">支持 PDF、JPG、PNG 等格式</p>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setUploadOpen(false)}>取消</Button><Button onClick={handleUpload}><Upload className="mr-2 size-4" />确认上传</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 添加违纪/处分记录弹窗 */}
      <Dialog open={disciplineOpen} onOpenChange={(open) => { if (!open) { setDisciplineOpen(false); setDisciplineForm({ content: '', score: 0, date: '' }) } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>添加学生违纪/处分记录</DialogTitle><DialogDescription>为 {selectedStudent.name}（{selectedStudent.id}）添加违纪/处分记录</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="rounded-lg bg-muted p-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">学生姓名</span><span className="font-medium">{selectedStudent.name}</span></div>
              <div className="flex justify-between mt-1"><span className="text-muted-foreground">学号</span><span>{selectedStudent.id}</span></div>
              <div className="flex justify-between mt-1"><span className="text-muted-foreground">班级</span><span>{selectedStudent.className}</span></div>
            </div>
            <div className="grid gap-2"><Label>扣分内容 *</Label><Textarea value={disciplineForm.content} onChange={(e) => setDisciplineForm({ ...disciplineForm, content: e.target.value })} placeholder="请填写违纪/处分具体内容..." rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>扣分分值 *</Label><Input type="number" value={disciplineForm.score} onChange={(e) => setDisciplineForm({ ...disciplineForm, score: Number(e.target.value) })} placeholder="请输入扣分分值" /></div>
              <div className="grid gap-2"><Label>扣分时间 *</Label><Input type="date" value={disciplineForm.date} onChange={(e) => setDisciplineForm({ ...disciplineForm, date: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDisciplineOpen(false)}>取消</Button><Button variant="destructive" onClick={handleDiscipline}><AlertTriangle className="mr-2 size-4" />确认添加</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 审核弹窗 */}
      <Dialog open={!!auditArchive} onOpenChange={(open) => !open && setAuditArchive(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>档案审核</DialogTitle><DialogDescription>{auditArchive?.studentName} - {auditArchive?.materialName}</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>审核结果</Label><Select value={auditForm.auditStatus} onValueChange={(v) => setAuditForm({ ...auditForm, auditStatus: v as ArchiveAuditStatus })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="approved">通过</SelectItem><SelectItem value="rejected">驳回</SelectItem></SelectContent></Select></div>
            <div className="grid gap-2"><Label>转换学分</Label><div className="flex gap-2"><Input type="number" step={0.5} value={auditForm.convertedCredit} onChange={(e) => setAuditForm({ ...auditForm, convertedCredit: Number(e.target.value) })} /><Button variant="outline" size="sm" onClick={autoCalculateCredit}><Calculator className="mr-1 size-3" />自动计算</Button></div></div>
            <div className="grid gap-2"><Label>审核意见</Label><Textarea value={auditForm.auditRemark} onChange={(e) => setAuditForm({ ...auditForm, auditRemark: e.target.value })} placeholder="请输入审核意见" rows={3} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setAuditArchive(null)}>取消</Button><Button onClick={handleAudit}>{auditForm.auditStatus === 'approved' ? <UserCheck className="mr-2 size-4" /> : <UserX className="mr-2 size-4" />}确认审核</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 查看详情弹窗 */}
      <Dialog open={!!viewArchive} onOpenChange={(open) => !open && setViewArchive(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>档案详情</DialogTitle></DialogHeader>
          {viewArchive && (
            <div className="space-y-3 py-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">学生</span><span>{viewArchive.studentName} ({viewArchive.studentId})</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">班级</span><span>{viewArchive.className}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">材料类型</span><span>{MATERIAL_TYPE_LABELS[viewArchive.materialType]}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">材料名称</span><span className="font-medium">{viewArchive.materialName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">颁发机构</span><span>{viewArchive.issuingOrg}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">获得日期</span><span>{formatDate(viewArchive.obtainDate)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">等级</span><span>{viewArchive.level || '-'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">审核状态</span>{getAuditBadge(viewArchive.auditStatus)}</div>
              <div className="flex justify-between"><span className="text-muted-foreground">转换学分</span><span className="font-semibold">{viewArchive.convertedCredit}</span></div>
              {viewArchive.auditRemark && <div className="flex justify-between"><span className="text-muted-foreground">审核意见</span><span>{viewArchive.auditRemark}</span></div>}
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewArchive(null)}>关闭</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 学分转换配置弹窗 */}
      <Dialog open={configOpen} onOpenChange={(open) => !open && setConfigOpen(false)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>学分转换规则配置</DialogTitle></DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              {configRules.map((rule, i) => (
                <div key={rule.id} className="grid grid-cols-3 gap-2">
                  <Input value={MATERIAL_TYPE_LABELS[rule.materialType]} readOnly />
                  <Input value={rule.level} onChange={(e) => { const next = [...configRules]; next[i] = { ...next[i], level: e.target.value }; setConfigRules(next) }} />
                  <Input type="number" step={0.5} value={rule.credit} onChange={(e) => { const next = [...configRules]; next[i] = { ...next[i], credit: Number(e.target.value) }; setConfigRules(next) }} />
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg bg-muted p-2 text-xs text-muted-foreground">审核时将按材料类型自动匹配对应等级的学分转换规则。</div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setConfigOpen(false)}>取消</Button><Button onClick={handleConfigSave}><Settings className="mr-2 size-4" />保存规则</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 版本历史弹窗 */}
      <Dialog open={versionOpen} onOpenChange={(open) => !open && setVersionOpen(false)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>档案版本记录</DialogTitle></DialogHeader>
          <div className="py-2">
            {versionArchiveId && archiveVers(versionArchiveId).length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">暂无版本记录</div>
            ) : (
              <div className="space-y-2">
                {versionArchiveId && archiveVers(versionArchiveId).map((ver) => (
                  <div key={ver.id} className="flex items-center justify-between rounded-lg border px-3 py-2">
                    <div><div className="text-sm font-medium">v{ver.version} · {ver.changeSummary}</div><div className="text-xs text-muted-foreground">变更人：{ver.changedBy}</div></div>
                    <div className="text-xs text-muted-foreground">{formatDate(ver.createdAt)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setVersionOpen(false)}>关闭</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <Dialog open={!!deleteArchive} onOpenChange={(open) => !open && setDeleteArchive(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>确认删除</DialogTitle><DialogDescription>确定要删除「{deleteArchive?.materialName}」吗？此操作不可撤销。</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteArchive(null)}>取消</Button><Button variant="destructive" onClick={handleDelete}><Trash2 className="mr-2 size-4" />删除</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

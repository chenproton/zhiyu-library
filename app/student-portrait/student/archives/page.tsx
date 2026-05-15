"use client"

import { useState, useMemo } from "react"
import { Award, AlertTriangle, Clock, CheckCircle2, XCircle, ArrowLeft, GraduationCap, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useData } from "@/components/providers/data-provider"
import { useToast } from "@/hooks/use-toast"
import type { StudentAbilityArchive, ArchiveMaterialType } from "@/lib/types"

const MATERIAL_TYPE_LABELS: Record<ArchiveMaterialType, string> = { certificate: '荣誉证书', competition: '竞赛成果', activity: '社会活动', internship: '实习证明', skill: '技能证书' }
const AUDIT_STATUS_LABELS = { pending: '待审核', approved: '已审核', rejected: '已驳回' }

const TYPE_LEVELS: Record<ArchiveMaterialType, string[]> = {
  certificate: ['国家级', '省级', '校级', '国际认证', '行业认证'],
  competition: ['国家级一等奖', '国家级二等奖', '国家级三等奖', '省级一等奖', '省级二等奖', '省级三等奖', '校级一等奖'],
  activity: ['国家级优秀志愿者', '省级优秀志愿者', '校级优秀志愿者', '院级优秀志愿者'],
  internship: '知名企业3个月以上 知名企业1-3个月 一般企业3个月以上 一般企业1-3个月'.split(' '),
  skill: ['高级', '中级', '初级', '培训合格'],
}

const MOCK_SELF = { name: '张三', id: '2021001', className: '2021级全栈开发1班' }

export default function StudentAbilityArchivesSelfPage() {
  const { studentAbilityArchives, createStudentAbilityArchive } = useData()
  const { toast } = useToast()

  const myArchives = useMemo(() => {
    const list = studentAbilityArchives.filter((a) => a.studentId === MOCK_SELF.id)
    return {
      positive: list.filter((a) => a.direction === 'positive').sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      negative: list.filter((a) => a.direction === 'negative').sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    }
  }, [studentAbilityArchives])

  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({ materialType: 'certificate' as ArchiveMaterialType, materialName: '', issuingOrg: '', obtainDate: '', level: '', attachmentName: '' })

  const [viewArchive, setViewArchive] = useState<StudentAbilityArchive | null>(null)

  const handleUpload = () => {
    if (!uploadForm.materialName.trim()) { toast({ title: '请填写材料名称', variant: 'destructive' }); return }
    createStudentAbilityArchive({
      studentName: MOCK_SELF.name,
      studentId: MOCK_SELF.id,
      className: MOCK_SELF.className,
      materialType: uploadForm.materialType,
      materialName: uploadForm.materialName,
      issuingOrg: uploadForm.issuingOrg,
      obtainDate: uploadForm.obtainDate,
      direction: 'positive',
    })
    toast({ title: '档案已提交，进入待审核状态' })
    setUploadOpen(false)
    setUploadForm({ materialType: 'certificate', materialName: '', issuingOrg: '', obtainDate: '', level: '', attachmentName: '' })
  }

  const getAuditBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary" className="gap-1"><Clock className="size-3" />{AUDIT_STATUS_LABELS.pending}</Badge>
      case 'approved': return <Badge variant="default" className="bg-emerald-500 gap-1"><CheckCircle2 className="size-3" />{AUDIT_STATUS_LABELS.approved}</Badge>
      case 'rejected': return <Badge variant="destructive" className="gap-1"><XCircle className="size-3" />{AUDIT_STATUS_LABELS.rejected}</Badge>
    }
  }
  const formatDate = (date: Date) => new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date)

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {archives.map((archive) => (
                <TableRow key={archive.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setViewArchive(archive)}>
                  <TableCell><span className="text-sm">{MATERIAL_TYPE_LABELS[archive.materialType]}</span></TableCell>
                  <TableCell><div className="text-sm font-medium">{archive.materialName}</div>{archive.auditRemark && <div className="text-xs text-muted-foreground">{archive.auditRemark}</div>}</TableCell>
                  <TableCell><span className="text-sm text-muted-foreground">{archive.issuingOrg}</span></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(archive.obtainDate)}</TableCell>
                  <TableCell><span className="text-sm text-muted-foreground">{archive.level || '-'}</span></TableCell>
                  <TableCell>{getAuditBadge(archive.auditStatus)}</TableCell>
                  <TableCell><span className={`text-sm font-semibold ${archive.convertedCredit > 0 ? 'text-emerald-600' : archive.convertedCredit < 0 ? 'text-red-600' : ''}`}>{archive.convertedCredit > 0 ? `+${archive.convertedCredit}` : archive.convertedCredit}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3"><GraduationCap className="size-6 text-blue-600" /><h1 className="text-lg font-bold">学生能力档案</h1></div>
          <Button variant="ghost" size="sm" onClick={() => window.close()}><ArrowLeft className="mr-1 size-4" />返回</Button>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-6 py-6">
        <div className="mb-6 rounded-lg border bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">{MOCK_SELF.name}（{MOCK_SELF.id}）</h2>
              <p className="text-sm text-muted-foreground">{MOCK_SELF.className}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => setUploadOpen(true)}><Upload className="mr-1 size-3" />上传新档案</Button>
          </div>
        </div>

        <div className="space-y-4">
          <ArchiveTable archives={myArchives.positive} title="正向档案" icon={<Award className="size-4 text-emerald-600" />} />
          <ArchiveTable archives={myArchives.negative} title="负向档案（违纪/处分）" icon={<AlertTriangle className="size-4 text-red-600" />} />
        </div>
      </div>

      {/* 上传新档案弹窗 */}
      <Dialog open={uploadOpen} onOpenChange={(open) => { if (!open) { setUploadOpen(false); setUploadForm({ materialType: 'certificate', materialName: '', issuingOrg: '', obtainDate: '', level: '', attachmentName: '' }) } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>上传新档案</DialogTitle><DialogDescription>提交后将进入待审核状态，审核通过后方可生效</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="rounded-lg bg-muted p-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">学生姓名</span><span className="font-medium">{MOCK_SELF.name}</span></div>
              <div className="flex justify-between mt-1"><span className="text-muted-foreground">学号</span><span>{MOCK_SELF.id}</span></div>
              <div className="flex justify-between mt-1"><span className="text-muted-foreground">班级</span><span>{MOCK_SELF.className}</span></div>
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
          <DialogFooter><Button variant="outline" onClick={() => setUploadOpen(false)}>取消</Button><Button onClick={handleUpload}><Upload className="mr-2 size-4" />提交审核</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 查看详情弹窗 */}
      <Dialog open={!!viewArchive} onOpenChange={(open) => !open && setViewArchive(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>档案详情</DialogTitle></DialogHeader>
          {viewArchive && (
            <div className="space-y-3 py-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">材料类型</span><span>{MATERIAL_TYPE_LABELS[viewArchive.materialType]}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">材料名称</span><span className="font-medium">{viewArchive.materialName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">颁发机构</span><span>{viewArchive.issuingOrg}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">获得日期</span><span>{formatDate(viewArchive.obtainDate)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">等级</span><span>{viewArchive.level || '-'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">审核状态</span>{getAuditBadge(viewArchive.auditStatus)}</div>
              <div className="flex justify-between"><span className="text-muted-foreground">转换学分</span><span className="font-semibold">{viewArchive.convertedCredit}</span></div>
              {viewArchive.auditRemark && <div className="rounded-md bg-muted p-2 text-xs"><span className="font-medium">审核意见：</span>{viewArchive.auditRemark}</div>}
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewArchive(null)}>关闭</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "./status-badge"
import { LevelMappingDisplay } from "./level-mapping-display"
import { LevelMappingDialog } from "./level-mapping-dialog"
import { positionsList } from "@/lib/mock-data"
import type { Position, RuleStatus, LevelMapping } from "@/lib/types"
import { statusConfig, actionConfig, defaultLevelMapping } from "@/lib/types"
import {
  Search,
  Settings2,
  MoreHorizontal,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
  Settings,
  FileText,
  Clock,
  XCircle,
  CheckCircle,
} from "lucide-react"

export function PositionListPage() {
  const router = useRouter()
  const [positions, setPositions] = useState<Position[]>(positionsList)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [professionalDirectionFilter, setProfessionalDirectionFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [globalMapping, setGlobalMapping] = useState<LevelMapping[]>(defaultLevelMapping)
  
  const [globalConfigDialogOpen, setGlobalConfigDialogOpen] = useState(false)
  
  // 确认弹窗状态
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    description: string
    action: () => void
  }>({ open: false, title: "", description: "", action: () => {} })

  // 获取所有专业方向选项
  const professionalDirections = Array.from(new Set(positions.map(p => p.professionalDirection)))

  // 筛选后的岗位列表
  const filteredPositions = positions.filter((position) => {
    const matchesSearch =
      position.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      position.positionCode.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || position.ruleStatus === statusFilter
    const matchesProfessionalDirection =
      professionalDirectionFilter === "all" || position.professionalDirection === professionalDirectionFilter
    return matchesSearch && matchesStatus && matchesProfessionalDirection
  })

  // 选中状态处理
  const isAllSelected =
    filteredPositions.length > 0 &&
    filteredPositions.every((p) => selectedIds.includes(p.id))

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredPositions.map((p) => p.id))
    }
  }

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  // 操作处理
  const handleConfig = (position: Position) => {
    router.push(`/config/${position.id}`)
  }

  const handleCancelApproval = (position: Position) => {
    setConfirmDialog({
      open: true,
      title: "取消审批",
      description: `确定要取消「${position.name}」的能力认证规则审批吗？取消后规则将退回至草稿状态。`,
      action: () => {
        setPositions((prev) =>
          prev.map((p) =>
            p.id === position.id ? { ...p, ruleStatus: "draft" as RuleStatus } : p
          )
        )
        setConfirmDialog((prev) => ({ ...prev, open: false }))
      },
    })
  }

  const handlePublish = (position: Position) => {
    setConfirmDialog({
      open: true,
      title: "发布规则",
      description: `确定要发布「${position.name}」的能力认证规则吗？发布后将立即生效。`,
      action: () => {
        setPositions((prev) =>
          prev.map((p) =>
            p.id === position.id
              ? { ...p, ruleStatus: "published" as RuleStatus }
              : p
          )
        )
        setConfirmDialog((prev) => ({ ...prev, open: false }))
      },
    })
  }

  const handleUnpublish = (position: Position) => {
    setConfirmDialog({
      open: true,
      title: "取消发布",
      description: `确定要取消发布「${position.name}」的能力认证规则吗？取消后规则将进入待发布状态。`,
      action: () => {
        setPositions((prev) =>
          prev.map((p) =>
            p.id === position.id ? { ...p, ruleStatus: "ready" as RuleStatus } : p
          )
        )
        setConfirmDialog((prev) => ({ ...prev, open: false }))
      },
    })
  }

  // 批量操作
  const handleBatchPublish = () => {
    const readyPositions = positions.filter(
      (p) => selectedIds.includes(p.id) && p.ruleStatus === "ready"
    )
    if (readyPositions.length === 0) {
      return
    }
    setConfirmDialog({
      open: true,
      title: "批量发布",
      description: `确定要批量发布 ${readyPositions.length} 个岗位的能力认证规则吗？`,
      action: () => {
        setPositions((prev) =>
          prev.map((p) =>
            readyPositions.some((rp) => rp.id === p.id)
              ? { ...p, ruleStatus: "published" as RuleStatus }
              : p
          )
        )
        setSelectedIds([])
        setConfirmDialog((prev) => ({ ...prev, open: false }))
      },
    })
  }

  // 检查操作是否显示
  const shouldShowAction = (action: string, status: RuleStatus) => {
    return actionConfig[action]?.showInStatus.includes(status)
  }

  // 统计数据
  const stats = {
    total: positions.length,
    notSubmitted: positions.filter((p) => p.ruleStatus === "not_submitted").length,
    reviewing: positions.filter((p) => p.ruleStatus === "reviewing").length,
    rejected: positions.filter((p) => p.ruleStatus === "rejected").length,
    published: positions.filter((p) => p.ruleStatus === "published").length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 页面头部 */}
      <header className="border-b border-border bg-card px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              岗位能力认证规则
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              管理各岗位的能力认证规则配置
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setGlobalConfigDialogOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              配置全局等级映射
            </Button>
          </div>
        </div>
      </header>

      <div className="px-6 py-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {stats.total}
                </p>
                <p className="text-sm text-muted-foreground">能力认证规则总数</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {stats.notSubmitted}
                </p>
                <p className="text-sm text-muted-foreground">未提交</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {stats.reviewing}
                </p>
                <p className="text-sm text-muted-foreground">审批中</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {stats.rejected}
                </p>
                <p className="text-sm text-muted-foreground">已驳回</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {stats.published}
                </p>
                <p className="text-sm text-muted-foreground">已发布</p>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索岗位名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={professionalDirectionFilter} onValueChange={setProfessionalDirectionFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="专业方向" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部方向</SelectItem>
              {professionalDirections.map((direction) => (
                <SelectItem key={direction} value={direction}>
                  {direction}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 批量操作 */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-secondary/50 rounded-lg">
            <span className="text-sm text-muted-foreground">
              已选择 {selectedIds.length} 项
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedIds([])}
            >
              取消选择
            </Button>
            <Button size="sm" onClick={handleBatchPublish}>
              批量发布
            </Button>
          </div>
        )}

        {/* 数据表格 */}
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>岗位名称</TableHead>
                <TableHead>岗位编码</TableHead>
                <TableHead>专业方向</TableHead>
                <TableHead className="text-center">关联能力数</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>更新时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPositions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <p className="text-muted-foreground">暂无数据</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPositions.map((position) => (
                  <TableRow key={position.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(position.id)}
                        onCheckedChange={() => handleSelectOne(position.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium">{position.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {position.positionCode}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {position.professionalDirection}
                    </TableCell>
                    <TableCell className="text-center">
                      {position.relatedAbilityCount}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={position.ruleStatus} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {position.lastUpdated}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {shouldShowAction("config", position.ruleStatus) && (
                            <DropdownMenuItem
                              onClick={() => handleConfig(position)}
                            >
                              <Settings2 className="mr-2 h-4 w-4" />
                              配置规则
                            </DropdownMenuItem>
                          )}
                          {(shouldShowAction("cancelApproval", position.ruleStatus) ||
                            shouldShowAction("publish", position.ruleStatus) ||
                            shouldShowAction("unpublish", position.ruleStatus)) && (
                            <DropdownMenuSeparator />
                          )}
                          {shouldShowAction(
                            "cancelApproval",
                            position.ruleStatus
                          ) && (
                            <DropdownMenuItem
                              onClick={() => handleCancelApproval(position)}
                              className="text-destructive focus:text-destructive"
                            >
                              <X className="mr-2 h-4 w-4" />
                              取消审批
                            </DropdownMenuItem>
                          )}
                          {shouldShowAction("publish", position.ruleStatus) && (
                            <DropdownMenuItem
                              onClick={() => handlePublish(position)}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              发布
                            </DropdownMenuItem>
                          )}
                          {shouldShowAction("unpublish", position.ruleStatus) && (
                            <DropdownMenuItem
                              onClick={() => handleUnpublish(position)}
                              className="text-destructive focus:text-destructive"
                            >
                              <X className="mr-2 h-4 w-4" />
                              取消发布
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* 分页 */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              共 {filteredPositions.length} 条记录
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
                上一页
              </Button>
              <Button variant="outline" size="sm" className="min-w-8">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                下一页
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 全局配置弹窗 - 查看和编辑合并 */}
      <LevelMappingDialog
        open={globalConfigDialogOpen}
        onOpenChange={setGlobalConfigDialogOpen}
        mapping={globalMapping}
        onSave={setGlobalMapping}
        title="配置全局等级映射"
        description="配置全局等级映射规则，所有岗位默认继承此配置"
      />

      {/* 确认弹窗 */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmDialog.title}</DialogTitle>
            <DialogDescription>{confirmDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setConfirmDialog((prev) => ({ ...prev, open: false }))
              }
            >
              取消
            </Button>
            <Button onClick={confirmDialog.action}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

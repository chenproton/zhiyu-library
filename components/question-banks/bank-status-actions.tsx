"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Send, 
  Undo2, 
  CheckCircle, 
  XCircle,
  Rocket,
  Eye,
  UserPlus,
  Copy,
} from "lucide-react"
import type { Status, StatusAction } from "@/lib/types"
import { canPerformAction } from "@/lib/types"

interface BankStatusActionsProps {
  status: Status
  onEdit?: () => void
  onDelete?: () => void
  onStatusChange: (action: StatusAction) => void
  onView?: () => void
  onInvite?: () => void
  onClone?: () => void
}

type ConfirmType = 'delete' | 'submit' | 'withdraw' | 'approve' | 'reject' | 'publish' | null

const confirmConfig: Record<Exclude<ConfirmType, null>, { title: string; description: string; variant: 'default' | 'destructive' }> = {
  delete: {
    title: "确认删除",
    description: "删除后将无法恢复，题库中的所有题目也会被删除。确定要删除吗？",
    variant: "destructive",
  },
  submit: {
    title: "提交审批",
    description: "提交后题库将进入审批流程，审批期间无法编辑。确定要提交吗？",
    variant: "default",
  },
  withdraw: {
    title: "撤回审批",
    description: "撤回后题库将回到未提交状态，可以继续编辑。确定要撤回吗？",
    variant: "default",
  },
  approve: {
    title: "审批通过",
    description: "通过后题库将进入待发布状态。确定要通过吗？",
    variant: "default",
  },
  reject: {
    title: "驳回审批",
    description: "驳回后题库将回到已驳回状态，需要修改后重新提交。确定要驳回吗？",
    variant: "destructive",
  },
  publish: {
    title: "发布题库",
    description: "发布后题库将对外可见，且无法再编辑。确定要发布吗？",
    variant: "default",
  },
}

export function BankStatusActions({
  status,
  onEdit,
  onDelete,
  onStatusChange,
  onView,
  onInvite,
  onClone,
}: BankStatusActionsProps) {
  const [confirmType, setConfirmType] = useState<ConfirmType>(null)

  const handleConfirm = () => {
    if (!confirmType) return

    switch (confirmType) {
      case 'delete':
        onDelete?.()
        break
      case 'submit':
        onStatusChange('submit')
        break
      case 'withdraw':
        onStatusChange('withdraw')
        break
      case 'approve':
        onStatusChange('approve')
        break
      case 'reject':
        onStatusChange('reject')
        break
      case 'publish':
        onStatusChange('publish')
        break
    }
    setConfirmType(null)
  }

  const canEdit = ['draft', 'unsubmitted', 'rejected'].includes(status)
  const canDelete = ['draft', 'unsubmitted', 'rejected'].includes(status)
  const canSubmit = canPerformAction(status, 'submit')
  const canWithdraw = canPerformAction(status, 'withdraw')
  const canApprove = canPerformAction(status, 'approve')
  const canReject = canPerformAction(status, 'reject')
  const canPublish = canPerformAction(status, 'publish')

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal />
            <span className="sr-only">操作菜单</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            {onView && (
              <DropdownMenuItem onClick={onView}>
                <Eye />
                查看详情
              </DropdownMenuItem>
            )}
            {onClone && (
              <DropdownMenuItem onClick={onClone}>
                <Copy />
                克隆
              </DropdownMenuItem>
            )}
            {canEdit && onEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Edit />
                编辑
              </DropdownMenuItem>
            )}
            {onInvite && (
              <DropdownMenuItem onClick={onInvite}>
                <UserPlus />
                邀请共建
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          
          {(canSubmit || canWithdraw || canApprove || canReject || canPublish) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {canSubmit && (
                  <DropdownMenuItem onClick={() => setConfirmType('submit')}>
                    <Send />
                    提交审批
                  </DropdownMenuItem>
                )}
                {canWithdraw && (
                  <DropdownMenuItem onClick={() => setConfirmType('withdraw')}>
                    <Undo2 />
                    撤回
                  </DropdownMenuItem>
                )}
                {canApprove && (
                  <DropdownMenuItem onClick={() => setConfirmType('approve')}>
                    <CheckCircle />
                    通过
                  </DropdownMenuItem>
                )}
                {canReject && (
                  <DropdownMenuItem onClick={() => setConfirmType('reject')} variant="destructive">
                    <XCircle />
                    驳回
                  </DropdownMenuItem>
                )}
                {canPublish && (
                  <DropdownMenuItem onClick={() => setConfirmType('publish')}>
                    <Rocket />
                    发布
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </>
          )}

          {canDelete && onDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setConfirmType('delete')} variant="destructive">
                  <Trash2 />
                  删除
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {confirmType && (
        <ConfirmDialog
          open={!!confirmType}
          onOpenChange={(open) => !open && setConfirmType(null)}
          title={confirmConfig[confirmType].title}
          description={confirmConfig[confirmType].description}
          variant={confirmConfig[confirmType].variant}
          onConfirm={handleConfirm}
        />
      )}
    </>
  )
}

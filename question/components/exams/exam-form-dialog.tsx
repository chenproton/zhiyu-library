"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import type { Exam, ExamFormData } from "@/lib/types"
import { mockUsers, mockDepartments, mockBatches } from "@/lib/mock-data"

interface ExamFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  exam?: Exam | null
  onSubmit: (data: ExamFormData) => void
}

export function ExamFormDialog({
  open,
  onOpenChange,
  exam,
  onSubmit,
}: ExamFormDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState(60)
  const [collaboratorIds, setCollaboratorIds] = useState<string[]>([])
  const [collaboratorDeptIds, setCollaboratorDeptIds] = useState<string[]>([])
  const [batchId, setBatchId] = useState<string>("")

  useEffect(() => {
    if (exam) {
      setName(exam.name)
      setDescription(exam.description)
      setDuration(exam.duration)
      setCollaboratorIds(exam.collaboratorIds || [])
      setCollaboratorDeptIds(exam.collaboratorDeptIds || [])
      setBatchId(exam.batchId || "")
    } else {
      setName("")
      setDescription("")
      setDuration(60)
      setCollaboratorIds([])
      setCollaboratorDeptIds([])
      setBatchId("")
    }
  }, [exam, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      duration,
      collaboratorIds: collaboratorIds.length > 0 ? collaboratorIds : undefined,
      collaboratorDeptIds: collaboratorDeptIds.length > 0 ? collaboratorDeptIds : undefined,
      batchId: batchId || undefined,
    })
    onOpenChange(false)
  }

  const addCollaborator = (userId: string) => {
    if (!collaboratorIds.includes(userId)) {
      setCollaboratorIds([...collaboratorIds, userId])
    }
  }

  const removeCollaborator = (userId: string) => {
    setCollaboratorIds(collaboratorIds.filter(id => id !== userId))
  }

  const addDepartment = (deptId: string) => {
    if (!collaboratorDeptIds.includes(deptId)) {
      setCollaboratorDeptIds([...collaboratorDeptIds, deptId])
    }
  }

  const removeDepartment = (deptId: string) => {
    setCollaboratorDeptIds(collaboratorDeptIds.filter(id => id !== deptId))
  }

  const getUserName = (id: string) => mockUsers.find(u => u.id === id)?.name || id
  const getDeptName = (id: string) => mockDepartments.find(d => d.id === id)?.name || id

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{exam ? "编辑试卷" : "新建试卷"}</DialogTitle>
          <DialogDescription>
            {exam ? "修改试卷的基本信息" : "创建一个新的试卷"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="max-h-[60vh] overflow-y-auto py-4">
            <Field>
              <FieldLabel htmlFor="name">试卷名称</FieldLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入试卷名称"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">试卷描述</FieldLabel>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请输入试卷描述（可选）"
                rows={3}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="duration">考试时长</FieldLabel>
              <FieldDescription>单位：分钟</FieldDescription>
              <Input
                id="duration"
                type="number"
                min={1}
                max={480}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
            </Field>
            <Field>
              <FieldLabel>共建人</FieldLabel>
              <FieldDescription>选择可以共同维护此试卷的用户</FieldDescription>
              <Select onValueChange={addCollaborator}>
                <SelectTrigger>
                  <SelectValue placeholder="选择共建人" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {mockUsers
                      .filter(u => !collaboratorIds.includes(u.id))
                      .map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.department})
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {collaboratorIds.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {collaboratorIds.map(id => (
                    <Badge key={id} variant="secondary" className="gap-1">
                      {getUserName(id)}
                      <button
                        type="button"
                        onClick={() => removeCollaborator(id)}
                        className="ml-1 rounded-full hover:bg-muted"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </Field>
            <Field>
              <FieldLabel>共建部门</FieldLabel>
              <FieldDescription>选择可以共同维护此试卷的部门</FieldDescription>
              <Select onValueChange={addDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="选择共建部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {mockDepartments
                      .filter(d => !collaboratorDeptIds.includes(d.id))
                      .map(dept => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {collaboratorDeptIds.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {collaboratorDeptIds.map(id => (
                    <Badge key={id} variant="secondary" className="gap-1">
                      {getDeptName(id)}
                      <button
                        type="button"
                        onClick={() => removeDepartment(id)}
                        className="ml-1 rounded-full hover:bg-muted"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </Field>
            <Field>
              <FieldLabel>所属批次</FieldLabel>
              <Select value={batchId || "none"} onValueChange={(v) => setBatchId(v === "none" ? "" : v)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择所属批次" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="none">不设置批次</SelectItem>
                    {mockBatches.map(batch => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            {exam && (
              <Field>
                <FieldLabel>当前版本号</FieldLabel>
                <div className="flex h-9 items-center rounded-md border bg-muted/50 px-3 text-sm">
                  {exam.version}
                </div>
              </Field>
            )}
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {exam ? "保存" : "创建"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

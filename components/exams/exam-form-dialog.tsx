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
import { X, ImageIcon, Upload } from "lucide-react"
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
  const [collaboratorIds, setCollaboratorIds] = useState<string[]>([])
  const [collaboratorDeptIds, setCollaboratorDeptIds] = useState<string[]>([])
  const [batchId, setBatchId] = useState<string>("")
  const [coverUrl, setCoverUrl] = useState<string>("")

  useEffect(() => {
    if (exam) {
      setName(exam.name)
      setDescription(exam.description)
      setCollaboratorIds(exam.collaboratorIds || [])
      setCollaboratorDeptIds(exam.collaboratorDeptIds || [])
      setBatchId(exam.batchId || "")
      setCoverUrl(exam.coverUrl || "")
    } else {
      setName("")
      setDescription("")
      setCollaboratorIds([])
      setCollaboratorDeptIds([])
      setBatchId("")
      setCoverUrl("")
    }
  }, [exam, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      duration: 60,
      coverUrl: coverUrl || undefined,
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
              <FieldLabel htmlFor="description">试卷简介</FieldLabel>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请输入试卷简介"
                rows={3}
              />
            </Field>
            <Field>
              <FieldLabel>封面图片</FieldLabel>
              <div className="flex items-center gap-4">
                {coverUrl ? (
                  <div className="relative">
                    <img src={coverUrl} alt="封面" className="h-20 w-32 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => setCoverUrl("")}
                      className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-destructive text-white"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex h-20 w-32 items-center justify-center rounded-lg border border-dashed bg-muted">
                    <ImageIcon className="size-6 text-muted-foreground" />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const urls = [
                      '/placeholder-logo.png',
                      '/placeholder.jpg',
                      '/placeholder.svg',
                    ]
                    setCoverUrl(urls[Math.floor(Math.random() * urls.length)])
                  }}
                >
                  <Upload className="mr-1 size-3.5" />
                  上传封面
                </Button>
              </div>
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

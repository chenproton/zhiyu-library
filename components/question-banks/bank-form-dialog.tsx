"use client"

import { useState, useEffect, useRef } from "react"
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { X, Upload, ImageIcon } from "lucide-react"
import type { QuestionBank, QuestionBankFormData } from "@/lib/types"
import { mockUsers, mockDepartments, mockBatches } from "@/lib/mock-data"

interface BankFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bank?: QuestionBank | null
  onSubmit: (data: QuestionBankFormData) => void
}

export function BankFormDialog({
  open,
  onOpenChange,
  bank,
  onSubmit,
}: BankFormDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [coverUrl, setCoverUrl] = useState<string>("")
  const [collaboratorIds, setCollaboratorIds] = useState<string[]>([])
  const [collaboratorDeptIds, setCollaboratorDeptIds] = useState<string[]>([])
  const [batchId, setBatchId] = useState<string>("")
  const [collaboratorTab, setCollaboratorTab] = useState<"user" | "dept">("user")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (bank) {
      setName(bank.name)
      setDescription(bank.description)
      setCoverUrl(bank.coverUrl || "")
      setCollaboratorIds(bank.collaboratorIds || [])
      setCollaboratorDeptIds(bank.collaboratorDeptIds || [])
      setBatchId(bank.batchId || "")
    } else {
      setName("")
      setDescription("")
      setCoverUrl("")
      setCollaboratorIds([])
      setCollaboratorDeptIds([])
      setBatchId("")
    }
  }, [bank, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      coverUrl: coverUrl || undefined,
      collaboratorIds: collaboratorIds.length > 0 ? collaboratorIds : undefined,
      collaboratorDeptIds: collaboratorDeptIds.length > 0 ? collaboratorDeptIds : undefined,
      batchId: batchId || undefined,
    })
    onOpenChange(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 检查文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("文件大小不能超过 5MB")
      return
    }

    // 检查文件类型
    if (!file.type.startsWith("image/")) {
      alert("请上传图片文件")
      return
    }

    // 创建预览 URL
    const url = URL.createObjectURL(file)
    setCoverUrl(url)
  }

  const removeCover = () => {
    setCoverUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
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
          <DialogTitle>{bank ? "编辑题库" : "新建题库"}</DialogTitle>
          <DialogDescription>
            {bank ? "修改题库的基本信息" : "创建一个新的题库来管理题目"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup className="max-h-[60vh] overflow-y-auto py-4">
            <Field>
              <FieldLabel htmlFor="name">题库名称</FieldLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入题库名称"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">题库描述</FieldLabel>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请输入题库描述（可选）"
                rows={3}
              />
            </Field>
            <Field>
              <FieldLabel>封面</FieldLabel>
              <FieldDescription>支持上传 5MB 以内的图片文件</FieldDescription>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {coverUrl ? (
                <div className="relative mt-2 w-full overflow-hidden rounded-lg border">
                  <img
                    src={coverUrl}
                    alt="封面预览"
                    className="h-32 w-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 size-6"
                    onClick={removeCover}
                  >
                    <X className="size-3" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-muted-foreground/50"
                >
                  <ImageIcon className="mb-2 size-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">点击上传封面</span>
                </div>
              )}
            </Field>
            <Field>
              <FieldLabel>共建人/共建部门</FieldLabel>
              <FieldDescription>选择可以共同维护此题库的用户或部门</FieldDescription>
              <Tabs value={collaboratorTab} onValueChange={(v) => setCollaboratorTab(v as "user" | "dept")} className="mt-2">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="user">按用户</TabsTrigger>
                  <TabsTrigger value="dept">按部门</TabsTrigger>
                </TabsList>
                <TabsContent value="user" className="mt-2">
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
                </TabsContent>
                <TabsContent value="dept" className="mt-2">
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
                </TabsContent>
              </Tabs>
              {(collaboratorIds.length > 0 || collaboratorDeptIds.length > 0) && (
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
                  {collaboratorDeptIds.map(id => (
                    <Badge key={id} variant="outline" className="gap-1">
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
            {bank && (
              <Field>
                <FieldLabel>当前版本号</FieldLabel>
                <div className="flex h-9 items-center rounded-md border bg-muted/50 px-3 text-sm">
                  {bank.version}
                </div>
              </Field>
            )}
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {bank ? "保存" : "创建"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

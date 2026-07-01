"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Upload,
  Plus,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useData } from "@/components/providers/data-provider"
import {
  RESOURCE_TYPE_LABELS,
  COLLEGES,
} from "@/lib/types"
import type { ResourceType } from "@/lib/types"

export default function UploadPage() {
  const router = useRouter()
  const { createResource } = useData()

  const [title, setTitle] = useState("")
  const [type, setType] = useState<ResourceType | "">("")
  const [content, setContent] = useState("")
  const [description, setDescription] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [fileUrl, setFileUrl] = useState("")

  const [venueCapacity, setVenueCapacity] = useState<number>(0)
  const [venueLocation, setVenueLocation] = useState("")
  const [venueFacilities, setVenueFacilities] = useState("")

  const [equipmentModel, setEquipmentModel] = useState("")
  const [equipmentSpec, setEquipmentSpec] = useState("")
  const [equipmentLocation, setEquipmentLocation] = useState("")
  const [equipmentManager, setEquipmentManager] = useState("")

  const [softwareVersion, setSoftwareVersion] = useState("")
  const [softwareEnv, setSoftwareEnv] = useState("")
  const [softwareLicense, setSoftwareLicense] = useState("")
  const [softwareDownloadUrl, setSoftwareDownloadUrl] = useState("")

  const [simulationPlatform, setSimulationPlatform] = useState("")
  const [simulationDomain, setSimulationDomain] = useState("")
  const [simulationInstructions, setSimulationInstructions] = useState("")

  const [linkUrl, setLinkUrl] = useState("")
  const [linkSource, setLinkSource] = useState("")

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const handleSubmit = () => {
    if (!title.trim() || !type || !content.trim()) return

    createResource({
      title: title.trim(),
      type,
      content: content.trim(),
      description: description.trim(),
      tags,
      fileUrl: fileUrl || undefined,
      venueCapacity: type === "venue" ? venueCapacity : undefined,
      venueLocation: type === "venue" ? venueLocation : undefined,
      venueFacilities: type === "venue" ? venueFacilities : undefined,
      equipmentModel: type === "equipment" ? equipmentModel : undefined,
      equipmentSpec: type === "equipment" ? equipmentSpec : undefined,
      equipmentLocation: type === "equipment" ? equipmentLocation : undefined,
      equipmentManager: type === "equipment" ? equipmentManager : undefined,
      softwareVersion: type === "software" ? softwareVersion : undefined,
      softwareEnv: type === "software" ? softwareEnv : undefined,
      softwareLicense: type === "software" ? softwareLicense : undefined,
      softwareDownloadUrl: type === "software" ? softwareDownloadUrl : undefined,
      simulationPlatform: type === "simulation" ? simulationPlatform : undefined,
      simulationDomain: type === "simulation" ? simulationDomain : undefined,
      simulationInstructions: type === "simulation" ? simulationInstructions : undefined,
      linkUrl: type === "link" ? linkUrl : undefined,
      linkSource: type === "link" ? linkSource : undefined,
    })

    router.push("/admin/my-uploads")
  }

  const resetForm = () => {
    setTitle("")
    setType("")
    setContent("")
    setDescription("")
    setTags([])
    setTagInput("")
    setFileUrl("")
    setVenueCapacity(0)
    setVenueLocation("")
    setVenueFacilities("")
    setEquipmentModel("")
    setEquipmentSpec("")
    setEquipmentLocation("")
    setEquipmentManager("")
    setSoftwareVersion("")
    setSoftwareEnv("")
    setSoftwareLicense("")
    setSoftwareDownloadUrl("")
    setSimulationPlatform("")
    setSimulationDomain("")
    setSimulationInstructions("")
    setLinkUrl("")
    setLinkSource("")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800 mb-1">资源上传</h1>
        <p className="text-sm text-gray-500">上传后需管理员审核通过方可在前台展示</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="space-y-2">
            <Label>
              资源标题 <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="请输入资源标题（≤50字）"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
            />
            <p className="text-xs text-gray-400 text-right">{title.length}/50</p>
          </div>

          <div className="space-y-2">
            <Label>
              资源类型 <span className="text-red-500">*</span>
            </Label>
            <Select value={type} onValueChange={(v) => setType(v as ResourceType)}>
              <SelectTrigger>
                <SelectValue placeholder="请选择资源类型" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(RESOURCE_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              资源内容 <span className="text-red-500">*</span>
            </Label>
            {type === "link" ? (
              <Input
                placeholder="请输入资源链接 URL"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            ) : type === "venue" ? (
              <Input
                placeholder="请输入场地名称"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            ) : type === "equipment" ? (
              <Input
                placeholder="请输入设备名称"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            ) : type === "software" ? (
              <Input
                placeholder="请输入软件名称"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            ) : type === "simulation" ? (
              <Input
                placeholder="请输入仿真资源路径"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            ) : (
              <div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="文件路径或 URL"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <Label className="text-xs text-gray-500 mb-1">文件上传（演示）</Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="size-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">点击或拖拽文件上传（演示用，不实际存储）</p>
                  </div>
                </div>
              </div>
            )}
            {type !== "" && type !== "link" && type !== "venue" && type !== "equipment" && type !== "software" && type !== "simulation" && (
              <div className="mt-2">
                <Label className="text-xs text-gray-500">文件路径</Label>
                <Input
                  placeholder="请输入文件存储路径"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>资源描述</Label>
            <Textarea
              placeholder="请输入资源描述（≤500字）"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
            />
            <p className="text-xs text-gray-400 text-right">{description.length}/500</p>
          </div>

          <div className="space-y-2">
            <Label>关键词标签（≤5个）</Label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="输入标签后按回车添加"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                disabled={tags.length >= 5}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTag}
                disabled={tags.length >= 5 || !tagInput.trim()}
              >
                <Plus className="size-4 mr-1" />
                添加
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)}>
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {type === "venue" && (
            <div className="border-t pt-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">场地信息</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>容纳人数</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={venueCapacity || ""}
                    onChange={(e) => setVenueCapacity(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>位置</Label>
                  <Input
                    placeholder="如：主教学楼A101"
                    value={venueLocation}
                    onChange={(e) => setVenueLocation(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>配套设施</Label>
                <Input
                  placeholder="如：投影仪、音响系统"
                  value={venueFacilities}
                  onChange={(e) => setVenueFacilities(e.target.value)}
                />
              </div>
            </div>
          )}

          {type === "equipment" && (
            <div className="border-t pt-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">设备信息</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>型号</Label>
                  <Input
                    placeholder="如：Dell PowerEdge R750"
                    value={equipmentModel}
                    onChange={(e) => setEquipmentModel(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>规格</Label>
                  <Input
                    placeholder="如：256核 / 1TB内存"
                    value={equipmentSpec}
                    onChange={(e) => setEquipmentSpec(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>存放地点</Label>
                  <Input
                    placeholder="如：计算机中心3楼"
                    value={equipmentLocation}
                    onChange={(e) => setEquipmentLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>负责人</Label>
                  <Input
                    placeholder="如：张教授"
                    value={equipmentManager}
                    onChange={(e) => setEquipmentManager(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {type === "software" && (
            <div className="border-t pt-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">软件信息</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>版本</Label>
                  <Input
                    placeholder="如：R2024a"
                    value={softwareVersion}
                    onChange={(e) => setSoftwareVersion(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>运行环境</Label>
                  <Input
                    placeholder="如：Windows 10/11"
                    value={softwareEnv}
                    onChange={(e) => setSoftwareEnv(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>授权方式</Label>
                <Input
                  placeholder="如：Academic Campus License"
                  value={softwareLicense}
                  onChange={(e) => setSoftwareLicense(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>下载地址</Label>
                <Input
                  placeholder="https://..."
                  value={softwareDownloadUrl}
                  onChange={(e) => setSoftwareDownloadUrl(e.target.value)}
                />
              </div>
            </div>
          )}

          {type === "simulation" && (
            <div className="border-t pt-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">仿真信息</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>仿真平台</Label>
                  <Input
                    placeholder="如：Web-based SPICE"
                    value={simulationPlatform}
                    onChange={(e) => setSimulationPlatform(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>学科领域</Label>
                  <Input
                    placeholder="如：电子电路"
                    value={simulationDomain}
                    onChange={(e) => setSimulationDomain(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>操作说明</Label>
                <Textarea
                  placeholder="请描述操作步骤..."
                  value={simulationInstructions}
                  onChange={(e) => setSimulationInstructions(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}

          {type === "link" && (
            <div className="border-t pt-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">链接信息</h3>
              <div className="space-y-1.5">
                <Label>URL</Label>
                <Input
                  placeholder="https://..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>来源网站</Label>
                <Input
                  placeholder="如：中国大学MOOC"
                  value={linkSource}
                  onChange={(e) => setLinkSource(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="border-t pt-4 flex items-center gap-3">
            <Button
              onClick={handleSubmit}
              disabled={!title.trim() || !type || !content.trim()}
            >
              <Upload className="size-4 mr-1" />
              提交资源
            </Button>
            <Button variant="outline" onClick={resetForm}>
              重置表单
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

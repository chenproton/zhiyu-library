"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { X, ChevronDown, Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useData } from "@/components/providers/data-provider"

interface TagSelectorProps {
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
}

export function TagSelector({ selected, onChange, placeholder = "选择或搜索标签..." }: TagSelectorProps) {
  const { tagCategories, tagDefinitions, getTagColor, addTag } = useData()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [newTagName, setNewTagName] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return tagCategories.map(cat => ({
      ...cat,
      tags: tagDefinitions.filter(t => t.categoryId === cat.id),
    })).filter(c => c.tags.length > 0)

    const q = search.toLowerCase()
    return tagCategories.map(cat => ({
      ...cat,
      tags: tagDefinitions.filter(t =>
        t.categoryId === cat.id && t.name.toLowerCase().includes(q)
      ),
    })).filter(c => c.tags.length > 0)
  }, [tagCategories, tagDefinitions, search])

  const handleToggleTag = (tagName: string) => {
    if (selected.includes(tagName)) {
      onChange(selected.filter(t => t !== tagName))
    } else {
      onChange([...selected, tagName])
    }
  }

  const handleRemoveTag = (tagName: string) => {
    onChange(selected.filter(t => t !== tagName))
  }

  const handleAddNewTag = () => {
    const name = newTagName.trim()
    if (!name || selected.includes(name)) return
    const exists = tagDefinitions.some(t => t.name === name)
    if (!exists) {
      const customCat = tagCategories.find(c => c.name === '自定义')
      if (customCat) {
        addTag(name, customCat.id)
      }
    }
    onChange([...selected, name])
    setNewTagName("")
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex items-center flex-wrap gap-1.5 min-h-[40px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        {selected.length === 0 && (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        {selected.map(tag => (
          <Badge
            key={tag}
            variant="secondary"
            className="gap-1 pr-1 cursor-default"
            style={{
              backgroundColor: `${getTagColor(tag)}15`,
              color: getTagColor(tag),
              borderColor: `${getTagColor(tag)}30`,
            }}
          >
            {tag}
            <button
              onClick={(e) => { e.stopPropagation(); handleRemoveTag(tag) }}
              className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 transition-colors"
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
        <ChevronDown className="size-4 text-muted-foreground ml-auto shrink-0" />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-popover border rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="搜索标签..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs border-0 shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          <ScrollArea className="max-h-[220px]">
            <div className="p-2 space-y-3">
              {filteredCategories.map(cat => (
                <div key={cat.id}>
                  <div className="text-[10px] font-medium text-muted-foreground uppercase px-2 mb-1">
                    {cat.name}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cat.tags.map(tag => {
                      const isSelected = selected.includes(tag.name)
                      return (
                        <button
                          key={tag.id}
                          onClick={(e) => { e.stopPropagation(); handleToggleTag(tag.name) }}
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs border transition-colors ${
                            isSelected
                              ? 'border-transparent text-white'
                              : 'border-border hover:border-primary/40 text-foreground'
                          }`}
                          style={isSelected ? { backgroundColor: tag.color } : {}}
                        >
                          {tag.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
              {filteredCategories.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-4">
                  未找到匹配的标签
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-2">
            <div className="flex items-center gap-1.5">
              <Input
                placeholder="输入新标签名称..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="h-8 text-xs border-0 shadow-none focus-visible:ring-0 flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddNewTag()
                  }
                }}
              />
              <button
                onClick={(e) => { e.stopPropagation(); handleAddNewTag() }}
                disabled={!newTagName.trim()}
                className="shrink-0 p-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
